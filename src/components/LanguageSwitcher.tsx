import { useLanguage, supportedLanguages } from "@/i18n";
import { languageFlags, languageNames, type Language } from "@/i18n/types";
import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";

interface Props {
  variant?: "light" | "dark";
}

const LanguageSwitcher = ({ variant = "dark" }: Props) => {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const textClass = variant === "light"
    ? "text-primary-foreground/80 hover:text-primary-foreground"
    : "text-muted-foreground hover:text-foreground";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium transition-colors ${textClass}`}
      >
        <span className="text-base">{languageFlags[lang]}</span>
        <Globe className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-elevated py-1 min-w-[140px] z-50 animate-fade-in">
          {supportedLanguages.map((l) => (
            <button
              key={l}
              onClick={() => { setLang(l); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                l === lang ? "bg-primary/10 text-foreground font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="text-base">{languageFlags[l]}</span>
              <span>{languageNames[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
