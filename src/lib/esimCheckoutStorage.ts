export const ESIM_CHECKOUT_STORAGE_KEY = "dm_esim_checkout_v1";

export type EsimCheckoutPayload = {
  package_code: string;
  amount: number;
};

export function readEsimCheckoutPayload(): EsimCheckoutPayload | null {
  try {
    const raw = sessionStorage.getItem(ESIM_CHECKOUT_STORAGE_KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw) as EsimCheckoutPayload;
    const packageCode = String(payload.package_code ?? "").trim();
    const amount = Number(payload.amount);
    if (!packageCode) return null;
    if (!Number.isFinite(amount) || amount < 1) return null;
    return { package_code: packageCode, amount };
  } catch {
    return null;
  }
}

