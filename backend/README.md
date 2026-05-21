# SlotRecovery AI — Backend

## Setup rápido

```bash
cd backend
cp .env.example .env          # editar con las keys reales
python3 -m pip install -r requirements.txt
python3 seed.py               # sembrar datos de demo
python3 app.py                # arranca en http://localhost:5000
```

## Endpoints

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/dashboard` | GET | KPIs + citas 24h + alertas |
| `/api/analyze` | POST | Análisis semántico IA |
| `/api/waitlist` | GET | Lista de espera |
| `/api/commissions` | GET | Comisiones |
| `/api/projections` | GET | Proyecciones financieras |
| `/api/kapso/citas/estado` | POST | Webhook de Kapso (confirma/cancela) |
| `/api/kapso/waitlist/response` | POST | Webhook de Kapso (respuesta waitlist) |
| `/api/post-appointment/verify` | POST | Verificar asistencia |
| `/api/trigger-reminders` | POST | Disparar recordatorios |

## Probar endpoints

```bash
# Health
curl http://localhost:5000/api/health

# Dashboard
curl http://localhost:5000/api/dashboard

# Análisis semántico (excusa)
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"message": "No puedo ir mañana, me salió un viaje"}'

# Análisis semántico (confirmación)
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"message": "Sí claro, ahí estaré"}'

# Análisis ghosting
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"hours_without_reply": 8}'
```
