import { useLang } from "@/lib/lang";
import Footer from "@/components/Footer";

const COPY = {
  id: {
    title: "Syarat & Ketentuan",
    updated: "Terakhir diperbarui: 11 Mei 2026",
    intro:
      'Dengan menggunakan platform Johari Window ("platform"), Anda menyetujui syarat dan ketentuan berikut.',
    sections: [
      { h: "1. Penggunaan Platform", p: "Platform ini dirancang untuk tujuan pengembangan diri dan sesi coaching profesional. Pengguna tidak diperbolehkan menggunakan data orang lain tanpa izin mereka." },
      { h: "2. Akun Pengguna", p: "Anda bertanggung jawab atas keamanan akun Anda. Jangan bagikan kata sandi kepada siapa pun." },
      { h: "3. Pembayaran", p: "Paket Coach Starter dan Coach Growth adalah pembayaran satu kali (one-time payment), bukan berlangganan. Tidak ada biaya rutin setelah pembelian." },
      { h: "4. Kebijakan Pengembalian Dana", p: "Mengingat sifat digital produk ini, kami tidak menyediakan pengembalian dana setelah akses diberikan. Jika Anda mengalami masalah teknis, hubungi kami di hi@johariwindow.id" },
      { h: "5. Hak Kekayaan Intelektual", p: "Seluruh konten platform, termasuk desain, teks, dan framework penilaian, adalah milik Johari Window Indonesia." },
      { h: "6. Perubahan Layanan", p: "Kami berhak mengubah, menambah, atau menghentikan fitur platform kapan saja dengan pemberitahuan yang wajar." },
      { h: "7. Hubungi Kami", p: "Email: admin.johariwindow.id@gmail.com" },
    ],
  },
  en: {
    title: "Terms & Conditions",
    updated: "Last updated: May 11, 2026",
    intro:
      'By using the Johari Window platform ("the platform"), you agree to the following terms and conditions.',
    sections: [
      { h: "1. Use of the Platform", p: "This platform is designed for self-development and professional coaching sessions. Users are not allowed to use other people's data without their permission." },
      { h: "2. User Accounts", p: "You are responsible for the security of your account. Do not share your password with anyone." },
      { h: "3. Payments", p: "The Coach Starter and Coach Growth plans are one-time payments, not subscriptions. There are no recurring fees after purchase." },
      { h: "4. Refund Policy", p: "Given the digital nature of this product, we do not provide refunds once access has been granted. If you experience technical issues, contact us at hi@johariwindow.id" },
      { h: "5. Intellectual Property", p: "All platform content, including design, text, and the assessment framework, is owned by Johari Window Indonesia." },
      { h: "6. Service Changes", p: "We reserve the right to modify, add, or discontinue platform features at any time with reasonable notice." },
      { h: "7. Contact Us", p: "Email: admin.johariwindow.id@gmail.com" },
    ],
  },
} as const;

const Syarat = () => {
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
              <p className="mt-3 leading-relaxed text-muted-foreground">{s.p}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Syarat;