import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";
import { TestShell, StepKicker } from "@/components/test/TestShell";
import { useLang } from "@/lib/lang";
import { supabase } from "@/integrations/supabase/client";
import { computeArchetypes } from "@/lib/johari";

const Profile = () => {
  const { lang } = useLang();
  const nav = useNavigate();
  const [primary, setPrimary] = useState<any>(null);
  const [secondary, setSecondary] = useState<any>(null);
  const [selfWords, setSelfWords] = useState<string[]>([]);
  const [peerWordsAll, setPeerWordsAll] = useState<string[]>([]);
  const [peerCount, setPeerCount] = useState(0);

  useEffect(() => {
    const id = sessionStorage.getItem("johari.windowId");
    if (!id) { nav("/test"); return; }
    (async () => {
      const { data: w } = await supabase.rpc("get_self_window", { _id: id });
      const { data: peers } = await supabase.rpc("get_peer_words", { _window_id: id });
      if (!w?.[0]) return;
      const self = w[0].self_words ?? [];
      const peerArrays = (peers ?? []).map((p: any) => p.words ?? []);
      const result = computeArchetypes(self, peerArrays);
      setPrimary(result.primary);
      setSecondary(result.secondary);
      setSelfWords(self);
      setPeerWordsAll(peerArrays.flat());
      setPeerCount(peerArrays.length);
    })();
  }, [nav]);

  if (!primary) return <TestShell><div className="text-muted-foreground">Loading…</div></TestShell>;

  const WordBars = ({ words, tone, emptyLabel }: { words: string[]; tone: "peer" | "self"; emptyLabel: string }) => {
    const counts = new Map<string, number>();
    words.forEach((w) => counts.set(w, (counts.get(w) ?? 0) + 1));
    const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
    if (!sorted.length) return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
    const max = sorted[0][1];
    const bar = tone === "peer" ? "bg-primary/70" : "bg-emerald-600/70";
    return (
      <ul className="space-y-2">
        {sorted.map(([word, n]) => (
          <li key={word} className="text-sm">
            <div className="flex items-baseline justify-between gap-3">
              <span className="capitalize text-foreground/85">{word}</span>
              <span className="font-mono text-xs text-muted-foreground">{n}</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className={`h-full rounded-full ${bar}`} style={{ width: `${(n / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const Card = ({ data, tone }: { data: any; tone: "primary" | "secondary" }) => {
    const colors = tone === "primary"
      ? { bg: "bg-amber-50", chip: "bg-amber-700 text-amber-50", title: "text-amber-900" }
      : { bg: "bg-emerald-50", chip: "bg-emerald-700 text-emerald-50", title: "text-emerald-900" };
    const badge = tone === "primary"
      ? (lang === "id" ? "TEMA DOMINAN" : "DOMINANT THEME")
      : (lang === "id" ? "TEMA PENDUKUNG" : "SUPPORTING THEME");
    return (
      <div className={`rounded-3xl ${colors.bg} p-7`}>
        <span className={`inline-block rounded-full px-3 py-1 font-mono text-[10px] tracking-widest ${colors.chip}`}>{badge}</span>
        <h2 className={`mt-4 font-serif text-3xl ${colors.title}`}>{lang === "id" ? data.name_id : data.name_en}</h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/80">{lang === "id" ? data.desc_id : data.desc_en}</p>
        <div className="mt-5">
          <div className="font-mono text-[10px] tracking-widest text-muted-foreground">
            {lang === "id" ? "LANGKAH KONKRET" : "CONCRETE STEPS"}
          </div>
          <ul className="mt-2 space-y-1.5 text-sm text-foreground/85">
            {(lang === "id" ? data.steps_id : data.steps_en).map((s: string, i: number) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <TestShell>
      <StepKicker step={5} label={lang === "id" ? "HASIL JOHARI WINDOW-MU" : "YOUR JOHARI WINDOW RESULTS"} />
      <h1 className="font-serif text-4xl md:text-5xl">
        {lang === "id" ? "Begini orang lain & dirimu sendiri melihatmu" : "How others — and you — see yourself"}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {lang === "id"
          ? `Berdasarkan self-assessment + ${peerCount} peer`
          : `Based on self-assessment + ${peerCount} peer(s)`}
      </p>

      {/* [1] HERO — RAW DATA */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-border/70 bg-background p-6">
          <div className="font-mono text-[10px] tracking-widest text-muted-foreground">
            {lang === "id" ? "BAGAIMANA PEER MELIHATMU" : "HOW OTHERS SEE YOU"}
          </div>
          <h3 className="mt-1 font-serif text-xl">
            {lang === "id" ? "Kata yang paling sering dipilih peer" : "Most-picked words by peers"}
          </h3>
          <div className="mt-4">
            <WordBars
              words={peerWordsAll}
              tone="peer"
              emptyLabel={lang === "id" ? "Belum ada peer yang mengisi." : "No peer responses yet."}
            />
          </div>
        </div>
        <div className="rounded-3xl border border-border/70 bg-background p-6">
          <div className="font-mono text-[10px] tracking-widest text-muted-foreground">
            {lang === "id" ? "BAGAIMANA KAMU MELIHAT DIRIMU" : "HOW YOU SEE YOURSELF"}
          </div>
          <h3 className="mt-1 font-serif text-xl">
            {lang === "id" ? "Kata yang kamu pilih sendiri" : "Words you picked"}
          </h3>
          <div className="mt-4">
            <WordBars
              words={selfWords}
              tone="self"
              emptyLabel={lang === "id" ? "Belum ada data." : "No data yet."}
            />
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {lang === "id"
          ? "Johari Window dirancang sebagai alat refleksi & dialog (Luft & Ingham, 1955). Data di atas adalah hasil pilihan kamu dan peer."
          : "Johari Window was designed as a tool for reflection & dialogue (Luft & Ingham, 1955). The data above is the raw words you and your peers picked."}
      </p>

      {/* [2] TEMA YANG MUNCUL */}
      <div className="mt-10">
        <div className="font-mono text-[10px] tracking-widest text-muted-foreground">
          {lang === "id" ? "TEMA YANG MUNCUL" : "THEMES THAT EMERGE"}
        </div>
        <h2 className="mt-1 font-serif text-2xl md:text-3xl">
          {lang === "id" ? "Pengelompokan tema dari kata-katamu" : "Themes grouped from your words"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {lang === "id"
            ? "Sebagai bantuan refleksi, kami mengelompokkan kata-kata di atas ke 6 tema bakat (Kreator, Pemimpin, Konektor, Analis, Empath, Eksekutor). Pengelompokan ini terinspirasi literatur arketipe bakat, bukan label kepribadian."
            : "To help reflection, we group the words above into 6 talent themes (Creator, Leader, Connector, Analyst, Empath, Executor). This grouping is inspired by talent archetype literature — not a personality label."}
        </p>
      </div>
      <div className="mt-6 space-y-6">
        <Card data={primary} tone="primary" />
        <Card data={secondary} tone="secondary" />
      </div>

      <div className="mt-8 rounded-3xl border border-border/70 bg-muted/30 p-6 md:p-7">
        <div className="font-mono text-[10px] tracking-widest text-muted-foreground">
          {lang === "id" ? "DARI MANA PROFIL INI?" : "WHERE THIS COMES FROM"}
        </div>
        <h3 className="mt-2 font-serif text-2xl">
          {lang === "id" ? "Apa arti hasil ini?" : "What does this mean?"}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-foreground/80">
          {lang === "id"
            ? "Johari Window adalah kerangka refleksi diri yang dikembangkan oleh Joseph Luft & Harrington Ingham (1955). Bar chart di atas adalah data apa adanya — kata-kata sifat yang kamu pilih untuk dirimu dan yang dipilih peer untukmu. Tidak ada interpretasi di sana."
            : "Johari Window is a self-reflection framework developed by Joseph Luft & Harrington Ingham (1955). The bar charts above are raw data — the adjectives you picked for yourself and the ones your peers picked for you. No interpretation added."}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-foreground/80">
          {lang === "id"
            ? "Enam tema (Kreator, Pemimpin, Konektor, Analis, Empath, Eksekutor) adalah kurasi internal Johari Window Indonesia, terinspirasi literatur arketipe bakat — bukan label kepribadian. Pakai sebagai pemicu refleksi, bukan kotak yang mengurungmu."
            : "The six themes (Creator, Leader, Connector, Analyst, Empath, Executor) are an internal Johari Window Indonesia curation, inspired by talent-archetype literature — not a personality label. Use them as reflection prompts, not boxes that confine you."}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          {lang === "id"
            ? "Semakin banyak peer yang mengisi, semakin akurat profilnya."
            : "The more peers respond, the more accurate the profile."}
        </p>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <button onClick={() => nav("/test/result")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {lang === "id" ? "Kembali" : "Back"}
        </button>
        <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => nav("/test/story")}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-medium text-primary-foreground shadow-brand"
        >
          <Share2 className="h-4 w-4" />
          {lang === "id" ? "Bagikan hasil" : "Share results"}
        </button>
        </div>
      </div>
    </TestShell>
  );
};

export default Profile;