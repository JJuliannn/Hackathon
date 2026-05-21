import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { WaitlistSimulation } from "@/components/WaitlistSimulation";
import { Zap } from "lucide-react";
import { fetchWaitlist, type WaitlistCandidate } from "@/lib/api";

export const Route = createFileRoute("/_app/lista-espera")({
  head: () => ({
    meta: [
      { title: "Lista de Espera — SlotRecovery" },
      { name: "description", content: "Subasta express que rellena tus espacios vacíos en minutos." },
    ],
  }),
  component: ListaEsperaPage,
});

function ListaEsperaPage() {
  const [candidates, setCandidates] = useState<WaitlistCandidate[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    fetchWaitlist()
      .then(setCandidates)
      .catch(() => setCandidates([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <TopBar />
      <div className="space-y-6 p-6">
        <header>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Zap className="h-3.5 w-3.5" /> Tiempo real
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            ⚡ Subasta Express de Espacios
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Rellenamos tus espacios vacíos en minutos, no en días.
          </p>

          {/* Contador de candidatos en espera */}
          {!loading && candidates.length > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs text-primary">
              <span className="font-semibold">{candidates.length}</span>
              paciente{candidates.length !== 1 ? "s" : ""} en lista de espera activa
            </div>
          )}
        </header>

        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-border bg-card p-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
              <p className="text-sm text-muted-foreground">Cargando lista de espera…</p>
            </div>
          </div>
        ) : (
          <WaitlistSimulation candidates={candidates} />
        )}
      </div>
    </div>
  );
}