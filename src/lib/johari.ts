import { WORDS, findWord, type Cluster } from "@/data/adjectives";

export const generateCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};

export type PanelKey = "open" | "blind" | "hidden" | "unknown";

export type PeerData = {
  words: string[];
  words_ranked: string[];
  peer_name?: string | null;
  peer_behavior_example?: string | null;
  peer_unseen_quality?: string | null;
};

export type ResonanceEntry = {
  cluster: Cluster;
  selfWords: string[];
  peerWords: string[];
};

export type JohariPanels = {
  open: string[];
  strongOpen: string[];
  blind: string[];
  strongBlind: string[];
  hidden: string[];
  strongHidden: string[];
  resonance: ResonanceEntry[];
  allPeerWords: string[];
};

export const computePanels = (
  selfWords: string[],
  selfRanked: string[],
  peers: PeerData[]
): JohariPanels => {
  const selfSet = new Set(selfWords);
  const allPeerWords = Array.from(new Set(peers.flatMap((p) => p.words)));
  const peerSet = new Set(allPeerWords);

  const selfTop3 = new Set(selfRanked.slice(0, 3));
  const peerTop3Sets = peers.map((p) => new Set(p.words_ranked.slice(0, 3)));

  const open = selfWords.filter((w) => peerSet.has(w));
  const strongOpen = open.filter((w) => {
    if (selfTop3.has(w)) return true;
    return peerTop3Sets.some((s) => s.has(w));
  });

  const blind = allPeerWords.filter((w) => !selfSet.has(w));
  const strongBlind = blind.filter((w) => peerTop3Sets.some((s) => s.has(w)));

  const hidden = selfWords.filter((w) => !peerSet.has(w));
  const strongHidden = hidden.filter((w) => selfTop3.has(w));

  // Resonance: same cluster, no exact match
  const resonance: ResonanceEntry[] = [];
  if (peers.length > 0) {
    const clusters = Array.from(new Set(WORDS.map((w) => w.primary_cluster))) as Cluster[];
    for (const cluster of clusters) {
      const selfInCluster = selfWords.filter((id) => {
        const w = findWord(id);
        return w && (w.primary_cluster === cluster || w.secondary_clusters.includes(cluster));
      });
      const peerInCluster = allPeerWords.filter((id) => {
        const w = findWord(id);
        return w && (w.primary_cluster === cluster || w.secondary_clusters.includes(cluster));
      });
      const hasExactMatch = selfInCluster.some((w) => peerInCluster.includes(w));
      if (selfInCluster.length > 0 && peerInCluster.length > 0 && !hasExactMatch) {
        resonance.push({ cluster, selfWords: selfInCluster, peerWords: peerInCluster });
      }
    }
  }

  return { open, strongOpen, blind, strongBlind, hidden, strongHidden, resonance, allPeerWords };
};

export const computeAlignmentScore = (selfWords: string[], allPeerWords: string[]): number => {
  if (selfWords.length === 0 || allPeerWords.length === 0) return 0;
  const selfSet = new Set(selfWords);
  const overlap = allPeerWords.filter((w) => selfSet.has(w)).length;
  const union = new Set([...selfWords, ...allPeerWords]).size;
  return Math.round((overlap / union) * 100);
};

export const getDominantCluster = (words: string[]): Cluster | null => {
  const counts: Partial<Record<Cluster, number>> = {};
  for (const id of words) {
    const w = findWord(id);
    if (w) counts[w.primary_cluster] = (counts[w.primary_cluster] ?? 0) + 1;
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted.length > 0 ? (sorted[0][0] as Cluster) : null;
};

export const getArchetype = (dominantCluster: Cluster | null): { name: string; desc: string } => {
  const map: Record<Cluster, { name: string; desc: string }> = {
    warmth_care: { name: "The Empathic Connector", desc: "Kamu hadir melalui kehangatan dan kepedulian yang tulus. Orang merasa aman dan diterima di dekatmu." },
    thinking_insight: { name: "The Reflective Thinker", desc: "Kamu mengolah dunia melalui pemikiran mendalam dan pengamatan yang tajam. Insight-mu sering melampaui permukaan." },
    confidence_presence: { name: "The Warm Challenger", desc: "Kamu hadir dengan keyakinan dan keberanian. Orang lain merasakan energi dan kepastian dari caramu membawa diri." },
    energy_expression: { name: "The Passionate Expresser", desc: "Antusiasme dan ekspresimu adalah kekuatanmu. Kamu membawa hidup ke dalam ruangan yang kamu masuki." },
    emotional_stability: { name: "The Grounded Anchor", desc: "Kamu adalah tempat berlabuh bagi orang-orang di sekitarmu. Stabilitas dan kedewasaanmu membuat orang merasa tenang." },
    growth_openness: { name: "The Curious Explorer", desc: "Kamu tumbuh dari rasa ingin tahu dan keterbukaan. Kamu melihat dunia sebagai ruang yang selalu bisa dieksplorasi lebih jauh." },
    reliability_integrity: { name: "The Dependable Builder", desc: "Kepercayaan adalah fondasi identitasmu. Orang tahu mereka bisa mengandalkanmu, dan itu kekuatan yang jarang." },
    independence_structure: { name: "The Focused Independent", desc: "Kamu bergerak dengan arah yang jelas dan kemampuan mandiri. Fokus dan struktur adalah cara kamu berkontribusi." },
    inner_depth: { name: "The Quiet Depth", desc: "Ada kedalaman dalam dirimu yang tidak langsung terlihat. Refleksi dan kompleksitasmu adalah aset yang berharga." },
  };
  return dominantCluster ? map[dominantCluster] : { name: "The Multifaceted Self", desc: "Kamu memiliki keberagaman kualitas yang tidak mudah dikotakkan dalam satu tema." };
};

type LegacyArchetype = {
  name_id: string; name_en: string;
  desc_id: string; desc_en: string;
  steps_id: string[]; steps_en: string[];
};

const LEGACY_ARCHETYPES: Record<Cluster, LegacyArchetype> = {
  warmth_care: {
    name_id: "The Empathic Connector", name_en: "The Empathic Connector",
    desc_id: "Kamu hadir melalui kehangatan dan kepedulian yang tulus. Orang merasa aman dan diterima di dekatmu.",
    desc_en: "You show up through genuine warmth and care. People feel safe and accepted around you.",
    steps_id: ["Ekspresikan kepedulian secara konkret, bukan hanya verbal", "Pelajari cara menjaga dirimu sendiri agar bisa terus memberi", "Bangun batasan sehat tanpa kehilangan kehangatan"],
    steps_en: ["Express care concretely, not just verbally", "Learn to care for yourself so you can keep giving", "Build healthy boundaries without losing warmth"],
  },
  reliability_integrity: {
    name_id: "The Dependable Builder", name_en: "The Dependable Builder",
    desc_id: "Kepercayaan adalah fondasi identitasmu. Orang tahu mereka bisa mengandalkanmu.",
    desc_en: "Trust is the foundation of your identity. People know they can rely on you.",
    steps_id: ["Komunikasikan ekspektasi dengan jelas sejak awal", "Akui keterbatasan sebelum berkomitmen lebih jauh", "Dokumentasikan apa yang kamu janjikan"],
    steps_en: ["Communicate expectations clearly upfront", "Acknowledge limits before over-committing", "Document what you promise"],
  },
  thinking_insight: {
    name_id: "The Reflective Thinker", name_en: "The Reflective Thinker",
    desc_id: "Kamu mengolah dunia melalui pemikiran mendalam. Insight-mu sering melampaui permukaan.",
    desc_en: "You process the world through deep thought. Your insights often go beyond the surface.",
    steps_id: ["Bagikan proses berpikirmu, bukan hanya kesimpulan", "Latih kemampuan menyederhanakan insight kompleks", "Cari partner diskusi yang bisa menantang gagasanmu"],
    steps_en: ["Share your thinking process, not just conclusions", "Practice simplifying complex insights", "Find discussion partners who can challenge your ideas"],
  },
  confidence_presence: {
    name_id: "The Warm Challenger", name_en: "The Warm Challenger",
    desc_id: "Kamu hadir dengan keyakinan dan keberanian. Orang lain merasakan energi dari caramu membawa diri.",
    desc_en: "You show up with confidence and courage. Others feel the energy in how you carry yourself.",
    steps_id: ["Gunakan keyakinanmu untuk memberdayakan orang lain", "Latih mendengar aktif sebelum mengambil alih", "Perhatikan kapan assertiveness menjadi dominance"],
    steps_en: ["Use your confidence to empower others", "Practice active listening before taking over", "Notice when assertiveness becomes dominance"],
  },
  emotional_stability: {
    name_id: "The Grounded Anchor", name_en: "The Grounded Anchor",
    desc_id: "Kamu adalah tempat berlabuh bagi orang-orang di sekitarmu. Stabilitas dan kedewasaanmu membuat orang tenang.",
    desc_en: "You are an anchor for those around you. Your stability and maturity put people at ease.",
    steps_id: ["Ekspresikan emosimu sendiri, jangan hanya menjadi pendengar", "Bagikan kerentananmu agar orang bisa mengenalmu lebih dalam", "Jaga ritme pemulihan dirimu secara rutin"],
    steps_en: ["Express your own emotions, don't just be the listener", "Share your vulnerabilities so people can know you deeper", "Maintain regular recovery rhythms for yourself"],
  },
  energy_expression: {
    name_id: "The Passionate Expresser", name_en: "The Passionate Expresser",
    desc_id: "Antusiasme dan ekspresimu adalah kekuatanmu. Kamu membawa hidup ke dalam ruangan yang kamu masuki.",
    desc_en: "Your enthusiasm and expression are your strengths. You bring life to every room you enter.",
    steps_id: ["Kanal energimu ke tujuan yang paling penting", "Beri orang lain ruang untuk berkontribusi", "Pelajari kapan perlu memperlambat untuk lebih berdampak"],
    steps_en: ["Channel your energy toward what matters most", "Give others space to contribute", "Learn when to slow down for greater impact"],
  },
  growth_openness: {
    name_id: "The Curious Explorer", name_en: "The Curious Explorer",
    desc_id: "Kamu tumbuh dari rasa ingin tahu dan keterbukaan. Kamu melihat dunia sebagai ruang yang selalu bisa dieksplorasi.",
    desc_en: "You grow from curiosity and openness. You see the world as a space always worth exploring.",
    steps_id: ["Pilih satu area untuk ditelusuri secara mendalam, bukan hanya luas", "Bagikan penemuanmu dengan orang lain untuk memperkaya diskusi", "Latih komitmen pada satu jalur sebelum berpindah"],
    steps_en: ["Choose one area to explore in depth, not just breadth", "Share your discoveries with others to enrich discussion", "Practice commitment to one path before shifting"],
  },
  independence_structure: {
    name_id: "The Focused Independent", name_en: "The Focused Independent",
    desc_id: "Kamu bergerak dengan arah yang jelas dan kemampuan mandiri. Fokus dan struktur adalah cara kamu berkontribusi.",
    desc_en: "You move with clear direction and independence. Focus and structure are how you contribute.",
    steps_id: ["Komunikasikan progres secara proaktif ke orang lain", "Undang kolaborasi di awal proses, bukan hanya di akhir", "Kenali kapan fleksibilitas lebih berguna dari struktur"],
    steps_en: ["Proactively communicate your progress to others", "Invite collaboration early in the process, not just at the end", "Recognize when flexibility serves better than structure"],
  },
  inner_depth: {
    name_id: "The Quiet Depth", name_en: "The Quiet Depth",
    desc_id: "Ada kedalaman dalam dirimu yang tidak langsung terlihat. Refleksi dan kompleksitasmu adalah aset berharga.",
    desc_en: "There is depth in you that isn't immediately visible. Your reflection and complexity are valuable assets.",
    steps_id: ["Temukan cara mengekspresikan dunia dalammu ke luar", "Cari komunitas yang menghargai kedalaman dan nuansa", "Percayai bahwa kehadiranmu yang tenang tetap berdampak"],
    steps_en: ["Find ways to express your inner world outward", "Seek communities that value depth and nuance", "Trust that your quiet presence still makes an impact"],
  },
};

export const computeArchetypes = (
  self: string[],
  peers: string[][]
): { primary: LegacyArchetype; secondary: LegacyArchetype } => {
  const allWords = [...self, ...peers.flat()];
  const counts: Partial<Record<Cluster, number>> = {};
  for (const id of allWords) {
    const w = findWord(id);
    if (w) counts[w.primary_cluster] = (counts[w.primary_cluster] ?? 0) + 1;
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]) as [Cluster, number][];
  const primary = LEGACY_ARCHETYPES[sorted[0]?.[0] ?? "warmth_care"];
  const secondary = LEGACY_ARCHETYPES[sorted[1]?.[0] ?? "thinking_insight"];
  return { primary, secondary };
};

// Legacy compat
export const computePanelsLegacy = (self: string[], peers: string[][]) => {
  const selfSet = new Set(self);
  const peerSet = new Set<string>();
  peers.forEach((p) => p.forEach((w) => peerSet.add(w)));
  const all = WORDS.map((a) => a.id);
  return {
    open: all.filter((w) => selfSet.has(w) && peerSet.has(w)),
    blind: all.filter((w) => !selfSet.has(w) && peerSet.has(w)),
    hidden: all.filter((w) => selfSet.has(w) && !peerSet.has(w)),
    unknown: all.filter((w) => !selfSet.has(w) && !peerSet.has(w)),
  };
};
