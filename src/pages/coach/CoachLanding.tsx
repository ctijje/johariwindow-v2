import { Link } from "react-router-dom";
import { ArrowRight, Users, Eye, Presentation, Sparkles } from "lucide-react";
import { useLang } from "@/lib/lang";
import Footer from "@/components/Footer";

const CoachLanding = () => {
  const { lang } = useLang();
  const t = lang === "id" ? {
    kicker: "UNTUK COACH",
    h1: "Sesi coaching yang lebih dalam, dengan data peer-nya.",
    lead: "Tambah mentee, undang lingkaran mereka untuk memberi feedback, lalu pandu sesi go-through bersama berbasis Johari Window.",
    cta1: "Daftar sebagai Coach", cta2: "Masuk",
    features: [
      { icon: Users, t: "Kelola mentee", d: "Satu dashboard untuk semua menteemu — status pengisian, peer feedback, dan catatan sesi." },
      { icon: Eye, t: "Profil bakat lengkap", d: "Lihat 4 panel Johari + Potensi Utama & Pendukung tiap mentee." },
      { icon: Presentation, t: "Mode Go-through", d: "Mode presentasi step-by-step untuk dipakai langsung saat sesi 1-on-1." },
      { icon: Sparkles, t: "Catatan privat", d: "Simpan refleksi sesi yang hanya kamu yang lihat." },
    ],
  } : {
    kicker: "FOR COACHES",
    h1: "Deeper coaching sessions, backed by peer data.",
    lead: "Add mentees, invite their circle to give feedback, then run guided go-through sessions powered by the Johari Window.",
    cta1: "Sign up as Coach", cta2: "Sign in",
    features: [
      { icon: Users, t: "Manage mentees", d: "One dashboard for all your mentees — completion status, peer feedback, session notes." },
      { icon: Eye, t: "Full talent profile", d: "See the 4 Johari panes plus Primary & Supporting Potentials per mentee." },
      { icon: Presentation, t: "Go-through mode", d: "Step-by-step presentation mode designed for live 1-on-1 sessions." },
      { icon: Sparkles, t: "Private notes", d: "Capture session reflections only you can see." },
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

export default CoachLanding;