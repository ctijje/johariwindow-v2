import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { TestShell, StepKicker } from "@/components/test/TestShell";
import { useLang } from "@/lib/lang";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  whatsapp: z.string().trim().min(5).max(32),
  occupation: z.string().trim().max(120).optional().or(z.literal("")),
  age: z.union([z.coerce.number().int().min(10).max(120), z.literal("")]).optional(),
  gender: z.string().trim().max(40).optional().or(z.literal("")),
});

const DataDiri = () => {
  const { lang } = useLang();
  const nav = useNavigate();
  const draft = JSON.parse(sessionStorage.getItem("johari.profile") || "{}");
  const [form, setForm] = useState({
    name: draft.name ?? "",
    email: draft.email ?? "",
    whatsapp: draft.whatsapp ?? "",
    occupation: draft.occupation ?? "",
    age: draft.age ?? "",
    gender: draft.gender ?? "",
  });

  const labels = lang === "id"
    ? { title: "Data diri", lead: "Informasi ini digunakan untuk mengirimkan hasil kepadamu dan tidak akan dibagikan ke pihak lain.",
        name: "Nama lengkap", email: "Email", wa: "Nomor WhatsApp", occ: "Pekerjaan saat ini", age: "Usia", gender: "Jenis kelamin", next: "Lanjut →" }
    : { title: "About you", lead: "This information is used to send your results to you and will not be shared.",
        name: "Full name", email: "Email", wa: "WhatsApp number", occ: "Current occupation", age: "Age", gender: "Gender", next: "Next →" };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(lang === "id" ? "Mohon lengkapi semua field" : "Please complete all fields");
      return;
    }
    sessionStorage.setItem("johari.profile", JSON.stringify(parsed.data));
    nav("/test/words");
  };

  const field = "rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary";

  return (
    <TestShell>
      <StepKicker step={1} label={labels.title} />
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
          <div className="grid grid-cols-2 gap-5">
            <label className="block">
              <span className="text-sm text-muted-foreground">{labels.age}</span>
              <input type="number" min={10} max={120} value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
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
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 font-medium text-primary-foreground shadow-brand">
            {labels.next}
          </button>
        </div>
      </form>
    </TestShell>
  );
};

export default DataDiri;