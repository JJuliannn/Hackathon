import os
import json
import time
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "gemini-2.0-flash"


def _call_gemini(prompt: str, temperature: float = 0, retries: int = 2) -> dict:
    for attempt in range(retries + 1):
        try:
            response = client.models.generate_content(
                model=MODEL,
                contents=prompt,
                config={
                    "temperature": temperature,
                    "response_mime_type": "application/json",
                },
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"[Gemini] Attempt {attempt+1} failed: {e}")
            if attempt < retries:
                time.sleep(3)
    return None


def analyze_patient_message(patient_message: str, patient_history: dict | None = None) -> dict:
    history_context = ""
    if patient_history:
        history_context = f"""
Historial del paciente:
- Citas previas: {patient_history.get('total_appointments', 0)}
- Cancelaciones previas: {patient_history.get('total_cancellations', 0)}
- Tasa de no-show: {patient_history.get('no_show_rate', 0):.0%}
"""

    prompt = f"""Eres un analizador semantico especializado en detectar riesgo de cancelacion de citas medicas esteticas.

Analiza el siguiente mensaje de un paciente y determina la probabilidad de que cancele su cita.

{history_context}

Mensaje del paciente: "{patient_message}"

Responde UNICAMENTE con un JSON valido (sin markdown, sin ```json):
{{
  "risk_score": <numero entre 0 y 100>,
  "risk_level": "<low|medium|high|critical>",
  "classification": "<confirmacion|duda|excusa|cancelacion_directa|ghosting>",
  "detected_signals": [
    {{"text": "<fragmento del mensaje>", "category": "<tipo de señal>", "severity": "<low|medium|high>"}}
  ],
  "recommended_action": "<accion recomendada>",
  "response_summary": "<resumen en 1 linea de lo que el paciente quiere>"
}}

Reglas de clasificacion:
- risk_level "low": 0-30 (confirma claramente)
- risk_level "medium": 31-60 (duda, ambiguedad)
- risk_level "high": 61-85 (excusa, posposicion)
- risk_level "critical": 86-100 (cancelacion directa, rechazo)

Categorias de señales: "impedimento_externo", "incertidumbre", "postergacion", "sintoma_medico", "confirmacion", "entusiasmo", "rechazo"
"""

    result = _call_gemini(prompt)

    if result is None:
        result = _fallback_analysis(patient_message)

    return result


def _fallback_analysis(message: str) -> dict:
    msg = message.lower()
    cancel_words = ["no puedo", "cancelar", "viaje", "enfermo", "tos", "imprevisto", "otro mes", "reagendar"]
    confirm_words = ["sí", "si", "confirmo", "ahí estaré", "listo", "confirmado", "claro"]
    doubt_words = ["no sé", "tal vez", "quizá", "puede ser", "tarde", "no estoy seguro"]

    if any(w in msg for w in cancel_words):
        return {
            "risk_score": 90, "risk_level": "critical", "classification": "excusa",
            "detected_signals": [{"text": msg[:50], "category": "impedimento_externo", "severity": "high"}],
            "recommended_action": "Activar lista de espera inmediatamente",
            "response_summary": "El paciente indica que no podrá asistir",
        }
    elif any(w in msg for w in confirm_words):
        return {
            "risk_score": 10, "risk_level": "low", "classification": "confirmacion",
            "detected_signals": [{"text": msg[:50], "category": "confirmacion", "severity": "low"}],
            "recommended_action": "Marcar cita como confirmada",
            "response_summary": "El paciente confirma asistencia",
        }
    elif any(w in msg for w in doubt_words):
        return {
            "risk_score": 60, "risk_level": "medium", "classification": "duda",
            "detected_signals": [{"text": msg[:50], "category": "incertidumbre", "severity": "medium"}],
            "recommended_action": "Monitorear y enviar segundo recordatorio",
            "response_summary": "El paciente muestra incertidumbre",
        }
    return {
        "risk_score": 50, "risk_level": "medium", "classification": "duda",
        "detected_signals": [{"text": msg[:50], "category": "incertidumbre", "severity": "medium"}],
        "recommended_action": "Requiere evaluación manual",
        "response_summary": "Respuesta ambigua del paciente",
    }


def generate_followup_message(patient_name: str, procedure: str, patient_response: str | None = None) -> dict:
    prompt = f"""Genera un mensaje de seguimiento post-cita para WhatsApp de una clinica estetica.

Paciente: {patient_name}
Procedimiento realizado: {procedure}
{"Respuesta del paciente: " + patient_response if patient_response else "Es el primer mensaje de seguimiento (24h despues)"}

Responde UNICAMENTE con JSON valido (sin markdown):
{{
  "message": "<mensaje de WhatsApp amable y profesional en español>",
  "sentiment": "<positive|neutral|concern|urgent>",
  "medical_alert": <true|false>,
  "alert_reason": "<razon si hay alerta medica, null si no>"
}}

Reglas:
- Usa tono amable, cercano pero profesional
- Incluye cuidados post-procedimiento relevantes
- Si el paciente reporta algo preocupante, marca medical_alert como true
- Si no hay respuesta del paciente, genera el primer mensaje de seguimiento estandar
"""

    result = _call_gemini(prompt, temperature=0.3)

    if result is None:
        result = {
            "message": f"¡Hola {patient_name}! 😊 Esperamos que estés muy bien tras tu {procedure} de ayer. Recordá evitar ejercicio intenso por 24h y mantenerte hidratado. ¿Cómo te has sentido?",
            "sentiment": "neutral",
            "medical_alert": False,
            "alert_reason": None,
        }

    return result


def analyze_no_response(hours_without_reply: int, patient_history: dict | None = None) -> dict:
    no_show_rate = patient_history.get("no_show_rate", 0) if patient_history else 0
    total = patient_history.get("total_appointments", 0) if patient_history else 0

    base_risk = min(40 + (hours_without_reply * 5), 95)
    if no_show_rate > 0.3:
        base_risk = min(base_risk + 15, 98)

    if base_risk >= 86:
        level = "critical"
    elif base_risk >= 61:
        level = "high"
    elif base_risk >= 31:
        level = "medium"
    else:
        level = "low"

    return {
        "risk_score": base_risk,
        "risk_level": level,
        "classification": "ghosting",
        "detected_signals": [
            {"text": f"Sin respuesta hace {hours_without_reply}h", "category": "ghosting", "severity": "high"},
            *(
                [{"text": f"Historial: {no_show_rate:.0%} no-show en {total} citas", "category": "historial_negativo", "severity": "medium"}]
                if no_show_rate > 0.2
                else []
            ),
        ],
        "recommended_action": "Activar lista de espera" if base_risk >= 70 else "Enviar segundo recordatorio",
        "response_summary": f"Paciente no ha respondido en {hours_without_reply} horas",
    }
