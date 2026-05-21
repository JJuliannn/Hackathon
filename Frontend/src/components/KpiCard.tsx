import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function KpiCard({
  icon: Icon,
  label,
  value,
  subtitle,
  delta,
  deltaTone = "success",
  accent = "primary",
  children,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  subtitle?: string;
  delta?: string;
  deltaTone?: "success" | "danger" | "info";
  accent?: "primary" | "success" | "danger" | "info" | "warning";
  children?: React.ReactNode;
}) {
  const accentBg = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    danger: "bg-danger/10 text-danger",
    info: "bg-info/10 text-info",
    warning: "bg-warning/15 text-warning",
  }[accent];

  const deltaCls = {
    success: "bg-success/10 text-success",
    danger: "bg-danger/10 text-danger",
    info: "bg-info/10 text-info",
  }[deltaTone];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between">
        <div className={cn("inline-flex h-10 w-10 items-center justify-center rounded-xl", accentBg)}>
          <Icon className="h-5 w-5" />
        </div>
        {delta && (
          <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", deltaCls)}>{delta}</span>
        )}
      </div>
      <div className="mt-4">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="mt-1 flex items-baseline gap-3">
          <div className="text-3xl font-semibold tracking-tight text-foreground">{value}</div>
          {children}
        </div>
        {subtitle && <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>}
      </div>
    </div>
  );
}
