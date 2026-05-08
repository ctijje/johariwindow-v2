import { Link } from "react-router-dom";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { useLang } from "@/lib/lang";
import Footer from "@/components/Footer";

const STARTER_LINK = "https://pro.johariwindow.id/coach-starter";
const GROWTH_LINK = "https://pro.johariwindow.id/coach-growth";
const WHATSAPP_LINK = "https://wa.me/628561230413";

const Pricing = () => {
  const { lang } = useLang();
  const t = lang === "id" ? {
    kicker: "HARGA",
    h1: "Sederhana, transparan, sesuai ukuran tim.",
    lead: "Mulai gratis. Bayar hanya saat kamu butuh lebih banyak anggota.",
    perMo: "/sekali bayar",
    cta: "Pilih paket",
    contact: "Hubungi via WhatsApp",
    backHome: "← Kembali",
    tiers: [
      { name: "Gratis", price: "Rp 0", desc: "Untuk individu. Akses penuh ke Johari Window pribadi.", features: ["1 jendela pribadi", "Undang peer tanpa batas", "Profil bakat & arketipe"], cta: "Mulai gratis", href: "/test", primary: false, highlight: false },
      { name: "Coach Starter", price: "Rp 99.000", desc: "1–49 anggota tim/mentee.", features: ["Hingga 49 mentee/anggota", "Dashboard coach", "Mode go-through 1-on-1", "Catatan sesi privat"], cta: "Pilih paket", href: STARTER_LINK, primary: true, highlight: true },
      { name: "Coach Growth", price: "Rp 199.000", desc: "Mulai dari 50 anggota.", features: ["50+ mentee/anggota", "Semua fitur Starter", "Agregat kekuatan tim"], cta: "Pilih paket", href: GROWTH_LINK, primary: false, highlight: false },
    ],
    enterprise: { name: "Butuh paket khusus?", desc: "Custom paket untuk organisasi besar. Hubungi kami via WhatsApp.", cta: "Hubungi via WhatsApp" },
  } : {
    kicker: "PRICING",
    h1: "Simple, transparent, sized to your team.",
    lead: "Start free. Pay only when you need more members.",
    perMo: "/one-time",
    cta: "Choose plan",
    contact: "Contact via WhatsApp",
    backHome: "← Back",
    tiers: [
      { name: "Free", price: "Rp 0", desc: "For individuals. Full access to your personal Johari Window.", features: ["1 personal window", "Unlimited peer invites", "Talent profile & archetypes"], cta: "Start free", href: "/test", primary: false, highlight: false },
      { name: "Coach Starter", price: "Rp 99,000", desc: "1–49 mentees/members.", features: ["Up to 49 mentees", "Coach dashboard", "1-on-1 go-through mode", "Private session notes"], cta: "Choose plan", href: STARTER_LINK, primary: true, highlight: true },
      { name: "Coach Growth", price: "Rp 199,000", desc: "50+ members.", features: ["50+ mentees", "All Starter features", "Team strengths aggregate"], cta: "Choose plan", href: GROWTH_LINK, primary: false, highlight: false },
    ],
    enterprise: { name: "Need a custom plan?", desc: "Custom plans for larger organizations. Reach us on WhatsApp.", cta: "Contact via WhatsApp" },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-20 md:py-28">
        <Link to="/" className="font-mono text-xs text-muted-foreground hover:text-foreground">{t.backHome}</Link>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 font-mono text-[11px] tracking-widest text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {t.kicker}
        </div>
        <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-[1.05] md:text-6xl">{t.h1}</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{t.lead}</p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {t.tiers.map((tier) => {
            const isExternal = tier.href.startsWith("http") || tier.href === "#";
            const Wrapper: any = isExternal ? "a" : Link;
            const linkProps = isExternal ? { href: tier.href, target: "_blank", rel: "noreferrer" } : { to: tier.href };
            return (
              <div key={tier.name} className={`flex flex-col rounded-3xl border p-7 ${tier.highlight ? "border-primary bg-gradient-brand-soft shadow-soft" : "border-border/70 bg-card"}`}>
                <div className="font-mono text-[11px] uppercase tracking-widest text-primary">{tier.name}</div>
                <div className="mt-4 font-serif text-4xl">{tier.price}</div>
                <div className="text-xs text-muted-foreground">{t.perMo}</div>
                <p className="mt-4 text-sm text-muted-foreground">{tier.desc}</p>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> <span>{f}</span></li>
                  ))}
                </ul>
                <Wrapper {...linkProps} className={`mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium ${tier.primary ? "bg-gradient-brand text-primary-foreground shadow-brand" : "border border-border hover:border-foreground"}`}>
                  {tier.cta} <ArrowRight className="h-4 w-4" />
                </Wrapper>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-3xl border border-border/70 bg-card p-8 md:flex md:items-center md:justify-between md:gap-6">
          <div>
            <h3 className="font-serif text-2xl">{t.enterprise.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t.enterprise.desc}</p>
          </div>
          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-medium text-primary-foreground shadow-brand md:mt-0">
            <MessageCircle className="h-4 w-4" /> {t.enterprise.cta}
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
