import PageLayout from "@/components/PageLayout";

const Terms = () => {
  return (
    <PageLayout>
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-secondary">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Condiciones del Servicio</h1>
          <p className="text-muted-foreground text-sm mt-2">Última actualización: abril 2026</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl space-y-10 text-sm leading-relaxed">

          <div className="bg-accent/10 border border-accent/20 rounded-xl p-5 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">Aviso importante</p>
            <p>Este documento está redactado en español con fines informativos. En caso de discrepancia, prevalecerá la versión en inglés.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">1. Introducción y aceptación del contrato</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Estas Condiciones del Servicio constituyen un acuerdo legal vinculante entre usted ("el Usuario") y Digital Moonkey Ltd ("la Empresa"), una sociedad registrada en Inglaterra y Gales con número de empresa 15716386, con domicilio social en 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, Reino Unido.</p>
              <p>Al acceder o utilizar nuestros servicios, usted acepta quedar vinculado por estas Condiciones, nuestra Política de Privacidad y nuestra Política de Cookies.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">2. Cuentas de usuario</h2>
            <p className="text-muted-foreground">Para utilizar determinados servicios, deberá crear una cuenta proporcionando información veraz. Usted es responsable de la confidencialidad de su contraseña y de todas las actividades bajo su cuenta. Notifique cualquier uso no autorizado a admin@digitalmoonkey.travel.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">3. Relación con el usuario</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Digital Moonkey actúa como <strong className="text-foreground">intermediario de servicios de visado</strong>. NO somos una entidad gubernamental, embajada ni consulado. NO garantizamos la aprobación de ningún visado. Los tiempos de procesamiento son estimaciones.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">4. Privacidad y seguridad</h2>
            <p className="text-muted-foreground">El tratamiento de sus datos personales se rige por nuestra <a href="/privacidad" className="text-primary hover:underline">Política de Privacidad</a>. Cumplimos con el UK GDPR y la Data Protection Act 2018.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">5. Derechos del usuario</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Acceder a los servicios contratados.</li>
              <li>Solicitar información sobre el estado de su solicitud.</li>
              <li>Cancelar o modificar solicitudes según nuestra política de reembolso.</li>
              <li>Ejercer derechos de protección de datos.</li>
              <li>Presentar reclamación ante la ICO del Reino Unido.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">6. Derechos de Digital Moonkey</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Propiedad intelectual:</strong> Todo el contenido es propiedad de Digital Moonkey Ltd.</li>
              <li><strong className="text-foreground">Modificación de servicios y precios.</strong></li>
              <li><strong className="text-foreground">Rechazo de solicitudes fraudulentas.</strong></li>
              <li><strong className="text-foreground">Monitorización del uso</strong> para cumplimiento y prevención de fraude.</li>
              <li><strong className="text-foreground">Uso de datos anonimizados</strong> para mejora del servicio.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">7. Requisitos de uso</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Ser mayor de 18 años.</li>
              <li>Proporcionar información veraz y completa.</li>
              <li>No utilizar el servicio con fines fraudulentos.</li>
              <li>No realizar scraping ni automatización.</li>
              <li>Verificar documentos de viaje antes del viaje.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">8. Enlaces a terceros</h2>
            <p className="text-muted-foreground">Digital Moonkey no es responsable del contenido ni las prácticas de sitios de terceros enlazados desde nuestro sitio web.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">9. Condiciones comerciales</h2>
            <p className="text-muted-foreground">Precios en <strong className="text-foreground">USD</strong>. Tasas gubernamentales se cobran por separado. Métodos de pago: Visa, Mastercard, PayPal, Apple Pay. Pagos procesados por Stripe (PCI DSS Nivel 1). No almacenamos datos de tarjetas.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">10. Política de reembolso</h2>
            <div className="space-y-3 text-muted-foreground">
              <p><strong className="text-foreground">Reembolso completo:</strong> cancelación antes de iniciar la tramitación o error técnico nuestro.</p>
              <p><strong className="text-foreground">Reembolso parcial:</strong> cancelación después de iniciar pero antes del envío a autoridades.</p>
              <p><strong className="text-foreground">Sin reembolso:</strong> denegación por información incorrecta del usuario, solicitud ya enviada, tasas gubernamentales abonadas.</p>
              <p>Contacte admin@digitalmoonkey.travel con su número de pedido. Plazo: 14 días laborables.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">11. Suspensión y terminación</h2>
            <p className="text-muted-foreground">Podemos suspender o cancelar su cuenta por infracciones, información falsa, actividades ilegales o sospecha de fraude.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">12. Limitación de responsabilidad</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Responsabilidad total limitada al importe pagado. No responsables de decisiones gubernamentales ni retrasos por fuerza mayor.</p>
              <p>Nada excluye responsabilidad por negligencia causante de muerte/lesiones, fraude, ni responsabilidad no excluible por ley.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">13. Indemnización</h2>
            <p className="text-muted-foreground">Usted se compromete a indemnizar a Digital Moonkey Ltd frente a reclamaciones derivadas de su uso del servicio o información incorrecta proporcionada.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">14. Ley aplicable y jurisdicción</h2>
            <p className="text-muted-foreground">Leyes de Inglaterra y Gales. Jurisdicción exclusiva: tribunales de Londres, Reino Unido.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">15. Contacto</h2>
            <div className="bg-secondary rounded-xl p-6 mt-2 space-y-1 text-sm">
              <p className="font-bold text-foreground">Digital Moonkey Ltd</p>
              <p className="text-muted-foreground">Company No. 15716386</p>
              <p className="text-muted-foreground">71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, UK</p>
              <p className="text-muted-foreground">Email: <a href="mailto:admin@digitalmoonkey.travel" className="text-primary hover:underline">admin@digitalmoonkey.travel</a></p>
              <p className="text-muted-foreground">Teléfono: <a href="tel:+376338383" className="text-primary hover:underline">+376 338 383</a></p>
            </div>
          </div>

        </div>
      </section>
    </PageLayout>
  );
};

export default Terms;
