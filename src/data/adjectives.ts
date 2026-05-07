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
  mk("able", "Able", "Mampu", "Bisa diandalkan untuk menyelesaikan hal", "executor", "Reliable at getting things done"),
  mk("accepting", "Accepting", "Terbuka", "Menerima perbedaan tanpa menghakimi", "empath", "Welcomes differences without judgment"),
  mk("adaptable", "Adaptable", "Adaptif", "Cepat menyesuaikan diri dengan situasi baru", "executor", "Quickly adjusts to new situations"),
  mk("bold", "Bold", "Tegas", "Berani ambil sikap dan menyampaikannya", "leader", "Brave enough to take a stand and voice it"),
  mk("brave", "Brave", "Pemberani", "Tidak mundur saat menghadapi tantangan", "leader", "Doesn't back down from challenges"),
  mk("calm", "Calm", "Tenang", "Kepala dingin bahkan di situasi sulit", "empath", "Keeps a cool head even in tough situations"),
  mk("caring", "Caring", "Peduli", "Peka terhadap kondisi orang di sekitar", "empath", "Tuned in to how people around you feel"),
  mk("cheerful", "Cheerful", "Ceria", "Membawa energi positif ke lingkungan", "connector", "Brings positive energy into the room"),
  mk("clever", "Clever", "Cerdas", "Cepat memahami dan memproses informasi", "analyst", "Quick to understand and process information"),
  mk("complex", "Complex", "Berlapis", "Punya kedalaman yang tidak langsung terlihat", "creator", "Has depth that isn't obvious at first"),
  mk("confident", "Confident", "Percaya Diri", "Nyaman dengan diri sendiri dan kemampuannya", "leader", "Comfortable with yourself and your abilities"),
  mk("dependable", "Dependable", "Andal", "Orang tahu bisa mengandalkanmu", "executor", "People know they can count on you"),
  mk("dignified", "Dignified", "Berwibawa", "Punya aura yang membuat orang menaruh hormat", "leader", "Carries a presence that earns respect"),
  mk("energetic", "Energetic", "Energik", "Selalu punya tenaga untuk bergerak", "connector", "Always has the energy to keep moving"),
  mk("extroverted", "Extroverted", "Ekstrovert", "Tumbuh dari interaksi dengan orang lain", "connector", "Thrives on interaction with other people"),
  mk("friendly", "Friendly", "Ramah", "Mudah membuat orang merasa diterima", "connector", "Easily makes people feel welcome"),
  mk("giving", "Giving", "Dermawan", "Senang memberi tanpa hitung-hitungan", "empath", "Loves to give without keeping score"),
  mk("happy", "Happy", "Bahagia", "Memancarkan ketenangan dan rasa syukur", "connector", "Radiates calm and gratitude"),
  mk("helpful", "Helpful", "Ringan Tangan", "Selalu siap membantu tanpa diminta dua kali", "empath", "Always ready to help without being asked twice"),
  mk("idealistic", "Idealistic", "Idealis", "Punya visi tentang bagaimana seharusnya", "creator", "Has a vision of how things should be"),
  mk("independent", "Independent", "Mandiri", "Tidak perlu dituntun untuk mulai bergerak", "executor", "Doesn't need to be led to get started"),
  mk("ingenious", "Ingenious", "Inovatif", "Suka menemukan cara baru yang lebih baik", "creator", "Loves finding new and better ways"),
  mk("intelligent", "Intelligent", "Intelektual", "Senang menggali ide dan pengetahuan", "analyst", "Enjoys exploring ideas and knowledge"),
  mk("introverted", "Introverted", "Introvert", "Mendapat energi dari waktu dan ruang sendiri", "analyst", "Recharges from time and space alone"),
  mk("kind", "Kind", "Baik Hati", "Tulus dalam setiap tindakan dan perhatian", "empath", "Sincere in every action and gesture"),
  mk("knowledgeable", "Knowledgeable", "Wawasan Luas", "Tahu banyak hal dari berbagai bidang", "analyst", "Knows a lot across many fields"),
  mk("logical", "Logical", "Logis", "Berpikir sistematis dan berbasis fakta", "analyst", "Thinks systematically and fact-based"),
  mk("loving", "Loving", "Penyayang", "Hubungan dengan orang lain terasa hangat", "empath", "Your connections with others feel warm"),
  mk("mature", "Mature", "Dewasa", "Merespons situasi dengan kepala dan hati", "leader", "Responds to situations with head and heart"),
  mk("modest", "Modest", "Rendah Hati", "Tidak perlu sorotan untuk merasa cukup", "empath", "Doesn't need the spotlight to feel enough"),
  mk("nervous", "Nervous", "Gugup", "Merasakan tekanan sebelum momen penting", "empath", "Feels the pressure before big moments"),
  mk("observant", "Observant", "Jeli", "Tidak ada yang luput dari perhatianmu", "analyst", "Nothing escapes your attention"),
  mk("organised", "Organised", "Terorganisir", "Hidup dan kerja rapi dan terencana", "executor", "Lives and works neatly and with a plan"),
  mk("patient", "Patient", "Sabar", "Tidak mudah goyah saat menunggu atau menghadapi tekanan", "empath", "Steady under waiting and pressure"),
  mk("powerful", "Powerful", "Berpengaruh", "Kata dan tindakanmu punya dampak nyata", "leader", "Your words and actions have real impact"),
  mk("proud", "Proud", "Bangga Diri", "Menghargai diri sendiri dan pencapaian", "leader", "Honors yourself and your achievements"),
  mk("quiet", "Quiet", "Pendiam", "Bicara saat perlu, bukan sekadar mengisi keheningan", "analyst", "Speaks when needed, not just to fill silence"),
  mk("reflective", "Reflective", "Reflektif", "Suka memaknai pengalaman sebelum melangkah", "analyst", "Likes to make meaning of experience before moving on"),
  mk("relaxed", "Relaxed", "Santai", "Tidak mudah terbawa stress atau kepanikan", "empath", "Doesn't get swept up by stress or panic"),
  mk("reliable", "Reliable", "Terpercaya", "Apa yang kamu katakan, kamu pegang", "executor", "What you say, you stand by"),
  mk("religious", "Religious", "Religius", "Nilai spiritual jadi pegangan dalam keseharian", "empath", "Spiritual values guide your daily life"),
  mk("responsive", "Responsive", "Responsif", "Cepat menanggapi tanpa membuat orang menunggu", "executor", "Responds quickly without making others wait"),
  mk("searching", "Searching", "Penasaran", "Selalu ingin tahu lebih dalam tentang segalanya", "analyst", "Always wants to dig deeper into everything"),
  mk("self_assertive", "Self-assertive", "Asertif", "Menyampaikan pendapat dengan jelas dan percaya diri", "leader", "States opinions clearly and confidently"),
  mk("self_conscious", "Self-conscious", "Sadar Diri", "Tahu kelebihan dan keterbatasan diri dengan jujur", "analyst", "Honestly aware of your strengths and limits"),
  mk("sensible", "Sensible", "Bijak", "Keputusannya mempertimbangkan banyak sisi", "analyst", "Decisions weigh many sides"),
  mk("sentimental", "Sentimental", "Sentimental", "Menyimpan makna di balik hal-hal kecil", "empath", "Holds meaning in the little things"),
  mk("shy", "Shy", "Pemalu", "Butuh waktu untuk membuka diri ke orang baru", "analyst", "Takes time to open up to new people"),
  mk("silly", "Silly", "Konyol", "Tidak takut terlihat lucu demi mencairkan suasana", "connector", "Not afraid to look goofy to lighten the mood"),
  mk("spontaneous", "Spontaneous", "Spontan", "Bergerak dari intuisi dan momen", "creator", "Moves from intuition and the moment"),
  mk("sympathetic", "Sympathetic", "Empatik", "Bisa merasakan apa yang orang lain rasakan", "empath", "Can feel what others are feeling"),
  mk("tense", "Tense", "Tegang", "Membawa keseriusan ke situasi yang kamu anggap penting", "executor", "Brings seriousness to what matters to you"),
  mk("trustworthy", "Trustworthy", "Amanah", "Dipercaya untuk memegang hal yang penting", "executor", "Trusted to hold what matters"),
  mk("warm", "Warm", "Hangat", "Kehadiranmu membuat orang merasa aman", "connector", "Your presence makes people feel safe"),
  mk("wise", "Wise", "Bijaksana", "Pengalamanmu terasa dalam caramu merespons", "leader", "Your experience shows in how you respond"),
  mk("witty", "Witty", "Jenaka", "Humormu natural dan membuat orang betah", "connector", "Your humor is natural and puts people at ease"),
];

export const findAdjective = (id: string) => ADJECTIVES.find((a) => a.id === id);