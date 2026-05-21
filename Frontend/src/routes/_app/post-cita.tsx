import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { ChatBubble } from "@/components/ChatBubble";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardCheck, Receipt, MessageCircle, CheckCircle2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_app/post-cita")({
  head: () => ({
    meta: [
      { title: "Post-Cita — SlotRecovery" },
      { name: "description", content: "Seguimiento post-cita, facturación por éxito y fidelización." },
    ],
  }),
  component: PostCitaPage,
});

function PostCitaPage() {
  return (
    <div>
      <TopBar />
      <div className="space-y-6 p-6">
        <header>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <ClipboardCheck className="h-3.5 w-3.5" /> Seguimiento
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">📋 Seguimiento Post-Cita</h2>
          <p className="mt-1 text-sm text-muted-foreground">Cobramos solo cuando funciona. Fidelizamos siempre.</p>
        </header>

        {/* Verificación */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h3 className="text-base font-semibold text-foreground">Verificación de Asistencia</h3>
          <p className="text-xs text-muted-foreground">Confirmamos quién asistió antes de facturar.</p>

          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Paciente</TableHead>
                  <TableHead>Procedimiento</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Facturado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Carlos M.</TableCell>
                  <TableCell>Botox</TableCell>
                  <TableCell className="tabular-nums">11:00 AM</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
                      <CheckCircle2 className="h-3 w-3" /> Asistió
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">$450</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Sofía R.</TableCell>
                  <TableCell>Ác. Hialurónico</TableCell>
                  <TableCell className="tabular-nums">9:00 AM</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
                      <CheckCircle2 className="h-3 w-3" /> Asistió
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">$380</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success">
            2 citas recuperadas hoy = <span className="font-bold">$830 salvados</span>
          </div>
        </section>

        {/* Factura */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Facturación Automática por Éxito</h3>
          </div>

          <div className="mt-4 rounded-xl border border-border bg-background p-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Clínica Bella</div>
                <div className="text-sm font-semibold text-foreground">Factura del día</div>
              </div>
              <div className="text-xs text-muted-foreground tabular-nums">#INV-2026-0421</div>
            </div>

            <div className="mt-3 space-y-2 text-sm">
              <LineItem desc="Cita recuperada: Carlos M. (Botox $450)" calc="Comisión 5%" amount="$22.50" />
              <LineItem desc="Cita recuperada: Sofía R. (Ác. Hialurónico $380)" calc="Comisión 5%" amount="$19.00" />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <div className="text-sm font-medium text-muted-foreground">Total</div>
              <div className="text-2xl font-bold tabular-nums text-foreground">$41.50</div>
            </div>

            <div className="mt-4 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
              💡 La clínica ganó <strong>$830</strong>, SlotRecovery cobró <strong>$41.50</strong> —{" "}
              <span className="font-bold">ROI: 20x</span>
            </div>
          </div>
        </section>

        {/* Seguimiento 24h */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-info" />
            <h3 className="text-base font-semibold text-foreground">Seguimiento al Paciente (24h después)</h3>
          </div>

          <div className="mt-4 rounded-2xl bg-[#e5ddd5] p-4 space-y-2">
            <ChatBubble side="out" time="11:02 AM">
              ¡Hola Carlos! 😊 Esperamos que estés muy bien tras tu aplicación de Botox de ayer. Recordá evitar ejercicio intenso por 24h y no tocar la zona tratada. ¿Cómo te has sentido?
            </ChatBubble>
            <ChatBubble side="in" time="11:14 AM">
              Todo bien! Pero tengo un poquito hinchado el lado derecho, es normal?
            </ChatBubble>
            <ChatBubble side="out" time="11:14 AM">
              Es completamente normal una leve hinchazón las primeras 24-48h. Si persiste más de 3 días, contactanos. ¡Estamos para vos! 💙
            </ChatBubble>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-warning">
                <AlertTriangle className="h-4 w-4" /> Detección automática
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Si el paciente reporta algo fuera de lo normal → Alerta automática a la Dra. Gabriela.
              </p>
            </div>
            <div className="rounded-xl border border-info/30 bg-info/5 p-4">
              <div className="text-[11px] uppercase tracking-wider text-info">Retención</div>
              <div className="mt-1 text-2xl font-bold text-foreground tabular-nums">73%</div>
              <p className="text-xs text-muted-foreground">de pacientes recuperados vuelven a agendar (7 de 10).</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function LineItem({ desc, calc, amount }: { desc: string; calc: string; amount: string }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-foreground">{desc}</div>
        <div className="text-xs text-muted-foreground">{calc}</div>
      </div>
      <div className="font-semibold tabular-nums text-foreground">{amount}</div>
    </div>
  );
}
