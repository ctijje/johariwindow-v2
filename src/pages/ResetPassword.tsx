import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ResetPassword = () => {
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Supabase puts a recovery session in the URL hash; getSession picks it up
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error("Minimal 8 karakter"); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password berhasil diubah");
    nav("/auth", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-md py-12">
        <Link to="/auth" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
        <h1 className="mt-8 font-serif text-4xl">Reset password</h1>
        {!ready ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Buka link reset dari email kamu untuk melanjutkan. Jika sudah, tunggu sebentar…
          </p>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-xs text-muted-foreground">Password baru</span>
              <input type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            </label>
            <button disabled={busy} type="submit" className="w-full rounded-full bg-gradient-brand px-6 py-3 font-medium text-primary-foreground shadow-brand disabled:opacity-60">
              Simpan password baru
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;