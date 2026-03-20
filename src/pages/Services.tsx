import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { useTranslations, useLanguage, localizedPath } from "@/i18n";

import serviceDocs from "@/assets/service-docs.jpg";
import serviceTracking from "@/assets/service-tracking.jpg";
import serviceDigital from "@/assets/service-digital.jpg";
import servicePreparation from "@/assets/service-preparation.jpg";
import serviceCorporate from "@/assets/service-corporate.jpg";

const sectionImages = [serviceDocs, serviceTracking, serviceDigital, servicePreparation, serviceCorporate];

const Services = () => {
  const t = useTranslations();
  const lang = useLanguage();

  return (
    <PageLayout>
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-secondary">
        <div className="container-grid">
          <h1 className="mb-4">{t.services.pageTitle}</h1>
          <p className="text-base md:text-lg max-w-2xl">{t.services.pageIntro}</p>
        </div>
      </section>

      {t.services.sections.map((section, index) => (
        <section key={section.id} id={section.id} className={`py-16 md:py-20 ${index % 2 !== 0 ? "bg-secondary" : ""}`}>
          <div className="container-grid">
            <div className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-10 lg:gap-16 items-center`}>
              <div className="w-full lg:w-2/5 shrink-0">
                <img src={sectionImages[index]} alt={section.title} className="w-full aspect-[4/3] object-cover rounded-xl shadow-card" loading="lazy" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h2>{section.title}</h2>
                  {section.badge && (
                    <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">{section.badge}</span>
                  )}
                </div>
                <p className="text-sm leading-relaxed mb-6">{section.intro}</p>
                {section.subtitle && <p className="text-sm font-bold text-foreground mb-3">{section.subtitle}</p>}
                {section.items && (
                  <ul className="space-y-2.5 mb-5">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.subsections?.map((sub) => (
                  <div key={sub.heading} className="mb-6">
                    <h3 className="text-base font-bold mb-3">{sub.heading}</h3>
                    <ul className="space-y-2.5">
                      {sub.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {section.closing && <p className="text-sm font-semibold text-foreground mt-4 italic">{section.closing}</p>}
                {section.note && (
                  <div className="mt-5 bg-muted border border-border rounded-lg p-4">
                    <p className="text-xs leading-relaxed text-muted-foreground">{section.note}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="section-spacing bg-trust-bar-bg">
        <div className="container-grid text-center">
          <h2 className="text-trust-bar-fg mb-4">{t.services.cta.title}</h2>
          <p className="mx-auto mb-8 text-trust-bar-fg/70 text-base md:text-lg max-w-lg" style={{ maxWidth: "none" }}>{t.services.cta.text}</p>
          <Button variant="hero" size="lg" asChild>
            <Link to={localizedPath("/contact", lang)}>{t.services.cta.button}</Link>
          </Button>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-muted border-t border-border">
        <div className="container-grid py-6">
          <p className="text-xs leading-relaxed text-muted-foreground" style={{ maxWidth: "none" }}>
            <strong>{t.services.disclaimer.split(":")[0]}:</strong>{t.services.disclaimer.split(":").slice(1).join(":")}
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Services;
