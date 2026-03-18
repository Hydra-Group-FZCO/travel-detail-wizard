import PageLayout from "@/components/PageLayout";
import { Mail, Clock, MapPin } from "lucide-react";

const contactItems = [
  { icon: Mail, label: "General enquiries", value: "support@digitalmoonkey.travel" },
  { icon: Mail, label: "Business enquiries", value: "business@digitalmoonkey.travel" },
  { icon: Mail, label: "Corporate clients", value: "corporate@digitalmoonkey.travel" },
  { icon: Clock, label: "Office hours", value: "Monday to Friday, 9:00 — 18:00 (GMT)" },
  { icon: Clock, label: "Response time", value: "Within 24 hours on business days" },
];

const Contact = () => {
  return (
    <PageLayout>
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-secondary">
        <div className="container-grid">
          <h1 className="mb-4">Get in Touch</h1>
          <p className="text-base md:text-lg max-w-2xl">
            Whether you need help with a single application or ongoing support for your business travel programme, we are here to help.
          </p>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-grid">
          <div className="max-w-2xl">
            <div className="space-y-4">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-start gap-4 bg-card border border-border rounded-xl p-5 shadow-card">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">{item.label}</p>
                    <p className="text-sm font-semibold text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-card border border-border rounded-xl p-5 shadow-card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Registered Office</p>
                  <p className="text-sm font-semibold text-foreground">Digital Moonkey Ltd</p>
                  <p className="text-sm text-muted-foreground mt-0.5">England, United Kingdom</p>
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
