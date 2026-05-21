# SlotRecovery AI — PRD + Lovable Prompt

## Context

Hackathon Microsoft Costa Rica Tech Week (2026-05-21). Pivot total: de Business Simulator a **SlotRecovery AI** — un sistema de recuperacion de citas canceladas en las ultimas 48h, enfocado en medicina estetica (Botox, fillers, dermatologia cosmetica). Recomendacion del mentor: enfocarse en una industria, incluir post-cita, y cobrar por cita recuperada.

---

## PRD (Product Requirements Document)

### 1. Problema

Las clinicas de medicina estetica pierden entre 15-25% de sus ingresos mensuales por cancelaciones de ultima hora y "no-shows". Un tratamiento de Botox vale $400+, una hora de quirofano vacia cuesta exactamente eso. Los sistemas actuales de citas (Calendly, agendas manuales) solo envian un recordatorio generico — si el paciente no responde o cancela, el espacio se pierde. Nadie llena ese hueco a tiempo.

**Numeros del dolor:**
- Valor promedio tratamiento estetico: $400 USD
- Cancelaciones promedio/mes por clinica: ~15 citas
- Perdida mensual por clinica: ~$6,000 USD
- Nadie recupera ese dinero hoy de forma automatizada

### 2. Solucion

**SlotRecovery AI** — Una capa de optimizacion que se conecta sobre cualquier sistema de agenda existente y opera en la "Zona de Peligro" (ultimas 48 horas antes de la cita). El sistema:

1. **DETECTA** riesgo de cancelacion analizando semanticamente las respuestas del paciente (o su silencio)
2. **ACTIVA** una lista de espera dinamica cuando detecta alta probabilidad de no-show
3. **RELLENA** el espacio en minutos con una "subasta express" por WhatsApp/SMS
4. **COBRA** una comision de exito SOLO cuando la cita recuperada se ejecuta (post-cita)
5. **FIDELIZA** con seguimiento post-procedimiento automatizado

### 3. Audiencia

- **Primaria:** Clinicas de medicina estetica (Botox, fillers, hilos tensores, laser) en LATAM
- **Secundaria (pitch de escalabilidad):** Cualquier negocio con citas de alto valor — odontologia, bancos, consulados, bufetes legales
- **Usuario final:** Pacientes en lista de espera que quieren citas de ultima hora

### 4. User Personas

**Persona A — Dra. Gabriela (Dueña de clinica estetica)**
- Tiene una clinica con 3 consultorios en Escazu
- Factura $40,000+/mes en procedimientos
- Pierde ~$6,000/mes por no-shows
- Usa Google Calendar + WhatsApp manual para confirmar citas
- PAGARIA gustosa un 5% de comision por citas recuperadas

**Persona B — Laura (Paciente en lista de espera)**
- Quiere Botox pero la clinica esta llena para las proximas 3 semanas
- Le encantaria recibir una alerta: "Se libero un espacio para manana!"
- Responde rapido porque ya queria la cita

### 5. El Flujo Core (El Arbol del Cuaderno)

```
CITA PROGRAMADA
      │
      ▼
[48 HORAS ANTES] ─── Enviar confirmacion automatica
      │
      ├── ✅ Confirma → Marcar como segura
      │
      ├── ⚠️ Responde con duda/excusa → Analisis semantico
      │         │
      │         ├── Riesgo ALTO (>70%) → Pre-cargar lista de espera
      │         └── Riesgo MEDIO (40-70%) → Monitorear
      │
      └── 🔇 No responde → Escalar a [12 HORAS ANTES]
                │
                ▼
      [12 HORAS ANTES] ─── Segundo contacto urgente
                │
                ├── ✅ Confirma → OK
                ├── ❌ Cancela → ACTIVAR lista de espera
                └── 🔇 Sigue sin responder (6h sin respuesta)
                          │
                          ▼
                    Riesgo 85%+ → Activar lista de espera
                          │
                          ▼
              ┌───────────────────────┐
              │  SUBASTA EXPRESS      │
              │                       │
              │  Mensaje a top 3 de   │
              │  lista de espera:     │
              │                       │
              │  "Se libero un        │
              │  espacio para manana  │
              │  9 AM. Responde SI    │
              │  en 15 min para       │
              │  asegurarlo"          │
              │                       │
              │  1ro que responde     │
              │  se lo queda          │
              └──────────┬────────────┘
                         │
                         ▼
              ┌───────────────────────┐
              │  POST-CITA            │
              │                       │
              │  1. Verificar que     │
              │     paciente asistio  │
              │                       │
              │  2. Cobrar comision   │
              │     de exito (5%)     │
              │                       │
              │  3. Enviar mensaje    │
              │     de seguimiento:   │
              │     "Como te sentis   │
              │     despues del       │
              │     procedimiento?"   │
              │                       │
              │  4. Si hay dudas      │
              │     medicas → alertar │
              │     a la clinica      │
              └───────────────────────┘
```

### 6. Experiencia Core (MVP del Hackathon)

#### Pantalla 1: Landing Page
- Nombre: "SlotRecovery AI"
- Headline: "Recupera las citas que pierdes. Automaticamente."
- Subtitulo: "Las clinicas de estetica pierden $6,000/mes por cancelaciones de ultima hora. Nosotros las rellenamos en minutos."
- Stat visual: "Tasa de no-show promedio: 18% → Con SlotRecovery: 2.4%"
- CTA: "Ver demo en vivo"
- Social proof: "Recuperamos $45,200 en citas perdidas este mes" (mockeado)

#### Pantalla 2: Dashboard Principal (Control de Operaciones)
- **KPIs superiores (4 cards):**
  - Revenue recuperado este mes: $3,600
  - Citas salvadas: 9/15 cancelaciones
  - Tasa de no-show: 2.4% (antes: 18%)
  - Tiempo promedio de relleno: 11 minutos
- **Timeline de las proximas 24 horas:**
  - Barra de tiempo con bloques de citas coloreados:
    - 🟢 Verde = Confirmada
    - 🟡 Amarillo = Sin respuesta (en riesgo)
    - 🔴 Rojo = Cancelada
    - 🔵 Azul = Recuperada (llenada por lista de espera)
  - Cada bloque muestra: hora, nombre paciente, procedimiento, valor ($)
- **Panel de alertas activas:**
  - "Maria Lopez — Botox $450 — Manana 9:00 AM — Sin respuesta hace 6h — Riesgo: 85%"
  - Boton: "Activar lista de espera"

#### Pantalla 3: Analisis Semantico (El "Cerebro" Visual)
- Muestra como la IA procesa la respuesta del paciente
- **Escenario demo 1 — La excusa:**
  - Mensaje del paciente: "Hola, vieras que me salio un viaje de trabajo y no creo poder llegar manana, sera que lo pasamos para el otro mes?"
  - La IA resalta semanticamente: "viaje de trabajo" (impedimento), "no creo poder" (incertidumbre), "otro mes" (posposicion larga)
  - Resultado: 🔴 Riesgo 92% — Cancelacion inminente
  - Accion: Lista de espera activada automaticamente
- **Escenario demo 2 — El ghosting:**
  - Mensaje enviado: "Hola Ana, te recordamos tu cita de Botox manana a las 10 AM. Responde SI para confirmar."
  - Estado: Sin respuesta hace 8 horas
  - La IA muestra: Patron de no-respuesta + historial (ha cancelado 2 de 5 citas previas)
  - Resultado: 🟡 Riesgo 78% — Pre-cargar lista de espera

#### Pantalla 4: Subasta Express (Lista de Espera en Accion)
- Muestra la simulacion de como se rellena el espacio:
  - Espacio liberado: Manana 9:00 AM — Botox — $450
  - Mensaje enviado a 3 personas de la lista de espera:
    - "Hola! Se libero un espacio exclusivo para aplicacion de Botox manana a las 9 AM en Clinica Bella. Responde SI en los proximos 15 min para asegurarlo."
  - Timeline visual:
    - 0 min: Espacio liberado 🔴
    - 3 min: Candidato 1 no responde
    - 7 min: Candidato 2 responde "SI!" ✅
    - 7 min: Espacio recuperado → 🔵
  - Card de resultado: "Cita recuperada en 7 minutos. $450 salvados."

#### Pantalla 5: Post-Cita (Monetizacion y Seguimiento)
- **Verificacion de asistencia:**
  - "Carlos Mendoza — Botox — Asistio ✅ — Facturado: $450"
- **Cobro automatico:**
  - "Comision de exito (5%): $22.50 → Facturado a Clinica Bella"
- **Seguimiento al paciente (24h despues):**
  - Mensaje: "Hola Carlos! Esperamos que todo este bien tras tu tratamiento de ayer. Evita ejercicio intenso hoy. Como te has sentido?"
  - Si responde con duda medica → Alerta a la clinica
- **Metricas de fidelizacion:**
  - Tasa de retencion pacientes recuperados: 73%
  - "7 de cada 10 pacientes de lista de espera vuelven a agendar"

#### Pantalla 6: Proyecciones Financieras (Para el Pitch)
- **Tabla de crecimiento:**

| Metrica | Mes 3 | Mes 6 | Ano 1 |
|---------|-------|-------|-------|
| Clinicas activas | 15 | 60 | 200 |
| Citas recuperadas/mes | 135 | 540 | 1,800 |
| Revenue recuperado (clinicas) | $54,000 | $216,000 | $720,000 |
| Ingreso SlotRecovery | $4,185 | $16,740 | $55,800/mes |
| **Ingreso anual** | - | - | **$669,600** |

- **Modelo de ingresos:**
  - Base SaaS: $99/mes por clinica
  - Comision de exito: 5% por cita recuperada (~$20 por cita de $400)
  - Ingreso promedio por clinica: $279/mes
- **Margen operativo: 85%** (costo principal: API de IA = fracciones de centavo por mensaje)

### 7. FUERA DE ALCANCE (No construir)

- Autenticacion real (boton directo "Entrar como Clinica Bella")
- Integracion real con WhatsApp Business API
- Integracion real con sistemas de agenda (Google Calendar, etc.)
- Pasarela de pagos real para las comisiones
- Base de datos compleja
- Deploy a produccion
- Tests / CI/CD
- Multi-idioma (solo espanol)
- App movil nativa (solo web responsive)

### 8. Stack Tecnico

- **Frontend/Backend:** Next.js 14 (App Router) o lo que Lovable genere
- **Estilos:** Tailwind CSS
- **IA:** API de Gemini (gratuita) o Azure OpenAI (si les dan creditos)
- **Base de datos:** localStorage o Supabase free tier
- **Hosting (demo):** localhost o Vercel

### 9. Metricas de Exito (para el pitch)

- Tiempo de relleno de espacio: <15 minutos
- Tasa de recuperacion: 60% de cancelaciones
- ROI para la clinica: 18x (paga $279, recupera $3,600)
- Costo por mensaje IA: <$0.01

---

## Prompt para Lovable

```
Create a modern, professional web application called "SlotRecovery AI" — an intelligent appointment recovery system for aesthetic medicine clinics (Botox, fillers, cosmetic dermatology). The app monitors the last 48 hours before appointments, detects cancellation risks using semantic AI analysis, and automatically fills empty slots from a dynamic waitlist. All text must be in Spanish.

The design should feel like a premium B2B SaaS operations dashboard — think Stripe Dashboard meets healthcare. Use a dark navy sidebar with white content area. The overall aesthetic should communicate: "this tool saves you thousands of dollars."

### Color System:
- Primary: Deep indigo (#4F46E5)
- Confirmed/Safe: Green (#10B981)
- At Risk/Warning: Amber (#F59E0B)
- Cancelled/Danger: Red (#EF4444)
- Recovered/Success: Blue (#3B82F6)
- Background: #F8FAFC with white cards
- Sidebar: Dark navy (#1E1B4B)
- Text: Gray-900 for headings, Gray-500 for secondary

### Navigation:
- Left sidebar (dark navy, always visible) with:
  - Logo: "SlotRecovery AI" with a calendar + refresh icon
  - Nav items with icons: "Dashboard", "Agenda 24h", "Análisis IA", "Lista de Espera", "Post-Cita", "Proyecciones"
  - Bottom: "Clínica Bella — Plan Premium"

### Page 1 — Landing Page (public, no sidebar)
- Full-width hero with gradient background (indigo to purple)
- Headline: "Recupera las citas que pierdes. Automáticamente."
- Subtitle: "Las clínicas de estética pierden $6,000/mes por cancelaciones de última hora. Nosotros las rellenamos en minutos con IA."
- Three animated stat counters: "$45,200 recuperados", "94% ocupación", "11 min promedio de relleno"
- "How it works" section with 4 steps in a horizontal flow with connecting arrows:
  1. "📡 Detectamos" — "Monitoreamos las últimas 48h de tu agenda"
  2. "🧠 Analizamos" — "IA analiza las respuestas de tus pacientes"
  3. "⚡ Rellenamos" — "Activamos tu lista de espera en segundos"
  4. "💰 Cobramos solo si funciona" — "Comisión de éxito por cita recuperada"
- Section: "¿Cuánto estás perdiendo?" with a simple calculator:
  - Input: "Citas canceladas por mes" (slider 5-30, default 15)
  - Input: "Valor promedio del tratamiento" (slider $200-$800, default $400)
  - Output card: "Estás perdiendo $X,XXX al mes. SlotRecovery puede recuperar el 60%: $X,XXX"
- CTA button: "Ver Demo en Vivo" (links to dashboard)
- Footer: "Hecho en Costa Rica 🇨🇷 — Microsoft Tech Week Hackathon 2026"

### Page 2 — Dashboard Principal (with sidebar)
- Top bar: "Buenos días, Dra. Gabriela 👋" + date + notification bell
- 4 KPI cards in a row at the top:
  - Card 1: "💰 Revenue Recuperado" — "$3,600" — subtitle "este mes" — green up arrow "+23%"
  - Card 2: "📅 Citas Salvadas" — "9 de 15" — circular progress 60% in blue
  - Card 3: "📉 Tasa No-Show" — "2.4%" — subtitle "antes: 18%" — green badge "↓ 87%"
  - Card 4: "⏱️ Tiempo de Relleno" — "11 min" — subtitle "promedio"
- Main section: "Agenda — Próximas 24 Horas"
  - Horizontal timeline bar from 7AM to 7PM
  - Appointment blocks on the timeline, each showing:
    - Time, patient name (first name only), procedure, value
    - Color-coded by status (green=confirmed, amber=at risk, red=cancelled, blue=recovered)
  - Example blocks:
    - 8:00 — "María L. — Botox — $450" — 🟢 Confirmada
    - 9:00 — "Ana R. — Ácido Hialurónico — $380" — 🟡 Sin respuesta (6h)
    - 10:00 — "VACÍO — Cancelado" — 🔴 with animated pulse
    - 11:00 — "Carlos M. — Botox — $450" — 🔵 Recuperada ✨
    - 12:00 — "Laura S. — Hilos Tensores — $600" — 🟢 Confirmada
    - 2:00 — "Patricia V. — Laser — $350" — 🟡 Respuesta dudosa
- Right panel: "🚨 Alertas Activas" — scrollable list of 2-3 alerts:
  - Alert 1: Red badge — "Ana R. — Ácido Hialurónico $380 — Mañana 9:00 AM — Sin respuesta hace 6h — Riesgo: 85%" — Button: "Activar Lista de Espera"
  - Alert 2: Amber badge — "Patricia V. — Laser $350 — Mañana 2:00 PM — Respuesta dudosa — Riesgo: 65%" — Button: "Ver Análisis"

### Page 3 — Análisis Semántico IA
- Title: "🧠 Motor de Análisis Semántico"
- Subtitle: "Así detectamos cancelaciones antes de que ocurran"
- Two interactive demo scenarios as large cards:

**Scenario Card 1: "La Excusa"**
- Chat bubble (patient): "Hola, vieras que me salió un viaje de trabajo de última hora y no creo que pueda llegar mañana, ¿será que lo pasamos para el otro mes?"
- Below: "Análisis Semántico" section showing the message with highlighted words:
  - "viaje de trabajo" highlighted in amber → labeled "Impedimento externo"
  - "no creo que pueda" highlighted in red → labeled "Incertidumbre alta"
  - "otro mes" highlighted in red → labeled "Postergación indefinida"
- Result card with red border:
  - "Riesgo de Cancelación: 92% 🔴"
  - "Clasificación: Cancelación inminente"
  - "Acción automática: Lista de espera activada ✅"
  - "Tiempo de detección: 0.3 segundos"

**Scenario Card 2: "El Ghosting"**
- Shows: sent message bubble "Hola Ana, te recordamos tu cita de Ácido Hialurónico mañana a las 9 AM. Respondé SÍ para confirmar 😊"
- Status: "Sin respuesta — hace 8 horas" with a clock icon
- Patient history mini-card: "Historial: 5 citas previas, 2 cancelaciones (40%)"
- Result card with amber border:
  - "Riesgo de Cancelación: 78% 🟡"
  - "Clasificación: Ghosting probable"
  - "Acción automática: Lista de espera pre-cargada, activación en 4 horas si no responde"

### Page 4 — Lista de Espera / Subasta Express
- Title: "⚡ Subasta Express de Espacios"
- Subtitle: "Rellenamos tus espacios vacíos en minutos, no en días"
- Interactive simulation panel:
  - Top: Red card — "🔴 Espacio Liberado: Mañana 9:00 AM — Ácido Hialurónico — $380"
  - Below: "Notificando lista de espera..." with 3 candidate cards:
    - Candidato 1: "Valentina M. — En espera desde hace 2 semanas — Notificada ✅ — Esperando respuesta..."
    - Candidato 2: "Sofía R. — En espera desde hace 1 semana — Notificada ✅ — Esperando respuesta..."
    - Candidato 3: "Andrea L. — En espera desde hace 3 días — En cola (se notifica si las primeras no responden)"
  - Animated timeline showing:
    - 0 min: "Espacio liberado 🔴"
    - 3 min: "Valentina M. — no responde"
    - 7 min: "Sofía R. responde: ¡SÍ! 🎉"
    - 7 min: "Espacio RECUPERADO 🔵"
  - Success card (blue border, confetti-like accent):
    - "✅ Cita recuperada en 7 minutos"
    - "$380 salvados para Clínica Bella"
    - "Sofía R. confirmada para mañana 9:00 AM"
  - WhatsApp preview bubble showing the message sent: "¡Hola Sofía! 🎉 Se liberó un espacio exclusivo para Ácido Hialurónico mañana a las 9:00 AM en Clínica Bella. Respondé SÍ en los próximos 15 minutos para asegurarlo."

### Page 5 — Post-Cita (Monetización y Seguimiento)
- Title: "📋 Seguimiento Post-Cita"
- Subtitle: "Cobramos solo cuando funciona. Fidelizamos siempre."
- Three sections as cards:

**Card 1: "Verificación de Asistencia"**
- Table with columns: Paciente, Procedimiento, Hora, Estado, Facturado
- Row: "Carlos M. — Botox — 11:00 AM — ✅ Asistió — $450"
- Row: "Sofía R. — Ác. Hialurónico — 9:00 AM — ✅ Asistió — $380"
- Green banner: "2 citas recuperadas hoy = $830 salvados"

**Card 2: "Facturación Automática por Éxito"**
- Invoice-style card:
  - "Clínica Bella — Factura del día"
  - Line item: "Cita recuperada: Carlos M. (Botox $450) → Comisión 5% = $22.50"
  - Line item: "Cita recuperada: Sofía R. (Ác. Hialurónico $380) → Comisión 5% = $19.00"
  - Total: "$41.50"
  - Badge: "💡 La clínica ganó $830, SlotRecovery cobró $41.50 — ROI: 20x"

**Card 3: "Seguimiento al Paciente (24h después)"**
- WhatsApp-style chat preview:
  - Bot: "¡Hola Carlos! 😊 Esperamos que estés muy bien tras tu aplicación de Botox de ayer. Recordá evitar ejercicio intenso por 24h y no tocar la zona tratada. ¿Cómo te has sentido?"
  - Patient: "Todo bien! Pero tengo un poquito hinchado el lado derecho, es normal?"
  - Bot: "Es completamente normal una leve hinchazón las primeras 24-48h. Si persiste más de 3 días, contactanos. ¡Estamos para vos! 💙"
- Alert card (if needed): "⚠️ Si el paciente reporta algo fuera de lo normal → Alerta automática a la Dra. Gabriela"
- Stats: "Tasa de retención pacientes recuperados: 73% — 7 de 10 vuelven a agendar"

### Page 6 — Proyecciones Financieras
- Title: "📈 Proyecciones de Impacto"
- Subtitle: "El caso de negocio para inversionistas"
- Top: "Modelo de Ingresos" card:
  - "SaaS Base: $99/mes por clínica"
  - "Comisión de éxito: 5% por cita recuperada (~$20 por cita de $400)"
  - "Ingreso promedio por clínica: $279/mes"
- Growth table with 3 columns (Mes 3, Mes 6, Año 1):
  - Clínicas activas: 15 → 60 → 200
  - Citas recuperadas/mes: 135 → 540 → 1,800
  - Revenue salvado (clínicas): $54,000 → $216,000 → $720,000
  - Ingreso SlotRecovery/mes: $4,185 → $16,740 → $55,800
  - Ingreso anual: — → — → $669,600
- Bar chart visualizing monthly revenue growth
- Bottom card (highlighted): "Margen operativo: 85% — El costo de procesar cada mensaje con IA es < $0.01"
- Quote card: "Una clínica paga $279/mes y recupera $3,600 en citas perdidas. ROI: 13x. No somos un gasto, somos una fuente de ingresos."

### Design Guidelines:
- Professional B2B SaaS aesthetic — think Stripe, Linear, or Vercel dashboard
- Rounded corners (xl), subtle shadows on cards
- Smooth transitions and micro-animations (especially for the waitlist simulation)
- The timeline/agenda should feel real-time and dynamic
- Mobile-responsive but primarily designed for desktop (clinic receptionist at a computer)
- All monetary values in USD with $ symbol
- Patient names should be realistic Latin American names
- WhatsApp-style chat bubbles should look authentic
- Use Inter or similar clean sans-serif font
- Status badges should be pill-shaped with colored backgrounds
- The overall feel: "this is enterprise-grade software that a clinic manager would trust with their revenue"
```

---

## Estructura de Archivos Next.js

```
slotrecovery/
├── app/
│   ├── layout.tsx              ← Layout con sidebar
│   ├── page.tsx                ← Landing page (sin sidebar)
│   ├── dashboard/
│   │   └── page.tsx            ← Dashboard + KPIs + Timeline 24h
│   ├── analysis/
│   │   └── page.tsx            ← Analisis semantico visual
│   ├── waitlist/
│   │   └── page.tsx            ← Subasta express / lista de espera
│   ├── post-appointment/
│   │   └── page.tsx            ← Seguimiento + facturacion
│   ├── projections/
│   │   └── page.tsx            ← Proyecciones financieras
│   └── api/
│       ├── analyze/
│       │   └── route.ts        ← API: analisis semantico de respuesta
│       ├── recover/
│       │   └── route.ts        ← API: activar lista de espera
│       └── followup/
│           └── route.ts        ← API: generar mensaje post-cita
├── components/
│   ├── Sidebar.tsx
│   ├── KPICard.tsx
│   ├── AppointmentTimeline.tsx
│   ├── AlertCard.tsx
│   ├── SemanticAnalysis.tsx
│   ├── WaitlistSimulation.tsx
│   ├── ChatBubble.tsx
│   ├── InvoiceCard.tsx
│   └── ProjectionsTable.tsx
├── lib/
│   ├── prompts.ts              ← System prompts para IA
│   ├── ai.ts                   ← Wrapper API (Gemini/OpenAI)
│   └── types.ts                ← TypeScript types
├── .env.local
├── package.json
└── tailwind.config.ts
```

## Verificacion

1. Copiar prompt de Lovable y pegar en lovable.dev
2. Verificar que genera las 6 pantallas con la estetica correcta
3. Si construyen en Next.js: `npx create-next-app@latest slotrecovery`
4. Probar flujo: Landing → Dashboard → Analisis → Lista Espera → Post-Cita → Proyecciones
5. Los escenarios demo deben funcionar con un click (datos precargados)
6. Verificar responsive (aunque prioridad es desktop)
