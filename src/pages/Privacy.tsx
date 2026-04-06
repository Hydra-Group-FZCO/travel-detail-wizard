import PageLayout from "@/components/PageLayout";

const Privacy = () => {
  return (
    <PageLayout>
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-secondary">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Política de Privacidad</h1>
          <p className="text-muted-foreground text-sm mt-2">Última actualización: abril 2026</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl space-y-10 text-sm leading-relaxed">

          <div className="bg-accent/10 border border-accent/20 rounded-xl p-5 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">Aviso importante</p>
            <p>Este documento está redactado en español con fines informativos. En caso de discrepancia, prevalecerá la versión en inglés.</p>
          </div>

          <p className="text-muted-foreground">
            Esta Política de Privacidad explica cómo Digital Moonkey Ltd ("nosotros", "la Empresa") recopila, utiliza, comparte y protege sus datos personales cuando utiliza nuestro sitio web digitalmoonkey.travel y servicios asociados. Cumplimos con el Reglamento General de Protección de Datos del Reino Unido (UK GDPR), la Ley de Protección de Datos de 2018 (Data Protection Act 2018) y el RGPD de la UE cuando resulta aplicable.
          </p>

          <div className="bg-secondary rounded-xl p-6 space-y-1 text-sm">
            <p className="font-bold text-foreground">Responsable del tratamiento</p>
            <p className="text-muted-foreground">Digital Moonkey Ltd · Company No. 15716386</p>
            <p className="text-muted-foreground">71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, UK</p>
            <p className="text-muted-foreground">Email: <a href="mailto:admin@digitalmoonkey.travel" className="text-primary hover:underline">admin@digitalmoonkey.travel</a></p>
          </div>

          {/* 1 */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">1. Información que recopilamos</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Recopilamos los siguientes tipos de datos personales:</p>
              <p><strong className="text-foreground">Datos proporcionados directamente por usted:</strong> nombre completo, dirección de correo electrónico, número de teléfono, dirección postal, país de residencia, datos del pasaporte (número, fecha de emisión y expiración, nacionalidad), fotografías de pasaporte, información de viaje (destino, fechas, motivo del viaje).</p>
              <p><strong className="text-foreground">Datos recopilados automáticamente:</strong> dirección IP, tipo de navegador y versión, sistema operativo, dispositivo utilizado, páginas visitadas, tiempo de permanencia, fuente de referencia, cookies y tecnologías similares.</p>
              <p><strong className="text-foreground">Datos de terceros:</strong> información de procesadores de pago (Stripe), datos de redes sociales si inicia sesión con Google, información de análisis web.</p>
            </div>
          </div>

          {/* 2 */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">2. Información que usted proporciona directamente</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Recopilamos información personal en las siguientes circunstancias:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-foreground">Al crear una cuenta:</strong> nombre, email, teléfono, país de residencia, contraseña (almacenada cifrada).</li>
                <li><strong className="text-foreground">Al realizar una solicitud de visado:</strong> datos del pasaporte, fotografías, información del viaje, datos adicionales requeridos por las autoridades del país de destino.</li>
                <li><strong className="text-foreground">Al contactar con soporte:</strong> nombre, email, asunto y contenido de su consulta.</li>
                <li><strong className="text-foreground">Al suscribirse al boletín:</strong> dirección de correo electrónico.</li>
              </ul>
            </div>
          </div>

          {/* 3 */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">3. Información recopilada automáticamente</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Cuando visita nuestro sitio web, recopilamos automáticamente cierta información técnica mediante cookies, píxeles de seguimiento y tecnologías similares. Esta información incluye:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Registros del servidor (logs): dirección IP, fecha y hora de acceso, páginas solicitadas.</li>
                <li>Datos de navegación: patrones de uso, interacciones con el sitio, funcionalidades utilizadas.</li>
                <li>Información del dispositivo: tipo de dispositivo, resolución de pantalla, sistema operativo, navegador.</li>
              </ul>
            </div>
          </div>

          {/* 4 */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">4. Cookies y tecnologías similares</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Utilizamos los siguientes tipos de cookies:</p>
              <p><strong className="text-foreground">Estrictamente necesarias:</strong> cookies de sesión, autenticación y seguridad. No pueden desactivarse.</p>
              <p><strong className="text-foreground">Funcionales:</strong> preferencias de idioma, configuración del usuario.</p>
              <p><strong className="text-foreground">Analíticas:</strong> Google Analytics para comprender cómo se utiliza nuestro sitio. Requieren su consentimiento.</p>
              <p><strong className="text-foreground">Publicitarias:</strong> remarketing y publicidad personalizada. Requieren su consentimiento.</p>
              <p>Para más información, consulte nuestra <a href="/cookies" className="text-primary hover:underline">Política de Cookies</a>.</p>
            </div>
          </div>

          {/* 5 */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">5. Información de terceros</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Podemos recibir datos personales de las siguientes fuentes:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-foreground">Stripe, Inc.:</strong> confirmación de pagos e información de transacciones (no recibimos datos completos de tarjetas).</li>
                <li><strong className="text-foreground">Google:</strong> si utiliza inicio de sesión con Google, recibimos su nombre y dirección de email.</li>
                <li><strong className="text-foreground">Plataformas de análisis:</strong> datos anonimizados de uso y tráfico.</li>
              </ul>
            </div>
          </div>

          {/* 6 */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">6. Uso de sus datos personales</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Utilizamos sus datos personales para los siguientes fines y bases legales:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Procesar y gestionar sus solicitudes de visado · <em>Base legal: Ejecución de contrato (Art. 6(1)(b))</em></li>
                <li>Gestionar su cuenta de usuario · <em>Base legal: Ejecución de contrato (Art. 6(1)(b))</em></li>
                <li>Procesar pagos · <em>Base legal: Ejecución de contrato (Art. 6(1)(b))</em></li>
                <li>Enviar confirmaciones de pedido y actualizaciones de estado · <em>Base legal: Ejecución de contrato (Art. 6(1)(b))</em></li>
                <li>Enviar comunicaciones de marketing (solo con su consentimiento) · <em>Base legal: Consentimiento (Art. 6(1)(a))</em></li>
                <li>Mejorar nuestro sitio web y servicios · <em>Base legal: Interés legítimo (Art. 6(1)(f))</em></li>
                <li>Cumplir con obligaciones legales y fiscales · <em>Base legal: Obligación legal (Art. 6(1)(c))</em></li>
                <li>Detectar y prevenir fraude · <em>Base legal: Interés legítimo (Art. 6(1)(f))</em></li>
              </ul>
            </div>
          </div>

          {/* 7 */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">7. Divulgación de datos personales</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Compartimos sus datos únicamente con:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-foreground">Proveedores de servicios:</strong> Stripe (pagos), Supabase (infraestructura), proveedores de email transaccional.</li>
                <li><strong className="text-foreground">Autoridades gubernamentales:</strong> embajadas, consulados y organismos de inmigración para el procesamiento de sus solicitudes de visado.</li>
                <li><strong className="text-foreground">Por requerimiento legal:</strong> cuando sea necesario para cumplir con una obligación legal, orden judicial o proceso legal.</li>
                <li><strong className="text-foreground">En caso de reorganización empresarial:</strong> en el supuesto de fusión, adquisición o venta de activos, sus datos podrán ser transferidos, previa notificación.</li>
              </ul>
              <p className="font-semibold text-foreground mt-3">No vendemos sus datos personales a terceros.</p>
            </div>
          </div>

          {/* 8 */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">8. Análisis y publicidad personalizada</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Utilizamos Google Analytics para comprender cómo los visitantes interactúan con nuestro sitio web. Esta información se utiliza para mejorar la experiencia del usuario y la eficacia de nuestros servicios.</p>
              <p>Puede desactivar Google Analytics instalando el <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">complemento de inhabilitación de Google Analytics</a> en su navegador.</p>
              <p>Si utiliza publicidad personalizada, puede gestionar sus preferencias a través de la <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">configuración de anuncios de Google</a>.</p>
            </div>
          </div>

          {/* 9 */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">9. Sus derechos</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Bajo el UK GDPR y el RGPD de la UE, usted tiene los siguientes derechos:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-foreground">Derecho de acceso:</strong> solicitar una copia de sus datos personales.</li>
                <li><strong className="text-foreground">Derecho de rectificación:</strong> solicitar la corrección de datos inexactos.</li>
                <li><strong className="text-foreground">Derecho de supresión:</strong> solicitar la eliminación de sus datos (sujeto a obligaciones legales de retención).</li>
                <li><strong className="text-foreground">Derecho de portabilidad:</strong> solicitar sus datos en formato legible por máquina.</li>
                <li><strong className="text-foreground">Derecho de oposición:</strong> oponerse al tratamiento basado en intereses legítimos o con fines de marketing directo.</li>
                <li><strong className="text-foreground">Derecho de limitación:</strong> solicitar que limitemos el uso de sus datos.</li>
                <li><strong className="text-foreground">Derecho a retirar el consentimiento:</strong> en cualquier momento, sin que afecte a la licitud del tratamiento previo.</li>
              </ul>
              <p>Para ejercer cualquiera de estos derechos, contacte con <a href="mailto:admin@digitalmoonkey.travel" className="text-primary hover:underline">admin@digitalmoonkey.travel</a>. Responderemos en un plazo máximo de un mes.</p>
              <p>Si no está satisfecho con nuestra respuesta, puede presentar una reclamación ante la <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Information Commissioner's Office (ICO)</a> — Línea de ayuda: 0303 123 1113.</p>
            </div>
          </div>

          {/* 10 */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">10. Retención de datos</h2>
            <div className="space-y-3 text-muted-foreground">
              <p><strong className="text-foreground">Datos de cuenta:</strong> mientras su cuenta esté activa, más 6 años tras el cierre por motivos legales y fiscales.</p>
              <p><strong className="text-foreground">Datos de pedidos:</strong> 7 años conforme a la legislación fiscal del Reino Unido.</p>
              <p><strong className="text-foreground">Datos de pasaporte:</strong> eliminados en un plazo de 30 días tras la finalización de la solicitud.</p>
              <p><strong className="text-foreground">Preferencias de marketing:</strong> hasta que retire su consentimiento.</p>
              <p><strong className="text-foreground">Datos técnicos (logs):</strong> 12 meses.</p>
            </div>
          </div>

          {/* 11 */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">11. Seguridad</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos, incluyendo:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Cifrado de datos en tránsito (TLS/SSL) y en reposo.</li>
                <li>Acceso restringido a datos personales basado en el principio de mínimo privilegio.</li>
                <li>Autenticación multifactor para el acceso a sistemas internos.</li>
                <li>Auditorías de seguridad periódicas.</li>
                <li>Planes de respuesta a incidentes de seguridad.</li>
              </ul>
            </div>
          </div>

          {/* 12 */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">12. Transferencias internacionales</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Algunos de nuestros proveedores de servicios están ubicados fuera del Reino Unido y del Espacio Económico Europeo (EEE). Cuando transferimos datos internacionalmente, garantizamos salvaguardas adecuadas conforme al UK GDPR, incluyendo:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Cláusulas Contractuales Tipo (SCCs) aprobadas.</li>
                <li>Decisiones de adecuación del Reino Unido.</li>
                <li>Evaluaciones de impacto de transferencia cuando sea necesario.</li>
              </ul>
            </div>
          </div>

          {/* 13 */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">13. Privacidad de menores</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Nuestros servicios no están dirigidos a personas menores de 18 años. No recopilamos intencionadamente datos personales de menores. Si descubrimos que hemos recopilado datos de un menor sin el consentimiento parental adecuado, los eliminaremos a la mayor brevedad.</p>
            </div>
          </div>

          {/* 14 */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">14. Enlaces a otros sitios</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Nuestro sitio puede contener enlaces a sitios web de terceros. No somos responsables de las prácticas de privacidad de dichos sitios y le recomendamos que revise sus políticas de privacidad antes de proporcionar cualquier dato personal.</p>
            </div>
          </div>

          {/* 15 */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">15. Cambios en esta política</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos los cambios significativos por correo electrónico o mediante un aviso destacado en nuestro sitio web. La fecha de la última actualización se indica al principio de este documento.</p>
            </div>
          </div>

          {/* 16 */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">16. Contacto</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Para cualquier consulta relacionada con la privacidad o la protección de datos:</p>
            </div>
            <div className="bg-secondary rounded-xl p-6 mt-4 space-y-1 text-sm">
              <p className="font-bold text-foreground">Digital Moonkey Ltd — Responsable de Protección de Datos</p>
              <p className="text-muted-foreground">71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, UK</p>
              <p className="text-muted-foreground">Email: <a href="mailto:admin@digitalmoonkey.travel" className="text-primary hover:underline">admin@digitalmoonkey.travel</a></p>
            </div>
          </div>

          {/* 17 */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">17. Avisos específicos por región</h2>
            <div className="space-y-6 text-muted-foreground">
              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">Residentes del EEE / Reino Unido</h3>
                <p>Como residente del EEE o del Reino Unido, usted se beneficia de los derechos descritos en la sección 9 de esta política. Las bases legales para el tratamiento de sus datos se detallan en la sección 6. Tiene derecho a presentar una reclamación ante su autoridad nacional de protección de datos o ante la ICO del Reino Unido.</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">Residentes de Estados Unidos (California, Virginia, Colorado y otros estados)</h3>
                <p>Si reside en California, tiene derechos adicionales bajo la California Consumer Privacy Act (CCPA/CPRA), incluyendo el derecho a conocer qué datos personales recopilamos, el derecho a solicitar su eliminación y el derecho a optar por no participar en la "venta" de información personal. Digital Moonkey no vende información personal según la definición de la CCPA.</p>
                <p className="mt-2">Residentes de Virginia, Colorado, Connecticut y otros estados con legislación de privacidad vigente pueden ejercer derechos similares contactándonos en admin@digitalmoonkey.travel.</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">Residentes de otros países</h3>
                <p>Independientemente de su ubicación, nos comprometemos a tratar sus datos personales con el máximo respeto y conforme a las mejores prácticas internacionales de protección de datos. Si la legislación de su país le otorga derechos adicionales, haremos todo lo posible para respetarlos.</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </PageLayout>
  );
};

export default Privacy;
