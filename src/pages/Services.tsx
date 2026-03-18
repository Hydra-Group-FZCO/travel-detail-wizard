import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";

import serviceDocs from "@/assets/service-docs.jpg";
import serviceTracking from "@/assets/service-tracking.jpg";
import serviceDigital from "@/assets/service-digital.jpg";
import servicePreparation from "@/assets/service-preparation.jpg";
import serviceInsurance from "@/assets/service-insurance.jpg";
import serviceCorporate from "@/assets/service-corporate.jpg";

const servicesSections = [
  {
    id: "documentation",
    image: serviceDocs,
    title: "Documentation Assistance",
    intro: "Navigating travel documentation can be complex. Different countries have different requirements, forms change frequently, and a single error can delay your plans.",
    subtitle: "Our documentation assistance service includes:",
    items: [
      "Review of entry requirements specific to your nationality and destination",
      "Step-by-step guidance through application forms for visas, ETAs, travel authorisations, and other travel documents",
      "Document review to ensure your submission meets official format and content requirements",
      "Preparation and organisation of supporting documents",
      "Advice on common errors and how to avoid them",
    ],
    closing: "We guide you through the process — you make the decisions.",
  },
  {
    id: "tracking",
    image: serviceTracking,
    title: "Application Tracking & Follow-Up",
    intro: "Once your application has been submitted, the waiting can be stressful. Our tracking service keeps you informed so you can plan with confidence.",
    subtitle: "What we provide:",
    items: [
      "Status monitoring of submitted applications",
      "Proactive alerts if additional information or action is required",
      "Regular updates via email or messaging",
      "Estimated timeline management",
      "Assistance with follow-up communications if needed",
    ],
  },
  {
    id: "digital",
    image: serviceDigital,
    title: "Digital Travel Services",
    intro: "Modern travel requires digital readiness. We help you prepare the digital essentials before you depart.",
    subsections: [
      {
        heading: "Visa & Passport Photography",
        items: [
          "Digital photographs compliant with the specific requirements of your destination country",
          "Format, size, background, and resolution verified before delivery",
          "Delivered digitally — ready to upload or print",
        ],
      },
      {
        heading: "eSIM & Connectivity",
        items: [
          "International eSIM solutions for 190+ destinations",
          "Data plans tailored to your trip duration and usage",
          "Setup guidance for all major device types",
          "Stay connected from the moment you arrive — no roaming surprises",
        ],
      },
    ],
  },
  {
    id: "preparation",
    image: servicePreparation,
    title: "Travel Preparation Services",
    intro: "Proper preparation is the foundation of a smooth trip. We provide personalised planning support tailored to your destination.",
    subtitle: "What is included:",
    items: [
      "Personalised destination checklist covering documentation, health, safety, and practical information",
      "Entry requirement alerts updated in real time",
      "Health and vaccination requirement information by destination",
      "Practical travel intelligence: local customs, tipping, emergency contacts, power adapters, currency, and more",
      "Pre-departure timeline planning so nothing is left to the last minute",
    ],
  },
  {
    id: "insurance",
    image: serviceInsurance,
    title: "Insurance Comparison & Referral",
    intro: "Travel insurance is essential but choosing the right policy can be confusing. We help you understand your options.",
    subtitle: "Our service includes:",
    items: [
      "Comparison of travel insurance options relevant to your destination and trip type",
      "Explanation of key coverage areas: medical, cancellation, luggage, liability",
      "Referral to vetted insurance providers",
      "Assistance with claims documentation if needed",
    ],
    note: "Note: Digital Moonkey is not an insurance provider or broker. We provide information and referral services to help you make an informed decision.",
  },
  {
    id: "corporate",
    image: serviceCorporate,
    title: "Corporate Travel Compliance",
    badge: "B2B",
    intro: "For businesses with employees who travel internationally, compliance is not optional. We provide dedicated support to help your organisation meet its duty-of-care obligations.",
    subtitle: "Our corporate services include:",
    items: [
      "Documentation assistance for expatriate employees and frequent business travellers",
      "Bulk processing support for teams travelling to the same destination",
      "Travel policy compliance verification",
      "Destination risk briefings",
      "Centralised tracking and reporting for HR and compliance teams",
      "Dedicated account management for corporate clients",
    ],
    closing: "Contact us for a tailored corporate proposal.",
  },
];

const Services = () => {
  return (
    <PageLayout>
      {/* Page Header */}
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-secondary">
        <div className="container-grid">
          <h1 className="mb-4">Our Services</h1>
          <p className="text-base md:text-lg max-w-2xl">
            We offer a comprehensive range of personal assistance services designed to simplify every aspect of travel preparation. From documentation to connectivity, we are with you at every step.
          </p>
        </div>
      </section>

      {/* Services */}
      {servicesSections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className={`py-16 md:py-20 ${index % 2 !== 0 ? "bg-secondary" : ""}`}
        >
          <div className="container-grid">
            <div className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-10 lg:gap-16 items-center`}>
              {/* Image */}
              <div className="w-full lg:w-2/5 shrink-0">
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full aspect-[4/3] object-cover rounded-xl shadow-card"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h2>{section.title}</h2>
                  {section.badge && (
                    <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {section.badge}
                    </span>
                  )}
                </div>

                <p className="text-sm leading-relaxed mb-6">{section.intro}</p>

                {section.subtitle && (
                  <p className="text-sm font-bold text-foreground mb-3">{section.subtitle}</p>
                )}

                {section.items && (
                  <ul className="space-y-2.5 mb-5">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.subsections?.map((sub) => (
                  <div key={sub.heading} className="mb-6">
                    <h3 className="text-base font-bold mb-3">{sub.heading}</h3>
                    <ul className="space-y-2.5">
                      {sub.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {section.closing && (
                  <p className="text-sm font-semibold text-foreground mt-4 italic">{section.closing}</p>
                )}

                {section.note && (
                  <div className="mt-5 bg-muted border border-border rounded-lg p-4">
                    <p className="text-xs leading-relaxed text-muted-foreground">{section.note}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="section-spacing bg-trust-bar-bg">
        <div className="container-grid text-center">
          <h2 className="text-trust-bar-fg mb-4">Ready to simplify your travel preparation?</h2>
          <p className="mx-auto mb-8 text-trust-bar-fg/70 text-base md:text-lg max-w-lg" style={{ maxWidth: "none" }}>
            Get in touch with our team and tell us where you are heading.
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-muted border-t border-border">
        <div className="container-grid py-6">
          <p className="text-xs leading-relaxed text-muted-foreground" style={{ maxWidth: "none" }}>
            <strong>Important:</strong> Digital Moonkey Ltd provides personal assistance and support services only. We are not a government agency, embassy, consulate, or official body. We do not issue visas, travel authorisations, or any official documents. Our fees cover our assistance services and are entirely separate from any official government or application fees. You may apply directly through official channels at no cost or at a lower cost without using our services.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Services;
