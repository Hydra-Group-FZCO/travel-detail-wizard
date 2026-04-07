import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const COOKIE_KEY = "dm_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ essential: true, analytics: true, marketing: true }));
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ essential: true, analytics: false, marketing: false }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 glass-card rounded-2xl p-5 animate-fade-up">
      <p className="text-sm text-muted-foreground mb-4">
        We use cookies to enhance your browsing experience. By continuing to use this site, you agree to our{" "}
        <Link to="/cookies" className="text-primary hover:underline">Cookie Policy</Link>.
      </p>
      <div className="flex gap-2">
        <Button size="sm" onClick={accept} className="rounded-full bg-primary text-primary-foreground hover:opacity-90 flex-1">
          Accept
        </Button>
        <Button size="sm" variant="outline" onClick={decline} className="rounded-full flex-1">
          Decline
        </Button>
      </div>
    </div>
  );
};

export default CookieConsent;
