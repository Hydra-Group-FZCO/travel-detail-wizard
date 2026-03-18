import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border">
      {/* Disclaimer Band */}
      <div className="bg-disclaimer-bg text-disclaimer-fg">
        <div className="container-grid py-6">
          <p className="text-xs leading-relaxed opacity-80 max-w-none">
            <strong>Important:</strong> Digital Moonkey Ltd is a private service provider. We are not a government agency and are not affiliated with any embassy, consulate, or official body. Our service fees cover our personal assistance and are separate from any official government or application fees that may apply. Applicants may choose to apply directly through official government channels without using our services.
          </p>
        </div>
      </div>

      {/* Footer Content */}
      <div className="bg-surface-raised">
        <div className="container-grid py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <span className="font-serif text-xl text-foreground tracking-tight">
                Digital Moonkey
              </span>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-sm">
                Personal assistance services for travellers — from documentation and applications to connectivity and travel preparation.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4 font-sans">Services</h4>
              <div className="flex flex-col gap-2.5">
                <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</Link>
                <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tracking</Link>
                <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Digital Services</Link>
                <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Corporate</Link>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4 font-sans">Company</h4>
              <div className="flex flex-col gap-2.5">
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
                <Link to="/legal" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms & Conditions</Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-6 border-t border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                © 2026 Digital Moonkey Ltd — Registered in England & Wales
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <Link to="/legal" className="hover:text-foreground transition-colors">Terms & Conditions</Link>
                <Link to="/legal" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                <Link to="/legal" className="hover:text-foreground transition-colors">Refund Policy</Link>
                <Link to="/legal" className="hover:text-foreground transition-colors">Cookie Policy</Link>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3 opacity-60">
              digitalmoonkey.travel is a private service — not a government agency.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
