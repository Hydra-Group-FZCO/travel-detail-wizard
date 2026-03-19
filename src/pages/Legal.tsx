import PageLayout from "@/components/PageLayout";
import { useTranslations } from "@/i18n";

const Legal = () => {
  const t = useTranslations();

  return (
    <PageLayout>
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-secondary">
        <div className="container-grid">
          <h1>{t.legal.title}</h1>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-grid">
          <div className="max-w-3xl space-y-6">
            {t.legal.paragraphs.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed">{p}</p>
            ))}

            <div className="mt-12 bg-secondary rounded-xl p-8">
              <h3 className="text-xl font-bold mb-5">{t.legal.companyTitle}</h3>
              <div className="space-y-2 text-sm">
                <p className="font-bold text-foreground">{t.legal.companyName}</p>
                <p className="text-muted-foreground">{t.legal.companyRegistered}</p>
                <p className="text-muted-foreground">{t.legal.companyDirector}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Legal;
