import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { user, role, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const navLinks = [
    { to: "/", label: "Inicio" },
    { to: "/visados", label: "Visados" },
    { to: "/sobre-nosotros", label: "Sobre nosotros" },
    { to: "/contacto", label: "Contacto" },
  ];

  const isActive = (to: string) => location.pathname === to;

  return (
    <header className={`sticky top-0 z-50 ${isHome ? "bg-primary" : "bg-background border-b border-border"}`}>
      <nav className="container-grid">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🐒</span>
            <span className={`font-bold text-lg tracking-tight ${isHome ? "text-primary-foreground" : "text-foreground"}`}>
              Digital Moonkey
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  isActive(link.to)
                    ? isHome ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-foreground"
                    : isHome ? "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {loading ? (
              <div className="w-24 h-9 rounded-full bg-muted animate-pulse ml-2" />
            ) : user ? (
              <Link
                to={role === "admin" ? "/admin" : "/dashboard"}
                className={`flex items-center gap-1.5 ml-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isHome ? "bg-accent text-accent-foreground hover:bg-accent/90" : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                <User size={14} />
                {role === "admin" ? "Admin" : "Mi cuenta"}
              </Link>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isHome ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Iniciar sesión
                </Link>
                <Button variant="default" size="sm" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                  <Link to="/visados">Solicitar visado</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className={`md:hidden p-2 rounded-lg ${isHome ? "text-primary-foreground" : "text-foreground"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="bg-card rounded-xl border border-border shadow-elevated p-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border mt-2 pt-2 flex flex-col gap-1">
                {!loading && !user && (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted">
                      Iniciar sesión
                    </Link>
                    <Link to="/visados" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-medium bg-accent text-accent-foreground text-center">
                      Solicitar visado
                    </Link>
                  </>
                )}
                {!loading && user && (
                  <Link to={role === "admin" ? "/admin" : "/dashboard"} onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-medium bg-primary text-primary-foreground text-center">
                    {role === "admin" ? "Admin" : "Mi cuenta"}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
