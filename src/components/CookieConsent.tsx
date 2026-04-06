import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslations } from "@/i18n";

type CookiePreference = "all" | "essential" | null;

const COOKIE_KEY = "dm_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = (pref: CookiePreference) => {
    if (pref === "all") {
      localStorage.setItem(COOKIE_KEY, JSON.stringify({ essential: true, analytics: true, marketing: true }));
    } else {
      localStorage.setItem(COOKIE_KEY, JSON.stringify({ essential: true, analytics: false, marketing: false }));
    }
    setVisible(false);
  };

  const savePreferences = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ essential: true, analytics, marketing }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-fade-in">
      <div className="container-grid">
        <div className="bg-card border border-border rounded-xl shadow-elevated p-5 max-w-2xl">
          {!showManage ? (
            <>
              <p className="text-sm text-foreground font-medium mb-1">{t.cookie.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                {t.cookie.desc}{" "}
                <Link to="/privacidad" className="text-primary hover:underline">{t.footer.privacy}</Link>.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => accept("all")} className="bg-accent text-accent-foreground hover:bg-accent/90">{t.cookie.acceptAll}</Button>
                <Button size="sm" variant="outline" onClick={() => setShowManage(true)}>{t.cookie.manage}</Button>
                <Button size="sm" variant="ghost" onClick={() => accept("essential")}>{t.cookie.reject}</Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-foreground font-medium mb-3">{t.cookie.prefsTitle}</p>
              <div className="space-y-3 mb-4">
                <label className="flex items-center gap-3 text-sm">
                  <input type="checkbox" checked disabled className="accent-primary" />
                  <span><strong>{t.cookie.essential}</strong> – {t.cookie.essentialDesc}</span>
                </label>
                <label className="flex items-center gap-3 text-sm cursor-pointer">
                  <input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} className="accent-primary" />
                  <span><strong>{t.cookie.analytics}</strong> – {t.cookie.analyticsDesc}</span>
                </label>
                <label className="flex items-center gap-3 text-sm cursor-pointer">
                  <input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} className="accent-primary" />
                  <span><strong>{t.cookie.marketing}</strong> – {t.cookie.marketingDesc}</span>
                </label>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={savePreferences} className="bg-accent text-accent-foreground hover:bg-accent/90">{t.cookie.save}</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowManage(false)}>{t.cookie.back}</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
