import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TestShell } from "@/components/test/TestShell";
import { AdjectiveGrid } from "@/components/test/AdjectiveGrid";
import { useLang } from "@/lib/lang";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ClientSelf = () => {
  const { code = "" } = useParams();
  const { lang } = useLang();
  const nav = useNavigate();
  const [w, setW] = useState<{ id: string; name: string; selfDone: boolean; ownerType: string } | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc("get_client_window", { _code: code.toUpperCase() });
      if (!data?.[0]) { setNotFound(true); return; }
      const row: any = data[0];
      setW({ id: row.id, name: row.name, selfDone: row.self_done, ownerType: row.owner_type });
      setName(row.name ?? "");
      if (row.self_done) setDone(true);
    })();
  }, [code]);

  const submit = async () => {
    if (!w || selected.length < 5 || selected.length > 20) return;
    setBusy(true);
    const { error } = await supabase.rpc("submit_client_self", {
      _code: code.toUpperCase(),
      _self_words: selected,
      _name: name.trim() || null,
    } as any);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    setDone(true);
  };

  if (notFound) return (
    <TestShell>
      <h1 className="font-serif text-4xl">{lang === "id" ? "Link tidak valid" : "Invalid link"}</h1>
      <p className="mt-2 text-muted-foreground">{lang === "id" ? "Mintalah link baru ke coach kamu." : "Ask your coach for a new link."}</p>
    </TestShell>
  );
  if (!w) return <TestShell><div className="text-muted-foreground">Loading…</div></TestShell>;

  if (done) return (
    <TestShell>
      <h1 className="font-serif text-4xl md:text-5xl">{lang === "id" ? "Terima kasih!" : "Thank you!"}</h1>
      <p className="mt-3 text-muted-foreground">
        {lang === "id"
          ? "Self-assessment kamu sudah tersimpan. Coach akan menghubungimu untuk langkah selanjutnya."
          : "Your self-assessment has been saved. Your coach will follow up with the next steps."}
      </p>
      <button onClick={() => nav("/")} className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 font-medium text-primary-foreground shadow-brand">
        {lang === "id" ? "Kembali ke beranda" : "Back to home"}
      </button>
    </TestShell>
  );

  return (
    <TestShell>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {lang === "id" ? "SELF-ASSESSMENT · DARI COACH KAMU" : "SELF-ASSESSMENT · FROM YOUR COACH"}
      </div>
      <h1 className="font-serif text-4xl md:text-5xl">
        {lang === "id" ? "Pilih kata yang menggambarkan dirimu" : "Pick words that describe you"}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {lang === "id" ? "Pilih 5–20 kata yang paling mencerminkan dirimu hari ini." : "Pick 5–20 words that best reflect who you are today."}
      </p>

      <label className="mt-8 block">
        <span className="text-sm text-muted-foreground">{lang === "id" ? "Nama kamu" : "Your name"}</span>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80}
          className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
      </label>

      <div className="mt-6">
        <AdjectiveGrid selected={selected} onToggle={(id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id])} />
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={submit}
          disabled={selected.length < 5 || selected.length > 20 || busy}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 font-medium text-primary-foreground shadow-brand disabled:opacity-40"
        >
          {lang === "id" ? "Kirim" : "Submit"}
        </button>
      </div>
    </TestShell>
  );
};

export default ClientSelf;
