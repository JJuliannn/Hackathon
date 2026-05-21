import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { KpiCard } from "@/components/KpiCard";
import { Timeline24h } from "@/components/Timeline24h";
import { AlertsPanel } from "@/components/AlertsPanel";
import { DollarSign, CalendarCheck, TrendingDown, Timer } from "lucide-react";
import { fetchDashboard, type DashboardData } from "@/lib/api";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SlotRecovery AI" },
      { name: "description", content: "Resumen de revenue recuperado, citas salvadas y agenda en tiempo real." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [data, setData]       = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const kpis = data?.kpis;
  const revenueVal  = kpis ? `$${kpis.revenue_recovered.toLocaleString()}` : "$3,600";
  const savedVal    = kpis ? `${kpis.appointments_saved}` : "9";
  const savedSub    = kpis ? `de ${kpis.appointments_cancelled} en riesgo` : "de 15 en riesgo";
  const noShowVal   = kpis ? `${kpis.no_show_rate}%` : "2.4%";
  const noShowSub   = kpis ? `antes: ${kpis.original_no_show_rate}%` : "antes: 18%";
  const noShowDelta = kpis
    ? `↓ ${Math.round((1 - kpis.no_show_rate / kpis.original_no_show_rate) * 100)}%`
    : "↓ 87%";
  const recoveryVal = kpis ? `${kpis.avg_recovery_time_min} min` : "11 min";

  return (
    <div>
      <TopBar />
      <div className="space-y-6 p-6">

        {loading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            Conectando al backend…
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            icon={DollarSign}
            label="Revenue Recuperado"
            value={revenueVal}
            subtitle="este mes"
            delta="↑ 23%"
            deltaTone="success"
            accent="success"
          />
          <KpiCard
            icon={CalendarCheck}
            label="Citas Salvadas"
            value={savedVal}
            subtitle={savedSub}
            accent="info"
          >
            <span className="text-sm text-muted-foreground">/ {kpis?.appointments_cancelled ?? 15}</span>
          </KpiCard>
          <KpiCard
            icon={TrendingDown}
            label="Tasa No-Show"
            value={noShowVal}
            subtitle={noShowSub}
            delta={noShowDelta}
            deltaTone="success"
            accent="primary"
          />
          <KpiCard
            icon={Timer}
            label="Tiempo de Relleno"
            value={recoveryVal}
            subtitle="promedio"
            accent="warning"
          />
        </div>

        <div id="agenda" className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <Timeline24h appointments={data?.appointments} />
          <AlertsPanel alerts={data?.alerts} />
        </div>

      </div>
    </div>
  );
}