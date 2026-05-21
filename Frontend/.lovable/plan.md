# SlotRecovery AI — Build Plan

A polished, all-frontend demo (no backend / no auth) of an appointment-recovery SaaS for aesthetic medicine clinics. All copy in Spanish, all currency in USD.

## Scope

Static demo with mocked data and scripted micro-animations. No Lovable Cloud, no DB, no real WhatsApp/AI calls — this is a hackathon-style pitch product.

## Routes (TanStack Start, one file each)

```
src/routes/
  __root.tsx              # global shell, HeadContent
  index.tsx               # Landing (no sidebar)
  _app.tsx                # Layout: dark sidebar + white content + <Outlet/>
  _app/dashboard.tsx      # Page 2 — Dashboard principal
  _app/agenda.tsx         # Page 2b (same as dashboard agenda focus) — optional alias
  _app/analisis.tsx       # Page 3 — Análisis Semántico IA
  _app/lista-espera.tsx   # Page 4 — Subasta Express
  _app/post-cita.tsx      # Page 5 — Seguimiento Post-Cita
  _app/proyecciones.tsx   # Page 6 — Proyecciones Financieras
```

Note: `_app.tsx` is a pathless layout route in TanStack (different from the forbidden `_app/index.tsx` pattern). Sidebar items per spec: Dashboard, Agenda 24h, Análisis IA, Lista de Espera, Post-Cita, Proyecciones. "Agenda 24h" links to `/dashboard` (the agenda lives there) unless we split it later.

## Design System (src/styles.css)

Replace default tokens with the spec palette in `oklch`:

- `--primary`: indigo #4F46E5
- `--success`: green #10B981 (confirmed/safe)
- `--warning`: amber #F59E0B (at risk)
- `--danger`: red #EF4444 (cancelled)
- `--info`: blue #3B82F6 (recovered)
- `--background`: #F8FAFC, `--card`: #FFFFFF
- `--sidebar`: #1E1B4B (dark navy), `--sidebar-foreground`: near-white
- `--foreground`: gray-900, `--muted-foreground`: gray-500
- `--gradient-hero`: linear-gradient indigo→purple
- `--shadow-card`: subtle elevation
- Radius: `xl` default, pill badges via `rounded-full`
- Font: Inter via Google Fonts link in `__root.tsx` head

All component colors via semantic tokens — no hardcoded hex in JSX.

## Shared Components (src/components/)

- `AppSidebar.tsx` — fixed dark navy sidebar, logo (Calendar + RefreshCw icons), nav links with active state via `useRouterState`, footer "Clínica Bella — Plan Premium"
- `TopBar.tsx` — greeting + date + Bell icon
- `KpiCard.tsx` — icon, label, value, delta badge, optional circular progress
- `StatusBadge.tsx` — pill, variant: confirmed | at-risk | cancelled | recovered | doubtful
- `AppointmentBlock.tsx` — timeline block, color-coded
- `Timeline24h.tsx` — horizontal 7AM–7PM ruler with positioned blocks + pulse animation for cancelled
- `AlertCard.tsx` — colored left-border alert with CTA
- `ChatBubble.tsx` — WhatsApp-style (incoming gray, outgoing green, tails, timestamp)
- `HighlightedMessage.tsx` — renders a phrase with span highlights + labels for semantic analysis
- `StatCounter.tsx` — animated count-up using rAF
- `RevenueCalculator.tsx` — two sliders + computed loss/recovery
- `WaitlistSimulation.tsx` — scripted timeline that auto-advances using `setTimeout`, shows candidates being notified, success state with subtle confetti accent
- `RevenueBarChart.tsx` — Recharts BarChart for projections

Use shadcn primitives already in the template (Card, Button, Slider, Badge, Progress, Table, Separator, ScrollArea). Add Recharts via `bun add recharts`. Add `lucide-react` icons (already present).

## Page-by-Page

### 1. `/` Landing
- Full-bleed hero with `--gradient-hero`, headline + subtitle, primary CTA "Ver Demo en Vivo" → `/dashboard`
- 3 `StatCounter`s animating on mount
- "Cómo funciona" — 4-step horizontal flow with ArrowRight connectors (stacks vertically on mobile)
- "¿Cuánto estás perdiendo?" — `RevenueCalculator` with live output card
- Footer: "Hecho en Costa Rica 🇨🇷 — Microsoft Tech Week Hackathon 2026"
- Own `head()` with title/description/og

### 2. `/dashboard`
- TopBar greeting "Buenos días, Dra. Gabriela 👋"
- 4 `KpiCard`s in responsive grid
- "Agenda — Próximas 24 Horas" `Timeline24h` with the 6 scripted blocks
- Right column: "🚨 Alertas Activas" with 2 alert cards

### 3. `/analisis`
- Header + subtitle
- Two large scenario cards stacked:
  - "La Excusa" — ChatBubble + HighlightedMessage with 3 highlights + red-bordered result card
  - "El Ghosting" — outgoing ChatBubble + status row + history mini-card + amber-bordered result card

### 4. `/lista-espera`
- Header + subtitle
- `WaitlistSimulation` driving:
  - Liberated-slot red card
  - 3 candidate cards (state updates: notified → no response → confirmed)
  - Vertical animated timeline (0 / 3 / 7 / 7 min)
  - Blue success card with confetti accent
  - WhatsApp preview bubble
- "Reiniciar simulación" button to replay

### 5. `/post-cita`
- 3 cards:
  - Verification table + green banner
  - Invoice card with line items + ROI 20x badge
  - WhatsApp chat preview (3 bubbles) + alert info + retention stat

### 6. `/proyecciones`
- "Modelo de Ingresos" card
- Growth Table (Mes 3 / Mes 6 / Año 1)
- `RevenueBarChart` (Recharts) — monthly SlotRecovery revenue across 12 months
- Highlighted operating-margin card
- Pull-quote card

## Animations

- Tailwind `animate-fade-in`, `animate-scale-in`, custom `pulse` for empty slot
- Count-up via rAF in `StatCounter`
- Waitlist simulation via sequenced `setTimeout` with cleanup on unmount

## SEO / head

Each route sets unique `title`, `description`, og:title, og:description. og:image only on landing (leaf).

## Out of Scope

- Real auth, DB, AI, WhatsApp integration
- Multi-tenant / settings pages
- Mobile-first redesign (responsive but desktop-primary)

## Technical Notes

- No new env vars or secrets
- New dep: `recharts`
- Sidebar uses `collapsible="icon"` shadcn pattern with active route via `useRouterState`
- All currency formatted via `Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits: 0 })` helper in `src/lib/format.ts`
- Mock data lives in `src/data/mock.ts` (appointments, alerts, candidates, projections)
