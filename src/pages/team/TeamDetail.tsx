import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/lib/lang";
import DashboardShell from "@/components/DashboardShell";
import WindowView from "@/components/WindowView";
import { toast } from "sonner";
import { generateCode } from "@/lib/code";
import { computeArchetypes } from "@/lib/johari";

type Member = {
  id: string; member_name: string; member_email: string | null;
  window_id: string | null;
};

const TeamDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { lang } = useLang();
  const [team, setTeam] = useState<any>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [activeMember, setActiveMember] = useState<string | null>(null);
  const [aggregate, setAggregate] = useState<Record<string, number>>({});

  const load = async () => {
    if (!id) return;
    const { data: tm } = await supabase.from("teams").select("*").eq("id", id).maybeSingle();
    setTeam(tm);
    const { data: ms } = await supabase.from("team_members").select("*").eq("team_id", id).order("created_at");
    setMembers(ms ?? []);

    // aggregate archetype across members with windows
    const totals: Record<string, number> = {};
    for (const m of ms ?? []) {
      if (!m.window_id) continue;
      const { data: w } = await supabase.rpc("get_window_full", { _id: m.window_id });
      const { data: peers } = await supabase.from("peer_responses").select("words").eq("window_id", m.window_id);
      const ar = computeArchetypes((w as any)?.[0]?.self_words ?? [], (peers ?? []).map((p: any) => p.words ?? []));
      Object.entries(ar.scores).forEach(([k, v]) => { totals[k] = (totals[k] ?? 0) + (v as number); });
    }
    setAggregate(totals);
  };
  useEffect(() => { load(); }, [id]);

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || !form.name.trim()) return;
    const code = generateCode();
    const { data: w, error: wErr } = await supabase.from("windows").insert({
      name: form.name.trim(),
      email: form.email.trim() || `member-${code}@johariwindow.id`,
      whatsapp: "-", occupation: "-", age: 0, gender: "-",
      self_words: [], code, owner_type: "team", owner_id: user.id,
    }).select("id, code").single();
    if (wErr || !w) { toast.error(wErr?.message ?? "Failed"); return; }
    const { error } = await supabase.from("team_members").insert({
      team_id: id, window_id: w.id, member_name: form.name.trim(), member_email: form.email.trim() || null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success(lang === "id" ? "Anggota ditambahkan" : "Member added");
    setForm({ name: "", email: "" }); setShowForm(false); load();
  };

  const copyLinkFor = async (windowId: string | null) => {
    if (!windowId) return;
    const { data } = await supabase.rpc("get_window_full", { _id: windowId });
    const code = (data as any)?.[0]?.code;
    if (code) {
      navigator.clipboard.writeText(`${window.location.origin}/peer/${code}`);
      toast.success(lang === "id" ? "Link disalin" : "Link copied");
    }
  };

  if (!team) return <DashboardShell title="Team"><div className="text-muted-foreground">Loading…</div></DashboardShell>;

  const sortedAgg = Object.entries(aggregate).sort((a, b) => b[1] - a[1]);
  const max = sortedAgg[0]?.[1] ?? 1;

  return (
    <DashboardShell title={`Team · ${team.name}`}>
      <Link to="/team/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {lang === "id" ? "Kembali" : "Back"}
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">{team.name}</h1>
          {team.description && <p className="mt-2 text-muted-foreground">{team.description}</p>}
        </div>
        <button onClick={() => setShowForm((s) => !s)} className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-brand">
          <Plus className="h-4 w-4" /> {lang === "id" ? "Tambah anggota" : "Add member"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addMember} className="mt-6 grid gap-3 rounded-3xl border border-border/70 p-6 md:grid-cols-2">
          <input required placeholder={lang === "id" ? "Nama" : "Name"} value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          <input type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="rounded-full bg-gradient-brand px-5 py-2 text-sm font-medium text-primary-foreground shadow-brand">
              {lang === "id" ? "Simpan" : "Save"}
            </button>
          </div>
        </form>
      )}

      {sortedAgg.length > 0 && (
        <div className="mt-8 rounded-3xl border border-border/70 p-6">
          <h3 className="font-serif text-2xl">{lang === "id" ? "Distribusi arketipe tim" : "Team archetype distribution"}</h3>
          <div className="mt-4 space-y-2">
            {sortedAgg.map(([k, v]) => (
              <div key={k} className="flex items-center gap-3">
                <div className="w-28 text-xs uppercase text-muted-foreground">{k}</div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-accent">
                  <div className="h-full bg-gradient-brand" style={{ width: `${(v / max) * 100}%` }} />
                </div>
                <div className="w-10 text-right font-mono text-xs">{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 space-y-3">
        <h3 className="font-serif text-2xl">{lang === "id" ? "Anggota" : "Members"}</h3>
        {members.length === 0 && <div className="rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">{lang === "id" ? "Belum ada anggota." : "No members yet."}</div>}
        {members.map((m) => (
          <div key={m.id} className="rounded-2xl border border-border/70 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-serif text-xl">{m.member_name}</div>
                <div className="text-xs text-muted-foreground">{m.member_email ?? "—"}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => copyLinkFor(m.window_id)} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs hover:border-foreground">
                  <Copy className="h-3.5 w-3.5" /> {lang === "id" ? "Salin link" : "Copy link"}
                </button>
                <button onClick={() => setActiveMember(activeMember === m.id ? null : m.id)} className="rounded-full bg-gradient-brand px-4 py-2 text-xs font-medium text-primary-foreground shadow-brand">
                  {activeMember === m.id ? (lang === "id" ? "Tutup" : "Close") : (lang === "id" ? "Lihat profil" : "View profile")}
                </button>
              </div>
            </div>
            {activeMember === m.id && m.window_id && (
              <div className="mt-5"><WindowView windowId={m.window_id} /></div>
            )}
          </div>
        ))}
      </div>
    </DashboardShell>
  );
};

export default TeamDetail;