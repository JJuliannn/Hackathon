import os
import uuid
import json
from datetime import datetime, timedelta

from dotenv import load_dotenv
load_dotenv()

from flask import Flask, request, jsonify
from flask_cors import CORS

from db import get_db
from ai_engine import analyze_patient_message, analyze_no_response, generate_followup_message
from kapso_client import send_reminder, send_waitlist_offer, send_post_appointment

app = Flask(__name__)
CORS(app)

CLINIC_ID = os.getenv("CLINIC_ID", "clinic_demo_001")


# ──────────────────────────────────────
# HEALTH CHECK
# ──────────────────────────────────────

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "SlotRecovery AI Backend"})


# ──────────────────────────────────────
# DASHBOARD — KPIs + Appointments + Alerts
# ──────────────────────────────────────

@app.route("/api/dashboard", methods=["GET"])
def dashboard():
    db = get_db()

    today = datetime.now().strftime("%Y-%m-%d")
    tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")

    # KPIs del mes actual
    month_start = datetime.now().replace(day=1).strftime("%Y-%m-%d")

    total = db.execute(
        "SELECT COUNT(*) FROM appointments WHERE clinic_id=? AND scheduled_at >= ?",
        (CLINIC_ID, month_start),
    ).fetchone()[0]

    cancelled = db.execute(
        "SELECT COUNT(*) FROM appointments WHERE clinic_id=? AND scheduled_at >= ? AND status IN ('cancelled','no_show')",
        (CLINIC_ID, month_start),
    ).fetchone()[0]

    recovered = db.execute(
        "SELECT COUNT(*) FROM appointments WHERE clinic_id=? AND scheduled_at >= ? AND status='recovered'",
        (CLINIC_ID, month_start),
    ).fetchone()[0]

    revenue_recovered = db.execute(
        "SELECT COALESCE(SUM(price), 0) FROM appointments WHERE clinic_id=? AND scheduled_at >= ? AND status='recovered'",
        (CLINIC_ID, month_start),
    ).fetchone()[0]

    avg_recovery = db.execute(
        "SELECT COALESCE(AVG(time_to_recovery_min), 0) FROM recovery_events WHERE clinic_id=? AND status='recovered' AND started_at >= ?",
        (CLINIC_ID, month_start),
    ).fetchone()[0]

    no_show_rate = (cancelled / total * 100) if total > 0 else 0
    original_no_show_rate = 18.0

    kpis = {
        "revenue_recovered": revenue_recovered,
        "appointments_saved": recovered,
        "appointments_cancelled": cancelled,
        "total_appointments": total,
        "no_show_rate": round(no_show_rate, 1),
        "original_no_show_rate": original_no_show_rate,
        "avg_recovery_time_min": round(avg_recovery, 0),
    }

    # Citas de las proximas 24h
    appointments = []
    rows = db.execute(
        """SELECT a.id, a.scheduled_at, a.procedure_name, a.price, a.status, a.cancellation_risk,
                  a.last_patient_message, p.first_name, p.last_name
           FROM appointments a
           JOIN patients p ON a.patient_id = p.id
           WHERE a.clinic_id=? AND DATE(a.scheduled_at) IN (?, ?)
           ORDER BY a.scheduled_at""",
        (CLINIC_ID, today, tomorrow),
    ).fetchall()
    for r in rows:
        appointments.append({
            "id": r["id"],
            "hour": int(r["scheduled_at"].split("T")[1].split(":")[0]) if "T" in r["scheduled_at"] else 8,
            "name": f"{r['first_name']} {r['last_name'][0]}.",
            "procedure": r["procedure_name"],
            "value": r["price"],
            "status": r["status"],
            "risk": r["cancellation_risk"],
            "note": r["last_patient_message"],
        })

    # Alertas activas
    alerts = []
    alert_rows = db.execute(
        """SELECT a.id, a.scheduled_at, a.procedure_name, a.price, a.cancellation_risk,
                  a.last_patient_message, a.status, p.first_name, p.last_name
           FROM appointments a
           JOIN patients p ON a.patient_id = p.id
           WHERE a.clinic_id=? AND a.status IN ('at_risk','scheduled')
             AND a.cancellation_risk >= 50
             AND DATE(a.scheduled_at) IN (?, ?)
           ORDER BY a.cancellation_risk DESC""",
        (CLINIC_ID, today, tomorrow),
    ).fetchall()
    for r in alert_rows:
        alerts.append({
            "id": r["id"],
            "level": "danger" if r["cancellation_risk"] >= 75 else "warning",
            "patient": f"{r['first_name']} {r['last_name'][0]}.",
            "procedure": r["procedure_name"],
            "value": r["price"],
            "when": r["scheduled_at"],
            "reason": r["last_patient_message"] or "Sin respuesta",
            "risk": r["cancellation_risk"],
            "cta": "Activar Lista de Espera" if r["cancellation_risk"] >= 75 else "Ver Análisis",
        })

    db.close()
    return jsonify({"kpis": kpis, "appointments": appointments, "alerts": alerts})


# ──────────────────────────────────────
# SEMANTIC ANALYSIS — Analizar mensaje de paciente
# ──────────────────────────────────────

@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.json
    message = data.get("message", "")
    appointment_id = data.get("appointment_id")
    hours_without_reply = data.get("hours_without_reply")

    db = get_db()

    patient_history = None
    if appointment_id:
        row = db.execute(
            """SELECT p.total_appointments, p.total_cancellations, p.no_show_rate
               FROM appointments a JOIN patients p ON a.patient_id = p.id
               WHERE a.id = ?""",
            (appointment_id,),
        ).fetchone()
        if row:
            patient_history = dict(row)

    if message:
        try:
            result = analyze_patient_message(message, patient_history)
        except Exception as e:
            print(f"[AI Error] {e}")
            result = analyze_patient_message(message, patient_history)
    elif hours_without_reply is not None:
        result = analyze_no_response(int(hours_without_reply), patient_history)
    else:
        db.close()
        return jsonify({"error": "Se requiere 'message' o 'hours_without_reply'"}), 400

    analysis_id = str(uuid.uuid4())
    if appointment_id:
        db.execute(
            """INSERT INTO semantic_analyses (id, appointment_id, clinic_id, message_type, patient_message,
                 hours_without_reply, risk_score, risk_level, classification, detected_signals,
                 recommended_action, model_used)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                analysis_id,
                appointment_id,
                CLINIC_ID,
                "patient_reply" if message else "no_response",
                message,
                hours_without_reply,
                result["risk_score"],
                result["risk_level"],
                result.get("classification"),
                json.dumps(result.get("detected_signals", []), ensure_ascii=False),
                result.get("recommended_action"),
                "gemini-2.0-flash",
            ),
        )

    if appointment_id:
        risk = result["risk_score"]
        status = "confirmed" if risk < 30 else "at_risk" if risk < 85 else "cancelled"
        db.execute(
            "UPDATE appointments SET cancellation_risk=?, status=?, risk_updated_at=?, last_patient_message=? WHERE id=?",
            (risk, status, datetime.now().isoformat(), message, appointment_id),
        )

    db.commit()
    db.close()

    return jsonify({"analysis_id": analysis_id, **result})


# ──────────────────────────────────────
# KAPSO WEBHOOK — Recibe estado de cita desde Kapso
# ──────────────────────────────────────

@app.route("/api/kapso/citas/estado", methods=["POST"])
def kapso_appointment_status():
    secret = request.headers.get("Authorization", "")
    expected = f"Bearer {os.getenv('KAPSO_WEBHOOK_SECRET', '')}"
    if secret != expected and os.getenv("KAPSO_WEBHOOK_SECRET"):
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    cita_id = data.get("cita_id")
    estado = data.get("estado")
    respuesta_texto = data.get("respuesta_texto", "")

    if not cita_id or not estado:
        return jsonify({"error": "Missing cita_id or estado"}), 400

    db = get_db()

    if estado == "confirmado":
        db.execute(
            "UPDATE appointments SET status='confirmed', cancellation_risk=5, last_patient_message=? WHERE id=?",
            (respuesta_texto, cita_id),
        )
    elif estado == "cancelado":
        db.execute(
            """UPDATE appointments SET status='cancelled', cancellation_risk=100,
               cancelled_at=?, cancellation_reason=?, last_patient_message=? WHERE id=?""",
            (datetime.now().isoformat(), respuesta_texto, respuesta_texto, cita_id),
        )
        _start_recovery(db, cita_id)

    db.commit()
    db.close()

    return jsonify({"ok": True, "cita_id": cita_id, "estado_guardado": estado})


def _start_recovery(db, appointment_id: str):
    apt = db.execute(
        "SELECT * FROM appointments WHERE id=?", (appointment_id,)
    ).fetchone()
    if not apt:
        return

    recovery_id = str(uuid.uuid4())
    db.execute(
        """INSERT INTO recovery_events (id, clinic_id, appointment_id, slot_value, candidates_notified)
           VALUES (?, ?, ?, ?, 0)""",
        (recovery_id, apt["clinic_id"], appointment_id, apt["price"]),
    )

    candidates = db.execute(
        """SELECT w.id, w.patient_id, p.first_name, p.phone
           FROM waitlist_entries w
           JOIN patients p ON w.patient_id = p.id
           WHERE w.clinic_id=? AND w.procedure_name=? AND w.status='active'
           ORDER BY w.priority_score DESC, w.added_at ASC
           LIMIT 3""",
        (apt["clinic_id"], apt["procedure_name"]),
    ).fetchall()

    hour = apt["scheduled_at"].split("T")[1][:5] if "T" in apt["scheduled_at"] else "9:00"

    for c in candidates:
        db.execute("UPDATE waitlist_entries SET status='notified', notified_at=? WHERE id=?",
                   (datetime.now().isoformat(), c["id"]))
        send_waitlist_offer(c["phone"] or "", c["first_name"], hour, apt["procedure_name"], appointment_id)

    db.execute("UPDATE recovery_events SET candidates_notified=? WHERE id=?",
               (len(candidates), recovery_id))


# ──────────────────────────────────────
# KAPSO WEBHOOK — Respuesta de lista de espera
# ──────────────────────────────────────

@app.route("/api/kapso/waitlist/response", methods=["POST"])
def kapso_waitlist_response():
    data = request.json
    cita_id = data.get("cita_id")
    telefono = data.get("telefono")
    acepta = data.get("acepta", False)

    db = get_db()

    if acepta:
        wl = db.execute(
            """SELECT w.id, w.patient_id FROM waitlist_entries w
               JOIN patients p ON w.patient_id = p.id
               WHERE p.phone=? AND w.status='notified'
               ORDER BY w.notified_at DESC LIMIT 1""",
            (telefono,),
        ).fetchone()

        if wl:
            db.execute("UPDATE waitlist_entries SET status='accepted', response_at=?, assigned_appointment_id=? WHERE id=?",
                       (datetime.now().isoformat(), cita_id, wl["id"]))
            db.execute("UPDATE appointments SET status='recovered', recovered_from_waitlist=1, patient_id=? WHERE id=?",
                       (wl["patient_id"], cita_id))

            recovery = db.execute(
                "SELECT id, started_at FROM recovery_events WHERE appointment_id=? AND status='in_progress'",
                (cita_id,),
            ).fetchone()
            if recovery:
                started = datetime.fromisoformat(recovery["started_at"])
                minutes = int((datetime.now() - started).total_seconds() / 60)
                db.execute(
                    """UPDATE recovery_events SET status='recovered', recovered_at=?,
                       time_to_recovery_min=?, winning_patient_id=?, winning_waitlist_id=? WHERE id=?""",
                    (datetime.now().isoformat(), minutes, wl["patient_id"], wl["id"], recovery["id"]),
                )

    db.commit()
    db.close()
    return jsonify({"ok": True})


# ──────────────────────────────────────
# POST-CITA — Verificar asistencia y generar seguimiento
# ──────────────────────────────────────

@app.route("/api/post-appointment/verify", methods=["POST"])
def verify_attendance():
    data = request.json
    appointment_id = data.get("appointment_id")
    attended = data.get("attended", True)

    db = get_db()
    apt = db.execute("SELECT * FROM appointments WHERE id=?", (appointment_id,)).fetchone()
    if not apt:
        db.close()
        return jsonify({"error": "Appointment not found"}), 404

    followup_id = str(uuid.uuid4())
    db.execute(
        """INSERT INTO post_appointment_followups (id, appointment_id, patient_id, clinic_id, attended, verified_at)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (followup_id, appointment_id, apt["patient_id"], CLINIC_ID, 1 if attended else 0, datetime.now().isoformat()),
    )

    if attended:
        db.execute("UPDATE appointments SET status='completed', completed_at=?, amount_billed=? WHERE id=?",
                   (datetime.now().isoformat(), apt["price"], appointment_id))

        if apt["recovered_from_waitlist"]:
            commission_amount = apt["price"] * 0.05
            db.execute(
                """INSERT INTO commissions (id, clinic_id, appointment_id, treatment_amount, commission_amount)
                   VALUES (?, ?, ?, ?, ?)""",
                (str(uuid.uuid4()), CLINIC_ID, appointment_id, apt["price"], commission_amount),
            )

        patient = db.execute("SELECT * FROM patients WHERE id=?", (apt["patient_id"],)).fetchone()
        if patient and patient["phone"]:
            send_post_appointment(patient["phone"], patient["first_name"], apt["procedure_name"], appointment_id)

    db.commit()
    db.close()
    return jsonify({"ok": True, "followup_id": followup_id, "attended": attended})


@app.route("/api/post-appointment/followup-reply", methods=["POST"])
def followup_reply():
    data = request.json
    appointment_id = data.get("appointment_id")
    patient_response = data.get("patient_response", "")

    db = get_db()
    apt = db.execute(
        """SELECT a.procedure_name, p.first_name FROM appointments a
           JOIN patients p ON a.patient_id = p.id WHERE a.id=?""",
        (appointment_id,),
    ).fetchone()

    if not apt:
        db.close()
        return jsonify({"error": "Appointment not found"}), 404

    result = generate_followup_message(apt["first_name"], apt["procedure_name"], patient_response)

    db.execute(
        """UPDATE post_appointment_followups
           SET patient_response=?, response_sentiment=?, medical_alert_sent=?
           WHERE appointment_id=?""",
        (patient_response, result.get("sentiment"), 1 if result.get("medical_alert") else 0, appointment_id),
    )

    db.commit()
    db.close()
    return jsonify(result)


# ──────────────────────────────────────
# TRIGGER — Disparar recordatorios (zona de peligro)
# ──────────────────────────────────────

@app.route("/api/trigger-reminders", methods=["POST"])
def trigger_reminders():
    hours_ahead = request.json.get("hours_ahead", 48) if request.json else 48
    db = get_db()

    window = datetime.now() + timedelta(hours=hours_ahead)
    rows = db.execute(
        """SELECT a.id, a.scheduled_at, a.procedure_name, p.first_name, p.phone
           FROM appointments a
           JOIN patients p ON a.patient_id = p.id
           WHERE a.clinic_id=? AND a.status='scheduled'
             AND a.confirmation_sent_at IS NULL
             AND a.scheduled_at <= ?
             AND a.scheduled_at > datetime('now')""",
        (CLINIC_ID, window.isoformat()),
    ).fetchall()

    sent = 0
    for r in rows:
        scheduled = r["scheduled_at"]
        day = scheduled.split("T")[0] if "T" in scheduled else scheduled
        hour = scheduled.split("T")[1][:5] if "T" in scheduled else "9:00"

        send_reminder(r["phone"] or "", r["first_name"], day, hour, r["procedure_name"], r["id"])
        db.execute("UPDATE appointments SET confirmation_sent_at=? WHERE id=?",
                   (datetime.now().isoformat(), r["id"]))
        sent += 1

    db.commit()
    db.close()
    return jsonify({"ok": True, "reminders_sent": sent})


# ──────────────────────────────────────
# WAITLIST — CRUD
# ──────────────────────────────────────

@app.route("/api/waitlist", methods=["GET"])
def get_waitlist():
    db = get_db()
    rows = db.execute(
        """SELECT w.*, p.first_name, p.last_name, p.phone
           FROM waitlist_entries w
           JOIN patients p ON w.patient_id = p.id
           WHERE w.clinic_id=? AND w.status='active'
           ORDER BY w.priority_score DESC, w.added_at ASC""",
        (CLINIC_ID,),
    ).fetchall()
    db.close()
    return jsonify([dict(r) for r in rows])


# ──────────────────────────────────────
# COMMISSIONS
# ──────────────────────────────────────

@app.route("/api/commissions", methods=["GET"])
def get_commissions():
    db = get_db()
    rows = db.execute(
        """SELECT c.*, a.procedure_name, p.first_name, p.last_name
           FROM commissions c
           JOIN appointments a ON c.appointment_id = a.id
           JOIN patients p ON a.patient_id = p.id
           WHERE c.clinic_id=?
           ORDER BY c.earned_at DESC""",
        (CLINIC_ID,),
    ).fetchall()
    db.close()
    return jsonify([dict(r) for r in rows])


# ──────────────────────────────────────
# PROJECTIONS (static for demo)
# ──────────────────────────────────────

@app.route("/api/projections", methods=["GET"])
def projections():
    data = [
        {"month": "Mes 1", "clinics": 5, "revenue": 1395},
        {"month": "Mes 2", "clinics": 10, "revenue": 2790},
        {"month": "Mes 3", "clinics": 15, "revenue": 4185},
        {"month": "Mes 4", "clinics": 25, "revenue": 7000},
        {"month": "Mes 5", "clinics": 40, "revenue": 11000},
        {"month": "Mes 6", "clinics": 60, "revenue": 16740},
        {"month": "Mes 7", "clinics": 80, "revenue": 22000},
        {"month": "Mes 8", "clinics": 100, "revenue": 28000},
        {"month": "Mes 9", "clinics": 120, "revenue": 34000},
        {"month": "Mes 10", "clinics": 150, "revenue": 42000},
        {"month": "Mes 11", "clinics": 175, "revenue": 49000},
        {"month": "Mes 12", "clinics": 200, "revenue": 55800},
    ]
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
