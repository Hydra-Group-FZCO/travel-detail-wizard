import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-grid py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🐒</span>
              <span className="font-bold text-lg">Digital Moonkey</span>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-sm">
              Plataforma online especializada en la gestión de visados y documentos de viaje.
              Tu visado, sin complicaciones.
            </p>
            <div className="mt-4 text-xs text-primary-foreground/50 space-y-0.5">
              <p>Digital Moonkey Ltd · Registrada en Inglaterra y Gales</p>
              <p>71-75 Shelton Street, Covent Garden, London, WC2H 9JQ</p>
            </div>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="text-sm font-bold mb-4 text-primary-foreground">Empresa</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/sobre-nosotros" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Sobre nosotros</Link>
              <Link to="/contacto" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Contáctanos</Link>
              <Link to="/ayuda" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Centro de ayuda</Link>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-sm font-bold mb-4 text-primary-foreground">Servicios</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/visados" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Visados electrónicos</Link>
              <span className="text-sm text-primary-foreground/70">ETA / ESTA</span>
              <span className="text-sm text-primary-foreground/70">Fotos de pasaporte</span>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold mb-4 text-primary-foreground">Legal</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/condiciones" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Condiciones del servicio</Link>
              <Link to="/privacidad" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Política de privacidad</Link>
              <Link to="/cookies" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Política de cookies</Link>
              <Link to="/reembolsos" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Política de reembolso</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary-foreground/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-primary-foreground/60 font-semibold">
              © 2024–2026 Digital Moonkey Ltd · Company No. 15716386
            </p>
            <div className="flex items-center gap-3 text-xs text-primary-foreground/50">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>PayPal</span>
              <span>Apple Pay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
