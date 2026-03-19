import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  MapPin, Heart, Layers, Globe, Sun, Sparkles, Search,
  ChevronRight, ChevronLeft, Loader2, BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DestinationCard {
  name: string;
  country: string;
  flag: string;
  region: string;
  image: string;
}

const DESTINATIONS: DestinationCard[] = [
  { name: "Tokyo", country: "Japan", flag: "🇯🇵", region: "asia", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop" },
  { name: "Bali", country: "Indonesia", flag: "🇮🇩", region: "asia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop" },
  { name: "New York", country: "USA", flag: "🇺🇸", region: "americas", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop" },
  { name: "Paris", country: "France", flag: "🇫🇷", region: "europe", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop" },
  { name: "Dubai", country: "UAE", flag: "🇦🇪", region: "middle-east", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop" },
  { name: "Barcelona", country: "Spain", flag: "🇪🇸", region: "europe", image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=300&fit=crop" },
  { name: "Istanbul", country: "Turkey", flag: "🇹🇷", region: "europe", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=300&fit=crop" },
  { name: "Bangkok", country: "Thailand", flag: "🇹🇭", region: "asia", image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=300&fit=crop" },
  { name: "Rome", country: "Italy", flag: "🇮🇹", region: "europe", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop" },
  { name: "Miami", country: "USA", flag: "🇺🇸", region: "americas", image: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=400&h=300&fit=crop" },
  { name: "Amsterdam", country: "Netherlands", flag: "🇳🇱", region: "europe", image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=300&fit=crop" },
  { name: "Lisbon", country: "Portugal", flag: "🇵🇹", region: "europe", image: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400&h=300&fit=crop" },
  { name: "Maldives", country: "Maldives", flag: "🇲🇻", region: "asia", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop" },
  { name: "Marrakech", country: "Morocco", flag: "🇲🇦", region: "africa", image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=400&h=300&fit=crop" },
  { name: "Mexico City", country: "Mexico", flag: "🇲🇽", region: "americas", image: "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=400&h=300&fit=crop" },
  { name: "Prague", country: "Czech Republic", flag: "🇨🇿", region: "europe", image: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=400&h=300&fit=crop" },
  { name: "Sydney", country: "Australia", flag: "🇦🇺", region: "oceania", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=300&fit=crop" },
  { name: "Singapore", country: "Singapore", flag: "🇸🇬", region: "asia", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop" },
];

const REGIONS = [
  { value: "all", label: "All Regions" },
  { value: "europe", label: "🌍 Europe" },
  { value: "asia", label: "🌏 Asia" },
  { value: "americas", label: "🌎 Americas" },
  { value: "middle-east", label: "🕌 Middle East" },
  { value: "africa", label: "🌍 Africa" },
  { value: "oceania", label: "🌊 Oceania" },
];

const FOCUS_AREAS = [
  { id: "culture", label: "🏛️ Culture & History" },
  { id: "food", label: "🍜 Food & Restaurants" },
  { id: "nature", label: "🌿 Nature & Outdoors" },
  { id: "shopping", label: "🛍️ Shopping & Markets" },
  { id: "nightlife", label: "🎉 Nightlife & Entertainment" },
  { id: "family", label: "👨‍👩‍👧 Family & Kids" },
  { id: "romantic", label: "💑 Romantic & Couples" },
  { id: "business", label: "💼 Business Travel" },
  { id: "budget", label: "🎒 Budget Travel" },
  { id: "luxury", label: "👑 Luxury Travel" },
];

const DEPTHS = [
  { value: "essential", label: "Essential", price: 9, pages: "15-20", desc: "Key highlights & must-knows" },
  { value: "complete", label: "Complete", price: 15, pages: "30-40", desc: "Deep dive with detailed tips" },
  { value: "ultimate", label: "Ultimate", price: 25, pages: "60+", desc: "Everything + insider secrets" },
];

const OUTPUT_LANGUAGES = [
  { code: "es", flag: "🇪🇸", label: "Spanish" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "fr", flag: "🇫🇷", label: "French" },
  { code: "de", flag: "🇩🇪", label: "German" },
  { code: "it", flag: "🇮🇹", label: "Italian" },
  { code: "pt", flag: "🇵🇹", label: "Portuguese" },
  { code: "nl", flag: "🇳🇱", label: "Dutch" },
  { code: "pl", flag: "🇵🇱", label: "Polish" },
  { code: "ru", flag: "🇷🇺", label: "Russian" },
  { code: "ar", flag: "🇸🇦", label: "Arabic" },
  { code: "zh", flag: "🇨🇳", label: "Chinese" },
  { code: "ja", flag: "🇯🇵", label: "Japanese" },
  { code: "ko", flag: "🇰🇷", label: "Korean" },
  { code: "tr", flag: "🇹🇷", label: "Turkish" },
  { code: "ca", flag: "🏴", label: "Catalan" },
];

const SEASONS = [
  { value: "spring", label: "🌸 Spring" },
  { value: "summer", label: "☀️ Summer" },
  { value: "autumn", label: "🍂 Autumn" },
  { value: "winter", label: "❄️ Winter" },
  { value: "unknown", label: "🤷 I don't know yet" },
];

function detectBrowserLanguage(): string {
  const lang = navigator.language.split("-")[0];
  const supported = OUTPUT_LANGUAGES.map((l) => l.code);
  return supported.includes(lang) ? lang : "en";
}

const FORM_STEPS = [
  { icon: MapPin, label: "Destination" },
  { icon: Heart, label: "Focus" },
  { icon: Layers, label: "Depth" },
  { icon: Globe, label: "Language" },
  { icon: Sun, label: "Season" },
];

const TravelGuides = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Catalog state
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");

  // Form state
  const [showForm, setShowForm] = useState(!!searchParams.get("dest"));
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const [destination, setDestination] = useState(searchParams.get("dest") || "");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [depth, setDepth] = useState("essential");
  const [language, setLanguage] = useState(detectBrowserLanguage());
  const [season, setSeason] = useState("unknown");

  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((d) => {
      const matchesRegion = regionFilter === "all" || d.region === regionFilter;
      const matchesSearch = !search ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.country.toLowerCase().includes(search.toLowerCase());
      return matchesRegion && matchesSearch;
    });
  }, [search, regionFilter]);

  const selectedDepth = DEPTHS.find((d) => d.value === depth)!;

  const toggleFocus = (id: string) => {
    setFocusAreas((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const openForm = (dest?: string) => {
    if (dest) setDestination(dest);
    setShowForm(true);
    setStep(0);
  };

  const canProceed = () => {
    switch (step) {
      case 0: return destination.length > 1;
      case 1: return focusAreas.length > 0;
      case 2: return true;
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleGenerate = async () => {
    if (!user) {
      toast({ title: "Please log in", description: "You need an account to generate guides.", variant: "destructive" });
      navigate("/login");
      return;
    }

    setIsGenerating(true);
    try {
      const { data: guide, error } = await supabase
        .from("travel_guides")
        .insert({
          user_id: user.id,
          destination,
          destination_slug: slugify(destination),
          focus_areas: focusAreas,
          depth,
          language,
          season,
          price_paid: selectedDepth.price,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      navigate(`/travel-guides/view/${guide.id}`);
    } catch (err: any) {
      console.error("Error:", err);
      toast({ title: "Error", description: err.message || "Failed to create guide", variant: "destructive" });
      setIsGenerating(false);
    }
  };

  // ---------- FORM VIEW ----------
  if (showForm) {
    return (
      <PageLayout>
        <section className="py-12 bg-background min-h-screen">
          <div className="container mx-auto px-4 max-w-3xl">
            <button
              onClick={() => setShowForm(false)}
              className="text-sm text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Back to catalog
            </button>

            {/* Steps */}
            <div className="flex items-center justify-between mb-8">
              {FORM_STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <button
                    key={i}
                    onClick={() => i < step && setStep(i)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 transition-all",
                      i === step && "scale-110",
                      i > step && "opacity-40 cursor-default",
                      i < step && "cursor-pointer"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                      i === step ? "bg-primary text-primary-foreground" :
                      i < step ? "bg-primary/20 text-primary" :
                      "bg-muted text-muted-foreground"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={cn("text-xs font-medium hidden sm:block", i === step ? "text-primary" : "text-muted-foreground")}>
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <Progress value={((step + 1) / FORM_STEPS.length) * 100} className="mb-8 h-2" />

            {/* Step 0: Destination */}
            {step === 0 && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">Which destination?</h2>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="e.g. Tokyo, Japan"
                      className="pl-10 text-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 1: Focus */}
            {step === 1 && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">What's your focus?</h2>
                  <p className="text-muted-foreground">Select all that interest you</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {FOCUS_AREAS.map((area) => (
                      <button
                        key={area.id}
                        onClick={() => toggleFocus(area.id)}
                        className={cn(
                          "px-4 py-3 rounded-lg border text-left text-sm font-medium transition-all",
                          focusAreas.includes(area.id)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        {area.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Depth */}
            {step === 2 && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">Guide depth</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {DEPTHS.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => setDepth(d.value)}
                        className={cn(
                          "p-5 rounded-xl border text-center transition-all relative",
                          depth === d.value
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        {d.value === "complete" && (
                          <Badge className="absolute -top-2 right-2 text-xs">Popular</Badge>
                        )}
                        <div className="text-2xl font-bold text-primary mb-1">€{d.price}</div>
                        <div className="font-semibold text-foreground">{d.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">{d.pages} pages</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{d.desc}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Language */}
            {step === 3 && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">Guide language</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {OUTPUT_LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => setLanguage(l.code)}
                        className={cn(
                          "px-4 py-3 rounded-lg border text-sm font-medium transition-all flex items-center gap-2",
                          language === l.code
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        <span className="text-lg">{l.flag}</span> {l.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Season */}
            {step === 4 && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">When are you traveling?</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SEASONS.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setSeason(s.value)}
                        className={cn(
                          "px-4 py-3 rounded-lg border text-sm font-medium transition-all",
                          season === s.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Nav */}
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => step === 0 ? setShowForm(false) : setStep(step - 1)}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>

              {step < FORM_STEPS.length - 1 ? (
                <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button variant="cta" size="lg" onClick={handleGenerate} disabled={isGenerating}>
                  {isGenerating ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Creating...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-2" /> Generate guide — €{selectedDepth.price}</>
                  )}
                </Button>
              )}
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  // ---------- CATALOG VIEW ----------
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-accent/10 via-background to-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(var(--accent)/0.08),transparent_70%)]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
            <BookOpen className="w-4 h-4 mr-1.5" /> AI Travel Guides
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
            Your personalized travel guide,
            <br />
            <span className="text-primary">generated in seconds</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Everything you need to know about your destination, in your language
          </p>
          <Button variant="cta" size="lg" onClick={() => openForm()}>
            <Sparkles className="w-4 h-4 mr-2" /> Get my guide → from €9
          </Button>
        </div>
      </section>

      {/* Catalog */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search destinations..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {REGIONS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRegionFilter(r.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
                    regionFilter === r.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing badges */}
          <div className="flex gap-3 mb-8 justify-center flex-wrap">
            {DEPTHS.map((d) => (
              <Badge key={d.value} variant="outline" className="px-3 py-1.5">
                {d.label}: €{d.price} · {d.pages} pages
              </Badge>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredDestinations.map((dest) => (
              <Card
                key={dest.name}
                className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all"
                onClick={() => openForm(dest.name)}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs">
                    From €9
                  </Badge>
                </div>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">
                        {dest.flag} {dest.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{dest.country}</p>
                    </div>
                  </div>
                  <Button variant="cta" size="sm" className="w-full mt-2 text-xs">
                    Generate guide
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No destinations found. Generate a guide for any destination!</p>
              <Button variant="cta" onClick={() => openForm()}>
                <Sparkles className="w-4 h-4 mr-2" /> Custom destination guide
              </Button>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default TravelGuides;
