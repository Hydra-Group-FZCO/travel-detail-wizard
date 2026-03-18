import PageLayout from "@/components/PageLayout";
import { Mail, Clock, MapPin } from "lucide-react";

const contactInfo = [
  { icon: Mail, label: "General enquiries", value: "support@digitalmoonkey.travel" },
  { icon: Mail, label: "Business enquiries", value: "business@digitalmoonkey.travel" },
  { icon: Mail, label: "Corporate clients", value: "corporate@digitalmoonkey.travel" },
  { icon: Clock, label: "Office hours", value: "Monday to Friday, 9:00 — 18:00 (GMT)" },
  { icon: Clock, label: "Response time", value: "Within 24 hours on business days" },
];

const Contact = () => {
  return (
    <PageLayout>
      <section className="section-spacing">
        <div className="container-grid">
          <div className="max-w-3xl">
            <h1 className="mb-6">Get in Touch</h1>
            <p className="text-lg leading-relaxed mb-16">
              Whether you need help with a single application or ongoing support for your business travel programme, we are here to help.
            </p>

            <div className="space-y-6">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-4 bg-card border border-border rounded-lg p-6 shadow-card">
                  <item.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium text-foreground font-sans">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-card border border-border rounded-lg p-6 shadow-card">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans mb-1">
                    Registered Office
                  </p>
                  <p className="text-sm font-medium text-foreground font-sans">Digital Moonkey Ltd</p>
                  <p className="text-sm text-muted-foreground mt-1">England, United Kingdom</p>
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
