import PageLayout from "@/components/PageLayout";
import LegalLanguageNotice from "@/components/LegalLanguageNotice";

const Cookies = () => {
  return (
    <PageLayout>
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-secondary">
        <div className="container-grid">
          <h1>Cookie Policy</h1>
          <p className="text-muted-foreground text-sm mt-2">Last updated: March 2026</p>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-grid">
          <div className="max-w-3xl space-y-8">
            <LegalLanguageNotice />

            <div>
              <h2 className="text-lg font-bold mb-3">What Are Cookies</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Cookies are small text files placed on your device when you visit our website. They help us provide a better experience and allow certain features to function.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-3">Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-1">Essential Cookies</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Required for the website to function. Include session cookies, security cookies, and cookie consent preferences. Always active. Cannot be disabled.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground mb-1">Analytics Cookies <span className="text-xs font-normal text-muted-foreground">(require your consent)</span></h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Help us understand how visitors use our site. Used with your consent only.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground mb-1">Marketing Cookies <span className="text-xs font-normal text-muted-foreground">(require your consent)</span></h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Used to track affiliate referrals (Travelpayouts). Used with your consent only.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-3">Your Choices</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                You can manage your cookie preferences at any time through our cookie consent banner or your browser settings. To change your preferences after your initial choice, click "Cookie Settings" in the footer.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-3">More Information</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                For full details on how we process your data, see our{" "}
                <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
              </p>
            </div>

            <div className="bg-secondary rounded-xl p-6 space-y-1 text-sm">
              <p className="font-bold text-foreground">Digital Moonkey Limited</p>
              <p className="text-muted-foreground">Company No. 15716386</p>
              <p className="text-muted-foreground">71-75 Shelton Street, Covent Garden, London, WC2H 9JQ</p>
              <p className="text-muted-foreground">Email: <a href="mailto:hello@digitalmoonkey.travel" className="text-primary hover:underline">hello@digitalmoonkey.travel</a></p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Cookies;
