import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TestShell, StepKicker } from "@/components/test/TestShell";
import { useLang } from "@/lib/lang";
import { supabase } from "@/integrations/supabase/client";
import { computePanels } from "@/lib/johari";
import { findAdjective } from "@/data/adjectives";
import { cn } from "@/lib/utils";

const Result = () => {
  const { lang } = useLang();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [panels, setPanels] = useState<ReturnType<typeof computePanels> | null>(null);
  const [peerCount, setPeerCount] = useState(0);

  useEffect(() => {
    const id = sessionStorage.getItem("johari.windowId");
    if (!id) { nav("/test"); return; }
    (async () => {
      const { data: w } = await supabase.rpc("get_self_window", { _id: id });
      const { data: peers } = await supabase.from("peer_responses").select("words").eq("window_id", id);
      if (!w?.[0]) return;
      setName(w[0].name);
      setPeerCount(peers?.length ?? 0);
      setPanels(computePanels(w[0].self_words ?? [], (peers ?? []).map((p: any) => p.words)));
    })();
  }, [nav]);

  if (!panels) return <TestShell><div className="text-muted-foreground">Loading…</div></TestShell>;

  const labels = lang === "id"
    ? {
        open: { k: "OPEN AREA", t: "Dikenal bersama", s: "Diri sendiri & orang lain tahu" },
        blind: { k: "BLIND SPOT", t: "Peer lihat, kamu belum", s: "Peluang terbesar untuk tumbuh" },
        hidden: { k: "HIDDEN / FACADE", t: "Kamu tahu, peer belum", s: "Bisa dibuka untuk membangun kepercayaan" },
        unknown: { k: "UNKNOWN", t: "Bakat tersembunyi", s: "Belum disadari siapapun — ini kuncinya" },
      }
    : {
        open: { k: "OPEN", t: "Known to both", s: "What you and others both see" },
        blind: { k: "BLIND SPOT", t: "Others see, you don't", s: "Biggest opportunity to grow" },
        hidden: { k: "HIDDEN / FACADE", t: "You know, others don't", s: "Can be opened to build trust" },
        unknown: { k: "UNKNOWN", t: "Hidden potential", s: "No one knows yet — this is the key" },
      };

  const Pane = ({ pane, words, tone }: { pane: { k: string; t: string; s: string }; words: string[]; tone: "g" | "p" | "l" | "a" }) => {
    const styles = {
      g: { bg: "bg-emerald-50", title: "text-emerald-900", chip: "bg-emerald-600 text-white" },
      p: { bg: "bg-orange-50", title: "text-orange-900", chip: "bg-orange-600 text-white" },
      l: { bg: "bg-violet-50", title: "text-violet-900", chip: "bg-violet-600 text-white" },
      a: { bg: "bg-amber-50", title: "text-amber-900", chip: "bg-amber-600 text-white" },
    }[tone];
    return (
      <div className={cn("rounded-3xl p-6", styles.bg)}>
        <div className={cn("font-mono text-[10px] tracking-widest opacity-80", styles.title)}>{pane.k}</div>
        <div className={cn("mt-1 font-semibold", styles.title)}>{pane.t}</div>
        <div className="mt-1 text-xs text-muted-foreground">{pane.s}</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {words.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
          {words.map((w) => {
            const a = findAdjective(w);
            return (
              <span key={w} className={cn("rounded-full px-3 py-1 text-xs font-medium", styles.chip)}>
                {a ? (lang === "id" ? a.label_id : a.label_en) : w}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <TestShell>
      <StepKicker step={4} label={lang === "id" ? "HASIL" : "RESULTS"} />
      <h1 className="font-serif text-4xl md:text-5xl">
        {lang === "id" ? `Johari Window kamu, ${name}` : `Your Johari Window, ${name}`}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {lang === "id" ? `Berdasarkan self-assessment + ${peerCount} peer` : `Based on self-assessment + ${peerCount} peer(s)`}
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Pane pane={labels.open} words={panels.open} tone="g" />
        <Pane pane={labels.blind} words={panels.blind} tone="p" />
        <Pane pane={labels.hidden} words={panels.hidden} tone="l" />
        <Pane pane={labels.unknown} words={panels.unknown} tone="a" />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button onClick={() => nav("/test/share")} className="text-sm text-muted-foreground hover:text-foreground">
          {lang === "id" ? "Kembali" : "Back"}
        </button>
        <button
          onClick={() => nav("/test/profile")}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 font-medium text-primary-foreground shadow-brand"
        >
          {lang === "id" ? "Lihat profil bakat →" : "See talent profile →"}
        </button>
      </div>
    </TestShell>
  );
};

export default Result;