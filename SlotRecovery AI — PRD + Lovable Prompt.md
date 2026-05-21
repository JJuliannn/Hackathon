# BizSim — Business Simulator PRD + Lovable Prompt

## Context

Hackathon Microsoft Costa Rica Tech Week (2026-05-21). Building a Business Simulator that lets any business owner (or aspiring entrepreneur) simulate the impact of decisions BEFORE making them. Differentiated from raw chatbots by: visual dashboards, scenario comparison, execution plans, Digital Twin concept, and crowdsourced intelligence moat.

---

## PRD (Product Requirements Document)

### 1. Problema

Los dueños de PYMEs toman decisiones de negocio a ciegas. No tienen acceso a consultores ($200/hora), no saben usar Excel avanzado, y no conocen las herramientas de IA. Las consecuencias: negocios que cierran por decisiones mal informadas, oportunidades perdidas, y dinero tirado.

### 2. Solucion

**BizSim** — Una app web donde cualquier persona describe su negocio (o idea de negocio) y simula decisiones en segundos. La IA actua como un consultor de negocios personal que:
- Entiende tu negocio con datos minimos (3 inputs)
- Estima lo que no sabes con promedios de la industria
- Simula escenarios y muestra resultados visuales con rangos de confianza
- Compara multiples escenarios lado a lado
- Genera planes de ejecucion listos para usar (menu de precios, mensajes de WhatsApp, posts para redes)

### 3. Audiencia

- **Primaria:** Dueños de PYMEs (sodas, cafeterias, tiendas, distribuidoras) en LATAM que NO son tecnicos
- **Secundaria:** Emprendedores que quieren validar una idea ANTES de invertir
- **Terciaria:** Estudiantes de negocios, consultores independientes

### 4. User Personas

**Persona A — "Doña Maria" (Negocio existente)**
- Tiene una soda en Cartago hace 8 años
- Lleva ventas en un cuaderno
- Quiere saber si le conviene subir precios o abrir domingos
- No sabe que es un "prompt" ni ha usado ChatGPT

**Persona B — "Carlos" (Emprendedor)**
- Tiene 24 años, quiere abrir una cafeteria de especialidad
- No sabe si es viable, cuanto invertir, ni donde
- Necesita validacion antes de pedir un prestamo

### 5. Experiencia Core (MVP del Hackathon)

#### Pantalla 1: Landing Page
- Titulo: "Simula el futuro de tu negocio con IA"
- Subtitulo: "Toma mejores decisiones. Sin consultores. Sin Excel. Sin riesgo."
- Dos botones grandes:
  - "Tengo un negocio" → Modo A
  - "Quiero empezar uno" → Modo B
- Social proof (mockeado): "1,200+ negocios ya simularon su futuro"

#### Pantalla 2: Chat de Onboarding
- Interfaz conversacional (NO formulario)
- La IA hace preguntas una por una con opciones de rango
- Boton "No se" en cada pregunta → IA estima con promedios de industria
- Opcion de subir foto/Excel para extraer datos automaticamente
- Flujo Modo A (3-5 preguntas):
  1. "Que tipo de negocio tenes?" [Cards: Soda, Cafeteria, Tienda, Restaurante, Otro]
  2. "Donde esta ubicado?" [Input de texto]
  3. "Mas o menos cuantos clientes te llegan al dia?" [Rangos: <30, 30-80, 80-150, 150+, No se]
  4. "Cuanto cobra en promedio por cliente?" [Rangos adaptados al tipo de negocio]
  5. (Opcional) "Tenes datos de ventas? Subi una foto o archivo" [Upload]
- Flujo Modo B (3 preguntas):
  1. "Que tipo de negocio queres abrir?" [Input libre]
  2. "En que zona?" [Input de texto]
  3. "Cuanto podrias invertir para arrancar?" [Rangos: <$1M, $1-3M, $3-5M, $5M+, No se]

#### Pantalla 3: Perfil del Negocio (Digital Twin)
- Resumen visual del negocio con todos los datos
- Tags visuales: ✅ Dato real vs ⚡ Estimado por IA
- Health Score: barra de progreso 0-100
- Indicador de confianza general de los datos
- Boton "Editar datos" para corregir estimaciones
- Boton prominente: "Simular un escenario"
- Seccion "Ver mi negocio en 6 meses" (proyeccion automatica)
- Alertas proactivas: "Tus martes son 30% mas flojos. Queres simular una promo?"

#### Pantalla 4: Selector de Escenarios
- Cards visuales con iconos para escenarios comunes:
  - 💰 Subir/bajar precios (slider de %)
  - 📦 Agregar canal (delivery, redes, etc)
  - 🕐 Cambiar horario/dias
  - 👥 Contratar/reducir personal
  - 🆕 Lanzar producto nuevo
  - 📍 Cambiar ubicacion
- Input libre: "Otra cosa que quieras simular..."
- Escenarios sugeridos basados en el tipo de negocio (personalizados)

#### Pantalla 5: Resultado de Simulacion
- Veredicto grande y claro: 🟢 VIABLE / 🟡 RIESGOSO / 🔴 NO RECOMENDADO
- Metricas de impacto en RANGOS (no numeros exactos):
  - Revenue: +X% a +Y%
  - Clientes: -X% a -Y%
  - Ganancia neta: +X% a +Y%
- Indicador de confianza por metrica: 🟢 Alta / 🟡 Media / 🔴 Baja
- Seccion de riesgos (2-3 bullets)
- Recomendacion con alternativa sugerida
- Mejor momento para ejecutar
- Demanda/popularidad del mercado
- Seccion "Inteligencia de Mercado": "X negocios similares hicieron esto. Resultado promedio: ..."

#### Pantalla 5b: Comparador de Escenarios
- Vista lado a lado de 2-3 simulaciones
- Tabla comparativa con highlight de "Mejor opcion"
- Cada columna es un escenario con sus metricas

#### Pantalla 5c: Plan de Ejecucion
- Generado automaticamente despues de cada simulacion
- Nueva lista de precios (si aplica) con PDF descargable
- Mensaje de WhatsApp pre-redactado para anunciar cambios
- Post sugerido para redes sociales
- Recordatorio programado: "En 2 semanas te pregunto como te fue"

### 6. FUERA DE ALCANCE (No construir)

- Autenticacion real (boton "Entrar como Admin" directo)
- Pasarelas de pago
- Conexion real a POS/sistemas de inventario
- Deploy a produccion (localhost esta bien)
- Base de datos compleja (Supabase simple o SQLite)
- Tests unitarios
- CI/CD
- Multilenguaje (solo español)
- App movil (solo web responsive)
- Inteligencia colectiva real (mockear con datos inventados)

### 7. Stack Tecnico

- **Frontend/Backend:** Next.js 14 (App Router)
- **Estilos:** Tailwind CSS
- **IA:** API de OpenAI (GPT-4o) o Gemini — segun lo que tengan disponible
- **Base de datos:** Supabase (PostgreSQL) o SQLite con Prisma
- **Vision (fotos):** GPT-4o Vision o Gemini Vision
- **Hosting (demo):** localhost (Vercel si hay tiempo)

### 8. Metricas de Exito (para el pitch)

- Tiempo de onboarding: <60 segundos
- Tiempo de simulacion: <10 segundos
- Inputs minimos requeridos: 3
- Precision del simulador: mejora con cada feedback (moat)

---

## Prompt para Lovable

```
Create a modern, clean web application called "BizSim" — a business decision simulator powered by AI. The app should feel trustworthy, professional but approachable for non-tech users. Use a clean design with soft blues, whites, and accent greens/yellows/reds for status indicators. All text should be in Spanish.

### Pages to create:

**Page 1 — Landing Page**
- Hero section with headline: "Simula el futuro de tu negocio con IA"
- Subtitle: "Toma mejores decisiones. Sin consultores. Sin Excel. Sin riesgo."
- Two large CTA cards side by side:
  - Left card: icon of a store + "Tengo un negocio" + subtext "Optimiza tus decisiones"
  - Right card: icon of a lightbulb + "Quiero empezar uno" + subtext "Valida tu idea antes de invertir"
- Below: a "how it works" section with 3 steps: 1) "Describe tu negocio" 2) "Simula escenarios" 3) "Toma la mejor decision"
- Social proof bar: "1,200+ negocios ya simularon su futuro"
- Clean footer with "Hecho con IA para PYMEs"

**Page 2 — Chat Onboarding**
- Chat-style interface (like WhatsApp/iMessage bubbles)
- AI messages on the left with a robot avatar
- User responses as clickable option cards (not free text input for the main questions)
- First AI message: "¡Hola! Contame sobre tu negocio. Empecemos con lo básico."
- Show business type selection as visual cards with icons: 🍽️ Soda/Restaurante, ☕ Cafetería, 🏪 Tienda/Pulpería, 📦 Distribuidora, 💻 Negocio digital, ✨ Otro
- After selection, show location input
- Then show customer range as selectable pills: "Menos de 30", "30-80", "80-150", "Más de 150", "No sé"
- Then show average ticket as selectable pills with currency ranges
- At the bottom: 4 buttons for data upload: "📸 Foto de cuaderno", "📎 Subir Excel", "💬 Yo te cuento", "🤷 No tengo datos"
- Show a typing indicator animation when "AI is thinking"

**Page 3 — Business Profile (Digital Twin)**
- Top section: Business name + type icon + location
- Health Score: large circular progress indicator showing 72/100 with color gradient
- Data summary cards in a grid:
  - "Clientes/día: ~55" with tag "✅ Confirmado" (green)
  - "Venta promedio: ₡3,800" with tag "✅ Confirmado" (green)
  - "Costos fijos/mes: ~₡450,000" with tag "⚡ Estimado" (amber/yellow)
  - "Competidores cercanos: ~3" with tag "⚡ Estimado" (amber/yellow)
- "Data confidence" progress bar showing 45% real data vs 55% estimated
- Alert card with yellow background: "⚠️ Tus martes son 30% más flojos que el promedio. ¿Querés simular una promo de martes?"
- Section: "Tu negocio en 6 meses (si no cambiás nada)" with a simple trend line chart
- Big CTA button: "Simular un escenario"

**Page 4 — Scenario Selector**
- Title: "¿Qué querés simular?"
- Grid of scenario cards (2 columns) with icons and descriptions:
  - 💰 "Cambiar precios" — "¿Qué pasa si subo o bajo mis precios?"
  - 📦 "Agregar delivery" — "¿Me conviene vender por Uber Eats o WhatsApp?"
  - 🕐 "Abrir otro día u horario" — "¿Vale la pena abrir domingos?"
  - 👥 "Contratar personal" — "¿Necesito más empleados?"
  - 🆕 "Lanzar producto nuevo" — "¿Qué tan viable es un nuevo producto?"
  - 📍 "Cambiar ubicación" — "¿Me conviene mudarme?"
- Each card should be clickable and expand to show a simple input (like a % slider for prices)
- At the bottom: free text input "💬 Otra cosa que quieras simular..."
- Section: "Sugeridos para tu negocio" showing 2 personalized suggestions based on business type

**Page 5 — Simulation Result**
- Top: Large verdict badge — show "🟢 VIABLE" in a green rounded card
- Below: the scenario description "Subir precios 15%"
- Impact metrics in 3 cards side by side:
  - "Revenue: +5% a +12% ↑" with confidence indicator 🟢
  - "Clientes: -8% a -15% ↓" with confidence indicator 🟡
  - "Ganancia neta: +20% a +37% ↑↑" with confidence indicator 🟢
- "Demanda del mercado" card: "Sodas en zona urbana: Demanda ALTA ☕ — tendencia creciente"
- Risks section with red-tinted cards listing 2-3 risks
- Recommendation card with green background: the AI's suggestion + alternative
- "Mejor momento" badge: "Inicio de mes"
- Market intelligence card (subtle): "87 negocios similares hicieron esto. Resultado promedio: +8% revenue"
- Two action buttons at bottom: "Simular otro escenario" and "Ver plan de ejecución"

**Page 5b — Scenario Comparison**
- Title: "Comparación de escenarios"
- 3 columns side by side, each representing a scenario
- Each column has: scenario name, verdict badge, revenue change, customer change, profit change, confidence level, risk level
- The best option column has a highlighted border and a "⭐ Mejor opción" badge
- Below: summary text explaining why that option is best

**Page 5c — Execution Plan**
- Title: "Plan de ejecución"
- Card 1: "📋 Nueva lista de precios" — shows a table of products with old price → new price, with a "Descargar PDF" button
- Card 2: "📱 Mensaje para clientes" — shows a WhatsApp-style message preview with a "Copiar mensaje" button
- Card 3: "📸 Post para redes" — shows a social media post mockup with suggested caption and "Copiar" button
- Card 4: "⏰ Recordatorio" — shows "En 2 semanas te preguntaré: ¿cómo te fue?" with a toggle to activate

### Design guidelines:
- Use a modern, clean design system with rounded corners (border-radius-xl)
- Primary color: Blue (#3B82F6 range)
- Success/Viable: Green (#10B981)
- Warning/Risky: Amber (#F59E0B)
- Danger/Not recommended: Red (#EF4444)
- Estimated data: Amber tags
- Confirmed data: Green tags
- Background: very light gray (#F9FAFB) with white cards
- Typography: clean sans-serif, large readable sizes for non-tech users
- Mobile-first responsive design
- Subtle shadows on cards
- Smooth transitions between pages
- The overall feel should be: "this is a serious business tool, but simple enough for my mom to use"
- Include a simple top navigation bar with the BizSim logo and a "Mi negocio" link
```

---

## Archivos a Crear en el Proyecto Next.js

```
bizsim/
├── app/
│   ├── layout.tsx           ← Layout global, navbar, fuentes
│   ├── page.tsx             ← Landing page
│   ├── onboarding/
│   │   └── page.tsx         ← Chat de onboarding
│   ├── profile/
│   │   └── page.tsx         ← Digital Twin / Perfil del negocio
│   ├── simulate/
│   │   └── page.tsx         ← Selector de escenarios
│   ├── result/
│   │   └── page.tsx         ← Resultado de simulacion
│   ├── compare/
│   │   └── page.tsx         ← Comparador de escenarios
│   ├── execute/
│   │   └── page.tsx         ← Plan de ejecucion
│   └── api/
│       ├── simulate/
│       │   └── route.ts     ← API Route: llama a GPT con el escenario
│       ├── onboard/
│       │   └── route.ts     ← API Route: procesa respuestas del chat
│       ├── extract/
│       │   └── route.ts     ← API Route: vision AI para fotos/excels
│       └── execute/
│           └── route.ts     ← API Route: genera plan de ejecucion
├── components/
│   ├── ChatBubble.tsx
│   ├── ScenarioCard.tsx
│   ├── ResultDashboard.tsx
│   ├── ComparisonTable.tsx
│   ├── HealthScore.tsx
│   ├── ConfidenceBadge.tsx
│   └── VerdictBadge.tsx
├── lib/
│   ├── prompts.ts           ← System prompts para la IA
│   ├── ai.ts                ← Wrapper de la API de OpenAI/Gemini
│   └── types.ts             ← TypeScript types para Business, Simulation, etc.
├── .env.local               ← API keys
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Verificacion

1. Copiar el prompt de Lovable en lovable.dev y verificar que genera las pantallas correctas
2. Crear proyecto Next.js con `npx create-next-app@latest bizsim`
3. Implementar API routes con el system prompt definido
4. Probar el flujo completo: Landing → Onboarding → Perfil → Simular → Resultado → Comparar → Ejecutar
5. Verificar que funciona con datos minimos (solo tipo + ubicacion + pregunta)
6. Verificar que funciona el upload de foto (si la API de vision esta configurada)
7. Probar en movil (responsive)
