import PageLayout from "@/components/PageLayout";

const Legal = () => {
  return (
    <PageLayout>
      <section className="section-spacing">
        <div className="container-grid">
          <div className="max-w-3xl">
            <h1 className="mb-8">Important Disclaimer</h1>

            <div className="prose-section space-y-6">
              <p className="text-base leading-relaxed">
                Digital Moonkey Ltd ("we", "us", "our") is a private company providing personal assistance and support services to travellers. We are <strong>NOT</strong> a government agency and are <strong>NOT</strong> affiliated with any embassy, consulate, immigration authority, or official body in any country.
              </p>

              <p className="text-base leading-relaxed">
                Our services consist of personal assistance with documentation, application processes, travel preparation, and related support services. We do not issue, approve, or guarantee the issuance of any visa, travel authorisation, or official document. The outcome of any application depends entirely on the relevant official authority.
              </p>

              <p className="text-base leading-relaxed">
                Our service fees are charged for our personal assistance and are entirely separate from any official government fees, application fees, or processing fees that may be required by the relevant authority. Applicants have the right to apply directly through official government channels without using our services, which may be available at no cost or at a lower cost.
              </p>

              <p className="text-base leading-relaxed">
                By using our services, you acknowledge that you understand the nature of our service as described above.
              </p>
            </div>

            <div className="mt-16 bg-card border border-border rounded-lg p-8 shadow-card">
              <h3 className="text-xl mb-6 font-serif">Company Information</h3>
              <div className="space-y-3 text-sm">
                <p className="font-semibold text-foreground font-sans">Digital Moonkey Ltd</p>
                <p className="text-muted-foreground">Registered in England and Wales</p>
                <p className="text-muted-foreground">Director: Tomás Pacheco Martín</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Legal;
