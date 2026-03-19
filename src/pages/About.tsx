import PageLayout from "@/components/PageLayout";
import { useTranslations } from "@/i18n";

const About = () => {
  const t = useTranslations();

  return (
    <PageLayout>
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-secondary">
        <div className="container-grid">
          <h1 className="mb-4">{t.about.title}</h1>
          <p className="text-base md:text-lg max-w-2xl">{t.about.subtitle}</p>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-grid">
          <div className="max-w-3xl">
            <p className="text-base leading-relaxed mb-6">{t.about.introText}</p>

            <h2 className="mt-14 mb-5">{t.about.whatWeDoTitle}</h2>
            <p className="text-sm leading-relaxed mb-6">{t.about.whatWeDoText}</p>

            <h2 className="mt-14 mb-5">{t.about.howWeWorkTitle}</h2>
            <ul className="space-y-3">
              {t.about.howWeWorkItems.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-16 bg-secondary rounded-xl p-8">
              <h3 className="text-xl font-bold mb-5">{t.about.companyTitle}</h3>
              <div className="space-y-2 text-sm">
                <p className="font-bold text-foreground">{t.about.companyName}</p>
                <p className="text-muted-foreground">{t.about.companyRegistered}</p>
                <p className="text-muted-foreground">{t.about.companyDirector}</p>
                <p className="text-muted-foreground">{t.about.companyWebsite}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
