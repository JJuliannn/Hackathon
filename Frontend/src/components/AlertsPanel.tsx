import { alerts } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { usd } from "@/lib/format";

export function AlertsPanel() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">🚨 Alertas Activas</h3>
        <span className="rounded-full bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger">
          {alerts.length} nuevas
        </span>
      </div>
      <div className="space-y-3">
        {alerts.map((a, i) => {
          const isDanger = a.level === "danger";
          return (
            <div
              key={i}
              className={cn(
                "rounded-xl border-l-4 bg-background p-4",
                isDanger ? "border-l-danger bg-danger/5" : "border-l-warning bg-warning/5",
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg",
                  isDanger ? "bg-danger/15 text-danger" : "bg-warning/20 text-warning",
                )}>
                  {isDanger ? <ShieldAlert className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-foreground">{a.patient}</div>
                    <div className="text-xs font-semibold text-foreground tabular-nums">{usd(a.value)}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{a.procedure} · {a.when}</div>
                  <div className="mt-1 text-xs text-foreground/80">{a.reason}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                      isDanger ? "bg-danger/15 text-danger" : "bg-warning/20 text-warning",
                    )}>
                      Riesgo: {a.risk}%
                    </span>
                    <Button size="sm" variant={isDanger ? "default" : "outline"} className={isDanger ? "" : ""}>
                      {a.cta}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
