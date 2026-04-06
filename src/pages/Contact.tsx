import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { MessageCircle, Wrench, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useTranslations } from "@/i18n";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const t = useTranslations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error(t.contact.toastRequired);
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke("send-transactional-email", {
        body: { type: "contact", name: form.name, email: form.email, subject: form.subject, message: form.message },
      });
      if (error) throw error;
      toast.success(t.contact.toastSuccess);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error(t.contact.toastError);
    } finally {
      setSending(false);
    }
  };

  return (
    <PageLayout>
      <section className="section-spacing">
        <div className="container-grid max-w-5xl">
          <h1 className="text-center mb-4">{t.contact.title}</h1>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">{t.contact.subtitle}</p>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-5 h-5" style={{ color: "hsl(var(--success))" }} />
              </div>
              <h3 className="font-bold mb-1">{t.contact.chatTitle}</h3>
              <p className="text-xs text-muted-foreground mb-1">{t.contact.chatTime}</p>
              <p className="text-sm text-muted-foreground mb-4">{t.contact.chatDesc}</p>
              <Button className="w-full rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white" asChild>
                <a href="https://wa.me/376338383" target="_blank" rel="noopener noreferrer">{t.contact.chatBtn}</a>
              </Button>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Wrench className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold mb-3">{t.contact.toolsTitle}</h3>
              <div className="flex flex-col gap-2">
                <Link to="/visados" className="text-sm text-primary hover:underline">→ {t.contact.toolNewApp}</Link>
                <Link to="/dashboard" className="text-sm text-primary hover:underline">→ {t.contact.toolCheckOrder}</Link>
                <Link to="/dashboard" className="text-sm text-primary hover:underline">→ {t.contact.toolMyAccount}</Link>
                <Link to="/ayuda" className="text-sm text-primary hover:underline">→ {t.contact.toolHelp}</Link>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-bold mb-1">{t.contact.emailTitle}</h3>
              <p className="text-xs text-muted-foreground mb-1">{t.contact.emailTime}</p>
              <p className="text-sm text-muted-foreground mb-2">admin@digitalmoonkey.travel</p>
              <p className="text-xs text-muted-foreground">{t.contact.emailNote}</p>
            </div>
          </div>

          <div className="max-w-xl mx-auto">
            <h2 className="text-center mb-6">{t.contact.formTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">{t.contact.formName}</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">{t.contact.formEmail}</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t.contact.formSubject}</label>
                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t.contact.formMessage}</label>
                <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" required />
              </div>
              <Button type="submit" size="lg" className="w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-bold" disabled={sending}>
                {sending ? t.contact.formSending : t.contact.formSend}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
