import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

const Logo = () => (
  <div className="relative h-10 w-10">
    <div className="absolute left-0 top-0 h-4 w-4 rounded-[5px] bg-gradient-brand" />
    <div className="absolute right-0 top-0 h-4 w-4 rounded-[5px] border-2 border-primary/70" />
    <div className="absolute bottom-0 left-0 h-4 w-4 rounded-[5px] border-2 border-primary-glow" />
    <div className="absolute bottom-0 right-0 h-4 w-4 rounded-[5px] bg-primary-glow/40" />
  </div>
);

const COPY = {
  id: {
    tagline: "Talent discovery tool berbasis framework Johari Window.",
    product: "PRODUK",
    resources: "SUMBER",
    company: "PERUSAHAAN",
    links: {
      product: [
        { label: "Cara Kerja", href: "/#how" },
        { label: "Untuk Coach", href: "/coach" },
        { label: "Harga", href: "/pricing" },
      ],
      resources: [
        { label: "Sains di Baliknya", href: "/science" },
        { label: "Blog", href: "#" },
      ],
      company: ["Tentang", "Privasi", "Syarat", "Kontak"],
    },
  },
  en: {
    tagline: "Talent discovery tool based on the Johari Window framework.",
    product: "PRODUCT",
    resources: "RESOURCES",
    company: "COMPANY",
    links: {
      product: [
        { label: "How it works", href: "/#how" },
        { label: "For Coaches", href: "/coach" },
        { label: "Pricing", href: "/pricing" },
      ],
      resources: [
        { label: "The science", href: "/science" },
        { label: "Blog", href: "#" },
      ],
      company: ["About", "Privacy", "Terms", "Contact"],
    },
  },
} as const;

export const Footer = () => {
  const { lang } = useLang();
  const c = COPY[lang];
  return (
    <footer className="border-t border-border/70">
      <div className="container mx-auto py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">{c.tagline}</p>
          </div>
          {([
            ["product", c.links.product as readonly { label: string; href: string }[]],
            ["resources", c.links.resources as readonly { label: string; href: string }[]],
            ["company", c.links.company as readonly string[]],
          ] as const).map(([key, links], idx) => (
            <div key={key} className={cn("md:col-span-2", idx === 0 && "md:col-start-7")}>
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {c[key as "product" | "resources" | "company"]}
              </div>
              <ul className="mt-5 space-y-3">
                {(links as any[]).map((l) => {
                  const label = typeof l === "string" ? l : l.label;
                  const href = typeof l === "string" ? "#" : l.href;
                  return (
                    <li key={label}><a href={href} className="text-sm transition hover:text-primary">{label}</a></li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border/70 pt-8 md:flex-row md:items-center">
          <p className="font-mono text-xs text-muted-foreground">© 2026 Johari Window · A RANCA.id Product</p>
          <p className="font-mono text-xs text-muted-foreground">johariwindow.id</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;