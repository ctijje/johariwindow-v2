import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Copy, ExternalLink, Search, Users, CheckCircle2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/lib/lang";
import DashboardShell from "@/components/DashboardShell";
import { toast } from "sonner";
import { generateCode } from "@/lib/code";
import { cn } from "@/lib/utils";

type Roster = {
  mentee_id: string;
  mentee_name: string;
  mentee_email: string | null;
  mentee_whatsapp: string | null;
  status: string;
  notes: string | null;
  window_id: string;
  code: string;
  self_done: boolean;
  peer_count: number;
  created_at: string;
};

type Filter = "all" | "invited" | "self_done" | "complete";

const CoachDashboard = () => {
  const { user } = useAuth();
  const { lang } = useLang();
  const [rows, setRows] = useState<Roster[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "" });
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const t = lang === "id" ? {
    title: "Dashboard Coach", h1: "Roster klien", lead: "Pantau status assessment dan kelola peer feedback klienmu.",
    add: "Tambah klien", empty: "Belum ada klien. Tambah klien pertamamu.",
    name: "Nama klien", email: "Email (opsional)", wa: "WhatsApp (opsional)",
    cancel: "Batal", save: "Tambahkan",
    copySelf: "Salin link self", copyPeer: "Salin link peer", view: "Buka grid",
    search: "Cari nama atau email…",
    all: "Semua", invited: "Diundang", selfDone: "Self selesai", complete: "Lengkap",
    peers: (n: number) => `${n} peer`, waitingSelf: "Menunggu self-assessment",
    selfFilled: "Self terisi", needPeers: "Butuh peer",
    statTotal: "Total klien", statSelf: "Self selesai", statComplete: "Lengkap (≥1 peer)",
  } : {
    title: "Coach Dashboard", h1: "Client roster", lead: "Track assessment status and manage peer feedback for your clients.",
    add: "Add client", empty: "No clients yet. Add your first client.",
    name: "Client name", email: "Email (optional)", wa: "WhatsApp (optional)",
    cancel: "Cancel", save: "Add",
    copySelf: "Copy self link", copyPeer: "Copy peer link", view: "Open grid",
    search: "Search name or email…",
    all: "All", invited: "Invited", selfDone: "Self done", complete: "Complete",
    peers: (n: number) => `${n} peer(s)`, waitingSelf: "Awaiting self-assessment",
    selfFilled: "Self submitted", needPeers: "Needs peers",
    statTotal: "Total clients", statSelf: "Self done", statComplete: "Complete (≥1 peer)",
  };

  const load = async () => {
    if (!user) return;
    const { data, error } = await supabase.rpc("get_coach_roster" as any);
    if (error) { toast.error(error.message); return; }
    setRows((data as Roster[]) ?? []);
  };
  useEffect(() => { load(); }, [user]);

  const stats = useMemo(() => {
    const selfDone = rows.filter((r) => r.self_done).length;
    const complete = rows.filter((r) => r.self_done && r.peer_count >= 1).length;
    return { total: rows.length, selfDone, complete };
  }, [rows]);

  const filtered = useMemo(() => rows.filter((r) => {
    if (q && !`${r.mentee_name} ${r.mentee_email ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (filter === "invited") return !r.self_done;
    if (filter === "self_done") return r.self_done && r.peer_count === 0;
    if (filter === "complete") return r.self_done && r.peer_count >= 1;
    return true;
  }), [rows, q, filter]);

  const addClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.name.trim()) return;
    setBusy(true);
    try {
      const code = generateCode();
      const { data: w, error: wErr } = await supabase
        .from("windows")
        .insert({
          name: form.name.trim(),
          email: form.email.trim() || `client-${code}@johariwindow.id`,
          whatsapp: form.whatsapp.trim() || "-",
          occupation: "-", age: null, gender: "-",
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
      toast.success(lang === "id" ? "Klien ditambahkan" : "Client added");
      setForm({ name: "", email: "", whatsapp: "" });
      setShowForm(false);
      load();
    } finally { setBusy(false); }
  };

  const selfLink = (code: string) => `${window.location.origin}/client/${code}`;
  const peerLink = (code: string) => `${window.location.origin}/peer/${code}`;
  const copy = (s: string) => { navigator.clipboard.writeText(s); toast.success(lang === "id" ? "Link disalin" : "Link copied"); };

  const StatusBadge = ({ r }: { r: Roster }) => {
    if (!r.self_done) return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-800">{t.waitingSelf}</span>;
    if (r.peer_count === 0) return <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-violet-800"><CheckCircle2 className="h-3 w-3" />{t.selfFilled} · {t.needPeers}</span>;
    return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-800"><CheckCircle2 className="h-3 w-3" />{t.peers(r.peer_count)}</span>;
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

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { label: t.statTotal, value: stats.total, icon: Users },
          { label: t.statSelf, value: stats.selfDone, icon: CheckCircle2 },
          { label: t.statComplete, value: stats.complete, icon: Send },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border/70 p-4">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <s.icon className="h-3.5 w-3.5" /> {s.label}
            </div>
            <div className="mt-1 font-serif text-3xl">{s.value}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <form onSubmit={addClient} className="mt-6 grid gap-4 rounded-3xl border border-border/70 p-6 md:grid-cols-3">
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

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search}
            className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["all", "invited", "self_done", "complete"] as Filter[]).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition",
                filter === f ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:border-foreground"
              )}>
              {f === "all" ? t.all : f === "invited" ? t.invited : f === "self_done" ? t.selfDone : t.complete}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">{t.empty}</div>
        )}
        {filtered.map((r) => (
          <div key={r.mentee_id} className="rounded-2xl border border-border/70 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="font-serif text-xl">{r.mentee_name}</div>
                  <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] tracking-widest text-muted-foreground">{r.code}</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{r.mentee_email ?? "—"}{r.mentee_whatsapp ? ` · ${r.mentee_whatsapp}` : ""}</div>
                <div className="mt-2"><StatusBadge r={r} /></div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {!r.self_done && (
                  <button onClick={() => copy(selfLink(r.code))} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs hover:border-foreground">
                    <Copy className="h-3.5 w-3.5" /> {t.copySelf}
                  </button>
                )}
                <button onClick={() => copy(peerLink(r.code))} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs hover:border-foreground">
                  <Copy className="h-3.5 w-3.5" /> {t.copyPeer}
                </button>
                <Link to={`/coach/mentee/${r.mentee_id}`} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-4 py-2 text-xs font-medium text-primary-foreground shadow-brand">
                  <ExternalLink className="h-3.5 w-3.5" /> {t.view}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
};

export default CoachDashboard;
