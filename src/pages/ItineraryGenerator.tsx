import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { SampleItineraryPreview } from "@/components/SampleItineraryPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { localizedPath, useLanguage } from "@/i18n";
import { format, differenceInDays } from "date-fns";
import {
  CalendarIcon,
  MapPin,
  Users,
  Heart,
  Wallet,
  Globe,
  Sparkles,
  Plus,
  Minus,
  ChevronRight,
  ChevronLeft,
  Plane,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const POPULAR_DESTINATIONS: Record<string, string[]> = {
  en: [
    "Paris, France", "Tokyo, Japan", "Barcelona, Spain", "Rome, Italy",
    "New York, USA", "London, UK", "Bali, Indonesia", "Dubai, UAE",
    "Lisbon, Portugal", "Amsterdam, Netherlands", "Bangkok, Thailand",
    "Istanbul, Turkey", "Prague, Czech Republic", "Marrakech, Morocco",
    "Santorini, Greece", "Buenos Aires, Argentina", "Sydney, Australia",
    "Seoul, South Korea", "Vienna, Austria", "Cape Town, South Africa",
  ],
  es: [
    "París, Francia", "Tokio, Japón", "Barcelona, España", "Roma, Italia",
    "Nueva York, EE.UU.", "Londres, Reino Unido", "Bali, Indonesia", "Dubái, EAU",
    "Lisboa, Portugal", "Ámsterdam, Países Bajos", "Bangkok, Tailandia",
    "Estambul, Turquía", "Praga, República Checa", "Marrakech, Marruecos",
    "Santorini, Grecia", "Buenos Aires, Argentina", "Sídney, Australia",
    "Seúl, Corea del Sur", "Viena, Austria", "Ciudad del Cabo, Sudáfrica",
  ],
  fr: [
    "Paris, France", "Tokyo, Japon", "Barcelone, Espagne", "Rome, Italie",
    "New York, États-Unis", "Londres, Royaume-Uni", "Bali, Indonésie", "Dubaï, ÉAU",
    "Lisbonne, Portugal", "Amsterdam, Pays-Bas", "Bangkok, Thaïlande",
    "Istanbul, Turquie", "Prague, République tchèque", "Marrakech, Maroc",
    "Santorin, Grèce", "Buenos Aires, Argentine", "Sydney, Australie",
    "Séoul, Corée du Sud", "Vienne, Autriche", "Le Cap, Afrique du Sud",
  ],
  it: [
    "Parigi, Francia", "Tokyo, Giappone", "Barcellona, Spagna", "Roma, Italia",
    "New York, USA", "Londra, Regno Unito", "Bali, Indonesia", "Dubai, EAU",
    "Lisbona, Portogallo", "Amsterdam, Paesi Bassi", "Bangkok, Thailandia",
    "Istanbul, Turchia", "Praga, Repubblica Ceca", "Marrakech, Marocco",
    "Santorini, Grecia", "Buenos Aires, Argentina", "Sydney, Australia",
    "Seul, Corea del Sud", "Vienna, Austria", "Città del Capo, Sudafrica",
  ],
  de: [
    "Paris, Frankreich", "Tokio, Japan", "Barcelona, Spanien", "Rom, Italien",
    "New York, USA", "London, Vereinigtes Königreich", "Bali, Indonesien", "Dubai, VAE",
    "Lissabon, Portugal", "Amsterdam, Niederlande", "Bangkok, Thailand",
    "Istanbul, Türkei", "Prag, Tschechien", "Marrakesch, Marokko",
    "Santorin, Griechenland", "Buenos Aires, Argentinien", "Sydney, Australien",
    "Seoul, Südkorea", "Wien, Österreich", "Kapstadt, Südafrika",
  ],
};

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

const ITINERARY_UI = {
  en: {
    badge: "AI-Powered",
    heroTitle: "Your perfect trip,",
    heroAccent: "planned by AI in seconds",
    heroSubtitle: "Personalized day-by-day itineraries in any language",
    steps: { destination: "Destination", travelers: "Travelers", interests: "Interests", budget: "Budget", language: "Language", extras: "Extras" },
    tripTypes: { solo: "🧑 Solo", couple: "💑 Couple", family: "👨‍👩‍👧‍👦 Family", friends: "👫 Friends", honeymoon: "💒 Honeymoon", business: "💼 Business" },
    interests: {
      culture: "🏛️ Culture & Museums",
      gastronomy: "🍽️ Gastronomy & Local Food",
      nature: "🌿 Nature & Hiking",
      beach: "🏖️ Beach & Relaxation",
      nightlife: "🎉 Nightlife & Entertainment",
      shopping: "🛍️ Shopping",
      adventure: "🧗 Adventure & Sports",
      photography: "📸 Photography & Scenery",
      hiddenGems: "💎 Hidden Gems & Local Life",
      luxury: "✨ Luxury & Wellness",
    },
    budgets: {
      budget: { label: "Budget", desc: "Hostels, street food, free activities" },
      midRange: { label: "Mid-range", desc: "Hotels, restaurants, popular attractions" },
      luxury: { label: "Luxury", desc: "5-star hotels, fine dining, VIP experiences" },
    },
    extras: {
      restaurants: "🍽️ Restaurant recommendations",
      accommodation: "🏨 Accommodation suggestions by neighborhood",
      transport: "🚇 Transport between days (metro, bus, taxi tips)",
      budget: "💶 Estimated daily budget breakdown",
      packing: "🧳 Packing tips for destination & season",
      phrases: "🗣️ Local phrases in destination language",
    },
    form: {
      whereWhen: "Where & When",
      destination: "Destination",
      destinationPlaceholder: "e.g. Paris, France",
      departureDate: "Departure date",
      returnDate: "Return date",
      pickDate: "Pick a date",
      day: "day",
      days: "days",
      departureCity: "Departure city (optional)",
      departureCityPlaceholder: "e.g. Madrid",
      travelersTitle: "Who's traveling?",
      adults: "Adults",
      children: "Children",
      childrenAges: "Children's ages",
      years: "yr",
      tripType: "Trip type",
      interestsTitle: "What are you into?",
      interestsSubtitle: "Select all that apply",
      budgetTitle: "What's your budget?",
      languageTitle: "Itinerary language",
      languageSubtitle: "Choose the language for your itinerary",
      extrasTitle: "Extra goodies",
      extrasSubtitle: "Optional extras to include in your itinerary",
      back: "Back",
      next: "Next",
      creating: "Creating...",
      generate: "Generate my itinerary",
    },
    auth: { title: "Please log in", description: "You need an account to generate itineraries." },
    error: { title: "Error", description: "Failed to create itinerary" },
  },
  es: {
    badge: "Impulsado por IA",
    heroTitle: "Tu viaje perfecto,",
    heroAccent: "planificado por IA en segundos",
    heroSubtitle: "Itinerarios personalizados día a día en cualquier idioma",
    steps: { destination: "Destino", travelers: "Viajeros", interests: "Intereses", budget: "Presupuesto", language: "Idioma", extras: "Extras" },
    tripTypes: { solo: "🧑 Solo", couple: "💑 Pareja", family: "👨‍👩‍👧‍👦 Familia", friends: "👫 Amigos", honeymoon: "💒 Luna de miel", business: "💼 Negocios" },
    interests: {
      culture: "🏛️ Cultura y museos",
      gastronomy: "🍽️ Gastronomía y comida local",
      nature: "🌿 Naturaleza y senderismo",
      beach: "🏖️ Playa y relax",
      nightlife: "🎉 Vida nocturna y entretenimiento",
      shopping: "🛍️ Compras",
      adventure: "🧗 Aventura y deportes",
      photography: "📸 Fotografía y paisajes",
      hiddenGems: "💎 Joyas ocultas y vida local",
      luxury: "✨ Lujo y bienestar",
    },
    budgets: {
      budget: { label: "Económico", desc: "Hostales, comida callejera y actividades gratis" },
      midRange: { label: "Medio", desc: "Hoteles, restaurantes y atracciones populares" },
      luxury: { label: "Lujo", desc: "Hoteles 5 estrellas, alta cocina y experiencias VIP" },
    },
    extras: {
      restaurants: "🍽️ Recomendaciones de restaurantes",
      accommodation: "🏨 Sugerencias de alojamiento por zona",
      transport: "🚇 Transporte entre días (metro, bus, taxi)",
      budget: "💶 Desglose estimado de presupuesto diario",
      packing: "🧳 Consejos de equipaje según destino y temporada",
      phrases: "🗣️ Frases locales en el idioma del destino",
    },
    form: {
      whereWhen: "Dónde y cuándo",
      destination: "Destino",
      destinationPlaceholder: "ej. París, Francia",
      departureDate: "Fecha de salida",
      returnDate: "Fecha de regreso",
      pickDate: "Elige una fecha",
      day: "día",
      days: "días",
      departureCity: "Ciudad de salida (opcional)",
      departureCityPlaceholder: "ej. Madrid",
      travelersTitle: "¿Quién viaja?",
      adults: "Adultos",
      children: "Niños",
      childrenAges: "Edades de los niños",
      years: "años",
      tripType: "Tipo de viaje",
      interestsTitle: "¿Qué te gusta?",
      interestsSubtitle: "Selecciona todo lo que aplique",
      budgetTitle: "¿Cuál es tu presupuesto?",
      languageTitle: "Idioma del itinerario",
      languageSubtitle: "Elige el idioma para tu itinerario",
      extrasTitle: "Extras útiles",
      extrasSubtitle: "Opcionales para incluir en tu itinerario",
      back: "Atrás",
      next: "Siguiente",
      creating: "Creando...",
      generate: "Generar mi itinerario",
    },
    auth: { title: "Inicia sesión", description: "Necesitas una cuenta para generar itinerarios." },
    error: { title: "Error", description: "No se pudo crear el itinerario" },
  },
  fr: {
    badge: "Propulsé par IA",
    heroTitle: "Votre voyage parfait,",
    heroAccent: "planifié par IA en quelques secondes",
    heroSubtitle: "Des itinéraires personnalisés jour par jour dans n'importe quelle langue",
    steps: { destination: "Destination", travelers: "Voyageurs", interests: "Intérêts", budget: "Budget", language: "Langue", extras: "Extras" },
    tripTypes: { solo: "🧑 Solo", couple: "💑 Couple", family: "👨‍👩‍👧‍👦 Famille", friends: "👫 Amis", honeymoon: "💒 Lune de miel", business: "💼 Affaires" },
    interests: {
      culture: "🏛️ Culture et musées",
      gastronomy: "🍽️ Gastronomie et cuisine locale",
      nature: "🌿 Nature et randonnée",
      beach: "🏖️ Plage et détente",
      nightlife: "🎉 Vie nocturne et divertissement",
      shopping: "🛍️ Shopping",
      adventure: "🧗 Aventure et sports",
      photography: "📸 Photo et paysages",
      hiddenGems: "💎 Trésors cachés et vie locale",
      luxury: "✨ Luxe et bien-être",
    },
    budgets: {
      budget: { label: "Petit budget", desc: "Auberges, street food et activités gratuites" },
      midRange: { label: "Intermédiaire", desc: "Hôtels, restaurants et attractions populaires" },
      luxury: { label: "Luxe", desc: "Hôtels 5 étoiles, gastronomie et expériences VIP" },
    },
    extras: {
      restaurants: "🍽️ Recommandations de restaurants",
      accommodation: "🏨 Suggestions d'hébergement par quartier",
      transport: "🚇 Transport entre les jours (métro, bus, taxi)",
      budget: "💶 Estimation du budget quotidien",
      packing: "🧳 Conseils bagages selon la destination et la saison",
      phrases: "🗣️ Phrases locales dans la langue de destination",
    },
    form: {
      whereWhen: "Où et quand",
      destination: "Destination",
      destinationPlaceholder: "ex. Paris, France",
      departureDate: "Date de départ",
      returnDate: "Date de retour",
      pickDate: "Choisir une date",
      day: "jour",
      days: "jours",
      departureCity: "Ville de départ (optionnel)",
      departureCityPlaceholder: "ex. Madrid",
      travelersTitle: "Qui voyage ?",
      adults: "Adultes",
      children: "Enfants",
      childrenAges: "Âges des enfants",
      years: "ans",
      tripType: "Type de voyage",
      interestsTitle: "Qu'aimez-vous ?",
      interestsSubtitle: "Sélectionnez tout ce qui s'applique",
      budgetTitle: "Quel est votre budget ?",
      languageTitle: "Langue de l'itinéraire",
      languageSubtitle: "Choisissez la langue de votre itinéraire",
      extrasTitle: "Extras utiles",
      extrasSubtitle: "Options à inclure dans votre itinéraire",
      back: "Retour",
      next: "Suivant",
      creating: "Création...",
      generate: "Générer mon itinéraire",
    },
    auth: { title: "Veuillez vous connecter", description: "Vous avez besoin d'un compte pour générer des itinéraires." },
    error: { title: "Erreur", description: "Impossible de créer l'itinéraire" },
  },
  it: {
    badge: "Powered by AI",
    heroTitle: "Il tuo viaggio perfetto,",
    heroAccent: "pianificato dall'AI in pochi secondi",
    heroSubtitle: "Itinerari personalizzati giorno per giorno in qualsiasi lingua",
    steps: { destination: "Destinazione", travelers: "Viaggiatori", interests: "Interessi", budget: "Budget", language: "Lingua", extras: "Extra" },
    tripTypes: { solo: "🧑 Solo", couple: "💑 Coppia", family: "👨‍👩‍👧‍👦 Famiglia", friends: "👫 Amici", honeymoon: "💒 Luna di miele", business: "💼 Business" },
    interests: {
      culture: "🏛️ Cultura e musei",
      gastronomy: "🍽️ Gastronomia e cibo locale",
      nature: "🌿 Natura e trekking",
      beach: "🏖️ Spiaggia e relax",
      nightlife: "🎉 Vita notturna e intrattenimento",
      shopping: "🛍️ Shopping",
      adventure: "🧗 Avventura e sport",
      photography: "📸 Fotografia e paesaggi",
      hiddenGems: "💎 Gemme nascoste e vita locale",
      luxury: "✨ Lusso e benessere",
    },
    budgets: {
      budget: { label: "Budget", desc: "Ostelli, street food e attività gratuite" },
      midRange: { label: "Medio", desc: "Hotel, ristoranti e attrazioni popolari" },
      luxury: { label: "Lusso", desc: "Hotel 5 stelle, alta cucina ed esperienze VIP" },
    },
    extras: {
      restaurants: "🍽️ Consigli sui ristoranti",
      accommodation: "🏨 Suggerimenti sugli alloggi per zona",
      transport: "🚇 Trasporti tra i giorni (metro, bus, taxi)",
      budget: "💶 Stima del budget giornaliero",
      packing: "🧳 Consigli bagagli per destinazione e stagione",
      phrases: "🗣️ Frasi locali nella lingua della destinazione",
    },
    form: {
      whereWhen: "Dove e quando",
      destination: "Destinazione",
      destinationPlaceholder: "es. Parigi, Francia",
      departureDate: "Data di partenza",
      returnDate: "Data di ritorno",
      pickDate: "Scegli una data",
      day: "giorno",
      days: "giorni",
      departureCity: "Città di partenza (opzionale)",
      departureCityPlaceholder: "es. Madrid",
      travelersTitle: "Chi viaggia?",
      adults: "Adulti",
      children: "Bambini",
      childrenAges: "Età dei bambini",
      years: "anni",
      tripType: "Tipo di viaggio",
      interestsTitle: "Cosa ti piace?",
      interestsSubtitle: "Seleziona tutto ciò che si applica",
      budgetTitle: "Qual è il tuo budget?",
      languageTitle: "Lingua dell'itinerario",
      languageSubtitle: "Scegli la lingua del tuo itinerario",
      extrasTitle: "Extra utili",
      extrasSubtitle: "Opzioni da includere nel tuo itinerario",
      back: "Indietro",
      next: "Avanti",
      creating: "Creazione...",
      generate: "Genera il mio itinerario",
    },
    auth: { title: "Accedi", description: "Hai bisogno di un account per generare itinerari." },
    error: { title: "Errore", description: "Impossibile creare l'itinerario" },
  },
  de: {
    badge: "Mit KI erstellt",
    heroTitle: "Deine perfekte Reise,",
    heroAccent: "in Sekunden von KI geplant",
    heroSubtitle: "Personalisierte Tagespläne in jeder Sprache",
    steps: { destination: "Ziel", travelers: "Reisende", interests: "Interessen", budget: "Budget", language: "Sprache", extras: "Extras" },
    tripTypes: { solo: "🧑 Solo", couple: "💑 Paar", family: "👨‍👩‍👧‍👦 Familie", friends: "👫 Freunde", honeymoon: "💒 Flitterwochen", business: "💼 Business" },
    interests: {
      culture: "🏛️ Kultur und Museen",
      gastronomy: "🍽️ Gastronomie und lokales Essen",
      nature: "🌿 Natur und Wandern",
      beach: "🏖️ Strand und Erholung",
      nightlife: "🎉 Nachtleben und Unterhaltung",
      shopping: "🛍️ Shopping",
      adventure: "🧗 Abenteuer und Sport",
      photography: "📸 Fotografie und Landschaften",
      hiddenGems: "💎 Geheimtipps und lokales Leben",
      luxury: "✨ Luxus und Wellness",
    },
    budgets: {
      budget: { label: "Günstig", desc: "Hostels, Street Food und kostenlose Aktivitäten" },
      midRange: { label: "Mittelklasse", desc: "Hotels, Restaurants und beliebte Attraktionen" },
      luxury: { label: "Luxus", desc: "5-Sterne-Hotels, Fine Dining und VIP-Erlebnisse" },
    },
    extras: {
      restaurants: "🍽️ Restaurantempfehlungen",
      accommodation: "🏨 Unterkunftstipps nach Viertel",
      transport: "🚇 Transport zwischen den Tagen (Metro, Bus, Taxi)",
      budget: "💶 Geschätzte tägliche Budgetübersicht",
      packing: "🧳 Packtipps für Ziel und Saison",
      phrases: "🗣️ Lokale Sätze in der Zielsprache",
    },
    form: {
      whereWhen: "Wohin und wann",
      destination: "Reiseziel",
      destinationPlaceholder: "z. B. Paris, Frankreich",
      departureDate: "Abreisedatum",
      returnDate: "Rückreisedatum",
      pickDate: "Datum wählen",
      day: "Tag",
      days: "Tage",
      departureCity: "Abflugstadt (optional)",
      departureCityPlaceholder: "z. B. Madrid",
      travelersTitle: "Wer reist?",
      adults: "Erwachsene",
      children: "Kinder",
      childrenAges: "Alter der Kinder",
      years: "J.",
      tripType: "Reiseart",
      interestsTitle: "Wofür interessierst du dich?",
      interestsSubtitle: "Wähle alles aus, was zutrifft",
      budgetTitle: "Wie hoch ist dein Budget?",
      languageTitle: "Sprache des Reiseplans",
      languageSubtitle: "Wähle die Sprache für deinen Reiseplan",
      extrasTitle: "Nützliche Extras",
      extrasSubtitle: "Optionale Extras für deinen Reiseplan",
      back: "Zurück",
      next: "Weiter",
      creating: "Wird erstellt...",
      generate: "Meinen Reiseplan erstellen",
    },
    auth: { title: "Bitte einloggen", description: "Du brauchst ein Konto, um Reisepläne zu erstellen." },
    error: { title: "Fehler", description: "Reiseplan konnte nicht erstellt werden" },
  },
} as const;

const ItineraryGenerator = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const uiLang = useLanguage();
  const copy = ITINERARY_UI[uiLang] ?? ITINERARY_UI.en;

  const tripTypes = [
    { value: "solo", label: copy.tripTypes.solo },
    { value: "couple", label: copy.tripTypes.couple },
    { value: "family", label: copy.tripTypes.family },
    { value: "friends", label: copy.tripTypes.friends },
    { value: "honeymoon", label: copy.tripTypes.honeymoon },
    { value: "business", label: copy.tripTypes.business },
  ];

  const interestsOptions = [
    { id: "culture", label: copy.interests.culture },
    { id: "gastronomy", label: copy.interests.gastronomy },
    { id: "nature", label: copy.interests.nature },
    { id: "beach", label: copy.interests.beach },
    { id: "nightlife", label: copy.interests.nightlife },
    { id: "shopping", label: copy.interests.shopping },
    { id: "adventure", label: copy.interests.adventure },
    { id: "photography", label: copy.interests.photography },
    { id: "hidden-gems", label: copy.interests.hiddenGems },
    { id: "luxury", label: copy.interests.luxury },
  ];

  const budgetLevels = [
    { value: "budget", label: copy.budgets.budget.label, icon: "€", desc: copy.budgets.budget.desc },
    { value: "mid-range", label: copy.budgets.midRange.label, icon: "€€", desc: copy.budgets.midRange.desc },
    { value: "luxury", label: copy.budgets.luxury.label, icon: "€€€", desc: copy.budgets.luxury.desc },
  ];

  const extrasOptions = [
    { id: "restaurants", label: copy.extras.restaurants },
    { id: "accommodation", label: copy.extras.accommodation },
    { id: "transport", label: copy.extras.transport },
    { id: "budget", label: copy.extras.budget },
    { id: "packing", label: copy.extras.packing },
    { id: "phrases", label: copy.extras.phrases },
  ];

  const steps = [
    { icon: MapPin, label: copy.steps.destination },
    { icon: Users, label: copy.steps.travelers },
    { icon: Heart, label: copy.steps.interests },
    { icon: Wallet, label: copy.steps.budget },
    { icon: Globe, label: copy.steps.language },
    { icon: Sparkles, label: copy.steps.extras },
  ];

  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [destination, setDestination] = useState("");
  const [destSearch, setDestSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [departureCity, setDepartureCity] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState<number[]>([]);
  const [tripType, setTripType] = useState("couple");
  const [interests, setInterests] = useState<string[]>([]);
  const [budgetLevel, setBudgetLevel] = useState("mid-range");
  const [language, setLanguage] = useState<string>(uiLang);
  const [extras, setExtras] = useState<string[]>(["restaurants", "transport"]);

  const numDays = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;
  const destinations = POPULAR_DESTINATIONS[uiLang] || POPULAR_DESTINATIONS.en;
  const filteredDestinations = destinations.filter((d) => d.toLowerCase().includes(destSearch.toLowerCase())).slice(0, 6);

  const toggleInterest = (id: string) => {
    setInterests((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleExtra = (id: string) => {
    setExtras((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const updateChildrenCount = (count: number) => {
    setChildren(count);
    setChildrenAges((prev) => {
      if (count > prev.length) return [...prev, ...Array(count - prev.length).fill(5)];
      return prev.slice(0, count);
    });
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return Boolean(destination && startDate && endDate && numDays > 0);
      case 1:
        return adults > 0;
      case 2:
        return interests.length > 0;
      case 3:
      case 4:
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleGenerate = async () => {
    if (!user) {
      toast({ title: copy.auth.title, description: copy.auth.description, variant: "destructive" });
      navigate("/login");
      return;
    }

    setIsGenerating(true);
    try {
      const { data: itinerary, error: insertError } = await supabase
        .from("itineraries")
        .insert({
          user_id: user.id,
          destination,
          departure_city: departureCity || null,
          start_date: format(startDate!, "yyyy-MM-dd"),
          end_date: format(endDate!, "yyyy-MM-dd"),
          num_days: numDays,
          trip_type: tripType,
          travelers_adults: adults,
          travelers_children: children,
          children_ages: childrenAges,
          interests,
          budget_level: budgetLevel,
          language,
          extras,
          status: "pending",
        })
        .select()
        .single();

      if (insertError) throw insertError;
      navigate(localizedPath(`/itinerary/${itinerary.id}`, uiLang));
    } catch (err: any) {
      toast({ title: copy.error.title, description: err.message || copy.error.description, variant: "destructive" });
      setIsGenerating(false);
    }
  };

  return (
    <PageLayout>
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.08),transparent_70%)]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
            <Sparkles className="w-4 h-4 mr-1.5" /> {copy.badge}
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
            {copy.heroTitle} <br />
            <span className="text-primary">{copy.heroAccent}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">{copy.heroSubtitle}</p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center justify-between mb-10">
            {steps.map((currentStep, i) => {
              const Icon = currentStep.icon;
              const isActive = i === step;
              const isDone = i < step;
              return (
                <button
                  key={i}
                  onClick={() => i < step && setStep(i)}
                  className={cn("flex flex-col items-center gap-1.5 transition-all", isActive && "scale-110", i > step && "opacity-40 cursor-default", i < step && "cursor-pointer")}
                >
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors", isActive ? "bg-primary text-primary-foreground" : isDone ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={cn("text-xs font-medium hidden sm:block", isActive ? "text-primary" : "text-muted-foreground")}>{currentStep.label}</span>
                </button>
              );
            })}
          </div>

          <Progress value={((step + 1) / steps.length) * 100} className="mb-8 h-2" />

          {step === 0 && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-foreground">{copy.form.whereWhen}</h2>

                <div className="space-y-2 relative">
                  <Label>{copy.form.destination}</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={destSearch || destination}
                      onChange={(e) => {
                        setDestSearch(e.target.value);
                        setDestination(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder={copy.form.destinationPlaceholder}
                      className="pl-10"
                    />
                  </div>
                  {showSuggestions && destSearch && filteredDestinations.length > 0 && (
                    <div className="absolute z-20 w-full bg-popover border rounded-lg shadow-lg mt-1">
                      {filteredDestinations.map((item) => (
                        <button
                          key={item}
                          className="w-full px-4 py-2.5 text-left hover:bg-muted text-sm transition-colors"
                          onClick={() => {
                            setDestination(item);
                            setDestSearch(item);
                            setShowSuggestions(false);
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{copy.form.departureDate}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : copy.form.pickDate}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={startDate} onSelect={setStartDate} disabled={(date) => date < new Date()} /></PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>{copy.form.returnDate}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : copy.form.pickDate}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={endDate} onSelect={setEndDate} disabled={(date) => date < (startDate || new Date())} /></PopoverContent>
                    </Popover>
                  </div>
                </div>

                {numDays > 0 && (
                  <Badge variant="secondary" className="text-sm">
                    📅 {numDays} {numDays === 1 ? copy.form.day : copy.form.days}
                  </Badge>
                )}

                <div className="space-y-2">
                  <Label>{copy.form.departureCity}</Label>
                  <div className="relative">
                    <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={departureCity} onChange={(e) => setDepartureCity(e.target.value)} placeholder={copy.form.departureCityPlaceholder} className="pl-10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 1 && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-foreground">{copy.form.travelersTitle}</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">{copy.form.adults}</Label>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="icon" onClick={() => setAdults(Math.max(1, adults - 1))}><Minus className="w-4 h-4" /></Button>
                      <span className="text-lg font-semibold w-8 text-center">{adults}</span>
                      <Button variant="outline" size="icon" onClick={() => setAdults(adults + 1)}><Plus className="w-4 h-4" /></Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-base">{copy.form.children}</Label>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="icon" onClick={() => updateChildrenCount(Math.max(0, children - 1))}><Minus className="w-4 h-4" /></Button>
                      <span className="text-lg font-semibold w-8 text-center">{children}</span>
                      <Button variant="outline" size="icon" onClick={() => updateChildrenCount(children + 1)}><Plus className="w-4 h-4" /></Button>
                    </div>
                  </div>

                  {children > 0 && (
                    <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                      <Label className="text-sm text-muted-foreground">{copy.form.childrenAges}</Label>
                      <div className="flex flex-wrap gap-2">
                        {childrenAges.map((age, i) => (
                          <Select key={i} value={String(age)} onValueChange={(value) => {
                            const nextAges = [...childrenAges];
                            nextAges[i] = parseInt(value);
                            setChildrenAges(nextAges);
                          }}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 18 }, (_, j) => (
                                <SelectItem key={j} value={String(j)}>{j} {copy.form.years}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-base">{copy.form.tripType}</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {tripTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setTripType(type.value)}
                        className={cn("px-4 py-3 rounded-lg border text-sm font-medium transition-all", tripType === type.value ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40")}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-foreground">{copy.form.interestsTitle}</h2>
                <p className="text-muted-foreground">{copy.form.interestsSubtitle}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {interestsOptions.map((interest) => (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className={cn("px-4 py-3 rounded-lg border text-left text-sm font-medium transition-all", interests.includes(interest.id) ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40")}
                    >
                      {interest.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-foreground">{copy.form.budgetTitle}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {budgetLevels.map((budget) => (
                    <button
                      key={budget.value}
                      onClick={() => setBudgetLevel(budget.value)}
                      className={cn("p-5 rounded-xl border text-center transition-all", budgetLevel === budget.value ? "border-primary bg-primary/10 shadow-sm" : "border-border hover:border-primary/40")}
                    >
                      <div className="text-2xl font-bold mb-1">{budget.icon}</div>
                      <div className="font-semibold text-foreground">{budget.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{budget.desc}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-foreground">{copy.form.languageTitle}</h2>
                <p className="text-muted-foreground">{copy.form.languageSubtitle}</p>
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

          {step === 5 && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-foreground">{copy.form.extrasTitle}</h2>
                <p className="text-muted-foreground">{copy.form.extrasSubtitle}</p>
                <div className="space-y-3">
                  {extrasOptions.map((extra) => (
                    <label
                      key={extra.id}
                      className={cn("flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all", extras.includes(extra.id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/40")}
                    >
                      <Checkbox checked={extras.includes(extra.id)} onCheckedChange={() => toggleExtra(extra.id)} />
                      <span className="text-sm font-medium">{extra.label}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0}>
              <ChevronLeft className="w-4 h-4 mr-1" /> {copy.form.back}
            </Button>

            {step < steps.length - 1 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                {copy.form.next} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button variant="cta" size="lg" onClick={handleGenerate} disabled={isGenerating || !canProceed()}>
                {isGenerating ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> {copy.form.creating}</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> {copy.form.generate}</>
                )}
              </Button>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ItineraryGenerator;
