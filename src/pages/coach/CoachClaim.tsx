import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock, XCircle, KeyRound, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import Footer from "@/components/Footer";

type Claim = {
  id: string;
  email: string;
  plan: "starter" | "growth";
  proof_url: string | null;
  note: string | null;
  status: "pending" | "approved" | "rejected";
  admin_note: string | null;
  access_code: string | null;
  created_at: string;
};

const CoachClaim = () => {
  const { session, user, loading } = useAuth();
  const navigate = useNavigate();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [busy, setBusy] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    email: "",
    plan: "starter" as "starter" | "growth",
    note: "",
  });

  const loadClaims = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("coach_payment_claims" as any)
      .select("*")
      .order("created_at", { ascending: false });
    setClaims(((data ?? []) as unknown) as Claim[]);
  };

  useEffect(() => {
    if (user) {
      setForm((f) => ({ ...f, email: f.email || user.email || "" }));
      loadClaims();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { navigate("/auth"); return; }
    if (!form.email.trim()) {
      toast.error("Email wajib diisi");
      return;
    }
    if (!proofFile) {
      toast.error("Upload screenshot bukti bayar dulu");
      return;
    }
    if (proofFile.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }
    if (!proofFile.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }
    setBusy(true);
    try {
      const ext = proofFile.name.split(".").pop()?.toLowerCase() || "png";
      const path = `${user!.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("payment-proofs")
        .upload(path, proofFile, { contentType: proofFile.type, upsert: false });
      if (upErr) { toast.error("Upload gagal: " + upErr.message); return; }

      const { data, error } = await supabase
        .from("coach_payment_claims" as any)
        .insert({
          user_id: user!.id,
          email: form.email.trim(),
          plan: form.plan,
          proof_url: path,
          note: form.note.trim() || null,
        })
        .select()
        .single();
      if (error) { toast.error(error.message); return; }
      const claim = data as any;
      // Notify admin (best-effort)
      supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "new-claim-admin",
          recipientEmail: "admin.johariwindow.id@gmail.com",
          idempotencyKey: `new-claim-${claim.id}`,
          templateData: {
            email: claim.email,
            plan: claim.plan,
            proofUrl: claim.proof_url,
            note: claim.note,
            claimId: claim.id,
          },
        },
      }).catch(() => {});
      toast.success("Klaim terkirim. Tunggu konfirmasi dari admin.");
      setForm((f) => ({ ...f, note: "" }));
      setProofFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadClaims();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl py-20 md:py-28">
        <Link to="/pricing" className="font-mono text-xs text-muted-foreground hover:text-foreground">← Pricing</Link>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 font-mono text-[11px] tracking-widest text-primary">
          <KeyRound className="h-3 w-3" /> KLAIM AKSES COACH
        </div>
        <h1 className="mt-6 font-serif text-4xl md:text-5xl leading-[1.05]">Sudah bayar di lynk.id?</h1>
        <p className="mt-4 text-muted-foreground">
          Isi form di bawah untuk klaim akses coach. Setelah admin meng-approve, kamu akan menerima email berisi access code.
        </p>

        {!loading && !session && (
          <div className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Kamu perlu <Link to="/auth" className="font-medium underline">masuk / daftar</Link> dulu untuk klaim.
          </div>
        )}

        {claims.length > 0 && (
          <div className="mt-8 space-y-3">
            {claims.map((c) => (
              <ClaimCard key={c.id} claim={c} />
            ))}
          </div>
        )}

        <form onSubmit={submit} className="mt-10 space-y-4 rounded-3xl border border-border/70 bg-card p-7">
          <h2 className="font-serif text-2xl">Klaim baru</h2>
          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Paket</label>
            <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value as any })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary">
              <option value="starter">Coach Starter (Rp 99.000)</option>
              <option value="growth">Coach Growth (Rp 199.000)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Screenshot bukti bayar</label>
            <div className="mt-1 flex items-center gap-3 rounded-xl border border-dashed border-border bg-background px-4 py-3">
              <Upload className="h-4 w-4 text-muted-foreground" />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary hover:file:bg-accent/80"
              />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">JPG/PNG, maksimal 5MB</p>
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Catatan (opsional)</label>
            <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
              rows={3}
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" />
          </div>
          <button type="submit" disabled={busy || !session}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-medium text-primary-foreground shadow-brand disabled:opacity-50">
            Kirim klaim <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

const ClaimCard = ({ claim }: { claim: Claim }) => {
  const navigate = useNavigate();
  if (claim.status === "approved" && claim.access_code) {
    return (
      <div className="rounded-3xl border border-primary/40 bg-gradient-brand-soft p-6">
        <div className="flex items-center gap-2 text-primary">
          <CheckCircle2 className="h-5 w-5" /> <span className="font-mono text-xs uppercase tracking-widest">DISETUJUI</span>
        </div>
        <div className="mt-3 text-sm text-muted-foreground">Paket: <strong className="text-foreground">{claim.plan}</strong></div>
        <div className="mt-4 rounded-2xl bg-card p-5 text-center">
          <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Access code</div>
          <div className="mt-2 font-mono text-2xl tracking-widest text-primary">{claim.access_code}</div>
        </div>
        <button onClick={() => navigate(`/coach/redeem?code=${encodeURIComponent(claim.access_code!)}`)}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-medium text-primary-foreground shadow-brand">
          Aktifkan sekarang <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }
  if (claim.status === "rejected") {
    return (
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 text-destructive">
          <XCircle className="h-5 w-5" /> <span className="font-mono text-xs uppercase tracking-widest">DITOLAK</span>
        </div>
        {claim.admin_note && <div className="mt-2 text-sm">Alasan: {claim.admin_note}</div>}
      </div>
    );
  }
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 text-amber-700">
        <Clock className="h-5 w-5" /> <span className="font-mono text-xs uppercase tracking-widest">MENUNGGU APPROVAL</span>
      </div>
      <div className="mt-2 text-sm text-muted-foreground">Paket: {claim.plan}</div>
    </div>
  );
};

export default CoachClaim;