import PageLayout from "@/components/PageLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, CreditCard, FileText, BookOpen } from "lucide-react";
import { useTranslations } from "@/i18n";

const categoryIcons = [HelpCircle, CreditCard, FileText, BookOpen];

const Help = () => {
  const t = useTranslations();

  return (
    <PageLayout>
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-secondary">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t.help.title}</h1>
          <p className="text-muted-foreground mt-2">{t.help.subtitle}</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl space-y-12">
          {t.help.categories.map((cat, catIdx) => {
            const Icon = categoryIcons[catIdx] || HelpCircle;
            return (
              <div key={cat.title}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{cat.title}</h2>
                </div>
                <Accordion type="single" collapsible className="space-y-2">
                  {cat.items.map((item, i) => (
                    <AccordionItem key={i} value={`${cat.title}-${i}`} className="border border-border rounded-lg px-4">
                      <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-4">{item.q}</AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground pb-4">{item.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            );
          })}

          <div className="bg-secondary rounded-xl p-8 text-center">
            <h3 className="text-lg font-bold text-foreground mb-2">{t.help.notFoundTitle}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t.help.notFoundDesc}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/contacto" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors">{t.help.contactBtn}</a>
              <a href="https://wa.me/376338383" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-lg border border-border bg-background text-foreground px-6 py-2.5 text-sm font-medium hover:bg-secondary transition-colors">{t.help.whatsappBtn}</a>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Help;
