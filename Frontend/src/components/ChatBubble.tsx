import { cn } from "@/lib/utils";

export function ChatBubble({
  side = "in",
  children,
  time,
}: {
  side?: "in" | "out";
  children: React.ReactNode;
  time?: string;
}) {
  return (
    <div className={cn("flex w-full", side === "out" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
          side === "out"
            ? "rounded-br-sm bg-[#dcf8c6] text-gray-900"
            : "rounded-bl-sm bg-white text-gray-900 border border-border",
        )}
      >
        <div className="whitespace-pre-wrap leading-relaxed">{children}</div>
        {time && <div className="mt-1 text-right text-[10px] text-muted-foreground">{time}</div>}
      </div>
    </div>
  );
}
