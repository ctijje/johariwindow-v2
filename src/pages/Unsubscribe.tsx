import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, setState] = useState<"loading" | "valid" | "already" | "invalid" | "done" | "error">("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) { setState("invalid"); return; }
    (async () => {
      try {
        const r = await fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`, {
          headers: { apikey: SUPABASE_ANON },
        });
        const j = await r.json();
        if (j.valid) setState("valid");
        else if (j.reason === "already_unsubscribed") setState("already");
        else setState("invalid");
      } catch { setState("error"); }
    })();
  }, [token]);

  const confirm = async () => {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", { body: { token } });
      if (error) { setState("error"); return; }
      if ((data as any)?.success) setState("done");
      else if ((data as any)?.reason === "already_unsubscribed") setState("already");
      else setState("error");
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-xl py-24 text-center">
        <h1 className="font-serif text-4xl">Berhenti berlangganan email</h1>
        <div className="mt-8 rounded-3xl border border-border/70 bg-card p-8">
          {state === "loading" && <p className="text-muted-foreground">Memeriksa…</p>}
          {state === "invalid" && <p className="text-muted-foreground">Tautan tidak valid atau sudah kedaluwarsa.</p>}
          {state === "error" && <p className="text-destructive">Terjadi kesalahan. Coba lagi sebentar.</p>}
          {state === "already" && <p className="text-muted-foreground">Email kamu sudah berhenti berlangganan.</p>}
          {state === "done" && <p className="text-emerald-700">Selesai. Kamu tidak akan menerima email lagi dari johariwindow.id.</p>}
          {state === "valid" && (
            <>
              <p className="text-muted-foreground">Klik tombol di bawah untuk mengonfirmasi.</p>
              <button onClick={confirm} disabled={busy}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-medium text-primary-foreground shadow-brand disabled:opacity-50">
                Konfirmasi berhenti berlangganan
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Unsubscribe;