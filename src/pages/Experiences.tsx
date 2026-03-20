import { useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { useTranslations } from "@/i18n";

const Experiences = () => {
  const t = useTranslations();

  useEffect(() => {
    // Re-trigger Bókun widget loader after SPA navigation
    if ((window as any).BokunWidgetsLoader) {
      (window as any).BokunWidgetsLoader.init();
    }
  }, []);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-trust-bar-bg pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="container-grid text-center">
          <h1 className="text-primary-foreground mb-4">{t.experiences.heroTitle}</h1>
          <p className="text-primary-foreground/70 text-base md:text-lg max-w-2xl mx-auto">
            {t.experiences.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Merchant of Record Notice */}
      <section className="bg-secondary border-b border-border">
        <div className="container-grid py-5 space-y-2">
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            All experience bookings are processed by Digital Moonkey Limited. Experiences are delivered and fulfilled by independent local operators and partners. Digital Moonkey acts as the booking platform — the experience itself is provided by the operator listed on each experience page. You will be charged by Digital Moonkey Limited. For any queries contact{" "}
            <a href="mailto:hello@digitalmoonkey.travel" className="text-primary hover:underline">hello@digitalmoonkey.travel</a>
          </p>
          <p className="text-xs text-muted-foreground text-center leading-relaxed opacity-80">
            {t.experiences.cancellationNote}
          </p>
        </div>
      </section>

      {/* Bókun Widget */}
      <section className="section-spacing">
        <div className="container-grid">
          <div
            className="bokunWidget rounded-xl overflow-hidden"
            data-src="https://widgets.bokun.io/online-sales/4bc9f458-4ebc-42a2-b3b4-1780533df977/product-list/105783"
            style={{ minHeight: "800px", width: "100%", background: "hsl(var(--secondary))" }}
          />
        </div>
      </section>
    </PageLayout>
  );
};

export default Experiences;
