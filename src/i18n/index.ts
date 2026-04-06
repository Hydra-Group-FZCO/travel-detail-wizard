import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Language, Translations } from "./types";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { it } from "./it";
import { de } from "./de";
import React from "react";

export const translations: Record<Language, Translations> = { en, es, fr, it, de };

export const supportedLanguages: Language[] = ["es", "en", "fr", "it", "de"];

interface LanguageContextValue {
  lang: Language;
  setLang: (l: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "es",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem("dm_lang");
      if (stored && supportedLanguages.includes(stored as Language)) {
        return stored as Language;
      }
    } catch {}
    return "es";
  });

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    try { localStorage.setItem("dm_lang", l); } catch {}
  }, []);

  return React.createElement(
    LanguageContext.Provider,
    { value: { lang, setLang } },
    children
  );
}

export function useTranslations(): Translations {
  const { lang } = useContext(LanguageContext);
  return translations[lang];
}

/** Returns just the language code string (backward compatible) */
export function useLanguage(): Language {
  const { lang } = useContext(LanguageContext);
  return lang;
}

/** Returns { lang, setLang } for the language switcher */
export function useLanguageContext() {
  return useContext(LanguageContext);
}

export function getLanguageFromPath(pathname: string): Language {
  const segment = pathname.split("/")[1];
  if (supportedLanguages.includes(segment as Language) && segment !== "es") {
    return segment as Language;
  }
  return "es";
}

export function localizedPath(path: string, lang: Language): string {
  if (lang === "es") return path;
  return `/${lang}${path === "/" ? "" : path}`;
}

export { type Language, type Translations } from "./types";
export { languageNames, languageFlags } from "./types";
