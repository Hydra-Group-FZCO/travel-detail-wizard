import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
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
import { format, differenceInDays } from "date-fns";
import {
  CalendarIcon, MapPin, Users, Heart, Wallet, Globe, Sparkles,
  Plus, Minus, ChevronRight, ChevronLeft, Plane, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const POPULAR_DESTINATIONS = [
  "Paris, France", "Tokyo, Japan", "Barcelona, Spain", "Rome, Italy",
  "New York, USA", "London, UK", "Bali, Indonesia", "Dubai, UAE",
  "Lisbon, Portugal", "Amsterdam, Netherlands", "Bangkok, Thailand",
  "Istanbul, Turkey", "Prague, Czech Republic", "Marrakech, Morocco",
  "Santorini, Greece", "Buenos Aires, Argentina", "Sydney, Australia",
  "Seoul, South Korea", "Vienna, Austria", "Cape Town, South Africa",
];

const TRIP_TYPES = [
  { value: "solo", label: "🧑 Solo" },
  { value: "couple", label: "💑 Couple" },
  { value: "family", label: "👨‍👩‍👧‍👦 Family" },
  { value: "friends", label: "👫 Friends" },
  { value: "honeymoon", label: "💒 Honeymoon" },
  { value: "business", label: "💼 Business" },
];

const INTERESTS = [
  { id: "culture", label: "🏛️ Culture & Museums" },
  { id: "gastronomy", label: "🍽️ Gastronomy & Local Food" },
  { id: "nature", label: "🌿 Nature & Hiking" },
  { id: "beach", label: "🏖️ Beach & Relaxation" },
  { id: "nightlife", label: "🎉 Nightlife & Entertainment" },
  { id: "shopping", label: "🛍️ Shopping" },
  { id: "adventure", label: "🧗 Adventure & Sports" },
  { id: "photography", label: "📸 Photography & Scenery" },
  { id: "hidden-gems", label: "💎 Hidden Gems & Local Life" },
  { id: "luxury", label: "✨ Luxury & Wellness" },
];

const BUDGET_LEVELS = [
  { value: "budget", label: "Budget", icon: "€", desc: "Hostels, street food, free activities" },
  { value: "mid-range", label: "Mid-range", icon: "€€", desc: "Hotels, restaurants, popular attractions" },
  { value: "luxury", label: "Luxury", icon: "€€€", desc: "5-star hotels, fine dining, VIP experiences" },
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

const EXTRAS = [
  { id: "restaurants", label: "🍽️ Restaurant recommendations" },
  { id: "accommodation", label: "🏨 Accommodation suggestions by neighborhood" },
  { id: "transport", label: "🚇 Transport between days (metro, bus, taxi tips)" },
  { id: "budget", label: "💶 Estimated daily budget breakdown" },
  { id: "packing", label: "🧳 Packing tips for destination & season" },
  { id: "phrases", label: "🗣️ Local phrases in destination language" },
];

function detectBrowserLanguage(): string {
  const lang = navigator.language.split("-")[0];
  const supported = OUTPUT_LANGUAGES.map((l) => l.code);
  return supported.includes(lang) ? lang : "en";
}

const STEPS = [
  { icon: MapPin, label: "Destination" },
  { icon: Users, label: "Travelers" },
  { icon: Heart, label: "Interests" },
  { icon: Wallet, label: "Budget" },
  { icon: Globe, label: "Language" },
  { icon: Sparkles, label: "Extras" },
];

const ItineraryGenerator = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form state
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
  const [language, setLanguage] = useState(detectBrowserLanguage());
  const [extras, setExtras] = useState<string[]>(["restaurants", "transport"]);

  const numDays = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;

  const filteredDestinations = POPULAR_DESTINATIONS.filter((d) =>
    d.toLowerCase().includes(destSearch.toLowerCase())
  ).slice(0, 6);

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleExtra = (id: string) => {
    setExtras((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
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
      case 0: return destination && startDate && endDate && numDays > 0;
      case 1: return adults > 0;
      case 2: return interests.length > 0;
      case 3: return true;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  const handleGenerate = async () => {
    if (!user) {
      toast({ title: "Please log in", description: "You need an account to generate itineraries.", variant: "destructive" });
      navigate("/login");
      return;
    }

    setIsGenerating(true);
    try {
      // Create itinerary record
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

      // Navigate to the display page which will trigger generation
      navigate(`/itinerary/${itinerary.id}`);
    } catch (err: any) {
      console.error("Error creating itinerary:", err);
      toast({ title: "Error", description: err.message || "Failed to create itinerary", variant: "destructive" });
      setIsGenerating(false);
    }
  };

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.08),transparent_70%)]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
            <Sparkles className="w-4 h-4 mr-1.5" /> AI-Powered
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
            Your perfect trip, <br />
            <span className="text-primary">planned by AI in seconds</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Personalized day-by-day itineraries in any language
          </p>
        </div>
      </section>

      {/* Stepper + Form */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Step indicators */}
          <div className="flex items-center justify-between mb-10">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              const isDone = i < step;
              return (
                <button
                  key={i}
                  onClick={() => i < step && setStep(i)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 transition-all",
                    isActive && "scale-110",
                    i > step && "opacity-40 cursor-default",
                    i < step && "cursor-pointer"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    isActive ? "bg-primary text-primary-foreground" :
                    isDone ? "bg-primary/20 text-primary" :
                    "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={cn(
                    "text-xs font-medium hidden sm:block",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>

          <Progress value={((step + 1) / STEPS.length) * 100} className="mb-8 h-2" />

          {/* Step 0: Destination & Dates */}
          {step === 0 && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Where & When</h2>

                <div className="space-y-2 relative">
                  <Label>Destination</Label>
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
                      placeholder="e.g. Paris, France"
                      className="pl-10"
                    />
                  </div>
                  {showSuggestions && destSearch && filteredDestinations.length > 0 && (
                    <div className="absolute z-20 w-full bg-popover border rounded-lg shadow-lg mt-1">
                      {filteredDestinations.map((d) => (
                        <button
                          key={d}
                          className="w-full px-4 py-2.5 text-left hover:bg-muted text-sm transition-colors"
                          onClick={() => {
                            setDestination(d);
                            setDestSearch(d);
                            setShowSuggestions(false);
                          }}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Departure date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={startDate} onSelect={setStartDate} disabled={(d) => d < new Date()} /></PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Return date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={endDate} onSelect={setEndDate} disabled={(d) => d < (startDate || new Date())} /></PopoverContent>
                    </Popover>
                  </div>
                </div>

                {numDays > 0 && (
                  <Badge variant="secondary" className="text-sm">📅 {numDays} day{numDays !== 1 ? "s" : ""}</Badge>
                )}

                <div className="space-y-2">
                  <Label>Departure city (optional)</Label>
                  <div className="relative">
                    <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={departureCity} onChange={(e) => setDepartureCity(e.target.value)} placeholder="e.g. Madrid" className="pl-10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 1: Travelers */}
          {step === 1 && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Who's traveling?</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Adults</Label>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="icon" onClick={() => setAdults(Math.max(1, adults - 1))}><Minus className="w-4 h-4" /></Button>
                      <span className="text-lg font-semibold w-8 text-center">{adults}</span>
                      <Button variant="outline" size="icon" onClick={() => setAdults(adults + 1)}><Plus className="w-4 h-4" /></Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-base">Children</Label>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="icon" onClick={() => updateChildrenCount(Math.max(0, children - 1))}><Minus className="w-4 h-4" /></Button>
                      <span className="text-lg font-semibold w-8 text-center">{children}</span>
                      <Button variant="outline" size="icon" onClick={() => updateChildrenCount(children + 1)}><Plus className="w-4 h-4" /></Button>
                    </div>
                  </div>

                  {children > 0 && (
                    <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                      <Label className="text-sm text-muted-foreground">Children's ages</Label>
                      <div className="flex flex-wrap gap-2">
                        {childrenAges.map((age, i) => (
                          <Select key={i} value={String(age)} onValueChange={(v) => {
                            const newAges = [...childrenAges];
                            newAges[i] = parseInt(v);
                            setChildrenAges(newAges);
                          }}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 18 }, (_, j) => (
                                <SelectItem key={j} value={String(j)}>{j} yr</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-base">Trip type</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TRIP_TYPES.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setTripType(t.value)}
                        className={cn(
                          "px-4 py-3 rounded-lg border text-sm font-medium transition-all",
                          tripType === t.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-foreground">What are you into?</h2>
                <p className="text-muted-foreground">Select all that apply</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INTERESTS.map((interest) => (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className={cn(
                        "px-4 py-3 rounded-lg border text-left text-sm font-medium transition-all",
                        interests.includes(interest.id)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      {interest.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Budget */}
          {step === 3 && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-foreground">What's your budget?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {BUDGET_LEVELS.map((b) => (
                    <button
                      key={b.value}
                      onClick={() => setBudgetLevel(b.value)}
                      className={cn(
                        "p-5 rounded-xl border text-center transition-all",
                        budgetLevel === b.value
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <div className="text-2xl font-bold mb-1">{b.icon}</div>
                      <div className="font-semibold text-foreground">{b.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{b.desc}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Language */}
          {step === 4 && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Itinerary language</h2>
                <p className="text-muted-foreground">Choose the language for your itinerary</p>
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

          {/* Step 5: Extras */}
          {step === 5 && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Extra goodies</h2>
                <p className="text-muted-foreground">Optional extras to include in your itinerary</p>
                <div className="space-y-3">
                  {EXTRAS.map((extra) => (
                    <label
                      key={extra.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                        extras.includes(extra.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <Checkbox
                        checked={extras.includes(extra.id)}
                        onCheckedChange={() => toggleExtra(extra.id)}
                      />
                      <span className="text-sm font-medium">{extra.label}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>

            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                variant="cta"
                size="lg"
                onClick={handleGenerate}
                disabled={isGenerating || !canProceed()}
              >
                {isGenerating ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Creating...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> Generate my itinerary</>
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
