import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { KeyRound, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/lib/lang";
import { toast } from "sonner";
import Footer from "@/components/Footer";

const CoachRedeem = () => {
  const { session, roles, refreshRoles, loading } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const t = lang === "id" ? {
    kicker: "AKSES COACH",
    h1: "Aktifkan dashboard coach",
    lead: "Masukkan access code yang kamu terima setelah pembayaran dikonfirmasi untuk membuka dashboard coach.",
    placeholder: "Masukkan access code",
    cta: "Aktifkan",
    needLogin: "Kamu perlu masuk dulu untuk mengaktifkan code.",
    signIn: "Masuk / Daftar",
    success: "Akses coach aktif!",
    already: "Akun ini sudah punya akses coach.",
    goDash: "Buka dashboard",
    noCode: "Belum punya code? Hubungi kami untuk info pembayaran.",
    contact: "Hubungi via WhatsApp",
  } : {
    kicker: "COACH ACCESS",
    h1: "Activate your coach dashboard",
    lead: "Enter the access code you received after payment confirmation to unlock the coach dashboard.",
    placeholder: "Enter access code",
    cta: "Activate",
    needLogin: "You need to sign in first to redeem a code.",
    signIn: "Sign in / Sign up",
    success: "Coach access activated!",
    already: "This account already has coach access.",
    goDash: "Open dashboard",
    noCode: "Don't have a code? Contact us for payment info.",
    contact: "Contact via WhatsApp",
  };

  useEffect(() => {
    if (!loading && session && roles.includes("coach")) {
      // already coach
    }
  }, [loading, session, roles]);

  useEffect(() => {
    const c = searchParams.get("code");
    if (c) setCode(c.trim().toUpperCase());
  }, [searchParams]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { navigate("/auth"); return; }
    if (!code.trim()) return;
    setBusy(true);
    try {
      const { error } = await supabase.rpc("redeem_coach_code" as any, { _code: code.trim() });
      if (error) { toast.error(error.message); return; }
      await refreshRoles();
      toast.success(t.success);
      navigate("/coach/dashboard");
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl py-20 md:py-28">
        <Link to="/coach" className="font-mono text-xs text-muted-foreground hover:text-foreground">← Coach</Link>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 font-mono text-[11px] tracking-widest text-primary">
          <KeyRound className="h-3 w-3" /> {t.kicker}
        </div>
        <h1 className="mt-6 font-serif text-4xl md:text-5xl leading-[1.05]">{t.h1}</h1>
        <p className="mt-4 text-muted-foreground">{t.lead}</p>

        {!loading && session && roles.includes("coach") ? (
          <div className="mt-10 rounded-3xl border border-border/70 bg-card p-7">
            <p className="text-sm">{t.already}</p>
            <Link to="/coach/dashboard" className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-medium text-primary-foreground shadow-brand">
              {t.goDash} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 rounded-3xl border border-border/70 bg-card p-7">
            {!session && (
              <div className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {t.needLogin}{" "}
                <Link to="/auth" className="font-medium underline">{t.signIn}</Link>
              </div>
            )}
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder={t.placeholder}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 font-mono tracking-widest outline-none focus:border-primary"
              autoFocus
            />
            <button
              type="submit"
              disabled={busy || !code.trim() || !session}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-medium text-primary-foreground shadow-brand disabled:opacity-50"
            >
              {t.cta} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        <p className="mt-8 text-sm text-muted-foreground">
          {t.noCode}{" "}
          <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="font-medium text-foreground underline">{t.contact}</a>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default CoachRedeem;