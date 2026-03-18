import { Link, useLocation } from "react-router-dom";

const StatusTicker = () => {
  return (
    <div className="bg-disclaimer-bg text-disclaimer-fg text-xs py-2 px-4">
      <div className="container-grid flex items-center justify-between">
        <span className="opacity-70 tracking-wide uppercase text-[10px] font-medium">
          Private service — not a government agency
        </span>
        <span className="hidden sm:flex items-center gap-2 text-[10px] font-medium tracking-wide">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-success-green animate-pulse" />
          Systems operational
        </span>
      </div>
    </div>
  );
};

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50">
      <StatusTicker />
      <nav className="bg-surface/80 backdrop-blur-xl border-b border-border">
        <div className="container-grid flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-xl text-foreground tracking-tight">
              Digital Moonkey
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.to
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <MobileMenu currentPath={location.pathname} />
        </div>
      </nav>
    </header>
  );
};

const MobileMenu = ({ currentPath }: { currentPath: string }) => {
  return (
    <div className="md:hidden">
      <details className="relative">
        <summary className="list-none cursor-pointer p-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </summary>
        <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-md shadow-elevated py-2 z-50">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-4 py-2.5 text-sm transition-colors ${
                currentPath === link.to
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </details>
    </div>
  );
};

export default Header;
