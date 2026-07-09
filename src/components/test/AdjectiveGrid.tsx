import { WORDS } from "@/data/adjectives";
import { cn } from "@/lib/utils";

type Props = {
  selected: string[];
  onToggle: (id: string) => void;
};

export const AdjectiveGrid = ({ selected, onToggle }: Props) => {
  const atMax = selected.length >= 5;

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Pilih tepat <span className="font-semibold text-foreground">5 kata</span>
        </span>
        <span className={cn(
          "font-mono text-sm font-semibold tabular-nums",
          selected.length === 5 ? "text-emerald-600" : "text-primary"
        )}>
          {selected.length}/5 dipilih
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
        {WORDS.map((w) => {
          const active = selected.includes(w.id);
          const disabled = !active && atMax;
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => !disabled && onToggle(w.id)}
              className={cn(
                "rounded-2xl border-2 p-3.5 text-left transition-all duration-150",
                active
                  ? "border-primary bg-accent shadow-sm"
                  : "border-border bg-background hover:border-primary/40 hover:shadow-sm",
                disabled && "cursor-not-allowed opacity-35",
              )}
            >
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className={cn("text-sm font-semibold leading-tight", active ? "text-primary" : "text-foreground")}>
                  {w.en}
                </span>
                <span className={cn("text-xs leading-tight", active ? "text-primary/70" : "text-muted-foreground")}>
                  {w.id_label}
                </span>
              </div>
              <p className={cn("mt-1.5 text-[11px] leading-snug", active ? "text-primary/80" : "text-muted-foreground")}>
                {w.description_id}
              </p>
              <p className={cn("mt-0.5 text-[10px] leading-snug", active ? "text-primary/60" : "text-muted-foreground/60")}>
                {w.description_en}
              </p>
            </button>
          );
        })}
      </div>
      {selected.length < 5 && (
        <p className="mt-3 text-right text-xs text-muted-foreground">
          Pilih {5 - selected.length} kata lagi untuk lanjut
        </p>
      )}
      {selected.length > 5 && (
        <p className="mt-3 text-right text-xs text-red-500 font-medium">
          Maksimal 5 kata — hapus {selected.length - 5} kata
        </p>
      )}
    </>
  );
};
