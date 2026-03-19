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

      {/* Bókun Widget */}
      <section className="section-spacing">
        <div className="container-grid">
          <div
            className="bokunWidget rounded-xl overflow-hidden"
            data-src="https://widgets.bokun.io/online-sales/4bc9f458-4ebc-42a2-b3b4-1780533df977/product-list/105786"
            style={{ minHeight: "800px", width: "100%", background: "hsl(var(--secondary))" }}
          />
        </div>
      </section>
    </PageLayout>
  );
};

export default Experiences;
