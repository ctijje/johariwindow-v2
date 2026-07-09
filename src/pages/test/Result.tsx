import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TestShell, StepKicker } from "@/components/test/TestShell";
import { supabase } from "@/integrations/supabase/client";
import { computePanels, computeAlignmentScore, type PeerData, type JohariPanels } from "@/lib/johari";
import { findWord, CLUSTER_NAMES } from "@/data/adjectives";
import { cn } from "@/lib/utils";

type WindowData = {
  id: string; code: string; name: string;
  self_words: string[]; self_words_ranked: string[];
  assessment_purposes: string[];
};

const WordChip = ({ id, badge, chipClass }: { id: string; badge?: string; chipClass: string }) => {
  const w = findWord(id);
  return (
    <div className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium", chipClass)}>
      <span>{w?.en ?? id}</span>
      <span className="opacity-75">· {w?.id_label}</span>
      {badge && <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">{badge}</span>}
    </div>
  );
};

const AreaCard = ({
  kicker, title, subtitle, words, strongWords, chipClass, bgClass, titleClass, reflection, emptyText,
}: {
  kicker: string; title: string; subtitle?: string;
  words: string[]; strongWords?: string[];
  chipClass: string; bgClass: string; titleClass: string;
  reflection?: string; emptyText?: string;
}) => (
  <div className={cn("rounded-3xl p-6", bgClass)}>
    <div className={cn("font-mono text-[10px] tracking-widest opacity-70", titleClass)}>{kicker}</div>
    <div className={cn("mt-1 font-serif text-xl font-semibold", titleClass)}>{title}</div>
    {subtitle && <div className="mt-0.5 text-xs text-muted-foreground">{subtitle}</div>}
    <div className="mt-4 flex flex-wrap gap-2">
      {words.length === 0 && emptyText && <span className="text-xs text-muted-foreground italic">{emptyText}</span>}
      {words.map((w) => (
        <WordChip key={w} id={w} badge={strongWords?.includes(w) ? "Top 3" : undefined} chipClass={chipClass} />
      ))}
    </div>
    {reflection && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{reflection}</p>}
  </div>
);

const Result = () => {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [windowId, setWindowId] = useState<string | null>(null);
  const [panels, setPanels] = useState<JohariPanels | null>(null);
  const [peerCount, setPeerCount] = useState(0);
  const [windowData, setWindowData] = useState<WindowData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get("w");
    if (urlId) sessionStorage.setItem("johari.windowId", urlId);

    (async () => {
      let id = urlId || sessionStorage.getItem("johari.windowId");
      if (!id) {
        const { data: mine } = await supabase.rpc("get_my_windows");
        if (mine && mine[0]) { id = mine[0].id; sessionStorage.setItem("johari.windowId", id); }
      }
      if (!id) { setError("Hasil tidak ditemukan. Mulai test terlebih dahulu."); return; }

      const { data: w, error: wErr } = await supabase.rpc("get_self_window", { _id: id });
      if (wErr || !w?.[0]) { setError("Hasil tidak ditemukan atau kamu belum punya akses."); return; }

      const { data: peers } = await supabase.rpc("get_peer_words", { _window_id: id });
      const peerDataArr: PeerData[] = (peers ?? []).map((p: any) => ({
        words: p.words ?? [],
        words_ranked: p.words_ranked ?? [],
        peer_name: p.peer_name,
        peer_behavior_example: p.peer_behavior_example,
        peer_unseen_quality: p.peer_unseen_quality,
      }));

      setName(w[0].name);
      setWindowId(id);
      setPeerCount(peerDataArr.length);
      setWindowData({
        id, code: w[0].code, name: w[0].name,
        self_words: w[0].self_words ?? [],
        self_words_ranked: w[0].self_words_ranked ?? [],
        assessment_purposes: w[0].assessment_purposes ?? [],
      });
      setPanels(computePanels(w[0].self_words ?? [], w[0].self_words_ranked ?? [], peerDataArr));
    })();
  }, [nav]);

  if (error) return (
    <TestShell>
      <h1 className="font-serif text-3xl">Belum ada hasil</h1>
      <p className="mt-3 text-muted-foreground">{error}</p>
      <div className="mt-6 flex gap-3">
        <button onClick={() => nav("/test")} className="rounded-full bg-gradient-brand px-6 py-3 text-sm font-medium text-primary-foreground shadow-brand">Mulai test</button>
        <button onClick={() => nav("/auth?next=/test/result")} className="rounded-full border border-border px-6 py-3 text-sm font-medium hover:border-foreground">Masuk akun</button>
      </div>
    </TestShell>
  );
  if (!panels || !windowData) return <TestShell><div className="text-muted-foreground">Loading…</div></TestShell>;

  const alignmentScore = computeAlignmentScore(windowData.self_words, panels.allPeerWords);

  return (
    <TestShell>
      <StepKicker step={4} label="HASIL" />
      <h1 className="font-serif text-4xl md:text-5xl">Hasil Awal Johari Window Kamu</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
        Hasil ini adalah peta awal tentang bagaimana kamu melihat dirimu dan bagaimana orang lain menangkapmu. Ini bukan diagnosis, melainkan bahan refleksi berbasis persepsi dan konteks relasi.
      </p>

      {/* Peer count banner */}
      <div className={cn("mt-6 rounded-2xl px-5 py-4 text-sm",
        peerCount === 0 ? "bg-amber-50 border border-amber-200 text-amber-800" :
        peerCount < 3 ? "bg-blue-50 border border-blue-200 text-blue-800" :
        "bg-emerald-50 border border-emerald-200 text-emerald-800"
      )}>
        {peerCount === 0 && "Belum ada feedback peer. Bagikan link ini ke orang-orang yang mengenalmu agar jendelamu terbuka penuh."}
        {peerCount === 1 && "1 peer sudah mengisi. Hasil lebih kaya dengan minimal 3 peer — semakin banyak, semakin jelas peta persepsimu."}
        {peerCount === 2 && `${peerCount} peer sudah mengisi. Tambah 1 peer lagi untuk hasil yang lebih representatif.`}
        {peerCount >= 3 && `${peerCount} peer sudah mengisi. Hasil ini sudah cukup kaya untuk dibaca.`}
      </div>

      {/* Result grid */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {/* Open Area */}
        <AreaCard
          kicker="OPEN AREA" title="Dikenal Bersama"
          subtitle="Diri sendiri & peer sama-sama melihat"
          words={panels.open} strongWords={panels.strongOpen}
          bgClass="bg-emerald-50" titleClass="text-emerald-900"
          chipClass="bg-emerald-600 text-white"
          reflection="Kualitas ini sudah terlihat dan dirasakan oleh dirimu sendiri maupun orang di sekitarmu. Ini adalah fondasi identitasmu yang relatif konsisten."
          emptyText={peerCount === 0 ? "Belum bisa dihitung — butuh input dari peer." : "Belum ada kata yang sama persis antara pilihan kamu dan peer."}
        />

        {/* Blind Spot */}
        {peerCount > 0 ? (
          <AreaCard
            kicker="BLIND SPOT" title="Yang Orang Lain Lihat"
            subtitle="Peer pilih, kamu tidak"
            words={panels.blind} strongWords={panels.strongBlind}
            bgClass="bg-orange-50" titleClass="text-orange-900"
            chipClass="bg-orange-600 text-white"
            reflection={panels.blind.length > 2
              ? "Orang lain melihat beberapa kualitas positif yang belum kamu pilih sebagai gambaran utama dirimu. Ini bisa menjadi kekuatan yang belum sepenuhnya kamu akui."
              : "Ada kualitas yang peer lihat tapi belum kamu klaim. Bisa jadi ini kekuatan yang masih tersembunyi dari pandanganmu sendiri."}
            emptyText="Tidak ada blind spot — kamu dan peer memiliki pandangan yang selaras."
          />
        ) : (
          <div className="rounded-3xl p-6 bg-orange-50 border-2 border-dashed border-orange-200">
            <div className="font-mono text-[10px] tracking-widest text-orange-800 opacity-70">BLIND SPOT</div>
            <div className="mt-1 font-serif text-xl font-semibold text-orange-900">Yang Orang Lain Lihat</div>
            <p className="mt-4 text-sm text-muted-foreground">Belum bisa dihitung karena belum ada input dari peer. Bagikan link ini ke beberapa orang yang cukup mengenalmu agar hasil lebih kaya.</p>
          </div>
        )}

        {/* Hidden Area */}
        <AreaCard
          kicker="HIDDEN AREA" title="Yang Kamu Rasakan, Belum Terlihat"
          subtitle="Kamu pilih, peer tidak"
          words={panels.hidden} strongWords={panels.strongHidden}
          bgClass="bg-violet-50" titleClass="text-violet-900"
          chipClass="bg-violet-600 text-white"
          reflection={panels.hidden.length > 2
            ? "Ada kualitas yang kamu rasakan kuat dalam diri, tetapi belum banyak terlihat oleh peer. Ini bisa berarti kualitas tersebut muncul di konteks tertentu, belum dikomunikasikan, atau belum konsisten terlihat."
            : "Sebagian besar kualitas yang kamu rasakan sudah terlihat oleh orang lain."}
          emptyText={peerCount === 0 ? "Semua kata yang kamu pilih berada di hidden area karena belum ada peer yang mengisi." : "Tidak ada hidden area — kualitas yang kamu rasakan sudah terlihat oleh peer."}
        />

        {/* Resonance Area */}
        {peerCount > 0 ? (
          <div className="rounded-3xl p-6 bg-indigo-50">
            <div className="font-mono text-[10px] tracking-widest text-indigo-900 opacity-70">RESONANCE AREA</div>
            <div className="mt-1 font-serif text-xl font-semibold text-indigo-900">Makna yang Berdekatan</div>
            {panels.resonance.length > 0 ? (
              <>
                <div className="mt-4 space-y-3">
                  {panels.resonance.slice(0, 2).map((r) => (
                    <div key={r.cluster} className="rounded-xl bg-indigo-100 px-4 py-3">
                      <div className="text-xs font-semibold text-indigo-800">{CLUSTER_NAMES[r.cluster].id}</div>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {r.selfWords.map((id) => <span key={id} className="rounded-full bg-indigo-600 text-white px-2.5 py-1 text-[11px] font-medium">{findWord(id)?.en} <span className="opacity-70">(Self)</span></span>)}
                        {r.peerWords.map((id) => <span key={id} className="rounded-full bg-indigo-400 text-white px-2.5 py-1 text-[11px] font-medium">{findWord(id)?.en} <span className="opacity-70">(Peer)</span></span>)}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Walaupun belum ada kata yang sama persis, ada pola makna yang berdekatan antara cara kamu melihat dirimu dan cara peer melihatmu.
                </p>
              </>
            ) : panels.open.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">Hasil ini menunjukkan adanya perception gap. Cara kamu melihat dirimu cukup berbeda dari cara peer menangkap kualitasmu. Ini bukan hasil buruk, tetapi bahan refleksi.</p>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Kamu dan peer sudah menggunakan kata-kata yang sama — resonansi tersurat, bukan tersembunyi.</p>
            )}
          </div>
        ) : (
          <div className="rounded-3xl p-6 bg-indigo-50 border-2 border-dashed border-indigo-200">
            <div className="font-mono text-[10px] tracking-widest text-indigo-800 opacity-70">RESONANCE AREA</div>
            <div className="mt-1 font-serif text-xl font-semibold text-indigo-900">Makna yang Berdekatan</div>
            <p className="mt-4 text-sm text-muted-foreground">Belum bisa dianalisis karena belum ada input dari peer. Bagikan link ini ke beberapa orang yang cukup mengenalmu agar hasil lebih kaya.</p>
          </div>
        )}
      </div>

      {/* Unknown reflection */}
      <div className="mt-4 rounded-3xl p-6 bg-amber-50">
        <div className="font-mono text-[10px] tracking-widest text-amber-900 opacity-70">UNKNOWN AREA</div>
        <div className="mt-1 font-serif text-xl font-semibold text-amber-900">Ruang yang Belum Muncul</div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Area ini belum muncul dari pilihan self maupun peer. Ini bukan berarti kualitas tersebut tidak ada, tetapi belum cukup terlihat, belum aktif, atau belum dikenali dalam konteks relasi saat ini.
        </p>
      </div>

      {/* Reflection questions */}
      <div className="mt-10">
        <h2 className="font-serif text-2xl">Pertanyaan Refleksi</h2>
        <p className="mt-2 text-sm text-muted-foreground">Tidak perlu dijawab sekarang. Simpan untuk direnungkan.</p>
        <div className="mt-5 space-y-3">
          {[
            "Kualitas apa yang orang lain lihat, tapi selama ini mungkin kamu anggap biasa?",
            "Kualitas apa yang kamu rasakan kuat, tapi belum terlihat keluar secara konsisten?",
            "Dalam konteks apa kamu merasa paling menjadi diri sendiri?",
          ].map((q, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card px-5 py-4">
              <span className="font-mono text-[10px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-1.5 text-sm font-medium text-foreground">{q}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Paid report CTA */}
      <div className="mt-10 rounded-[2rem] bg-gradient-brand p-8 md:p-12 text-primary-foreground relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <div className="inline-flex rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium uppercase tracking-widest">Johari Deep Mirror Report</div>
          <h2 className="mt-4 font-serif text-3xl md:text-4xl">Mau baca hasilmu lebih dalam?</h2>
          <p className="mt-3 text-primary-foreground/90 leading-relaxed max-w-lg">
            Free result hanya menunjukkan peta awal. Dengan <strong>Johari Deep Mirror Report</strong>, kamu bisa memahami blind spot positif, hidden strength, resonance area, perception gap, dan action plan personal.
          </p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2 text-sm text-primary-foreground/90">
            {["Analisis Open Strength", "Positive Blind Spot", "Hidden Strength Analysis", "Resonance Area", "Perception Gap Map", "Peer Evidence Summary", "Rekomendasi Pengembangan"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/70 shrink-0" /> {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => windowId && nav(`/test/report?w=${windowId}`)}
              className="rounded-full bg-background px-6 py-3.5 text-sm font-semibold text-primary transition hover:scale-[1.02]"
            >
              Unlock Johari Deep Mirror Report — Rp49.000
            </button>
            <button
              onClick={() => windowId && nav(`/test/report?w=${windowId}`)}
              className="rounded-full border border-primary-foreground/40 px-6 py-3.5 text-sm font-medium text-primary-foreground transition hover:bg-primary-foreground/10"
            >
              Lihat Blind Spot Saya Lebih Dalam
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button onClick={() => nav("/test/share")} className="text-sm text-muted-foreground hover:text-foreground">← Kembali ke Share</button>
        {peerCount > 0 && (
          <div className="text-right">
            <div className="font-mono text-xs text-muted-foreground">Self-Peer Alignment</div>
            <div className={cn("font-semibold text-sm",
              alignmentScore >= 60 ? "text-emerald-600" : alignmentScore >= 30 ? "text-amber-600" : "text-orange-600"
            )}>{alignmentScore}%</div>
          </div>
        )}
      </div>
    </TestShell>
  );
};

export default Result;
