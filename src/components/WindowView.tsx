import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { computePanels, computeArchetypes } from "@/lib/johari";
import { findAdjective } from "@/data/adjectives";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

type Props = { windowId: string };

export const WindowView = ({ windowId }: Props) => {
  const { lang } = useLang();
  const [data, setData] = useState<{ name: string; self: string[]; peers: string[][] } | null>(null);

  useEffect(() => {
    (async () => {
      const { data: w } = await supabase.rpc("get_window_full", { _id: windowId });
      const { data: peers } = await supabase.rpc("get_peer_words", { _window_id: windowId });
      if (!w?.[0]) return;
      setData({
        name: w[0].name,
        self: w[0].self_words ?? [],
        peers: (peers ?? []).map((p: any) => p.words ?? []),
      });
    })();
  }, [windowId]);

  if (!data) return <div className="text-muted-foreground">Loading…</div>;

  const panels = computePanels(data.self, data.peers);
  const arch = computeArchetypes(data.self, data.peers);
  const peerCount = data.peers.length;

  const labels = lang === "id"
    ? { open: "Open · Dikenal bersama", blind: "Blind Spot · Peer lihat, kamu belum",
        hidden: "Hidden · Kamu tahu, peer belum", unknown: "Unknown · Belum disadari",
        primary: "TEMA DOMINAN", secondary: "TEMA PENDUKUNG",
        peers: `Berdasarkan self + ${peerCount} peer` }
    : { open: "Open · Known to both", blind: "Blind Spot · Others see, you don't",
        hidden: "Hidden · You know, others don't", unknown: "Unknown · Not yet known",
        primary: "DOMINANT THEME", secondary: "SUPPORTING THEME",
        peers: `Based on self + ${peerCount} peer(s)` };

  const Pane = ({ title, words, tone }: { title: string; words: string[]; tone: "g" | "p" | "l" | "a" }) => {
    const styles = {
      g: { bg: "bg-emerald-50", title: "text-emerald-900", chip: "bg-emerald-600 text-white" },
      p: { bg: "bg-orange-50", title: "text-orange-900", chip: "bg-orange-600 text-white" },
      l: { bg: "bg-violet-50", title: "text-violet-900", chip: "bg-violet-600 text-white" },
      a: { bg: "bg-amber-50", title: "text-amber-900", chip: "bg-amber-600 text-white" },
    }[tone];
    return (
      <div className={cn("rounded-3xl p-6", styles.bg)}>
        <div className={cn("font-mono text-[11px] font-medium", styles.title)}>{title}</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {words.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
          {words.map((w) => {
            const a = findAdjective(w);
            return <span key={w} className={cn("rounded-full px-3 py-1 text-xs font-medium", styles.chip)}>
              {a ? (lang === "id" ? a.label_id : a.label_en) : w}
            </span>;
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <p className="text-sm text-muted-foreground">{labels.peers}</p>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Pane title={labels.open} words={panels.open} tone="g" />
        <Pane title={labels.blind} words={panels.blind} tone="p" />
        <Pane title={labels.hidden} words={panels.hidden} tone="l" />
        <Pane title={labels.unknown} words={panels.unknown} tone="a" />
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {([["primary", arch.primary], ["secondary", arch.secondary]] as const).map(([k, p]) => (
          <div key={k} className="rounded-3xl border border-border/70 bg-card p-6">
            <span className="inline-block rounded-full bg-accent px-3 py-1 font-mono text-[10px] tracking-widest text-primary">
              {k === "primary" ? labels.primary : labels.secondary}
            </span>
            <h3 className="mt-3 font-serif text-2xl">{lang === "id" ? p.name_id : p.name_en}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{lang === "id" ? p.desc_id : p.desc_en}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WindowView;