import { useEffect, useReducer } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatBubble } from "./ChatBubble";
import { CheckCircle2, Clock, RotateCcw, Sparkles, XCircle } from "lucide-react";
import { usd } from "@/lib/format";

type CandidateState = "queued" | "notified" | "no-response" | "confirmed";
type State = {
  step: number; // 0..4
  cands: CandidateState[];
};

const initial: State = { step: 0, cands: ["queued", "queued", "queued"] };

function reducer(s: State, a: { type: "tick" } | { type: "reset" }): State {
  if (a.type === "reset") return initial;
  switch (s.step) {
    case 0:
      return { step: 1, cands: ["notified", "notified", "queued"] };
    case 1:
      return { step: 2, cands: ["no-response", "notified", "queued"] };
    case 2:
      return { step: 3, cands: ["no-response", "confirmed", "queued"] };
    case 3:
      return { step: 4, cands: s.cands };
    default:
      return s;
  }
}

const candidates = [
  { name: "Valentina M.", wait: "En espera hace 2 semanas" },
  { name: "Sofía R.", wait: "En espera hace 1 semana" },
  { name: "Andrea L.", wait: "En espera hace 3 días" },
];

const timeline = [
  { t: "0 min", text: "Espacio liberado", tone: "danger" as const, icon: XCircle },
  { t: "3 min", text: "Valentina M. — no responde", tone: "muted" as const, icon: Clock },
  { t: "7 min", text: "Sofía R. responde: ¡SÍ! 🎉", tone: "success" as const, icon: CheckCircle2 },
  { t: "7 min", text: "Espacio RECUPERADO", tone: "info" as const, icon: Sparkles },
];

export function WaitlistSimulation() {
  const [s, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    if (s.step >= 4) return;
    const delays = [1200, 1600, 1800, 1200];
    const id = setTimeout(() => dispatch({ type: "tick" }), delays[s.step]);
    return () => clearTimeout(id);
  }, [s.step]);

  return (
    <div className="space-y-6">
      {/* Liberated slot */}
      <div className="flex items-center justify-between rounded-2xl border-2 border-danger/40 bg-danger/5 p-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-danger">🔴 Espacio liberado</div>
          <div className="mt-1 text-lg font-semibold text-foreground">Mañana 9:00 AM — Ácido Hialurónico</div>
          <div className="text-sm text-muted-foreground">Cancelación de Ana R. detectada por IA</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold tabular-nums text-foreground">{usd(380)}</div>
          <div className="text-xs text-muted-foreground">en riesgo</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Candidates */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground">Notificando lista de espera…</div>
          {candidates.map((c, i) => (
            <CandidateCard key={c.name} name={c.name} wait={c.wait} state={s.cands[i]} priority={i + 1} />
          ))}
        </div>

        {/* Timeline */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-sm font-semibold text-foreground">Línea de tiempo</div>
          <ol className="mt-4 space-y-4">
            {timeline.map((t, i) => {
              const visible = s.step > i || (s.step === i);
              const reached = s.step > i || (s.step === 4 && i <= 3);
              const Icon = t.icon;
              const tone = {
                danger: "bg-danger/15 text-danger",
                success: "bg-success/15 text-success",
                info: "bg-info/15 text-info",
                muted: "bg-muted text-muted-foreground",
              }[t.tone];
              return (
                <li
                  key={i}
                  className={cn(
                    "flex items-start gap-3 transition-opacity",
                    reached ? "opacity-100" : "opacity-30",
                    visible && "animate-slide-up",
                  )}
                >
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", tone)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-muted-foreground tabular-nums">{t.t}</div>
                    <div className="text-sm text-foreground">{t.text}</div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Success */}
      {s.step >= 4 && (
        <div className="animate-confetti rounded-2xl border-2 border-info/40 bg-info/5 p-6">
          <div className="flex items-center gap-2 text-info">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Cita recuperada en 7 minutos</span>
          </div>
          <div className="mt-2 text-3xl font-bold tabular-nums text-foreground">{usd(380)} salvados para Clínica Bella</div>
          <div className="text-sm text-muted-foreground">Sofía R. confirmada para mañana 9:00 AM</div>
        </div>
      )}

      {/* WhatsApp preview */}
      <div className="rounded-2xl border border-border bg-[#e5ddd5] p-5">
        <div className="mb-2 text-xs font-medium text-muted-foreground">Mensaje enviado por WhatsApp</div>
        <ChatBubble side="out" time="08:43 AM">
          ¡Hola Sofía! 🎉 Se liberó un espacio exclusivo para <strong>Ácido Hialurónico</strong> mañana a las 9:00 AM en Clínica Bella. Respondé <strong>SÍ</strong> en los próximos 15 minutos para asegurarlo.
        </ChatBubble>
      </div>

      <div>
        <Button variant="outline" size="sm" onClick={() => dispatch({ type: "reset" })}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reiniciar simulación
        </Button>
      </div>
    </div>
  );
}

function CandidateCard({
  name,
  wait,
  state,
  priority,
}: {
  name: string;
  wait: string;
  state: CandidateState;
  priority: number;
}) {
  const status = {
    queued: { label: "En cola — se notifica si las primeras no responden", cls: "text-muted-foreground", dot: "bg-muted-foreground/40" },
    notified: { label: "Notificada ✅ — Esperando respuesta…", cls: "text-info", dot: "bg-info animate-pulse" },
    "no-response": { label: "Sin respuesta", cls: "text-muted-foreground line-through", dot: "bg-muted-foreground/40" },
    confirmed: { label: "¡Confirmada! 🎉", cls: "text-success font-semibold", dot: "bg-success" },
  }[state];

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-4 transition-all",
        state === "confirmed" ? "border-success/40 bg-success/5 shadow-[var(--shadow-elevated)]" : "border-border",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {priority}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-foreground">{name}</div>
          <div className="text-xs text-muted-foreground">{wait}</div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={cn("h-2 w-2 rounded-full", status.dot)} />
          <span className={status.cls}>{status.label}</span>
        </div>
      </div>
    </div>
  );
}
