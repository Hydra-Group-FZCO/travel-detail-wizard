import PageLayout from "@/components/PageLayout";

const Terms = () => {
  return (
    <PageLayout>
      <section className="section-spacing">
        <div className="container-grid max-w-3xl">
          <h1 className="mb-8">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-6">Last updated: April 2026</p>
          <div className="space-y-8">
            <div><h2 className="text-xl font-bold mb-3">1. Acceptance of Terms</h2><p className="text-sm text-muted-foreground leading-relaxed">By accessing or using the services provided by Digital Moonkey Ltd ("Company", "we", "us", or "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p></div>
            <div><h2 className="text-xl font-bold mb-3">2. Services Description</h2><p className="text-sm text-muted-foreground leading-relaxed">Digital Moonkey Ltd provides technology services including but not limited to software development, artificial intelligence solutions, digital marketing, and cybersecurity consulting. The specific scope, deliverables, and timeline of services will be defined in individual project agreements or statements of work.</p></div>
            <div><h2 className="text-xl font-bold mb-3">3. User Accounts</h2><p className="text-sm text-muted-foreground leading-relaxed">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p></div>
            <div><h2 className="text-xl font-bold mb-3">4. Intellectual Property Rights</h2><p className="text-sm text-muted-foreground leading-relaxed">Unless otherwise agreed in writing, all intellectual property rights in materials created by Digital Moonkey Ltd shall remain with the Company until full payment is received. Upon full payment, ownership of deliverables will transfer to the client as specified in the project agreement.</p></div>
            <div><h2 className="text-xl font-bold mb-3">5. Payment Terms</h2><p className="text-sm text-muted-foreground leading-relaxed">Payment terms will be specified in individual project agreements. Unless otherwise stated, invoices are due within 30 days of issue. Late payments may incur interest at a rate of 8% above the Bank of England base rate, in accordance with the Late Payment of Commercial Debts (Interest) Act 1998.</p></div>
            <div><h2 className="text-xl font-bold mb-3">6. Confidentiality</h2><p className="text-sm text-muted-foreground leading-relaxed">Both parties agree to maintain the confidentiality of any proprietary or confidential information disclosed during the course of the engagement. This obligation shall survive the termination of these terms.</p></div>
            <div><h2 className="text-xl font-bold mb-3">7. Limitation of Liability</h2><p className="text-sm text-muted-foreground leading-relaxed">To the maximum extent permitted by law, Digital Moonkey Ltd shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues. Our total liability shall not exceed the total amount paid by you to us in the twelve (12) months preceding the claim.</p></div>
            <div><h2 className="text-xl font-bold mb-3">8. Indemnification</h2><p className="text-sm text-muted-foreground leading-relaxed">You agree to indemnify and hold harmless Digital Moonkey Ltd, its directors, officers, and employees from any claims, damages, or expenses arising from your use of our services or your breach of these terms.</p></div>
            <div><h2 className="text-xl font-bold mb-3">9. Termination</h2><p className="text-sm text-muted-foreground leading-relaxed">Either party may terminate the engagement by providing 30 days' written notice. Upon termination, the client shall pay for all services rendered up to the date of termination.</p></div>
            <div><h2 className="text-xl font-bold mb-3">10. Governing Law</h2><p className="text-sm text-muted-foreground leading-relaxed">These Terms of Service shall be governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of London, England.</p></div>
            <div><h2 className="text-xl font-bold mb-3">11. Contact</h2><p className="text-sm text-muted-foreground leading-relaxed">Digital Moonkey Ltd<br />71-75 Shelton Street, Covent Garden, London, WC2H 9JQ<br />Email: hello@digitalmoonkey.travel • Phone: +44 20 7946 0958</p></div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Terms;
