import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarClock,
  Brain,
  Users,
  ClipboardCheck,
  TrendingUp,
  CalendarSync,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard", label: "Agenda 24h", icon: CalendarClock, match: "/dashboard#agenda" },
  { to: "/analisis", label: "Análisis IA", icon: Brain },
  { to: "/lista-espera", label: "Lista de Espera", icon: Users },
  { to: "/post-cita", label: "Post-Cita", icon: ClipboardCheck },
  { to: "/proyecciones", label: "Proyecciones", icon: TrendingUp },
];

export function AppSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary/20 text-sidebar-primary">
          <CalendarSync className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">SlotRecovery</div>
          <div className="text-[11px] uppercase tracking-wider text-sidebar-foreground/60">AI</div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {items.map((it, i) => {
          const active = path === it.to && i === 0 ? true : path === it.to && it.label === "Dashboard";
          const isActive = path === it.to;
          return (
            <Link
              key={it.label}
              to={it.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <it.icon className="h-4 w-4 shrink-0" />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-lg bg-sidebar-accent/60 p-3">
          <div className="text-xs font-medium text-sidebar-foreground">Clínica Bella</div>
          <div className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-sidebar-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-sidebar-primary" />
            Plan Premium
          </div>
        </div>
      </div>
    </aside>
  );
}
