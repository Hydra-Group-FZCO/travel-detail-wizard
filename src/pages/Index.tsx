import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { Shield, Clock, Globe, Star } from "lucide-react";

import heroImage from "@/assets/hero-travel.jpg";
import serviceDocs from "@/assets/service-docs.jpg";
import serviceTracking from "@/assets/service-tracking.jpg";
import serviceDigital from "@/assets/service-digital.jpg";
import servicePreparation from "@/assets/service-preparation.jpg";
import serviceInsurance from "@/assets/service-insurance.jpg";
import serviceCorporate from "@/assets/service-corporate.jpg";

const trustItems = [
  { icon: Shield, label: "Verified Service" },
  { icon: Clock, label: "24h Response Time" },
  { icon: Star, label: "Transparent Pricing" },
  { icon: Globe, label: "EN · ES · FR" },
];

const services = [
  {
    image: serviceDocs,
    title: "Documentation Assistance",
    description: "Expert support with travel documentation, application forms, and submission requirements.",
  },
  {
    image: serviceTracking,
    title: "Application Tracking",
    description: "We monitor your application's progress and keep you informed at every stage.",
  },
  {
    image: serviceDigital,
    title: "Digital Travel Services",
    description: "Visa photos, eSIM connectivity, and digital solutions for modern travellers.",
  },
  {
    image: servicePreparation,
    title: "Travel Preparation",
    description: "Destination checklists, entry alerts, health info, and timeline planning.",
  },
  {
    image: serviceInsurance,
    title: "Insurance & Protection",
    description: "Compare travel insurance options and understand coverage for your trip.",
  },
  {
    image: serviceCorporate,
    title: "Corporate Compliance",
    description: "Documentation and duty-of-care solutions for business travellers.",
  },
];

const Index = () => {
  return (
    <PageLayout>
      {/* Hero — Full bleed like Civitatis */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center">
        <img
          src={heroImage}
          alt="Mediterranean coastal city at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 container-grid w-full">
          <div className="max-w-2xl animate-fade-up">
            <p className="text-primary-foreground/70 text-sm font-semibold tracking-widest uppercase mb-4">
              Personal Travel Assistance
            </p>
            <h1 className="text-primary-foreground text-balance leading-[1.1]" style={{ fontSize: "clamp(2.2rem, 6vw, 3.5rem)" }}>
              Travel with confidence.{" "}
              <span className="text-primary">We handle the details.</span>
            </h1>
            <p className="mt-5 text-primary-foreground/80 text-base md:text-lg leading-relaxed max-w-lg">
              From documentation and applications to connectivity and travel preparation. We make your journey simpler.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 animate-fade-up [animation-delay:200ms] opacity-0">
              <Button variant="hero" size="lg" asChild>
                <Link to="/services">Explore Our Services</Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Trust Bar — bottom of hero like Civitatis */}
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
          <h2 className="mb-5">How can we help you?</h2>
          <p className="mx-auto text-base md:text-lg max-w-2xl">
            Every trip starts long before you board the plane. Digital Moonkey provides personalised assistance at every stage of your travel preparation.
          </p>
        </div>
      </section>

      {/* Services Grid — Image cards like Civitatis destinations */}
      <section className="pb-16 md:pb-24">
        <div className="container-grid">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => (
              <Link
                to="/services"
                key={service.title}
                className="group relative rounded-xl overflow-hidden aspect-[4/3] shadow-card hover:shadow-hover transition-all duration-300"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
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
          <h2 className="mb-12">Why travellers trust us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { title: "Registered Company", desc: "Registered in England & Wales" },
              { title: "Dedicated Team", desc: "Personal support at every step" },
              { title: "No Hidden Fees", desc: "Transparent pricing always" },
              { title: "Multilingual", desc: "English, Spanish, and French" },
            ].map((item) => (
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
          <h2 className="mb-4">Ready to simplify your travel?</h2>
          <p className="mx-auto mb-8 text-base md:text-lg max-w-lg">
            Tell us where you are heading. We will take it from there.
          </p>
          <Button variant="cta" size="lg" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
