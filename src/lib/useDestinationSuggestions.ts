import { useEffect, useState } from "react";
import { loadDestinationIndex, searchDestinationLabels } from "./destinationSuggestions";

type Options = {
  limit?: number;
  minChars?: number;
  debounceMs?: number;
};

/**
 * English destination typeahead over all cities from country-state-city.
 * Debounced substring match on "City, Country".
 */
export function useDestinationSuggestions(query: string, options?: Options) {
  const limit = options?.limit ?? 6;
  const minChars = options?.minChars ?? 2;
  const debounceMs = options?.debounceMs ?? 150;

  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < minChars) {
      setResults([]);
      return;
    }

    let cancelled = false;
    const t = window.setTimeout(() => {
      void loadDestinationIndex()
        .then(() => {
          if (!cancelled) setResults(searchDestinationLabels(q, limit));
        })
        .catch(() => {
          if (!cancelled) setResults([]);
        });
    }, debounceMs);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [query, limit, minChars, debounceMs]);

  return results;
}
