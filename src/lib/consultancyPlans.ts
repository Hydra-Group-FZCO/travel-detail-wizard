export type ConsultancyPlanId = "2-weeks" | "1-week" | "3-days" | "2-days";

export const CONSULTANCY_PLANS: Array<{
  id: ConsultancyPlanId;
  title: string;
  priceUsd: number;
}> = [
  { id: "2-weeks", title: "Ready in 2 week", priceUsd: 40 },
  { id: "1-week", title: "Ready in 1 week", priceUsd: 50 },
  { id: "3-days", title: "Ready in 3 days", priceUsd: 60 },
  { id: "2-days", title: "Ready in 2 days", priceUsd: 70 },
];

export function consultancyPlanById(id: string | null | undefined) {
  return CONSULTANCY_PLANS.find((p) => p.id === id);
}
