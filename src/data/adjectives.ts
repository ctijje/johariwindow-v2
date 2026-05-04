export type Archetype =
  | "creator"
  | "leader"
  | "connector"
  | "analyst"
  | "empath"
  | "executor";

export type Adjective = {
  id: string;
  label_id: string;
  label_en: string;
  sub_id: string;
  sub_en: string;
  archetype: Archetype;
};

export const ADJECTIVES: Adjective[] = [
  { id: "visioner", label_id: "Visioner", label_en: "Visionary", sub_id: "Melihat gambaran besar", sub_en: "Sees the big picture", archetype: "creator" },
  { id: "analitis", label_id: "Analitis", label_en: "Analytical", sub_id: "Senang bongkar masalah", sub_en: "Loves unpacking problems", archetype: "analyst" },
  { id: "empatik", label_id: "Empatik", label_en: "Empathetic", sub_id: "Peka terhadap orang lain", sub_en: "Tuned in to others", archetype: "empath" },
  { id: "kreatif", label_id: "Kreatif", label_en: "Creative", sub_id: "Suka membuat hal baru", sub_en: "Loves making new things", archetype: "creator" },
  { id: "komunikatif", label_id: "Komunikatif", label_en: "Communicative", sub_id: "Mudah menyampaikan ide", sub_en: "Conveys ideas clearly", archetype: "connector" },
  { id: "sistematis", label_id: "Sistematis", label_en: "Systematic", sub_id: "Suka membuat struktur", sub_en: "Loves building structure", archetype: "executor" },
  { id: "persuasif", label_id: "Persuasif", label_en: "Persuasive", sub_id: "Bisa menggerakkan orang", sub_en: "Moves people to act", archetype: "leader" },
  { id: "kuriositif", label_id: "Kuriositif", label_en: "Curious", sub_id: "Selalu ingin tahu lebih", sub_en: "Always wants to know more", archetype: "analyst" },
  { id: "adaptif", label_id: "Adaptif", label_en: "Adaptive", sub_id: "Cepat menyesuaikan diri", sub_en: "Adapts quickly", archetype: "executor" },
  { id: "inspiratif", label_id: "Inspiratif", label_en: "Inspiring", sub_id: "Memberi semangat orang lain", sub_en: "Energizes others", archetype: "leader" },
  { id: "eksperimental", label_id: "Eksperimental", label_en: "Experimental", sub_id: "Berani coba hal baru", sub_en: "Dares to try new things", archetype: "creator" },
  { id: "strategis", label_id: "Strategis", label_en: "Strategic", sub_id: "Berpikir jangka panjang", sub_en: "Thinks long-term", archetype: "leader" },
  { id: "fasilitator", label_id: "Fasilitator", label_en: "Facilitator", sub_id: "Senang bantu orang berkembang", sub_en: "Helps others grow", archetype: "empath" },
  { id: "detail", label_id: "Detail-oriented", label_en: "Detail-oriented", sub_id: "Tidak ada yang terlewat", sub_en: "Nothing slips through", archetype: "executor" },
  { id: "naratif", label_id: "Naratif", label_en: "Narrative", sub_id: "Piawai bercerita", sub_en: "A natural storyteller", archetype: "connector" },
  { id: "pemimpin", label_id: "Pemimpin alami", label_en: "Natural leader", sub_id: "Orang datang minta arahan", sub_en: "People look to you for direction", archetype: "leader" },
  { id: "builder", label_id: "Builder", label_en: "Builder", sub_id: "Suka membangun dari nol", sub_en: "Loves building from zero", archetype: "creator" },
  { id: "konektor", label_id: "Konektor", label_en: "Connector", sub_id: "Jago jaringan dan relasi", sub_en: "Skilled at networks", archetype: "connector" },
  { id: "problem", label_id: "Problem-solver", label_en: "Problem-solver", sub_id: "Tenang hadapi hambatan", sub_en: "Calm under pressure", archetype: "analyst" },
  { id: "terorganisir", label_id: "Terorganisir", label_en: "Organized", sub_id: "Hidup rapi dan terencana", sub_en: "Lives tidy and planned", archetype: "executor" },
  { id: "berani", label_id: "Berani ambil risiko", label_en: "Risk-taker", sub_id: "Tidak takut melangkah", sub_en: "Not afraid to step", archetype: "leader" },
  { id: "mediator", label_id: "Mediator", label_en: "Mediator", sub_id: "Pandai meredakan konflik", sub_en: "Skilled at easing conflict", archetype: "empath" },
  { id: "imajinatif", label_id: "Imajinatif", label_en: "Imaginative", sub_id: "Pikiran penuh kemungkinan", sub_en: "Mind full of possibility", archetype: "creator" },
  { id: "data", label_id: "Data-driven", label_en: "Data-driven", sub_id: "Keputusan berbasis fakta", sub_en: "Decisions from facts", archetype: "analyst" },
];

export const findAdjective = (id: string) => ADJECTIVES.find((a) => a.id === id);