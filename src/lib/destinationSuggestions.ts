/** English labels: "City, Country" from full world city list (country-state-city). */

type CityRow = { label: string; lo: string };

let rows: CityRow[] | null = null;
let loadPromise: Promise<void> | null = null;

/** Load and index all cities once (English country names). Uses dynamic import so the dataset is code-split. */
export function loadDestinationIndex(): Promise<void> {
  if (rows) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const { City, Country } = await import("country-state-city");
    const countryNames = new Map(Country.getAllCountries().map((c) => [c.isoCode, c.name]));
    const cities = City.getAllCities(["name", "countryCode"]);
    rows = cities.map((city) => {
      const country = countryNames.get(city.countryCode) ?? city.countryCode;
      const label = `${city.name}, ${country}`;
      return { label, lo: label.toLowerCase() };
    });
  })();

  return loadPromise;
}

/** Search indexed cities (sync). Call after `loadDestinationIndex()` has settled. */
export function searchDestinationLabels(query: string, limit: number): string[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2 || !rows) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const r of rows) {
    if (r.lo.includes(q)) {
      if (seen.has(r.label)) continue;
      seen.add(r.label);
      out.push(r.label);
      if (out.length >= limit) break;
    }
  }
  return out;
}
