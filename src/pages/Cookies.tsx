import PageLayout from "@/components/PageLayout";

const Cookies = () => {
  return (
    <PageLayout>
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-secondary">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Política de Cookies</h1>
          <p className="text-muted-foreground text-sm mt-2">Última actualización: abril 2026</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl space-y-10 text-sm leading-relaxed">

          <div className="bg-accent/10 border border-accent/20 rounded-xl p-5 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">Aviso importante</p>
            <p>Este documento está redactado en español con fines informativos. En caso de discrepancia, prevalecerá la versión en inglés.</p>
          </div>

          {/* 1 */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">1. ¿Qué son las cookies?</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (ordenador, teléfono móvil o tableta) cuando visita un sitio web. Permiten que el sitio recuerde sus acciones y preferencias durante un período de tiempo, de modo que no tenga que volver a introducirlos cada vez que vuelva al sitio o navegue de una página a otra.</p>
            </div>
          </div>

          {/* 2 */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">2. Cookies que utilizamos</h2>
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">Estrictamente necesarias</h3>
                <p className="text-muted-foreground">Estas cookies son esenciales para el funcionamiento del sitio web. Incluyen cookies de sesión, autenticación de usuario, tokens de seguridad (CSRF) y preferencias de consentimiento de cookies. No pueden desactivarse sin afectar al funcionamiento del sitio.</p>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full text-xs text-muted-foreground border border-border rounded">
                    <thead><tr className="bg-secondary"><th className="p-2 text-left text-foreground">Cookie</th><th className="p-2 text-left text-foreground">Finalidad</th><th className="p-2 text-left text-foreground">Duración</th></tr></thead>
                    <tbody>
                      <tr className="border-t border-border"><td className="p-2">sb-*-auth-token</td><td className="p-2">Autenticación de sesión del usuario</td><td className="p-2">Sesión</td></tr>
                      <tr className="border-t border-border"><td className="p-2">cookie_consent</td><td className="p-2">Almacena las preferencias de cookies del usuario</td><td className="p-2">1 año</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">Funcionales</h3>
                <p className="text-muted-foreground">Permiten funcionalidades mejoradas y personalización, como el idioma preferido y la configuración regional. Si desactiva estas cookies, es posible que algunos servicios no funcionen correctamente.</p>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full text-xs text-muted-foreground border border-border rounded">
                    <thead><tr className="bg-secondary"><th className="p-2 text-left text-foreground">Cookie</th><th className="p-2 text-left text-foreground">Finalidad</th><th className="p-2 text-left text-foreground">Duración</th></tr></thead>
                    <tbody>
                      <tr className="border-t border-border"><td className="p-2">lang</td><td className="p-2">Preferencia de idioma</td><td className="p-2">1 año</td></tr>
                      <tr className="border-t border-border"><td className="p-2">country_pref</td><td className="p-2">País de origen seleccionado</td><td className="p-2">30 días</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">Analíticas <span className="text-xs font-normal text-muted-foreground">(requieren su consentimiento)</span></h3>
                <p className="text-muted-foreground">Nos ayudan a comprender cómo los visitantes interactúan con nuestro sitio web, recopilando información de forma anónima. Utilizamos estos datos para mejorar la experiencia del usuario.</p>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full text-xs text-muted-foreground border border-border rounded">
                    <thead><tr className="bg-secondary"><th className="p-2 text-left text-foreground">Cookie</th><th className="p-2 text-left text-foreground">Proveedor</th><th className="p-2 text-left text-foreground">Finalidad</th><th className="p-2 text-left text-foreground">Duración</th></tr></thead>
                    <tbody>
                      <tr className="border-t border-border"><td className="p-2">_ga</td><td className="p-2">Google</td><td className="p-2">Distinguir usuarios únicos</td><td className="p-2">2 años</td></tr>
                      <tr className="border-t border-border"><td className="p-2">_ga_*</td><td className="p-2">Google</td><td className="p-2">Mantener estado de sesión</td><td className="p-2">2 años</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">Publicitarias / Marketing <span className="text-xs font-normal text-muted-foreground">(requieren su consentimiento)</span></h3>
                <p className="text-muted-foreground">Se utilizan para ofrecer publicidad relevante y medir la efectividad de las campañas publicitarias. Pueden ser establecidas por nuestros socios publicitarios.</p>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full text-xs text-muted-foreground border border-border rounded">
                    <thead><tr className="bg-secondary"><th className="p-2 text-left text-foreground">Cookie</th><th className="p-2 text-left text-foreground">Proveedor</th><th className="p-2 text-left text-foreground">Finalidad</th><th className="p-2 text-left text-foreground">Duración</th></tr></thead>
                    <tbody>
                      <tr className="border-t border-border"><td className="p-2">_gcl_au</td><td className="p-2">Google Ads</td><td className="p-2">Seguimiento de conversiones</td><td className="p-2">90 días</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* 3 */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">3. Cookies de terceros</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Nuestro sitio web puede incluir cookies establecidas por terceros:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-foreground">Google Analytics:</strong> análisis de tráfico web y comportamiento de usuarios. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Política de privacidad de Google</a>.</li>
                <li><strong className="text-foreground">Stripe:</strong> procesamiento seguro de pagos. <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Política de privacidad de Stripe</a>.</li>
                <li><strong className="text-foreground">Google (inicio de sesión):</strong> si utiliza Google OAuth para iniciar sesión.</li>
              </ul>
            </div>
          </div>

          {/* 4 */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">4. Cómo gestionar las cookies</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Puede gestionar sus preferencias de cookies de las siguientes formas:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-foreground">Banner de cookies:</strong> al visitar nuestro sitio por primera vez, puede aceptar o rechazar cookies no esenciales.</li>
                <li><strong className="text-foreground">Configuración de cookies:</strong> puede cambiar sus preferencias en cualquier momento haciendo clic en "Configuración de Cookies" en el pie de página.</li>
                <li><strong className="text-foreground">Configuración del navegador:</strong> puede configurar su navegador para bloquear o eliminar cookies. Tenga en cuenta que esto puede afectar al funcionamiento del sitio web.</li>
                <li><strong className="text-foreground">Opt-out de Google Analytics:</strong> instale el <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">complemento de inhabilitación de Google Analytics</a>.</li>
              </ul>
            </div>
          </div>

          {/* 5 */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">5. Actualizaciones</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Podemos actualizar esta Política de Cookies periódicamente para reflejar cambios en las cookies que utilizamos o por otros motivos operativos, legales o regulatorios. Le recomendamos que revise esta página con regularidad.</p>
            </div>
          </div>

          {/* 6 */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-foreground">6. Contacto</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Para cualquier consulta sobre nuestra Política de Cookies:</p>
            </div>
            <div className="bg-secondary rounded-xl p-6 mt-4 space-y-1 text-sm">
              <p className="font-bold text-foreground">Digital Moonkey Ltd</p>
              <p className="text-muted-foreground">Company No. 15716386</p>
              <p className="text-muted-foreground">71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, UK</p>
              <p className="text-muted-foreground">Email: <a href="mailto:admin@digitalmoonkey.travel" className="text-primary hover:underline">admin@digitalmoonkey.travel</a></p>
            </div>
          </div>

        </div>
      </section>
    </PageLayout>
  );
};

export default Cookies;
