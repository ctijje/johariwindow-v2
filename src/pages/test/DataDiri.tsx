import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { TestShell, StepKicker } from "@/components/test/TestShell";
import { useLang } from "@/lib/lang";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { generateCode } from "@/lib/johari";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  whatsapp: z.string().trim().min(5).max(32),
  occupation: z.string().trim().max(120).optional().or(z.literal("")),
  gender: z.string().trim().max(40).optional().or(z.literal("")),
  referralSource: z.string().trim().max(120).optional().or(z.literal("")),
});

const DataDiri = () => {
  const { lang } = useLang();
  const nav = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const draft = JSON.parse(sessionStorage.getItem("johari.profile") || "{}");
  const selfWords: string[] = JSON.parse(sessionStorage.getItem("johari.selfWords") || "[]");
  const [form, setForm] = useState({
    name: draft.name ?? "",
    email: draft.email ?? "",
    whatsapp: draft.whatsapp ?? "",
    occupation: draft.occupation ?? "",
    gender: draft.gender ?? "",
    referralSource: draft.referralSource ?? "",
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!selfWords.length) { nav("/test", { replace: true }); return; }
    if (authLoading) return;
    if (!session) nav("/auth?next=/test/data", { replace: true });
  }, [authLoading, session, nav, selfWords.length]);
  if (!selfWords.length || authLoading || !session) {
    return <TestShell><div className="text-muted-foreground">Loading…</div></TestShell>;
  }

  const labels = lang === "id"
    ? { title: "Data diri", lead: "Informasi ini digunakan untuk mengirimkan hasil kepadamu dan tidak akan dibagikan ke pihak lain.",
        name: "Nama lengkap", email: "Email", wa: "Nomor WhatsApp", occ: "Pekerjaan saat ini", gender: "Jenis kelamin", ref: "Tahu darimana?", refPh: "Mis. Instagram, teman, Google…", next: "Lanjut →", back: "Kembali" }
    : { title: "About you", lead: "This information is used to send your results to you and will not be shared.",
        name: "Full name", email: "Email", wa: "WhatsApp number", occ: "Current occupation", gender: "Gender", ref: "How did you hear about us?", refPh: "e.g. Instagram, a friend, Google…", next: "Next →", back: "Back" };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(lang === "id" ? "Mohon lengkapi semua field" : "Please complete all fields");
      return;
    }
    sessionStorage.setItem("johari.profile", JSON.stringify(parsed.data));
    setLoading(true);
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateCode();
      const { data, error } = await supabase.rpc("create_window", {
        _name: parsed.data.name,
        _email: parsed.data.email,
        _whatsapp: parsed.data.whatsapp,
        _occupation: parsed.data.occupation || "",
        _age: null,
        _gender: parsed.data.gender || "",
        _self_words: selfWords,
        _code: code,
        _referral_source: parsed.data.referralSource || null,
      } as any);
      if (!error && data && data[0]) {
        sessionStorage.setItem("johari.windowId", data[0].id);
        sessionStorage.setItem("johari.code", data[0].code);
        // Fire-and-forget Brevo sync; never block user
        const origin = window.location.origin;
        const resultUrl = `${origin}/test/result?w=${data[0].id}`;
        const peerUrl = `${origin}/peer/${data[0].code}`;
        supabase.functions.invoke("brevo-add-contact", {
          body: {
            email: parsed.data.email,
            name: parsed.data.name,
            whatsapp: parsed.data.whatsapp,
            occupation: parsed.data.occupation || "",
            gender: parsed.data.gender || "",
            referralSource: parsed.data.referralSource || "",
            code: data[0].code,
            resultUrl,
            peerUrl,
          },
        }).then((r) => console.log("brevo sync", r)).catch((err) => console.warn("brevo sync failed", err));
        nav("/test/share");
        return;
      }
      if (error && !error.message.toLowerCase().includes("unique")) {
        toast.error(error.message); setLoading(false); return;
      }
    }
    toast.error("Failed to create window"); setLoading(false);
  };

  const field = "rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary";

  return (
    <TestShell>
      <StepKicker step={2} label={labels.title} />
      <h1 className="font-serif text-4xl md:text-5xl">{labels.title}</h1>
      <p className="mt-2 text-muted-foreground">{labels.lead}</p>

      <form onSubmit={submit} className="mt-8 rounded-3xl border border-border p-6 md:p-8">
        <div className="space-y-5">
          {[
            ["name", labels.name, "text"],
            ["email", labels.email, "email"],
            ["whatsapp", labels.wa, "tel"],
          ].map(([k, label, type]) => (
            <label key={k} className="block">
              <span className="text-sm text-muted-foreground">{label} *</span>
              <input
                required type={type as string} value={(form as any)[k as string]}
                onChange={(e) => setForm({ ...form, [k as string]: e.target.value })}
                className={`mt-1 w-full ${field}`}
              />
            </label>
          ))}
          <label className="block">
            <span className="text-sm text-muted-foreground">{labels.occ}</span>
            <input type="text" value={form.occupation}
              onChange={(e) => setForm({ ...form, occupation: e.target.value })}
              className={`mt-1 w-full ${field}`} />
          </label>
          <label className="block">
              <span className="text-sm text-muted-foreground">{labels.gender}</span>
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
            <span className="text-sm text-muted-foreground">{labels.ref}</span>
            <input type="text" value={form.referralSource} placeholder={labels.refPh}
              onChange={(e) => setForm({ ...form, referralSource: e.target.value })}
              className={`mt-1 w-full ${field}`} />
          </label>
        </div>
        <div className="mt-8 flex items-center justify-between">
          <button type="button" onClick={() => nav("/test")} className="text-sm text-muted-foreground hover:text-foreground">
            {labels.back}
          </button>
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 font-medium text-primary-foreground shadow-brand disabled:opacity-40">
            {labels.next}
          </button>
        </div>
      </form>
    </TestShell>
  );
};

export default DataDiri;