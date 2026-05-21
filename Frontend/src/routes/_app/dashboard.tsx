import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { KpiCard } from "@/components/KpiCard";
import { Timeline24h } from "@/components/Timeline24h";
import { AlertsPanel } from "@/components/AlertsPanel";
import { DollarSign, CalendarCheck, TrendingDown, Timer } from "lucide-react";

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
  return (
    <div>
      <TopBar />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            icon={DollarSign}
            label="Revenue Recuperado"
            value="$3,600"
            subtitle="este mes"
            delta="↑ 23%"
            deltaTone="success"
            accent="success"
          />
          <KpiCard
            icon={CalendarCheck}
            label="Citas Salvadas"
            value="9"
            subtitle="de 15 en riesgo"
            accent="info"
          >
            <span className="text-sm text-muted-foreground">/ 15</span>
          </KpiCard>
          <KpiCard
            icon={TrendingDown}
            label="Tasa No-Show"
            value="2.4%"
            subtitle="antes: 18%"
            delta="↓ 87%"
            deltaTone="success"
            accent="primary"
          />
          <KpiCard
            icon={Timer}
            label="Tiempo de Relleno"
            value="11 min"
            subtitle="promedio"
            accent="warning"
          />
        </div>

        <div id="agenda" className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <Timeline24h />
          <AlertsPanel />
        </div>
      </div>
    </div>
  );
}
