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
const mk = (
  id: string,
  label_en: string,
  label_id: string,
  sub_id: string,
  archetype: Archetype,
  sub_en = "",
): Adjective => ({ id, label_en, label_id, sub_id, sub_en, archetype });

export const ADJECTIVES: Adjective[] = [
  mk("able", "Able", "Mampu", "Bisa diandalkan untuk menyelesaikan hal", "executor"),
  mk("accepting", "Accepting", "Terbuka", "Menerima perbedaan tanpa menghakimi", "empath"),
  mk("adaptable", "Adaptable", "Adaptif", "Cepat menyesuaikan diri dengan situasi baru", "executor"),
  mk("bold", "Bold", "Tegas", "Berani ambil sikap dan menyampaikannya", "leader"),
  mk("brave", "Brave", "Pemberani", "Tidak mundur saat menghadapi tantangan", "leader"),
  mk("calm", "Calm", "Tenang", "Kepala dingin bahkan di situasi sulit", "empath"),
  mk("caring", "Caring", "Peduli", "Peka terhadap kondisi orang di sekitar", "empath"),
  mk("cheerful", "Cheerful", "Ceria", "Membawa energi positif ke lingkungan", "connector"),
  mk("clever", "Clever", "Cerdas", "Cepat memahami dan memproses informasi", "analyst"),
  mk("complex", "Complex", "Berlapis", "Punya kedalaman yang tidak langsung terlihat", "creator"),
  mk("confident", "Confident", "Percaya Diri", "Nyaman dengan diri sendiri dan kemampuannya", "leader"),
  mk("dependable", "Dependable", "Andal", "Orang tahu bisa mengandalkanmu", "executor"),
  mk("dignified", "Dignified", "Berwibawa", "Punya aura yang membuat orang menaruh hormat", "leader"),
  mk("energetic", "Energetic", "Energik", "Selalu punya tenaga untuk bergerak", "connector"),
  mk("extroverted", "Extroverted", "Ekstrovert", "Tumbuh dari interaksi dengan orang lain", "connector"),
  mk("friendly", "Friendly", "Ramah", "Mudah membuat orang merasa diterima", "connector"),
  mk("giving", "Giving", "Dermawan", "Senang memberi tanpa hitung-hitungan", "empath"),
  mk("happy", "Happy", "Bahagia", "Memancarkan ketenangan dan rasa syukur", "connector"),
  mk("helpful", "Helpful", "Ringan Tangan", "Selalu siap membantu tanpa diminta dua kali", "empath"),
  mk("idealistic", "Idealistic", "Idealis", "Punya visi tentang bagaimana seharusnya", "creator"),
  mk("independent", "Independent", "Mandiri", "Tidak perlu dituntun untuk mulai bergerak", "executor"),
  mk("ingenious", "Ingenious", "Inovatif", "Suka menemukan cara baru yang lebih baik", "creator"),
  mk("intelligent", "Intelligent", "Intelektual", "Senang menggali ide dan pengetahuan", "analyst"),
  mk("introverted", "Introverted", "Introvert", "Mendapat energi dari waktu dan ruang sendiri", "analyst"),
  mk("kind", "Kind", "Baik Hati", "Tulus dalam setiap tindakan dan perhatian", "empath"),
  mk("knowledgeable", "Knowledgeable", "Wawasan Luas", "Tahu banyak hal dari berbagai bidang", "analyst"),
  mk("logical", "Logical", "Logis", "Berpikir sistematis dan berbasis fakta", "analyst"),
  mk("loving", "Loving", "Penyayang", "Hubungan dengan orang lain terasa hangat", "empath"),
  mk("mature", "Mature", "Dewasa", "Merespons situasi dengan kepala dan hati", "leader"),
  mk("modest", "Modest", "Rendah Hati", "Tidak perlu sorotan untuk merasa cukup", "empath"),
  mk("nervous", "Nervous", "Gugup", "Merasakan tekanan sebelum momen penting", "empath"),
  mk("observant", "Observant", "Jeli", "Tidak ada yang luput dari perhatianmu", "analyst"),
  mk("organised", "Organised", "Terorganisir", "Hidup dan kerja rapi dan terencana", "executor"),
  mk("patient", "Patient", "Sabar", "Tidak mudah goyah saat menunggu atau menghadapi tekanan", "empath"),
  mk("powerful", "Powerful", "Berpengaruh", "Kata dan tindakanmu punya dampak nyata", "leader"),
  mk("proud", "Proud", "Bangga Diri", "Menghargai diri sendiri dan pencapaian", "leader"),
  mk("quiet", "Quiet", "Pendiam", "Bicara saat perlu, bukan sekadar mengisi keheningan", "analyst"),
  mk("reflective", "Reflective", "Reflektif", "Suka memaknai pengalaman sebelum melangkah", "analyst"),
  mk("relaxed", "Relaxed", "Santai", "Tidak mudah terbawa stress atau kepanikan", "empath"),
  mk("reliable", "Reliable", "Terpercaya", "Apa yang kamu katakan, kamu pegang", "executor"),
  mk("religious", "Religious", "Religius", "Nilai spiritual jadi pegangan dalam keseharian", "empath"),
  mk("responsive", "Responsive", "Responsif", "Cepat menanggapi tanpa membuat orang menunggu", "executor"),
  mk("searching", "Searching", "Penasaran", "Selalu ingin tahu lebih dalam tentang segalanya", "analyst"),
  mk("self_assertive", "Self-assertive", "Asertif", "Menyampaikan pendapat dengan jelas dan percaya diri", "leader"),
  mk("self_conscious", "Self-conscious", "Sadar Diri", "Tahu kelebihan dan keterbatasan diri dengan jujur", "analyst"),
  mk("sensible", "Sensible", "Bijak", "Keputusannya mempertimbangkan banyak sisi", "analyst"),
  mk("sentimental", "Sentimental", "Sentimental", "Menyimpan makna di balik hal-hal kecil", "empath"),
  mk("shy", "Shy", "Pemalu", "Butuh waktu untuk membuka diri ke orang baru", "analyst"),
  mk("silly", "Silly", "Konyol", "Tidak takut terlihat lucu demi mencairkan suasana", "connector"),
  mk("spontaneous", "Spontaneous", "Spontan", "Bergerak dari intuisi dan momen", "creator"),
  mk("sympathetic", "Sympathetic", "Empatik", "Bisa merasakan apa yang orang lain rasakan", "empath"),
  mk("tense", "Tense", "Tegang", "Membawa keseriusan ke situasi yang kamu anggap penting", "executor"),
  mk("trustworthy", "Trustworthy", "Amanah", "Dipercaya untuk memegang hal yang penting", "executor"),
  mk("warm", "Warm", "Hangat", "Kehadiranmu membuat orang merasa aman", "connector"),
  mk("wise", "Wise", "Bijaksana", "Pengalamanmu terasa dalam caramu merespons", "leader"),
  mk("witty", "Witty", "Jenaka", "Humormu natural dan membuat orang betah", "connector"),
];

export const findAdjective = (id: string) => ADJECTIVES.find((a) => a.id === id);