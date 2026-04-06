import { useParams, Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { popularVisas } from "@/data/visaCountries";
import { Clock, FileCheck, Globe, Star, ShieldCheck, Zap, Timer } from "lucide-react";
import { useState } from "react";

const processingOptions = [
  { label: "Estándar", time: "5-7 días laborables", multiplier: 1, icon: Clock },
  { label: "Urgente", time: "2-3 días laborables", multiplier: 1.5, icon: Zap },
  { label: "Super Urgente", time: "24 horas", multiplier: 2.5, icon: Timer },
];

const VisaDetail = () => {
  const { slug } = useParams();
  const visa = popularVisas.find((v) => v.slug === slug);
  const [selectedSpeed, setSelectedSpeed] = useState(0);

  if (!visa) {
    return (
      <PageLayout>
        <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-secondary">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-2xl font-bold text-foreground">Visado no encontrado</h1>
            <p className="text-muted-foreground mt-2">El visado solicitado no existe. <Link to="/" className="text-primary hover:underline">Volver al inicio</Link>.</p>
          </div>
        </section>
      </PageLayout>
    );
  }

  const price = visa.priceFrom * processingOptions[selectedSpeed].multiplier;

  return (
    <PageLayout>
      {/* Hero */}
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-secondary">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{visa.flag}</span>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">{visa.country}</h1>
                  <p className="text-muted-foreground">{visa.visaType}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-4">
                <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> Entrada única / múltiple</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Validez: 90 días</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Tasa de aprobación: 98%</span>
              </div>
            </div>
            <div className="bg-background rounded-xl border border-border p-6 min-w-[260px] shadow-sm">
              <p className="text-xs text-muted-foreground mb-1">Precio desde</p>
              <p className="text-3xl font-bold text-foreground">${price.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">USD</span></p>
              <div className="mt-4 space-y-2">
                {processingOptions.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSpeed(i)}
                    className={`w-full flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${selectedSpeed === i ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:border-primary/50"}`}
                  >
                    <span className="flex items-center gap-2"><opt.icon className="w-4 h-4" /> {opt.label}</span>
                    <span className="text-xs">{opt.time}</span>
                  </button>
                ))}
              </div>
              <button className="w-full mt-4 rounded-lg bg-accent text-accent-foreground font-semibold py-3 text-sm hover:bg-accent/90 transition-colors">
                Solicitar ahora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <Tabs defaultValue="resumen" className="w-full">
            <TabsList className="mb-8 w-full justify-start overflow-x-auto">
              <TabsTrigger value="resumen">Resumen</TabsTrigger>
              <TabsTrigger value="requisitos">Requisitos</TabsTrigger>
              <TabsTrigger value="proceso">Cómo solicitarlo</TabsTrigger>
              <TabsTrigger value="faq">Preguntas frecuentes</TabsTrigger>
              <TabsTrigger value="resenas">Reseñas</TabsTrigger>
            </TabsList>

            <TabsContent value="resumen" className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Tipo de documento", value: visa.visaType },
                  { label: "Validez", value: "90 días desde la emisión" },
                  { label: "Entradas permitidas", value: "Única o múltiple (según tipo)" },
                  { label: "Tiempo de procesamiento", value: "1-7 días laborables" },
                ].map((item) => (
                  <div key={item.label} className="bg-secondary rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                El {visa.visaType} para {visa.country} es un documento de autorización de viaje electrónico que permite a ciudadanos elegibles ingresar al país para fines turísticos, de negocios o tránsito. El documento se envía por correo electrónico y puede presentarse en formato digital o impreso a su llegada.
              </p>
            </TabsContent>

            <TabsContent value="requisitos" className="space-y-4 text-sm text-muted-foreground">
              <h3 className="text-lg font-bold text-foreground">Documentos necesarios</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Pasaporte vigente con al menos 6 meses de validez</li>
                <li>Fotografía digital tipo pasaporte (reciente, fondo blanco)</li>
                <li>Dirección de correo electrónico válida</li>
                <li>Tarjeta de crédito o débito para el pago</li>
                <li>Itinerario de viaje (fechas de entrada y salida)</li>
                <li>Comprobante de alojamiento (en algunos casos)</li>
              </ul>
            </TabsContent>

            <TabsContent value="proceso" className="space-y-6">
              {[
                { step: 1, title: "Complete el formulario", desc: "Rellene nuestro formulario simplificado en español con sus datos personales y de viaje. Solo le llevará unos minutos." },
                { step: 2, title: "Revisión profesional", desc: "Nuestro equipo revisa cada detalle de su solicitud para asegurar que todo es correcto antes del envío." },
                { step: 3, title: "Procesamiento", desc: "Enviamos su solicitud a las autoridades competentes y hacemos seguimiento del proceso." },
                { step: 4, title: "Reciba su visado", desc: "Una vez aprobado, le enviamos su visado por email. Listo para imprimir o mostrar en su móvil." },
              ].map((s) => (
                <div key={s.step} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">{s.step}</div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{s.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="faq">
              <Accordion type="single" collapsible className="space-y-2">
                {[
                  { q: `¿Cuánto tarda en procesarse el ${visa.visaType} para ${visa.country}?`, a: "El tiempo de procesamiento varía entre 24 horas y 7 días laborables, dependiendo de la opción de velocidad que elija." },
                  { q: "¿Puedo solicitar el visado para otra persona?", a: "Sí, puede solicitar el visado en nombre de un familiar o amigo siempre que disponga de sus datos personales y documentos requeridos." },
                  { q: "¿Qué pasa si mi solicitud es rechazada?", a: "Le informaremos del motivo del rechazo y le asesoraremos sobre los pasos a seguir. En muchos casos, es posible volver a solicitar con la documentación corregida." },
                  { q: "¿El visado electrónico es válido en todos los puntos de entrada?", a: "En la mayoría de los casos, sí. Sin embargo, algunos países restringen la entrada con eVisa a determinados puertos o aeropuertos. Le indicaremos esta información al procesar su solicitud." },
                  { q: "¿Necesito seguro de viaje?", a: "Aunque no siempre es obligatorio para el visado, recomendamos encarecidamente contratar un seguro de viaje. Algunos países lo exigen como requisito de entrada." },
                ].map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-lg px-4">
                    <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-4">{item.q}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground pb-4">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="resenas" className="space-y-4">
              {[
                { name: "María García", country: "España", stars: 5, text: `Excelente servicio. Obtuve mi ${visa.visaType} para ${visa.country} en solo 2 días. Todo muy claro y fácil.`, date: "Febrero 2026" },
                { name: "Carlos Rodríguez", country: "México", stars: 5, text: "Muy profesionales. Me ayudaron con todas mis dudas y el visado llegó antes de lo esperado.", date: "Enero 2026" },
                { name: "Ana Martínez", country: "Argentina", stars: 4, text: "Buen servicio en general. El proceso fue sencillo aunque tardó un poco más de lo estimado.", date: "Marzo 2026" },
              ].map((rev, i) => (
                <div key={i} className="bg-secondary rounded-xl p-5">
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: rev.stars }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{rev.text}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{rev.name} · {rev.country}</span>
                    <span>{rev.date}</span>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </PageLayout>
  );
};

export default VisaDetail;
