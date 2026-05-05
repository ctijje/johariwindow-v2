import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/lib/lang";
import { toast } from "sonner";

const Logo = () => (
  <div className="relative h-10 w-10">
    <div className="absolute left-0 top-0 h-4 w-4 rounded-[5px] bg-gradient-brand" />
    <div className="absolute right-0 top-0 h-4 w-4 rounded-[5px] border-2 border-primary/70" />
    <div className="absolute bottom-0 left-0 h-4 w-4 rounded-[5px] border-2 border-primary-glow" />
    <div className="absolute bottom-0 right-0 h-4 w-4 rounded-[5px] bg-primary-glow/40" />
  </div>
);

export const DashboardShell = ({ title, children }: { title: string; children: ReactNode }) => {
  const { user, signOut } = useAuth();
  const { lang, toggle } = useLang();
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Logo />
            <span className="font-mono text-xs text-muted-foreground">{title}</span>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 font-mono text-xs uppercase hover:border-primary">
              <Globe className="h-3.5 w-3.5" /> {lang === "id" ? "ID" : "EN"}
            </button>
            <span className="hidden text-xs text-muted-foreground md:inline">{user?.email}</span>
            <button
              onClick={async () => { await signOut(); toast.success("Signed out"); nav("/"); }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs hover:border-foreground"
            >
              <LogOut className="h-3.5 w-3.5" /> {lang === "id" ? "Keluar" : "Sign out"}
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-10 md:py-12">{children}</main>
    </div>
  );
};

export default DashboardShell;