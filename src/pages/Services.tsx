import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";

const servicesSections = [
  {
    id: "documentation",
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
      <section className="section-spacing">
        <div className="container-grid">
          <h1 className="mb-6">Our Services</h1>
          <p className="text-lg md:text-xl max-w-2xl">
            We offer a comprehensive range of personal assistance services designed to simplify every aspect of travel preparation. From documentation to connectivity, we are with you at every step.
          </p>
        </div>
      </section>

      {/* Services */}
      {servicesSections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className={`py-16 md:py-24 ${index % 2 === 0 ? "bg-muted/50" : ""}`}
        >
          <div className="container-grid">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <h2>{section.title}</h2>
                {section.badge && (
                  <span className="text-xs font-semibold font-sans bg-primary/10 text-primary px-3 py-1 rounded-md">
                    {section.badge}
                  </span>
                )}
              </div>

              <p className="text-base leading-relaxed mb-8">{section.intro}</p>

              {section.subtitle && (
                <p className="text-sm font-semibold text-foreground font-sans mb-4">{section.subtitle}</p>
              )}

              {section.items && (
                <ul className="space-y-3 mb-6">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-relaxed">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                      <span className="text-prose">{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.subsections?.map((sub) => (
                <div key={sub.heading} className="mb-8">
                  <h3 className="text-lg mb-4">{sub.heading}</h3>
                  <ul className="space-y-3">
                    {sub.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-relaxed">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                        <span className="text-prose">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {section.closing && (
                <p className="text-sm font-medium text-foreground mt-6 italic">{section.closing}</p>
              )}

              {section.note && (
                <div className="mt-6 bg-muted border border-border rounded-md p-4">
                  <p className="text-xs leading-relaxed text-muted-foreground">{section.note}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="section-spacing">
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

      {/* Disclaimer */}
      <div className="bg-muted border-t border-border">
        <div className="container-grid py-8">
          <p className="text-xs leading-relaxed text-muted-foreground max-w-none">
            <strong>Important:</strong> Digital Moonkey Ltd provides personal assistance and support services only. We are not a government agency, embassy, consulate, or official body. We do not issue visas, travel authorisations, or any official documents. Our fees cover our assistance services and are entirely separate from any official government or application fees. You may apply directly through official channels at no cost or at a lower cost without using our services.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Services;
