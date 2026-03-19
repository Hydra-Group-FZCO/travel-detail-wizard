import { Link } from "react-router-dom";
import { useTranslations, useLanguage, localizedPath } from "@/i18n";
import Logo from "@/components/Logo";

const Footer = () => {
  const t = useTranslations();
  const lang = useLanguage();

  return (
    <footer>
      {/* Disclaimer */}
      <div className="bg-trust-bar-bg text-trust-bar-fg">
        <div className="container-grid py-5">
          <p className="text-xs leading-relaxed opacity-80" style={{ maxWidth: "none" }}>
            <strong>{t.footer.disclaimer.split(":")[0]}:</strong>{t.footer.disclaimer.split(":").slice(1).join(":")}
          </p>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-secondary">
        <div className="container-grid py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <div className="mb-4">
                <Logo />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                {t.footer.description}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-foreground mb-4">{t.footer.servicesTitle}</h4>
              <div className="flex flex-col gap-2.5">
                {t.footer.serviceLinks.map((link) => (
                  <Link
                    key={link.hash}
                    to={`${localizedPath("/services", lang)}#${link.hash}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-foreground mb-4">{t.footer.companyTitle}</h4>
              <div className="flex flex-col gap-2.5">
                {t.footer.companyLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={localizedPath(link.to, lang)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to={localizedPath("/experiences", lang)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.nav.experiences}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">{t.footer.copyright}</p>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                {t.footer.bottomLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={localizedPath(link.to, lang)}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 opacity-50">
              {t.footer.bottomNote}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
