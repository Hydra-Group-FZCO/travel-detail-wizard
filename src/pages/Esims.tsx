import { useState, useEffect, useMemo } from "react";
import { Search, Wifi, Clock, Globe, Smartphone, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import PageLayout from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/i18n";

type EsimPackage = {
  id: string;
  package_code: string;
  name: string;
  price_retail_eur: number;
  data_gb: number | null;
  duration_days: number | null;
  countries: string[] | null;
  location_code: string | null;
  operator: string | null;
};

const regionCountries: Record<string, string[]> = {
  europe: ["GB", "FR", "DE", "ES", "IT", "PT", "NL", "BE", "CH", "AT", "GR", "PL", "CZ", "SE", "NO", "DK", "FI", "IE", "HR", "RO", "BG", "HU", "SK", "SI", "LT", "LV", "EE", "MT", "CY", "LU", "IS"],
  asia: ["CN", "JP", "KR", "IN", "TH", "VN", "MY", "SG", "ID", "PH", "TW", "HK", "MO", "LA", "KH", "MM", "BD", "LK", "NP", "PK", "MN", "KZ", "UZ"],
  americas: ["US", "CA", "MX", "BR", "AR", "CL", "CO", "PE", "EC", "UY", "PY", "BO", "VE", "CR", "PA", "GT", "HN", "SV", "NI", "DO", "CU", "JM", "TT", "PR"],
  middle_east: ["AE", "SA", "QA", "BH", "KW", "OM", "JO", "LB", "IL", "TR", "EG", "MA", "TN", "DZ"],
  global: [],
};

const countryFlags: Record<string, string> = {
  US: "🇺🇸", GB: "🇬🇧", FR: "🇫🇷", DE: "🇩🇪", ES: "🇪🇸", IT: "🇮🇹", JP: "🇯🇵", KR: "🇰🇷",
  CN: "🇨🇳", IN: "🇮🇳", TH: "🇹🇭", AU: "🇦🇺", BR: "🇧🇷", MX: "🇲🇽", CA: "🇨🇦", PT: "🇵🇹",
  NL: "🇳🇱", BE: "🇧🇪", CH: "🇨🇭", AT: "🇦🇹", GR: "🇬🇷", TR: "🇹🇷", AE: "🇦🇪", SG: "🇸🇬",
  MY: "🇲🇾", VN: "🇻🇳", ID: "🇮🇩", PH: "🇵🇭", PL: "🇵🇱", SE: "🇸🇪", NO: "🇳🇴", DK: "🇩🇰",
  FI: "🇫🇮", IE: "🇮🇪", SA: "🇸🇦", EG: "🇪🇬", MA: "🇲🇦", AR: "🇦🇷", CL: "🇨🇱", CO: "🇨🇴",
  PE: "🇵🇪", CZ: "🇨🇿", HU: "🇭🇺", RO: "🇷🇴", HR: "🇭🇷", BG: "🇧🇬", SK: "🇸🇰", SI: "🇸🇮",
  QA: "🇶🇦", KW: "🇰🇼", BH: "🇧🇭", OM: "🇴🇲", JO: "🇯🇴", LB: "🇱🇧", IL: "🇮🇱", TW: "🇹🇼",
  HK: "🇭🇰", NZ: "🇳🇿", ZA: "🇿🇦", NG: "🇳🇬", KE: "🇰🇪", GH: "🇬🇭",
};

const countryNames: Record<string, string> = {
  US: "United States", GB: "United Kingdom", FR: "France", DE: "Germany", ES: "Spain",
  IT: "Italy", JP: "Japan", KR: "South Korea", CN: "China", IN: "India", TH: "Thailand",
  AU: "Australia", BR: "Brazil", MX: "Mexico", CA: "Canada", PT: "Portugal", NL: "Netherlands",
  BE: "Belgium", CH: "Switzerland", AT: "Austria", GR: "Greece", TR: "Turkey", AE: "UAE",
  SG: "Singapore", MY: "Malaysia", VN: "Vietnam", ID: "Indonesia", PH: "Philippines",
  PL: "Poland", SE: "Sweden", NO: "Norway", DK: "Denmark", FI: "Finland", IE: "Ireland",
  SA: "Saudi Arabia", EG: "Egypt", MA: "Morocco", AR: "Argentina", CL: "Chile", CO: "Colombia",
  PE: "Peru", CZ: "Czech Republic", HU: "Hungary", RO: "Romania", HR: "Croatia", BG: "Bulgaria",
  SK: "Slovakia", SI: "Slovenia", QA: "Qatar", KW: "Kuwait", BH: "Bahrain", OM: "Oman",
  JO: "Jordan", LB: "Lebanon", IL: "Israel", TW: "Taiwan", HK: "Hong Kong", NZ: "New Zealand",
  ZA: "South Africa", NG: "Nigeria", KE: "Kenya", GH: "Ghana",
};

const Esims = () => {
  const t = useTranslations();
  const [packages, setPackages] = useState<EsimPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const { toast } = useToast();

  const regions = useMemo(() => [
    { label: t.esims.regionAll, value: "all" },
    { label: t.esims.regionEurope, value: "europe" },
    { label: t.esims.regionAsia, value: "asia" },
    { label: t.esims.regionAmericas, value: "americas" },
    { label: t.esims.regionMiddleEast, value: "middle_east" },
    { label: t.esims.regionGlobal, value: "global" },
  ], [t]);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("esim_packages_cache")
      .select("*")
      .gt("price_retail_eur", 0)
      .order("name");

    if (error) {
      toast({ title: t.esims.errorLoading, description: error.message, variant: "destructive" });
    } else {
      setPackages(data || []);
    }
    setLoading(false);
  };

  // Group packages by location_code
  const groupedByCountry = useMemo(() => {
    let filtered = packages;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.location_code && countryNames[p.location_code]?.toLowerCase().includes(q)) ||
          p.location_code?.toLowerCase().includes(q) ||
          (p.countries && p.countries.some((c) => countryNames[c]?.toLowerCase().includes(q)))
      );
    }

    if (region !== "all" && region !== "global") {
      const codes = regionCountries[region] || [];
      filtered = filtered.filter((p) => {
        // Check location_code directly
        if (p.location_code && codes.includes(p.location_code)) return true;
        // Check countries array for regional packages
        if (p.countries && p.countries.some((c) => codes.includes(c))) return true;
        return false;
      });
    }

    const grouped: Record<string, EsimPackage[]> = {};
    for (const pkg of filtered) {
      const key = pkg.location_code || "other";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(pkg);
    }
    return grouped;
  }, [packages, search, region]);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 bg-gradient-to-br from-accent/10 via-background to-primary/5">
        <div className="container-grid text-center">
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-1.5">
            <Wifi size={14} className="mr-1.5" /> {t.esims.badge}
          </Badge>
          <h1 className="text-balance mb-4">{t.esims.heroTitle}</h1>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            {t.esims.heroSubtitle}
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder={t.esims.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 text-base rounded-full"
            />
          </div>

          {/* Region filters */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {regions.map((r) => (
              <Button
                key={r.value}
                variant={region === r.value ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setRegion(r.value)}
              >
                {r.label}
              </Button>
            ))}
          </div>

          {/* Compatible devices tooltip */}
          <div className="mt-4 flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Smartphone size={14} />
                   <span>{t.esims.compatibleDevices}</span>
                  <Info size={12} />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-left">
                <p className="font-medium mb-1">{t.esims.compatibleDevicesTitle}</p>
                <p className="text-xs">{t.esims.compatibleDevicesDesc}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="section-spacing">
        <div className="container-grid">
          {loading ? (
            <div className="text-center py-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-xl" />
                ))}
              </div>
            </div>
          ) : Object.keys(groupedByCountry).length === 0 ? (
            <div className="text-center py-16">
              <Globe size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="mb-2">No packages found</h3>
              <p>Try a different search or region filter.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedByCountry)
                .sort(([a], [b]) => (countryNames[a] || a).localeCompare(countryNames[b] || b))
                .map(([code, pkgs]) => (
                  <div key={code}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{countryFlags[code] || "🌐"}</span>
                      <h2 className="text-xl font-bold">{countryNames[code] || code}</h2>
                      <Badge variant="outline" className="ml-auto">
                        {pkgs.length} plan{pkgs.length !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {pkgs
                        .sort((a, b) => (a.data_gb || 0) - (b.data_gb || 0))
                        .map((pkg) => (
                          <Card key={pkg.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-5">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="font-semibold text-base">{pkg.name}</h3>
                                  {pkg.operator && (
                                    <p className="text-xs text-muted-foreground">{pkg.operator}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                                {pkg.data_gb && (
                                  <span className="flex items-center gap-1">
                                    <Wifi size={14} className="text-accent" />
                                    {pkg.data_gb >= 1 ? `${pkg.data_gb} GB` : `${Math.round(pkg.data_gb * 1024)} MB`}
                                  </span>
                                )}
                                {pkg.duration_days && (
                                  <span className="flex items-center gap-1">
                                    <Clock size={14} className="text-accent" />
                                    {pkg.duration_days} days
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold text-foreground">
                                  €{pkg.price_retail_eur.toFixed(2)}
                                </span>
                                <Button size="sm" className="rounded-full">
                                  Buy Now
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default Esims;
