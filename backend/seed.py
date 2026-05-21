"""Seed the database with demo data for the hackathon presentation."""
import sqlite3
import uuid
import os
from datetime import datetime, timedelta

DB_PATH = os.getenv("DB_PATH", "../slotrecovery.sqlite")


def uid():
    return str(uuid.uuid4())


def seed():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")
    c = conn.cursor()

    clinic_id = "clinic_demo_001"
    tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")

    # ── Clinic ──
    c.execute("PRAGMA foreign_keys = OFF")
    for table in ["commissions", "post_appointment_followups", "recovery_events",
                  "notifications", "semantic_analyses", "waitlist_entries",
                  "kpi_snapshots", "appointments", "procedures", "patients", "clinics"]:
        c.execute(f"DELETE FROM {table}")
    c.execute("PRAGMA foreign_keys = ON")

    c.execute(
        """INSERT INTO clinics (id, name, email, phone, plan, owner_name, address, city)
           VALUES (?, 'Clínica Bella', 'info@clinicabella.cr', '+50688001234', 'premium',
                   'Dra. Gabriela Montero', 'Escazú, San Rafael', 'San José')""",
        (clinic_id,),
    )

    # ── Procedures ──
    procs = [
        (uid(), clinic_id, "Botox", "Toxina Botulínica", 45, 450),
        (uid(), clinic_id, "Ácido Hialurónico", "Rellenos", 60, 380),
        (uid(), clinic_id, "Hilos Tensores", "Lifting", 90, 600),
        (uid(), clinic_id, "Láser Facial", "Láser", 40, 350),
        (uid(), clinic_id, "Peeling Químico", "Facial", 30, 200),
    ]
    for p in procs:
        c.execute("INSERT INTO procedures (id, clinic_id, name, category, duration_min, base_price) VALUES (?,?,?,?,?,?)", p)

    # ── Patients ──
    patients = [
        ("pat_maria", clinic_id, "María", "López", "+50688110001", "maria@email.com", 8, 1, 0.125),
        ("pat_ana", clinic_id, "Ana", "Ramírez", "+50688110002", "ana@email.com", 5, 2, 0.4),
        ("pat_carlos", clinic_id, "Carlos", "Mendoza", "+50688110003", "carlos@email.com", 3, 0, 0.0),
        ("pat_laura", clinic_id, "Laura", "Solano", "+50688110004", "laura@email.com", 12, 1, 0.083),
        ("pat_patricia", clinic_id, "Patricia", "Vargas", "+50688110005", "patricia@email.com", 4, 1, 0.25),
        ("pat_valentina", clinic_id, "Valentina", "Mora", "+50688110006", "valentina@email.com", 2, 0, 0.0),
        ("pat_sofia", clinic_id, "Sofía", "Rojas", "+50688110007", "sofia@email.com", 1, 0, 0.0),
        ("pat_andrea", clinic_id, "Andrea", "Lizano", "+50688110008", "andrea@email.com", 0, 0, 0.0),
    ]
    for p in patients:
        c.execute(
            """INSERT INTO patients (id, clinic_id, first_name, last_name, phone, email,
               total_appointments, total_cancellations, no_show_rate)
               VALUES (?,?,?,?,?,?,?,?,?)""",
            p,
        )

    # ── Appointments (tomorrow) ──
    appts = [
        ("apt_01", clinic_id, "pat_maria", "Botox", f"{tomorrow}T08:00:00", 450, "confirmed", 5),
        ("apt_02", clinic_id, "pat_ana", "Ácido Hialurónico", f"{tomorrow}T09:00:00", 380, "at_risk", 85),
        ("apt_03", clinic_id, "pat_carlos", "Botox", f"{tomorrow}T10:00:00", 450, "cancelled", 100),
        ("apt_04", clinic_id, "pat_carlos", "Botox", f"{tomorrow}T11:00:00", 450, "recovered", 0),
        ("apt_05", clinic_id, "pat_laura", "Hilos Tensores", f"{tomorrow}T12:00:00", 600, "confirmed", 10),
        ("apt_06", clinic_id, "pat_patricia", "Láser Facial", f"{tomorrow}T14:00:00", 350, "at_risk", 65),
    ]
    for a in appts:
        c.execute(
            """INSERT INTO appointments (id, clinic_id, patient_id, procedure_name, scheduled_at, price, status, cancellation_risk)
               VALUES (?,?,?,?,?,?,?,?)""",
            a,
        )

    # Mark apt_03 as cancelled with details
    c.execute(
        """UPDATE appointments SET cancelled_at=?, cancellation_reason='Viaje de trabajo',
           last_patient_message='Me salió un viaje de trabajo de última hora'
           WHERE id='apt_03'""",
        (datetime.now().isoformat(),),
    )

    # Mark apt_02 with no-response
    c.execute(
        """UPDATE appointments SET last_patient_message='Sin respuesta hace 6h',
           confirmation_sent_at=? WHERE id='apt_02'""",
        ((datetime.now() - timedelta(hours=6)).isoformat(),),
    )

    # Mark apt_04 as recovered
    c.execute("UPDATE appointments SET recovered_from_waitlist=1, recovery_time_min=7 WHERE id='apt_04'")

    # Mark apt_06 with doubtful response
    c.execute(
        "UPDATE appointments SET last_patient_message='Mmm no sé, tal vez llego un poco tarde, es que tengo algo antes' WHERE id='apt_06'"
    )

    # ── Recovery event for apt_04 ──
    c.execute(
        """INSERT INTO recovery_events (id, clinic_id, appointment_id, status, recovered_at, time_to_recovery_min,
           candidates_notified, winning_patient_id, slot_value)
           VALUES (?, ?, 'apt_04', 'recovered', ?, 7, 3, 'pat_carlos', 450)""",
        (uid(), clinic_id, datetime.now().isoformat()),
    )

    # ── Waitlist entries ──
    waitlist = [
        (uid(), clinic_id, "pat_valentina", "Botox", "active", 80, 14),
        (uid(), clinic_id, "pat_sofia", "Ácido Hialurónico", "active", 60, 7),
        (uid(), clinic_id, "pat_andrea", "Botox", "active", 40, 3),
    ]
    for w in waitlist:
        c.execute(
            """INSERT INTO waitlist_entries (id, clinic_id, patient_id, procedure_name, status, priority_score, days_waiting)
               VALUES (?,?,?,?,?,?,?)""",
            w,
        )

    # ── Commission for recovered appointment ──
    c.execute(
        """INSERT INTO commissions (id, clinic_id, appointment_id, treatment_amount, commission_rate, commission_amount, status)
           VALUES (?, ?, 'apt_04', 450, 0.05, 22.50, 'pending')""",
        (uid(), clinic_id),
    )

    # ── Some historical data for KPIs ──
    for day_offset in range(1, 15):
        d = (datetime.now() - timedelta(days=day_offset)).strftime("%Y-%m-%d")
        for i in range(6):
            apt_id = uid()
            status = ["completed", "completed", "completed", "completed", "recovered", "cancelled"][i]
            price = [450, 380, 600, 350, 450, 380][i]
            pat = ["pat_maria", "pat_ana", "pat_laura", "pat_patricia", "pat_carlos", "pat_ana"][i]
            c.execute(
                """INSERT INTO appointments (id, clinic_id, patient_id, procedure_name, scheduled_at, price, status,
                   cancellation_risk, recovered_from_waitlist)
                   VALUES (?,?,?,?,?,?,?,?,?)""",
                (apt_id, clinic_id, pat, "Botox", f"{d}T{8+i}:00:00", price, status, 0, 1 if status == "recovered" else 0),
            )
            if status == "recovered":
                c.execute(
                    """INSERT INTO commissions (id, clinic_id, appointment_id, treatment_amount, commission_rate, commission_amount, status)
                       VALUES (?, ?, ?, ?, 0.05, ?, 'paid')""",
                    (uid(), clinic_id, apt_id, price, price * 0.05),
                )

    conn.commit()
    conn.close()
    print("Database seeded successfully!")
    print(f"  Clinic: Clínica Bella ({clinic_id})")
    print(f"  Patients: {len(patients)}")
    print(f"  Tomorrow's appointments: {len(appts)}")
    print(f"  Waitlist entries: {len(waitlist)}")
    print(f"  Historical days: 14 (6 appointments/day)")


if __name__ == "__main__":
    seed()
