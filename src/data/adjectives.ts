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

// 56 Johari Window adjectives — sourced from johariwindow.id master plan.
const mk = (id: string, label_en: string, label_id: string, archetype: Archetype): Adjective => ({
  id, label_en, label_id, sub_en: "", sub_id: "", archetype,
});

export const ADJECTIVES: Adjective[] = [
  mk("able", "Able", "Mampu", "executor"),
  mk("accepting", "Accepting", "Terbuka (Menerima)", "empath"),
  mk("adaptable", "Adaptable", "Adaptif", "executor"),
  mk("bold", "Bold", "Tegas", "leader"),
  mk("brave", "Brave", "Pemberani", "leader"),
  mk("calm", "Calm", "Tenang", "empath"),
  mk("caring", "Caring", "Peduli", "empath"),
  mk("cheerful", "Cheerful", "Ceria", "connector"),
  mk("clever", "Clever", "Cerdas", "analyst"),
  mk("complex", "Complex", "Kompleks", "creator"),
  mk("confident", "Confident", "Percaya Diri", "leader"),
  mk("dependable", "Dependable", "Dapat Diandalkan", "executor"),
  mk("dignified", "Dignified", "Berwibawa", "leader"),
  mk("energetic", "Energetic", "Energik", "connector"),
  mk("extroverted", "Extroverted", "Ekstrovert", "connector"),
  mk("friendly", "Friendly", "Ramah", "connector"),
  mk("giving", "Giving", "Dermawan", "empath"),
  mk("happy", "Happy", "Bahagia", "connector"),
  mk("helpful", "Helpful", "Suka Membantu", "empath"),
  mk("idealistic", "Idealistic", "Idealis", "creator"),
  mk("independent", "Independent", "Mandiri", "executor"),
  mk("ingenious", "Ingenious", "Inovatif", "creator"),
  mk("intelligent", "Intelligent", "Intelektual", "analyst"),
  mk("introverted", "Introverted", "Introvert", "analyst"),
  mk("kind", "Kind", "Baik Hati", "empath"),
  mk("knowledgeable", "Knowledgeable", "Wawasan Luas", "analyst"),
  mk("logical", "Logical", "Logis", "analyst"),
  mk("loving", "Loving", "Penyayang", "empath"),
  mk("mature", "Mature", "Dewasa", "leader"),
  mk("modest", "Modest", "Rendah Hati", "empath"),
  mk("nervous", "Nervous", "Gugup", "empath"),
  mk("observant", "Observant", "Jeli", "analyst"),
  mk("organised", "Organised", "Terorganisir", "executor"),
  mk("patient", "Patient", "Sabar", "empath"),
  mk("powerful", "Powerful", "Berpengaruh", "leader"),
  mk("proud", "Proud", "Bangga Diri", "leader"),
  mk("quiet", "Quiet", "Pendiam", "analyst"),
  mk("reflective", "Reflective", "Reflektif", "analyst"),
  mk("relaxed", "Relaxed", "Santai", "empath"),
  mk("reliable", "Reliable", "Terpercaya", "executor"),
  mk("religious", "Religious", "Religius", "empath"),
  mk("responsive", "Responsive", "Responsif", "executor"),
  mk("searching", "Searching", "Penasaran", "analyst"),
  mk("self_assertive", "Self-assertive", "Asertif", "leader"),
  mk("self_conscious", "Self-conscious", "Sadar Diri", "analyst"),
  mk("sensible", "Sensible", "Bijak", "analyst"),
  mk("sentimental", "Sentimental", "Sentimental", "empath"),
  mk("shy", "Shy", "Pemalu", "analyst"),
  mk("silly", "Silly", "Konyol", "connector"),
  mk("spontaneous", "Spontaneous", "Spontan", "creator"),
  mk("sympathetic", "Sympathetic", "Empatik", "empath"),
  mk("tense", "Tense", "Tegang", "executor"),
  mk("trustworthy", "Trustworthy", "Amanah", "executor"),
  mk("warm", "Warm", "Hangat", "connector"),
  mk("wise", "Wise", "Bijaksana", "leader"),
  mk("witty", "Witty", "Jenaka", "connector"),
];

export const findAdjective = (id: string) => ADJECTIVES.find((a) => a.id === id);