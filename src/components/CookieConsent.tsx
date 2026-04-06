import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type CookiePreference = "all" | "essential" | null;

const COOKIE_KEY = "dm_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) {
      setVisible(true);
    }
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
              <p className="text-sm text-foreground font-medium mb-1">Usamos cookies</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Utilizamos cookies esenciales para el funcionamiento de nuestro sitio. Con su consentimiento, también podemos usar cookies analíticas y de marketing. Lea nuestra{" "}
                <Link to="/privacidad" className="text-primary hover:underline">Política de Privacidad</Link>.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => accept("all")} className="bg-accent text-accent-foreground hover:bg-accent/90">Aceptar todas</Button>
                <Button size="sm" variant="outline" onClick={() => setShowManage(true)}>Gestionar preferencias</Button>
                <Button size="sm" variant="ghost" onClick={() => accept("essential")}>Rechazar no esenciales</Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-foreground font-medium mb-3">Preferencias de cookies</p>
              <div className="space-y-3 mb-4">
                <label className="flex items-center gap-3 text-sm">
                  <input type="checkbox" checked disabled className="accent-primary" />
                  <span><strong>Esenciales</strong> – necesarias para el funcionamiento del sitio</span>
                </label>
                <label className="flex items-center gap-3 text-sm cursor-pointer">
                  <input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} className="accent-primary" />
                  <span><strong>Analíticas</strong> – nos ayudan a mejorar el sitio</span>
                </label>
                <label className="flex items-center gap-3 text-sm cursor-pointer">
                  <input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} className="accent-primary" />
                  <span><strong>Marketing</strong> – publicidad personalizada</span>
                </label>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={savePreferences} className="bg-accent text-accent-foreground hover:bg-accent/90">Guardar preferencias</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowManage(false)}>Volver</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
