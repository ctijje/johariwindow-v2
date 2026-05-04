import type { Archetype } from "./adjectives";

export type ArchetypeProfile = {
  key: Archetype;
  name_id: string;
  name_en: string;
  desc_id: string;
  desc_en: string;
  assessment_id: string;
  assessment_en: string;
  steps_id: string[];
  steps_en: string[];
};

export const ARCHETYPES: Record<Archetype, ArchetypeProfile> = {
  creator: {
    key: "creator",
    name_id: "Kreator & Inovator",
    name_en: "Creator & Innovator",
    desc_id: "Kamu melihat dunia sebagai kanvas. Membuat sesuatu dari nol, bereksperimen, dan mengekspresikan ide dalam bentuk nyata adalah dunia kamu.",
    desc_en: "You see the world as a canvas. Building from zero, experimenting, and expressing ideas in tangible form is your home turf.",
    assessment_id: "Holland Code (Artistic/Investigative) + Creative Thinking Assessment",
    assessment_en: "Holland Code (Artistic/Investigative) + Creative Thinking Assessment",
    steps_id: [
      "Catat semua ide yang pernah kamu buang — kemungkinan ada yang bernilai",
      "Cari medium ekspresi yang belum pernah dicoba: tulisan, visual, suara, produk",
      "Ukur output kreatifmu: berapa banyak yang sudah terwujud vs. masih di kepala?",
    ],
    steps_en: [
      "Log every idea you've discarded — some are worth more than you think",
      "Try a medium you haven't: writing, visual, audio, product",
      "Measure creative output: how much shipped vs. still in your head?",
    ],
  },
  leader: {
    key: "leader",
    name_id: "Pemimpin & Strategi",
    name_en: "Leader & Strategist",
    desc_id: "Kamu punya naluri kepemimpinan dan berpikir jangka panjang. Peranmu yang paling kuat adalah saat menentukan arah, bukan sekadar mengeksekusi.",
    desc_en: "You have leadership instinct and long-range thinking. You're strongest setting direction, not just executing.",
    assessment_id: "DISC Profile + CliftonStrengths (tema Strategic & Command)",
    assessment_en: "DISC Profile + CliftonStrengths (Strategic & Command themes)",
    steps_id: [
      "Identifikasi 1 keputusan besar yang sedang ditunda di lingkunganmu — coba pimpin",
      "Latih komunikasi visi: tulis arah 12 bulan ke depan dalam 1 paragraf",
      "Cari 1 mentor yang sudah memimpin tim atau inisiatif lebih besar",
    ],
    steps_en: [
      "Spot a stalled decision around you — try leading it",
      "Practice vision: write your 12-month direction in one paragraph",
      "Find one mentor leading a bigger team or initiative",
    ],
  },
  connector: {
    key: "connector",
    name_id: "Konektor & Komunikator",
    name_en: "Connector & Communicator",
    desc_id: "Kamu menjembatani orang, ide, dan komunitas. Kekuatan terbesarmu muncul saat menerjemahkan satu dunia ke dunia yang lain.",
    desc_en: "You bridge people, ideas, and communities. You shine translating one world into another.",
    assessment_id: "MBTI (E-* types) + StrengthsFinder (Woo, Communication)",
    assessment_en: "MBTI (E-* types) + StrengthsFinder (Woo, Communication)",
    steps_id: [
      "Petakan 5 komunitas berbeda yang kamu masuki — siapa belum pernah saling kenal?",
      "Mulai sesi rutin: podcast, salon, atau newsletter kecil",
      "Latih storytelling: ulang ceritakan ide kompleks dalam 60 detik",
    ],
    steps_en: [
      "Map 5 communities you're in — who hasn't met whom?",
      "Start a small rhythm: podcast, salon, mini newsletter",
      "Practice storytelling: retell a complex idea in 60 seconds",
    ],
  },
  analyst: {
    key: "analyst",
    name_id: "Analis & Pemikir",
    name_en: "Analyst & Thinker",
    desc_id: "Kamu suka membongkar sistem dan mencari pola. Kemampuanmu untuk berpikir tajam dan berbasis bukti adalah aset langka.",
    desc_en: "You love unpacking systems and finding patterns. Sharp, evidence-based thinking is your rare asset.",
    assessment_id: "Watson-Glaser Critical Thinking + Holland Code (Investigative)",
    assessment_en: "Watson-Glaser Critical Thinking + Holland Code (Investigative)",
    steps_id: [
      "Pilih 1 topik kompleks dan tulis ringkasan setiap minggu",
      "Bangun kebiasaan membaca riset primer, bukan hanya artikel populer",
      "Latih komunikasi data: ubah analisismu jadi 1 grafik yang mudah dibaca",
    ],
    steps_en: [
      "Pick one complex topic; write a weekly summary",
      "Build the habit of reading primary research, not just popular articles",
      "Practice data storytelling: turn analysis into one readable chart",
    ],
  },
  empath: {
    key: "empath",
    name_id: "Empati & Pendamping",
    name_en: "Empath & Companion",
    desc_id: "Kamu paham apa yang orang rasakan sebelum mereka mengatakannya. Kekuatanmu paling bermakna saat membantu orang melihat diri mereka lebih jelas.",
    desc_en: "You sense what people feel before they say it. You're most powerful helping others see themselves clearly.",
    assessment_id: "Empathy Quotient + StrengthsFinder (Empathy, Developer)",
    assessment_en: "Empathy Quotient + StrengthsFinder (Empathy, Developer)",
    steps_id: [
      "Mulai 1:1 rutin dengan 2 orang yang sedang bertumbuh",
      "Latih bertanya, bukan memberi saran — selama 3 menit penuh",
      "Cari pelatihan coaching atau active listening formal",
    ],
    steps_en: [
      "Start regular 1:1s with 2 growing people",
      "Practice asking, not advising — for a full 3 minutes",
      "Look into formal coaching or active-listening training",
    ],
  },
  executor: {
    key: "executor",
    name_id: "Eksekutor & Pengelola",
    name_en: "Executor & Operator",
    desc_id: "Kamu mengubah ide jadi hasil nyata. Disiplin dan struktur kamu adalah alasan banyak hal akhirnya selesai.",
    desc_en: "You turn ideas into reality. Your discipline and structure are why things actually ship.",
    assessment_id: "DISC (C-S profile) + CliftonStrengths (Achiever, Discipline)",
    assessment_en: "DISC (C-S profile) + CliftonStrengths (Achiever, Discipline)",
    steps_id: [
      "Audit sistem produktivitasmu — apa yang bocor?",
      "Ambil 1 proyek mandek dari orang lain dan selesaikan",
      "Belajar 1 framework operasi baru: OKR, EOS, atau Scrum",
    ],
    steps_en: [
      "Audit your productivity system — where does it leak?",
      "Take a stalled project from someone and finish it",
      "Learn one new ops framework: OKR, EOS, or Scrum",
    ],
  },
};