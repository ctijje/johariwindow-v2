import { findWord } from "@/data/adjectives";
import { cn } from "@/lib/utils";

type Props = {
  words: string[];
  ranked: string[];
  onRankChange: (ranked: string[]) => void;
};

export const RankingList = ({ words, ranked, onRankChange }: Props) => {
  const getRank = (id: string) => {
    const idx = ranked.indexOf(id);
    return idx === -1 ? null : idx + 1;
  };

  const handleClick = (id: string) => {
    const idx = ranked.indexOf(id);
    if (idx !== -1) {
      // Already ranked — remove it and shift others down
      onRankChange(ranked.filter((w) => w !== id));
    } else {
      // Not ranked yet — add to end
      if (ranked.length < 5) {
        onRankChange([...ranked, id]);
      }
    }
  };

  const rankColors: Record<number, string> = {
    1: "bg-primary text-primary-foreground",
    2: "bg-primary/80 text-primary-foreground",
    3: "bg-primary/60 text-primary-foreground",
    4: "bg-primary/40 text-primary-foreground",
    5: "bg-primary/25 text-primary",
  };

  return (
    <div className="space-y-2.5">
      <p className="text-xs text-muted-foreground mb-4">
        Klik kata untuk mengurutkan — mulai dari yang <strong>paling kuat</strong> menggambarkan kamu (1) hingga yang <em>paling lemah</em> dari 5 kata ini (5). Klik lagi untuk membatalkan.
      </p>
      {words.map((id) => {
        const w = findWord(id);
        const rank = getRank(id);
        const isRanked = rank !== null;

        return (
          <button
            key={id}
            type="button"
            onClick={() => handleClick(id)}
            className={cn(
              "w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-150",
              isRanked
                ? "border-primary bg-accent"
                : "border-border bg-background hover:border-primary/40",
            )}
          >
            <div className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all",
              isRanked ? rankColors[rank!] : "bg-muted text-muted-foreground"
            )}>
              {isRanked ? rank : "·"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className={cn("font-semibold text-sm", isRanked ? "text-primary" : "text-foreground")}>
                  {w?.en ?? id}
                </span>
                <span className="text-xs text-muted-foreground">{w?.id_label}</span>
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug line-clamp-1">
                {w?.description_id}
              </p>
            </div>
            <div className="shrink-0 text-[10px] text-muted-foreground">
              {isRanked ? `#${rank}` : "klik"}
            </div>
          </button>
        );
      })}
      <div className="flex gap-1.5 flex-wrap pt-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
            ranked.length >= n ? rankColors[n] : "bg-muted text-muted-foreground/40"
          )}>
            {n}
          </div>
        ))}
        <span className="ml-1 self-center text-xs text-muted-foreground">
          {ranked.length < 5 ? `${5 - ranked.length} lagi` : "Semua sudah diurutkan ✓"}
        </span>
      </div>
    </div>
  );
};
