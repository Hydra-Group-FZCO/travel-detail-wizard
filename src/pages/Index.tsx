import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { Shield, Clock, Globe, Star } from "lucide-react";
import { useTranslations, useLanguage, localizedPath } from "@/i18n";

import heroImage from "@/assets/hero-travel.jpg";
import serviceDocs from "@/assets/service-docs.jpg";
import serviceTracking from "@/assets/service-tracking.jpg";
import serviceDigital from "@/assets/service-digital.jpg";
import servicePreparation from "@/assets/service-preparation.jpg";
import serviceCorporate from "@/assets/service-corporate.jpg";

const serviceImages = [serviceDocs, serviceTracking, serviceDigital, servicePreparation, serviceCorporate];

const Index = () => {
  const t = useTranslations();
  const lang = useLanguage();

  const trustItems = [
    { icon: Shield, label: t.trust.verified },
    { icon: Clock, label: t.trust.response },
    { icon: Star, label: t.trust.pricing },
    { icon: Globe, label: t.trust.languages },
  ];

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center">
        <img src={heroImage} alt="Mediterranean coastal city at golden hour" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 container-grid w-full">
          <div className="max-w-2xl animate-fade-up">
            <p className="text-primary-foreground/70 text-sm font-semibold tracking-widest uppercase mb-4">{t.hero.badge}</p>
            <h1 className="text-primary-foreground text-balance leading-[1.1]" style={{ fontSize: "clamp(2.2rem, 6vw, 3.5rem)" }}>
              {t.hero.headline}{" "}<span className="text-accent">{t.hero.headlineAccent}</span>
            </h1>
            <p className="mt-5 text-primary-foreground/80 text-base md:text-lg leading-relaxed max-w-lg">{t.hero.subheadline}</p>
            <div className="mt-8 flex flex-wrap gap-3 animate-fade-up [animation-delay:200ms] opacity-0">
              <Button variant="hero" size="lg" asChild>
                <Link to={localizedPath("/services", lang)}>{t.hero.cta}</Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to={localizedPath("/contact", lang)}>{t.hero.ctaSecondary}</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-trust-bar-bg/90 backdrop-blur-sm">
          <div className="container-grid py-4">
            <div className="flex items-center justify-center md:justify-between gap-6 md:gap-4 flex-wrap">
              {trustItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <item.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  <span className="text-trust-bar-fg text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="section-spacing">
        <div className="container-grid text-center">
          <h2 className="mb-5">{t.intro.title}</h2>
          <p className="mx-auto text-base md:text-lg max-w-2xl">{t.intro.text}</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-16 md:pb-24">
        <div className="container-grid">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.services.cards.map((service, i) => (
              <Link
                to={localizedPath("/services", lang)}
                key={service.title}
                className="group relative rounded-xl overflow-hidden aspect-[4/3] shadow-card hover:shadow-hover transition-all duration-300"
              >
                <img src={serviceImages[i]} alt={service.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-primary-foreground text-lg font-bold mb-1">{service.title}</h3>
                  <p className="text-primary-foreground/75 text-sm leading-relaxed line-clamp-2">{service.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why trust us */}
      <section className="section-spacing bg-secondary">
        <div className="container-grid text-center">
          <h2 className="mb-12">{t.trustSection.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {t.trustSection.items.map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>
                <h4 className="text-sm font-bold mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing">
        <div className="container-grid text-center">
          <h2 className="mb-4">{t.cta.title}</h2>
          <p className="mx-auto mb-8 text-base md:text-lg max-w-lg">{t.cta.text}</p>
          <Button variant="cta" size="lg" asChild>
            <Link to={localizedPath("/contact", lang)}>{t.cta.button}</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
