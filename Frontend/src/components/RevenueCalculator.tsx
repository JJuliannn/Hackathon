import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { usd } from "@/lib/format";
import { TrendingDown, TrendingUp } from "lucide-react";

export function RevenueCalculator() {
  const [cancellations, setCancellations] = useState(15);
  const [value, setValue] = useState(400);

  const loss = cancellations * value;
  const recovered = Math.round(loss * 0.6);

  return (
    <div className="grid gap-8 rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)] md:grid-cols-2">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between text-sm">
            <label className="font-medium text-foreground">Citas canceladas por mes</label>
            <span className="rounded-md bg-muted px-2 py-0.5 font-semibold tabular-nums">{cancellations}</span>
          </div>
          <Slider value={[cancellations]} onValueChange={(v) => setCancellations(v[0])} min={5} max={30} step={1} className="mt-3" />
          <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
            <span>5</span><span>30</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm">
            <label className="font-medium text-foreground">Valor promedio del tratamiento</label>
            <span className="rounded-md bg-muted px-2 py-0.5 font-semibold tabular-nums">{usd(value)}</span>
          </div>
          <Slider value={[value]} onValueChange={(v) => setValue(v[0])} min={200} max={800} step={10} className="mt-3" />
          <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
            <span>$200</span><span>$800</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-danger">
            <TrendingDown className="h-4 w-4" />
            Estás perdiendo
          </div>
          <div className="mt-1 text-4xl font-bold tabular-nums text-foreground">{usd(loss)}</div>
          <div className="text-xs text-muted-foreground">al mes en citas canceladas</div>
        </div>

        <div className="rounded-2xl border border-info/20 bg-info/5 p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-info">
            <TrendingUp className="h-4 w-4" />
            SlotRecovery puede recuperar el 60%
          </div>
          <div className="mt-1 text-4xl font-bold tabular-nums text-info">{usd(recovered)}</div>
          <div className="text-xs text-muted-foreground">de revenue salvado al mes</div>
        </div>
      </div>
    </div>
  );
}
