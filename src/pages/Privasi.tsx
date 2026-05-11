import { useLang } from "@/lib/lang";
import Footer from "@/components/Footer";

const COPY = {
  id: {
    title: "Kebijakan Privasi",
    updated: "Terakhir diperbarui: 11 Mei 2026",
    intro:
      'Kami di Johari Window ("kami", "platform") berkomitmen untuk melindungi data dan privasi Anda. Halaman ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.',
    sections: [
      {
        h: "1. Data yang Kami Kumpulkan",
        items: [
          "**Data akun:** nama, alamat email, dan kata sandi (terenkripsi)",
          "**Data penilaian:** kata sifat yang Anda pilih dan feedback dari peer/rekan Anda",
          "**Data penggunaan:** halaman yang dikunjungi, fitur yang digunakan, waktu sesi",
        ],
      },
      {
        h: "2. Bagaimana Kami Menggunakan Data",
        items: [
          "Untuk menampilkan hasil penilaian Johari Window Anda",
          "Untuk mengirimkan notifikasi terkait akun dan sesi Anda",
          "Untuk meningkatkan layanan platform secara keseluruhan",
        ],
      },
      {
        h: "3. Keamanan Data",
        p: "Semua data disimpan dengan enkripsi standar industri. Kami tidak menjual atau membagikan data pribadi Anda kepada pihak ketiga.",
      },
      {
        h: "4. Hak Anda",
        p: "Anda dapat meminta penghapusan akun dan seluruh data Anda kapan saja dengan menghubungi kami di hi@johariwindow.id",
      },
      {
        h: "5. Perubahan Kebijakan",
        p: "Jika ada perubahan material, kami akan memberitahukan melalui email atau notifikasi di platform.",
      },
      { h: "6. Hubungi Kami", p: "Email: hi@johariwindow.id" },
    ],
  },
  en: {
    title: "Privacy Policy",
    updated: "Last updated: May 11, 2026",
    intro:
      'At Johari Window ("we", "the platform") we are committed to protecting your data and privacy. This page explains how we collect, use, and protect your information.',
    sections: [
      {
        h: "1. Data We Collect",
        items: [
          "**Account data:** name, email address, and password (encrypted)",
          "**Assessment data:** the adjectives you select and feedback from your peers",
          "**Usage data:** pages visited, features used, session time",
        ],
      },
      {
        h: "2. How We Use Your Data",
        items: [
          "To display your Johari Window assessment results",
          "To send notifications related to your account and sessions",
          "To improve the overall platform experience",
        ],
      },
      {
        h: "3. Data Security",
        p: "All data is stored using industry-standard encryption. We do not sell or share your personal data with third parties.",
      },
      {
        h: "4. Your Rights",
        p: "You may request deletion of your account and all your data at any time by contacting us at hi@johariwindow.id",
      },
      {
        h: "5. Policy Changes",
        p: "If there are material changes, we will notify you by email or via a notification on the platform.",
      },
      { h: "6. Contact Us", p: "Email: hi@johariwindow.id" },
    ],
  },
} as const;

const renderInline = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
};

const Privasi = () => {
  const { lang } = useLang();
  const c = COPY[lang];
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-3xl px-4 py-20">
        <h1 className="text-4xl font-bold tracking-tight">{c.title}</h1>
        <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">{c.updated}</p>
        <p className="mt-8 leading-relaxed text-muted-foreground">{c.intro}</p>
        <div className="mt-10 space-y-8">
          {c.sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-xl font-semibold">{s.h}</h2>
              {"p" in s && s.p ? (
                <p className="mt-3 leading-relaxed text-muted-foreground">{s.p}</p>
              ) : null}
              {"items" in s && s.items ? (
                <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
                  {s.items.map((it) => (
                    <li key={it} className="leading-relaxed">{renderInline(it)}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privasi;