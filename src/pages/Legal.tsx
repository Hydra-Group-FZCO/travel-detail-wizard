import PageLayout from "@/components/PageLayout";

const Legal = () => {
  return (
    <PageLayout>
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-secondary">
        <div className="container-grid">
          <h1>Important Disclaimer</h1>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-grid max-w-3xl space-y-8 text-sm text-muted-foreground leading-relaxed">
          <p>Digital Moonkey Ltd is a private company providing personal assistance and support services to travellers. We are NOT a government agency and are NOT affiliated with any embassy, consulate, immigration authority, or official body.</p>
          <p>Our services consist of personal assistance with documentation, application processes, travel preparation, and related support services. We do not issue, approve, or guarantee the issuance of any visa, travel authorisation, or official document.</p>
          <p>Our service fees are charged for our personal assistance and are entirely separate from any official government fees. Applicants have the right to apply directly through official government channels without using our services.</p>
          <p>By using our services, you acknowledge that you understand the nature of our service as described above.</p>

          <div className="bg-secondary rounded-xl p-6 space-y-1">
            <p className="font-bold text-foreground">Company Information</p>
            <p className="text-foreground font-medium">Digital Moonkey Ltd</p>
            <p>Registered in England and Wales – Company No. 15716386</p>
            <p>71-75 Shelton Street, Covent Garden, London, WC2H 9JQ</p>
            <p>Director: Tomás Pacheco Martín</p>
            <p>Email: <a href="mailto:hello@digitalmoonkey.travel" className="text-primary hover:underline">hello@digitalmoonkey.travel</a></p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Legal;
