import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      {/* Disclaimer */}
      <div className="bg-trust-bar-bg text-trust-bar-fg">
        <div className="container-grid py-5">
          <p className="text-xs leading-relaxed opacity-80" style={{ maxWidth: "none" }}>
            <strong>Important:</strong> Digital Moonkey Ltd is a private service provider. We are not a government agency and are not affiliated with any embassy, consulate, or official body. Our service fees cover our personal assistance and are separate from any official government or application fees. Applicants may choose to apply directly through official government channels without using our services.
          </p>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-secondary">
        <div className="container-grid py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">DM</span>
                </div>
                <span className="font-bold text-lg text-foreground">Digital Moonkey</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                Personal assistance services for travellers — from documentation and applications to connectivity and travel preparation.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-foreground mb-4">Services</h4>
              <div className="flex flex-col gap-2.5">
                <Link to="/services#documentation" className="text-sm text-muted-foreground hover:text-primary transition-colors">Documentation</Link>
                <Link to="/services#tracking" className="text-sm text-muted-foreground hover:text-primary transition-colors">Tracking</Link>
                <Link to="/services#digital" className="text-sm text-muted-foreground hover:text-primary transition-colors">Digital Services</Link>
                <Link to="/services#corporate" className="text-sm text-muted-foreground hover:text-primary transition-colors">Corporate</Link>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-foreground mb-4">Company</h4>
              <div className="flex flex-col gap-2.5">
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
                <Link to="/legal" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                © 2026 Digital Moonkey Ltd — Registered in England & Wales
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <Link to="/legal" className="hover:text-primary transition-colors">Terms</Link>
                <Link to="/legal" className="hover:text-primary transition-colors">Privacy</Link>
                <Link to="/legal" className="hover:text-primary transition-colors">Refund Policy</Link>
                <Link to="/legal" className="hover:text-primary transition-colors">Cookies</Link>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 opacity-50">
              digitalmoonkey.travel is a private service — not a government agency.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
