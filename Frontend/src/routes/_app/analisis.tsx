import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { ChatBubble } from "@/components/ChatBubble";
import { cn } from "@/lib/utils";
import { Brain, Clock } from "lucide-react";

export const Route = createFileRoute("/_app/analisis")({
  head: () => ({
    meta: [
      { title: "Análisis IA — SlotRecovery" },
      { name: "description", content: "Motor de análisis semántico que detecta cancelaciones antes de que ocurran." },
    ],
  }),
  component: AnalisisPage,
});

function AnalisisPage() {
  return (
    <div>
      <TopBar />
      <div className="space-y-6 p-6">
        <header>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Brain className="h-3.5 w-3.5" /> Motor IA
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">🧠 Motor de Análisis Semántico</h2>
          <p className="mt-1 text-sm text-muted-foreground">Así detectamos cancelaciones antes de que ocurran.</p>
        </header>

        {/* Scenario 1 */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">Escenario 1</div>
          <h3 className="text-xl font-semibold text-foreground">La Excusa</h3>

          <div className="mt-5 rounded-2xl bg-[#e5ddd5] p-4">
            <ChatBubble side="in" time="07:14 AM">
              Hola, vieras que me salió un viaje de trabajo de última hora y no creo que pueda llegar mañana, ¿será que lo pasamos para el otro mes?
            </ChatBubble>
          </div>

          <div className="mt-6">
            <div className="text-sm font-semibold text-foreground">Análisis Semántico</div>
            <p className="mt-3 text-base leading-relaxed text-foreground">
              Hola, vieras que me salió un{" "}
              <Highlight tone="warning" label="Impedimento externo">viaje de trabajo</Highlight>{" "}
              de última hora y{" "}
              <Highlight tone="danger" label="Incertidumbre alta">no creo que pueda</Highlight>{" "}
              llegar mañana, ¿será que lo pasamos para el{" "}
              <Highlight tone="danger" label="Postergación indefinida">otro mes</Highlight>?
            </p>
          </div>

          <div className="mt-6 grid gap-4 rounded-2xl border-2 border-danger/40 bg-danger/5 p-5 md:grid-cols-4">
            <Stat label="Riesgo de Cancelación" value="92%" tone="danger" big />
            <Stat label="Clasificación" value="Cancelación inminente" tone="danger" />
            <Stat label="Acción automática" value="Lista de espera activada ✅" tone="success" />
            <Stat label="Tiempo de detección" value="0.3 seg" tone="info" />
          </div>
        </div>

        {/* Scenario 2 */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">Escenario 2</div>
          <h3 className="text-xl font-semibold text-foreground">El Ghosting</h3>

          <div className="mt-5 rounded-2xl bg-[#e5ddd5] p-4 space-y-2">
            <ChatBubble side="out" time="06:00 AM">
              Hola Ana, te recordamos tu cita de Ácido Hialurónico mañana a las 9 AM. Respondé <strong>SÍ</strong> para confirmar 😊
            </ChatBubble>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
              <Clock className="h-3.5 w-3.5" /> Sin respuesta — hace 8 horas
            </div>
            <div className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Historial:</span> 5 citas previas · 2 cancelaciones (40%)
            </div>
          </div>

          <div className="mt-6 grid gap-4 rounded-2xl border-2 border-warning/40 bg-warning/5 p-5 md:grid-cols-3">
            <Stat label="Riesgo de Cancelación" value="78%" tone="warning" big />
            <Stat label="Clasificación" value="Ghosting probable" tone="warning" />
            <Stat label="Acción automática" value="Lista de espera pre-cargada · activación en 4h" tone="info" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Highlight({ tone, label, children }: { tone: "warning" | "danger"; label: string; children: React.ReactNode }) {
  const cls = tone === "warning"
    ? "bg-warning/25 text-warning-foreground border-b-2 border-warning"
    : "bg-danger/15 text-danger border-b-2 border-danger";
  return (
    <span className="group relative inline-block">
      <span className={cn("rounded px-1 py-0.5 font-medium", cls)}>{children}</span>
      <span className={cn(
        "pointer-events-none absolute -top-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100",
        tone === "warning" ? "bg-warning" : "bg-danger",
      )}>{label}</span>
    </span>
  );
}

function Stat({ label, value, tone, big = false }: { label: string; value: string; tone: "danger" | "warning" | "info" | "success"; big?: boolean }) {
  const toneCls = {
    danger: "text-danger",
    warning: "text-warning",
    info: "text-info",
    success: "text-success",
  }[tone];
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("mt-1 font-semibold", toneCls, big ? "text-3xl" : "text-base")}>{value}</div>
    </div>
  );
}
