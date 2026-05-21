import { Bell } from "lucide-react";
import { todayEs } from "@/lib/format";

export function TopBar({ greeting }: { greeting?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-background/80 px-6 py-4 backdrop-blur">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {greeting ?? "Buenos días, Dra. Gabriela"} <span className="ml-1">👋</span>
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground capitalize">{todayEs()}</p>
      </div>
      <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
        <Bell className="h-4 w-4" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
      </button>
    </div>
  );
}
