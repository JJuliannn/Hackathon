import os
import requests

KAPSO_BASE = "https://api.kapso.ai/platform/v1/workflows"
KAPSO_API_KEY = os.getenv("KAPSO_API_KEY", "")
KAPSO_PHONE_NUMBER_ID = os.getenv("KAPSO_PHONE_NUMBER_ID", "")


def _call_workflow(workflow_id: str, phone: str, variables: dict) -> dict | None:
    if not KAPSO_API_KEY or KAPSO_API_KEY.startswith("tu_"):
        print(f"[KAPSO MOCK] Workflow {workflow_id} → {phone} vars={variables}")
        return {"mock": True, "workflow_id": workflow_id}

    resp = requests.post(
        f"{KAPSO_BASE}/{workflow_id}/executions",
        headers={
            "X-API-Key": KAPSO_API_KEY,
            "Content-Type": "application/json",
        },
        json={
            "workflow_execution": {
                "phone_number": phone,
                "phone_number_id": KAPSO_PHONE_NUMBER_ID,
                "variables": variables,
                "context": {"source": "slotrecovery-backend"},
            }
        },
        timeout=10,
    )
    resp.raise_for_status()
    return resp.json()


def send_reminder(phone: str, patient_name: str, day: str, hour: str, procedure: str, appointment_id: str):
    wf_id = os.getenv("KAPSO_WORKFLOW_REMINDER_ID", "")
    return _call_workflow(wf_id, phone, {
        "nombre_paciente": patient_name,
        "dia": day,
        "hora": hour,
        "tratamiento": procedure,
        "cita_id": appointment_id,
    })


def send_waitlist_offer(phone: str, patient_name: str, hour: str, procedure: str, appointment_id: str):
    wf_id = os.getenv("KAPSO_WORKFLOW_AUCTION_ID", "")
    return _call_workflow(wf_id, phone, {
        "nombre_lista_espera": patient_name,
        "hora": hour,
        "tratamiento": procedure,
        "cita_id": appointment_id,
    })


def send_post_appointment(phone: str, patient_name: str, procedure: str, appointment_id: str):
    wf_id = os.getenv("KAPSO_WORKFLOW_POSTCITA_ID", "")
    return _call_workflow(wf_id, phone, {
        "nombre": patient_name,
        "tratamiento": procedure,
        "cita_id": appointment_id,
    })
