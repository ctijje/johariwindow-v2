import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TestShell } from "@/components/test/TestShell";
import { AdjectiveGrid } from "@/components/test/AdjectiveGrid";
import { useLang } from "@/lib/lang";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Peer = () => {
  const { code = "" } = useParams();
  const { lang } = useLang();
  const nav = useNavigate();
  const [windowData, setWindowData] = useState<{ id: string; name: string } | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [peerName, setPeerName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc("get_window_by_code", { _code: code.toUpperCase() });
      if (data?.[0]) setWindowData({ id: data[0].id, name: data[0].name });
      else setNotFound(true);
    })();
  }, [code]);

  const submit = async () => {
    if (!windowData || selected.length < 4 || selected.length > 8) return;
    setLoading(true);
    const { error } = await supabase.from("peer_responses").insert({
      window_id: windowData.id,
      peer_name: peerName.trim() || null,
      words: selected,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setDone(true);
  };

  if (notFound) return (
    <TestShell>
      <h1 className="font-serif text-4xl">{lang === "id" ? "Kode tidak ditemukan" : "Code not found"}</h1>
      <p className="mt-2 text-muted-foreground">{lang === "id" ? "Periksa kembali link yang kamu terima." : "Check the link again."}</p>
    </TestShell>
  );
  if (!windowData) return <TestShell><div className="text-muted-foreground">Loading…</div></TestShell>;

  if (done) return (
    <TestShell>
      <h1 className="font-serif text-4xl md:text-5xl">{lang === "id" ? "Terima kasih!" : "Thank you!"}</h1>
      <p className="mt-3 text-muted-foreground">
        {lang === "id"
          ? `Pilihan katamu sudah dikirim ke ${windowData.name}. Mereka akan melihatnya saat membuka jendela mereka.`
          : `Your words have been sent to ${windowData.name}. They'll see them when they open their window.`}
      </p>
      <button onClick={() => nav("/")} className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 font-medium text-primary-foreground shadow-brand">
        {lang === "id" ? "Buat Johari Window milikmu" : "Create your own Johari Window"}
      </button>
    </TestShell>
  );

  return (
    <TestShell>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {lang === "id" ? "PEER · PILIH KATA" : "PEER · PICK WORDS"}
      </div>
      <h1 className="font-serif text-4xl md:text-5xl">
        {lang === "id" ? `Pilih kata yang paling menggambarkan ${windowData.name}` : `Pick words that describe ${windowData.name}`}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {lang === "id"
          ? "Pilih kata yang benar-benar kamu lihat atau paling menggambarkan diri mereka. Pilih 4–8 kata."
          : "Pick words you genuinely see in them. Choose 4–8."}
      </p>

      <label className="mt-8 block">
        <span className="text-sm text-muted-foreground">{lang === "id" ? "Namamu (opsional)" : "Your name (optional)"}</span>
        <input value={peerName} onChange={(e) => setPeerName(e.target.value)} maxLength={80}
          placeholder={lang === "id" ? "Contoh: Rina" : "e.g. Rina"}
          className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
      </label>

      <div className="mt-6">
        <AdjectiveGrid selected={selected} onToggle={(id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id])} />
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={submit}
          disabled={selected.length < 4 || selected.length > 8 || loading}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 font-medium text-primary-foreground shadow-brand disabled:opacity-40"
        >
          {lang === "id" ? "Kirim" : "Submit"}
        </button>
      </div>
    </TestShell>
  );
};

export default Peer;