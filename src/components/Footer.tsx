import { Link } from "react-router-dom";
import Logo from "./Logo";

const ventures = [
  { name: "MoonCollect", url: "https://mooncollect.com" },
  { name: "Escudo Fiscal", url: "https://www.escudofiscal.es" },
  { name: "GPT Hydra", url: "https://gpthydra.com" },
  { name: "Taste2Home", url: "https://taste2home.com" },
  { name: "Britania Books", url: "https://britaniabooks.com" },
  { name: "Sterling Firm", url: "https://sterlingfirm.com" },
  { name: "eVisa Apply", url: "https://evisaapply.com" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container-grid py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Logo size="sm" variant="icon" showText textClassName="text-foreground" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-4">
              A technology company creating innovative solutions in software development, artificial intelligence, digital marketing, and cybersecurity.
            </p>
            <div className="flex gap-3 text-muted-foreground">
              <a href="mailto:hello@digitalmoonkey.travel" className="text-xs hover:text-primary transition-colors">hello@digitalmoonkey.travel</a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold mb-4 text-foreground">Company</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link to="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">Services</Link>
              <Link to="/ventures" className="text-sm text-muted-foreground hover:text-primary transition-colors">Ventures</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>

          {/* Ventures */}
          <div>
            <h4 className="text-sm font-bold mb-4 text-foreground">Ventures</h4>
            <div className="flex flex-col gap-2.5">
              {ventures.map((v) => (
                <a key={v.name} href={v.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {v.name}
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold mb-4 text-foreground">Legal</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground font-semibold">
              © 2024–2026 Digital Moonkey Ltd. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Company No. 15716386 — Registered in England and Wales
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
