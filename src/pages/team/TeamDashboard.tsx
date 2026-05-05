import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/lib/lang";
import DashboardShell from "@/components/DashboardShell";
import { toast } from "sonner";

type Team = { id: string; name: string; description: string | null; created_at: string };

const TeamDashboard = () => {
  const { user } = useAuth();
  const { lang } = useLang();
  const [teams, setTeams] = useState<Team[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const t = lang === "id" ? {
    title: "Dashboard Tim", h1: "Tim kamu", lead: "Buat tim, undang anggota, dan lihat agregat kekuatan.",
    add: "Buat tim", empty: "Belum ada tim. Buat tim pertamamu.",
    name: "Nama tim", desc: "Deskripsi (opsional)", cancel: "Batal", save: "Simpan", view: "Buka",
  } : {
    title: "Team Dashboard", h1: "Your teams", lead: "Create teams, invite members, and view aggregate strengths.",
    add: "Create team", empty: "No teams yet. Create your first team.",
    name: "Team name", desc: "Description (optional)", cancel: "Cancel", save: "Save", view: "Open",
  };

  const load = async () => {
    if (!user) return;
    const { data, error } = await supabase.from("teams").select("*").eq("owner_id", user.id).order("created_at", { ascending: false });
    if (error) { toast.error(error.message); return; }
    setTeams(data ?? []);
  };
  useEffect(() => { load(); }, [user]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("teams").insert({ owner_id: user.id, name: form.name.trim(), description: form.description.trim() || null });
    if (error) { toast.error(error.message); return; }
    toast.success(lang === "id" ? "Tim dibuat" : "Team created");
    setForm({ name: "", description: "" });
    setShowForm(false);
    load();
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
        <form onSubmit={create} className="mt-6 space-y-3 rounded-3xl border border-border/70 p-6">
          <input required placeholder={t.name} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          <textarea placeholder={t.desc} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-border px-5 py-2 text-sm">{t.cancel}</button>
            <button type="submit" className="rounded-full bg-gradient-brand px-5 py-2 text-sm font-medium text-primary-foreground shadow-brand">{t.save}</button>
          </div>
        </form>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {teams.length === 0 && (
          <div className="md:col-span-2 rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">{t.empty}</div>
        )}
        {teams.map((tm) => (
          <Link key={tm.id} to={`/team/${tm.id}`} className="group rounded-3xl border border-border/70 p-6 transition hover:border-primary/40 hover:shadow-soft">
            <div className="font-serif text-2xl">{tm.name}</div>
            {tm.description && <p className="mt-2 text-sm text-muted-foreground">{tm.description}</p>}
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-primary">
              {t.view} <ExternalLink className="h-3.5 w-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </DashboardShell>
  );
};

export default TeamDashboard;