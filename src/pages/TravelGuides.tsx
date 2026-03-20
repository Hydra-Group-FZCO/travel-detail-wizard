import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SampleGuidePreview } from "@/components/SampleItineraryPreview";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { localizedPath, useLanguage } from "@/i18n";
import {
  MapPin,
  Heart,
  Layers,
  Globe,
  Sun,
  Sparkles,
  Search,
  ChevronRight,
  ChevronLeft,
  Loader2,
  BookOpen,
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

const OUTPUT_LANGUAGES = [
  { code: "es", flag: "🇪🇸", label: "Español" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "de", flag: "🇩🇪", label: "Deutsch" },
  { code: "it", flag: "🇮🇹", label: "Italiano" },
  { code: "pt", flag: "🇵🇹", label: "Português" },
  { code: "nl", flag: "🇳🇱", label: "Nederlands" },
  { code: "pl", flag: "🇵🇱", label: "Polski" },
  { code: "ru", flag: "🇷🇺", label: "Русский" },
  { code: "ar", flag: "🇸🇦", label: "العربية" },
  { code: "zh", flag: "🇨🇳", label: "中文" },
  { code: "ja", flag: "🇯🇵", label: "日本語" },
  { code: "ko", flag: "🇰🇷", label: "한국어" },
  { code: "tr", flag: "🇹🇷", label: "Türkçe" },
  { code: "ca", flag: "🏴", label: "Català" },
] as const;

const GUIDE_UI = {
  en: {
    badge: "AI Travel Guides",
    heroTitle: "Your personalized travel guide,",
    heroAccent: "generated in seconds",
    heroSubtitle: "Everything you need to know about your destination, in your language",
    heroCta: "Get my guide → from €9",
    searchPlaceholder: "Search destinations...",
    regions: { all: "All Regions", europe: "🌍 Europe", asia: "🌏 Asia", americas: "🌎 Americas", middleEast: "🕌 Middle East", africa: "🌍 Africa", oceania: "🌊 Oceania" },
    focusAreas: {
      culture: "🏛️ Culture & History",
      food: "🍜 Food & Restaurants",
      nature: "🌿 Nature & Outdoors",
      shopping: "🛍️ Shopping & Markets",
      nightlife: "🎉 Nightlife & Entertainment",
      family: "👨‍👩‍👧 Family & Kids",
      romantic: "💑 Romantic & Couples",
      business: "💼 Business Travel",
      budget: "🎒 Budget Travel",
      luxury: "👑 Luxury Travel",
    },
    depths: {
      essential: { label: "Essential", desc: "Key highlights & must-knows" },
      complete: { label: "Complete", desc: "Deep dive with detailed tips" },
      ultimate: { label: "Ultimate", desc: "Everything + insider secrets" },
    },
    seasons: { spring: "🌸 Spring", summer: "☀️ Summer", autumn: "🍂 Autumn", winter: "❄️ Winter", unknown: "🤷 I don't know yet" },
    steps: { destination: "Destination", focus: "Focus", depth: "Depth", language: "Language", season: "Season" },
    form: {
      backToCatalog: "Back to catalog",
      destinationTitle: "Which destination?",
      destinationPlaceholder: "e.g. Tokyo, Japan",
      focusTitle: "What's your focus?",
      focusSubtitle: "Select all that interest you",
      depthTitle: "Guide depth",
      popular: "Popular",
      pages: "pages",
      languageTitle: "Guide language",
      seasonTitle: "When are you traveling?",
      back: "Back",
      next: "Next",
      creating: "Creating...",
      generate: "Generate guide",
    },
    card: { from: "From €9", button: "Generate guide" },
    empty: { title: "No destinations found. Generate a guide for any destination!", button: "Custom destination guide" },
    auth: { title: "Please log in", description: "You need an account to generate guides." },
    error: { title: "Error", description: "Failed to create guide" },
  },
  es: {
    badge: "Guías de viaje con IA",
    heroTitle: "Tu guía de viaje personalizada,",
    heroAccent: "generada en segundos",
    heroSubtitle: "Todo lo que necesitas saber sobre tu destino, en tu idioma",
    heroCta: "Quiero mi guía → desde 9 €",
    searchPlaceholder: "Buscar destinos...",
    regions: { all: "Todas las regiones", europe: "🌍 Europa", asia: "🌏 Asia", americas: "🌎 Américas", middleEast: "🕌 Oriente Medio", africa: "🌍 África", oceania: "🌊 Oceanía" },
    focusAreas: {
      culture: "🏛️ Cultura e historia",
      food: "🍜 Comida y restaurantes",
      nature: "🌿 Naturaleza y aire libre",
      shopping: "🛍️ Compras y mercados",
      nightlife: "🎉 Vida nocturna y entretenimiento",
      family: "👨‍👩‍👧 Familia y niños",
      romantic: "💑 Romántico y parejas",
      business: "💼 Viaje de negocios",
      budget: "🎒 Viaje low cost",
      luxury: "👑 Viaje de lujo",
    },
    depths: {
      essential: { label: "Esencial", desc: "Lo más importante y práctico" },
      complete: { label: "Completa", desc: "Más detalle y mejores consejos" },
      ultimate: { label: "Ultimate", desc: "Todo + secretos locales" },
    },
    seasons: { spring: "🌸 Primavera", summer: "☀️ Verano", autumn: "🍂 Otoño", winter: "❄️ Invierno", unknown: "🤷 Aún no lo sé" },
    steps: { destination: "Destino", focus: "Enfoque", depth: "Nivel", language: "Idioma", season: "Temporada" },
    form: {
      backToCatalog: "Volver al catálogo",
      destinationTitle: "¿Qué destino?",
      destinationPlaceholder: "ej. Tokio, Japón",
      focusTitle: "¿Qué te interesa?",
      focusSubtitle: "Selecciona todo lo que te interese",
      depthTitle: "Nivel de la guía",
      popular: "Popular",
      pages: "páginas",
      languageTitle: "Idioma de la guía",
      seasonTitle: "¿Cuándo viajas?",
      back: "Atrás",
      next: "Siguiente",
      creating: "Creando...",
      generate: "Generar guía",
    },
    card: { from: "Desde 9 €", button: "Generar guía" },
    empty: { title: "No se encontraron destinos. ¡Genera una guía para cualquier destino!", button: "Guía para destino personalizado" },
    auth: { title: "Inicia sesión", description: "Necesitas una cuenta para generar guías." },
    error: { title: "Error", description: "No se pudo crear la guía" },
  },
  fr: {
    badge: "Guides de voyage IA",
    heroTitle: "Votre guide de voyage personnalisé,",
    heroAccent: "généré en quelques secondes",
    heroSubtitle: "Tout ce que vous devez savoir sur votre destination, dans votre langue",
    heroCta: "Obtenir mon guide → dès 9 €",
    searchPlaceholder: "Rechercher des destinations...",
    regions: { all: "Toutes les régions", europe: "🌍 Europe", asia: "🌏 Asie", americas: "🌎 Amériques", middleEast: "🕌 Moyen-Orient", africa: "🌍 Afrique", oceania: "🌊 Océanie" },
    focusAreas: {
      culture: "🏛️ Culture et histoire",
      food: "🍜 Cuisine et restaurants",
      nature: "🌿 Nature et plein air",
      shopping: "🛍️ Shopping et marchés",
      nightlife: "🎉 Vie nocturne et divertissement",
      family: "👨‍👩‍👧 Famille et enfants",
      romantic: "💑 Romantique et couples",
      business: "💼 Voyage d'affaires",
      budget: "🎒 Voyage petit budget",
      luxury: "👑 Voyage de luxe",
    },
    depths: {
      essential: { label: "Essentiel", desc: "Les points clés à connaître" },
      complete: { label: "Complet", desc: "Plus de détails et de conseils" },
      ultimate: { label: "Ultimate", desc: "Tout + secrets d'initiés" },
    },
    seasons: { spring: "🌸 Printemps", summer: "☀️ Été", autumn: "🍂 Automne", winter: "❄️ Hiver", unknown: "🤷 Je ne sais pas encore" },
    steps: { destination: "Destination", focus: "Focus", depth: "Niveau", language: "Langue", season: "Saison" },
    form: {
      backToCatalog: "Retour au catalogue",
      destinationTitle: "Quelle destination ?",
      destinationPlaceholder: "ex. Tokyo, Japon",
      focusTitle: "Qu'est-ce qui vous intéresse ?",
      focusSubtitle: "Sélectionnez tout ce qui vous intéresse",
      depthTitle: "Niveau du guide",
      popular: "Populaire",
      pages: "pages",
      languageTitle: "Langue du guide",
      seasonTitle: "Quand voyagez-vous ?",
      back: "Retour",
      next: "Suivant",
      creating: "Création...",
      generate: "Générer le guide",
    },
    card: { from: "Dès 9 €", button: "Générer le guide" },
    empty: { title: "Aucune destination trouvée. Générez un guide pour n'importe quelle destination !", button: "Guide pour destination personnalisée" },
    auth: { title: "Veuillez vous connecter", description: "Vous avez besoin d'un compte pour générer des guides." },
    error: { title: "Erreur", description: "Impossible de créer le guide" },
  },
  it: {
    badge: "Guide di viaggio AI",
    heroTitle: "La tua guida di viaggio personalizzata,",
    heroAccent: "generata in pochi secondi",
    heroSubtitle: "Tutto ciò che devi sapere sulla tua destinazione, nella tua lingua",
    heroCta: "Ottieni la mia guida → da 9 €",
    searchPlaceholder: "Cerca destinazioni...",
    regions: { all: "Tutte le regioni", europe: "🌍 Europa", asia: "🌏 Asia", americas: "🌎 Americhe", middleEast: "🕌 Medio Oriente", africa: "🌍 Africa", oceania: "🌊 Oceania" },
    focusAreas: {
      culture: "🏛️ Cultura e storia",
      food: "🍜 Cibo e ristoranti",
      nature: "🌿 Natura e outdoor",
      shopping: "🛍️ Shopping e mercati",
      nightlife: "🎉 Vita notturna e intrattenimento",
      family: "👨‍👩‍👧 Famiglia e bambini",
      romantic: "💑 Romantico e coppie",
      business: "💼 Viaggio di lavoro",
      budget: "🎒 Viaggio low cost",
      luxury: "👑 Viaggio di lusso",
    },
    depths: {
      essential: { label: "Essenziale", desc: "I punti chiave da sapere" },
      complete: { label: "Completa", desc: "Più dettagli e consigli" },
      ultimate: { label: "Ultimate", desc: "Tutto + segreti locali" },
    },
    seasons: { spring: "🌸 Primavera", summer: "☀️ Estate", autumn: "🍂 Autunno", winter: "❄️ Inverno", unknown: "🤷 Non lo so ancora" },
    steps: { destination: "Destinazione", focus: "Focus", depth: "Livello", language: "Lingua", season: "Stagione" },
    form: {
      backToCatalog: "Torna al catalogo",
      destinationTitle: "Quale destinazione?",
      destinationPlaceholder: "es. Tokyo, Giappone",
      focusTitle: "Cosa ti interessa?",
      focusSubtitle: "Seleziona tutto ciò che ti interessa",
      depthTitle: "Livello della guida",
      popular: "Popolare",
      pages: "pagine",
      languageTitle: "Lingua della guida",
      seasonTitle: "Quando viaggi?",
      back: "Indietro",
      next: "Avanti",
      creating: "Creazione...",
      generate: "Genera guida",
    },
    card: { from: "Da 9 €", button: "Genera guida" },
    empty: { title: "Nessuna destinazione trovata. Genera una guida per qualsiasi destinazione!", button: "Guida per destinazione personalizzata" },
    auth: { title: "Accedi", description: "Hai bisogno di un account per generare guide." },
    error: { title: "Errore", description: "Impossibile creare la guida" },
  },
  de: {
    badge: "KI-Reiseführer",
    heroTitle: "Dein persönlicher Reiseführer,",
    heroAccent: "in Sekunden erstellt",
    heroSubtitle: "Alles, was du über dein Reiseziel wissen musst, in deiner Sprache",
    heroCta: "Meinen Guide holen → ab 9 €",
    searchPlaceholder: "Reiseziele suchen...",
    regions: { all: "Alle Regionen", europe: "🌍 Europa", asia: "🌏 Asien", americas: "🌎 Amerika", middleEast: "🕌 Naher Osten", africa: "🌍 Afrika", oceania: "🌊 Ozeanien" },
    focusAreas: {
      culture: "🏛️ Kultur und Geschichte",
      food: "🍜 Essen und Restaurants",
      nature: "🌿 Natur und Outdoor",
      shopping: "🛍️ Shopping und Märkte",
      nightlife: "🎉 Nachtleben und Unterhaltung",
      family: "👨‍👩‍👧 Familie und Kinder",
      romantic: "💑 Romantik und Paare",
      business: "💼 Geschäftsreise",
      budget: "🎒 Budget-Reise",
      luxury: "👑 Luxusreise",
    },
    depths: {
      essential: { label: "Essential", desc: "Die wichtigsten Highlights" },
      complete: { label: "Complete", desc: "Mehr Details und Tipps" },
      ultimate: { label: "Ultimate", desc: "Alles + Insider-Geheimnisse" },
    },
    seasons: { spring: "🌸 Frühling", summer: "☀️ Sommer", autumn: "🍂 Herbst", winter: "❄️ Winter", unknown: "🤷 Ich weiß es noch nicht" },
    steps: { destination: "Ziel", focus: "Fokus", depth: "Tiefe", language: "Sprache", season: "Saison" },
    form: {
      backToCatalog: "Zurück zum Katalog",
      destinationTitle: "Welches Reiseziel?",
      destinationPlaceholder: "z. B. Tokio, Japan",
      focusTitle: "Was interessiert dich?",
      focusSubtitle: "Wähle alles aus, was dich interessiert",
      depthTitle: "Guide-Tiefe",
      popular: "Beliebt",
      pages: "Seiten",
      languageTitle: "Sprache des Guides",
      seasonTitle: "Wann reist du?",
      back: "Zurück",
      next: "Weiter",
      creating: "Wird erstellt...",
      generate: "Guide erstellen",
    },
    card: { from: "Ab 9 €", button: "Guide erstellen" },
    empty: { title: "Keine Reiseziele gefunden. Erstelle einen Guide für jedes beliebige Ziel!", button: "Guide für individuelles Reiseziel" },
    auth: { title: "Bitte einloggen", description: "Du brauchst ein Konto, um Guides zu erstellen." },
    error: { title: "Fehler", description: "Guide konnte nicht erstellt werden" },
  },
} as const;

const TravelGuides = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const uiLang = useLanguage();
  const copy = GUIDE_UI[uiLang] ?? GUIDE_UI.en;

  const regions = [
    { value: "all", label: copy.regions.all },
    { value: "europe", label: copy.regions.europe },
    { value: "asia", label: copy.regions.asia },
    { value: "americas", label: copy.regions.americas },
    { value: "middle-east", label: copy.regions.middleEast },
    { value: "africa", label: copy.regions.africa },
    { value: "oceania", label: copy.regions.oceania },
  ];

  const focusAreasOptions = [
    { id: "culture", label: copy.focusAreas.culture },
    { id: "food", label: copy.focusAreas.food },
    { id: "nature", label: copy.focusAreas.nature },
    { id: "shopping", label: copy.focusAreas.shopping },
    { id: "nightlife", label: copy.focusAreas.nightlife },
    { id: "family", label: copy.focusAreas.family },
    { id: "romantic", label: copy.focusAreas.romantic },
    { id: "business", label: copy.focusAreas.business },
    { id: "budget", label: copy.focusAreas.budget },
    { id: "luxury", label: copy.focusAreas.luxury },
  ];

  const depths = [
    { value: "essential", label: copy.depths.essential.label, price: 9, pages: "15-20", desc: copy.depths.essential.desc },
    { value: "complete", label: copy.depths.complete.label, price: 15, pages: "30-40", desc: copy.depths.complete.desc },
    { value: "ultimate", label: copy.depths.ultimate.label, price: 25, pages: "60+", desc: copy.depths.ultimate.desc },
  ];

  const seasons = [
    { value: "spring", label: copy.seasons.spring },
    { value: "summer", label: copy.seasons.summer },
    { value: "autumn", label: copy.seasons.autumn },
    { value: "winter", label: copy.seasons.winter },
    { value: "unknown", label: copy.seasons.unknown },
  ];

  const formSteps = [
    { icon: MapPin, label: copy.steps.destination },
    { icon: Heart, label: copy.steps.focus },
    { icon: Layers, label: copy.steps.depth },
    { icon: Globe, label: copy.steps.language },
    { icon: Sun, label: copy.steps.season },
  ];

  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [showForm, setShowForm] = useState(!!searchParams.get("dest"));
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [destination, setDestination] = useState(searchParams.get("dest") || "");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [depth, setDepth] = useState("essential");
  const [language, setLanguage] = useState<string>(uiLang);
  const [season, setSeason] = useState("unknown");

  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((d) => {
      const matchesRegion = regionFilter === "all" || d.region === regionFilter;
      const matchesSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase());
      return matchesRegion && matchesSearch;
    });
  }, [search, regionFilter]);

  const selectedDepth = depths.find((d) => d.value === depth)!;

  const toggleFocus = (id: string) => {
    setFocusAreas((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const openForm = (dest?: string) => {
    if (dest) setDestination(dest);
    setShowForm(true);
    setStep(0);
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return destination.length > 1;
      case 1:
        return focusAreas.length > 0;
      case 2:
      case 3:
      case 4:
        return true;
      default:
        return false;
    }
  };

  const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleGenerate = async () => {
    if (!user) {
      toast({ title: copy.auth.title, description: copy.auth.description, variant: "destructive" });
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
      navigate(localizedPath(`/travel-guides/view/${guide.id}`, uiLang));
    } catch (err: any) {
      toast({ title: copy.error.title, description: err.message || copy.error.description, variant: "destructive" });
      setIsGenerating(false);
    }
  };

  if (showForm) {
    return (
      <PageLayout>
        <section className="py-12 bg-background min-h-screen">
          <div className="container mx-auto px-4 max-w-3xl">
            <button onClick={() => setShowForm(false)} className="text-sm text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> {copy.form.backToCatalog}
            </button>

            <div className="flex items-center justify-between mb-8">
              {formSteps.map((currentStep, i) => {
                const Icon = currentStep.icon;
                return (
                  <button
                    key={i}
                    onClick={() => i < step && setStep(i)}
                    className={cn("flex flex-col items-center gap-1.5 transition-all", i === step && "scale-110", i > step && "opacity-40 cursor-default", i < step && "cursor-pointer")}
                  >
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors", i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={cn("text-xs font-medium hidden sm:block", i === step ? "text-primary" : "text-muted-foreground")}>{currentStep.label}</span>
                  </button>
                );
              })}
            </div>

            <Progress value={((step + 1) / formSteps.length) * 100} className="mb-8 h-2" />

            {step === 0 && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">{copy.form.destinationTitle}</h2>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder={copy.form.destinationPlaceholder} className="pl-10 text-lg" />
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 1 && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">{copy.form.focusTitle}</h2>
                  <p className="text-muted-foreground">{copy.form.focusSubtitle}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {focusAreasOptions.map((area) => (
                      <button
                        key={area.id}
                        onClick={() => toggleFocus(area.id)}
                        className={cn("px-4 py-3 rounded-lg border text-left text-sm font-medium transition-all", focusAreas.includes(area.id) ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40")}
                      >
                        {area.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">{copy.form.depthTitle}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {depths.map((currentDepth) => (
                      <button
                        key={currentDepth.value}
                        onClick={() => setDepth(currentDepth.value)}
                        className={cn("p-5 rounded-xl border text-center transition-all relative", depth === currentDepth.value ? "border-primary bg-primary/10 shadow-sm" : "border-border hover:border-primary/40")}
                      >
                        {currentDepth.value === "complete" && <Badge className="absolute -top-2 right-2 text-xs">{copy.form.popular}</Badge>}
                        <div className="text-2xl font-bold text-primary mb-1">€{currentDepth.price}</div>
                        <div className="font-semibold text-foreground">{currentDepth.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">{currentDepth.pages} {copy.form.pages}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{currentDepth.desc}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">{copy.form.languageTitle}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {OUTPUT_LANGUAGES.map((outputLanguage) => (
                      <button
                        key={outputLanguage.code}
                        onClick={() => setLanguage(outputLanguage.code)}
                        className={cn("px-4 py-3 rounded-lg border text-sm font-medium transition-all flex items-center gap-2", language === outputLanguage.code ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40")}
                      >
                        <span className="text-lg">{outputLanguage.flag}</span> {outputLanguage.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 4 && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">{copy.form.seasonTitle}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {seasons.map((currentSeason) => (
                      <button
                        key={currentSeason.value}
                        onClick={() => setSeason(currentSeason.value)}
                        className={cn("px-4 py-3 rounded-lg border text-sm font-medium transition-all", season === currentSeason.value ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40")}
                      >
                        {currentSeason.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => (step === 0 ? setShowForm(false) : setStep(step - 1))}>
                <ChevronLeft className="w-4 h-4 mr-1" /> {copy.form.back}
              </Button>

              {step < formSteps.length - 1 ? (
                <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                  {copy.form.next} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button variant="cta" size="lg" onClick={handleGenerate} disabled={isGenerating}>
                  {isGenerating ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> {copy.form.creating}</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-2" /> {copy.form.generate} · €{selectedDepth.price}</>
                  )}
                </Button>
              )}
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="relative py-20 bg-gradient-to-br from-accent/10 via-background to-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(var(--accent)/0.08),transparent_70%)]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
            <BookOpen className="w-4 h-4 mr-1.5" /> {copy.badge}
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
            {copy.heroTitle}
            <br />
            <span className="text-primary">{copy.heroAccent}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">{copy.heroSubtitle}</p>
          <Button variant="cta" size="lg" onClick={() => openForm()}>
            <Sparkles className="w-4 h-4 mr-2" /> {copy.heroCta}
          </Button>
        </div>
      </section>

      <SampleGuidePreview />

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={copy.searchPlaceholder} className="pl-10" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {regions.map((region) => (
                <button
                  key={region.value}
                  onClick={() => setRegionFilter(region.value)}
                  className={cn("px-3 py-1.5 rounded-full text-sm font-medium border transition-colors", regionFilter === region.value ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40")}
                >
                  {region.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mb-8 justify-center flex-wrap">
            {depths.map((currentDepth) => (
              <Badge key={currentDepth.value} variant="outline" className="px-3 py-1.5">
                {currentDepth.label}: €{currentDepth.price} · {currentDepth.pages} {copy.form.pages}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredDestinations.map((dest) => (
              <Card key={dest.name} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all" onClick={() => openForm(dest.name)}>
                <div className="relative h-40 overflow-hidden">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs">{copy.card.from}</Badge>
                </div>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{dest.flag} {dest.name}</h3>
                      <p className="text-xs text-muted-foreground">{dest.country}</p>
                    </div>
                  </div>
                  <Button variant="cta" size="sm" className="w-full mt-2 text-xs">{copy.card.button}</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">{copy.empty.title}</p>
              <Button variant="cta" onClick={() => openForm()}>
                <Sparkles className="w-4 h-4 mr-2" /> {copy.empty.button}
              </Button>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default TravelGuides;
