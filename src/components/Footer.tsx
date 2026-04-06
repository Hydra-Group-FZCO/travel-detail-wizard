import { Link } from "react-router-dom";
import { useTranslations } from "@/i18n";

const Footer = () => {
  const t = useTranslations();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-grid py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🐒</span>
              <span className="font-bold text-lg">Digital Moonkey</span>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-sm">{t.footer.desc}</p>
            <div className="mt-4 text-xs text-primary-foreground/50 space-y-0.5">
              <p>{t.footer.reg}</p>
              <p>{t.footer.addr}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 text-primary-foreground">{t.footer.companyTitle}</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/sobre-nosotros" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t.footer.aboutUs}</Link>
              <Link to="/contacto" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t.footer.contactUs}</Link>
              <Link to="/ayuda" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t.footer.helpCenter}</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 text-primary-foreground">{t.footer.servicesTitle}</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/visados" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t.footer.eVisas}</Link>
              <span className="text-sm text-primary-foreground/70">{t.footer.eta}</span>
              <span className="text-sm text-primary-foreground/70">{t.footer.photos}</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 text-primary-foreground">{t.footer.legalTitle}</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/condiciones" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t.footer.terms}</Link>
              <Link to="/privacidad" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t.footer.privacy}</Link>
              <Link to="/cookies" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t.footer.cookies}</Link>
              <Link to="/reembolsos" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t.footer.refund}</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary-foreground/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-primary-foreground/60 font-semibold">{t.footer.copyright}</p>
            <div className="flex items-center gap-3 text-xs text-primary-foreground/50">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>PayPal</span>
              <span>Apple Pay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
