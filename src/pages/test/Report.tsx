import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { computePanels, computeAlignmentScore, getDominantCluster, getArchetype, type PeerData, type JohariPanels } from "@/lib/johari";
import { findWord, CLUSTER_NAMES, type Cluster } from "@/data/adjectives";
import { cn } from "@/lib/utils";

type WindowData = {
  id: string; name: string; self_words: string[]; self_words_ranked: string[];
  self_anchor_reason?: string; self_context?: string;
  assessment_purposes: string[]; assessment_purpose_other?: string;
};

const Section = ({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) => (
  <section className={cn("mt-10 print:mt-8", className)}>
    <h2 className="font-serif text-2xl text-foreground">{title}</h2>
    <div className="mt-4">{children}</div>
  </section>
);

const WordChip = ({ id, label }: { id: string; label?: string }) => {
  const w = findWord(id);
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-accent px-3 py-1 text-xs font-medium text-foreground">
      {w?.en ?? id} <span className="text-muted-foreground">· {w?.id_label}</span>
      {label && <span className="ml-1 rounded-full bg-primary/10 px-1.5 text-[10px] text-primary">{label}</span>}
    </span>
  );
};

const Report = () => {
  const nav = useNavigate();
  const [windowData, setWindowData] = useState<WindowData | null>(null);
  const [peers, setPeers] = useState<PeerData[]>([]);
  const [panels, setPanels] = useState<JohariPanels | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("w") || sessionStorage.getItem("johari.windowId");
    if (!id) { setError("Tidak ada data. Mulai test terlebih dahulu."); return; }

    (async () => {
      const { data: w, error: wErr } = await supabase.rpc("get_self_window", { _id: id });
      if (wErr || !w?.[0]) { setError("Data tidak ditemukan atau kamu belum punya akses."); return; }
      const { data: peerRows } = await supabase.rpc("get_peer_words", { _window_id: id });
      const peerDataArr: PeerData[] = (peerRows ?? []).map((p: any) => ({
        words: p.words ?? [],
        words_ranked: p.words_ranked ?? [],
        peer_name: p.peer_name,
        peer_behavior_example: p.peer_behavior_example,
        peer_unseen_quality: p.peer_unseen_quality,
      }));
      setWindowData({
        id, name: w[0].name,
        self_words: w[0].self_words ?? [],
        self_words_ranked: w[0].self_words_ranked ?? [],
        self_anchor_reason: w[0].self_anchor_reason,
        self_context: w[0].self_context,
        assessment_purposes: w[0].assessment_purposes ?? [],
        assessment_purpose_other: w[0].assessment_purpose_other,
      });
      setPeers(peerDataArr);
      setPanels(computePanels(w[0].self_words ?? [], w[0].self_words_ranked ?? [], peerDataArr));
    })();
  }, []);

  if (error) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl">{error}</h1>
        <button onClick={() => nav("/test")} className="mt-6 rounded-full bg-gradient-brand px-6 py-3 text-sm font-medium text-primary-foreground">Mulai test</button>
      </div>
    </div>
  );
  if (!panels || !windowData) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-muted-foreground">Memuat report…</div>
    </div>
  );

  const alignmentScore = computeAlignmentScore(windowData.self_words, panels.allPeerWords);
  const alignmentLabel = alignmentScore >= 61 ? "Strong Alignment" : alignmentScore >= 31 ? "Moderate Alignment" : "Low Alignment";
  const dominantCluster = getDominantCluster(windowData.self_words);
  const archetype = getArchetype(dominantCluster);
  const anchorWord = windowData.self_words_ranked[0] ? findWord(windowData.self_words_ranked[0]) : null;
  const peerAnchorWord = peers[0]?.words_ranked[0] ? findWord(peers[0].words_ranked[0]) : null;

  // Trait pattern grouping
  const clusterCounts: Partial<Record<Cluster, { self: string[]; peer: string[] }>> = {};
  [...windowData.self_words].forEach((id) => {
    const w = findWord(id);
    if (!w) return;
    if (!clusterCounts[w.primary_cluster]) clusterCounts[w.primary_cluster] = { self: [], peer: [] };
    clusterCounts[w.primary_cluster]!.self.push(id);
  });
  panels.allPeerWords.forEach((id) => {
    const w = findWord(id);
    if (!w) return;
    if (!clusterCounts[w.primary_cluster]) clusterCounts[w.primary_cluster] = { self: [], peer: [] };
    clusterCounts[w.primary_cluster]!.peer.push(id);
  });

  const peerEvidences = peers
    .filter((p) => p.peer_behavior_example)
    .map((p) => ({ name: p.peer_name, example: p.peer_behavior_example, unseen: p.peer_unseen_quality }));

  const purposes = windowData.assessment_purposes;
  const purposeDisplay = purposes.length === 0 ? null :
    purposes.length === 1 ? `Tujuan utama kamu: ${purposes[0]}.` :
    `Dua tujuan utama kamu: ${purposes.slice(0, 2).join(" dan ")}.`;

  return (
    <div className="min-h-screen bg-background print:bg-white">
      {/* Print-only styles */}
      <style>{`@media print { .no-print { display: none !important; } }`}</style>

      {/* Nav bar */}
      <div className="no-print sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between">
          <button onClick={() => nav(-1)} className="text-sm text-muted-foreground hover:text-foreground">← Kembali</button>
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Johari Deep Mirror Report</span>
          <button onClick={() => window.print()} className="rounded-full border border-border px-4 py-1.5 text-xs hover:border-foreground">Cetak / PDF</button>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-12 print:py-6">
        {/* Header */}
        <div className="rounded-[2rem] bg-gradient-brand p-8 text-primary-foreground print:rounded-xl">
          <div className="font-mono text-xs uppercase tracking-widest opacity-80">Johari Deep Mirror Report</div>
          <h1 className="mt-3 font-serif text-4xl">{windowData.name}</h1>
          <p className="mt-2 text-primary-foreground/80 text-sm">Laporan refleksi personal tentang bagaimana kamu melihat diri sendiri, bagaimana orang lain menangkapmu, dan apa gap yang bisa menjadi ruang tumbuh.</p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-primary-foreground/70">
            <span>{new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span>·</span>
            <span>{peers.length} peer mengisi</span>
            <span>·</span>
            <span>Alignment {alignmentScore}%</span>
          </div>
        </div>

        {/* Notice if few peers */}
        {peers.length < 3 && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
            {peers.length === 0
              ? "Karena jumlah feedback peer masih nol, laporan ini dibuat berdasarkan self-assessment saja. Hasil akan jauh lebih kaya setelah minimal 3 peer mengisi."
              : `Karena jumlah feedback peer masih terbatas (${peers.length}), hasil ini sebaiknya dibaca sebagai refleksi awal, bukan kesimpulan final.`}
          </div>
        )}

        {/* 1. Ringkasan Profil */}
        <Section title="1. Ringkasan Profil">
          <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
            <p>
              Berdasarkan self-assessment yang kamu isi, kamu menggambarkan dirimu melalui kata-kata yang mencerminkan pola{" "}
              {dominantCluster ? CLUSTER_NAMES[dominantCluster].id.toLowerCase() : "yang beragam"}.
              {anchorWord && ` Kata yang paling kuat menggambarkan kamu adalah "${anchorWord.en}" (${anchorWord.id_label}) — sebuah identitas anchor yang menjadi pusat dari cara kamu melihat dirimu sendiri.`}
            </p>
            {peers.length > 0 && (
              <p>
                Dari {peers.length} peer yang mengisi,{" "}
                {panels.open.length > 0
                  ? `ada ${panels.open.length} kualitas yang sama-sama kamu dan orang lain lihat, yaitu: ${panels.open.map((id) => findWord(id)?.en).join(", ")}.`
                  : "belum ada kata yang sama persis antara pilihan kamu dan peer, tetapi ada pola kedekatan makna yang menarik untuk ditelusuri."}
                {panels.blind.length > 0 && ` Selain itu, ada ${panels.blind.length} kualitas yang peer lihat tapi belum kamu klaim sebagai bagian dari gambaran dirimu.`}
              </p>
            )}
            <p>
              {archetype.name} — {archetype.desc}
            </p>
          </div>
        </Section>

        {/* 2. Tujuan */}
        {purposes.length > 0 && (
          <Section title="2. Tujuan Mengambil Johari Window">
            <div className="rounded-2xl border border-border bg-card px-5 py-4 text-sm">
              <p className="text-foreground">{purposeDisplay}</p>
              {windowData.assessment_purpose_other && (
                <p className="mt-2 text-muted-foreground">Kamu juga menuliskan: "{windowData.assessment_purpose_other}"</p>
              )}
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Laporan ini membaca hasil Johari Window-mu dari sudut pandang tujuan tersebut, dengan fokus pada insight yang paling relevan untukmu saat ini.
              </p>
            </div>
          </Section>
        )}

        {/* 3. Johari Window Map */}
        <Section title="3. Johari Window Map">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Open", count: panels.open.length, bg: "bg-emerald-100 text-emerald-900", desc: "Dikenal bersama" },
              { label: "Blind", count: panels.blind.length, bg: "bg-orange-100 text-orange-900", desc: "Peer lihat, kamu belum" },
              { label: "Hidden", count: panels.hidden.length, bg: "bg-violet-100 text-violet-900", desc: "Kamu tahu, peer belum" },
              { label: "Unknown", count: "?", bg: "bg-amber-100 text-amber-900", desc: "Belum muncul di data" },
            ].map((q) => (
              <div key={q.label} className={cn("rounded-2xl p-5 text-center", q.bg)}>
                <div className="font-serif text-3xl font-bold">{q.count}</div>
                <div className="mt-1 font-semibold text-sm">{q.label}</div>
                <div className="mt-0.5 text-xs opacity-70">{q.desc}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* 4. Open Area */}
        <Section title="4. Open Area — Kekuatan yang Dikenal Bersama">
          {panels.open.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {panels.open.map((id) => <WordChip key={id} id={id} label={panels.strongOpen.includes(id) ? "Top 3" : undefined} />)}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kualitas-kualitas ini sudah terlihat jelas dan konsisten — baik dari dalam dirimu maupun dari mata orang-orang yang mengenalmu. Ini adalah kekuatan yang paling bisa kamu andalkan dan komunikasikan.
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {peers.length === 0
                ? "Belum bisa dianalisis tanpa input peer."
                : "Belum ada kata yang sama persis antara pilihan self dan peer. Ini bukan hal yang buruk — baca bagian Resonance Area untuk melihat kedekatan makna yang mungkin ada."}
            </p>
          )}
        </Section>

        {/* 5. Blind Spot */}
        <Section title="5. Blind Spot — Kekuatan yang Belum Kamu Sadari">
          {peers.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum bisa dianalisis tanpa input peer.</p>
          ) : panels.blind.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tidak ada blind spot terdeteksi — kamu dan peer memiliki pandangan yang sangat selaras.</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {panels.blind.map((id) => <WordChip key={id} id={id} label={panels.strongBlind.includes(id) ? "Top 3 Peer" : undefined} />)}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ini adalah kualitas yang peer lihat dalam dirimu, tetapi belum kamu pilih sebagai bagian dari gambaran utama dirimu.
                Bisa jadi kamu menganggap ini biasa, belum sepenuhnya mengakuinya, atau melihatnya dari sudut pandang yang berbeda.
                {panels.strongBlind.length > 0 && ` Kata ${panels.strongBlind.map((id) => `"${findWord(id)?.en}"`).join(" dan ")} adalah yang paling kuat muncul di mata peer (masuk Top 3 mereka).`}
              </p>
            </>
          )}
        </Section>

        {/* 6. Hidden Strength */}
        <Section title="6. Hidden Strength — Kualitas yang Belum Terlihat">
          {panels.hidden.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tidak ada hidden area — semua kualitas yang kamu rasakan sudah terlihat oleh peer.</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {panels.hidden.map((id) => <WordChip key={id} id={id} label={panels.strongHidden.includes(id) ? "Top 3 Self" : undefined} />)}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kamu merasakan kualitas-kualitas ini kuat dalam dirimu, tetapi peer belum banyak melihatnya.
                Ini bisa berarti kualitas tersebut muncul hanya di konteks tertentu, belum dikomunikasikan secara eksplisit, atau belum cukup konsisten terlihat dalam interaksi sehari-hari.
                {panels.strongHidden.length > 0 && ` ${panels.strongHidden.map((id) => `"${findWord(id)?.en}"`).join(" dan ")} adalah yang paling kuat kamu rasakan (masuk Top 3 Self).`}
              </p>
            </>
          )}
        </Section>

        {/* 7. Resonance Area */}
        {peers.length > 0 && (
          <Section title="7. Resonance Area — Kedekatan Makna">
            {panels.resonance.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {panels.open.length > 0
                  ? "Kamu dan peer sudah berbicara dengan bahasa yang sama — tidak diperlukan resonansi tambahan."
                  : "Belum terdeteksi resonansi antar cluster. Perception gap antara self dan peer cukup signifikan untuk dieksplorasi lebih jauh."}
              </p>
            ) : (
              <div className="space-y-4">
                {panels.resonance.map((r) => (
                  <div key={r.cluster} className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
                    <div className="font-semibold text-sm text-indigo-900">{CLUSTER_NAMES[r.cluster].id}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {r.selfWords.map((id) => <span key={id} className="rounded-full bg-indigo-600 text-white px-3 py-1 text-xs font-medium">{findWord(id)?.en} (Self)</span>)}
                      {r.peerWords.map((id) => <span key={id} className="rounded-full bg-indigo-400 text-white px-3 py-1 text-xs font-medium">{findWord(id)?.en} (Peer)</span>)}
                    </div>
                    <p className="mt-2 text-xs text-indigo-700 leading-relaxed">
                      Walaupun kata-katanya berbeda, keduanya berada dalam kluster makna yang sama. Bahasa yang berbeda, kualitas yang berdekatan.
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}

        {/* 8. Trait Pattern */}
        <Section title="8. Pola Trait">
          <div className="space-y-3">
            {Object.entries(clusterCounts)
              .filter(([, v]) => v.self.length > 0 || v.peer.length > 0)
              .sort((a, b) => (b[1].self.length + b[1].peer.length) - (a[1].self.length + a[1].peer.length))
              .map(([cluster, { self: sw, peer: pw }]) => (
                <div key={cluster} className="rounded-2xl border border-border bg-card px-5 py-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{CLUSTER_NAMES[cluster as Cluster].id}</span>
                    <span className="font-mono text-xs text-muted-foreground">{sw.length + pw.length} kata</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {sw.map((id) => <span key={id} className="text-[11px] rounded-full bg-primary/10 text-primary px-2 py-0.5">{findWord(id)?.en}</span>)}
                    {pw.filter((id) => !sw.includes(id)).map((id) => <span key={id} className="text-[11px] rounded-full bg-muted text-muted-foreground px-2 py-0.5">{findWord(id)?.en}</span>)}
                  </div>
                </div>
              ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Warna primer = kamu pilih. Abu-abu = peer pilih (tidak ada di self).</p>
        </Section>

        {/* 9. Alignment Score */}
        <Section title="9. Self–Peer Alignment Score">
          <div className="rounded-2xl border border-border bg-card p-6 flex items-center gap-6">
            <div className="text-center shrink-0">
              <div className={cn("font-serif text-5xl font-bold",
                alignmentScore >= 61 ? "text-emerald-600" : alignmentScore >= 31 ? "text-amber-600" : "text-orange-600"
              )}>{alignmentScore}%</div>
              <div className="mt-1 font-mono text-xs text-muted-foreground uppercase tracking-widest">{alignmentLabel}</div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {alignmentScore >= 61
                ? "Persepsi diri dan persepsi orang lain cukup konsisten. Cara kamu melihat dirimu sudah cukup selaras dengan cara orang lain melihatmu."
                : alignmentScore >= 31
                ? "Ada sebagian kualitas yang selaras, tetapi masih ada beberapa area yang belum terlihat atau belum disadari oleh salah satu pihak."
                : peers.length === 0
                ? "Alignment belum bisa dihitung karena belum ada peer yang mengisi."
                : "Ada gap yang cukup besar antara cara kamu melihat diri dan cara orang lain melihatmu. Ini bukan hal buruk — justru di sini letak insight yang paling berharga."}
            </p>
          </div>
        </Section>

        {/* 10. Archetype */}
        <Section title="10. Strength Theme / Personal Archetype">
          <div className="rounded-2xl bg-gradient-brand-soft border border-border p-6">
            <div className="font-mono text-xs uppercase tracking-widest text-primary">{dominantCluster ? CLUSTER_NAMES[dominantCluster].en : "Multifaceted"}</div>
            <div className="mt-2 font-serif text-2xl text-foreground">{archetype.name}</div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{archetype.desc}</p>
          </div>
        </Section>

        {/* 11. Contextual Insight */}
        {purposes.length > 0 && (
          <Section title="11. Contextual Insight">
            <div className="rounded-2xl border border-border bg-card px-5 py-5 text-sm leading-relaxed text-muted-foreground space-y-3">
              <p>Karena kamu mengambil Johari Window ini untuk <strong className="text-foreground">{purposes.join(" dan ")}</strong>, insight berikut paling relevan untukmu:</p>
              {purposes.some((p) => p.includes("karier")) && (
                <p>Dari sisi pengembangan karier, kekuatan yang sudah terlihat ({panels.open.map((id) => findWord(id)?.en).join(", ") || "—"}) adalah aset yang perlu terus kamu tampilkan. Sementara blind spot positifmu ({panels.blind.slice(0, 2).map((id) => findWord(id)?.en).join(", ") || "—"}) bisa menjadi kekuatan tambahan yang belum sepenuhnya kamu komunikasikan.</p>
              )}
              {purposes.some((p) => p.includes("Leadership") || p.includes("leadership")) && (
                <p>Sebagai pemimpin, cara orang lain mengalami kehadiranmu sangat penting. Blind spot yang ada mungkin adalah kualitas kepemimpinan yang kamu miliki tapi belum cukup eksplisit dikomunikasikan.</p>
              )}
              {purposes.some((p) => p.includes("Self-awareness")) && (
                <p>Untuk self-awareness, area yang paling berharga adalah gap antara self dan peer — di sanalah bahan refleksi terdalam biasanya tersimpan.</p>
              )}
              {purposes.some((p) => p.includes("Personal branding")) && (
                <p>Untuk personal branding, fokus pada Open Area dan Blind Spot positif. Itulah kualitas yang orang langsung kenali dari kamu dan bisa menjadi fondasi narasimu.</p>
              )}
            </div>
          </Section>
        )}

        {/* 12. Rekomendasi */}
        <Section title="12. Rekomendasi Pengembangan">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Keep", color: "emerald", words: panels.open, desc: "Pertahankan kualitas yang sudah kuat dan konsisten terlihat." },
              { label: "Clarify", color: "blue", words: panels.hidden.slice(0, 2), desc: "Komunikasikan lebih eksplisit kualitas yang kamu rasakan tapi belum terlihat." },
              { label: "Notice", color: "orange", words: panels.blind.slice(0, 2), desc: "Mulai sadari dan klaim kualitas yang orang lain lihat dalam dirimu." },
              { label: "Explore", color: "violet", words: panels.resonance.flatMap((r) => r.selfWords).slice(0, 2), desc: "Eksplorasi area yang belum terlalu terlihat tapi mungkin relevan." },
            ].map(({ label, color, words, desc }) => (
              <div key={label} className={`rounded-2xl border border-${color}-200 bg-${color}-50 p-4`}>
                <div className={`font-semibold text-sm text-${color}-900`}>{label}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {words.length > 0
                    ? words.map((id) => <span key={id} className={`text-xs rounded-full bg-${color}-100 text-${color}-800 px-2.5 py-0.5`}>{findWord(id)?.en}</span>)
                    : <span className="text-xs text-muted-foreground italic">—</span>}
                </div>
                <p className={`mt-2 text-xs text-${color}-700 leading-relaxed`}>{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 13. Peer Evidence */}
        {peerEvidences.length > 0 && (
          <Section title="13. Peer Feedback Summary">
            <div className="space-y-3">
              {peerEvidences.map((e, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card px-5 py-4">
                  {e.name && <div className="font-mono text-xs text-muted-foreground mb-2">{e.name}</div>}
                  {e.example && <p className="text-sm text-foreground leading-relaxed">"{e.example}"</p>}
                  {e.unseen && <p className="mt-2 text-xs text-muted-foreground italic">Kualitas yang mungkin belum disadari: "{e.unseen}"</p>}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Feedback ini dikutip dari jawaban terbuka peer dan digunakan sebagai bahan refleksi, bukan sebagai evaluasi final.</p>
          </Section>
        )}

        {/* 14. Reflection Questions */}
        <Section title="14. Pertanyaan Refleksi">
          <div className="space-y-3">
            {[
              "Apa kualitas yang orang lain lihat dariku tapi aku sulit percaya?",
              "Apa bagian diriku yang ingin lebih terlihat?",
              "Apa feedback yang terasa paling mengejutkan?",
              "Apa pola yang selama ini mungkin aku ulangi tanpa sadar?",
              "Jika aku ingin tumbuh 10% lebih baik bulan ini, area mana yang paling masuk akal?",
            ].map((q, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card px-5 py-4 flex gap-4">
                <span className="font-mono text-sm text-muted-foreground shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-sm text-foreground">{q}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Closing */}
        <div className="mt-10 rounded-[2rem] bg-accent border border-border p-8">
          <h2 className="font-serif text-2xl text-foreground">Penutup</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Johari Window bukanlah cermin yang memperlihatkan siapa kamu sebenarnya — melainkan kaca jendela yang membantu kamu melihat lebih banyak sisi dari diri sendiri.
            Bisa jadi ada kualitas yang orang lain lihat yang belum kamu akui. Bisa jadi ada kekuatan yang kamu rasakan tapi belum cukup terlihat.
            Dan itu wajar.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Yang penting bukan seberapa sempurna hasilnya, tapi seberapa jujur kamu mau melihat dan tumbuh dari apa yang ada di sini.
            Laporan ini bukan diagnosis. Ini adalah percakapan — antara kamu, orang-orang yang mengenalmu, dan dirimu yang terus berkembang.
          </p>
        </div>

        <div className="mt-8 no-print flex flex-wrap gap-3 justify-center">
          <button onClick={() => nav(-1)} className="rounded-full border border-border px-6 py-3 text-sm hover:border-foreground">← Kembali ke Hasil</button>
          <button onClick={() => window.print()} className="rounded-full bg-gradient-brand px-6 py-3 text-sm font-medium text-primary-foreground shadow-brand">Cetak / Simpan PDF</button>
        </div>
      </div>
    </div>
  );
};

export default Report;
