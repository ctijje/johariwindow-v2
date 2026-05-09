import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { TestShell, StepKicker } from "@/components/test/TestShell";
import { AdjectiveGrid } from "@/components/test/AdjectiveGrid";
import { useLang } from "@/lib/lang";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { generateCode } from "@/lib/johari";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72),
  whatsapp: z.string().trim().max(32).optional().or(z.literal("")),
  gender: z.string().trim().max(40).optional().or(z.literal("")),
  age: z.string().trim().max(3).optional().or(z.literal("")),
});

const Words = () => {
  const { lang } = useLang();
  const nav = useNavigate();
  const { session, loading: authLoading } = useAuth();

  const [selected, setSelected] = useState<string[]>(
    JSON.parse(sessionStorage.getItem("johari.selfWords") || "[]")
  );
  const draft = JSON.parse(sessionStorage.getItem("johari.profile") || "{}");
  const [form, setForm] = useState({
    name: draft.name ?? "",
    email: draft.email ?? "",
    password: "",
    whatsapp: draft.whatsapp ?? "",
    gender: draft.gender ?? "",
    age: draft.age ?? "",
  });
  const [loading, setLoading] = useState(false);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  // Persist drafts so login redirect doesn't lose progress
  useEffect(() => {
    sessionStorage.setItem("johari.selfWords", JSON.stringify(selected));
  }, [selected]);
  useEffect(() => {
    const { password: _pw, ...safe } = form;
    sessionStorage.setItem("johari.profile", JSON.stringify(safe));
  }, [form]);

  const labels = lang === "id"
    ? {
        kicker: "Pilih kata & isi data",
        h1: "Pilih kata yang paling mencerminkan dirimu",
        lead: "Pilih kata yang paling sesuai dan menggambarkan kamu, bukan yang kamu inginkan, tapi yang memang paling menggambarkan kamu. Pilih 5–20 kata.",
        formTitle: "Data diri",
        formLead: "Informasi ini digunakan untuk mengirim hasil dan link feedback ke kamu.",
        name: "Nama lengkap",
        email: "Email",
        password: "Password",
        passwordHint: "Minimal 8 karakter. Akun otomatis dibuat dengan email & password ini agar kamu bisa kembali melihat hasil kapan saja.",
        wa: "Nomor WhatsApp",
        gender: "Jenis kelamin",
        age: "Usia",
        optional: "(opsional)",
        note: "Kami tidak menggunakan emailmu untuk marketing. Email hanya dipakai untuk mengirim profilmu, link penting, dan update saat ada feedback baru masuk.",
        cta: "Buat Johari Window",
        back: "Kembali",
        wordsHint: "Pilih minimal 5 kata untuk lanjut.",
      }
    : {
        kicker: "Pick words & your details",
        h1: "Pick the words that reflect you most",
        lead: "Pick words that genuinely describe you — not what you wish you were. Choose 5–20.",
        formTitle: "Your details",
        formLead: "We use this to send your result and feedback links to you.",
        name: "Full name",
        email: "Email",
        password: "Password",
        passwordHint: "At least 8 characters. We'll create your account with this email & password so you can come back to see your result anytime.",
        wa: "WhatsApp number",
        gender: "Gender",
        age: "Age",
        optional: "(optional)",
        note: "We won't use your email for marketing purposes. It's only to send you your profile, important links, and updates about the feedbacks you are getting.",
        cta: "Create Johari Window",
        back: "Back",
        wordsHint: "Pick at least 5 words to continue.",
      };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.length < 5 || selected.length > 20) {
      toast.error(labels.wordsHint);
      return;
    }
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(lang === "id" ? "Nama, email valid, dan password (min 8 karakter) wajib diisi" : "Name, a valid email, and password (min 8 chars) are required");
      return;
    }

    sessionStorage.setItem("johari.selfWords", JSON.stringify(selected));
    const { password: _pw, ...safeProfile } = parsed.data;
    sessionStorage.setItem("johari.profile", JSON.stringify(safeProfile));

    if (authLoading) return;

    setLoading(true);

    // If not logged in, create the account inline (sign up + sign in)
    if (!session) {
      const redirectUrl = `${window.location.origin}/test/share`;
      const { error: signUpErr } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { display_name: parsed.data.name },
        },
      });
      if (signUpErr) {
        const msg = signUpErr.message.toLowerCase();
        if (msg.includes("registered") || msg.includes("exists") || msg.includes("already")) {
          // Account exists — try sign in with provided password
          const { error: signInErr } = await supabase.auth.signInWithPassword({
            email: parsed.data.email,
            password: parsed.data.password,
          });
          if (signInErr) {
            toast.error(lang === "id"
              ? "Email ini sudah terdaftar. Password salah — coba password lain atau masuk lewat halaman login."
              : "This email is already registered. Wrong password — try another or sign in via the login page.");
            setLoading(false);
            return;
          }
        } else {
          toast.error(signUpErr.message);
          setLoading(false);
          return;
        }
      } else {
        // Ensure session is active (auto-confirm enabled)
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (signInErr) {
          toast.error(signInErr.message);
          setLoading(false);
          return;
        }
      }
    }

    const ageNum = parsed.data.age ? parseInt(parsed.data.age, 10) : null;
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateCode();
      const { data, error } = await supabase.rpc("create_window", {
        _name: parsed.data.name,
        _email: parsed.data.email,
        _whatsapp: parsed.data.whatsapp || "",
        _occupation: "",
        _age: ageNum && ageNum >= 10 && ageNum <= 120 ? ageNum : null,
        _gender: parsed.data.gender || "",
        _self_words: selected,
        _code: code,
        _referral_source: null,
      } as any);
      if (!error && data && data[0]) {
        sessionStorage.setItem("johari.windowId", data[0].id);
        sessionStorage.setItem("johari.code", data[0].code);
        const origin = window.location.origin;
        const resultUrl = `${origin}/test/result?w=${data[0].id}`;
        const peerUrl = `${origin}/peer/${data[0].code}`;
        supabase.functions.invoke("brevo-add-contact", {
          body: {
            email: parsed.data.email,
            name: parsed.data.name,
            whatsapp: parsed.data.whatsapp || "",
            occupation: "",
            gender: parsed.data.gender || "",
            referralSource: "",
            code: data[0].code,
            resultUrl,
            peerUrl,
          },
        }).catch(() => {});
        nav("/test/share");
        return;
      }
      if (error && !error.message.toLowerCase().includes("unique")) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
    }
    toast.error("Failed to create window");
    setLoading(false);
  };

  const field = "rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary";
  const canSubmit = selected.length >= 5 && selected.length <= 20 && form.name.trim() && form.email.trim() && (session ? true : form.password.length >= 8);

  return (
    <TestShell>
      <StepKicker step={1} total={3} label={labels.kicker} />
      <h1 className="font-serif text-4xl md:text-5xl">{labels.h1}</h1>
      <p className="mt-2 text-muted-foreground">{labels.lead}</p>

      <div className="mt-8">
        <AdjectiveGrid selected={selected} onToggle={toggle} />
      </div>

      <form onSubmit={submit} className="mt-10 rounded-3xl border border-border p-6 md:p-8">
        <h2 className="font-serif text-2xl">{labels.formTitle}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{labels.formLead}</p>

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="text-sm text-muted-foreground">{labels.name} *</span>
            <input
              required type="text" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`mt-1 w-full ${field}`}
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">{labels.email} *</span>
            <input
              required type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`mt-1 w-full ${field}`}
            />
          </label>
          {!session && (
            <label className="block">
              <span className="text-sm text-muted-foreground">{labels.password} *</span>
              <input
                required type="password" minLength={8} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`mt-1 w-full ${field}`}
                autoComplete="new-password"
              />
              <span className="mt-1 block text-xs text-muted-foreground">{labels.passwordHint}</span>
            </label>
          )}
          <label className="block">
            <span className="text-sm text-muted-foreground">{labels.wa} <span className="opacity-70">{labels.optional}</span></span>
            <input
              type="tel" value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              className={`mt-1 w-full ${field}`}
            />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm text-muted-foreground">{labels.gender} <span className="opacity-70">{labels.optional}</span></span>
              <select value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className={`mt-1 w-full ${field}`}>
                <option value="">—</option>
                <option value={lang === "id" ? "Perempuan" : "Female"}>{lang === "id" ? "Perempuan" : "Female"}</option>
                <option value={lang === "id" ? "Laki-laki" : "Male"}>{lang === "id" ? "Laki-laki" : "Male"}</option>
                <option value={lang === "id" ? "Lainnya" : "Other"}>{lang === "id" ? "Lainnya" : "Other"}</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-muted-foreground">{labels.age} <span className="opacity-70">{labels.optional}</span></span>
              <input type="number" min={10} max={120} value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className={`mt-1 w-full ${field}`} />
            </label>
          </div>
        </div>

        <p className="mt-5 text-xs italic text-muted-foreground">{labels.note}</p>

        <div className="mt-8 flex items-center justify-between">
          <button type="button" onClick={() => nav("/")} className="text-sm text-muted-foreground hover:text-foreground">
            {labels.back}
          </button>
          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 font-medium text-primary-foreground shadow-brand disabled:opacity-40"
          >
            {labels.cta}
          </button>
        </div>
      </form>
    </TestShell>
  );
};

export default Words;