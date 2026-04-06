import PageLayout from "@/components/PageLayout";
import { ShieldCheck, Globe, Headphones, Zap } from "lucide-react";

const About = () => {
  const highlights = [
    { icon: ShieldCheck, title: "Empresa registrada en UK", desc: "Company No. 15716386 – Registrada en Inglaterra y Gales" },
    { icon: Globe, title: "Equipo internacional", desc: "Profesionales de viajes e inmigración de todo el mundo" },
    { icon: Zap, title: "Tecnología propia", desc: "Plataforma avanzada para agilizar solicitudes" },
    { icon: Headphones, title: "Soporte multilingüe 24/7", desc: "Siempre disponibles cuando nos necesites" },
  ];

  return (
    <PageLayout>
      <section className="section-spacing">
        <div className="container-grid max-w-3xl">
          <h1 className="mb-6">Hacemos que viajar sea fácil para todos</h1>
          <p className="text-base md:text-lg mb-6 leading-relaxed">
            Digital Moonkey es una plataforma online especializada en la gestión de visados y documentos de viaje.
            Nuestra misión es simplificar los trámites de viaje para que puedas centrarte en lo que realmente importa: disfrutar de tu aventura.
          </p>
          <p className="text-base md:text-lg leading-relaxed">
            Fundada en 2024 y registrada en el Reino Unido, nuestra empresa combina tecnología avanzada con un equipo humano dedicado
            para ofrecerte el proceso de solicitud de visado más sencillo y fiable del mercado.
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container-grid">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {highlights.map((h) => (
              <div key={h.title} className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <h.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-bold mb-1">{h.title}</h3>
                <p className="text-xs text-muted-foreground">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-secondary">
        <div className="container-grid max-w-3xl text-center">
          <h2 className="mb-6">Nuestra oficina</h2>
          <div className="bg-card border border-border rounded-xl p-8 inline-block text-left">
            <p className="text-sm font-bold text-foreground mb-2">Digital Moonkey Ltd</p>
            <p className="text-sm text-muted-foreground">71-75 Shelton Street, Covent Garden</p>
            <p className="text-sm text-muted-foreground">London, WC2H 9JQ, United Kingdom</p>
            <p className="text-sm text-muted-foreground mt-3">📞 +376 338 383</p>
            <p className="text-sm text-muted-foreground">✉️ admin@digitalmoonkey.travel</p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
