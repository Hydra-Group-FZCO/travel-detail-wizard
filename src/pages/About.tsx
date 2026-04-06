import PageLayout from "@/components/PageLayout";
import { ShieldCheck, Globe, Headphones, Zap } from "lucide-react";
import { useTranslations } from "@/i18n";

const About = () => {
  const t = useTranslations();
  const icons = [ShieldCheck, Globe, Zap, Headphones];

  return (
    <PageLayout>
      <section className="section-spacing">
        <div className="container-grid max-w-3xl">
          <h1 className="mb-6">{t.about.title}</h1>
          <p className="text-base md:text-lg mb-6 leading-relaxed">{t.about.p1}</p>
          <p className="text-base md:text-lg leading-relaxed">{t.about.p2}</p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container-grid">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {t.about.highlights.map((h, i) => {
              const Icon = icons[i] || Globe;
              return (
                <div key={h.title} className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm font-bold mb-1">{h.title}</h3>
                  <p className="text-xs text-muted-foreground">{h.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-secondary">
        <div className="container-grid max-w-3xl text-center">
          <h2 className="mb-6">{t.about.officeTitle}</h2>
          <div className="bg-card border border-border rounded-xl p-8 inline-block text-left">
            <p className="text-sm font-bold text-foreground mb-2">Digital Moonkey Ltd</p>
            <p className="text-sm text-muted-foreground">71-75 Shelton Street, Covent Garden</p>
            <p className="text-sm text-muted-foreground">London, WC2H 9JQ, United Kingdom</p>
            <p className="text-sm text-muted-foreground mt-3">📞 +376 338 383</p>
            <p className="text-sm text-muted-foreground">✉️ admin@digitalmoonkey.travel</p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
