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
              <p className="text-sm text-foreground font-medium mb-1">We use cookies</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                We use essential cookies to make our site work. With your consent, we may also use analytics and marketing cookies. Read our{" "}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => accept("all")}>Accept All</Button>
                <Button size="sm" variant="outline" onClick={() => setShowManage(true)}>Manage Preferences</Button>
                <Button size="sm" variant="ghost" onClick={() => accept("essential")}>Reject Non-Essential</Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-foreground font-medium mb-3">Cookie Preferences</p>
              <div className="space-y-3 mb-4">
                <label className="flex items-center gap-3 text-sm">
                  <input type="checkbox" checked disabled className="accent-primary" />
                  <span><strong>Essential</strong> — required for the website to function</span>
                </label>
                <label className="flex items-center gap-3 text-sm cursor-pointer">
                  <input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} className="accent-primary" />
                  <span><strong>Analytics</strong> — help us understand how visitors use our site</span>
                </label>
                <label className="flex items-center gap-3 text-sm cursor-pointer">
                  <input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} className="accent-primary" />
                  <span><strong>Marketing</strong> — used for affiliate tracking</span>
                </label>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={savePreferences}>Save Preferences</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowManage(false)}>Back</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
