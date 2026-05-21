import type { Status } from "@/data/mock";
import { cn } from "@/lib/utils";

const config: Record<string, { label: string; cls: string; dot: string }> = {
  confirmed:  { label: "Confirmada", cls: "bg-success/10 text-success border-success/20",   dot: "bg-success" },
  "at-risk":  { label: "En riesgo",  cls: "bg-warning/15 text-warning border-warning/30",   dot: "bg-warning" },
  at_risk:    { label: "En riesgo",  cls: "bg-warning/15 text-warning border-warning/30",   dot: "bg-warning" },
  cancelled:  { label: "Cancelada",  cls: "bg-danger/10 text-danger border-danger/20",      dot: "bg-danger"  },
  recovered:  { label: "Recuperada", cls: "bg-info/10 text-info border-info/20",            dot: "bg-info"    },
  doubtful:   { label: "Dudosa",     cls: "bg-warning/15 text-warning border-warning/30",   dot: "bg-warning" },
};

const fallback = { label: "Desconocido", cls: "bg-muted text-muted-foreground border-border", dot: "bg-muted-foreground" };

export function StatusBadge({ status, label }: { status: Status | string; label?: string }) {
  const c = config[status] ?? fallback;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", c.cls)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {label ?? c.label}
    </span>
  );
}