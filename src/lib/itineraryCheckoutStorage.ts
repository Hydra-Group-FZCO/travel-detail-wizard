/** Session handoff from itinerary wizard → payment page (avoids huge query strings). */
export const ITINERARY_CHECKOUT_STORAGE_KEY = "dm_itinerary_checkout_v1";

export type ItineraryCheckoutPayload = {
  destination: string;
  departure_city: string;
  start_date: string;
  end_date: string;
  num_days: number;
  trip_type: string;
  travelers_adults: number;
  travelers_children: number;
  children_ages: number[];
  interests: string[];
  budget_level: string;
  language: string;
  extras: string[];
};
