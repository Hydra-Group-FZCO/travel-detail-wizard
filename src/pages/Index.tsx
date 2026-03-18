import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { FileText, Search, Smartphone, ClipboardList, Shield, Building2, CheckCircle2 } from "lucide-react";

const services = [
  {
    icon: FileText,
    title: "Documentation Assistance",
    description: "Expert support with travel documentation, application forms, and submission requirements. We help you get it right the first time.",
  },
  {
    icon: Search,
    title: "Application Tracking & Follow-Up",
    description: "Once your application is submitted, we monitor its progress and keep you informed at every stage. No more guessing.",
  },
  {
    icon: Smartphone,
    title: "Digital Travel Services",
    description: "Compliant visa and passport photographs in digital format, plus eSIM and connectivity solutions so you stay connected from the moment you land.",
  },
  {
    icon: ClipboardList,
    title: "Travel Preparation",
    description: "Destination-specific checklists, entry requirement alerts, health and safety information, and timeline planning — everything you need before you go.",
  },
  {
    icon: Shield,
    title: "Insurance & Protection",
    description: "We help you compare travel insurance options and understand coverage for your specific destination and circumstances.",
  },
  {
    icon: Building2,
    title: "Corporate Travel Compliance",
    description: "Documentation support, duty-of-care services, and travel compliance solutions for businesses with employees who travel internationally.",
  },
];

const trustItems = [
  "Registered in England & Wales",
  "Dedicated support team",
  "Transparent pricing — no hidden fees",
  "Services available in English, Spanish, and French",
];

const Index = () => {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="section-spacing relative overflow-hidden">
        <div className="container-grid">
          <div className="max-w-3xl">
            <h1 className="animate-fade-up text-balance">
              Travel with confidence.{" "}
              <span className="text-primary">We handle the details.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl leading-relaxed animate-fade-up [animation-delay:100ms] opacity-0">
              Personal assistance services for travellers — from documentation and applications to connectivity and travel preparation. We make your journey simpler.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 animate-fade-up [animation-delay:200ms] opacity-0">
              <Button variant="hero" size="lg" asChild>
                <Link to="/services">Explore Our Services</Link>
              </Button>
              <Button variant="outline-dark" size="lg" asChild>
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="pb-20 md:pb-32">
        <div className="container-grid">
          <div className="max-w-3xl border-l-2 border-primary/20 pl-8">
            <p className="text-lg leading-relaxed">
              Every trip starts long before you board the plane. Entry requirements, application forms, document formats, health certificates, connectivity abroad — the preparation can be overwhelming.
            </p>
            <p className="mt-6 text-lg leading-relaxed">
              Digital Moonkey provides personalised assistance at every stage of your travel preparation. Whether you need help with a single application or full support for a corporate travel programme, our team is here to guide you through the process.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-spacing bg-muted/50">
        <div className="container-grid">
          <h2 className="mb-16 text-balance">What we do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="group bg-card border border-border rounded-lg p-8 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300 brand-curve"
              >
                <service.icon className="w-6 h-6 text-primary mb-5" strokeWidth={1.5} />
                <h3 className="text-lg font-serif mb-3">{service.title}</h3>
                <p className="text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="section-spacing">
        <div className="container-grid">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="mb-12">Why travellers trust us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              {trustItems.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-green mt-0.5 shrink-0" strokeWidth={2} />
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-muted/50">
        <div className="container-grid text-center">
          <h2 className="mb-6">Ready to simplify your travel preparation?</h2>
          <p className="mx-auto mb-10 text-lg">
            Get in touch with our team and tell us where you are heading. We will take it from there.
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
