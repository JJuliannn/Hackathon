import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { projections } from "@/data/mock";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp, DollarSign } from "lucide-react";

export const Route = createFileRoute("/_app/proyecciones")({
  head: () => ({
    meta: [
      { title: "Proyecciones — SlotRecovery" },
      { name: "description", content: "Proyecciones financieras y caso de negocio para SlotRecovery AI." },
    ],
  }),
  component: ProyeccionesPage,
});

function ProyeccionesPage() {
  return (
    <div>
      <TopBar />
      <div className="space-y-6 p-6">
        <header>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <TrendingUp className="h-3.5 w-3.5" /> Caso de negocio
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">📈 Proyecciones de Impacto</h2>
          <p className="mt-1 text-sm text-muted-foreground">El caso de negocio para inversionistas.</p>
        </header>

        {/* Modelo de ingresos */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Modelo de Ingresos</h3>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Pillar label="SaaS Base" value="$99 / mes" sub="por clínica" />
            <Pillar label="Comisión de éxito" value="5%" sub="~$20 por cita de $400" />
            <Pillar label="Ingreso promedio" value="$279 / mes" sub="por clínica" highlight />
          </div>
        </section>

        {/* Growth table */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h3 className="text-base font-semibold text-foreground">Crecimiento proyectado</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted/40 text-left">
                  <th className="rounded-l-lg px-4 py-3 font-medium text-muted-foreground">Métrica</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Mes 3</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Mes 6</th>
                  <th className="rounded-r-lg px-4 py-3 font-medium text-muted-foreground">Año 1</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <Row label="Clínicas activas" m3="15" m6="60" y1="200" />
                <Row label="Citas recuperadas / mes" m3="135" m6="540" y1="1,800" />
                <Row label="Revenue salvado (clínicas)" m3="$54,000" m6="$216,000" y1="$720,000" />
                <Row label="Ingreso SlotRecovery / mes" m3="$4,185" m6="$16,740" y1="$55,800" />
                <Row label="Ingreso anual" m3="—" m6="—" y1="$669,600" bold />
              </tbody>
            </table>
          </div>
        </section>

        {/* Chart */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h3 className="text-base font-semibold text-foreground">Revenue mensual proyectado — Año 1</h3>
          <p className="text-xs text-muted-foreground">Ingresos SlotRecovery (SaaS + comisión)</p>
          <div className="mt-6 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projections} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  cursor={{ fill: "var(--accent)", opacity: 0.3 }}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Margin */}
        <section className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 shadow-[var(--shadow-elevated)]">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-primary">Margen operativo</div>
              <div className="text-3xl font-bold text-foreground tabular-nums">85%</div>
              <div className="text-sm text-muted-foreground">El costo de procesar cada mensaje con IA es &lt; $0.01</div>
            </div>
          </div>
        </section>

        {/* Quote */}
        <section className="rounded-2xl bg-foreground p-8 text-background">
          <blockquote className="text-xl font-medium leading-relaxed md:text-2xl">
            &ldquo;Una clínica paga <span className="text-primary">$279/mes</span> y recupera{" "}
            <span className="text-success">$3,600</span> en citas perdidas. ROI: <span className="font-bold">13x</span>.
            No somos un gasto, somos una fuente de ingresos.&rdquo;
          </blockquote>
          <div className="mt-4 text-xs uppercase tracking-wider text-background/60">SlotRecovery AI · Pitch a inversionistas</div>
        </section>
      </div>
    </div>
  );
}

function Pillar({ label, value, sub, highlight = false }: { label: string; value: string; sub: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "border-primary/30 bg-primary/5" : "border-border bg-background"}`}>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-bold tabular-nums ${highlight ? "text-primary" : "text-foreground"}`}>{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}

function Row({ label, m3, m6, y1, bold = false }: { label: string; m3: string; m6: string; y1: string; bold?: boolean }) {
  return (
    <tr className={bold ? "bg-primary/5 font-semibold text-foreground" : ""}>
      <td className="px-4 py-3 text-muted-foreground">{label}</td>
      <td className="px-4 py-3 tabular-nums">{m3}</td>
      <td className="px-4 py-3 tabular-nums">{m6}</td>
      <td className="px-4 py-3 tabular-nums">{y1}</td>
    </tr>
  );
}
