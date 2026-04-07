import PageLayout from "@/components/PageLayout";

const Privacy = () => {
  return (
    <PageLayout>
      <section className="section-spacing">
        <div className="container-grid max-w-3xl">
          <h1 className="mb-8">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-6">Last updated: April 2026</p>
          <div className="space-y-8">
            <div><h2 className="text-xl font-bold mb-3">1. Introduction</h2><p className="text-sm text-muted-foreground leading-relaxed">Digital Moonkey Ltd is committed to protecting your personal data in accordance with the UK GDPR and Data Protection Act 2018. Data Controller: Digital Moonkey Ltd, 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ. Company No. 15716386.</p></div>
            <div><h2 className="text-xl font-bold mb-3">2. Information We Collect</h2><p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Personal Data:</strong> Name, email, phone, company name, billing info. <strong className="text-foreground">Usage Data:</strong> IP address, browser type, pages visited. <strong className="text-foreground">Cookies:</strong> See our Cookie Policy.</p></div>
            <div><h2 className="text-xl font-bold mb-3">3. Legal Basis</h2><p className="text-sm text-muted-foreground leading-relaxed">We process data based on: contractual necessity, legitimate interests, consent, and legal obligations.</p></div>
            <div><h2 className="text-xl font-bold mb-3">4. How We Use Your Data</h2><p className="text-sm text-muted-foreground leading-relaxed">To provide services, respond to inquiries, improve our website, comply with legal obligations, and detect fraud.</p></div>
            <div><h2 className="text-xl font-bold mb-3">5. Data Sharing</h2><p className="text-sm text-muted-foreground leading-relaxed">We may share data with trusted service providers, professional advisors, and regulatory authorities. We do not sell personal data.</p></div>
            <div><h2 className="text-xl font-bold mb-3">6. International Transfers</h2><p className="text-sm text-muted-foreground leading-relaxed">Data may be transferred outside the UK with appropriate safeguards including Standard Contractual Clauses.</p></div>
            <div><h2 className="text-xl font-bold mb-3">7. Data Retention</h2><p className="text-sm text-muted-foreground leading-relaxed">We retain data only as long as necessary. Client project data is retained for a minimum of 6 years for legal purposes.</p></div>
            <div><h2 className="text-xl font-bold mb-3">8. Your Rights</h2><p className="text-sm text-muted-foreground leading-relaxed">Under UK GDPR: access, rectification, erasure, restrict processing, data portability, object to processing, withdraw consent. Contact: hello@digitalmoonkey.travel.</p></div>
            <div><h2 className="text-xl font-bold mb-3">9. Children's Privacy</h2><p className="text-sm text-muted-foreground leading-relaxed">Our services are not directed to individuals under 18.</p></div>
            <div><h2 className="text-xl font-bold mb-3">10. Complaints</h2><p className="text-sm text-muted-foreground leading-relaxed">You may lodge a complaint with the ICO at ico.org.uk or call 0303 123 1113.</p></div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Privacy;
