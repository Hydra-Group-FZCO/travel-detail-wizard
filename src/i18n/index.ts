import { createContext, useContext } from "react";
import { Language, Translations } from "./types";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { it } from "./it";
import { de } from "./de";

export const translations: Record<Language, Translations> = { en, es, fr, it, de };

export const defaultLanguage: Language = "en";

export const supportedLanguages: Language[] = ["en", "es", "fr", "it", "de"];

export const LanguageContext = createContext<Language>("en");

export function useTranslations(): Translations {
  const lang = useContext(LanguageContext);
  return translations[lang];
}

export function useLanguage(): Language {
  return useContext(LanguageContext);
}

export function getLanguageFromPath(pathname: string): Language {
  const segment = pathname.split("/")[1];
  if (supportedLanguages.includes(segment as Language) && segment !== "en") {
    return segment as Language;
  }
  return "en";
}

export function localizedPath(path: string, lang: Language): string {
  if (lang === "en") return path;
  return `/${lang}${path === "/" ? "" : path}`;
}

export { type Language, type Translations } from "./types";
export { languageNames, languageFlags } from "./types";
