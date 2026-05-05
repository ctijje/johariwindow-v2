import { Link } from "react-router-dom";
import { ArrowRight, Users, BarChart3, Network, MessageCircle } from "lucide-react";
import { useLang } from "@/lib/lang";
import Footer from "@/components/Footer";

const TeamLanding = () => {
  const { lang } = useLang();
  const t = lang === "id" ? {
    kicker: "UNTUK TIM",
    h1: "Pahami timmu sebagai sebuah sistem.",
    lead: "Buat tim, undang anggota, dan lihat distribusi kekuatan, gap, serta titik buta kolektif — bahan diskusi untuk offsite, retro, atau workshop.",
    cta1: "Daftar sebagai Team Lead", cta2: "Masuk",
    features: [
      { icon: Users, t: "Kelola tim", d: "Satu dashboard untuk semua anggota tim dan status pengisian mereka." },
      { icon: BarChart3, t: "Aggregate insight", d: "Lihat arketipe dominan tim, persebaran, dan area yang masih kurang." },
      { icon: Network, t: "Drill-down per anggota", d: "Buka profil individu kapan saja untuk konteks 1-on-1." },
      { icon: MessageCircle, t: "Workshop mode", d: "Tampilan presentasi untuk dibagikan layar saat sesi tim." },
    ],
  } : {
    kicker: "FOR TEAMS",
    h1: "Understand your team as a system.",
    lead: "Create a team, invite members, and see the distribution of strengths, gaps, and collective blind spots — material for offsites, retros, or workshops.",
    cta1: "Sign up as Team Lead", cta2: "Sign in",
    features: [
      { icon: Users, t: "Manage your team", d: "One dashboard for all members and their completion status." },
      { icon: BarChart3, t: "Aggregate insight", d: "See the team's dominant archetypes, spread, and underrepresented areas." },
      { icon: Network, t: "Drill into each member", d: "Open individual profiles anytime for 1-on-1 context." },
      { icon: MessageCircle, t: "Workshop mode", d: "Presentation view for live team sessions." },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-20 md:py-28">
        <Link to="/" className="font-mono text-xs text-muted-foreground hover:text-foreground">← Johari Window</Link>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 font-mono text-[11px] tracking-widest text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {t.kicker}
        </div>
        <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-[1.05] md:text-6xl">{t.h1}</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{t.lead}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/auth" className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 font-medium text-primary-foreground shadow-brand">
            {t.cta1} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/auth" className="rounded-full border border-border px-7 py-3.5 text-sm hover:border-foreground">{t.cta2}</Link>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-2">
          {t.features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="rounded-3xl border border-border/70 bg-card p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 font-serif text-2xl">{f.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.d}</p>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TeamLanding;