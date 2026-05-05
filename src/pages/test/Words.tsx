import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TestShell, StepKicker } from "@/components/test/TestShell";
import { AdjectiveGrid } from "@/components/test/AdjectiveGrid";
import { useLang } from "@/lib/lang";

const Words = () => {
  const { lang } = useLang();
  const nav = useNavigate();
  const [selected, setSelected] = useState<string[]>(
    JSON.parse(sessionStorage.getItem("johari.selfWords") || "[]")
  );

  const toggle = (id: string) =>
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const next = () => {
    if (selected.length < 5 || selected.length > 20) return;
    sessionStorage.setItem("johari.selfWords", JSON.stringify(selected));
    nav("/test/data");
  };

  return (
    <TestShell>
      <StepKicker step={1} label={lang === "id" ? "Pilih kata" : "Pick words"} />
      <h1 className="font-serif text-4xl md:text-5xl">
        {lang === "id" ? "Pilih kata yang paling mencerminkan dirimu" : "Pick the words that reflect you most"}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {lang === "id"
          ? "Pilih kata yang paling sesuai dan menggambarkan kamu, bukan yang kamu inginkan, tapi yang memang paling menggambarkan kamu. Pilih 5–20 kata."
          : "Pick words that genuinely describe you — not what you wish you were. Choose 5–20."}
      </p>

      <div className="mt-8">
        <AdjectiveGrid selected={selected} onToggle={toggle} />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button onClick={() => nav("/")} className="text-sm text-muted-foreground hover:text-foreground">
          {lang === "id" ? "Kembali" : "Back"}
        </button>
        <button
          disabled={selected.length < 5 || selected.length > 20}
          onClick={next}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 font-medium text-primary-foreground shadow-brand disabled:opacity-40"
        >
          {lang === "id" ? "Lanjut isi data →" : "Next: your details →"}
        </button>
      </div>
    </TestShell>
  );
};

export default Words;