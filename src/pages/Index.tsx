import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import CountrySelector from "@/components/CountrySelector";
import { popularVisas, type Country } from "@/data/visaCountries";
import { useTranslations } from "@/i18n";
import {
  Star, ShieldCheck, Clock, Globe, Headphones,
  Search, FileText, Download, Check, X as XIcon,
  ChevronRight
} from "lucide-react";

const Index = () => {
  const [passport, setPassport] = useState<Country | null>(null);
  const [destination, setDestination] = useState<Country | null>(null);
  const t = useTranslations();

  const trustIcons = [ShieldCheck, Clock, Star, Globe];
  const stepIcons = [Search, FileText, Download];

  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container-grid">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">{t.home.heroBadge}</p>
            <h1 className="text-primary-foreground mb-5" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}>
              {t.home.heroTitle}<span className="text-accent">{t.home.heroAccent}</span>
            </h1>
            <p className="text-primary-foreground/75 text-base md:text-lg max-w-xl mx-auto">{t.home.heroSub}</p>
          </div>

          <div className="max-w-2xl mx-auto bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <CountrySelector label={t.home.passportLabel} value={passport} onChange={setPassport} placeholder={t.home.passportPh} />
              <CountrySelector label={t.home.destLabel} value={destination} onChange={setDestination} placeholder={t.home.destPh} />
            </div>
            <Button size="lg" className="w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-base" disabled={!passport || !destination}>
              {t.home.checkVisa}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 flex-wrap mt-8">
            {t.home.trustItems.map((label, i) => {
              const Icon = trustIcons[i] || Globe;
              return (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-accent" strokeWidth={1.5} />
                  <span className="text-primary-foreground/70 text-xs font-medium">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-border">
        <div className="container-grid">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {t.home.stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl md:text-4xl font-bold text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section-spacing">
        <div className="container-grid">
          <h2 className="text-center mb-12">{t.home.whyTitle}</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6">
              <h3 className="text-destructive font-bold mb-4 flex items-center gap-2">
                <XIcon className="w-5 h-5" /> {t.home.withoutTitle}
              </h3>
              <ul className="space-y-3">
                {t.home.withoutItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <XIcon className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-success/5 border border-success/20 rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: "hsl(var(--success))" }}>
                <Check className="w-5 h-5" /> {t.home.withTitle}
              </h3>
              <ul className="space-y-3">
                {t.home.withItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--success))" }} />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Steps */}
      <section className="section-spacing bg-secondary">
        <div className="container-grid text-center">
          <h2 className="mb-4">{t.home.howTitle}</h2>
          <p className="text-muted-foreground mb-12 max-w-lg mx-auto">{t.home.howSub}</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {t.home.steps.map((step, i) => {
              const Icon = stepIcons[i] || FileText;
              return (
                <div key={step.title} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
                    <Icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-accent-foreground rounded-full text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  </div>
                  <h3 className="font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Visas */}
      <section className="section-spacing">
        <div className="container-grid">
          <h2 className="text-center mb-4">{t.home.popularTitle}</h2>
          <p className="text-center text-muted-foreground mb-10">{t.home.popularSub}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularVisas.map((visa) => (
              <Link to={`/visado/${visa.slug}`} key={visa.slug} className="group bg-card border border-border rounded-xl p-4 hover:shadow-hover hover:border-primary/30 transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{visa.flag}</span>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{visa.country}</h4>
                    <p className="text-xs text-muted-foreground">{visa.visaType}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-primary">{t.home.from} ${visa.priceFrom}</p>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section-spacing bg-secondary">
        <div className="container-grid text-center">
          <h2 className="mb-4">{t.home.reviewsTitle}</h2>
          <p className="text-muted-foreground mb-10">{t.home.reviewsSub}</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {t.home.reviews.map((r) => (
              <div key={r.name} className="bg-card border border-border rounded-xl p-6 text-left">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{r.text}"</p>
                <div>
                  <p className="text-sm font-bold text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-spacing">
        <div className="container-grid text-center">
          <h2 className="mb-4">{t.home.nlTitle}</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">{t.home.nlSub}</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder={t.home.nlPh} className="flex-1 px-4 py-3 border border-border rounded-xl text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <Button className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-bold">{t.home.nlBtn}</Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container-grid text-center">
          <h2 className="text-primary-foreground mb-4">{t.home.ctaTitle}</h2>
          <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">{t.home.ctaSub}</p>
          <Button size="lg" className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-base" asChild>
            <Link to="/visados">{t.home.ctaBtn}</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
