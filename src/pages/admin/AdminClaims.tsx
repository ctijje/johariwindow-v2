import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Clock, Shield, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import type { Database } from "@/integrations/supabase/types";

type Claim = Database["public"]["Tables"]["coach_payment_claims"]["Row"];

const AdminClaims = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [filter, setFilter] = useState<"pending" | "all">("pending");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = async () => {
    let q = supabase.from("coach_payment_claims").select("*").order("created_at", { ascending: false });
    if (filter === "pending") q = q.eq("status", "pending");
    const { data, error } = await q;
    if (error) { toast.error(error.message); return; }
    setClaims(data ?? []);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filter]);

  const approve = async (claim: Claim) => {
    setBusyId(claim.id);
    try {
      const { data, error } = await supabase.rpc("approve_payment_claim", {
        _claim_id: claim.id,
        _admin_note: notes[claim.id] ?? null,
      });
      if (error) { toast.error(error.message); return; }
      const row = Array.isArray(data) ? data[0] : data;
      if (row?.access_code) {
        supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "claim-approved-user",
            recipientEmail: row.recipient_email,
            idempotencyKey: `claim-approved-${claim.id}`,
            templateData: { accessCode: row.access_code, plan: row.plan },
          },
        }).catch(() => {});
      }
      toast.success("Disetujui & email terkirim");
      await load();
    } finally { setBusyId(null); }
  };

  const reject = async (claim: Claim) => {
    if (!confirm("Tolak klaim ini?")) return;
    setBusyId(claim.id);
    try {
      const { error } = await supabase.rpc("reject_payment_claim", {
        _claim_id: claim.id,
        _admin_note: notes[claim.id] ?? null,
      });
      if (error) { toast.error(error.message); return; }
      toast.success("Klaim ditolak");
      await load();
    } finally { setBusyId(null); }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl py-16">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="font-mono text-xs text-muted-foreground hover:text-foreground">← Beranda</Link>
          <button
            onClick={async () => {
              await signOut();
              toast.success("Sudah logout");
              navigate("/auth?admin=1", { replace: true });
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium hover:border-foreground"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 font-mono text-[11px] tracking-widest text-primary">
          <Shield className="h-3 w-3" /> ADMIN
        </div>
        <h1 className="mt-4 font-serif text-4xl">Klaim pembayaran</h1>

        <div className="mt-6 inline-flex rounded-full border border-border p-1">
          {(["pending", "all"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-mono uppercase tracking-widest rounded-full ${filter === f ? "bg-foreground text-background" : "text-muted-foreground"}`}>
              {f === "pending" ? "Pending" : "Semua"}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {claims.length === 0 && <div className="text-sm text-muted-foreground">Tidak ada klaim.</div>}
          {claims.map((c) => (
            <div key={c.id} className="rounded-3xl border border-border/70 bg-card p-6">
              <div className="flex items-center justify-between">
                <div className="font-serif text-xl">{c.email}</div>
                <StatusBadge status={c.status} />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div><span className="font-mono text-[11px] uppercase tracking-widest">Paket</span><br />{c.plan}</div>
                <div><span className="font-mono text-[11px] uppercase tracking-widest">Order</span><br />{c.lynk_order_ref ?? "-"}</div>
                {c.proof_url && <div className="col-span-2"><span className="font-mono text-[11px] uppercase tracking-widest">Bukti</span><br /><a href={c.proof_url} target="_blank" rel="noreferrer" className="break-all text-primary underline">{c.proof_url}</a></div>}
                {c.note && <div className="col-span-2"><span className="font-mono text-[11px] uppercase tracking-widest">Catatan user</span><br />{c.note}</div>}
                {c.access_code && <div className="col-span-2"><span className="font-mono text-[11px] uppercase tracking-widest">Code</span><br /><span className="font-mono text-primary">{c.access_code}</span></div>}
                {c.admin_note && <div className="col-span-2"><span className="font-mono text-[11px] uppercase tracking-widest">Catatan admin</span><br />{c.admin_note}</div>}
              </div>
              {c.status === "pending" && (
                <div className="mt-4 space-y-3">
                  <textarea
                    placeholder="Catatan admin (opsional)"
                    value={notes[c.id] ?? ""}
                    onChange={(e) => setNotes({ ...notes, [c.id]: e.target.value })}
                    rows={2}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => approve(c)} disabled={busyId === c.id}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2 text-sm font-medium text-primary-foreground shadow-brand disabled:opacity-50">
                      <CheckCircle2 className="h-4 w-4" /> Approve
                    </button>
                    <button onClick={() => reject(c)} disabled={busyId === c.id}
                      className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm font-medium hover:border-foreground disabled:opacity-50">
                      <XCircle className="h-4 w-4" /> Tolak
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const StatusBadge = ({ status }: { status: Claim["status"] }) => {
  const map = {
    pending: { icon: Clock, label: "PENDING", cls: "bg-amber-50 text-amber-900" },
    approved: { icon: CheckCircle2, label: "APPROVED", cls: "bg-emerald-50 text-emerald-900" },
    rejected: { icon: XCircle, label: "REJECTED", cls: "bg-rose-50 text-rose-900" },
  };
  const { icon: Icon, label, cls } = map[status];
  return <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-mono tracking-widest ${cls}`}><Icon className="h-3 w-3" />{label}</span>;
};

export default AdminClaims;