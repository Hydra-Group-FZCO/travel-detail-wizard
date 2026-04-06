import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { countries, type Country } from "@/data/visaCountries";

interface CountrySelectorProps {
  label: string;
  value: Country | null;
  onChange: (country: Country) => void;
  placeholder: string;
}

const CountrySelector = ({ label, value, onChange, placeholder }: CountrySelectorProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 min-w-[240px]" ref={ref}>
      <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-background border border-border rounded-xl text-left hover:border-primary/50 transition-colors"
      >
        {value ? (
          <>
            <span className="text-xl">{value.flag}</span>
            <span className="text-sm font-medium text-foreground">{value.name}</span>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">{placeholder}</span>
        )}
        <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full max-w-sm bg-card border border-border rounded-xl shadow-elevated overflow-hidden animate-fade-in">
          <div className="p-2 border-b border-border">
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar país..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto p-1">
            {filtered.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                  setSearch("");
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-left"
              >
                <span className="text-lg">{c.flag}</span>
                <span className="text-foreground font-medium">{c.name}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground px-3 py-4 text-center">No se encontraron resultados</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
