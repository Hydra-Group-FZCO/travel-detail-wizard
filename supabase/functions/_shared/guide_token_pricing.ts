/** Must match src/lib/guideTokenPricing.ts */

export const GUIDE_TOKEN_MIN = 15_000;
export const GUIDE_TOKEN_MAX = 450_000;
export const GUIDE_TOKEN_STEP = 5_000;

const USD_MIN = 9;
const USD_MAX = 500;

export function clampTokens(n: number): number {
  const stepped = Math.round(n / GUIDE_TOKEN_STEP) * GUIDE_TOKEN_STEP;
  return Math.max(GUIDE_TOKEN_MIN, Math.min(GUIDE_TOKEN_MAX, stepped));
}

export function usdFromTokens(tokens: number): number {
  const t = clampTokens(tokens);
  const spanTok = GUIDE_TOKEN_MAX - GUIDE_TOKEN_MIN;
  const spanUsd = USD_MAX - USD_MIN;
  const usd = USD_MIN + ((t - GUIDE_TOKEN_MIN) / spanTok) * spanUsd;
  return Math.round(usd * 100) / 100;
}

export function centsFromTokens(tokens: number): number {
  return Math.round(usdFromTokens(tokens) * 100);
}

export function depthTierFromTokens(tokens: number): "essential" | "complete" | "ultimate" {
  const t = clampTokens(tokens);
  const span = GUIDE_TOKEN_MAX - GUIDE_TOKEN_MIN;
  const third = span / 3;
  if (t < GUIDE_TOKEN_MIN + third) return "essential";
  if (t < GUIDE_TOKEN_MIN + 2 * third) return "complete";
  return "ultimate";
}

const LEGACY_DEPTH_CENTS: Record<string, number> = {
  essential: 900,
  complete: 1500,
  ultimate: 2500,
};

/** Legacy Checkout: map old depth → token budget that yields same Stripe amount. */
export function tokensFromLegacyDepth(depth: string): number {
  const cents = LEGACY_DEPTH_CENTS[depth];
  if (!cents) return clampTokens(GUIDE_TOKEN_MIN);
  const targetUsd = cents / 100;
  const spanTok = GUIDE_TOKEN_MAX - GUIDE_TOKEN_MIN;
  const spanUsd = USD_MAX - USD_MIN;
  const raw = GUIDE_TOKEN_MIN + ((targetUsd - USD_MIN) / spanUsd) * spanTok;
  return clampTokens(raw);
}
