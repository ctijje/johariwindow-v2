import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TestShell, StepKicker } from "@/components/test/TestShell";
import { AdjectiveGrid } from "@/components/test/AdjectiveGrid";
import { useLang } from "@/lib/lang";
import { supabase } from "@/integrations/supabase/client";
import { generateCode } from "@/lib/johari";
import { toast } from "sonner";

const Words = () => {
  const { lang } = useLang();
  const nav = useNavigate();
  const [selected, setSelected] = useState<string[]>(
    JSON.parse(sessionStorage.getItem("johari.selfWords") || "[]")
  );
  const [loading, setLoading] = useState(false);

  const profile = JSON.parse(sessionStorage.getItem("johari.profile") || "null");
  if (!profile) { nav("/test"); return null; }

  const toggle = (id: string) =>
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const submit = async () => {
    if (selected.length < 4 || selected.length > 8) return;
    setLoading(true);
    // Try a few codes in case of collision
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateCode();
      const { data, error } = await supabase.from("windows").insert({
        ...profile, code, self_words: selected,
      }).select("id, code").single();
      if (!error && data) {
        sessionStorage.setItem("johari.selfWords", JSON.stringify(selected));
        sessionStorage.setItem("johari.windowId", data.id);
        sessionStorage.setItem("johari.code", data.code);
        nav("/test/share");
        return;
      }
      if (error && !error.message.includes("code")) {
        toast.error(error.message); setLoading(false); return;
      }
    }
    toast.error("Failed to create window"); setLoading(false);
  };

  return (
    <TestShell>
      <StepKicker step={2} label={lang === "id" ? "Pilih kata" : "Pick words"} />
      <h1 className="font-serif text-4xl md:text-5xl">
        {lang === "id" ? "Pilih kata yang paling mencerminkan dirimu" : "Pick the words that reflect you most"}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {lang === "id"
          ? "Pilih kata yang paling sesuai dan menggambarkan kamu, bukan yang kamu inginkan, tapi yang memang paling menggambarkan kamu. Pilih 4–8 kata."
          : "Pick words that genuinely describe you — not what you wish you were. Choose 4–8."}
      </p>

      <div className="mt-8">
        <AdjectiveGrid selected={selected} onToggle={toggle} />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button onClick={() => nav("/test")} className="text-sm text-muted-foreground hover:text-foreground">
          {lang === "id" ? "Kembali" : "Back"}
        </button>
        <button
          disabled={selected.length < 4 || selected.length > 8 || loading}
          onClick={submit}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 font-medium text-primary-foreground shadow-brand disabled:opacity-40"
        >
          {lang === "id" ? "Lanjut bagikan ke peer →" : "Next: share with peers →"}
        </button>
      </div>
    </TestShell>
  );
};

export default Words;