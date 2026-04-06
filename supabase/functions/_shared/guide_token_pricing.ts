/** Must match src/lib/guideTokenPricing.ts */

export const GUIDE_TOKEN_MIN = 15_000;
export const GUIDE_TOKEN_MAX = 450_000;
/** @deprecated */
export const GUIDE_TOKEN_STEP = 5_000;

export const GUIDE_TIER_TOKENS = {
  essential: 15_000,
  complete: 232_500,
  ultimate: 450_000,
} as const;

const GUIDE_TIER_ORDER = [
  GUIDE_TIER_TOKENS.essential,
  GUIDE_TIER_TOKENS.complete,
  GUIDE_TIER_TOKENS.ultimate,
] as const;

const USD_MIN = 9;
const USD_MAX = 500;

export function clampTokens(n: number): number {
  const r = Math.round(Number(n));
  if (!Number.isFinite(r)) return GUIDE_TIER_TOKENS.complete;
  let best: number = GUIDE_TIER_ORDER[0];
  let bestDist = Infinity;
  for (const t of GUIDE_TIER_ORDER) {
    const d = Math.abs(r - t);
    if (d < bestDist) {
      bestDist = d;
      best = t;
    }
  }
  return best;
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
  if (t === GUIDE_TIER_TOKENS.essential) return "essential";
  if (t === GUIDE_TIER_TOKENS.complete) return "complete";
  return "ultimate";
}

/** Requests that only send `depth` map to the fixed tier token budgets. */
export function tokensFromLegacyDepth(depth: string): number {
  const d = String(depth).toLowerCase();
  if (d === "complete") return GUIDE_TIER_TOKENS.complete;
  if (d === "ultimate") return GUIDE_TIER_TOKENS.ultimate;
  return GUIDE_TIER_TOKENS.essential;
}
