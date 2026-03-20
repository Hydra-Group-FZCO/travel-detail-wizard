import PageLayout from "@/components/PageLayout";
import LegalLanguageNotice from "@/components/LegalLanguageNotice";

const Refunds = () => {
  return (
    <PageLayout>
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-secondary">
        <div className="container-grid">
          <h1>Refund Policy</h1>
          <p className="text-muted-foreground text-sm mt-2">Last updated: March 2026</p>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-grid">
          <div className="max-w-3xl space-y-8">
            <LegalLanguageNotice />
            <p className="text-sm leading-relaxed">
              Digital Moonkey Limited is committed to transparency and fairness in all purchases. This policy sets out the specific refund terms for each of our products and services.
            </p>

            <div className="bg-secondary rounded-xl p-6 space-y-1 text-sm">
              <p className="font-bold text-foreground">Digital Moonkey Limited</p>
              <p className="text-muted-foreground">Company No. 15716386</p>
              <p className="text-muted-foreground">Email: hello@digitalmoonkey.travel</p>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold mb-3">1. eSIM Data Plans</h2>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">Eligible for full refund if:</strong> The eSIM QR code has not been scanned or installed, AND the refund is requested within 14 days of purchase.</p>
                  <p><strong className="text-foreground">Not eligible for refund if:</strong> The eSIM has been installed or activated on any device, OR more than 14 days have passed since purchase, OR the device is not eSIM-compatible (it is the customer's responsibility to verify compatibility before purchase).</p>
                  <p><strong className="text-foreground">Process:</strong> email hello@digitalmoonkey.travel with your order number. Refunds processed within 5-10 business days to the original payment method.</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-3">2. AI Travel Itineraries</h2>
                <p className="text-sm leading-relaxed text-muted-foreground mb-2">
                  Due to the immediate digital delivery and personalised nature of AI-generated itineraries, all sales are final once the itinerary has been generated and delivered.
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">Exception:</strong> if there is a technical failure and the itinerary was not delivered or is unreadable, you are entitled to a full refund or free regeneration. Contact us within 48 hours of purchase.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-3">3. AI Travel Guides</h2>
                <p className="text-sm leading-relaxed text-muted-foreground mb-2">
                  Due to the immediate digital delivery nature of AI-generated guides, all sales are final once the guide has been generated and delivered.
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">Exception:</strong> technical failure resulting in non-delivery or unreadable content. Contact us within 48 hours of purchase for a full refund or free regeneration.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-3">4. Travel Experiences</h2>
                <p className="text-sm leading-relaxed text-muted-foreground mb-3">
                  Refund eligibility depends on the specific experience and operator cancellation policy, which is displayed on each experience listing before purchase.
                </p>
                <p className="text-sm font-bold text-foreground mb-2">General rules:</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Cancellation more than 24 hours before the experience: full refund in most cases (check individual listing).</p>
                  <p>Cancellation less than 24 hours before the experience: no refund in most cases (check individual listing).</p>
                  <p>No-show: no refund.</p>
                  <p>Operator cancellation: full refund within 5-10 business days.</p>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Digital Moonkey processes the booking and payment, but the experience is delivered by an independent operator. Refund eligibility for experiences is determined by the operator's cancellation policy displayed on each listing. We will assist you in processing refund requests with the operator.
                </p>
                <p className="text-sm text-muted-foreground mt-3">
                  For experience refund requests contact <a href="mailto:hello@digitalmoonkey.travel" className="text-primary hover:underline">hello@digitalmoonkey.travel</a> with your booking reference.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-3">5. Travel Authorisation Assistance (ESTA / eVisa / ETIAS)</h2>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Our fee covers the assistance service and includes applicable government fees.</p>
                  <p>If you cancel before we begin processing your application: full refund within 5-10 business days.</p>
                  <p>If processing has already begun: partial refund of the service fee only, minus government fees already submitted (these are non-recoverable).</p>
                  <p>If your application is rejected by the government authority: we will refund the service fee portion only. Government fees are non-refundable as they are paid directly to the relevant authority.</p>
                  <p className="font-semibold text-foreground">We make no guarantee of approval. Application decisions rest solely with the relevant government authority.</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-3">6. How to Request a Refund</h2>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Email: <a href="mailto:hello@digitalmoonkey.travel" className="text-primary hover:underline">hello@digitalmoonkey.travel</a></p>
                  <p>Subject line: Refund Request · [your order number]</p>
                  <p>Include: your name, order number, product purchased, and reason for refund request.</p>
                  <p>We aim to respond within 2 business days and process approved refunds within 5-10 business days to the original payment method.</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-3">7. Your Statutory Rights</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  If you are a consumer based in the UK or European Union, you may have additional rights under the UK Consumer Rights Act 2015, the Consumer Contracts Regulations 2013, and/or the EU Consumer Rights Directive. Nothing in this Refund Policy affects your statutory rights. For guidance on your consumer rights, visit Citizens Advice at <a href="https://www.citizensadvice.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">citizensadvice.org.uk</a>.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-3">9. Contact</h2>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><a href="mailto:hello@digitalmoonkey.travel" className="text-primary hover:underline">hello@digitalmoonkey.travel</a></p>
                  <p>Digital Moonkey Limited</p>
                  <p>71-75 Shelton Street, Covent Garden, London, WC2H 9JQ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Refunds;
