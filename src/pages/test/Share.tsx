import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Copy } from "lucide-react";
import { TestShell, StepKicker } from "@/components/test/TestShell";
import { useLang } from "@/lib/lang";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { WindowView } from "@/components/WindowView";

const Share = () => {
  const { lang } = useLang();
  const nav = useNavigate();
  const code = sessionStorage.getItem("johari.code");
  const id = sessionStorage.getItem("johari.windowId");
  const profile = JSON.parse(sessionStorage.getItem("johari.profile") || "null");
  const [peerCount, setPeerCount] = useState(0);
  const [peerNames, setPeerNames] = useState<string[]>([]);

  useEffect(() => {
    if (!id) { nav("/test"); return; }
    const load = async () => {
      const { data } = await supabase.rpc("get_peer_responses_owner", { _window_id: id });
      setPeerCount(data?.length ?? 0);
      setPeerNames((data ?? []).map((d: any) => d.peer_name || (lang === "id" ? "Anonim" : "Anonymous")));
    };
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [id, nav, lang]);

  if (!code || !id) return null;

  const peerLink = `${window.location.origin}/peer/${code}`;
  const waText = encodeURIComponent(
    lang === "id"
      ? `Hai! Aku lagi isi Johari Window. Bisa bantu pilih beberapa kata yang menggambarkan aku? ${peerLink}`
      : `Hi! I'm filling out my Johari Window. Could you pick a few words that describe me? ${peerLink}`
  );

  const copy = (s: string, m: string) => { navigator.clipboard.writeText(s); toast.success(m); };

  return (
    <TestShell>
      <StepKicker step={2} total={3} label={lang === "id" ? "Profilmu & bagikan untuk feedback" : "Your profile & share for feedback"} />
      <h1 className="font-serif text-4xl md:text-5xl">
        {lang === "id" ? "Johari Window kamu sudah dibuat" : "Your Johari Window is ready"}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {lang === "id"
          ? "Pilih orang yang mengenal kamu dengan baik — teman, rekan kerja, atau mentor. Mereka akan memilih kata yang mereka lihat ada dalam dirimu."
          : "Pick people who know you well — friends, coworkers, mentors. They'll pick words they see in you."}
      </p>

      {/* Johari preview */}
      <div className="mt-8 rounded-3xl border border-border/70 bg-card p-6 md:p-8">
        <div className="mb-4 font-mono text-[10px] tracking-widest text-muted-foreground">
          {lang === "id" ? "JENDELAMU SEKARANG" : "YOUR WINDOW NOW"}
        </div>
        <WindowView windowId={id} />
        {peerCount === 0 && (
          <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
            {lang === "id"
              ? "Feedback dari peer belum ada. Tambahkan minimal 1 peer agar panel Blind Spot, Open, dan Unknown ikut terisi dan hasilmu jadi lebih kaya."
              : "No peer feedback yet. Add at least 1 peer so the Blind Spot, Open, and Unknown panes also fill in and your result becomes richer."}
          </div>
        )}
      </div>

      <div className="mt-8 rounded-3xl bg-accent p-6 md:p-8">
        <div className="font-mono text-[10px] tracking-widest text-muted-foreground">
          {lang === "id" ? "KODE UNIKMU" : "YOUR UNIQUE CODE"}
        </div>
        <div className="mt-2 font-mono text-4xl font-bold tracking-[0.3em] text-primary md:text-5xl">{code}</div>
      </div>

      <div className="mt-6 space-y-3">
        {[0, 1, 2, 3, 4].map((i) => {
          const filled = i < peerCount;
          const required = i === 0;
          return (
            <div
              key={i}
              className={cn(
                "flex items-center gap-4 rounded-2xl border-2 border-dashed p-4",
                filled ? "border-emerald-300 bg-emerald-50" : "border-border",
              )}
            >
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                filled ? "bg-emerald-600 text-white" : "border border-border text-muted-foreground",
              )}>
                {filled ? <Check className="h-5 w-5" /> : i + 1}
              </div>
              <div className="flex-1">
                <div className="font-medium">
                  {filled ? peerNames[i] : `Peer ${i + 1}${required ? (lang === "id" ? " (wajib)" : " (required)") : (lang === "id" ? " (opsional)" : " (optional)")}`}
                </div>
                <div className="text-xs text-muted-foreground">
                  {filled
                    ? (lang === "id" ? "Sudah mengisi" : "Submitted")
                    : (lang === "id" ? "Bagikan link agar mereka bisa mengisi" : "Share the link so they can fill it")}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={cn(
        "mt-6 rounded-2xl p-4 text-sm",
        peerCount === 0 ? "bg-amber-50 text-amber-900" : "bg-emerald-50 text-emerald-900",
      )}>
        {peerCount === 0
          ? (lang === "id" ? "Minimal 1 peer harus mengisi untuk melihat hasil." : "At least 1 peer must respond to see results.")
          : (lang === "id" ? `${peerCount} peer sudah mengisi. Tambah lagi untuk hasil yang lebih akurat.` : `${peerCount} peer(s) responded. Add more for richer results.`)}
      </div>

      <div className="mt-8 rounded-3xl border border-border bg-background p-6">
        <h2 className="text-base font-semibold">
          {lang === "id"
            ? "Bagikan link untuk mengumpulkan atau mendapatkan feedback"
            : "Share the link to collect or get feedback"}
        </h2>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            readOnly
            value={peerLink}
            onFocus={(e) => e.currentTarget.select()}
            className="flex-1 rounded-full border border-border bg-accent/40 px-5 py-2.5 font-mono text-xs text-primary"
          />
          <button
            onClick={() => copy(peerLink, lang === "id" ? "Link disalin" : "Link copied")}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Copy className="h-4 w-4" /> {lang === "id" ? "Salin link" : "Copy link"}
          </button>
          <a
            href={`https://wa.me/?text=${waText}`} target="_blank" rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            {lang === "id" ? "Kirim via WA" : "Send via WhatsApp"}
          </a>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          {lang === "id"
            ? "Profil bakat & versi story baru terbuka setelah minimal 1 peer mengisi feedback. Bagikan link di atas — kamu bisa kembali ke halaman ini kapan saja."
            : "Your talent profile & story version only unlock after at least 1 peer submits feedback. Share the link above — you can return to this page anytime."}
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button onClick={() => nav("/test")} className="text-sm text-muted-foreground hover:text-foreground">
          {lang === "id" ? "Kembali" : "Back"}
        </button>
        <button
          disabled={peerCount === 0}
          onClick={() => nav("/test/profile")}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 font-medium text-primary-foreground shadow-brand disabled:opacity-40"
        >
          {lang === "id" ? "Lihat profil bakat →" : "See talent profile →"}
        </button>
      </div>
    </TestShell>
  );
};

export default Share;