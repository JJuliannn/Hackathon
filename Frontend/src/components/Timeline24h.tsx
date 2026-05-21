import { appointments } from "@/data/mock";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";
import { usd } from "@/lib/format";

const START = 7;
const END = 19;
const HOURS = END - START;

const statusColor: Record<string, string> = {
  confirmed: "border-success/40 bg-success/5",
  "at-risk": "border-warning/50 bg-warning/10",
  cancelled: "border-danger/60 bg-danger/10 animate-pulse-danger",
  recovered: "border-info/50 bg-info/10",
  doubtful: "border-warning/50 bg-warning/10",
};

export function Timeline24h() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Agenda — Próximas 24 Horas</h2>
          <p className="text-xs text-muted-foreground">Estado en tiempo real de tu día</p>
        </div>
        <div className="hidden gap-3 text-xs text-muted-foreground md:flex">
          <Legend tone="success" label="Confirmada" />
          <Legend tone="warning" label="En riesgo" />
          <Legend tone="danger" label="Cancelada" />
          <Legend tone="info" label="Recuperada" />
        </div>
      </div>

      {/* Ruler */}
      <div className="relative h-6 select-none">
        <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
        {Array.from({ length: HOURS + 1 }).map((_, i) => {
          const hr = START + i;
          const left = (i / HOURS) * 100;
          const label = hr === 12 ? "12 PM" : hr < 12 ? `${hr} AM` : `${hr - 12} PM`;
          return (
            <div key={i} className="absolute -translate-x-1/2 text-[10px] text-muted-foreground" style={{ left: `${left}%` }}>
              <div className="mx-auto h-1.5 w-px bg-border" />
              <div className="mt-1">{label}</div>
            </div>
          );
        })}
      </div>

      {/* Blocks grid */}
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {appointments.map((a, i) => (
          <div
            key={i}
            className={cn(
              "relative rounded-xl border-2 p-3 transition-transform hover:-translate-y-0.5",
              statusColor[a.status],
            )}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-foreground tabular-nums">
                {a.hour === 12 ? "12:00 PM" : a.hour < 12 ? `${a.hour}:00 AM` : `${a.hour - 12}:00 PM`}
              </div>
              <StatusBadge status={a.status} />
            </div>
            <div className="mt-2 text-sm font-medium text-foreground">{a.name}</div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{a.procedure}</span>
              <span className="font-semibold text-foreground">{a.value ? usd(a.value) : "—"}</span>
            </div>
            {a.note && <div className="mt-1 text-[11px] text-muted-foreground">{a.note}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Legend({ tone, label }: { tone: "success" | "warning" | "danger" | "info"; label: string }) {
  const cls = {
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
    info: "bg-info",
  }[tone];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("h-2 w-2 rounded-full", cls)} />
      {label}
    </span>
  );
}
