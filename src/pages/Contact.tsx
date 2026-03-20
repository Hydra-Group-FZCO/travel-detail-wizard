import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Mail, Clock, MapPin, Send, MessageCircle } from "lucide-react";
import { useTranslations } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const iconMap = [Mail, Mail, Mail, Clock, Clock, MessageCircle];

const Contact = () => {
  const t = useTranslations();
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const { error } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          type: "contact_acknowledgment",
          to: formData.email,
          customerName: formData.name,
          subject: formData.subject,
          message: formData.message,
        },
      });

      if (error) throw error;

      toast.success(t.contact.form.success);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error(t.contact.form.error);
    } finally {
      setSending(false);
    }
  };

  return (
    <PageLayout>
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-secondary">
        <div className="container-grid">
          <h1 className="mb-4">{t.contact.title}</h1>
          <p className="text-base md:text-lg max-w-2xl">{t.contact.subtitle}</p>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-grid">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Contact info */}
            <div>
              <div className="space-y-4">
                {t.contact.items.map((item, i) => {
                  const Icon = iconMap[i] || Mail;
                  return (
                    <div key={item.label} className="flex items-start gap-4 bg-card border border-border rounded-xl p-5 shadow-card">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">{item.label}</p>
                        <p className="text-sm font-semibold text-foreground">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 bg-card border border-border rounded-xl p-5 shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">{t.contact.officeLabel}</p>
                    <p className="text-sm font-semibold text-foreground">{t.contact.officeName}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{t.contact.officeAddress}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{t.contact.officeLocation}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-card">
              <h2 className="text-xl font-bold text-foreground mb-6">{t.contact.form.title}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">{t.contact.form.name}</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t.contact.form.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">{t.contact.form.subject}</Label>
                  <Input
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t.contact.form.message}</Label>
                  <Textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                  />
                </div>
                <Button type="submit" disabled={sending} className="w-full">
                  {sending ? (
                    t.contact.form.sending
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {t.contact.form.submit}
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
