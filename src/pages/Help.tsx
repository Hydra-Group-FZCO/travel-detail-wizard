import PageLayout from "@/components/PageLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, CreditCard, FileText, BookOpen } from "lucide-react";

const faqCategories = [
  {
    title: "Sobre el servicio",
    icon: HelpCircle,
    items: [
      { q: "¿Qué es Digital Moonkey?", a: "Digital Moonkey es una plataforma online especializada en la gestión de visados y documentos de viaje. Simplificamos el proceso de solicitud para que puedas obtener tu visado de forma rápida, segura y sin complicaciones." },
      { q: "¿Son una agencia del gobierno?", a: "No. Digital Moonkey es una empresa privada que actúa como intermediario para facilitar la gestión de solicitudes de visado. No somos una entidad gubernamental, embajada ni consulado." },
      { q: "¿Cómo funciona el proceso?", a: "Es muy sencillo: 1) Selecciona tu nacionalidad y destino para verificar qué documento necesitas. 2) Completa un formulario guiado en español con tus datos. 3) Nuestro equipo revisa tu solicitud y la envía a las autoridades competentes. 4) Recibes tu visado por email listo para imprimir o mostrar en tu móvil." },
      { q: "¿Cuánto tiempo tarda?", a: "Los tiempos de procesamiento varían según el tipo de visado y el país de destino. En general, los visados electrónicos (eVisa, ETA, ESTA) se procesan entre 24 horas y 5 días laborables. Ofrecemos opciones de procesamiento urgente y super urgente para la mayoría de destinos." },
    ],
  },
  {
    title: "Sobre pagos",
    icon: CreditCard,
    items: [
      { q: "¿Qué métodos de pago aceptan?", a: "Aceptamos Visa, Mastercard, PayPal y Apple Pay. Todos los pagos se procesan de forma segura a través de Stripe, certificado con el estándar PCI DSS Nivel 1." },
      { q: "¿El precio incluye la tasa gubernamental?", a: "Los precios mostrados incluyen nuestra tarifa de servicio. Las tasas gubernamentales o consulares, cuando las hay, se indican claramente por separado antes de confirmar el pago." },
      { q: "¿Puedo obtener un reembolso?", a: "Sí, en determinadas circunstancias. Si cancela antes de que iniciemos la tramitación, recibirá un reembolso completo. Para más detalles, consulte nuestras Condiciones del Servicio o contacte con nuestro equipo de soporte." },
      { q: "¿En qué moneda se cobra?", a: "Todos los precios se expresan y cobran en dólares estadounidenses (USD)." },
    ],
  },
  {
    title: "Sobre solicitudes",
    icon: FileText,
    items: [
      { q: "¿Cómo compruebo el estado de mi solicitud?", a: "Inicie sesión en su cuenta y acceda a la sección 'Mis solicitudes' en su panel de usuario. Allí podrá ver el estado actualizado de todas sus solicitudes. También le enviaremos notificaciones por email con cada actualización." },
      { q: "¿Qué hago si mi visado es rechazado?", a: "Si su visado es rechazado, le informaremos inmediatamente del motivo y le asesoraremos sobre los pasos a seguir. En algunos casos, es posible volver a presentar la solicitud con la documentación corregida." },
      { q: "¿Puedo modificar mi solicitud después de enviarla?", a: "Puede solicitar modificaciones siempre que la solicitud no haya sido enviada a las autoridades competentes. Contacte con nuestro equipo de soporte lo antes posible a través de admin@digitalmoonkey.travel." },
      { q: "¿Necesito imprimir mi eVisa?", a: "Depende del país de destino. Algunos países aceptan el visado electrónico en formato digital (en su móvil), mientras que otros requieren una copia impresa. Le indicaremos claramente qué formato necesita al entregar su visado." },
    ],
  },
  {
    title: "Sobre documentos",
    icon: Passport,
    items: [
      { q: "¿Qué documentos necesito?", a: "Los documentos requeridos varían según el tipo de visado y el país de destino. En general, necesitará: pasaporte vigente, fotografía tipo pasaporte, itinerario de viaje y, en algunos casos, comprobante de alojamiento y medios económicos. Le indicaremos los requisitos exactos al iniciar su solicitud." },
      { q: "¿Qué requisitos tiene la foto de pasaporte?", a: "La foto debe ser reciente (menos de 6 meses), con fondo blanco, rostro centrado y sin accesorios que oculten el rostro. Los requisitos exactos de tamaño y formato varían según el país. Nuestro sistema le guiará con los requisitos específicos." },
      { q: "¿Mi pasaporte necesita cierta vigencia?", a: "Sí, la mayoría de países exigen que el pasaporte tenga una vigencia mínima de 6 meses a partir de la fecha de entrada. Algunos países requieren vigencia de 3 meses. Verificaremos este requisito durante el proceso de solicitud." },
    ],
  },
];

const Help = () => {
  return (
    <PageLayout>
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-secondary">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Centro de Ayuda</h1>
          <p className="text-muted-foreground mt-2">Respuestas a las preguntas más frecuentes sobre nuestros servicios.</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl space-y-12">
          {faqCategories.map((cat) => (
            <div key={cat.title}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <cat.icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">{cat.title}</h2>
              </div>
              <Accordion type="single" collapsible className="space-y-2">
                {cat.items.map((item, i) => (
                  <AccordionItem key={i} value={`${cat.title}-${i}`} className="border border-border rounded-lg px-4">
                    <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-4">{item.q}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground pb-4">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}

          <div className="bg-secondary rounded-xl p-8 text-center">
            <h3 className="text-lg font-bold text-foreground mb-2">¿No encuentras lo que buscas?</h3>
            <p className="text-sm text-muted-foreground mb-4">Nuestro equipo de soporte está disponible 24/7 para ayudarte.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/contacto" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors">Contactar soporte</a>
              <a href="https://wa.me/376338383" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-lg border border-border bg-background text-foreground px-6 py-2.5 text-sm font-medium hover:bg-secondary transition-colors">WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Help;
