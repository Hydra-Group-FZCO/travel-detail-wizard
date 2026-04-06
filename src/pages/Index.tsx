import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import CountrySelector from "@/components/CountrySelector";
import { popularVisas, type Country } from "@/data/visaCountries";
import {
  Star, ShieldCheck, Clock, Globe, Headphones,
  Search, FileText, Download, Check, X as XIcon,
  ChevronRight
} from "lucide-react";

const Index = () => {
  const [passport, setPassport] = useState<Country | null>(null);
  const [destination, setDestination] = useState<Country | null>(null);

  const stats = [
    { value: "95%+", label: "Tasa de aprobación" },
    { value: "200+", label: "Países cubiertos" },
    { value: "24/7", label: "Soporte disponible" },
    { value: "30+", label: "Nacionalidades atendidas" },
  ];

  const steps = [
    { icon: Search, title: "Encuentra tu visado", desc: "Selecciona tu nacionalidad y destino. Te mostramos exactamente qué documento necesitas y el coste total." },
    { icon: FileText, title: "Completa tu solicitud", desc: "Rellena un formulario sencillo en español. Revisamos cada detalle antes de enviarlo." },
    { icon: Download, title: "Recibe tu visado", desc: "Te lo enviamos por email. Listo para imprimir o mostrar en tu móvil." },
  ];

  const withoutUs = [
    "Horas buscando requisitos en webs gubernamentales confusas",
    "Formularios complicados en idiomas que no dominas",
    "Riesgo de errores que retrasan o rechazan tu solicitud",
    "Sin soporte si algo sale mal",
    "Incertidumbre sobre tiempos y estado de tu solicitud",
  ];

  const withUs = [
    "Toda la información clara y en tu idioma en minutos",
    "Formularios simplificados paso a paso con guía en cada campo",
    "Revisión profesional de tu solicitud antes del envío",
    "Soporte 24/7 por chat, WhatsApp y email",
    "Seguimiento en tiempo real del estado de tu visado",
  ];

  const reviews = [
    { name: "María García", country: "España", text: "Increíblemente fácil. Tuve mi eVisa para Turquía en 24 horas. ¡Muy recomendable!", rating: 5 },
    { name: "Carlos Rodríguez", country: "México", text: "Excelente servicio. El soporte me ayudó con cada paso de mi solicitud para India.", rating: 5 },
    { name: "Ana Martínez", country: "Argentina", text: "La forma más sencilla de tramitar un visado. Ya lo he usado 3 veces.", rating: 5 },
  ];

  const trustItems = [
    { icon: ShieldCheck, label: "Empresa verificada UK" },
    { icon: Clock, label: "Procesamiento rápido" },
    { icon: Star, label: "Excelente en Trustpilot" },
    { icon: Globe, label: "200+ países" },
  ];

  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container-grid">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
              Agencia de visados online
            </p>
            <h1 className="text-primary-foreground mb-5" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}>
              La forma más sencilla de obtener tu{" "}
              <span className="text-accent">visado de viaje</span>
            </h1>
            <p className="text-primary-foreground/75 text-base md:text-lg max-w-xl mx-auto">
              Gestionamos tu visado online de forma rápida, segura y sin complicaciones. Más de 200 países disponibles.
            </p>
          </div>

          {/* Visa Selector */}
          <div className="max-w-2xl mx-auto bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <CountrySelector
                label="Mi pasaporte es de..."
                value={passport}
                onChange={setPassport}
                placeholder="Selecciona tu país"
              />
              <CountrySelector
                label="Quiero viajar a..."
                value={destination}
                onChange={setDestination}
                placeholder="Selecciona destino"
              />
            </div>
            <Button
              size="lg"
              className="w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-base"
              disabled={!passport || !destination}
            >
              Verificar mi visado
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 flex-wrap mt-8">
            {trustItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <item.icon className="w-4 h-4 text-accent" strokeWidth={1.5} />
                <span className="text-primary-foreground/70 text-xs font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-border">
        <div className="container-grid">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl md:text-4xl font-bold text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section-spacing">
        <div className="container-grid">
          <h2 className="text-center mb-12">¿Por qué Digital Moonkey?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Without */}
            <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6">
              <h3 className="text-destructive font-bold mb-4 flex items-center gap-2">
                <XIcon className="w-5 h-5" /> Sin Digital Moonkey
              </h3>
              <ul className="space-y-3">
                {withoutUs.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <XIcon className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* With */}
            <div className="bg-success/5 border border-success/20 rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: "hsl(var(--success))" }}>
                <Check className="w-5 h-5" /> Con Digital Moonkey
              </h3>
              <ul className="space-y-3">
                {withUs.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--success))" }} />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Steps */}
      <section className="section-spacing bg-secondary">
        <div className="container-grid text-center">
          <h2 className="mb-4">¿Cómo funciona?</h2>
          <p className="text-muted-foreground mb-12 max-w-lg mx-auto">
            Obtener tu visado es tan fácil como seguir estos 3 pasos
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
                  <step.icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-accent-foreground rounded-full text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Visas */}
      <section className="section-spacing">
        <div className="container-grid">
          <h2 className="text-center mb-4">Visados populares</h2>
          <p className="text-center text-muted-foreground mb-10">Los documentos de viaje más solicitados por nuestros clientes</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularVisas.map((visa) => (
              <Link
                to={`/visado/${visa.slug}`}
                key={visa.slug}
                className="group bg-card border border-border rounded-xl p-4 hover:shadow-hover hover:border-primary/30 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{visa.flag}</span>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{visa.country}</h4>
                    <p className="text-xs text-muted-foreground">{visa.visaType}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-primary">Desde ${visa.priceFrom}</p>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section-spacing bg-secondary">
        <div className="container-grid text-center">
          <h2 className="mb-4">Miles de viajeros ya confían en nosotros</h2>
          <p className="text-muted-foreground mb-10">Valoración Excelente en Trustpilot</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {reviews.map((r) => (
              <div key={r.name} className="bg-card border border-border rounded-xl p-6 text-left">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{r.text}"</p>
                <div>
                  <p className="text-sm font-bold text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-spacing">
        <div className="container-grid text-center">
          <h2 className="mb-4">Suscríbete a nuestro boletín</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Recibe ofertas exclusivas, guías de viaje y novedades sobre visados directamente en tu correo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-1 px-4 py-3 border border-border rounded-xl text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <Button className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
              Suscribirse
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container-grid text-center">
          <h2 className="text-primary-foreground mb-4">¿Listo para solicitar tu visado?</h2>
          <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">
            Empieza ahora y ten tu visado listo en cuestión de días.
          </p>
          <Button size="lg" className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-base" asChild>
            <Link to="/visados">Solicitar visado ahora</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
