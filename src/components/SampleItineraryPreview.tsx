import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ChevronDown, ChevronUp, MapPin, Utensils, Camera, Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n";

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
    overview: "Ghent is Belgium's best-kept secret — a medieval gem with canals, world-class art, and a vibrant food scene. Perfect for culture lovers and foodies who want to skip the Brussels crowds.",
    days: [
      {
        title: "Day 1: Medieval Magic & Waterfront Wonders",
        morning: "🏛️ Start at St. Bavo's Cathedral to see the Ghent Altarpiece (van Eyck's masterpiece). Walk to the Gravensteen Castle — climb the ramparts for city views. Stroll along Graslei & Korenlei, the postcard-perfect canal houses.",
        afternoon: "🎨 Visit the STAM city museum for Ghent's history. Explore the Patershol neighborhood — cobblestone alleys full of charm. Coffee at Mokabon, a local institution since 1937.",
        evening: "🍽️ Dinner at Publiek (modern Belgian, $$). Evening walk along the illuminated canals — Ghent's famous light plan makes the city magical at night.",
        tip: "The Ghent Altarpiece requires a timed ticket — book online at least 2 days ahead. It's free with the CityCard Gent (€38, includes all museums + transport).",
      },
      {
        title: "Day 2: Art, Street Food & Hidden Corners",
        morning: "🖼️ Museum of Fine Arts (MSK) — Flemish masters collection. Walk through Citadelpark, Ghent's green lung. Visit S.M.A.K. (contemporary art) right next door.",
        afternoon: "🍟 Street food tour: Frituur Tartaar for the best Belgian fries. Try a cuberdons (nose-shaped candy) at the Groentenmarkt. Wander through the Werregarenstraatje — Ghent's ever-changing graffiti alley.",
        evening: "🍺 Belgian beer tasting at Dulle Griet (you leave your shoe as deposit for the house beer!). Dinner at Otomat for gourmet pizza with a Belgian twist.",
        tip: "Ghent is a university city — Thursday nights the bars along Overpoortstraat are packed with students. Great atmosphere!",
      },
      {
        title: "Day 3: Nature, Markets & Farewell Waffles",
        morning: "🌿 Rent a bike and ride along the Coupure canal to Blaarmeersen park. Visit the Flower Market at Kouter square (weekends). Browse the vintage shops on Bij Sint-Jacobs.",
        afternoon: "☕ Lunch at Holy Food Market (converted chapel turned food hall — stunning). Last-minute shopping for Belgian chocolate at Yuzu or local speculoos at Tierenteyn-Verlent (mustard shop since 1790!).",
        evening: "🧇 Farewell Liège waffle at Max. Final sunset from St. Michael's Bridge — the best panoramic view in Ghent.",
        tip: "Take the train to Bruges for a half-day trip if you have extra time — it's only 26 minutes away. But honestly, Ghent has enough to keep you busy for a week!",
      },
    ],
  },
  es: {
    title: "📍 Ejemplo: Itinerario 3 días — Gante, Bélgica",
    subtitle: "Mira lo que nuestra IA genera para ti",
    seeExample: "Ver un ejemplo real",
    hideExample: "Ocultar ejemplo",
    ctaText: "Crea el tuyo ahora",
    overview: "Gante es el secreto mejor guardado de Bélgica — una joya medieval con canales, arte de clase mundial y una escena gastronómica vibrante. Perfecta para amantes de la cultura y foodies que quieren evitar las multitudes de Bruselas.",
    days: [
      {
        title: "Día 1: Magia Medieval y Maravillas junto al Agua",
        morning: "🏛️ Empieza en la Catedral de San Bavón para ver el Altar de Gante (obra maestra de van Eyck). Camina al Castillo de Gravensteen — sube a las murallas para vistas de la ciudad. Pasea por Graslei y Korenlei, las casas de canal más fotogénicas.",
        afternoon: "🎨 Visita el museo STAM para conocer la historia de Gante. Explora el barrio de Patershol — callejones empedrados llenos de encanto. Café en Mokabon, una institución local desde 1937.",
        evening: "🍽️ Cena en Publiek (belga moderno, $$). Paseo nocturno por los canales iluminados — el famoso plan de iluminación de Gante hace la ciudad mágica de noche.",
        tip: "El Altar de Gante requiere entrada con hora — reserva online al menos 2 días antes. Es gratis con la CityCard Gent (38 €, incluye todos los museos + transporte).",
      },
      {
        title: "Día 2: Arte, Street Food y Rincones Ocultos",
        morning: "🖼️ Museo de Bellas Artes (MSK) — colección de maestros flamencos. Paseo por Citadelpark, el pulmón verde de Gante. Visita S.M.A.K. (arte contemporáneo) justo al lado.",
        afternoon: "🍟 Ruta de street food: Frituur Tartaar para las mejores patatas fritas belgas. Prueba los cuberdons (caramelo en forma de nariz) en el Groentenmarkt. Recorre el Werregarenstraatje — el callejón de grafiti que cambia constantemente.",
        evening: "🍺 Cata de cervezas belgas en Dulle Griet (¡dejas tu zapato como depósito por la cerveza de la casa!). Cena en Otomat para pizza gourmet con toque belga.",
        tip: "Gante es una ciudad universitaria — los jueves por la noche los bares de Overpoortstraat están llenos de estudiantes. ¡Gran ambiente!",
      },
      {
        title: "Día 3: Naturaleza, Mercados y Gofres de Despedida",
        morning: "🌿 Alquila una bici y recorre el canal Coupure hasta el parque Blaarmeersen. Visita el Mercado de Flores en la plaza Kouter (fines de semana). Explora las tiendas vintage en Bij Sint-Jacobs.",
        afternoon: "☕ Almuerzo en Holy Food Market (capilla convertida en mercado gastronómico — impresionante). Últimas compras de chocolate belga en Yuzu o speculoos local en Tierenteyn-Verlent (¡tienda de mostaza desde 1790!).",
        evening: "🧇 Gofre de Lieja de despedida en Max. Último atardecer desde el Puente de San Miguel — la mejor vista panorámica de Gante.",
        tip: "Toma el tren a Brujas para una visita de medio día si te sobra tiempo — está a solo 26 minutos. Pero sinceramente, ¡Gante tiene suficiente para mantenerte ocupado una semana!",
      },
    ],
  },
  fr: {
    title: "📍 Exemple : Itinéraire 3 jours — Gand, Belgique",
    subtitle: "Découvrez ce que notre IA génère pour vous",
    seeExample: "Voir un exemple réel",
    hideExample: "Masquer l'exemple",
    ctaText: "Créez le vôtre maintenant",
    overview: "Gand est le secret le mieux gardé de Belgique — un joyau médiéval avec des canaux, un art de classe mondiale et une scène culinaire vibrante. Parfait pour les amateurs de culture et les gourmets qui veulent éviter la foule de Bruxelles.",
    days: [
      {
        title: "Jour 1 : Magie Médiévale et Merveilles au Bord de l'Eau",
        morning: "🏛️ Commencez par la Cathédrale Saint-Bavon pour voir le Retable de Gand (chef-d'œuvre de van Eyck). Promenez-vous au Château des Comtes — montez sur les remparts pour la vue. Flânez le long de Graslei & Korenlei.",
        afternoon: "🎨 Visitez le musée STAM. Explorez le quartier Patershol — ruelles pavées pleines de charme. Café chez Mokabon, institution locale depuis 1937.",
        evening: "🍽️ Dîner au Publiek (belge moderne, $$). Promenade nocturne le long des canaux illuminés.",
        tip: "Le Retable de Gand nécessite un billet horodaté — réservez en ligne au moins 2 jours à l'avance. Gratuit avec la CityCard Gent (38 €).",
      },
      {
        title: "Jour 2 : Art, Street Food et Recoins Cachés",
        morning: "🖼️ Musée des Beaux-Arts (MSK) — collection des maîtres flamands. Balade dans le Citadelpark. Visite du S.M.A.K. (art contemporain) juste à côté.",
        afternoon: "🍟 Tour street food : Frituur Tartaar pour les meilleures frites belges. Goûtez les cuberdons au Groentenmarkt. Parcourez le Werregarenstraatje — la ruelle de graffiti toujours changeante.",
        evening: "🍺 Dégustation de bières belges au Dulle Griet (vous laissez votre chaussure en caution !). Dîner chez Otomat.",
        tip: "Gand est une ville universitaire — les jeudis soirs les bars d'Overpoortstraat sont bondés. Superbe ambiance !",
      },
      {
        title: "Jour 3 : Nature, Marchés et Gaufres d'Adieu",
        morning: "🌿 Louez un vélo et longez le canal Coupure. Visitez le Marché aux Fleurs sur la place Kouter. Chineurs, direction Bij Sint-Jacobs.",
        afternoon: "☕ Déjeuner au Holy Food Market (chapelle reconvertie en halle gourmande). Derniers achats de chocolat belge chez Yuzu.",
        evening: "🧇 Gaufre de Liège d'adieu chez Max. Dernier coucher de soleil depuis le Pont Saint-Michel.",
        tip: "Prenez le train pour Bruges si vous avez du temps — à seulement 26 minutes. Mais honnêtement, Gand a de quoi vous occuper une semaine !",
      },
    ],
  },
  it: {
    title: "📍 Esempio: Itinerario 3 giorni — Gand, Belgio",
    subtitle: "Guarda cosa genera la nostra IA per te",
    seeExample: "Vedi un esempio reale",
    hideExample: "Nascondi esempio",
    ctaText: "Crea il tuo ora",
    overview: "Gand è il segreto meglio custodito del Belgio — un gioiello medievale con canali, arte di livello mondiale e una vivace scena gastronomica.",
    days: [
      {
        title: "Giorno 1: Magia Medievale e Meraviglie sull'Acqua",
        morning: "🏛️ Inizia dalla Cattedrale di San Bavone per vedere il Polittico di Gand. Passeggia al Castello dei Conti. Ammira Graslei e Korenlei.",
        afternoon: "🎨 Visita il museo STAM. Esplora il quartiere Patershol. Caffè da Mokabon, istituzione dal 1937.",
        evening: "🍽️ Cena da Publiek. Passeggiata serale lungo i canali illuminati.",
        tip: "Il Polittico richiede un biglietto con orario — prenota online almeno 2 giorni prima. Gratis con la CityCard Gent (38 €).",
      },
      {
        title: "Giorno 2: Arte, Street Food e Angoli Nascosti",
        morning: "🖼️ Museo di Belle Arti (MSK). Passeggiata nel Citadelpark. S.M.A.K. subito accanto.",
        afternoon: "🍟 Tour street food: Frituur Tartaar per le migliori patatine. Cuberdons al Groentenmarkt. Werregarenstraatje — il vicolo dei graffiti.",
        evening: "🍺 Degustazione birre al Dulle Griet. Cena da Otomat.",
        tip: "Gand è una città universitaria — i giovedì sera i bar di Overpoortstraat sono pieni!",
      },
      {
        title: "Giorno 3: Natura, Mercati e Waffle d'Addio",
        morning: "🌿 Noleggia una bici e percorri il canale Coupure. Mercato dei Fiori a Kouter. Negozi vintage a Bij Sint-Jacobs.",
        afternoon: "☕ Pranzo al Holy Food Market. Ultimi acquisti di cioccolato belga da Yuzu.",
        evening: "🧇 Waffle di Liegi d'addio da Max. Ultimo tramonto dal Ponte di San Michele.",
        tip: "Prendi il treno per Bruges — solo 26 minuti. Ma Gand ha abbastanza per una settimana!",
      },
    ],
  },
  de: {
    title: "📍 Beispiel: 3-Tage-Reiseplan — Gent, Belgien",
    subtitle: "Schau dir an, was unsere KI für dich erstellt",
    seeExample: "Echtes Beispiel ansehen",
    hideExample: "Beispiel ausblenden",
    ctaText: "Erstelle deinen jetzt",
    overview: "Gent ist Belgiens bestgehütetes Geheimnis — ein mittelalterliches Juwel mit Kanälen, erstklassiger Kunst und einer lebhaften Food-Szene.",
    days: [
      {
        title: "Tag 1: Mittelalterliche Magie und Uferpromenade",
        morning: "🏛️ Starte an der St.-Bavo-Kathedrale für den Genter Altar. Spaziere zur Gravensteen-Burg. Schlendere entlang Graslei & Korenlei.",
        afternoon: "🎨 Besuche das STAM-Museum. Erkunde Patershol. Kaffee im Mokabon seit 1937.",
        evening: "🍽️ Abendessen im Publiek. Abendspaziergang an den beleuchteten Kanälen.",
        tip: "Der Genter Altar braucht ein Zeitfenster-Ticket — mindestens 2 Tage vorher online buchen. Gratis mit CityCard Gent (38 €).",
      },
      {
        title: "Tag 2: Kunst, Street Food & Versteckte Ecken",
        morning: "🖼️ Museum für Schöne Künste (MSK). Spaziergang durch den Citadelpark. S.M.A.K. direkt nebenan.",
        afternoon: "🍟 Street-Food-Tour: Frituur Tartaar. Cuberdons am Groentenmarkt. Werregarenstraatje — die Graffiti-Gasse.",
        evening: "🍺 Bierverkostung im Dulle Griet. Abendessen im Otomat.",
        tip: "Gent ist eine Universitätsstadt — donnerstags sind die Bars in der Overpoortstraat voll!",
      },
      {
        title: "Tag 3: Natur, Märkte & Abschieds-Waffeln",
        morning: "🌿 Miete ein Fahrrad und fahre am Coupure-Kanal entlang. Blumenmarkt am Kouter. Vintage-Läden bei Bij Sint-Jacobs.",
        afternoon: "☕ Mittagessen im Holy Food Market. Letzte Einkäufe: belgische Schokolade bei Yuzu.",
        evening: "🧇 Abschieds-Lütticher-Waffel bei Max. Letzter Sonnenuntergang von der St.-Michael-Brücke.",
        tip: "Nimm den Zug nach Brügge — nur 26 Minuten. Aber Gent hat genug für eine Woche!",
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
                <p className="text-sm text-foreground leading-relaxed">{sample.overview}</p>
              </div>

              <div className="space-y-6">
                {sample.days.map((day, i) => (
                  <div key={i} className="border-l-4 border-primary/40 pl-4">
                    <h4 className="font-bold text-foreground mb-3">{day.title}</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex gap-2">
                        <Camera className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                        <div><span className="font-medium text-foreground">Morning — </span>{day.morning}</div>
                      </div>
                      <div className="flex gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                        <div><span className="font-medium text-foreground">Afternoon — </span>{day.afternoon}</div>
                      </div>
                      <div className="flex gap-2">
                        <Utensils className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                        <div><span className="font-medium text-foreground">Evening — </span>{day.evening}</div>
                      </div>
                      <div className="bg-primary/5 rounded p-2 mt-2 text-xs">
                        💡 <strong>Pro tip:</strong> {day.tip}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10 text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  {sample.subtitle}
                </p>
                <p className="text-xs text-muted-foreground">
                  ✅ Restaurant tips · ✅ Budget breakdown · ✅ Transport · ✅ Packing list · ✅ Local phrases
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
      { icon: "🌍", heading: "Overview", content: "Kotor is a fortified town nestled in a secluded bay of the Adriatic Sea. Its old town is a UNESCO World Heritage Site, with Venetian architecture, winding alleys, and dramatic mountain backdrops. Often overshadowed by Dubrovnik, Kotor offers similar charm at a fraction of the price." },
      { icon: "🏛️", heading: "Top Attractions", content: "• San Giovanni Fortress — 1,350 steps to the top for breathtaking bay views (free entry, go at sunset)\n• Kotor Old Town — car-free medieval maze with 12th-century cathedral\n• Our Lady of the Rocks — tiny island church accessible by boat from Perast (€5)\n• Lovćen National Park — 25 serpentine curves to Njeguši village for smoked ham & cheese" },
      { icon: "🍽️", heading: "Where to Eat", content: "• Galion ($$) — Waterfront fine dining with the best seafood risotto in Montenegro\n• Cesarica ($) — Family-run konoba with grilled squid and local Vranac wine\n• Forza Gastro Bar ($$) — Creative Mediterranean fusion in a converted stone house\n• Tanjga ($) — Hidden gem for ćevapi and burek near the North Gate" },
      { icon: "💰", heading: "Budget Tips", content: "Montenegro uses the Euro. A day in Kotor costs ~€40-60 (budget) or €100-150 (mid-range). Accommodation in the old town starts at €30/night for apartments. The city walls hike is free. Water taxis to beaches cost €3-5. Avoid restaurants on the main square — walk 2 minutes into the alleys for 40% lower prices." },
      { icon: "🚌", heading: "Getting Around", content: "Kotor is walkable. For day trips: Blue Line buses to Budva (€3, 40min), Perast (€2, 15min), or Herceg Novi (€5, 1h). Rent a car for Lovćen (€25/day). Tivat Airport is 8km away (taxi €15). From Dubrovnik Airport: shared shuttle €25 or bus via Herceg Novi." },
      { icon: "🗣️", heading: "Useful Phrases", content: "• Zdravo (ZDRAH-voh) — Hello\n• Hvala (HVAH-lah) — Thank you\n• Koliko košta? (KOH-lee-koh KOSH-tah) — How much?\n• Račun, molim (RAH-choon MOH-leem) — The bill, please\n• Jedno pivo (YED-noh PEE-voh) — One beer" },
    ],
  },
  es: {
    title: "📖 Ejemplo: Guía de Viaje — Kotor, Montenegro",
    subtitle: "Una vista previa de lo que generan nuestras guías con IA",
    seeExample: "Ver un ejemplo de guía real",
    hideExample: "Ocultar ejemplo",
    sections: [
      { icon: "🌍", heading: "Visión General", content: "Kotor es una ciudad fortificada en una bahía recóndita del mar Adriático. Su casco antiguo es Patrimonio de la Humanidad de la UNESCO, con arquitectura veneciana, callejones sinuosos y montañas impresionantes. A menudo eclipsada por Dubrovnik, Kotor ofrece un encanto similar a una fracción del precio." },
      { icon: "🏛️", heading: "Principales Atracciones", content: "• Fortaleza de San Giovanni — 1.350 escalones hasta la cima para vistas impresionantes de la bahía (gratis, ve al atardecer)\n• Casco Antiguo de Kotor — laberinto medieval sin coches con catedral del siglo XII\n• Nuestra Señora de las Rocas — iglesia en isla accesible en barco desde Perast (5 €)\n• Parque Nacional Lovćen — 25 curvas serpenteantes hasta Njeguši para jamón ahumado y queso" },
      { icon: "🍽️", heading: "Dónde Comer", content: "• Galion ($$) — Alta cocina frente al mar con el mejor risotto de marisco de Montenegro\n• Cesarica ($) — Konoba familiar con calamar a la parrilla y vino local Vranac\n• Forza Gastro Bar ($$) — Fusión mediterránea creativa en casa de piedra\n• Tanjga ($) — Joya oculta para ćevapi y burek cerca de la Puerta Norte" },
      { icon: "💰", heading: "Consejos de Presupuesto", content: "Montenegro usa el Euro. Un día en Kotor cuesta ~40-60 € (económico) o 100-150 € (gama media). Alojamiento en el casco antiguo desde 30 €/noche. La subida a las murallas es gratis. Taxis acuáticos a playas: 3-5 €. Evita restaurantes en la plaza principal — camina 2 minutos por los callejones para precios 40% más bajos." },
      { icon: "🚌", heading: "Cómo Moverse", content: "Kotor se recorre a pie. Para excursiones: autobuses Blue Line a Budva (3 €, 40min), Perast (2 €, 15min) o Herceg Novi (5 €, 1h). Alquila coche para Lovćen (25 €/día). Aeropuerto de Tivat a 8km (taxi 15 €)." },
      { icon: "🗣️", heading: "Frases Útiles", content: "• Zdravo (ZDRAH-voh) — Hola\n• Hvala (HVAH-lah) — Gracias\n• Koliko košta? (KOH-lee-koh KOSH-tah) — ¿Cuánto cuesta?\n• Račun, molim (RAH-choon MOH-leem) — La cuenta, por favor\n• Jedno pivo (YED-noh PEE-voh) — Una cerveza" },
    ],
  },
  fr: {
    title: "📖 Exemple : Guide de Voyage — Kotor, Monténégro",
    subtitle: "Un aperçu de ce que nos guides IA produisent",
    seeExample: "Voir un exemple de guide",
    hideExample: "Masquer l'exemple",
    sections: [
      { icon: "🌍", heading: "Aperçu", content: "Kotor est une ville fortifiée nichée dans une baie secrète de l'Adriatique. Sa vieille ville est classée au patrimoine mondial de l'UNESCO. Souvent éclipsée par Dubrovnik, Kotor offre un charme similaire à une fraction du prix." },
      { icon: "🏛️", heading: "Attractions Principales", content: "• Forteresse Saint-Jean — 1 350 marches pour une vue imprenable (gratuit, allez-y au coucher du soleil)\n• Vieille ville de Kotor — labyrinthe médiéval piéton\n• Notre-Dame du Récif — église sur une île, accessible en bateau (5 €)\n• Parc national du Lovćen — 25 virages jusqu'à Njeguši" },
      { icon: "🍽️", heading: "Où Manger", content: "• Galion ($$) — Fruits de mer en bord de mer\n• Cesarica ($) — Konoba familiale\n• Forza Gastro Bar ($$) — Fusion méditerranéenne créative\n• Tanjga ($) — Ćevapi et burek près de la Porte Nord" },
      { icon: "💰", heading: "Budget", content: "Le Monténégro utilise l'Euro. Journée à Kotor : ~40-60 € (économique) ou 100-150 € (moyen). Hébergement dès 30 €/nuit dans la vieille ville." },
      { icon: "🚌", heading: "Se Déplacer", content: "Kotor se visite à pied. Bus Blue Line vers Budva (3 €, 40min), Perast (2 €, 15min). Location voiture pour le Lovćen (25 €/jour). Aéroport de Tivat à 8km." },
      { icon: "🗣️", heading: "Phrases Utiles", content: "• Zdravo — Bonjour\n• Hvala — Merci\n• Koliko košta? — Combien ça coûte ?\n• Račun, molim — L'addition, s'il vous plaît\n• Jedno pivo — Une bière" },
    ],
  },
  it: {
    title: "📖 Esempio: Guida di Viaggio — Kotor, Montenegro",
    subtitle: "Un'anteprima di ciò che le nostre guide AI creano",
    seeExample: "Vedi un esempio di guida",
    hideExample: "Nascondi esempio",
    sections: [
      { icon: "🌍", heading: "Panoramica", content: "Kotor è una città fortificata in una baia appartata dell'Adriatico. Il centro storico è Patrimonio UNESCO. Spesso oscurata da Dubrovnik, offre lo stesso fascino a prezzi molto più bassi." },
      { icon: "🏛️", heading: "Attrazioni", content: "• Fortezza di San Giovanni — 1.350 gradini per una vista mozzafiato\n• Centro storico di Kotor — labirinto medievale pedonale\n• Nostra Signora delle Rocce — chiesa su un'isoletta (5 €)\n• Parco Nazionale Lovćen" },
      { icon: "🍽️", heading: "Dove Mangiare", content: "• Galion ($$) — Risotto ai frutti di mare\n• Cesarica ($) — Konoba familiare\n• Forza Gastro Bar ($$) — Fusione mediterranea\n• Tanjga ($) — Ćevapi e burek" },
      { icon: "💰", heading: "Budget", content: "Il Montenegro usa l'Euro. Giornata a Kotor: ~40-60 € (economico) o 100-150 € (fascia media). Alloggio da 30 €/notte." },
      { icon: "🚌", heading: "Come Muoversi", content: "Kotor è visitabile a piedi. Bus per Budva (3 €, 40min), Perast (2 €, 15min). Noleggio auto per Lovćen (25 €/giorno)." },
      { icon: "🗣️", heading: "Frasi Utili", content: "• Zdravo — Ciao\n• Hvala — Grazie\n• Koliko košta? — Quanto costa?\n• Račun, molim — Il conto, per favore\n• Jedno pivo — Una birra" },
    ],
  },
  de: {
    title: "📖 Beispiel: Reiseführer — Kotor, Montenegro",
    subtitle: "Eine Vorschau unserer KI-Reiseführer",
    seeExample: "Echtes Guide-Beispiel ansehen",
    hideExample: "Beispiel ausblenden",
    sections: [
      { icon: "🌍", heading: "Überblick", content: "Kotor ist eine befestigte Stadt in einer abgelegenen Bucht der Adria. Die Altstadt ist UNESCO-Weltkulturerbe. Oft übersehen zugunsten von Dubrovnik, bietet Kotor ähnlichen Charme zu einem Bruchteil des Preises." },
      { icon: "🏛️", heading: "Top-Sehenswürdigkeiten", content: "• San-Giovanni-Festung — 1.350 Stufen mit atemberaubender Aussicht\n• Altstadt von Kotor — autofreies mittelalterliches Labyrinth\n• Unsere Liebe Frau auf dem Felsen — Inselkirche per Boot erreichbar (5 €)\n• Nationalpark Lovćen" },
      { icon: "🍽️", heading: "Essen gehen", content: "• Galion ($$) — Meeresfrüchte am Wasser\n• Cesarica ($) — Familien-Konoba\n• Forza Gastro Bar ($$) — Kreative mediterrane Fusion\n• Tanjga ($) — Ćevapi und Burek" },
      { icon: "💰", heading: "Budget-Tipps", content: "Montenegro nutzt den Euro. Ein Tag in Kotor: ~40-60 € (Budget) oder 100-150 € (Mittelklasse). Unterkünfte ab 30 €/Nacht." },
      { icon: "🚌", heading: "Fortbewegung", content: "Kotor ist zu Fuß erkundbar. Busse nach Budva (3 €, 40min), Perast (2 €, 15min). Mietwagen für Lovćen (25 €/Tag)." },
      { icon: "🗣️", heading: "Nützliche Sätze", content: "• Zdravo — Hallo\n• Hvala — Danke\n• Koliko košta? — Wie viel kostet das?\n• Račun, molim — Die Rechnung, bitte\n• Jedno pivo — Ein Bier" },
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
                    <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10 text-center">
                <p className="text-xs text-muted-foreground">
                  ✅ Culture · ✅ Food · ✅ Budget · ✅ Transport · ✅ Local phrases · ✅ Hidden gems
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};
