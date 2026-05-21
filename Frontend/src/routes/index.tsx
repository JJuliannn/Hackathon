import { createFileRoute, Link } from "@tanstack/react-router";
import { StatCounter } from "@/components/StatCounter";
import { RevenueCalculator } from "@/components/RevenueCalculator";
import { ArrowRight, Radio, Brain, Zap, DollarSign, CalendarSync } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SlotRecovery AI — Recupera las citas que pierdes" },
      { name: "description", content: "Las clínicas de estética pierden $6,000/mes por cancelaciones. SlotRecovery las rellena en minutos con IA." },
      { property: "og:title", content: "SlotRecovery AI" },
      { property: "og:description", content: "Recupera las citas que pierdes. Automáticamente." },
    ],
  }),
  component: Landing,
});

const steps = [
  { icon: "📡", title: "Detectamos", text: "Monitoreamos las últimas 48h de tu agenda" },
  { icon: "🧠", title: "Analizamos", text: "IA analiza las respuestas de tus pacientes" },
  { icon: "⚡", title: "Rellenamos", text: "Activamos tu lista de espera en segundos" },
  { icon: "💰", title: "Cobramos solo si funciona", text: "Comisión de éxito por cita recuperada" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-5 md:px-10">
        <div className="flex items-center gap-2.5 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur">
            <CalendarSync className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">SlotRecovery</div>
            <div className="text-[11px] uppercase tracking-wider opacity-70">AI</div>
          </div>
        </div>
        <Link to="/dashboard">
          <Button variant="secondary" size="sm">Ver Demo</Button>
        </Link>
      </header>

      {/* Hero */}
      <section
        className="relative overflow-hidden px-6 pt-32 pb-24 text-white md:px-10 md:pt-40 md:pb-32"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> En vivo · Microsoft Tech Week 2026
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Recupera las citas que pierdes.
            <br />
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Automáticamente.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
            Las clínicas de estética pierden <strong className="text-white">$6,000/mes</strong> por cancelaciones de última hora. Nosotros las rellenamos en minutos con IA.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <HeroStat label="recuperados" value={<><span>$</span><StatCounter value={45200} /></>} />
            <HeroStat label="ocupación" value={<><StatCounter value={94} />%</>} />
            <HeroStat label="prom. de relleno" value={<><StatCounter value={11} /> min</>} />
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/dashboard">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Ver Demo en Vivo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#calculadora" className="text-sm font-medium text-white/80 hover:text-white">
              ¿Cuánto estoy perdiendo? →
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Cómo funciona</h2>
            <p className="mt-3 text-muted-foreground">Cuatro pasos. Cero fricción para tu clínica.</p>
          </div>

          <div className="mt-16 flex flex-col items-stretch gap-4 lg:flex-row lg:items-center">
            {steps.map((s, i) => (
              <div key={s.title} className="flex flex-1 items-stretch gap-4 lg:flex-col lg:items-center">
                <div className="flex flex-1 flex-col rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                  <div className="text-3xl">{s.icon}</div>
                  <div className="mt-3 text-sm font-semibold uppercase tracking-wider text-primary">
                    Paso {i + 1}
                  </div>
                  <div className="mt-1 text-lg font-semibold text-foreground">{s.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{s.text}</div>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex shrink-0 items-center justify-center text-primary/40 lg:rotate-0">
                    <ArrowRight className="h-6 w-6 rotate-90 lg:rotate-0" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculadora" className="bg-muted/30 px-6 py-24 md:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">¿Cuánto estás perdiendo?</h2>
            <p className="mt-3 text-muted-foreground">Calculá en 5 segundos tu pérdida real por cancelaciones.</p>
          </div>
          <div className="mt-10">
            <RevenueCalculator />
          </div>
          <div className="mt-10 text-center">
            <Link to="/dashboard">
              <Button size="lg">
                Ver Demo en Vivo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        Hecho en Costa Rica 🇨🇷 — Microsoft Tech Week Hackathon 2026
      </footer>
    </div>
  );
}

function HeroStat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
      <div className="text-3xl font-bold tabular-nums md:text-4xl">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-white/70">{label}</div>
    </div>
  );
}
