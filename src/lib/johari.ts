import { ADJECTIVES, findAdjective, type Archetype } from "@/data/adjectives";
import { ARCHETYPES } from "@/data/archetypes";

export const generateCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};

export type PanelKey = "open" | "blind" | "hidden" | "unknown";

export const computePanels = (self: string[], peers: string[][]) => {
  const selfSet = new Set(self);
  const peerSet = new Set<string>();
  peers.forEach((p) => p.forEach((w) => peerSet.add(w)));
  const all = ADJECTIVES.map((a) => a.id);
  const open = all.filter((w) => selfSet.has(w) && peerSet.has(w));
  const blind = all.filter((w) => !selfSet.has(w) && peerSet.has(w));
  const hidden = all.filter((w) => selfSet.has(w) && !peerSet.has(w));
  const unknown = all.filter((w) => !selfSet.has(w) && !peerSet.has(w));
  return { open, blind, hidden, unknown };
};

export const computeArchetypes = (selfWords: string[], peerWords: string[][]) => {
  // Score: open + hidden words (i.e., self picks) weighted higher
  const scores: Record<Archetype, number> = {
    creator: 0, leader: 0, connector: 0, analyst: 0, empath: 0, executor: 0,
  };
  selfWords.forEach((w) => {
    const a = findAdjective(w); if (a) scores[a.archetype] += 2;
  });
  peerWords.flat().forEach((w) => {
    const a = findAdjective(w); if (a) scores[a.archetype] += 1;
  });
  const sorted = (Object.entries(scores) as [Archetype, number][])
    .sort((a, b) => b[1] - a[1]);
  return {
    primary: ARCHETYPES[sorted[0][0]],
    secondary: ARCHETYPES[sorted[1][0]],
    scores,
  };
};