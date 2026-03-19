import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ChevronDown, ChevronUp, MapPin, Utensils, Camera, Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n";

/* Helper: renders text with [label](url) markdown links as real <a> tags */
const RichText = ({ text }: { text: string }) => {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <span>
      {parts.map((part, i) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (match) {
          return (
            <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">
              {match[1]}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

const GM = (name: string, city: string) => `https://www.google.com/maps/search/${encodeURIComponent(name + " " + city)}`;
const TA = (name: string, city: string) => `https://www.tripadvisor.com/Search?q=${encodeURIComponent(name + " " + city)}`;

const SAMPLE_ITINERARY: Record<string, {
  title: string;
  subtitle: string;
  seeExample: string;
  hideExample: string;
  ctaText: string;
  overview: string;
  days: { title: string; morning: string; afternoon: string; evening: string; tip: string }[];
}> = {
  en: {
    title: "📍 Example: 3-Day Itinerary — Ghent, Belgium",
    subtitle: "See what our AI generates for you",
    seeExample: "See a real example",
    hideExample: "Hide example",
    ctaText: "Create yours now",
    overview: "Ghent is Belgium's best-kept secret — a medieval gem with canals, world-class art, and a vibrant food scene. Perfect for culture lovers and foodies who want to skip the Brussels crowds. [📍 See Ghent on Maps](https://www.google.com/maps/search/Ghent+Belgium)",
    days: [
      {
        title: "Day 1: Medieval Magic & Waterfront Wonders",
        morning: `🏛️ Start at [St. Bavo's Cathedral](${GM("St Bavo's Cathedral", "Ghent")}) to see the Ghent Altarpiece (van Eyck's masterpiece). Walk to [Gravensteen Castle](${GM("Gravensteen", "Ghent")}) — climb the ramparts for city views. Stroll along [Graslei & Korenlei](${GM("Graslei", "Ghent")}), the postcard-perfect canal houses.`,
        afternoon: `🎨 Visit [STAM city museum](${GM("STAM", "Ghent")}) for Ghent's history. Explore the [Patershol](${GM("Patershol", "Ghent")}) neighborhood — cobblestone alleys full of charm. Coffee at [Mokabon](${GM("Mokabon", "Ghent")}), a local institution since 1937.`,
        evening: `🍽️ Dinner at [Publiek](${GM("Publiek restaurant", "Ghent")}) ([⭐ Reviews](${TA("Publiek", "Ghent")})) — modern Belgian, $$. Evening walk along the illuminated canals — Ghent's famous light plan makes the city magical at night.`,
        tip: `The Ghent Altarpiece requires a timed ticket — [book online](https://www.sintbaafskathedraal.be/en/) at least 2 days ahead. It's free with the [CityCard Gent](https://www.visitgent.be/en/citycard-gent) (€38, includes all museums + transport).`,
      },
      {
        title: "Day 2: Art, Street Food & Hidden Corners",
        morning: `🖼️ [Museum of Fine Arts (MSK)](${GM("MSK Museum", "Ghent")}) — Flemish masters collection. Walk through [Citadelpark](${GM("Citadelpark", "Ghent")}), Ghent's green lung. Visit [S.M.A.K.](${GM("SMAK", "Ghent")}) (contemporary art) right next door.`,
        afternoon: `🍟 Street food tour: [Frituur Tartaar](${GM("Frituur Tartaar", "Ghent")}) for the best Belgian fries. Try cuberdons (nose-shaped candy) at [Groentenmarkt](${GM("Groentenmarkt", "Ghent")}). Wander through [Werregarenstraatje](${GM("Werregarenstraatje", "Ghent")}) — Ghent's ever-changing graffiti alley.`,
        evening: `🍺 Belgian beer tasting at [Dulle Griet](${GM("Dulle Griet", "Ghent")}) ([⭐ Reviews](${TA("Dulle Griet", "Ghent")})) — you leave your shoe as deposit! Dinner at [Otomat](${GM("Otomat", "Ghent")}) for gourmet pizza with a Belgian twist.`,
        tip: "Ghent is a university city — Thursday nights the bars along Overpoortstraat are packed with students. Great atmosphere!",
      },
      {
        title: "Day 3: Nature, Markets & Farewell Waffles",
        morning: `🌿 Rent a bike and ride along the Coupure canal to [Blaarmeersen park](${GM("Blaarmeersen", "Ghent")}). Visit the [Flower Market at Kouter](${GM("Kouter", "Ghent")}) (weekends). Browse the vintage shops on [Bij Sint-Jacobs](${GM("Bij Sint-Jacobs", "Ghent")}).`,
        afternoon: `☕ Lunch at [Holy Food Market](${GM("Holy Food Market", "Ghent")}) ([⭐ Reviews](${TA("Holy Food Market", "Ghent")})) — converted chapel turned food hall. Belgian chocolate at [Yuzu](${GM("Yuzu chocolate", "Ghent")}). Speculoos at [Tierenteyn-Verlent](${GM("Tierenteyn-Verlent", "Ghent")}) (mustard shop since 1790!).`,
        evening: `🧇 Farewell Liège waffle at [Max](${GM("Max waffles", "Ghent")}). Final sunset from [St. Michael's Bridge](${GM("Sint-Michielsbrug", "Ghent")}) — the best panoramic view in Ghent.`,
        tip: `Take the train to [Bruges](${GM("Bruges", "Belgium")}) for a half-day trip — only 26 minutes away. But honestly, Ghent has enough to keep you busy for a week!`,
      },
    ],
  },
  es: {
    title: "📍 Ejemplo: Itinerario 3 días — Gante, Bélgica",
    subtitle: "Mira lo que nuestra IA genera para ti",
    seeExample: "Ver un ejemplo real",
    hideExample: "Ocultar ejemplo",
    ctaText: "Crea el tuyo ahora",
    overview: "Gante es el secreto mejor guardado de Bélgica — una joya medieval con canales, arte de clase mundial y una escena gastronómica vibrante. [📍 Ver Gante en Maps](https://www.google.com/maps/search/Ghent+Belgium)",
    days: [
      {
        title: "Día 1: Magia Medieval y Maravillas junto al Agua",
        morning: `🏛️ Empieza en la [Catedral de San Bavón](${GM("St Bavo's Cathedral", "Ghent")}) para ver el Altar de Gante. Camina al [Castillo de Gravensteen](${GM("Gravensteen", "Ghent")}). Pasea por [Graslei y Korenlei](${GM("Graslei", "Ghent")}).`,
        afternoon: `🎨 Visita el [museo STAM](${GM("STAM", "Ghent")}). Explora el barrio de [Patershol](${GM("Patershol", "Ghent")}). Café en [Mokabon](${GM("Mokabon", "Ghent")}), institución local desde 1937.`,
        evening: `🍽️ Cena en [Publiek](${GM("Publiek restaurant", "Ghent")}) ([⭐ Reseñas](${TA("Publiek", "Ghent")})) — belga moderno, $$. Paseo nocturno por los canales iluminados.`,
        tip: `El Altar de Gante requiere entrada con hora — [reserva online](https://www.sintbaafskathedraal.be/en/) al menos 2 días antes. Gratis con la [CityCard Gent](https://www.visitgent.be/en/citycard-gent) (38 €).`,
      },
      {
        title: "Día 2: Arte, Street Food y Rincones Ocultos",
        morning: `🖼️ [Museo de Bellas Artes (MSK)](${GM("MSK Museum", "Ghent")}) — maestros flamencos. Paseo por [Citadelpark](${GM("Citadelpark", "Ghent")}). Visita [S.M.A.K.](${GM("SMAK", "Ghent")}) justo al lado.`,
        afternoon: `🍟 [Frituur Tartaar](${GM("Frituur Tartaar", "Ghent")}) para las mejores patatas fritas. Cuberdons en el [Groentenmarkt](${GM("Groentenmarkt", "Ghent")}). Recorre el [Werregarenstraatje](${GM("Werregarenstraatje", "Ghent")}) — callejón de grafiti.`,
        evening: `🍺 Cata de cervezas en [Dulle Griet](${GM("Dulle Griet", "Ghent")}) ([⭐ Reseñas](${TA("Dulle Griet", "Ghent")})) — ¡dejas tu zapato como depósito! Cena en [Otomat](${GM("Otomat", "Ghent")}).`,
        tip: "Gante es una ciudad universitaria — los jueves por la noche los bares de Overpoortstraat están llenos de estudiantes. ¡Gran ambiente!",
      },
      {
        title: "Día 3: Naturaleza, Mercados y Gofres de Despedida",
        morning: `🌿 Alquila una bici y recorre el canal hasta [Blaarmeersen](${GM("Blaarmeersen", "Ghent")}). [Mercado de Flores en Kouter](${GM("Kouter", "Ghent")}). Tiendas vintage en [Bij Sint-Jacobs](${GM("Bij Sint-Jacobs", "Ghent")}).`,
        afternoon: `☕ Almuerzo en [Holy Food Market](${GM("Holy Food Market", "Ghent")}) ([⭐ Reseñas](${TA("Holy Food Market", "Ghent")})) — capilla convertida en mercado gastronómico. Chocolate belga en [Yuzu](${GM("Yuzu chocolate", "Ghent")}). Speculoos en [Tierenteyn-Verlent](${GM("Tierenteyn-Verlent", "Ghent")}).`,
        evening: `🧇 Gofre de Lieja en [Max](${GM("Max waffles", "Ghent")}). Último atardecer desde el [Puente de San Miguel](${GM("Sint-Michielsbrug", "Ghent")}).`,
        tip: `Toma el tren a [Brujas](${GM("Bruges", "Belgium")}) — a solo 26 minutos. Pero sinceramente, ¡Gante tiene suficiente para una semana!`,
      },
    ],
  },
  fr: {
    title: "📍 Exemple : Itinéraire 3 jours — Gand, Belgique",
    subtitle: "Découvrez ce que notre IA génère pour vous",
    seeExample: "Voir un exemple réel",
    hideExample: "Masquer l'exemple",
    ctaText: "Créez le vôtre maintenant",
    overview: "Gand est le secret le mieux gardé de Belgique — un joyau médiéval avec des canaux, un art de classe mondiale et une scène culinaire vibrante. [📍 Voir Gand sur Maps](https://www.google.com/maps/search/Ghent+Belgium)",
    days: [
      {
        title: "Jour 1 : Magie Médiévale et Merveilles au Bord de l'Eau",
        morning: `🏛️ Commencez par la [Cathédrale Saint-Bavon](${GM("St Bavo's Cathedral", "Ghent")}) pour le Retable de Gand. Promenez-vous au [Château des Comtes](${GM("Gravensteen", "Ghent")}). Flânez le long de [Graslei & Korenlei](${GM("Graslei", "Ghent")}).`,
        afternoon: `🎨 Visitez le [musée STAM](${GM("STAM", "Ghent")}). Explorez [Patershol](${GM("Patershol", "Ghent")}). Café chez [Mokabon](${GM("Mokabon", "Ghent")}).`,
        evening: `🍽️ Dîner au [Publiek](${GM("Publiek restaurant", "Ghent")}) ([⭐ Avis](${TA("Publiek", "Ghent")})) — belge moderne. Promenade nocturne le long des canaux illuminés.`,
        tip: `Le Retable nécessite un billet horodaté — [réservez en ligne](https://www.sintbaafskathedraal.be/en/) au moins 2 jours à l'avance. Gratuit avec la [CityCard Gent](https://www.visitgent.be/en/citycard-gent) (38 €).`,
      },
      {
        title: "Jour 2 : Art, Street Food et Recoins Cachés",
        morning: `🖼️ [Musée des Beaux-Arts (MSK)](${GM("MSK Museum", "Ghent")}). Balade dans le [Citadelpark](${GM("Citadelpark", "Ghent")}). [S.M.A.K.](${GM("SMAK", "Ghent")}) juste à côté.`,
        afternoon: `🍟 [Frituur Tartaar](${GM("Frituur Tartaar", "Ghent")}) pour les meilleures frites. Cuberdons au [Groentenmarkt](${GM("Groentenmarkt", "Ghent")}). [Werregarenstraatje](${GM("Werregarenstraatje", "Ghent")}) — la ruelle de graffiti.`,
        evening: `🍺 Dégustation au [Dulle Griet](${GM("Dulle Griet", "Ghent")}) ([⭐ Avis](${TA("Dulle Griet", "Ghent")})). Dîner chez [Otomat](${GM("Otomat", "Ghent")}).`,
        tip: "Les jeudis soirs les bars d'Overpoortstraat sont bondés. Superbe ambiance !",
      },
      {
        title: "Jour 3 : Nature, Marchés et Gaufres d'Adieu",
        morning: `🌿 Louez un vélo et longez le canal jusqu'à [Blaarmeersen](${GM("Blaarmeersen", "Ghent")}). [Marché aux Fleurs au Kouter](${GM("Kouter", "Ghent")}). Chineurs : [Bij Sint-Jacobs](${GM("Bij Sint-Jacobs", "Ghent")}).`,
        afternoon: `☕ Déjeuner au [Holy Food Market](${GM("Holy Food Market", "Ghent")}) ([⭐ Avis](${TA("Holy Food Market", "Ghent")})). Chocolat chez [Yuzu](${GM("Yuzu chocolate", "Ghent")}). [Tierenteyn-Verlent](${GM("Tierenteyn-Verlent", "Ghent")}).`,
        evening: `🧇 Gaufre d'adieu chez [Max](${GM("Max waffles", "Ghent")}). Coucher de soleil depuis le [Pont Saint-Michel](${GM("Sint-Michielsbrug", "Ghent")}).`,
        tip: `Prenez le train pour [Bruges](${GM("Bruges", "Belgium")}) — 26 minutes. Mais Gand a de quoi vous occuper une semaine !`,
      },
    ],
  },
  it: {
    title: "📍 Esempio: Itinerario 3 giorni — Gand, Belgio",
    subtitle: "Guarda cosa genera la nostra IA per te",
    seeExample: "Vedi un esempio reale",
    hideExample: "Nascondi esempio",
    ctaText: "Crea il tuo ora",
    overview: "Gand è il segreto meglio custodito del Belgio — un gioiello medievale con canali, arte di livello mondiale e una vivace scena gastronomica. [📍 Vedi Gand su Maps](https://www.google.com/maps/search/Ghent+Belgium)",
    days: [
      {
        title: "Giorno 1: Magia Medievale e Meraviglie sull'Acqua",
        morning: `🏛️ Inizia dalla [Cattedrale di San Bavone](${GM("St Bavo's Cathedral", "Ghent")}). Passeggia al [Castello dei Conti](${GM("Gravensteen", "Ghent")}). Ammira [Graslei e Korenlei](${GM("Graslei", "Ghent")}).`,
        afternoon: `🎨 Visita il [museo STAM](${GM("STAM", "Ghent")}). Esplora [Patershol](${GM("Patershol", "Ghent")}). Caffè da [Mokabon](${GM("Mokabon", "Ghent")}).`,
        evening: `🍽️ Cena da [Publiek](${GM("Publiek restaurant", "Ghent")}) ([⭐ Recensioni](${TA("Publiek", "Ghent")})). Passeggiata serale lungo i canali illuminati.`,
        tip: `Il Polittico richiede biglietto con orario — [prenota online](https://www.sintbaafskathedraal.be/en/). Gratis con la [CityCard Gent](https://www.visitgent.be/en/citycard-gent) (38 €).`,
      },
      {
        title: "Giorno 2: Arte, Street Food e Angoli Nascosti",
        morning: `🖼️ [Museo di Belle Arti (MSK)](${GM("MSK Museum", "Ghent")}). [Citadelpark](${GM("Citadelpark", "Ghent")}). [S.M.A.K.](${GM("SMAK", "Ghent")}) accanto.`,
        afternoon: `🍟 [Frituur Tartaar](${GM("Frituur Tartaar", "Ghent")}) per le migliori patatine. Cuberdons al [Groentenmarkt](${GM("Groentenmarkt", "Ghent")}). [Werregarenstraatje](${GM("Werregarenstraatje", "Ghent")}) — vicolo dei graffiti.`,
        evening: `🍺 Degustazione al [Dulle Griet](${GM("Dulle Griet", "Ghent")}) ([⭐ Recensioni](${TA("Dulle Griet", "Ghent")})). Cena da [Otomat](${GM("Otomat", "Ghent")}).`,
        tip: "I giovedì sera i bar di Overpoortstraat sono pieni di studenti!",
      },
      {
        title: "Giorno 3: Natura, Mercati e Waffle d'Addio",
        morning: `🌿 Noleggia una bici fino a [Blaarmeersen](${GM("Blaarmeersen", "Ghent")}). [Mercato dei Fiori a Kouter](${GM("Kouter", "Ghent")}). Vintage a [Bij Sint-Jacobs](${GM("Bij Sint-Jacobs", "Ghent")}).`,
        afternoon: `☕ Pranzo al [Holy Food Market](${GM("Holy Food Market", "Ghent")}) ([⭐ Recensioni](${TA("Holy Food Market", "Ghent")})). Cioccolato da [Yuzu](${GM("Yuzu chocolate", "Ghent")}). [Tierenteyn-Verlent](${GM("Tierenteyn-Verlent", "Ghent")}).`,
        evening: `🧇 Waffle d'addio da [Max](${GM("Max waffles", "Ghent")}). Tramonto dal [Ponte di San Michele](${GM("Sint-Michielsbrug", "Ghent")}).`,
        tip: `Treno per [Bruges](${GM("Bruges", "Belgium")}) — solo 26 minuti. Ma Gand ha abbastanza per una settimana!`,
      },
    ],
  },
  de: {
    title: "📍 Beispiel: 3-Tage-Reiseplan — Gent, Belgien",
    subtitle: "Schau dir an, was unsere KI für dich erstellt",
    seeExample: "Echtes Beispiel ansehen",
    hideExample: "Beispiel ausblenden",
    ctaText: "Erstelle deinen jetzt",
    overview: "Gent ist Belgiens bestgehütetes Geheimnis — ein mittelalterliches Juwel mit Kanälen, erstklassiger Kunst und einer lebhaften Food-Szene. [📍 Gent auf Maps](https://www.google.com/maps/search/Ghent+Belgium)",
    days: [
      {
        title: "Tag 1: Mittelalterliche Magie und Uferpromenade",
        morning: `🏛️ Starte an der [St.-Bavo-Kathedrale](${GM("St Bavo's Cathedral", "Ghent")}). Spaziere zur [Gravensteen-Burg](${GM("Gravensteen", "Ghent")}). Schlendere entlang [Graslei & Korenlei](${GM("Graslei", "Ghent")}).`,
        afternoon: `🎨 Besuche das [STAM-Museum](${GM("STAM", "Ghent")}). Erkunde [Patershol](${GM("Patershol", "Ghent")}). Kaffee im [Mokabon](${GM("Mokabon", "Ghent")}).`,
        evening: `🍽️ Abendessen im [Publiek](${GM("Publiek restaurant", "Ghent")}) ([⭐ Bewertungen](${TA("Publiek", "Ghent")})). Abendspaziergang an den beleuchteten Kanälen.`,
        tip: `Der Genter Altar braucht ein Zeitfenster-Ticket — [online buchen](https://www.sintbaafskathedraal.be/en/). Gratis mit [CityCard Gent](https://www.visitgent.be/en/citycard-gent) (38 €).`,
      },
      {
        title: "Tag 2: Kunst, Street Food & Versteckte Ecken",
        morning: `🖼️ [Museum für Schöne Künste (MSK)](${GM("MSK Museum", "Ghent")}). [Citadelpark](${GM("Citadelpark", "Ghent")}). [S.M.A.K.](${GM("SMAK", "Ghent")}) nebenan.`,
        afternoon: `🍟 [Frituur Tartaar](${GM("Frituur Tartaar", "Ghent")}). Cuberdons am [Groentenmarkt](${GM("Groentenmarkt", "Ghent")}). [Werregarenstraatje](${GM("Werregarenstraatje", "Ghent")}) — die Graffiti-Gasse.`,
        evening: `🍺 Bierverkostung im [Dulle Griet](${GM("Dulle Griet", "Ghent")}) ([⭐ Bewertungen](${TA("Dulle Griet", "Ghent")})). Abendessen im [Otomat](${GM("Otomat", "Ghent")}).`,
        tip: "Donnerstags sind die Bars in der Overpoortstraat voll!",
      },
      {
        title: "Tag 3: Natur, Märkte & Abschieds-Waffeln",
        morning: `🌿 Fahrrad bis [Blaarmeersen](${GM("Blaarmeersen", "Ghent")}). [Blumenmarkt am Kouter](${GM("Kouter", "Ghent")}). Vintage bei [Bij Sint-Jacobs](${GM("Bij Sint-Jacobs", "Ghent")}).`,
        afternoon: `☕ Mittagessen im [Holy Food Market](${GM("Holy Food Market", "Ghent")}) ([⭐ Bewertungen](${TA("Holy Food Market", "Ghent")})). Schokolade bei [Yuzu](${GM("Yuzu chocolate", "Ghent")}). [Tierenteyn-Verlent](${GM("Tierenteyn-Verlent", "Ghent")}).`,
        evening: `🧇 Abschieds-Waffel bei [Max](${GM("Max waffles", "Ghent")}). Sonnenuntergang von der [St.-Michael-Brücke](${GM("Sint-Michielsbrug", "Ghent")}).`,
        tip: `Zug nach [Brügge](${GM("Bruges", "Belgium")}) — nur 26 Minuten. Aber Gent hat genug für eine Woche!`,
      },
    ],
  },
};

export const SampleItineraryPreview = () => {
  const [expanded, setExpanded] = useState(false);
  const lang = useLanguage();
  const sample = SAMPLE_ITINERARY[lang] || SAMPLE_ITINERARY.en;

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-6">
          <Button
            variant={expanded ? "outline" : "default"}
            size="lg"
            onClick={() => setExpanded(!expanded)}
            className="gap-2"
          >
            <Eye className="w-5 h-5" />
            {expanded ? sample.hideExample : sample.seeExample}
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        {expanded && (
          <Card className="border-primary/20 shadow-lg animate-in fade-in-0 slide-in-from-top-4 duration-500">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" /> AI Generated
                </Badge>
                <Badge variant="outline" className="text-xs">Ghent, Belgium 🇧🇪</Badge>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{sample.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 italic">{sample.subtitle}</p>

              <div className="bg-accent/10 rounded-lg p-4 mb-6">
                <p className="text-sm text-foreground leading-relaxed"><RichText text={sample.overview} /></p>
              </div>

              <div className="space-y-6">
                {sample.days.map((day, i) => (
                  <div key={i} className="border-l-4 border-primary/40 pl-4">
                    <h4 className="font-bold text-foreground mb-3">{day.title}</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex gap-2">
                        <Camera className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                        <div><span className="font-medium text-foreground">Morning — </span><RichText text={day.morning} /></div>
                      </div>
                      <div className="flex gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                        <div><span className="font-medium text-foreground">Afternoon — </span><RichText text={day.afternoon} /></div>
                      </div>
                      <div className="flex gap-2">
                        <Utensils className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                        <div><span className="font-medium text-foreground">Evening — </span><RichText text={day.evening} /></div>
                      </div>
                      <div className="bg-primary/5 rounded p-2 mt-2 text-xs">
                        💡 <strong>Pro tip:</strong> <RichText text={day.tip} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10 text-center">
                <p className="text-xs text-muted-foreground">
                  ✅ Google Maps links · ✅ Restaurant reviews · ✅ Budget breakdown · ✅ Transport · ✅ Booking links · ✅ Local phrases
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

/* ────────────── GUIDE SAMPLE ────────────── */

const SAMPLE_GUIDE: Record<string, {
  title: string;
  subtitle: string;
  seeExample: string;
  hideExample: string;
  sections: { icon: string; heading: string; content: string }[];
}> = {
  en: {
    title: "📖 Example: Travel Guide — Kotor, Montenegro",
    subtitle: "A preview of what our AI-powered guides look like",
    seeExample: "See a real guide example",
    hideExample: "Hide example",
    sections: [
      { icon: "🌍", heading: "Overview", content: `Kotor is a fortified town nestled in a secluded bay of the Adriatic Sea. Its old town is a UNESCO World Heritage Site. Often overshadowed by Dubrovnik, Kotor offers similar charm at a fraction of the price. [📍 See Kotor on Maps](${GM("Kotor", "Montenegro")})` },
      { icon: "🏛️", heading: "Top Attractions", content: `• [San Giovanni Fortress](${GM("San Giovanni Fortress", "Kotor")}) — 1,350 steps for breathtaking bay views (free entry, go at sunset) [🎟️ Book tour](https://www.getyourguide.com/s/?q=San+Giovanni+Kotor)\n• [Kotor Old Town](${GM("Kotor Old Town", "Montenegro")}) — car-free medieval maze with 12th-century cathedral\n• [Our Lady of the Rocks](${GM("Our Lady of the Rocks", "Perast")}) — tiny island church, boat from Perast (€5) [🎟️ Book boat](https://www.getyourguide.com/s/?q=Our+Lady+Rocks+Perast)\n• [Lovćen National Park](${GM("Lovćen National Park", "Montenegro")}) — 25 serpentine curves to Njeguši village for smoked ham & cheese` },
      { icon: "🍽️", heading: "Where to Eat", content: `• [Galion](${GM("Galion restaurant", "Kotor")}) ([⭐ Reviews](${TA("Galion", "Kotor")})) — waterfront fine dining, best seafood risotto\n• [Cesarica](${GM("Cesarica", "Kotor")}) ([⭐ Reviews](${TA("Cesarica", "Kotor")})) — family konoba, grilled squid & Vranac wine\n• [Forza Gastro Bar](${GM("Forza Gastro Bar", "Kotor")}) ([⭐ Reviews](${TA("Forza Gastro Bar", "Kotor")})) — Mediterranean fusion in converted stone house\n• [Tanjga](${GM("Tanjga", "Kotor")}) ([⭐ Reviews](${TA("Tanjga", "Kotor")})) — hidden gem for ćevapi near North Gate` },
      { icon: "💰", heading: "Budget Tips", content: `Montenegro uses the Euro. A day in Kotor costs ~€40-60 (budget) or €100-150 (mid-range). Accommodation in the [old town](${GM("Kotor Old Town", "Montenegro")}) starts at €30/night. The city walls hike is free. Avoid restaurants on the main square — walk 2 minutes into the alleys for 40% lower prices.` },
      { icon: "🚌", heading: "Getting Around", content: `Kotor is walkable. Day trips: buses to [Budva](${GM("Budva", "Montenegro")}) (€3, 40min), [Perast](${GM("Perast", "Montenegro")}) (€2, 15min), [Herceg Novi](${GM("Herceg Novi", "Montenegro")}) (€5, 1h). Rent a car for [Lovćen](${GM("Lovćen", "Montenegro")}) (€25/day). [Tivat Airport](${GM("Tivat Airport", "Montenegro")}) is 8km away (taxi €15).` },
      { icon: "🗣️", heading: "Useful Phrases", content: "• Zdravo (ZDRAH-voh) — Hello\n• Hvala (HVAH-lah) — Thank you\n• Koliko košta? (KOH-lee-koh KOSH-tah) — How much?\n• Račun, molim (RAH-choon MOH-leem) — The bill, please\n• Jedno pivo (YED-noh PEE-voh) — One beer" },
    ],
  },
  es: {
    title: "📖 Ejemplo: Guía de Viaje — Kotor, Montenegro",
    subtitle: "Una vista previa de lo que generan nuestras guías con IA",
    seeExample: "Ver un ejemplo de guía real",
    hideExample: "Ocultar ejemplo",
    sections: [
      { icon: "🌍", heading: "Visión General", content: `Kotor es una ciudad fortificada en una bahía recóndita del Adriático. Su casco antiguo es Patrimonio UNESCO. A menudo eclipsada por Dubrovnik, ofrece un encanto similar a una fracción del precio. [📍 Ver Kotor en Maps](${GM("Kotor", "Montenegro")})` },
      { icon: "🏛️", heading: "Principales Atracciones", content: `• [Fortaleza de San Giovanni](${GM("San Giovanni Fortress", "Kotor")}) — 1.350 escalones, vistas impresionantes (gratis, ve al atardecer) [🎟️ Reservar tour](https://www.getyourguide.com/s/?q=San+Giovanni+Kotor)\n• [Casco Antiguo de Kotor](${GM("Kotor Old Town", "Montenegro")}) — laberinto medieval sin coches\n• [Nuestra Señora de las Rocas](${GM("Our Lady of the Rocks", "Perast")}) — iglesia en isla, barco desde Perast (5 €) [🎟️ Reservar barco](https://www.getyourguide.com/s/?q=Our+Lady+Rocks+Perast)\n• [Parque Nacional Lovćen](${GM("Lovćen National Park", "Montenegro")}) — 25 curvas hasta Njeguši` },
      { icon: "🍽️", heading: "Dónde Comer", content: `• [Galion](${GM("Galion restaurant", "Kotor")}) ([⭐ Reseñas](${TA("Galion", "Kotor")})) — alta cocina, mejor risotto de marisco\n• [Cesarica](${GM("Cesarica", "Kotor")}) ([⭐ Reseñas](${TA("Cesarica", "Kotor")})) — konoba familiar, calamar a la parrilla\n• [Forza Gastro Bar](${GM("Forza Gastro Bar", "Kotor")}) ([⭐ Reseñas](${TA("Forza Gastro Bar", "Kotor")})) — fusión mediterránea\n• [Tanjga](${GM("Tanjga", "Kotor")}) ([⭐ Reseñas](${TA("Tanjga", "Kotor")})) — joya oculta para ćevapi` },
      { icon: "💰", heading: "Presupuesto", content: `Montenegro usa el Euro. Día en Kotor: ~40-60 € (económico) o 100-150 € (gama media). Alojamiento en el [casco antiguo](${GM("Kotor Old Town", "Montenegro")}) desde 30 €/noche. Las murallas son gratis. Evita la plaza principal — callejones = precios 40% más bajos.` },
      { icon: "🚌", heading: "Cómo Moverse", content: `Kotor se recorre a pie. Excursiones: bus a [Budva](${GM("Budva", "Montenegro")}) (3 €, 40min), [Perast](${GM("Perast", "Montenegro")}) (2 €, 15min), [Herceg Novi](${GM("Herceg Novi", "Montenegro")}) (5 €, 1h). Alquila coche para [Lovćen](${GM("Lovćen", "Montenegro")}) (25 €/día). [Aeropuerto de Tivat](${GM("Tivat Airport", "Montenegro")}) a 8km.` },
      { icon: "🗣️", heading: "Frases Útiles", content: "• Zdravo (ZDRAH-voh) — Hola\n• Hvala (HVAH-lah) — Gracias\n• Koliko košta? (KOH-lee-koh KOSH-tah) — ¿Cuánto cuesta?\n• Račun, molim (RAH-choon MOH-leem) — La cuenta, por favor\n• Jedno pivo (YED-noh PEE-voh) — Una cerveza" },
    ],
  },
  fr: {
    title: "📖 Exemple : Guide de Voyage — Kotor, Monténégro",
    subtitle: "Un aperçu de ce que nos guides IA produisent",
    seeExample: "Voir un exemple de guide",
    hideExample: "Masquer l'exemple",
    sections: [
      { icon: "🌍", heading: "Aperçu", content: `Kotor est une ville fortifiée dans une baie secrète de l'Adriatique. Patrimoine UNESCO. [📍 Voir Kotor sur Maps](${GM("Kotor", "Montenegro")})` },
      { icon: "🏛️", heading: "Attractions Principales", content: `• [Forteresse Saint-Jean](${GM("San Giovanni Fortress", "Kotor")}) — 1 350 marches, vue imprenable [🎟️ Réserver](https://www.getyourguide.com/s/?q=San+Giovanni+Kotor)\n• [Vieille ville de Kotor](${GM("Kotor Old Town", "Montenegro")}) — labyrinthe médiéval piéton\n• [Notre-Dame du Récif](${GM("Our Lady of the Rocks", "Perast")}) — île accessible en bateau (5 €) [🎟️ Réserver](https://www.getyourguide.com/s/?q=Our+Lady+Rocks+Perast)\n• [Parc national du Lovćen](${GM("Lovćen National Park", "Montenegro")})` },
      { icon: "🍽️", heading: "Où Manger", content: `• [Galion](${GM("Galion restaurant", "Kotor")}) ([⭐ Avis](${TA("Galion", "Kotor")})) — fruits de mer\n• [Cesarica](${GM("Cesarica", "Kotor")}) ([⭐ Avis](${TA("Cesarica", "Kotor")})) — konoba familiale\n• [Forza Gastro Bar](${GM("Forza Gastro Bar", "Kotor")}) ([⭐ Avis](${TA("Forza Gastro Bar", "Kotor")}))\n• [Tanjga](${GM("Tanjga", "Kotor")}) ([⭐ Avis](${TA("Tanjga", "Kotor")})) — ćevapi` },
      { icon: "💰", heading: "Budget", content: `Euro. Journée : ~40-60 € (éco) ou 100-150 € (moyen). [Vieille ville](${GM("Kotor Old Town", "Montenegro")}) dès 30 €/nuit.` },
      { icon: "🚌", heading: "Se Déplacer", content: `À pied. Bus vers [Budva](${GM("Budva", "Montenegro")}) (3 €, 40min), [Perast](${GM("Perast", "Montenegro")}) (2 €, 15min). Voiture pour [Lovćen](${GM("Lovćen", "Montenegro")}) (25 €/jour). [Aéroport de Tivat](${GM("Tivat Airport", "Montenegro")}) à 8km.` },
      { icon: "🗣️", heading: "Phrases Utiles", content: "• Zdravo — Bonjour\n• Hvala — Merci\n• Koliko košta? — Combien ?\n• Račun, molim — L'addition\n• Jedno pivo — Une bière" },
    ],
  },
  it: {
    title: "📖 Esempio: Guida di Viaggio — Kotor, Montenegro",
    subtitle: "Un'anteprima di ciò che le nostre guide AI creano",
    seeExample: "Vedi un esempio di guida",
    hideExample: "Nascondi esempio",
    sections: [
      { icon: "🌍", heading: "Panoramica", content: `Kotor è una città fortificata in una baia dell'Adriatico. Patrimonio UNESCO. [📍 Vedi Kotor su Maps](${GM("Kotor", "Montenegro")})` },
      { icon: "🏛️", heading: "Attrazioni", content: `• [Fortezza di San Giovanni](${GM("San Giovanni Fortress", "Kotor")}) — 1.350 gradini, vista mozzafiato [🎟️ Prenota tour](https://www.getyourguide.com/s/?q=San+Giovanni+Kotor)\n• [Centro storico di Kotor](${GM("Kotor Old Town", "Montenegro")}) — labirinto medievale pedonale\n• [Nostra Signora delle Rocce](${GM("Our Lady of the Rocks", "Perast")}) — isoletta (5 €) [🎟️ Prenota barca](https://www.getyourguide.com/s/?q=Our+Lady+Rocks+Perast)\n• [Parco Nazionale Lovćen](${GM("Lovćen National Park", "Montenegro")})` },
      { icon: "🍽️", heading: "Dove Mangiare", content: `• [Galion](${GM("Galion restaurant", "Kotor")}) ([⭐ Recensioni](${TA("Galion", "Kotor")})) — risotto ai frutti di mare\n• [Cesarica](${GM("Cesarica", "Kotor")}) ([⭐ Recensioni](${TA("Cesarica", "Kotor")}))\n• [Forza Gastro Bar](${GM("Forza Gastro Bar", "Kotor")}) ([⭐ Recensioni](${TA("Forza Gastro Bar", "Kotor")}))\n• [Tanjga](${GM("Tanjga", "Kotor")}) ([⭐ Recensioni](${TA("Tanjga", "Kotor")}))` },
      { icon: "💰", heading: "Budget", content: `Euro. Giornata: ~40-60 € (economico) o 100-150 €. [Centro storico](${GM("Kotor Old Town", "Montenegro")}) da 30 €/notte.` },
      { icon: "🚌", heading: "Come Muoversi", content: `A piedi. Bus per [Budva](${GM("Budva", "Montenegro")}) (3 €, 40min), [Perast](${GM("Perast", "Montenegro")}) (2 €, 15min). Auto per [Lovćen](${GM("Lovćen", "Montenegro")}) (25 €/giorno). [Aeroporto di Tivat](${GM("Tivat Airport", "Montenegro")}) a 8km.` },
      { icon: "🗣️", heading: "Frasi Utili", content: "• Zdravo — Ciao\n• Hvala — Grazie\n• Koliko košta? — Quanto costa?\n• Račun, molim — Il conto\n• Jedno pivo — Una birra" },
    ],
  },
  de: {
    title: "📖 Beispiel: Reiseführer — Kotor, Montenegro",
    subtitle: "Eine Vorschau unserer KI-Reiseführer",
    seeExample: "Echtes Guide-Beispiel ansehen",
    hideExample: "Beispiel ausblenden",
    sections: [
      { icon: "🌍", heading: "Überblick", content: `Kotor ist eine befestigte Stadt in einer Bucht der Adria. UNESCO-Weltkulturerbe. [📍 Kotor auf Maps](${GM("Kotor", "Montenegro")})` },
      { icon: "🏛️", heading: "Top-Sehenswürdigkeiten", content: `• [San-Giovanni-Festung](${GM("San Giovanni Fortress", "Kotor")}) — 1.350 Stufen, atemberaubende Aussicht [🎟️ Tour buchen](https://www.getyourguide.com/s/?q=San+Giovanni+Kotor)\n• [Altstadt von Kotor](${GM("Kotor Old Town", "Montenegro")}) — autofreies mittelalterliches Labyrinth\n• [Unsere Liebe Frau auf dem Felsen](${GM("Our Lady of the Rocks", "Perast")}) — Inselkirche (5 €) [🎟️ Boot buchen](https://www.getyourguide.com/s/?q=Our+Lady+Rocks+Perast)\n• [Nationalpark Lovćen](${GM("Lovćen National Park", "Montenegro")})` },
      { icon: "🍽️", heading: "Essen gehen", content: `• [Galion](${GM("Galion restaurant", "Kotor")}) ([⭐ Bewertungen](${TA("Galion", "Kotor")})) — Meeresfrüchte\n• [Cesarica](${GM("Cesarica", "Kotor")}) ([⭐ Bewertungen](${TA("Cesarica", "Kotor")}))\n• [Forza Gastro Bar](${GM("Forza Gastro Bar", "Kotor")}) ([⭐ Bewertungen](${TA("Forza Gastro Bar", "Kotor")}))\n• [Tanjga](${GM("Tanjga", "Kotor")}) ([⭐ Bewertungen](${TA("Tanjga", "Kotor")}))` },
      { icon: "💰", heading: "Budget-Tipps", content: `Euro. Tag: ~40-60 € (Budget) oder 100-150 €. [Altstadt](${GM("Kotor Old Town", "Montenegro")}) ab 30 €/Nacht.` },
      { icon: "🚌", heading: "Fortbewegung", content: `Zu Fuß. Busse nach [Budva](${GM("Budva", "Montenegro")}) (3 €, 40min), [Perast](${GM("Perast", "Montenegro")}) (2 €, 15min). Mietwagen für [Lovćen](${GM("Lovćen", "Montenegro")}) (25 €/Tag). [Flughafen Tivat](${GM("Tivat Airport", "Montenegro")}) 8km.` },
      { icon: "🗣️", heading: "Nützliche Sätze", content: "• Zdravo — Hallo\n• Hvala — Danke\n• Koliko košta? — Wie viel?\n• Račun, molim — Die Rechnung\n• Jedno pivo — Ein Bier" },
    ],
  },
};

export const SampleGuidePreview = () => {
  const [expanded, setExpanded] = useState(false);
  const lang = useLanguage();
  const sample = SAMPLE_GUIDE[lang] || SAMPLE_GUIDE.en;

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-6">
          <Button
            variant={expanded ? "outline" : "default"}
            size="lg"
            onClick={() => setExpanded(!expanded)}
            className="gap-2"
          >
            <Eye className="w-5 h-5" />
            {expanded ? sample.hideExample : sample.seeExample}
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        {expanded && (
          <Card className="border-primary/20 shadow-lg animate-in fade-in-0 slide-in-from-top-4 duration-500">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" /> AI Generated
                </Badge>
                <Badge variant="outline" className="text-xs">Kotor, Montenegro 🇲🇪</Badge>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{sample.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 italic">{sample.subtitle}</p>

              <div className="space-y-5">
                {sample.sections.map((section, i) => (
                  <div key={i} className="border-l-4 border-primary/40 pl-4">
                    <h4 className="font-bold text-foreground mb-2">{section.icon} {section.heading}</h4>
                    <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      <RichText text={section.content} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10 text-center">
                <p className="text-xs text-muted-foreground">
                  ✅ Google Maps links · ✅ TripAdvisor reviews · ✅ Booking links · ✅ Official websites · ✅ Transport apps · ✅ Local phrases
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};
