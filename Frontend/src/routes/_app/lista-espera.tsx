import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { WaitlistSimulation } from "@/components/WaitlistSimulation";
import { Zap } from "lucide-react";

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
  return (
    <div>
      <TopBar />
      <div className="space-y-6 p-6">
        <header>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Zap className="h-3.5 w-3.5" /> Tiempo real
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">⚡ Subasta Express de Espacios</h2>
          <p className="mt-1 text-sm text-muted-foreground">Rellenamos tus espacios vacíos en minutos, no en días.</p>
        </header>

        <WaitlistSimulation />
      </div>
    </div>
  );
}
