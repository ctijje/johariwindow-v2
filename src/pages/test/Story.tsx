import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Download, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { computePanels, type PanelKey } from "@/lib/johari";
import { useLang } from "@/lib/lang";
import { toast } from "sonner";

type Theme = {
  key: PanelKey;
  bg: string;
  kicker: string;
  title_id: string;
  title_en: string;
  tags: string;
  desc_id: string;
  desc_en: string;
  axis_id: string;
  axis_en: string;
  cta: string;
  ctaText: string;
  cell: number; // 0..3 which quadrant to highlight
};

const THEMES: Record<PanelKey, Theme> = {
  open: {
    key: "open",
    bg: "linear-gradient(160deg,#1e2a8a 0%,#3b3fb0 55%,#7e5bd0 100%)",
    kicker: "ARENA / TERBUKA",
    title_id: "Kamu Tipe Terbuka",
    title_en: "You Are Open",
    tags: "Self-aware · Genuine · Open",
    desc_id: "Kamu jujur, mudah dikenal, dan nyaman menjadi dirimu sendiri. Orang-orang suka karena kamu asli.",
    desc_en: "You are honest, easy to know, and comfortable being yourself. People love you because you're real.",
    axis_id: "DIRI SENDIRI TAHU  ·  ORANG LAIN TAHU",
    axis_en: "YOU KNOW  ·  OTHERS KNOW",
    cta: "#a5b4ff",
    ctaText: "Kamu yang mana? Coba quiznya!",
    cell: 0,
  },
  blind: {
    key: "blind",
    bg: "linear-gradient(160deg,#c2410c 0%,#ea580c 55%,#b45309 100%)",
    kicker: "BLIND SPOT",
    title_id: "Kamu Punya Blind Spot",
    title_en: "You Have a Blind Spot",
    tags: "Energetic · Unaware · Growing",
    desc_id: "Ada sisi dirimu yang terlihat jelas oleh orang lain — tapi belum kamu sadari sepenuhnya.",
    desc_en: "There's a side of you others see clearly — but you haven't fully realized yet.",
    axis_id: "DIRI SENDIRI TAK TAHU  ·  ORANG LAIN TAHU",
    axis_en: "YOU DON'T KNOW  ·  OTHERS KNOW",
    cta: "#fcd9b6",
    ctaText: "Kamu yang mana? Coba quiznya!",
    cell: 1,
  },
  hidden: {
    key: "hidden",
    bg: "linear-gradient(160deg,#064e3b 0%,#0f766e 60%,#115e59 100%)",
    kicker: "FAÇADE / TERSEMBUNYI",
    title_id: "Kamu Tipe Misterius",
    title_en: "You Are Mysterious",
    tags: "Private · Deep · Complex",
    desc_id: "Kamu menyimpan banyak hal tentang dirimu. Dunia hanya melihat sebagian kecil darimu.",
    desc_en: "You hold a lot about yourself. The world only sees a small part of you.",
    axis_id: "DIRI SENDIRI TAHU  ·  ORANG LAIN TAK TAHU",
    axis_en: "YOU KNOW  ·  OTHERS DON'T",
    cta: "#5eead4",
    ctaText: "Kamu yang mana? Coba quiznya!",
    cell: 2,
  },
  unknown: {
    key: "unknown",
    bg: "linear-gradient(160deg,#9d174d 0%,#be185d 50%,#c2410c 100%)",
    kicker: "UNKNOWN / TAK DIKENAL",
    title_id: "Kamu Penuh Potensi",
    title_en: "You Are Full of Potential",
    tags: "Mysterious · Potential · Limitless",
    desc_id: "Masih banyak sisi dirimu yang belum dieksplorasi — tersembunyi bahkan dari dirimu sendiri.",
    desc_en: "Many sides of you remain unexplored — hidden even from yourself.",
    axis_id: "DIRI SENDIRI TAK TAHU  ·  ORANG LAIN TAK TAHU",
    axis_en: "YOU DON'T KNOW  ·  OTHERS DON'T",
    cta: "#fbcfe8",
    ctaText: "Kamu yang mana? Coba quiznya!",
    cell: 3,
  },
};

const Story = () => {
  const nav = useNavigate();
  const { lang } = useLang();
  const [name, setName] = useState("");
  const [dominant, setDominant] = useState<PanelKey | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = sessionStorage.getItem("johari.windowId");
    if (!id) { nav("/test"); return; }
    (async () => {
      const { data: w } = await supabase.rpc("get_self_window", { _id: id });
      const { data: peers } = await supabase.from("peer_responses").select("words").eq("window_id", id);
      if (!w?.[0]) return;
      setName(w[0].name ?? "");
      const panels = computePanels(w[0].self_words ?? [], (peers ?? []).map((p: any) => p.words));
      const counts: [PanelKey, number][] = [
        ["open", panels.open.length],
        ["blind", panels.blind.length],
        ["hidden", panels.hidden.length],
        ["unknown", panels.unknown.length],
      ];
      counts.sort((a, b) => b[1] - a[1]);
      setDominant(counts[0][0]);
    })();
  }, [nav]);

  const theme = useMemo(() => (dominant ? THEMES[dominant] : null), [dominant]);

  const wid = sessionStorage.getItem("johari.windowId");
  const shareUrl = wid ? `${window.location.origin}/test/result?w=${wid}` : window.location.origin;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success(lang === "id" ? "Link disalin" : "Link copied");
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: null, useCORS: true });
      const link = document.createElement("a");
      link.download = `johari-${theme?.key ?? "story"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      toast.error(lang === "id" ? "Gagal mengunduh" : "Download failed");
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "Johari Window", url: shareUrl }); } catch {}
    } else {
      copyLink();
    }
  };

  if (!theme) {
    return <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-8">
      <div className="mx-auto max-w-md">
        <button onClick={() => nav("/test/profile")} className="mb-4 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> {lang === "id" ? "Kembali" : "Back"}
        </button>

        {/* 9:16 story card */}
        <div
          ref={cardRef}
          className="relative mx-auto aspect-[9/16] w-full overflow-hidden rounded-3xl text-white shadow-2xl"
          style={{ background: theme.bg, fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          {/* decorative window outlines */}
          <svg viewBox="0 0 200 200" className="pointer-events-none absolute left-1/2 top-[6%] h-[28%] -translate-x-1/2 opacity-30" fill="none" stroke="currentColor" strokeWidth="0.6">
            <rect x="60" y="40" width="80" height="80" />
            <line x1="100" y1="40" x2="100" y2="120" />
            <line x1="60" y1="80" x2="140" y2="80" />
          </svg>

          <div className="relative flex h-full flex-col items-center px-7 pt-[26%] text-center">
            <span className="rounded-full border border-white/40 bg-white/10 px-3 py-1 font-mono text-[10px] tracking-[0.2em]">
              {theme.kicker}
            </span>

            <h1 className="mt-5 text-[44px] font-black leading-[0.95] tracking-tight drop-shadow-[0_2px_0_rgba(0,0,0,0.35)]">
              {(lang === "id" ? theme.title_id : theme.title_en).split(" ").map((w, i) => (
                <span key={i} className="block">{w}</span>
              ))}
            </h1>

            <div className="mt-3 font-serif text-base italic text-white/80">{theme.tags}</div>

            <p className="mt-4 max-w-[85%] text-[15px] leading-snug text-white/95">
              {lang === "id" ? theme.desc_id : theme.desc_en}
            </p>

            <div className="mt-5 rounded-full border border-white/30 bg-white/10 px-5 py-2 font-mono text-xs">
              ✦ {name || (lang === "id" ? "tulis nama kamu di sini" : "your name here")} ✦
            </div>

            <div className="mt-4 w-full border-t border-white/30 pt-2 font-mono text-[10px] tracking-[0.18em] text-white/80">
              {lang === "id" ? theme.axis_id : theme.axis_en}
            </div>

            <div className="mt-auto pb-6">
              {/* mini 4-grid */}
              <div className="mx-auto grid w-24 grid-cols-2 gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-md border border-white/30"
                    style={{ background: i === theme.cell ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.12)" }}
                  />
                ))}
              </div>

              <div className="mt-5 border-t border-white/30 pt-3 text-sm font-bold" style={{ color: theme.cta }}>
                {theme.ctaText}
              </div>
              <div className="mt-2 font-mono text-[10px] tracking-[0.25em] text-white/80">QUIZ JOHARI WINDOW</div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <button onClick={downloadImage} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-3 py-3 text-sm font-medium text-neutral-900">
            <Download className="h-4 w-4" /> PNG
          </button>
          <button onClick={copyLink} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/30 px-3 py-3 text-sm font-medium text-white">
            <Copy className="h-4 w-4" /> Link
          </button>
          <button onClick={nativeShare} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/30 px-3 py-3 text-sm font-medium text-white">
            <Share2 className="h-4 w-4" /> Share
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-white/50">
          {lang === "id"
            ? "Unduh gambar lalu unggah ke Instagram Story. Link hasil akan tetap kamu salin terpisah."
            : "Download the image and upload to your Instagram Story. The result link is copied separately."}
        </p>
      </div>
    </div>
  );
};

export default Story;