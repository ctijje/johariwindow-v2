import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Copy, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/lib/lang";
import DashboardShell from "@/components/DashboardShell";
import { toast } from "sonner";
import { generateCode } from "@/lib/code";

type Mentee = {
  id: string; mentee_name: string; mentee_email: string | null;
  status: string; window_id: string; created_at: string;
  window?: { code: string };
};

const CoachDashboard = () => {
  const { user } = useAuth();
  const { lang } = useLang();
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "" });

  const t = lang === "id" ? {
    title: "Dashboard Coach", h1: "Mentee kamu", lead: "Kelola, undang, dan pandu mentee dari sini.",
    add: "Tambah mentee", empty: "Belum ada mentee. Tambah mentee pertamamu.",
    name: "Nama mentee", email: "Email (opsional)", wa: "WhatsApp (opsional)",
    cancel: "Batal", save: "Tambahkan", code: "Kode", copyLink: "Salin link", view: "Buka",
    statusInvited: "Diundang", statusOpen: "Sedang berjalan",
  } : {
    title: "Coach Dashboard", h1: "Your mentees", lead: "Manage, invite, and guide your mentees from here.",
    add: "Add mentee", empty: "No mentees yet. Add your first mentee.",
    name: "Mentee name", email: "Email (optional)", wa: "WhatsApp (optional)",
    cancel: "Cancel", save: "Add", code: "Code", copyLink: "Copy link", view: "Open",
    statusInvited: "Invited", statusOpen: "In progress",
  };

  const load = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("coach_mentees")
      .select("id, mentee_name, mentee_email, status, window_id, created_at")
      .eq("coach_id", user.id)
      .order("created_at", { ascending: false });
    if (error) { toast.error(error.message); return; }
    setMentees(data ?? []);
  };
  useEffect(() => { load(); }, [user]);

  const addMentee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.name.trim()) return;
    setBusy(true);
    try {
      const code = generateCode();
      // Create window owned by coach
      const { data: w, error: wErr } = await supabase
        .from("windows")
        .insert({
          name: form.name.trim(),
          email: form.email.trim() || `mentee-${code}@johariwindow.id`,
          whatsapp: form.whatsapp.trim() || "-",
          occupation: "-", age: 0, gender: "-",
          self_words: [],
          code,
          owner_type: "coach",
          owner_id: user.id,
        })
        .select("id, code")
        .single();
      if (wErr || !w) { toast.error(wErr?.message ?? "Failed"); return; }
      const { error: mErr } = await supabase.from("coach_mentees").insert({
        coach_id: user.id,
        window_id: w.id,
        mentee_name: form.name.trim(),
        mentee_email: form.email.trim() || null,
        mentee_whatsapp: form.whatsapp.trim() || null,
        status: "invited",
      });
      if (mErr) { toast.error(mErr.message); return; }
      toast.success(lang === "id" ? "Mentee ditambahkan" : "Mentee added");
      setForm({ name: "", email: "", whatsapp: "" });
      setShowForm(false);
      load();
    } finally { setBusy(false); }
  };

  const peerLinkFor = (windowId: string) => {
    const m = mentees.find((x) => x.window_id === windowId);
    if (!m) return "";
    return `${window.location.origin}/peer/${(m as any).code ?? ""}`;
  };

  return (
    <DashboardShell title={t.title}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl">{t.h1}</h1>
          <p className="mt-2 text-muted-foreground">{t.lead}</p>
        </div>
        <button onClick={() => setShowForm((s) => !s)} className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-medium text-primary-foreground shadow-brand">
          <Plus className="h-4 w-4" /> {t.add}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addMentee} className="mt-6 grid gap-4 rounded-3xl border border-border/70 p-6 md:grid-cols-3">
          <input required placeholder={t.name} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          <input type="email" placeholder={t.email} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          <input placeholder={t.wa} value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          <div className="md:col-span-3 flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-border px-5 py-2 text-sm">{t.cancel}</button>
            <button disabled={busy} type="submit" className="rounded-full bg-gradient-brand px-5 py-2 text-sm font-medium text-primary-foreground shadow-brand">{t.save}</button>
          </div>
        </form>
      )}

      <div className="mt-8 space-y-3">
        {mentees.length === 0 && (
          <div className="rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">{t.empty}</div>
        )}
        {mentees.map((m) => (
          <div key={m.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/70 p-5">
            <div>
              <div className="font-serif text-xl">{m.mentee_name}</div>
              <div className="text-xs text-muted-foreground">{m.mentee_email ?? "—"} · {m.status === "invited" ? t.statusInvited : t.statusOpen}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  const { data } = await supabase.rpc("get_window_full", { _id: m.window_id });
                  const code = (data as any)?.[0]?.code;
                  if (code) {
                    navigator.clipboard.writeText(`${window.location.origin}/peer/${code}`);
                    toast.success(lang === "id" ? "Link disalin" : "Link copied");
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs hover:border-foreground"
              >
                <Copy className="h-3.5 w-3.5" /> {t.copyLink}
              </button>
              <Link to={`/coach/mentee/${m.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-4 py-2 text-xs font-medium text-primary-foreground shadow-brand">
                <ExternalLink className="h-3.5 w-3.5" /> {t.view}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
};

export default CoachDashboard;