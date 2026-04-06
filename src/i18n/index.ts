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

export function useLanguage() {
  return useContext(LanguageContext);
}

export { type Language, type Translations } from "./types";
export { languageNames, languageFlags } from "./types";
