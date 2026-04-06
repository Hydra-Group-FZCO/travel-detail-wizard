import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { popularVisas } from "@/data/visaCountries";
import { useTranslations } from "@/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const regions: Record<string, string[]> = {
  all: [],
  asia: ["TH", "VN", "IN", "MY", "KH", "ID", "JP", "CN", "PH", "MM", "NP", "BD", "KR", "TW", "SG", "PK"],
  africa: ["MA", "EG", "KE", "NG", "ET", "TZ", "ZA", "AO", "DZ"],
  americas: ["US", "CA", "MX", "BR", "AR", "CO", "CL", "PE", "CR", "CU", "EC", "GT", "HN", "NI", "PA", "PY", "UY", "VE", "BO", "DO", "JM"],
  europe: ["TR", "GB", "DE", "FR", "IT", "ES", "NL", "BE", "PT", "PL", "CZ", "RO", "BG", "HR", "HU", "SE", "NO", "FI", "DK", "IE", "AT", "CH", "GR", "UA", "RU", "AL", "AD"],
  middleEast: ["SA", "AE", "JO", "KW", "IL"],
  oceania: ["AU", "NZ"],
};

const regionLabels: Record<string, Record<string, string>> = {
  es: { all: "Todos", asia: "Asia", africa: "África", americas: "Américas", europe: "Europa", middleEast: "Oriente Medio", oceania: "Oceanía" },
  en: { all: "All", asia: "Asia", africa: "Africa", americas: "Americas", europe: "Europe", middleEast: "Middle East", oceania: "Oceania" },
  fr: { all: "Tous", asia: "Asie", africa: "Afrique", americas: "Amériques", europe: "Europe", middleEast: "Moyen-Orient", oceania: "Océanie" },
  it: { all: "Tutti", asia: "Asia", africa: "Africa", americas: "Americhe", europe: "Europa", middleEast: "Medio Oriente", oceania: "Oceania" },
  de: { all: "Alle", asia: "Asien", africa: "Afrika", americas: "Amerika", europe: "Europa", middleEast: "Naher Osten", oceania: "Ozeanien" },
};

const Visas = () => {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");

  const filtered = popularVisas.filter((v) => {
    const matchesSearch = v.country.toLowerCase().includes(search.toLowerCase()) || v.visaType.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = region === "all" || (regions[region]?.includes(v.countryCode) ?? false);
    return matchesSearch && matchesRegion;
  });

  const lang = (t.nav.home === "Home" ? "en" : t.nav.home === "Accueil" ? "fr" : t.nav.home === "Startseite" ? "de" : t.nav.home === "Home" ? "it" : "es") as keyof typeof regionLabels;
  const labels = regionLabels[lang] || regionLabels.es;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero */}
      <section className="bg-primary py-16 md:py-20">
        <div className="container-grid text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            {t.nav.visas}
          </h1>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            {t.home.heroSub}
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.home.destPh}
              className="pl-10 bg-card border-border rounded-full"
            />
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-12 md:py-16 flex-1">
        <div className="container-grid">
          {/* Region tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {Object.keys(regions).map((key) => (
              <button
                key={key}
                onClick={() => setRegion(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  region === key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {labels[key]}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              {t.home.destPh}...
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((visa) => (
                <Link
                  key={visa.slug}
                  to={`/visado/${visa.slug}`}
                  className="group bg-card border border-border rounded-2xl p-6 hover:shadow-elevated transition-all hover:-translate-y-1"
                >
                  <div className="text-4xl mb-3">{visa.flag}</div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {visa.country}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{visa.visaType}</p>
                  <p className="text-sm font-medium text-accent mt-3">
                    {t.home.from} ${visa.priceFrom.toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Visas;
