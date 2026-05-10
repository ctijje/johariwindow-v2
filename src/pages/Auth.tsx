import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/lib/lang";
import { toast } from "sonner";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72),
});

const Auth = () => {
  const { lang } = useLang();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next");
  const asIndividual = !!next;
  const { session, roles, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (loading || !session) return;
    if (next) {
      nav(next, { replace: true });
    } else if (roles.includes("coach")) {
      nav("/coach/dashboard", { replace: true });
    } else {
      nav("/coach/redeem", { replace: true });
    }
  }, [loading, session, roles, nav, next, asIndividual]);

  const t = lang === "id" ? {
    title: asIndividual ? "Masuk untuk simpan hasilmu" : "Masuk untuk Coach",
    sub: asIndividual
      ? "Hasil Johari Window butuh feedback peer. Login agar hasilmu tersimpan dan bisa dibuka kapan saja, di perangkat manapun."
      : "Buat akun atau masuk dulu. Setelah itu kamu akan diminta memasukkan access code untuk membuka dashboard coach.",
    signin: "Masuk", signup: "Daftar",
    name: "Nama lengkap", email: "Email", password: "Kata sandi",
    google: "Lanjut dengan Google",
    or: "atau", noAcc: "Belum punya akun?", hasAcc: "Sudah punya akun?",
    backHome: "Kembali ke beranda",
  } : {
    title: asIndividual ? "Sign in to save your result" : "Sign in for Coaches",
    sub: asIndividual
      ? "Your Johari Window needs peer feedback. Sign in so your result is saved and you can return anytime, on any device."
      : "Create an account or sign in first. You'll then be asked for an access code to unlock the coach dashboard.",
    signin: "Sign in", signup: "Create account",
    name: "Full name", email: "Email", password: "Password",
    google: "Continue with Google",
    or: "or", noAcc: "No account?", hasAcc: "Already have an account?",
    backHome: "Back to home",
  };

  const handleGoogle = async () => {
    const redirect = window.location.origin + (next ? `/auth?next=${encodeURIComponent(next)}` : "/auth");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: redirect });
    if (result.error) toast.error(result.error.message ?? "Google sign-in failed");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const parsed = signupSchema.safeParse(form);
        if (!parsed.success) { toast.error(lang === "id" ? "Periksa kembali form" : "Please check the form"); return; }
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            emailRedirectTo: window.location.origin + (next ? `/auth?next=${encodeURIComponent(next)}` : "/auth"),
            data: { display_name: form.name, intended_role: asIndividual ? "individual" : "coach" },
          },
        });
        if (error) { toast.error(error.message); return; }
        if (data.session) {
          toast.success(lang === "id" ? "Akun dibuat" : "Account created");
        } else {
          toast.success(lang === "id" ? "Cek email untuk konfirmasi" : "Check your email to confirm");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) { toast.error(error.message); return; }
      }
    } finally { setBusy(false); }
  };

  const field = "rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-md py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {t.backHome}
        </Link>
        <h1 className="mt-8 font-serif text-4xl">{t.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{t.sub}</p>

        <div className="mt-8 flex rounded-full border border-border p-1">
          {(["signin", "signup"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 rounded-full py-2 text-sm font-medium ${mode === m ? "bg-gradient-brand text-primary-foreground shadow-brand" : "text-muted-foreground"}`}>
              {m === "signin" ? t.signin : t.signup}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <label className="block">
              <span className="text-xs text-muted-foreground">{t.name}</span>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`mt-1 w-full ${field}`} />
            </label>
          )}
          <label className="block">
            <span className="text-xs text-muted-foreground">{t.email}</span>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`mt-1 w-full ${field}`} />
          </label>
          <label className="block">
            <span className="text-xs text-muted-foreground">{t.password}</span>
            <input required type="password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={`mt-1 w-full ${field}`} />
          </label>
          <button disabled={busy} type="submit" className="w-full rounded-full bg-gradient-brand px-6 py-3 font-medium text-primary-foreground shadow-brand disabled:opacity-60">
            {mode === "signin" ? t.signin : t.signup}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs uppercase text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> {t.or} <div className="h-px flex-1 bg-border" />
        </div>

        <button onClick={handleGoogle} className="w-full rounded-full border border-border px-6 py-3 text-sm font-medium hover:border-foreground">
          {t.google}
        </button>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {mode === "signin" ? t.noAcc : t.hasAcc}{" "}
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-primary hover:underline">
            {mode === "signin" ? t.signup : t.signin}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;