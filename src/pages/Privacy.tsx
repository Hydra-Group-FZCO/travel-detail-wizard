import PageLayout from "@/components/PageLayout";

const Privacy = () => {
  return (
    <PageLayout>
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-secondary">
        <div className="container-grid">
          <h1>Privacy Policy</h1>
          <p className="text-muted-foreground text-sm mt-2">Last updated: March 2026</p>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-grid">
          <div className="max-w-3xl space-y-8">
            <p className="text-sm leading-relaxed">
              This Privacy Policy explains how Digital Moonkey Limited collects, uses and protects your personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>

            <div className="bg-secondary rounded-xl p-6 space-y-1 text-sm">
              <p className="font-bold text-foreground">Data Controller</p>
              <p className="text-muted-foreground">Digital Moonkey Limited</p>
              <p className="text-muted-foreground">Company No. 15716386</p>
              <p className="text-muted-foreground">71-75 Shelton Street, Covent Garden, London, WC2H 9JQ</p>
              <p className="text-muted-foreground">Email: hello@digitalmoonkey.travel</p>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold mb-3">1. Data We Collect</h2>
                <p className="text-sm leading-relaxed text-muted-foreground mb-3">We collect the following personal data:</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">Identity data:</strong> name, date of birth (where required for travel authorisations)</p>
                  <p><strong className="text-foreground">Contact data:</strong> email address, phone number, country of residence</p>
                  <p><strong className="text-foreground">Account data:</strong> username, password (encrypted), purchase history, saved itineraries and guides</p>
                  <p><strong className="text-foreground">Payment data:</strong> we do not store card details. Payments are processed by Stripe, Inc. Stripe's privacy policy applies to payment data.</p>
                  <p><strong className="text-foreground">Travel data:</strong> passport details (only where required for travel authorisation applications), travel destinations, travel dates</p>
                  <p><strong className="text-foreground">Technical data:</strong> IP address, browser type, device information, cookies</p>
                  <p><strong className="text-foreground">Usage data:</strong> pages visited, features used, time on site</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-3">2. How We Collect Data</h2>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Directly from you when you create an account, make a purchase, or contact us.</p>
                  <p>Automatically through cookies and similar technologies when you use our website.</p>
                  <p>From third parties including payment processors (Stripe) and analytics providers.</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-3">3. How We Use Your Data</h2>
                <p className="text-sm leading-relaxed text-muted-foreground mb-3">We use your personal data for the following purposes and legal bases:</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>To fulfil your orders and deliver products and services — <em>Legal basis: Contract performance</em></p>
                  <p>To manage your account — <em>Legal basis: Contract performance</em></p>
                  <p>To process payments — <em>Legal basis: Contract performance</em></p>
                  <p>To send order confirmations and service updates — <em>Legal basis: Contract performance</em></p>
                  <p>To send marketing communications (only with your consent) — <em>Legal basis: Consent</em></p>
                  <p>To improve our platform and services — <em>Legal basis: Legitimate interests</em></p>
                  <p>To comply with legal obligations — <em>Legal basis: Legal obligation</em></p>
                  <p>To detect and prevent fraud — <em>Legal basis: Legitimate interests</em></p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-3">4. Data Sharing</h2>
                <p className="text-sm leading-relaxed text-muted-foreground mb-3">We share your data only with:</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">Stripe, Inc.</strong> — payment processing. Stripe is certified to PCI DSS Level 1.</p>
                  <p><strong className="text-foreground">Supabase</strong> — secure database infrastructure for account and order data.</p>
                  <p><strong className="text-foreground">Anthropic</strong> — AI content generation. Only travel preferences provided; no identifying personal data shared.</p>
                  <p><strong className="text-foreground">eSIM Access</strong> — for eSIM order fulfilment. Email and order details shared as required for delivery.</p>
                  <p><strong className="text-foreground">Bokun</strong> — for experience booking management.</p>
                  <p><strong className="text-foreground">Travelpayouts</strong> — affiliate tracking (anonymised click data).</p>
                  <p className="font-semibold text-foreground mt-3">We do not sell your personal data to third parties.</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-3">5. International Transfers</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Some of our service providers are based outside the UK. Where we transfer data internationally, we ensure appropriate safeguards are in place in accordance with UK GDPR requirements, including Standard Contractual Clauses where applicable.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-3">6. Data Retention</h2>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">Account data:</strong> retained for the duration of your account plus 6 years after closure for legal and tax purposes.</p>
                  <p><strong className="text-foreground">Order data:</strong> retained for 7 years in accordance with UK tax law.</p>
                  <p><strong className="text-foreground">Marketing preferences:</strong> retained until you withdraw consent.</p>
                  <p><strong className="text-foreground">Travel authorisation data (passport details):</strong> deleted within 30 days of application completion.</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-3">7. Your Rights Under UK GDPR</h2>
                <p className="text-sm leading-relaxed text-muted-foreground mb-3">You have the following rights:</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">Right to access</strong> — request a copy of your personal data</p>
                  <p><strong className="text-foreground">Right to rectification</strong> — request correction of inaccurate data</p>
                  <p><strong className="text-foreground">Right to erasure</strong> — request deletion of your data (subject to legal retention requirements)</p>
                  <p><strong className="text-foreground">Right to restrict processing</strong> — request we limit how we use your data</p>
                  <p><strong className="text-foreground">Right to data portability</strong> — request your data in a machine-readable format</p>
                  <p><strong className="text-foreground">Right to object</strong> — object to processing based on legitimate interests or for direct marketing</p>
                  <p><strong className="text-foreground">Rights related to automated decision-making</strong> — we do not make solely automated decisions that significantly affect you</p>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  To exercise any of these rights, contact us at <a href="mailto:hello@digitalmoonkey.travel" className="text-primary hover:underline">hello@digitalmoonkey.travel</a>. We will respond within one month.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-3">8. Cookies</h2>
                <p className="text-sm leading-relaxed text-muted-foreground mb-3">We use the following types of cookies:</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">Essential cookies:</strong> required for the website to function. Cannot be disabled.</p>
                  <p><strong className="text-foreground">Analytics cookies:</strong> help us understand how visitors use our site. Used with your consent.</p>
                  <p><strong className="text-foreground">Marketing cookies:</strong> used to track affiliate referrals (Travelpayouts). Used with your consent.</p>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  You can manage cookie preferences through our cookie banner or your browser settings.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-3">9. Complaints</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  If you are unhappy with how we handle your data, you have the right to complain to the Information Commissioner's Office (ICO):<br />
                  <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ico.org.uk</a><br />
                  Helpline: 0303 123 1113
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-3">10. Changes to This Policy</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by a prominent notice on our website.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-3">11. Contact</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  For any privacy-related queries: <a href="mailto:hello@digitalmoonkey.travel" className="text-primary hover:underline">hello@digitalmoonkey.travel</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Privacy;
