import PageLayout from "@/components/PageLayout";

const Cookies = () => {
  return (
    <PageLayout>
      <section className="section-spacing">
        <div className="container-grid max-w-3xl">
          <h1 className="mb-8">Cookie Policy</h1>
          <p className="text-sm text-muted-foreground mb-6">Last updated: April 2026</p>
          <div className="space-y-8">
            <div><h2 className="text-xl font-bold mb-3">What Are Cookies?</h2><p className="text-sm text-muted-foreground leading-relaxed">Cookies are small text files placed on your device when you visit a website. They help websites function properly and provide reporting information.</p></div>
            <div>
              <h2 className="text-xl font-bold mb-3">Cookies We Use</h2>
              <div className="space-y-4">
                <div className="glass-card rounded-xl p-4"><h3 className="text-sm font-bold text-foreground mb-1">Essential Cookies</h3><p className="text-sm text-muted-foreground">Required for the website to function. Cannot be disabled.</p></div>
                <div className="glass-card rounded-xl p-4"><h3 className="text-sm font-bold text-foreground mb-1">Functional Cookies</h3><p className="text-sm text-muted-foreground">Enable enhanced functionality and personalization.</p></div>
                <div className="glass-card rounded-xl p-4"><h3 className="text-sm font-bold text-foreground mb-1">Analytics Cookies</h3><p className="text-sm text-muted-foreground">Help us understand how visitors interact with our website using Google Analytics.</p></div>
                <div className="glass-card rounded-xl p-4"><h3 className="text-sm font-bold text-foreground mb-1">Marketing Cookies</h3><p className="text-sm text-muted-foreground">Used to track visitors across websites for relevant advertising.</p></div>
              </div>
            </div>
            <div><h2 className="text-xl font-bold mb-3">Third-Party Cookies</h2><p className="text-sm text-muted-foreground leading-relaxed">Some cookies are placed by third-party services. We do not control these cookies.</p></div>
            <div><h2 className="text-xl font-bold mb-3">Managing Cookies</h2><p className="text-sm text-muted-foreground leading-relaxed">You can manage cookie preferences through your browser settings. Disabling cookies may affect website functionality.</p></div>
            <div><h2 className="text-xl font-bold mb-3">Contact</h2><p className="text-sm text-muted-foreground leading-relaxed">Questions? Contact us at hello@digitalmoonkey.travel.</p></div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Cookies;
