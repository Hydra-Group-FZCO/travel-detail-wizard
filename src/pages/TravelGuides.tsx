import { useEffect, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SampleGuidePreview } from "@/components/SampleItineraryPreview";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
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
import { Slider } from "@/components/ui/slider";
import {
  DEFAULT_TOKEN_BUDGET,
  GUIDE_TOKEN_MAX,
  GUIDE_TOKEN_MIN,
  GUIDE_TOKEN_STEP,
  clampTokens,
  usdFromTokens,
} from "@/lib/guideTokenPricing";
import { loadDestinationIndex } from "@/lib/destinationSuggestions";
import { useDestinationSuggestions } from "@/lib/useDestinationSuggestions";

function formatUsd(n: number): string {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
}

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
    heroCta: "Get my guide → $9–500 USD",
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
    seasons: { spring: "🌸 Spring", summer: "☀️ Summer", autumn: "🍂 Autumn", winter: "❄️ Winter", unknown: "🤷 I don't know yet" },
    steps: { destination: "Destination", focus: "Focus", detail: "AI budget", language: "Language", season: "Season" },
    form: {
      backToCatalog: "Back to catalog",
      destinationTitle: "Which destination?",
      destinationPlaceholder: "e.g. Tokyo, Japan",
      focusTitle: "What's your focus?",
      focusSubtitle: "Select all that interest you",
      depthTitle: "AI detail & price",
      tokenSubtitle: "Choose how many AI tokens to spend — higher values produce longer, richer guides. Price updates between $9 and $500 USD.",
      tokensLabel: "Token budget",
      usdLabel: "Price",
      languageTitle: "Guide language",
      seasonTitle: "When are you traveling?",
      back: "Back",
      next: "Next",
      creating: "Creating...",
      generate: "Generate guide",
      catalogPricing: "Custom length · $9–500 USD · you choose tokens",
    },
    card: { from: "$9–500", button: "Generate guide" },
    empty: { title: "No destinations found. Generate a guide for any destination!", button: "Custom destination guide" },
    auth: { title: "Please log in", description: "You need an account to generate guides." },
    error: { title: "Error", description: "Failed to create guide" },
  },
  es: {
    badge: "Guías de viaje con IA",
    heroTitle: "Tu guía de viaje personalizada,",
    heroAccent: "generada en segundos",
    heroSubtitle: "Todo lo que necesitas saber sobre tu destino, en tu idioma",
    heroCta: "Quiero mi guía → 9–500 USD",
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
    seasons: { spring: "🌸 Primavera", summer: "☀️ Verano", autumn: "🍂 Otoño", winter: "❄️ Invierno", unknown: "🤷 Aún no lo sé" },
    steps: { destination: "Destino", focus: "Enfoque", detail: "Presupuesto IA", language: "Idioma", season: "Temporada" },
    form: {
      backToCatalog: "Volver al catálogo",
      destinationTitle: "¿Qué destino?",
      destinationPlaceholder: "ej. Tokio, Japón",
      focusTitle: "¿Qué te interesa?",
      focusSubtitle: "Selecciona todo lo que te interese",
      depthTitle: "Detalle IA y precio",
      tokenSubtitle: "Elige cuántos tokens de IA usar: más tokens = guía más larga y completa. Precio entre 9 y 500 USD.",
      tokensLabel: "Presupuesto de tokens",
      usdLabel: "Precio",
      languageTitle: "Idioma de la guía",
      seasonTitle: "¿Cuándo viajas?",
      back: "Atrás",
      next: "Siguiente",
      creating: "Creando...",
      generate: "Generar guía",
      catalogPricing: "Duración a medida · 9–500 USD · tú eliges los tokens",
    },
    card: { from: "9–500 USD", button: "Generar guía" },
    empty: { title: "No se encontraron destinos. ¡Genera una guía para cualquier destino!", button: "Guía para destino personalizado" },
    auth: { title: "Inicia sesión", description: "Necesitas una cuenta para generar guías." },
    error: { title: "Error", description: "No se pudo crear la guía" },
  },
  fr: {
    badge: "Guides de voyage IA",
    heroTitle: "Votre guide de voyage personnalisé,",
    heroAccent: "généré en quelques secondes",
    heroSubtitle: "Tout ce que vous devez savoir sur votre destination, dans votre langue",
    heroCta: "Obtenir mon guide → 9–500 USD",
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
    seasons: { spring: "🌸 Printemps", summer: "☀️ Été", autumn: "🍂 Automne", winter: "❄️ Hiver", unknown: "🤷 Je ne sais pas encore" },
    steps: { destination: "Destination", focus: "Focus", detail: "Budget IA", language: "Langue", season: "Saison" },
    form: {
      backToCatalog: "Retour au catalogue",
      destinationTitle: "Quelle destination ?",
      destinationPlaceholder: "ex. Tokyo, Japon",
      focusTitle: "Qu'est-ce qui vous intéresse ?",
      focusSubtitle: "Sélectionnez tout ce qui vous intéresse",
      depthTitle: "Niveau IA et prix",
      tokenSubtitle: "Choisissez le nombre de tokens IA : plus il est élevé, plus le guide est long et riche. Prix entre 9 et 500 USD.",
      tokensLabel: "Budget tokens",
      usdLabel: "Prix",
      languageTitle: "Langue du guide",
      seasonTitle: "Quand voyagez-vous ?",
      back: "Retour",
      next: "Suivant",
      creating: "Création...",
      generate: "Générer le guide",
      catalogPricing: "Longueur sur mesure · 9–500 USD · vous choisissez les tokens",
    },
    card: { from: "9–500 USD", button: "Générer le guide" },
    empty: { title: "Aucune destination trouvée. Générez un guide pour n'importe quelle destination !", button: "Guide pour destination personnalisée" },
    auth: { title: "Veuillez vous connecter", description: "Vous avez besoin d'un compte pour générer des guides." },
    error: { title: "Erreur", description: "Impossible de créer le guide" },
  },
  it: {
    badge: "Guide di viaggio AI",
    heroTitle: "La tua guida di viaggio personalizzata,",
    heroAccent: "generata in pochi secondi",
    heroSubtitle: "Tutto ciò che devi sapere sulla tua destinazione, nella tua lingua",
    heroCta: "Ottieni la mia guida → 9–500 USD",
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
    seasons: { spring: "🌸 Primavera", summer: "☀️ Estate", autumn: "🍂 Autunno", winter: "❄️ Inverno", unknown: "🤷 Non lo so ancora" },
    steps: { destination: "Destinazione", focus: "Focus", detail: "Budget IA", language: "Lingua", season: "Stagione" },
    form: {
      backToCatalog: "Torna al catalogo",
      destinationTitle: "Quale destinazione?",
      destinationPlaceholder: "es. Tokyo, Giappone",
      focusTitle: "Cosa ti interessa?",
      focusSubtitle: "Seleziona tutto ciò che ti interessa",
      depthTitle: "Dettaglio IA e prezzo",
      tokenSubtitle: "Scegli quanti token IA usare: più token = guida più lunga e ricca. Prezzo tra 9 e 500 USD.",
      tokensLabel: "Budget token",
      usdLabel: "Prezzo",
      languageTitle: "Lingua della guida",
      seasonTitle: "Quando viaggi?",
      back: "Indietro",
      next: "Avanti",
      creating: "Creazione...",
      generate: "Genera guida",
      catalogPricing: "Lunghezza su misura · 9–500 USD · scegli i token",
    },
    card: { from: "9–500 USD", button: "Genera guida" },
    empty: { title: "Nessuna destinazione trovata. Genera una guida per qualsiasi destinazione!", button: "Guida per destinazione personalizzata" },
    auth: { title: "Accedi", description: "Hai bisogno di un account per generare guide." },
    error: { title: "Errore", description: "Impossibile creare la guida" },
  },
  de: {
    badge: "KI-Reiseführer",
    heroTitle: "Dein persönlicher Reiseführer,",
    heroAccent: "in Sekunden erstellt",
    heroSubtitle: "Alles, was du über dein Reiseziel wissen musst, in deiner Sprache",
    heroCta: "Meinen Guide holen → 9–500 USD",
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
    seasons: { spring: "🌸 Frühling", summer: "☀️ Sommer", autumn: "🍂 Herbst", winter: "❄️ Winter", unknown: "🤷 Ich weiß es noch nicht" },
    steps: { destination: "Ziel", focus: "Fokus", detail: "KI-Budget", language: "Sprache", season: "Saison" },
    form: {
      backToCatalog: "Zurück zum Katalog",
      destinationTitle: "Welches Reiseziel?",
      destinationPlaceholder: "z. B. Tokio, Japan",
      focusTitle: "Was interessiert dich?",
      focusSubtitle: "Wähle alles aus, was dich interessiert",
      depthTitle: "KI-Umfang & Preis",
      tokenSubtitle: "Wähle, wie viele KI-Tokens genutzt werden: mehr Tokens = längerer, reichhaltiger Guide. Preis zwischen 9 und 500 USD.",
      tokensLabel: "Token-Budget",
      usdLabel: "Preis",
      languageTitle: "Sprache des Guides",
      seasonTitle: "Wann reist du?",
      back: "Zurück",
      next: "Weiter",
      creating: "Wird erstellt...",
      generate: "Guide erstellen",
      catalogPricing: "Individuelle Länge · 9–500 USD · du wählst die Tokens",
    },
    card: { from: "9–500 USD", button: "Guide erstellen" },
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
    { icon: Layers, label: copy.steps.detail },
    { icon: Globe, label: copy.steps.language },
    { icon: Sun, label: copy.steps.season },
  ];

  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [showForm, setShowForm] = useState(!!searchParams.get("dest"));
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const initialDest = searchParams.get("dest") || "";
  const [destination, setDestination] = useState(initialDest);
  const [destSearch, setDestSearch] = useState(initialDest);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [tokenBudget, setTokenBudget] = useState(DEFAULT_TOKEN_BUDGET);
  const [language, setLanguage] = useState<string>(uiLang);
  const [season, setSeason] = useState("unknown");
  const [digitalConsent, setDigitalConsent] = useState(false);

  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((d) => {
      const matchesRegion = regionFilter === "all" || d.region === regionFilter;
      const matchesSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase());
      return matchesRegion && matchesSearch;
    });
  }, [search, regionFilter]);

  const destinationSuggestions = useDestinationSuggestions(destSearch);

  const destFromUrl = searchParams.get("dest") ?? "";
  useEffect(() => {
    setDestination(destFromUrl);
    setDestSearch(destFromUrl);
  }, [destFromUrl]);

  useEffect(() => {
    if (showForm && step === 0) void loadDestinationIndex();
  }, [showForm, step]);

  const toggleFocus = (id: string) => {
    setFocusAreas((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const openForm = (dest?: string) => {
    if (dest !== undefined) {
      setDestination(dest);
      setDestSearch(dest);
    }
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
      const base = localizedPath("/guide-payment", uiLang);
      const params = new URLSearchParams({
        destination,
        tokens: String(clampTokens(tokenBudget)),
        language,
        season,
        focus: JSON.stringify(focusAreas),
      });
      navigate(`${base}?${params.toString()}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : copy.error.description;
      toast({ title: copy.error.title, description: message, variant: "destructive" });
    } finally {
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
                  <div className="space-y-2 relative">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                      <Input
                        value={destSearch || destination}
                        onChange={(e) => {
                          const v = e.target.value;
                          setDestSearch(v);
                          setDestination(v);
                          setShowDestSuggestions(true);
                        }}
                        onFocus={() => setShowDestSuggestions(true)}
                        placeholder={copy.form.destinationPlaceholder}
                        className="pl-10 text-lg"
                        autoComplete="off"
                      />
                    </div>
                    {showDestSuggestions && destSearch && destinationSuggestions.length > 0 && (
                      <div className="absolute z-20 left-0 right-0 bg-popover border rounded-lg shadow-lg mt-1">
                        {destinationSuggestions.map((item) => (
                          <button
                            key={item}
                            type="button"
                            className="w-full px-4 py-2.5 text-left hover:bg-muted text-sm transition-colors"
                            onClick={() => {
                              setDestination(item);
                              setDestSearch(item);
                              setShowDestSuggestions(false);
                            }}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
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
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{copy.form.depthTitle}</h2>
                    <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{copy.form.tokenSubtitle}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 px-4 py-5 space-y-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{copy.form.tokensLabel}</p>
                        <p className="text-2xl font-semibold tabular-nums text-foreground">{tokenBudget.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{copy.form.usdLabel}</p>
                        <p className="text-2xl font-semibold tabular-nums text-primary">{formatUsd(usdFromTokens(tokenBudget))}</p>
                      </div>
                    </div>
                    <Slider
                      value={[tokenBudget]}
                      min={GUIDE_TOKEN_MIN}
                      max={GUIDE_TOKEN_MAX}
                      step={GUIDE_TOKEN_STEP}
                      onValueChange={(v) => setTokenBudget(clampTokens(v[0] ?? DEFAULT_TOKEN_BUDGET))}
                      className="py-1"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
                      <span>{GUIDE_TOKEN_MIN.toLocaleString()} → {formatUsd(usdFromTokens(GUIDE_TOKEN_MIN))}</span>
                      <span>{GUIDE_TOKEN_MAX.toLocaleString()} → {formatUsd(usdFromTokens(GUIDE_TOKEN_MAX))}</span>
                    </div>
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
              <div className="space-y-3 text-right">
                <label className="flex items-start gap-2.5 cursor-pointer text-left max-w-md ml-auto">
                  <Checkbox
                    checked={digitalConsent}
                    onCheckedChange={(checked) => setDigitalConsent(checked === true)}
                    className="mt-0.5"
                  />
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    I consent to immediate delivery of this digital content and acknowledge that I lose my right to cancel once the guide is generated.
                  </span>
                </label>
                <Button variant="cta" size="lg" onClick={handleGenerate} disabled={isGenerating || !digitalConsent}>
                  {isGenerating ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> {copy.form.creating}</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-2" /> {copy.form.generate} · {formatUsd(usdFromTokens(tokenBudget))}</>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* AI content disclaimer */}
          <p className="text-xs text-muted-foreground text-center mt-4 max-w-lg mx-auto leading-relaxed">
            AI-generated content. While we strive for accuracy, always verify critical information (opening hours, prices, availability) independently before travel.
          </p>
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
            <Badge variant="outline" className="px-3 py-1.5">
              {copy.form.catalogPricing}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredDestinations.map((dest) => (
              <Card
                key={dest.name}
                className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all"
                onClick={() => openForm(`${dest.name}, ${dest.country}`)}
              >
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
