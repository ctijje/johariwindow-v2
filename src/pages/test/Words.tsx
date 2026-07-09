import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { TestShell, StepKicker } from "@/components/test/TestShell";
import { AdjectiveGrid } from "@/components/test/AdjectiveGrid";
import { RankingList } from "@/components/test/RankingList";
import { WORDS, findWord } from "@/data/adjectives";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { generateCode } from "@/lib/johari";
import { cn } from "@/lib/utils";

const PURPOSES = [
  "Self-awareness pribadi",
  "Pengembangan karier",
  "Leadership / managerial growth",
  "Team collaboration",
  "Communication improvement",
  "Personal branding",
  "Relationship / interpersonal insight",
  "Coaching / mentoring readiness",
  "Lainnya",
];

const baseSchema = {
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  whatsapp: z.string().trim().max(32).optional().or(z.literal("")),
  gender: z.string().trim().max(40).optional().or(z.literal("")),
  age: z.string().trim().max(3).optional().or(z.literal("")),
};
const schemaWithPassword = z.object({ ...baseSchema, password: z.string().min(8).max(72) });
const schemaNoPassword = z.object({ ...baseSchema, password: z.string().optional().or(z.literal("")) });

type Step = "purpose" | "words" | "ranking" | "profile";

const Words = () => {
  const nav = useNavigate();
  const { session, loading: authLoading, signOut } = useAuth();

  const [step, setStep] = useState<Step>("purpose");
  const [purposes, setPurposes] = useState<string[]>([]);
  const [purposeOther, setPurposeOther] = useState("");
  const [selected, setSelected] = useState<string[]>(
    JSON.parse(sessionStorage.getItem("johari.selfWords") || "[]")
  );
  const [ranked, setRanked] = useState<string[]>(
    JSON.parse(sessionStorage.getItem("johari.selfRanked") || "[]")
  );
  const [anchorReason, setAnchorReason] = useState(sessionStorage.getItem("johari.anchorReason") || "");
  const [selfContext, setSelfContext] = useState(sessionStorage.getItem("johari.selfContext") || "");

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

  const toggle = (id: string) => {
    setSelected((s) => {
      if (s.includes(id)) {
        setRanked((r) => r.filter((x) => x !== id));
        return s.filter((x) => x !== id);
      }
      if (s.length >= 5) return s;
      return [...s, id];
    });
  };

  useEffect(() => { sessionStorage.setItem("johari.selfWords", JSON.stringify(selected)); }, [selected]);
  useEffect(() => { sessionStorage.setItem("johari.selfRanked", JSON.stringify(ranked)); }, [ranked]);
  useEffect(() => { sessionStorage.setItem("johari.anchorReason", anchorReason); }, [anchorReason]);
  useEffect(() => { sessionStorage.setItem("johari.selfContext", selfContext); }, [selfContext]);
  useEffect(() => {
    const { password: _pw, ...safe } = form;
    sessionStorage.setItem("johari.profile", JSON.stringify(safe));
  }, [form]);

  useEffect(() => {
    if (!session?.user) return;
    const meta: any = session.user.user_metadata || {};
    setForm((f) => ({
      ...f,
      name: f.name?.trim() ? f.name : (meta.display_name || meta.full_name || meta.name || ""),
      email: f.email?.trim() ? f.email : (session.user.email || ""),
    }));
  }, [session]);

  const handleGoogle = async () => {
    sessionStorage.setItem("johari.selfWords", JSON.stringify(selected));
    sessionStorage.setItem("johari.selfRanked", JSON.stringify(ranked));
    const redirect = `${window.location.origin}/test`;
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: redirect });
    if (result.error) toast.error(result.error.message ?? "Google sign-in failed");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const schema = session ? schemaNoPassword : schemaWithPassword;
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(session
        ? "Nama dan email wajib diisi"
        : "Nama, email valid, dan password (min 8 karakter) wajib diisi");
      return;
    }
    if (authLoading) return;
    setLoading(true);

    if (!session) {
      // Try sign-in first (returning user)
      const { error: signInFirst } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password!,
      });

      if (signInFirst) {
        const msg = signInFirst.message.toLowerCase();
        const isWrongPw = msg.includes("invalid") || msg.includes("credentials") || msg.includes("password");
        const isNotFound = msg.includes("no user") || msg.includes("not found") || msg.includes("user not found");

        if (isWrongPw && !isNotFound) {
          // Existing user, wrong password
          toast.error("Password salah. Coba lagi atau reset password.");
          setLoading(false);
          return;
        }

        // New user — sign up
        const redirectUrl = `${window.location.origin}/test/share`;
        const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password!,
          options: { emailRedirectTo: redirectUrl, data: { display_name: parsed.data.name } },
        });

        if (signUpErr) {
          toast.error(signUpErr.message);
          setLoading(false);
          return;
        }

        // If email confirmation is required, signUpData.session will be null.
        // We still proceed to create the window — it's accessible by UUID without auth.
        if (!signUpData?.session) {
          toast.info("Cek emailmu untuk konfirmasi akun. Hasil tetap tersimpan dan bisa diakses via link.");
        }
      }
    }

    const ageNum = parsed.data.age ? parseInt(parsed.data.age, 10) : null;
    const finalPurposes = purposes.filter((p) => p !== "Lainnya");
    if (purposes.includes("Lainnya") && purposeOther.trim()) finalPurposes.push(`Lainnya: ${purposeOther.trim()}`);

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
        _self_words_ranked: ranked,
        _self_anchor_reason: anchorReason.trim() || null,
        _self_context: selfContext.trim() || null,
        _assessment_purposes: finalPurposes,
        _assessment_purpose_other: purposes.includes("Lainnya") ? purposeOther.trim() : null,
      } as any);
      if (!error && data && data[0]) {
        sessionStorage.setItem("johari.windowId", data[0].id);
        sessionStorage.setItem("johari.code", data[0].code);
        nav("/test/share");
        return;
      }
      if (error && !error.message.toLowerCase().includes("unique")) { toast.error(error.message); setLoading(false); return; }
    }
    toast.error("Gagal membuat window, coba lagi.");
    setLoading(false);
  };

  const togglePurpose = (p: string) => {
    setPurposes((prev) => {
      if (prev.includes(p)) return prev.filter((x) => x !== p);
      const nonOther = prev.filter((x) => x !== "Lainnya");
      if (nonOther.length >= 2 && p !== "Lainnya") {
        toast.error("Pilih maksimal 2 tujuan agar report kamu tetap fokus dan relevan.");
        return prev;
      }
      return [...prev, p];
    });
  };

  const field = "rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary w-full";
  const stepNum = { purpose: 1, words: 2, ranking: 3, profile: 4 }[step];
  const canContinuePurpose = purposes.length >= 1 && (!purposes.includes("Lainnya") || purposeOther.trim().length > 0);
  const canContinueRanking = ranked.length === 5 && anchorReason.trim().length > 0;
  const canSubmit = selected.length === 5 && form.name.trim() && form.email.trim() && (session ? true : form.password.length >= 8);
  const anchorWord = ranked[0] ? findWord(ranked[0]) : null;

  return (
    <TestShell>
      <Helmet>
        <title>Mulai Johari Window — Kenali Dirimu</title>
        <meta name="description" content="Pilih kata yang menggambarkan dirimu dan dapatkan insight dari orang-orang yang mengenalmu." />
      </Helmet>
      <StepKicker step={stepNum} total={4} label={
        step === "purpose" ? "Tujuan" : step === "words" ? "Pilih Kata" : step === "ranking" ? "Urutkan" : "Data Diri"
      } />

      {/* STEP 1: Purpose */}
      {step === "purpose" && (
        <>
          <h1 className="font-serif text-3xl md:text-4xl">Apa tujuan utama kamu mengambil Johari Window ini?</h1>
          <p className="mt-3 text-muted-foreground">Pilih maksimal 2 tujuan yang paling relevan.</p>
          <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {PURPOSES.map((p) => (
              <button key={p} type="button" onClick={() => togglePurpose(p)}
                className={cn("rounded-2xl border-2 px-5 py-4 text-left text-sm font-medium transition-all",
                  purposes.includes(p) ? "border-primary bg-accent text-primary" : "border-border bg-background hover:border-primary/40")}>
                {p}
              </button>
            ))}
          </div>
          {purposes.includes("Lainnya") && (
            <div className="mt-4">
              <label className="block text-sm text-muted-foreground mb-1.5">Ceritakan secara singkat tujuanmu *</label>
              <textarea value={purposeOther} onChange={(e) => setPurposeOther(e.target.value)} rows={3}
                placeholder="Contoh: Saya ingin lebih memahami diri sebelum memulai karier baru..."
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary w-full resize-none" />
            </div>
          )}
          <div className="mt-8 flex justify-end">
            <button onClick={() => canContinuePurpose && setStep("words")} disabled={!canContinuePurpose}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 font-medium text-primary-foreground shadow-brand disabled:opacity-40">
              Lanjut →
            </button>
          </div>
        </>
      )}

      {/* STEP 2: Word Selection */}
      {step === "words" && (
        <>
          <h1 className="font-serif text-3xl md:text-4xl">Pilih tepat 5 kata yang paling menggambarkan dirimu</h1>
          <p className="mt-3 text-muted-foreground">Pilih kata yang memang paling menggambarkan kamu dalam kehidupan sehari-hari, bukan yang kamu inginkan.</p>
          <div className="mt-8"><AdjectiveGrid selected={selected} onToggle={toggle} /></div>
          <div className="mt-8 flex items-center justify-between">
            <button type="button" onClick={() => setStep("purpose")} className="text-sm text-muted-foreground hover:text-foreground">← Kembali</button>
            <button onClick={() => selected.length === 5 && setStep("ranking")} disabled={selected.length !== 5}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 font-medium text-primary-foreground shadow-brand disabled:opacity-40">
              Lanjut Urutkan →
            </button>
          </div>
        </>
      )}

      {/* STEP 3: Ranking + Open Questions */}
      {step === "ranking" && (
        <>
          <h1 className="font-serif text-3xl md:text-4xl">Urutkan 5 kata yang kamu pilih</h1>
          <p className="mt-3 text-muted-foreground">Dari yang <strong>paling kuat</strong> menggambarkan kamu (1) hingga yang paling lemah dari kelima kata ini (5).</p>
          <div className="mt-8">
            <RankingList words={selected} ranked={ranked} onRankChange={setRanked} />
          </div>
          {ranked.length === 5 && (
            <div className="mt-8 rounded-2xl border border-border bg-card p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Kenapa {anchorWord ? <><span className="text-primary">"{anchorWord.en} ({anchorWord.id_label})"</span></> : "kata nomor 1"} paling menggambarkan dirimu? *
                </label>
                <textarea value={anchorReason} onChange={(e) => setAnchorReason(e.target.value)} rows={3}
                  placeholder="Ceritakan dengan singkat..."
                  className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary w-full resize-none" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">
                  Dalam situasi apa kualitas itu paling sering muncul? <span className="opacity-70">(opsional)</span>
                </label>
                <textarea value={selfContext} onChange={(e) => setSelfContext(e.target.value)} rows={2}
                  placeholder="Contoh: Saat bekerja dalam tim, atau saat ada orang yang butuh bantuan..."
                  className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary w-full resize-none" />
              </div>
            </div>
          )}
          <div className="mt-8 flex items-center justify-between">
            <button type="button" onClick={() => setStep("words")} className="text-sm text-muted-foreground hover:text-foreground">← Kembali</button>
            <button onClick={() => canContinueRanking && setStep("profile")} disabled={!canContinueRanking}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 font-medium text-primary-foreground shadow-brand disabled:opacity-40">
              Lanjut →
            </button>
          </div>
        </>
      )}

      {/* STEP 4: Profile / Account */}
      {step === "profile" && (
        <>
          <h1 className="font-serif text-3xl md:text-4xl">Hampir selesai</h1>
          <p className="mt-3 text-muted-foreground">Buat akun agar hasilmu tersimpan dan bisa dibuka kapan saja.</p>
          <form onSubmit={submit} className="mt-8 rounded-3xl border border-border p-6 md:p-8">
            {session ? (
              <div className="flex items-center justify-between rounded-xl bg-accent/60 px-4 py-3 text-sm">
                <span className="text-muted-foreground">Masuk sebagai: <span className="font-medium text-foreground">{session.user.email}</span></span>
                <button type="button" onClick={() => signOut()} className="text-xs text-primary hover:underline">Ganti akun</button>
              </div>
            ) : (
              <div className="space-y-3">
                <button type="button" onClick={handleGoogle}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium transition hover:border-foreground">
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.1A6.97 6.97 0 0 1 5.46 12c0-.73.13-1.44.36-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.83z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
                  </svg>
                  Lanjut dengan Google
                </button>
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">atau pakai email</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              </div>
            )}
            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="text-sm text-muted-foreground">Nama lengkap *</span>
                <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`mt-1 ${field}`} />
              </label>
              <label className="block">
                <span className="text-sm text-muted-foreground">Email *</span>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`mt-1 ${field}`} />
              </label>
              {!session && (
                <label className="block">
                  <span className="text-sm text-muted-foreground">Password *</span>
                  <input required type="password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={`mt-1 ${field}`} autoComplete="new-password" />
                  <span className="mt-1 block text-xs text-muted-foreground">Minimal 8 karakter.</span>
                </label>
              )}
              <label className="block">
                <span className="text-sm text-muted-foreground">Nomor WhatsApp <span className="opacity-70">(opsional)</span></span>
                <input type="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className={`mt-1 ${field}`} />
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm text-muted-foreground">Jenis kelamin <span className="opacity-70">(opsional)</span></span>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className={`mt-1 ${field}`}>
                    <option value="">—</option>
                    <option>Perempuan</option>
                    <option>Laki-laki</option>
                    <option>Lainnya</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm text-muted-foreground">Usia <span className="opacity-70">(opsional)</span></span>
                  <input type="number" min={10} max={120} value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className={`mt-1 ${field}`} />
                </label>
              </div>
            </div>
            <p className="mt-5 text-xs italic text-muted-foreground">Kami tidak menggunakan emailmu untuk marketing.</p>
            <div className="mt-8 flex items-center justify-between">
              <button type="button" onClick={() => setStep("ranking")} className="text-sm text-muted-foreground hover:text-foreground">← Kembali</button>
              <button type="submit" disabled={!canSubmit || loading}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 font-medium text-primary-foreground shadow-brand disabled:opacity-40">
                {loading ? "Memproses..." : "Buat Johari Window"}
              </button>
            </div>
          </form>
        </>
      )}
    </TestShell>
  );
};

export default Words;
