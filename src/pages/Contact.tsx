import PageLayout from "@/components/PageLayout";
import { Mail, Clock, MapPin } from "lucide-react";
import { useTranslations } from "@/i18n";

const iconMap = [Mail, Mail, Mail, Clock, Clock];

const Contact = () => {
  const t = useTranslations();

  return (
    <PageLayout>
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-secondary">
        <div className="container-grid">
          <h1 className="mb-4">{t.contact.title}</h1>
          <p className="text-base md:text-lg max-w-2xl">{t.contact.subtitle}</p>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-grid">
          <div className="max-w-2xl">
            <div className="space-y-4">
              {t.contact.items.map((item, i) => {
                const Icon = iconMap[i] || Mail;
                return (
                  <div key={item.label} className="flex items-start gap-4 bg-card border border-border rounded-xl p-5 shadow-card">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">{item.label}</p>
                      <p className="text-sm font-semibold text-foreground">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 bg-card border border-border rounded-xl p-5 shadow-card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">{t.contact.officeLabel}</p>
                  <p className="text-sm font-semibold text-foreground">{t.contact.officeName}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{t.contact.officeLocation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
