import type { ConsultancyPlanId } from "@/lib/consultancyPlans";

export const CONSULTANCY_CHECKOUT_STORAGE_KEY = "dm_consultancy_checkout_v1";

export type ConsultancyCheckoutPayload = {
  plan: ConsultancyPlanId;
  adults: number;
  children: number;
  destination?: "Aruba" | "Canada" | "United Kingdom";
};

export function readConsultancyCheckoutPayload(): ConsultancyCheckoutPayload | null {
  try {
    const raw = sessionStorage.getItem(CONSULTANCY_CHECKOUT_STORAGE_KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw) as ConsultancyCheckoutPayload;
    if (!payload?.plan) return null;
    const adults = Number(payload.adults);
    const children = Number(payload.children);
    if (!Number.isFinite(adults) || !Number.isFinite(children)) return null;
    if (adults < 1 || children < 0) return null;
    const destination =
      payload.destination === "Aruba" || payload.destination === "Canada" || payload.destination === "United Kingdom"
        ? payload.destination
        : undefined;
    return { plan: payload.plan, adults, children, destination };
  } catch {
    return null;
  }
}
