export type Cluster =
  | "warmth_care"
  | "reliability_integrity"
  | "thinking_insight"
  | "confidence_presence"
  | "emotional_stability"
  | "energy_expression"
  | "growth_openness"
  | "independence_structure"
  | "inner_depth";

export type Word = {
  id: string;
  en: string;
  id_label: string;
  description_id: string;
  description_en: string;
  primary_cluster: Cluster;
  secondary_clusters: Cluster[];
};

export const CLUSTER_NAMES: Record<Cluster, { id: string; en: string }> = {
  warmth_care: { id: "Kehangatan & Kepedulian", en: "Warmth & Care" },
  reliability_integrity: { id: "Keandalan & Integritas", en: "Reliability & Integrity" },
  thinking_insight: { id: "Pemikiran & Wawasan", en: "Thinking & Insight" },
  confidence_presence: { id: "Kepercayaan Diri & Kehadiran", en: "Confidence & Presence" },
  emotional_stability: { id: "Stabilitas Emosi & Kedewasaan", en: "Emotional Stability & Maturity" },
  energy_expression: { id: "Energi & Ekspresi", en: "Energy & Expression" },
  growth_openness: { id: "Pertumbuhan & Keterbukaan", en: "Growth & Openness" },
  independence_structure: { id: "Kemandirian & Struktur", en: "Independence & Structure" },
  inner_depth: { id: "Kedalaman Batin", en: "Inner Depth & Complexity" },
};

export const WORDS: Word[] = [
  { id: "warm", en: "Warm", id_label: "Hangat", description_id: "Membuat orang di sekitarmu merasa nyaman dan diterima", description_en: "Makes people around you feel comfortable and welcomed", primary_cluster: "warmth_care", secondary_clusters: ["energy_expression"] },
  { id: "caring", en: "Caring", id_label: "Peduli", description_id: "Memperhatikan kebutuhan dan perasaan orang lain dengan tulus", description_en: "Genuinely attentive to the needs and feelings of others", primary_cluster: "warmth_care", secondary_clusters: ["reliability_integrity"] },
  { id: "dependable", en: "Dependable", id_label: "Bisa Diandalkan", description_id: "Selalu menepati janji dan kata-kata", description_en: "Always follows through on commitments and promises", primary_cluster: "reliability_integrity", secondary_clusters: ["independence_structure"] },
  { id: "creative", en: "Creative", id_label: "Kreatif", description_id: "Melihat kemungkinan baru dan menghasilkan ide-ide segar", description_en: "Sees new possibilities and generates fresh ideas", primary_cluster: "growth_openness", secondary_clusters: ["inner_depth"] },
  { id: "bold", en: "Bold", id_label: "Berani", description_id: "Berani mengambil tindakan meski ada risiko atau ketidakpastian", description_en: "Takes action even in the face of risk or uncertainty", primary_cluster: "confidence_presence", secondary_clusters: ["energy_expression"] },
  { id: "empathetic", en: "Empathetic", id_label: "Empatik", description_id: "Bisa merasakan dan memahami perasaan orang lain dari sudut pandang mereka", description_en: "Can feel and understand others' emotions from their perspective", primary_cluster: "warmth_care", secondary_clusters: ["thinking_insight"] },
  { id: "calm", en: "Calm", id_label: "Tenang", description_id: "Tetap stabil dan tidak mudah panik dalam berbagai situasi", description_en: "Stays stable and does not easily panic in various situations", primary_cluster: "emotional_stability", secondary_clusters: ["thinking_insight"] },
  { id: "energetic", en: "Energetic", id_label: "Energik", description_id: "Memiliki semangat dan vitalitas tinggi dalam keseharian", description_en: "Has high enthusiasm and vitality in daily life", primary_cluster: "energy_expression", secondary_clusters: ["confidence_presence"] },
  { id: "curious", en: "Curious", id_label: "Penasaran", description_id: "Selalu ingin tahu dan senang menjelajahi hal-hal baru", description_en: "Always eager to know more and explore new things", primary_cluster: "growth_openness", secondary_clusters: ["thinking_insight"] },
  { id: "honest", en: "Honest", id_label: "Jujur", description_id: "Berbicara dan bertindak sesuai kebenaran, meski tidak mudah", description_en: "Speaks and acts truthfully, even when it's not easy", primary_cluster: "reliability_integrity", secondary_clusters: ["confidence_presence"] },
  { id: "giving", en: "Giving", id_label: "Dermawan", description_id: "Senang memberi waktu, energi, atau perhatian tanpa mengharapkan imbalan", description_en: "Enjoys giving time, energy, or attention without expecting return", primary_cluster: "warmth_care", secondary_clusters: ["reliability_integrity"] },
  { id: "humble", en: "Humble", id_label: "Rendah Hati", description_id: "Tidak melebih-lebihkan diri sendiri dan terbuka pada masukan", description_en: "Doesn't overstate oneself and remains open to feedback", primary_cluster: "emotional_stability", secondary_clusters: ["warmth_care"] },
  { id: "thoughtful", en: "Thoughtful", id_label: "Penuh Pertimbangan", description_id: "Memikirkan dampak pada orang lain sebelum bertindak atau berbicara", description_en: "Considers impact on others before acting or speaking", primary_cluster: "thinking_insight", secondary_clusters: ["warmth_care"] },
  { id: "spontaneous", en: "Spontaneous", id_label: "Spontan", description_id: "Bertindak dari dorongan saat itu tanpa banyak perhitungan", description_en: "Acts on the moment's impulse without much calculation", primary_cluster: "energy_expression", secondary_clusters: ["growth_openness"] },
  { id: "wise", en: "Wise", id_label: "Bijaksana", description_id: "Menggunakan pengalaman dan pemahaman mendalam untuk membuat keputusan baik", description_en: "Uses deep experience and understanding to make good decisions", primary_cluster: "thinking_insight", secondary_clusters: ["emotional_stability"] },
  { id: "patient", en: "Patient", id_label: "Sabar", description_id: "Mampu menunggu dan menghadapi situasi sulit tanpa mudah frustrasi", description_en: "Can wait and face difficult situations without getting easily frustrated", primary_cluster: "emotional_stability", secondary_clusters: ["reliability_integrity"] },
  { id: "loyal", en: "Loyal", id_label: "Setia", description_id: "Tetap berkomitmen pada orang-orang yang penting bagimu", description_en: "Remains committed to the people who matter to you", primary_cluster: "reliability_integrity", secondary_clusters: ["warmth_care"] },
  { id: "independent", en: "Independent", id_label: "Mandiri", description_id: "Mampu berpikir dan bertindak sendiri tanpa bergantung berlebihan pada orang lain", description_en: "Can think and act on your own without over-relying on others", primary_cluster: "independence_structure", secondary_clusters: ["confidence_presence"] },
  { id: "reflective", en: "Reflective", id_label: "Reflektif", description_id: "Suka merenungkan pengalaman dan mencari pelajaran dari dalamnya", description_en: "Enjoys pondering experiences and finding lessons within them", primary_cluster: "inner_depth", secondary_clusters: ["thinking_insight"] },
  { id: "authentic", en: "Authentic", id_label: "Autentik", description_id: "Menjadi diri sendiri tanpa berpura-pura atau menyesuaikan diri berlebihan", description_en: "Being yourself without pretending or over-adapting to others", primary_cluster: "confidence_presence", secondary_clusters: ["inner_depth"] },
  { id: "optimistic", en: "Optimistic", id_label: "Optimis", description_id: "Cenderung melihat sisi positif dan berharap hal-hal akan berhasil", description_en: "Tends to see the positive side and expects things to work out", primary_cluster: "growth_openness", secondary_clusters: ["energy_expression"] },
  { id: "grounded", en: "Grounded", id_label: "Membumi", description_id: "Tetap realistis dan terhubung dengan kenyataan, tidak mudah terbawa arus", description_en: "Stays realistic and connected to reality, not easily swept away", primary_cluster: "emotional_stability", secondary_clusters: ["inner_depth"] },
  { id: "adventurous", en: "Adventurous", id_label: "Suka Petualangan", description_id: "Terbuka dan antusias untuk mencoba pengalaman yang tidak familiar", description_en: "Open and enthusiastic about trying unfamiliar experiences", primary_cluster: "growth_openness", secondary_clusters: ["energy_expression"] },
  { id: "supportive", en: "Supportive", id_label: "Suportif", description_id: "Hadir dan aktif mendukung orang lain saat mereka membutuhkan", description_en: "Present and actively supports others when they need it", primary_cluster: "warmth_care", secondary_clusters: ["reliability_integrity"] },
  { id: "observant", en: "Observant", id_label: "Jeli", description_id: "Memperhatikan detail dan hal-hal kecil yang sering terlewat orang lain", description_en: "Notices details and small things that others often miss", primary_cluster: "thinking_insight", secondary_clusters: ["inner_depth"] },
  { id: "passionate", en: "Passionate", id_label: "Bersemangat", description_id: "Memiliki antusiasme yang kuat terhadap hal-hal yang kamu pedulikan", description_en: "Has strong enthusiasm for the things you care about", primary_cluster: "energy_expression", secondary_clusters: ["confidence_presence"] },
  { id: "resilient", en: "Resilient", id_label: "Tangguh", description_id: "Mampu bangkit dan pulih setelah menghadapi kesulitan atau kegagalan", description_en: "Can bounce back and recover after facing difficulty or failure", primary_cluster: "emotional_stability", secondary_clusters: ["confidence_presence"] },
  { id: "kind", en: "Kind", id_label: "Baik Hati", description_id: "Bersikap baik dan siap membantu orang lain tanpa pamrih", description_en: "Naturally kind and ready to help others without being asked", primary_cluster: "warmth_care", secondary_clusters: ["reliability_integrity"] },
  { id: "playful", en: "Playful", id_label: "Suka Bermain", description_id: "Membawa keceriaan dan humor yang ringan dalam interaksi sehari-hari", description_en: "Brings lightness and humor to everyday interactions", primary_cluster: "energy_expression", secondary_clusters: ["warmth_care"] },
  { id: "direct", en: "Direct", id_label: "Terus Terang", description_id: "Menyampaikan pikiran dan perasaan secara langsung tanpa berputar-putar", description_en: "Expresses thoughts and feelings directly without going around", primary_cluster: "confidence_presence", secondary_clusters: ["reliability_integrity"] },
  { id: "confident", en: "Confident", id_label: "Percaya Diri", description_id: "Yakin dengan kemampuan dan penilaian dirimu sendiri", description_en: "Trusts your own abilities and judgment", primary_cluster: "confidence_presence", secondary_clusters: ["independence_structure"] },
  { id: "cheerful", en: "Cheerful", id_label: "Ceria", description_id: "Mudah tersenyum dan secara alami membawa suasana yang positif", description_en: "Easily smiles and naturally brings a positive atmosphere", primary_cluster: "energy_expression", secondary_clusters: ["warmth_care"] },
  { id: "adaptable", en: "Adaptable", id_label: "Mudah Beradaptasi", description_id: "Fleksibel menyesuaikan diri dengan perubahan situasi atau lingkungan", description_en: "Flexible in adjusting to changing situations or environments", primary_cluster: "growth_openness", secondary_clusters: ["emotional_stability"] },
  { id: "brave", en: "Brave", id_label: "Pemberani", description_id: "Berani menghadapi ketakutan atau situasi yang membuat tidak nyaman", description_en: "Willing to face fears or uncomfortable situations", primary_cluster: "confidence_presence", secondary_clusters: ["energy_expression"] },
  { id: "dignified", en: "Dignified", id_label: "Bermartabat", description_id: "Menjaga sikap dan perilaku yang terhormat dalam berbagai kondisi", description_en: "Maintains a respectful demeanor in various conditions", primary_cluster: "confidence_presence", secondary_clusters: ["emotional_stability"] },
  { id: "friendly", en: "Friendly", id_label: "Ramah", description_id: "Mudah bergaul dan membuat orang lain merasa disambut", description_en: "Easy to get along with and makes others feel welcomed", primary_cluster: "warmth_care", secondary_clusters: ["energy_expression"] },
  { id: "idealistic", en: "Idealistic", id_label: "Idealis", description_id: "Berpegang pada nilai-nilai tinggi dan visi tentang bagaimana sesuatu seharusnya", description_en: "Holds high values and a vision of how things should be", primary_cluster: "growth_openness", secondary_clusters: ["inner_depth"] },
  { id: "intelligent", en: "Intelligent", id_label: "Cerdas", description_id: "Mampu memahami dan memproses informasi dengan cepat dan akurat", description_en: "Can understand and process information quickly and accurately", primary_cluster: "thinking_insight", secondary_clusters: ["independence_structure"] },
  { id: "mature", en: "Mature", id_label: "Dewasa", description_id: "Berpikir dan bertindak dengan kedewasaan emosional yang sesuai atau lebih", description_en: "Thinks and acts with appropriate or above-average emotional maturity", primary_cluster: "emotional_stability", secondary_clusters: ["thinking_insight"] },
  { id: "modest", en: "Modest", id_label: "Bersahaja", description_id: "Tidak memamerkan diri meski memiliki banyak kelebihan", description_en: "Doesn't show off despite having many strengths", primary_cluster: "emotional_stability", secondary_clusters: ["warmth_care"] },
  { id: "organized", en: "Organized", id_label: "Terorganisir", description_id: "Menyukai keteraturan dan mampu mengelola hal-hal dengan sistematis", description_en: "Loves order and can manage things systematically", primary_cluster: "independence_structure", secondary_clusters: ["reliability_integrity"] },
  { id: "quiet", en: "Quiet", id_label: "Pendiam", description_id: "Lebih banyak mendengar dan mengamati daripada berbicara", description_en: "Listens and observes more than talks", primary_cluster: "inner_depth", secondary_clusters: ["thinking_insight"] },
  { id: "relaxed", en: "Relaxed", id_label: "Santai", description_id: "Tidak mudah stres dan nyaman dengan ritme yang lebih tenang", description_en: "Not easily stressed and comfortable with a calm pace", primary_cluster: "emotional_stability", secondary_clusters: ["inner_depth"] },
  { id: "sensible", en: "Sensible", id_label: "Masuk Akal", description_id: "Membuat keputusan berdasarkan pertimbangan praktis dan logis", description_en: "Makes decisions based on practical and logical consideration", primary_cluster: "thinking_insight", secondary_clusters: ["reliability_integrity"] },
  { id: "sympathetic", en: "Sympathetic", id_label: "Simpatik", description_id: "Turut merasakan dan peduli terhadap kesulitan yang dialami orang lain", description_en: "Shares in and cares about the difficulties others experience", primary_cluster: "warmth_care", secondary_clusters: ["emotional_stability"] },
  { id: "trustworthy", en: "Trustworthy", id_label: "Terpercaya", description_id: "Orang-orang bisa mempercayai ucapan dan tindakanmu sepenuhnya", description_en: "People can fully trust your words and actions", primary_cluster: "reliability_integrity", secondary_clusters: ["confidence_presence"] },
  { id: "witty", en: "Witty", id_label: "Cerdas Berbicara", description_id: "Memiliki selera humor yang tajam dan respons yang cerdas dalam percakapan", description_en: "Has sharp and clever responses in conversation", primary_cluster: "energy_expression", secondary_clusters: ["thinking_insight"] },
  { id: "complex", en: "Complex", id_label: "Kompleks", description_id: "Memiliki kepribadian berlapis yang tidak mudah dipahami sepenuhnya", description_en: "Has a layered personality that isn't easily fully understood", primary_cluster: "inner_depth", secondary_clusters: ["thinking_insight"] },
  { id: "proud", en: "Proud", id_label: "Bangga Diri", description_id: "Menghargai pencapaian dan identitas dirimu dengan cara yang sehat", description_en: "Appreciates your achievements and identity in a healthy way", primary_cluster: "confidence_presence", secondary_clusters: ["emotional_stability"] },
  { id: "sincere", en: "Sincere", id_label: "Tulus", description_id: "Bertindak dan berbicara dari hati, tanpa agenda tersembunyi", description_en: "Acts and speaks from the heart, without hidden agendas", primary_cluster: "reliability_integrity", secondary_clusters: ["warmth_care"] },
  { id: "focused", en: "Focused", id_label: "Fokus", description_id: "Mampu memusatkan perhatian dan energi tanpa mudah teralihkan", description_en: "Can concentrate attention and energy without getting easily distracted", primary_cluster: "independence_structure", secondary_clusters: ["thinking_insight"] },
  { id: "open_minded", en: "Open-minded", id_label: "Berpikiran Terbuka", description_id: "Mau mempertimbangkan perspektif dan ide yang berbeda dari milikmu", description_en: "Willing to consider perspectives and ideas different from your own", primary_cluster: "growth_openness", secondary_clusters: ["thinking_insight"] },
];

export const findWord = (id: string): Word | undefined => WORDS.find((w) => w.id === id);

// Backward compatibility
export type Archetype = "creator" | "leader" | "connector" | "analyst" | "empath" | "executor";
export type Adjective = {
  id: string; label_id: string; label_en: string;
  sub_id: string; sub_en: string; archetype: Archetype;
};
export const ADJECTIVES: Adjective[] = WORDS.map((w) => ({
  id: w.id,
  label_id: w.id_label,
  label_en: w.en,
  sub_id: w.description_id,
  sub_en: w.description_en,
  archetype: "connector" as Archetype,
}));
export const findAdjective = (id: string) => ADJECTIVES.find((a) => a.id === id);
