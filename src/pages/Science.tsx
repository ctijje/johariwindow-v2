import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const Kicker = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 font-mono text-[11px] font-medium tracking-widest text-primary">
    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
    {children}
  </div>
);

const stats = [
  {
    big: "95%",
    label: "Orang percaya mereka self-aware",
    src: "Dr. Tasha Eurich, 2018 — 5.000+ responden",
  },
  {
    big: "10–15%",
    label: "Yang benar-benar self-aware (verifikasi eksternal)",
    src: "Eurich, Insight: The Surprising Truth About How Others See Us, HBR 2018",
  },
  {
    big: "r=0.92",
    label: "Korelasi Open Area dengan performa eksekutif",
    src: "Dash, University of Delhi, 169 eksekutif, p<0.01",
  },
  {
    big: "420",
    label: "Partisipan, 14 negara bagian India (studi 2023)",
    src: "IP Intl Journal of Forensic Medicine and Toxicological Sciences",
  },
];

const gaps = [
  { label: "Percaya diri self-aware", value: 95, color: "hsl(var(--primary))" },
  { label: "Benar-benar self-aware", value: 12, color: "hsl(var(--primary-glow))" },
  { label: "Senior leaders kurang self-aware", value: 70, color: "hsl(0 70% 55%)" },
  { label: "Peningkatan well-being setelah Open Area meluas", value: 60, color: "hsl(22 90% 60%)", note: "Signifikan" },
];

const quadrants = [
  {
    title: "Open Arena",
    desc: "Diketahui diri sendiri dan orang lain. Area produktivitas tertinggi.",
    cite: "Dash (2020): r=0.92 antara luas Open Area dengan performa manajer (n=169, p<0.01). Makin besar Open Area, makin tinggi performa.",
  },
  {
    title: "Blind Spot",
    desc: "Orang lain tahu, kamu tidak. Sumber feedback gap terbesar.",
    cite: "Eurich (2018): 80% eksekutif merasa lebih sadar diri setelah dikonfrontasi soal blind spot mereka.",
  },
  {
    title: "Hidden / Facade",
    desc: "Kamu tahu, orang lain tidak. Area kepercayaan dan disclosure.",
    cite: "Sutton & Chaudry (2018): emotional self-disclosure yang sengaja memperkecil Facade dan memperdalam relasi.",
  },
  {
    title: "Unknown",
    desc: "Tidak diketahui siapa pun. Potensi tersembunyi dan trauma laten.",
    cite: "Luft & Ingham (1955): area ini berisi laten capabilities, early-childhood memories, dan unknown resources — diakses via group experience & mutual disclosure.",
  },
];

const timeline = [
  { year: "1955", text: "Luft & Ingham mengembangkan model Johari di University of California, lahir dari group dynamics." },
  { year: "1969", text: "Luft memperluas model dalam Of Human Interaction — formalisasi konsep disclosure dan feedback loop." },
  { year: "1982", text: "Newstrom & Rubenfeld memvalidasi Johari Window sebagai alat pedagogis interpersonal relations untuk mahasiswa manajemen." },
  { year: "2006", text: "Chapman menerbitkan dokumentasi komprehensif Johari sebagai disclosure/feedback model of self-awareness — digunakan luas di organisasi." },
  { year: "2018", text: "Dr. Tasha Eurich merilis Insight — meta-research dari 1.000+ studi tentang self-awareness. Menemukan 'the 95% vs 10–15% paradox'." },
  { year: "2019", text: "Osmanoglu membuktikan: group work berbasis Johari secara signifikan memperluas Open Area dan meningkatkan positive relationships with others pada mahasiswa." },
  { year: "2020", text: "Dash (Universitas Delhi) menemukan korelasi r=0.92 antara Open Area dan performa eksekutif Delhi/NCR. Perempuan menunjukkan Open Area lebih luas (M=968) vs laki-laki (M=890)." },
  { year: "2023", text: "Mukherjee et al. menganalisis 420 partisipan dari 14 negara bagian India — personality traits lebih dominan dari gender dalam membentuk kuadran Johari." },
];

const expandTips = [
  { t: "Minta feedback secara aktif — bukan sekali, tapi rutin.", d: "Eurich: 8–12 stakeholder per bulan, 2 pertanyaan spesifik. Ini yang disebut 'loving critics' — orang yang peduli dan berani jujur." },
  { t: "Ganti 'why' dengan 'what' — pertanyaan yang lebih produktif.", d: "Studi Eurich: introspeksi berbasis 'mengapa' justru meningkatkan stres, kecemasan, dan depresi. 'What can I do differently?' jauh lebih efektif." },
  { t: "Self-disclosure yang disengaja memperkecil Facade.", d: "Spencer & Wheeless: jurnal self-disclosure secara signifikan memengaruhi perkembangan hubungan — kedalaman, kejujuran, dan keterbukaan relasi." },
  { t: "Group experience membuka Unknown Area.", d: "Luft & Ingham: area Unknown bisa dikurangi via 'mutual enlightenment' — group discussions dan shared experiences yang menggeser informasi ke Open Area." },
  { t: "Eksekutif dengan power lebih tinggi cenderung makin tidak self-aware.", d: "Eurich: 'The higher up in the organization you get, the less self-aware you tend to be on average' — karena feedback jujur menjadi semakin langka di level atas." },
];

const refs = [
  { t: "Luft, J. & Ingham, H. (1955). The Johari Window. UCLA Western Training Lab.", url: "https://en.wikipedia.org/wiki/Johari_window" },
  { t: "Eurich, T. (2018). Insight: The Surprising Truth About How Others See Us — Meta-research 1.000+ studi self-awareness.", url: "https://hbr.org/2018/01/what-self-awareness-really-is-and-how-to-cultivate-it" },
  { t: "Dash, C.S. (2020). Johari Window & Self-Awareness: Delhi/NCR Executive Case Study. Studies in Indian Place Names, UGC Care Journal.", url: "https://archives.tpnsindia.org/index.php/sipn/article/view/4710" },
  { t: "Mukherjee et al. (2023). Johari Window traits and gender differences in Indian workplace. IP Intl Journal of Forensic Medicine and Toxicological Sciences. 8(3):100–107.", url: "https://www.ijfmts.com/" },
  { t: "Osmanoglu, D.E. (2019). Expansion of the Open Area (Johari Window) and Group Work. Post-test controlled study, university students.", url: "https://eric.ed.gov/?q=johari+window" },
  { t: "Chapman, A. (2003). Johari Window Model: A Model for Self-awareness, Personal Development and Communication. University of Wisconsin.", url: "https://www.businessballs.com/self-awareness/johari-window-model-and-free-diagrams/" },
  { t: "Positive Psychology (2023). Benefits of Using the Johari Window.", url: "https://positivepsychology.com/johari-window/" },
  { t: "Communication Theory. The Johari Window Model.", url: "https://www.communicationtheory.org/the-johari-window-model/" },
  { t: "The Decision Lab. Johari Window reference guide.", url: "https://thedecisionlab.com/reference-guide/psychology/the-johari-window" },
];

const chartData = [
  { name: "Perempuan (n=72)", score: 968, fill: "hsl(var(--primary))" },
  { name: "Laki-laki (n=70)", score: 890, fill: "hsl(var(--primary-glow))" },
  { name: "Maksimum teoretis", score: 1296, fill: "hsl(var(--muted-foreground) / 0.4)" },
];

const Logo = () => (
  <Link to="/" className="flex items-center gap-3">
    <div className="relative h-10 w-10">
      <div className="absolute left-0 top-0 h-4 w-4 rounded-[5px] bg-gradient-brand" />
      <div className="absolute right-0 top-0 h-4 w-4 rounded-[5px] border-2 border-primary/70" />
      <div className="absolute bottom-0 left-0 h-4 w-4 rounded-[5px] border-2 border-primary-glow" />
      <div className="absolute bottom-0 right-0 h-4 w-4 rounded-[5px] bg-primary-glow/40" />
    </div>
    <span className="font-serif text-xl">Johari Window</span>
  </Link>
);

const Science = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <Logo />
          <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition hover:text-primary">
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-radial">
        <div className="container mx-auto py-20">
          <Kicker>EVIDENCE-BASED</Kicker>
          <h1 className="mt-6 max-w-3xl text-5xl leading-tight md:text-6xl">
            Sains di balik <span className="text-gradient-brand">Johari Window</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Riset empiris, angka, dan studi yang menjelaskan kenapa model ini bukan sekadar teori — melainkan
            salah satu framework psikologi yang paling relevan untuk dunia kerja modern.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto py-20">
        <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Angka yang perlu kamu tahu</div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.big} className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
              <div className="font-serif text-5xl text-gradient-brand">{s.big}</div>
              <div className="mt-3 text-sm font-medium">{s.label}</div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.src}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Gap bars */}
      <section className="container mx-auto pb-20">
        <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Gap antara persepsi diri & realita</div>
        <div className="mt-6 space-y-5 rounded-2xl border border-border/70 bg-card p-8 shadow-soft">
          {gaps.map((g) => (
            <div key={g.label}>
              <div className="mb-2 flex items-baseline justify-between gap-4">
                <div className="text-sm font-medium">{g.label}</div>
                <div className="font-mono text-xs text-muted-foreground">{g.note ?? `${g.value}%`}</div>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full transition-all" style={{ width: `${g.value}%`, background: g.color }} />
              </div>
            </div>
          ))}
          <p className="pt-2 font-mono text-[11px] text-muted-foreground">Sumber: Eurich (2018), Osmanoglu (2019), Dash (2020).</p>
        </div>
      </section>

      {/* 4 Quadrants */}
      <section className="container mx-auto pb-20">
        <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">4 Kuadran — apa yang riset temukan</div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {quadrants.map((q, i) => (
            <div key={q.title} className="rounded-2xl border border-border/70 bg-card p-7 shadow-soft">
              <div className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-primary" : i === 1 ? "bg-primary-glow" : i === 2 ? "bg-secondary-foreground" : "bg-muted-foreground"}`} />
                <h3 className="font-serif text-2xl">{q.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{q.desc}</p>
              <div className="mt-4 rounded-lg bg-accent/60 p-4 font-mono text-[12px] leading-relaxed text-secondary-foreground">{q.cite}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="container mx-auto pb-20">
        <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Timeline riset utama</div>
        <div className="mt-8 space-y-6 border-l-2 border-border/70 pl-8">
          {timeline.map((t) => (
            <div key={t.year} className="relative">
              <div className="absolute -left-[37px] top-1 h-3.5 w-3.5 rounded-full bg-gradient-brand ring-4 ring-background" />
              <div className="font-mono text-xs font-medium text-primary">{t.year}</div>
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-foreground/90">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Expand Open Arena tips */}
      <section className="container mx-auto pb-20">
        <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Apa kata sains tentang cara memperluas Open Arena</div>
        <div className="mt-6 grid gap-4">
          {expandTips.map((tip, i) => (
            <div key={tip.t} className="flex gap-5 rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gradient-brand font-mono text-sm font-semibold text-primary-foreground">
                {i + 1}
              </div>
              <div>
                <div className="font-medium">{tip.t}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tip.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chart */}
      <section className="container mx-auto pb-20">
        <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Perbandingan Open Arena per gender (Studi Delhi 2020)</div>
        <div className="mt-6 rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 16 }}>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {chartData.map((d, i) => (
                    <Cell key={i} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 font-mono text-[11px] text-muted-foreground">
            Dash (2020), n=169 eksekutif Delhi/NCR, t&gt;7.89, p&lt;0.01. Skor Open Area maksimum teoretis = 1296.
          </p>
        </div>
      </section>

      {/* References */}
      <section className="container mx-auto pb-24">
        <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">References & sumber</div>
        <ul className="mt-6 space-y-3">
          {refs.map((r) => (
            <li key={r.t} className="rounded-xl border border-border/70 bg-card p-4 shadow-soft">
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-start gap-2 text-sm leading-relaxed transition hover:text-primary"
              >
                <span>{r.t}</span>
                <ExternalLink className="mt-0.5 h-3.5 w-3.5 flex-none opacity-60 transition group-hover:opacity-100" />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 font-mono text-[11px] text-muted-foreground">
          Riset dikumpulkan via Copilot + Perplexity Search. Klik referensi untuk membuka sumber asli.
        </p>
      </section>

      {/* CTA */}
      <section className="bg-gradient-brand">
        <div className="container mx-auto flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl text-primary-foreground md:text-4xl">Sudah cukup teorinya. Coba sendiri.</h2>
            <p className="mt-2 text-primary-foreground/90">Pilih kata yang menggambarkanmu dan buka jendelamu, satu per satu.</p>
          </div>
          <Link to="/test" className="rounded-full bg-background px-7 py-4 font-medium text-primary transition hover:scale-[1.02]">
            Buka jendelaku
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Science;