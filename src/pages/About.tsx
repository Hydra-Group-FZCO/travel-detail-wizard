import PageLayout from "@/components/PageLayout";

const About = () => {
  return (
    <PageLayout>
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-secondary">
        <div className="container-grid">
          <h1 className="mb-4">About Digital Moonkey</h1>
          <p className="text-base md:text-lg max-w-2xl">
            A UK-registered company specialising in personal assistance services for travellers and the tourism sector.
          </p>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-grid">
          <div className="max-w-3xl">
            <p className="text-base leading-relaxed mb-6">
              We started with a simple observation: preparing for international travel involves navigating complex requirements that change frequently, vary by nationality, and are spread across multiple official sources. We built Digital Moonkey to bring clarity and personal support to that process.
            </p>

            <h2 className="mt-14 mb-5">What we do</h2>
            <p className="text-sm leading-relaxed mb-6">
              We help individual and corporate travellers with the practical aspects of travel preparation — from documentation and applications to connectivity and insurance. Our team combines travel industry knowledge with a commitment to accuracy and customer service.
            </p>

            <h2 className="mt-14 mb-5">How we work</h2>
            <ul className="space-y-3">
              {[
                "We provide guidance and assistance — we do not make decisions for you",
                "We are transparent about what our services include and what they cost",
                "We clearly distinguish our private services from official government processes",
                "We are available before, during, and after the application process",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-16 bg-secondary rounded-xl p-8">
              <h3 className="text-xl font-bold mb-5">Company Information</h3>
              <div className="space-y-2 text-sm">
                <p className="font-bold text-foreground">Digital Moonkey Ltd</p>
                <p className="text-muted-foreground">Company registered in England and Wales</p>
                <p className="text-muted-foreground">Director: Tomás Pacheco Martín</p>
                <p className="text-muted-foreground">Website: digitalmoonkey.travel</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
