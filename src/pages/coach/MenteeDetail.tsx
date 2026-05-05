import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/lib/lang";
import DashboardShell from "@/components/DashboardShell";
import WindowView from "@/components/WindowView";
import { toast } from "sonner";

const MenteeDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { lang } = useLang();
  const [mentee, setMentee] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [goThrough, setGoThrough] = useState(false);

  useEffect(() => {
    if (!id || !user) return;
    (async () => {
      const { data } = await supabase.from("coach_mentees").select("*").eq("id", id).maybeSingle();
      if (data) { setMentee(data); setNotes(data.notes ?? ""); }
    })();
  }, [id, user]);

  const saveNotes = async () => {
    if (!mentee) return;
    const { error } = await supabase.from("coach_mentees").update({ notes }).eq("id", mentee.id);
    if (error) toast.error(error.message);
    else toast.success(lang === "id" ? "Catatan disimpan" : "Notes saved");
  };

  if (!mentee) return <DashboardShell title="Coach"><div className="text-muted-foreground">Loading…</div></DashboardShell>;

  return (
    <DashboardShell title="Coach · Mentee">
      <Link to="/coach/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {lang === "id" ? "Kembali" : "Back"}
      </Link>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">{mentee.mentee_name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{mentee.mentee_email ?? "—"}</p>
        </div>
        <button
          onClick={() => setGoThrough((g) => !g)}
          className="rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-brand"
        >
          {goThrough ? (lang === "id" ? "Tutup mode go-through" : "Exit go-through") : (lang === "id" ? "Mode go-through" : "Go-through mode")}
        </button>
      </div>

      <div className={goThrough ? "mt-8 rounded-3xl border border-primary/40 bg-card p-8" : "mt-8"}>
        {goThrough && (
          <p className="mb-4 font-mono text-[11px] tracking-widest text-primary">
            {lang === "id" ? "MODE PRESENTASI · BAGIKAN LAYAR INI" : "PRESENTATION MODE · SHARE THIS SCREEN"}
          </p>
        )}
        <WindowView windowId={mentee.window_id} />
      </div>

      <div className="mt-10 rounded-3xl border border-border/70 p-6">
        <h3 className="font-serif text-2xl">{lang === "id" ? "Catatan sesi (privat)" : "Session notes (private)"}</h3>
        <textarea
          rows={6} value={notes} onChange={(e) => setNotes(e.target.value)}
          className="mt-3 w-full rounded-xl border border-border bg-background p-4 text-sm outline-none focus:border-primary"
          placeholder={lang === "id" ? "Tulis refleksi sesi…" : "Write session reflections…"}
        />
        <div className="mt-3 flex justify-end">
          <button onClick={saveNotes} className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-brand">
            <Save className="h-4 w-4" /> {lang === "id" ? "Simpan" : "Save"}
          </button>
        </div>
      </div>
    </DashboardShell>
  );
};

export default MenteeDetail;