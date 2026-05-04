import { ADJECTIVES } from "@/data/adjectives";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

type Props = {
  selected: string[];
  onToggle: (id: string) => void;
  min?: number;
  max?: number;
};

export const AdjectiveGrid = ({ selected, onToggle, min = 4, max = 8 }: Props) => {
  const { lang } = useLang();
  return (
    <>
      <div className="mb-3 text-right text-sm text-muted-foreground">
        {lang === "id" ? "Dipilih" : "Selected"}:{" "}
        <span className="font-semibold text-primary">{selected.length}</span> / {max}
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {ADJECTIVES.map((a) => {
          const active = selected.includes(a.id);
          const disabled = !active && selected.length >= max;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => !disabled && onToggle(a.id)}
              className={cn(
                "rounded-2xl border-2 p-4 text-left transition",
                active
                  ? "border-primary bg-accent"
                  : "border-border bg-background hover:border-primary/40",
                disabled && "cursor-not-allowed opacity-40",
              )}
            >
              <div className={cn("text-sm font-semibold", active ? "text-foreground" : "text-foreground")}>
                {lang === "id" ? a.label_id : a.label_en}
              </div>
              <div className={cn("mt-1 text-xs", active ? "text-primary" : "text-muted-foreground")}>
                {lang === "id" ? a.sub_id : a.sub_en}
              </div>
            </button>
          );
        })}
      </div>
      {selected.length < min && (
        <div className="mt-3 text-right text-xs text-muted-foreground">
          {lang === "id" ? `Pilih minimal ${min} kata` : `Pick at least ${min} words`}
        </div>
      )}
    </>
  );
};