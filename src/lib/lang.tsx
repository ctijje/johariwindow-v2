import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "id" | "en";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; toggle: () => void };
const LangCtx = createContext<Ctx>({ lang: "id", setLang: () => {}, toggle: () => {} });

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "id";
    return (localStorage.getItem("johari.lang") as Lang) || "id";
  });
  useEffect(() => { localStorage.setItem("johari.lang", lang); }, [lang]);
  const setLang = (l: Lang) => setLangState(l);
  const toggle = () => setLangState((p) => (p === "id" ? "en" : "id"));
  return <LangCtx.Provider value={{ lang, setLang, toggle }}>{children}</LangCtx.Provider>;
};

export const useLang = () => useContext(LangCtx);