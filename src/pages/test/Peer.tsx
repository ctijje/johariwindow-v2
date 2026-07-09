import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TestShell } from "@/components/test/TestShell";
import { AdjectiveGrid } from "@/components/test/AdjectiveGrid";
import { RankingList } from "@/components/test/RankingList";
import { findWord } from "@/data/adjectives";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Step = "words" | "ranking";

const Peer = () => {
  const { code = "" } = useParams();
  const nav = useNavigate();
  const [windowData, setWindowData] = useState<{ id: string; name: string } | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [peerName, setPeerName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [ranked, setRanked] = useState<string[]>([]);
  const [behaviorExample, setBehaviorExample] = useState("");
  const [unseenQuality, setUnseenQuality] = useState("");
  const [step, setStep] = useState<Step>("words");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc("get_window_by_code", { _code: code.toUpperCase() });
      if (data?.[0]) setWindowData({ id: data[0].id, name: data[0].name });
      else setNotFound(true);
    })();
  }, [code]);

  const toggle = (id: string) => {
    setSelected((s) => {
      if (s.includes(id)) {
        setRanked((r) => r.filter((x) => x !== id));
        return s.filter((x) => x !== id);
      }
      if (s.length >= 5) return s;
      return [...s, id];
    });
  };

  const submit = async () => {
    if (!windowData || ranked.length !== 5 || !behaviorExample.trim()) return;
    setLoading(true);
    const { error } = await supabase.rpc("submit_peer_response", {
      _code: code.toUpperCase(),
      _peer_name: peerName.trim() || null,
      _words: selected,
      _words_ranked: ranked,
      _peer_behavior_example: behaviorExample.trim(),
      _peer_unseen_quality: unseenQuality.trim() || null,
    } as any);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setDone(true);
  };

  if (notFound) return (
    <TestShell>
      <h1 className="font-serif text-4xl">Kode tidak ditemukan</h1>
      <p className="mt-2 text-muted-foreground">Periksa kembali link yang kamu terima.</p>
    </TestShell>
  );
  if (!windowData) return <TestShell><div className="text-muted-foreground">Loading…</div></TestShell>;

  if (done) return (
    <TestShell>
      <h1 className="font-serif text-4xl md:text-5xl">Terima kasih! 🙏</h1>
      <p className="mt-3 text-muted-foreground text-lg">
        Pilihan katamu sudah dikirim ke <strong>{windowData.name}</strong>. Mereka akan melihatnya saat membuka Johari Window mereka.
      </p>
      <p className="mt-2 text-muted-foreground">Feedback seperti ini sangat berarti untuk membantu seseorang tumbuh dan mengenal dirinya lebih baik.</p>
      <button onClick={() => nav("/")} className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 font-medium text-primary-foreground shadow-brand">
        Buat Johari Window milikmu →
      </button>
    </TestShell>
  );

  const anchorWord = ranked[0] ? findWord(ranked[0]) : null;
  const canGoToRanking = selected.length === 5;
  const canSubmit = ranked.length === 5 && behaviorExample.trim().length > 0;

  const field = "rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary w-full resize-none";

  return (
    <TestShell>
      {step === "words" && (
        <>
          <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">PEER · PILIH KATA</div>
          <h1 className="font-serif text-3xl md:text-4xl">
            Pilih 5 kata yang paling menggambarkan <span className="text-gradient-brand">{windowData.name}</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Pilih berdasarkan pengalaman nyata kamu berinteraksi dengannya — bukan yang kamu harap ada, tapi yang benar-benar kamu lihat.
          </p>

          <label className="mt-8 block">
            <span className="text-sm text-muted-foreground">Namamu <span className="opacity-70">(opsional)</span></span>
            <input value={peerName} onChange={(e) => setPeerName(e.target.value)} maxLength={80}
              placeholder="Contoh: Rina"
              className="mt-1 rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary w-full" />
          </label>

          <div className="mt-6">
            <AdjectiveGrid selected={selected} onToggle={toggle} />
          </div>

          <div className="mt-8 flex justify-end">
            <button onClick={() => canGoToRanking && setStep("ranking")} disabled={!canGoToRanking}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 font-medium text-primary-foreground shadow-brand disabled:opacity-40">
              Lanjut Urutkan →
            </button>
          </div>
        </>
      )}

      {step === "ranking" && (
        <>
          <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">PEER · URUTKAN</div>
          <h1 className="font-serif text-3xl md:text-4xl">
            Urutkan dari yang paling dominan terlihat dari <span className="text-gradient-brand">{windowData.name}</span>
          </h1>
          <p className="mt-2 text-muted-foreground">Kata nomor 1 adalah yang paling kuat dan konsisten kamu lihat dari mereka.</p>

          <div className="mt-8">
            <RankingList words={selected} ranked={ranked} onRankChange={setRanked} />
          </div>

          {ranked.length === 5 && (
            <div className="mt-8 rounded-2xl border border-border bg-card p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Apa contoh perilaku nyata yang membuat kamu memilih{" "}
                  {anchorWord ? <span className="text-primary">"{anchorWord.en}"</span> : "kata nomor 1"}
                  {" "}sebagai yang paling dominan? *
                </label>
                <textarea value={behaviorExample} onChange={(e) => setBehaviorExample(e.target.value)} rows={3}
                  placeholder="Ceritakan satu contoh konkret yang paling kamu ingat..."
                  className={field} />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">
                  Apa kualitas positif dari {windowData.name} yang menurutmu mungkin belum dia sadari?{" "}
                  <span className="opacity-70">(opsional)</span>
                </label>
                <textarea value={unseenQuality} onChange={(e) => setUnseenQuality(e.target.value)} rows={2}
                  placeholder="Kualitas yang kamu lihat tapi mungkin mereka belum sadar punya..."
                  className={field} />
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button type="button" onClick={() => setStep("words")} className="text-sm text-muted-foreground hover:text-foreground">← Kembali</button>
            <button onClick={submit} disabled={!canSubmit || loading}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-medium text-primary-foreground shadow-brand disabled:opacity-40",
                canSubmit ? "bg-gradient-brand" : "bg-muted"
              )}>
              {loading ? "Mengirim..." : "Kirim Feedback"}
            </button>
          </div>
        </>
      )}
    </TestShell>
  );
};

export default Peer;
