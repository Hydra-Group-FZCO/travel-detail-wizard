import { useParams, Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { popularVisas } from "@/data/visaCountries";
import { Clock, Globe, Star, ShieldCheck, Zap, Timer } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "@/i18n";

const VisaDetail = () => {
  const { slug } = useParams();
  const visa = popularVisas.find((v) => v.slug === slug);
  const [selectedSpeed, setSelectedSpeed] = useState(0);
  const t = useTranslations();

  const processingOptions = [
    { label: t.visa.standard, time: t.visa.standardTime, multiplier: 1, icon: Clock },
    { label: t.visa.urgent, time: t.visa.urgentTime, multiplier: 1.5, icon: Zap },
    { label: t.visa.superUrgent, time: t.visa.superUrgentTime, multiplier: 2.5, icon: Timer },
  ];

  if (!visa) {
    return (
      <PageLayout>
        <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-secondary">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-2xl font-bold text-foreground">{t.visa.notFound}</h1>
            <p className="text-muted-foreground mt-2"><Link to="/" className="text-primary hover:underline">{t.visa.notFoundBack}</Link></p>
          </div>
        </section>
      </PageLayout>
    );
  }

  const price = visa.priceFrom * processingOptions[selectedSpeed].multiplier;
  const desc = t.visa.descTemplate.replace("{visaType}", visa.visaType).replace("{country}", visa.country);

  return (
    <PageLayout>
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-secondary">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{visa.flag}</span>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">{visa.country}</h1>
                  <p className="text-muted-foreground">{visa.visaType}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-4">
                <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> {t.visa.entry}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {t.visa.validityBadge}</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> {t.visa.approvalBadge}</span>
              </div>
            </div>
            <div className="bg-background rounded-xl border border-border p-6 min-w-[260px] shadow-sm">
              <p className="text-xs text-muted-foreground mb-1">{t.visa.priceFrom}</p>
              <p className="text-3xl font-bold text-foreground">${price.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">{t.visa.usd}</span></p>
              <div className="mt-4 space-y-2">
                {processingOptions.map((opt, i) => (
                  <button key={i} onClick={() => setSelectedSpeed(i)} className={`w-full flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${selectedSpeed === i ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                    <span className="flex items-center gap-2"><opt.icon className="w-4 h-4" /> {opt.label}</span>
                    <span className="text-xs">{opt.time}</span>
                  </button>
                ))}
              </div>
              <button className="w-full mt-4 rounded-lg bg-accent text-accent-foreground font-semibold py-3 text-sm hover:bg-accent/90 transition-colors">{t.visa.applyNow}</button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <Tabs defaultValue="resumen" className="w-full">
            <TabsList className="mb-8 w-full justify-start overflow-x-auto">
              <TabsTrigger value="resumen">{t.visa.tabSummary}</TabsTrigger>
              <TabsTrigger value="requisitos">{t.visa.tabReqs}</TabsTrigger>
              <TabsTrigger value="proceso">{t.visa.tabProcess}</TabsTrigger>
              <TabsTrigger value="faq">{t.visa.tabFaq}</TabsTrigger>
              <TabsTrigger value="resenas">{t.visa.tabReviews}</TabsTrigger>
            </TabsList>

            <TabsContent value="resumen" className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: t.visa.docType, value: visa.visaType },
                  { label: t.visa.validityField, value: t.visa.validityValue },
                  { label: t.visa.entriesField, value: t.visa.entriesValue },
                  { label: t.visa.processingField, value: t.visa.processingValue },
                ].map((item) => (
                  <div key={item.label} className="bg-secondary rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </TabsContent>

            <TabsContent value="requisitos" className="space-y-4 text-sm text-muted-foreground">
              <h3 className="text-lg font-bold text-foreground">{t.visa.reqsTitle}</h3>
              <ul className="list-disc pl-5 space-y-2">
                {t.visa.reqs.map((req, i) => <li key={i}>{req}</li>)}
              </ul>
            </TabsContent>

            <TabsContent value="proceso" className="space-y-6">
              {t.visa.steps.map((s, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{s.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="faq">
              <Accordion type="single" collapsible className="space-y-2">
                {t.visa.faq.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-lg px-4">
                    <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-4">
                      {item.q.replace("{visaType}", visa.visaType).replace("{country}", visa.country)}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground pb-4">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="resenas" className="space-y-4">
              {t.visa.reviewItems.map((rev, i) => (
                <div key={i} className="bg-secondary rounded-xl p-5">
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: rev.stars }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{rev.text}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{rev.name} · {rev.country}</span>
                    <span>{rev.date}</span>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </PageLayout>
  );
};

export default VisaDetail;
