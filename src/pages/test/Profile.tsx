import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Sparkles } from "lucide-react";
import { TestShell, StepKicker } from "@/components/test/TestShell";
import { useLang } from "@/lib/lang";
import { supabase } from "@/integrations/supabase/client";
import { computeArchetypes } from "@/lib/johari";
import { toast } from "sonner";

const Profile = () => {
  const { lang } = useLang();
  const nav = useNavigate();
  const [primary, setPrimary] = useState<any>(null);
  const [secondary, setSecondary] = useState<any>(null);

  useEffect(() => {
    const id = sessionStorage.getItem("johari.windowId");
    if (!id) { nav("/test"); return; }
    (async () => {
      const { data: w } = await supabase.rpc("get_self_window", { _id: id });
      const { data: peers } = await supabase.rpc("get_peer_words", { _window_id: id });
      if (!w?.[0]) return;
      const result = computeArchetypes(w[0].self_words ?? [], (peers ?? []).map((p: any) => p.words));
      setPrimary(result.primary);
      setSecondary(result.secondary);
    })();
  }, [nav]);

  if (!primary) return <TestShell><div className="text-muted-foreground">Loading…</div></TestShell>;

  const Card = ({ data, tone }: { data: any; tone: "primary" | "secondary" }) => {
    const colors = tone === "primary"
      ? { bg: "bg-amber-50", chip: "bg-amber-700 text-amber-50", title: "text-amber-900", box: "bg-amber-100/60" }
      : { bg: "bg-emerald-50", chip: "bg-emerald-700 text-emerald-50", title: "text-emerald-900", box: "bg-emerald-100/60" };
    const badge = tone === "primary"
      ? (lang === "id" ? "POTENSI UTAMA" : "PRIMARY POTENTIAL")
      : (lang === "id" ? "POTENSI PENDUKUNG" : "SUPPORTING POTENTIAL");
    return (
      <div className={`rounded-3xl ${colors.bg} p-7`}>
        <span className={`inline-block rounded-full px-3 py-1 font-mono text-[10px] tracking-widest ${colors.chip}`}>{badge}</span>
        <h2 className={`mt-4 font-serif text-3xl ${colors.title}`}>{lang === "id" ? data.name_id : data.name_en}</h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/80">{lang === "id" ? data.desc_id : data.desc_en}</p>
        <div className={`mt-5 rounded-2xl ${colors.box} p-4`}>
          <div className={`font-mono text-[10px] tracking-widest ${colors.title} opacity-80`}>
            {lang === "id" ? "ASSESSMENT LANJUTAN" : "RECOMMENDED ASSESSMENTS"}
          </div>
          <div className="mt-1 text-sm font-medium">{lang === "id" ? data.assessment_id : data.assessment_en}</div>
        </div>
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
      <StepKicker step={5} label={lang === "id" ? "PROFIL BAKAT TERSEMBUNYI" : "HIDDEN TALENT PROFILE"} />
      <h1 className="font-serif text-4xl md:text-5xl">{lang === "id" ? "Profil bakat tersembunyimu" : "Your hidden talent profile"}</h1>
      <p className="mt-2 text-muted-foreground">
        {lang === "id" ? "Berdasarkan kombinasi kata diri & peer." : "Based on your self + peer words."}
      </p>

      <div className="mt-8 space-y-6">
        <Card data={primary} tone="primary" />
        <Card data={secondary} tone="secondary" />
      </div>

      <div className="mt-8 rounded-3xl border border-border/70 bg-muted/30 p-6 md:p-7">
        <div className="font-mono text-[10px] tracking-widest text-muted-foreground">
          {lang === "id" ? "DARI MANA PROFIL INI?" : "WHERE THIS COMES FROM"}
        </div>
        <h3 className="mt-2 font-serif text-2xl">
          {lang === "id" ? "Cara kami menentukan potensimu" : "How we determine your potential"}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-foreground/80">
          {lang === "id"
            ? "Setiap kata sifat di Johari Window dipetakan ke salah satu dari enam arketipe bakat: Kreator, Pemimpin, Konektor, Analis, Empath, dan Eksekutor. Kami menghitung skor setiap arketipe dari kata yang kamu pilih (bobot 2) dan kata yang dipilih peer untukmu (bobot 1)."
            : "Each Johari Window adjective is mapped to one of six talent archetypes: Creator, Leader, Connector, Analyst, Empath, and Executor. We score each archetype from the words you picked (weight 2) and the words your peers picked for you (weight 1)."}
        </p>
        <ul className="mt-4 space-y-2 text-sm text-foreground/85">
          <li>
            <span className="font-semibold">{lang === "id" ? "Potensi Utama" : "Primary Potential"}:</span>{" "}
            {lang === "id"
              ? "arketipe dengan skor tertinggi — paling sering muncul dari dirimu dan orang-orang sekitarmu."
              : "the highest-scoring archetype — what shows up most from you and the people around you."}
          </li>
          <li>
            <span className="font-semibold">{lang === "id" ? "Potensi Pendukung" : "Supporting Potential"}:</span>{" "}
            {lang === "id"
              ? "arketipe dengan skor tertinggi kedua — kekuatan pelengkap yang memperkuat potensi utamamu."
              : "the second-highest archetype — a complementary strength that reinforces your primary."}
          </li>
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
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