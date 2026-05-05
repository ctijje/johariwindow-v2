import { useState } from "react";
import { ArrowRight, Lock, Users, Clock, LayoutGrid, Plus, Minus, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import johariDoodle from "@/assets/johari-window-doodle.png";
import { Link } from "react-router-dom";
import { useLang } from "@/lib/lang";

type Lang = "id" | "en";

const t = {
  id: {
    nav: { how: "Cara Kerja", why: "Kenapa Johari", coach: "Untuk Coach", pricing: "Harga", signin: "Masuk", cta: "Mulai Gratis" },
    hero: {
      h1: "Johari Window",
      h2: "Temukan bagaimana kamu melihat diri kamu, dan bagaimana orang lain melihat kamu melalui pendekatan Johari Window.",
      h3: "Ada versi dirimu yang orang lain lihat, tapi kamu belum tentu sadar. Johari Window membantumu menemukan keduanya.",
      ctaPrimary: "Coba Sekarang",
    },
    how: {
      kicker: "CARA KERJA",
      title: ["Tiga langkah.", "Satu per satu jendela terbuka."],
      lead: "Johari Window memakai metafora jendela untuk menggambarkan dirimu dari dua sudut: apa yang kamu tahu tentang dirimu sendiri, dan apa yang orang lain lihat. Empat panel jendelanya terbuka satu per satu seiring prosesnya berjalan.",
      demo: "Coba demo sekarang",
      steps: [
        { n: "01", title: "Pilih kata yang mencerminkan dirimu", desc: "Pilih 5 sampai 20 kata dari daftar 56 kata sifat yang paling menggambarkan dirimu. Tanpa overthinking.", tag: "~2 menit" },
        { n: "02", title: "Dapatkan feedback dari orang terdekat", desc: "Kirim link privat ke teman, pasangan, atau rekan tim yang mengenal kamu. Mereka pilih kata yang menggambarkan kamu, dari sudut pandang mereka.", tag: "sebanyak yang kamu mau" },
        { n: "03", title: "Buka jendelamu", desc: "Lihat empat panel dirimu terisi: hal yang diketahui bersama (open), titik buta (blind), sisi tersembunyi (hidden), dan ruang untuk tumbuh (unknown).", tag: "hasil real-time" },
      ],
    },
    why: {
      kicker: "KENAPA JOHARI",
      title: ["Mengapa", "Johari Window?"],
      lead: "Framework yang sudah terbukti untuk mengenal diri dan berkomunikasi lebih baik. Bandingkan cara kamu melihat dirimu sendiri dengan cara orang lain melihatmu, dan temukan kekuatan tersembunyi serta titik butamu.",
      cta: "Buka jendelamu",
      cards: [
        { icon: LayoutGrid, title: "Berbasis Psikologi", desc: "Bukan sekadar kuis kepribadian biasa. Johari Window adalah framework yang dikembangkan oleh psikolog Joseph Luft dan Harry Ingham dan sudah digunakan selama puluhan tahun di dunia pendidikan, coaching, dan pengembangan tim." },
        { icon: Users, title: "Dua Perspektif Sekaligus", desc: "Kamu tidak hanya menilai diri sendiri. Kamu juga mendapat gambaran nyata tentang bagaimana orang-orang yang mengenalmu melihatmu, dan di situlah insight yang paling berharga muncul." },
        { icon: Lock, title: "Temukan yang Belum Pernah Kamu Sadari", desc: "Ada kekuatan yang orang lain lihat dari kamu, tapi kamu sendiri belum menyadarinya. Ada juga sisi diri yang belum sempat kamu tunjukkan. Johari Window membantumu melihat keduanya." },
        { icon: Clock, title: "Langkah Nyata, Bukan Sekadar Label", desc: "Hasilnya bukan hanya kategori atau tipe kepribadian. Kamu mendapat peta yang jelas tentang mana yang perlu dikembangkan, mana yang perlu dibuka, dan mana yang masih bisa dieksplorasi lebih jauh." },
      ],
    },
    voices: {
      kicker: "SUARA DARI DALAM JENDELA",
      title: ["Momen nyata,", "pergeseran nyata."],
      items: [
        { pane: "PANEL TERBUKA", quote: "Sepuluh tahun aku menyebut diri 'gelisah'. Teman-temanku justru memilih 'penuh perhatian' dan 'mendalam'. Data sama, jendela beda.", who: "Priya · desainer" },
        { pane: "PANEL BUTA", quote: "Pakai Johari di offsite Q1. Ternyata seluruh tim engineering pikir PM kami lucu banget. Tidak ada yang pernah kasih tahu dia.", who: "Marcus · founder" },
        { pane: "PANEL TERSEMBUNYI", quote: "Pasanganku melihat 'lembut' dalam diriku. Selama ini aku cuma pernah pilih 'praktis'. Kami ngobrol tiga jam malam itu.", who: "Sam · psikoterapis" },
        { pane: "PANEL TERBUKA", quote: "Saya pakai Johari dengan klien terapi sebagai pengganti kuesioner kepribadian biasa. Percakapannya jauh lebih kaya.", who: "Dr. Yuki Tanaka" },
      ],
    },
    faq: {
      kicker: "FAQ",
      title: ["Enam hal yang", "selalu ditanyakan."],
      lead: "Masih penasaran? Email kami — manusia sungguhan akan balas dalam sehari.",
      items: [
        { q: "Apakah Johari Window framework psikologi yang nyata?", a: "Ya — dikembangkan tahun 1955 oleh psikolog Joseph Luft dan Harrington Ingham (nama 'Johari' adalah gabungan nama depan mereka). Banyak digunakan dalam terapi, pendidikan, pengembangan kepemimpinan, dan coaching tim." },
        { q: "Apakah temanku tahu kata yang aku pilih untuk diriku?", a: "Tidak. Mereka memilih dari daftar yang sama tanpa melihat pilihanmu. Hasilnya baru dibandingkan setelah selesai." },
        { q: "Berapa banyak teman yang sebaiknya diundang?", a: "Minimal 3, idealnya 5–10. Semakin beragam orangnya, semakin kaya jendelamu." },
        { q: "Apakah Johari gratis?", a: "Ya — versi inti gratis selamanya. Fitur grup dan time-lapse opsional di paket Pro." },
        { q: "Bagaimana dengan data saya?", a: "Disimpan terenkripsi. Tidak pernah dijual, dibagikan, atau dipakai melatih AI. Bisa dihapus kapan saja." },
        { q: "Bisa dipakai dengan terapis atau coach saya?", a: "Sangat bisa. Banyak terapis dan coach memakai Johari sebagai bahan dialog yang lebih dalam dengan klien." },
      ],
    },
    final: {
      badge: "GRATIS · 2 MENIT · TANPA DAFTAR",
      h: "Siap bertemu",
      hi: "semua versi dirimu?",
      lead: "Pilih lima kata. Kirim linknya. Buka jendelamu. Semua prosesnya lebih cepat dari memilih tontonan malam ini.",
      ctaPrimary: "Buka jendelaku",
      ctaSecondary: "Baca sainsnya",
    },
    footer: {
      tagline: "Talent discovery tool berbasis framework Johari Window.",
      product: "PRODUK",
      resources: "SUMBER",
      company: "PERUSAHAAN",
      links: {
      product: ["Cara Kerja", "Untuk Coach", "Harga"],
        resources: ["Sains di Baliknya", "Blog"],
        company: ["Tentang", "Privasi", "Syarat", "Kontak"],
      },
    },
  },
  en: {
    nav: { how: "How it works", why: "Why Johari", coach: "For Coaches", pricing: "Pricing", signin: "Sign in", cta: "Start free" },
    hero: {
      h1: "Johari Window",
      h2: "Discover how you see yourself, and how others see you, through the Johari Window approach.",
      h3: "There's a version of you others see that you may not be aware of. Johari Window helps you find both.",
      ctaPrimary: "Start free",
    },
    how: {
      kicker: "HOW IT WORKS",
      title: ["Three steps.", "One pane at a time."],
      lead: "The Johari Window uses the metaphor of a window to describe you from two angles: what you know about yourself, and what others see. Its four panes open one by one as the process unfolds.",
      demo: "Try a demo window",
      steps: [
        { n: "01", title: "Pick the words that reflect you", desc: "Choose 5 to 20 words from a list of 56 traits that describe you best. No overthinking.", tag: "~2 min" },
        { n: "02", title: "Get feedback from people close to you", desc: "Send a private link to friends, partners, or teammates who know you. They pick the words that describe you, from their perspective.", tag: "as many as you like" },
        { n: "03", title: "Open your window", desc: "See your four panes fill in: what's commonly known (open), blind spots (blind), hidden sides (hidden), and room to grow (unknown).", tag: "live results" },
      ],
    },
    why: {
      kicker: "WHY JOHARI",
      title: ["Why", "Johari Window?"],
      lead: "A proven framework for self-awareness and better communication. Compare how you see yourself with how others see you, and uncover hidden strengths along with your blind spots.",
      cta: "Open your window",
      cards: [
        { icon: LayoutGrid, title: "Grounded in Psychology", desc: "Not just another personality quiz. The Johari Window is a framework developed by psychologists Joseph Luft and Harry Ingham, used for decades in education, coaching, and team development." },
        { icon: Users, title: "Two Perspectives at Once", desc: "You don't just rate yourself. You also get a real picture of how people who know you see you — and that's where the most valuable insight lives." },
        { icon: Lock, title: "Discover What You Never Noticed", desc: "There are strengths others see in you that you haven't realized yet. There are also sides of you you haven't shown. Johari Window helps you see both." },
        { icon: Clock, title: "Real Next Steps, Not Just Labels", desc: "The result isn't a category or personality type. You get a clear map of what to develop, what to open up, and what's still worth exploring." },
      ],
    },
    voices: {
      kicker: "VOICES FROM INSIDE THE WINDOW",
      title: ["Real moments,", "real shifts."],
      items: [
        { pane: "OPEN PANE", quote: "I'd called myself 'anxious' for ten years. My friends had picked 'thoughtful' and 'deep.' Same data, different window.", who: "Priya · designer" },
        { pane: "BLIND PANE", quote: "Did the team Johari at our Q1 offsite. Found out the whole eng org thinks our PM is hilarious. Nobody had told her.", who: "Marcus · founder" },
        { pane: "HIDDEN PANE", quote: "My partner saw 'tender' in me. I'd only ever picked 'practical.' We talked for three hours that night.", who: "Sam · psychotherapist" },
        { pane: "OPEN PANE", quote: "Used Johari with my therapy clients in place of the usual personality questionnaires. The conversations are richer.", who: "Dr. Yuki Tanaka" },
      ],
    },
    faq: {
      kicker: "FAQ",
      title: ["Six things people", "always ask."],
      lead: "Still curious? Email us — a real human reads everything within a day.",
      items: [
        { q: "Is the Johari Window a real psychology framework?", a: "Yes — it was developed in 1955 by psychologists Joseph Luft and Harrington Ingham (the name 'Johari' is a portmanteau of their first names). It's widely used in therapy, education, leadership development, and team coaching." },
        { q: "Do my friends see what I picked for myself?", a: "No. They pick from the same list without seeing your choices. Results are only compared after." },
        { q: "How many friends should I invite?", a: "At least 3, ideally 5–10. The more diverse the group, the richer your window." },
        { q: "Is Johari free?", a: "Yes — the core experience is free forever. Group windows and time-lapse mode are optional Pro features." },
        { q: "What about my data?", a: "Stored encrypted. Never sold, shared, or used to train AI. You can delete it any time." },
        { q: "Can I do this with my therapist or coach?", a: "Absolutely. Many therapists and coaches use Johari as a richer dialogue tool with clients." },
      ],
    },
    final: {
      badge: "FREE · 2 MINUTES · NO SIGNUP TO START",
      h: "Ready to meet",
      hi: "everyone you already are?",
      lead: "Pick five words. Send the link. Open the window. The whole thing takes less time than picking what to watch tonight.",
      ctaPrimary: "Open my window",
      ctaSecondary: "Read the science",
    },
    footer: {
      tagline: "Talent discovery tool based on the Johari Window framework.",
      product: "PRODUCT",
      resources: "RESOURCES",
      company: "COMPANY",
      links: {
      product: ["How it works", "For coaches", "Pricing"],
        resources: ["The science", "Blog"],
        company: ["About", "Privacy", "Terms", "Contact"],
      },
    },
  },
} as const;

const Logo = () => (
  <div className="flex items-center">
    <div className="relative h-12 w-12">
      <div className="absolute left-0 top-0 h-5 w-5 rounded-[6px] bg-gradient-brand" />
      <div className="absolute right-0 top-0 h-5 w-5 rounded-[6px] border-2 border-primary/70" />
      <div className="absolute bottom-0 left-0 h-5 w-5 rounded-[6px] border-2 border-primary-glow" />
      <div className="absolute bottom-0 right-0 h-5 w-5 rounded-[6px] bg-primary-glow/40" />
    </div>
  </div>
);

const Kicker = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 font-mono text-[11px] font-medium tracking-widest text-primary">
    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
    {children}
  </div>
);

const Index = () => {
  const { lang, toggle } = useLang();
  const [open, setOpen] = useState<number | null>(0);
  const [activePane, setActivePane] = useState<number>(0);
  const c = t[lang];

  const panes = [
    {
      id: { label: "Open", desc: "Yang kamu dan orang lain sama-sama lihat." },
      en: { label: "Open", desc: "What you and others both see." },
    },
    {
      id: { label: "Blind", desc: "Yang orang lain lihat, tapi kamu belum sadar." },
      en: { label: "Blind", desc: "What others see, but you don't." },
    },
    {
      id: { label: "Hidden", desc: "Yang kamu tahu, tapi belum kamu tunjukkan." },
      en: { label: "Hidden", desc: "What you know, but haven't shown." },
    },
    {
      id: { label: "Unknown", desc: "Yang belum diketahui siapa pun — ruang untuk tumbuh." },
      en: { label: "Unknown", desc: "What no one knows yet — room to grow." },
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-20 items-center justify-between">
          <Logo />
          <nav className="hidden items-center gap-10 md:flex">
            <a href="#how" className="text-sm text-foreground/70 transition hover:text-foreground">{c.nav.how}</a>
            <a href="#why" className="text-sm text-foreground/70 transition hover:text-foreground">{c.nav.why}</a>
            <Link to="/coach" className="text-sm text-foreground/70 transition hover:text-foreground">{c.nav.coach}</Link>
            <Link to="/pricing" className="text-sm text-foreground/70 transition hover:text-foreground">{c.nav.pricing}</Link>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 font-mono text-xs uppercase transition hover:border-primary hover:text-primary"
            >
              <Globe className="h-3.5 w-3.5" />
              {lang === "id" ? "ID" : "EN"}
            </button>
            <Link to="/auth" className="hidden rounded-full border border-border px-5 py-2.5 text-sm transition hover:border-foreground sm:block">
              {c.nav.signin}
            </Link>
            <Link to="/test" className="group inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-brand transition hover:scale-[1.02]">
              {c.nav.cta}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial" />
        <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-gradient-brand opacity-20 blur-[120px]" />
        <div className="container relative mx-auto py-24 md:py-32">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <h1 className="font-serif text-6xl leading-[0.95] tracking-tight md:text-8xl">
                {c.hero.h1.split(" ")[0]}{" "}
                <em className="text-gradient-brand not-italic">{c.hero.h1.split(" ")[1]}</em>
              </h1>
              <h2 className="mt-8 max-w-2xl font-serif text-2xl leading-snug text-foreground/85 md:text-3xl">
                {c.hero.h2}
              </h2>
              <h3 className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {c.hero.h3}
              </h3>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link to="/test" className="group inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-4 font-medium text-primary-foreground shadow-brand transition hover:scale-[1.02]">
                  {c.hero.ctaPrimary}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Window visual */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto aspect-square max-w-md rounded-3xl bg-background p-6 shadow-soft">
                <div className="grid h-full grid-cols-2 grid-rows-2 gap-3">
                  {panes.map((p, i) => {
                    const isActive = activePane === i;
                    const pane = p[lang];
                    return (
                      <button
                        key={i}
                        onMouseEnter={() => setActivePane(i)}
                        onFocus={() => setActivePane(i)}
                        onClick={() => setActivePane(i)}
                        className={cn(
                          "group relative flex flex-col justify-between rounded-2xl border-2 p-5 text-left transition-colors duration-300",
                          isActive
                            ? "bg-gradient-brand border-transparent text-primary-foreground shadow-brand"
                            : "border-border bg-background text-foreground hover:border-primary/40",
                        )}
                      >
                        <span className={cn("font-mono text-[10px] uppercase tracking-widest", isActive ? "opacity-90" : "text-muted-foreground")}>0{i + 1}</span>
                        <div>
                          <div className="font-serif text-2xl">{pane.label}</div>
                          <div className={cn("mt-1 text-[11px] leading-snug", isActive ? "opacity-95" : "text-muted-foreground")}>
                            {pane.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="absolute -bottom-4 -right-4 rounded-full bg-background px-4 py-2 font-mono text-[10px] uppercase tracking-widest shadow-soft">
                  {panes[activePane][lang].label} · 0{activePane + 1}/04
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="container mx-auto py-24 md:py-32">
        <Kicker>{c.how.kicker}</Kicker>
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 className="font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl">
              {c.how.title[0]} <em className="text-gradient-brand not-italic">{c.how.title[1]}</em>
            </h2>
            <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">{c.how.lead}</p>
          </div>
          <div className="flex items-start justify-end lg:col-span-4">
            <Link to="/test" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm transition hover:border-foreground">
              {lang === "id" ? "Coba Sekarang" : c.how.demo} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {c.how.steps.map((step, i) => (
            <div
              key={i}
              className={cn(
                "rounded-3xl border border-border/70 p-8 transition hover:-translate-y-1 hover:shadow-soft",
                i === 1 ? "bg-gradient-brand-soft" : "bg-card",
              )}
            >
              <div className="font-mono text-[11px] font-medium tracking-widest text-primary">STEP {step.n}</div>
              <div className="my-12 flex h-32 items-center justify-center">
                {i === 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 max-w-[220px]">
                    {["curious", "✓", "warm", "quiet", "✓", "bold", "witty"].map((w, k) => (
                      <span key={k} className={cn(
                        "rounded-full border px-3 py-1 text-xs",
                        w === "✓" ? "border-transparent bg-gradient-brand text-primary-foreground h-6 w-6 flex items-center justify-center p-0" : "border-border bg-background"
                      )}>{w}</span>
                    ))}
                  </div>
                )}
                {i === 1 && (
                  <div className="flex items-center -space-x-2">
                    {[
                      { l: "A", bg: "bg-[hsl(0_100%_55%)]" },
                      { l: "M", bg: "bg-[hsl(22_100%_65%)]" },
                      { l: "+", bg: "bg-foreground text-background" },
                      { l: "K", bg: "bg-primary" },
                    ].map((a, k) => (
                      <div key={k} className={cn("flex h-12 w-12 items-center justify-center rounded-full font-medium text-primary-foreground ring-2 ring-background", a.bg)}>
                        {a.l}
                      </div>
                    ))}
                  </div>
                )}
                {i === 2 && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex h-14 w-20 items-center justify-center rounded-xl bg-gradient-brand font-serif text-primary-foreground">Open</div>
                    <div className="flex h-14 w-20 items-center justify-center rounded-xl border-2 border-primary font-serif text-primary">Blind</div>
                    <div className="flex h-14 w-20 items-center justify-center rounded-xl border-2 border-primary-glow font-serif text-primary-glow">Hidden</div>
                    <div className="flex h-14 w-20 items-center justify-center rounded-xl bg-accent font-serif text-primary/60">?</div>
                  </div>
                )}
              </div>
              <h3 className="font-serif text-2xl">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              <div className="mt-6 inline-block rounded-full bg-accent px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
                {step.tag}
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* Why Johari */}
      <section id="why" className="bg-muted/30 py-24 md:py-32">
        <div className="container mx-auto grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Kicker>{c.why.kicker}</Kicker>
            <h2 className="mt-8 font-serif text-5xl leading-[1.05] md:text-6xl">
              {c.why.title[0]}<br />
              <em className="text-gradient-brand not-italic">{c.why.title[1]}</em>
            </h2>
            <p className="mt-6 text-muted-foreground">{c.why.lead}</p>
            <Link to="/test" className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3.5 font-medium text-primary-foreground shadow-brand transition hover:scale-[1.02]">
              {c.why.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
            {c.why.cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="rounded-3xl border border-border/70 bg-card p-7 transition hover:border-primary/40 hover:shadow-soft">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-7 font-serif text-2xl">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Voices */}
      <section id="voices" className="bg-gradient-brand-soft py-24 md:py-32">
        <div className="container mx-auto">
          <Kicker>{c.voices.kicker}</Kicker>
          <h2 className="mt-8 font-serif text-5xl leading-[1.05] md:text-6xl">
            {c.voices.title[0]} <em className="text-gradient-brand not-italic">{c.voices.title[1]}</em>
          </h2>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {c.voices.items.map((v, i) => (
              <div key={i} className="rounded-3xl border border-border/70 bg-background/80 p-8 backdrop-blur">
                <div className="inline-block rounded-full bg-accent px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
                  {v.pane}
                </div>
                <p className="mt-6 font-serif text-2xl leading-snug text-foreground/90">"{v.quote}"</p>
                <p className="mt-6 font-mono text-xs text-muted-foreground">— {v.who}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container mx-auto py-24 md:py-32">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Kicker>{c.faq.kicker}</Kicker>
            <h2 className="mt-8 font-serif text-5xl leading-[1.05] md:text-6xl">
              {c.faq.title[0]}<br />
              <em className="text-gradient-brand not-italic">{c.faq.title[1]}</em>
            </h2>
            <p className="mt-6 text-muted-foreground">{c.faq.lead}</p>
          </div>
          <div className="lg:col-span-8">
            <div className="divide-y divide-border/70 border-y border-border/70">
              {c.faq.items.map((item, i) => (
                <div key={i} className="py-2">
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="font-serif text-xl md:text-2xl">{item.q}</span>
                    <span className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition",
                      open === i ? "bg-gradient-brand text-primary-foreground" : "bg-accent text-primary"
                    )}>
                      {open === i ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  {open === i && (
                    <p className="pb-6 pr-12 text-base leading-relaxed text-muted-foreground">{item.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto pb-24 md:pb-32">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-brand p-12 md:p-20">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 font-mono text-[11px] tracking-widest text-primary-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              {c.final.badge}
            </div>
            <h2 className="mt-8 font-serif text-5xl leading-[1.05] text-primary-foreground md:text-7xl">
              {c.final.h}<br />
              <em className="not-italic opacity-90">{c.final.hi}</em>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/90">
              {c.final.lead}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/test" className="group inline-flex items-center gap-2 rounded-full bg-background px-7 py-4 font-medium text-primary transition hover:scale-[1.02]">
                {c.final.ctaPrimary}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <button className="rounded-full border border-primary-foreground/40 px-7 py-4 font-medium text-primary-foreground transition hover:bg-primary-foreground/10">
                {c.final.ctaSecondary}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/70">
        <div className="container mx-auto py-16">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <Logo />
              <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">{c.footer.tagline}</p>
            </div>
            {([
              ["product", c.footer.links.product],
              ["resources", c.footer.links.resources],
              ["company", c.footer.links.company],
            ] as const).map(([key, links], idx) => (
              <div key={key} className={cn("md:col-span-2", idx === 0 && "md:col-start-7")}>
                <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {c.footer[key as "product" | "resources" | "company"]}
                </div>
                <ul className="mt-5 space-y-3">
                  {links.map((l) => (
                    <li key={l}><a href="#" className="text-sm transition hover:text-primary">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border/70 pt-8 md:flex-row md:items-center">
          <p className="font-mono text-xs text-muted-foreground">© 2026 Johari Window · A RANCA.id Product</p>
            <p className="font-mono text-xs text-muted-foreground">johariwindow.id</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
