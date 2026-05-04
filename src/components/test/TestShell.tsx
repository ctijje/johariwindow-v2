import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
import { useLang } from "@/lib/lang";

const Logo = () => (
  <div className="relative h-10 w-10">
    <div className="absolute left-0 top-0 h-4 w-4 rounded-[5px] bg-gradient-brand" />
    <div className="absolute right-0 top-0 h-4 w-4 rounded-[5px] border-2 border-primary/70" />
    <div className="absolute bottom-0 left-0 h-4 w-4 rounded-[5px] border-2 border-primary-glow" />
    <div className="absolute bottom-0 right-0 h-4 w-4 rounded-[5px] bg-primary-glow/40" />
  </div>
);

export const TestShell = ({ children }: { children: ReactNode }) => {
  const { lang, toggle } = useLang();
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60">
        <div className="container mx-auto flex h-20 items-center justify-between">
          <Link to="/"><Logo /></Link>
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 font-mono text-xs uppercase transition hover:border-primary hover:text-primary"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang.toUpperCase()}
          </button>
        </div>
      </header>
      <main className="container mx-auto max-w-3xl py-12 md:py-16">{children}</main>
    </div>
  );
};

export const StepKicker = ({ step, total = 5, label }: { step: number; total?: number; label: string }) => {
  const { lang } = useLang();
  const word = lang === "id" ? "LANGKAH" : "STEP";
  const of = lang === "id" ? "DARI" : "OF";
  return (
    <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
      {word} {step} {of} {total} · {label}
    </div>
  );
};