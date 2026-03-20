import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ChevronDown, User } from "lucide-react";
import { useTranslations, useLanguage, localizedPath, languageNames, languageFlags, supportedLanguages, type Language } from "@/i18n";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/Logo";

const Header = () => {
  const t = useTranslations();
  const lang = useLanguage();
  const { user, role, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const isHome = location.pathname === localizedPath("/", lang) || location.pathname === "/";

  const navLinks = [
    { to: localizedPath("/", lang), label: t.nav.home },
    { to: localizedPath("/experiences", lang), label: t.nav.experiences },
    { to: localizedPath("/esims", lang), label: "eSIM" },
    { to: localizedPath("/itinerary-generator", lang), label: "✨ AI Planner" },
    { to: localizedPath("/travel-guides", lang), label: "📖 Guides" },
    { to: localizedPath("/services", lang), label: t.nav.services },
    { to: localizedPath("/pricing", lang), label: "Pricing" },
  ];

  const isActive = (linkTo: string) => location.pathname === linkTo;

  return (
    <header className={`absolute top-0 left-0 right-0 z-50 ${isHome ? "" : "bg-background border-b border-border"}`}>
      <nav className="container-grid">
          <div className="flex items-center justify-between h-16 md:h-20">
          <Link to={localizedPath("/", lang)} className={`flex items-center gap-2.5 ${isHome ? "opacity-0 pointer-events-none" : ""}`}>
            <Logo textClassName={isHome ? "text-primary-foreground" : "text-foreground"} />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  isActive(link.to)
                    ? isHome ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-foreground"
                    : isHome ? "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Language Selector */}
            <div className="relative ml-2">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  isHome ? "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span>{languageFlags[lang]}</span>
                <span className="hidden lg:inline">{languageNames[lang]}</span>
                <ChevronDown size={14} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-elevated p-1.5 min-w-[160px] animate-fade-in z-50">
                  {supportedLanguages.map((l) => (
                    <Link
                      key={l}
                      to={localizedPath(getCurrentPagePath(lang), l)}
                      onClick={() => setLangOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        lang === l ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span>{languageFlags[l]}</span>
                      <span>{languageNames[l]}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Button */}
            {loading ? (
              <div className="w-24 h-9 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <Link
                to={role === "admin" ? "/admin" : "/dashboard"}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isHome ? "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30" : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                <User size={14} />
                {role === "admin" ? "Admin Panel" : "Dashboard"}
              </Link>
            ) : (
              <Link
                to="/login"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isHome ? "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30" : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                Sign In
              </Link>
            )}
          </div>
          {/* Mobile Toggle */}
          <div className="flex items-center gap-1 md:hidden">
            {/* Mobile Language */}
            <div className="relative">
              <button
                className={`p-2 rounded-lg ${isHome ? "text-primary-foreground" : "text-foreground"}`}
                onClick={() => setLangOpen(!langOpen)}
              >
                <span className="text-base">{languageFlags[lang]}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-elevated p-1.5 min-w-[150px] animate-fade-in z-50">
                  {supportedLanguages.map((l) => (
                    <Link
                      key={l}
                      to={localizedPath(getCurrentPagePath(lang), l)}
                      onClick={() => setLangOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        lang === l ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span>{languageFlags[l]}</span>
                      <span>{languageNames[l]}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <button
              className={`p-2 rounded-lg ${isHome ? "text-primary-foreground" : "text-foreground"}`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="bg-card rounded-xl border border-border shadow-elevated p-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

/** Extract the current page path (without lang prefix) */
function getCurrentPagePath(currentLang: Language): string {
  const path = location.pathname;
  if (currentLang === "en") return path;
  const prefix = `/${currentLang}`;
  if (path.startsWith(prefix)) {
    const rest = path.slice(prefix.length);
    return rest || "/";
  }
  return path;
}

export default Header;
