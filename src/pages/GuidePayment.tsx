import { useEffect, useMemo, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { StripeCardPaymentForm } from "@/components/StripeCardPaymentForm";
import { supabase } from "@/integrations/supabase/client";
import { localizedPath, useLanguage } from "@/i18n";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  DEFAULT_TOKEN_BUDGET,
  GUIDE_TIER_TOKENS,
  clampTokens,
  depthTierFromTokens,
  usdFromTokens,
} from "@/lib/guideTokenPricing";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

function formatUsd(n: number): string {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
}

const GuidePayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const lang = useLanguage();
  const { user, loading: authLoading } = useAuth();

  const destination = searchParams.get("destination") ?? "";
  const language = searchParams.get("language") ?? "en";
  const season = searchParams.get("season") ?? "unknown";
  const focusRaw = searchParams.get("focus") ?? "[]";
  const tokensRaw = searchParams.get("tokens");

  let focusAreas: string[] = [];
  try {
    const parsed = JSON.parse(focusRaw);
    if (Array.isArray(parsed)) focusAreas = parsed.filter((x) => typeof x === "string");
  } catch {
    focusAreas = [];
  }

  const tokenBudget = useMemo(() => {
    const n = tokensRaw != null ? parseInt(tokensRaw, 10) : NaN;
    if (!Number.isFinite(n)) return DEFAULT_TOKEN_BUDGET;
    return clampTokens(n);
  }, [tokensRaw]);

  const depthLabel = depthTierFromTokens(tokenBudget);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  const amountUsd = usdFromTokens(tokenBudget);
  const paramsValid = destination.length > 1 && focusAreas.length > 0;

  const tierPricesSubtitle = useMemo(() => {
    const lo = formatUsd(usdFromTokens(GUIDE_TIER_TOKENS.essential));
    const mid = formatUsd(usdFromTokens(GUIDE_TIER_TOKENS.complete));
    const hi = formatUsd(usdFromTokens(GUIDE_TIER_TOKENS.ultimate));
    return `Secure payment · Essential, Complete, or Ultimate (${lo}, ${mid}, or ${hi})`;
  }, []);

  const stripePromise = useMemo(
    () => (publishableKey ? loadStripe(publishableKey) : null),
    []
  );

  const guidesPath = localizedPath("/travel-guides", lang);
  const paymentSuccessUrl = `${window.location.origin}${localizedPath("/payment-success", lang)}?type=guide`;

  const createPaymentIntent = async () => {
    if (!user || !paramsValid) return;

    setCreating(true);
    setInitError(null);
    try {
      const { data, error } = await supabase.functions.invoke("create-payment-intent", {
        body: {
          destination,
          token_budget: tokenBudget,
          language,
          season,
          focus_areas: focusAreas,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(typeof data.error === "string" ? data.error : "Could not start payment.");
      if (!data?.clientSecret) throw new Error("Missing payment session.");
      setClientSecret(data.clientSecret);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not start payment.";
      setInitError(msg);
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    if (authLoading || !user) return;
    if (!paramsValid) setInitError("Missing destination or focus areas. Go back to travel guides and try again.");
  }, [authLoading, user, paramsValid]);

  if (!publishableKey) {
    return (
      <PageLayout>
        <div className="container max-w-xl mx-auto py-24 px-4 text-center text-muted-foreground">
          Stripe is not configured. Add <code className="text-xs">VITE_STRIPE_PUBLISHABLE_KEY</code> to your environment.
        </div>
      </PageLayout>
    );
  }

  if (authLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout>
        <div className="container max-w-xl mx-auto py-24 px-4 text-center space-y-4">
          <p>Sign in to complete your purchase.</p>
          <Button asChild>
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="pt-28 pb-10 md:pt-32 md:pb-14 bg-secondary">
        <div className="container max-w-xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-semibold">Pay for your AI guide</h1>
          <p className="text-sm text-muted-foreground mt-2">{tierPricesSubtitle}</p>
        </div>
      </section>

      <section className="py-10">
        <div className="container max-w-xl mx-auto px-4 flex flex-col items-center">
          <div className="w-full rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm space-y-6">
            {!paramsValid && (
              <p className="text-sm text-destructive">
                Invalid or incomplete order.{" "}
                <Link to={guidesPath} className="underline text-primary">
                  Return to travel guides
                </Link>
              </p>
            )}

            {paramsValid && (
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Destination</span>
                  <span className="font-medium text-right">{destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium capitalize">{depthLabel}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Generation budget</span>
                  <span className="font-medium text-right tabular-nums">{tokenBudget.toLocaleString()} tokens</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-border">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-semibold tabular-nums">{formatUsd(amountUsd)}</span>
                </div>
              </div>
            )}

            {initError && <p className="text-sm text-destructive">{initError}</p>}

            {paramsValid && !clientSecret && (
              <div className="flex flex-col gap-3">
                <Button onClick={createPaymentIntent} disabled={creating} className="w-full">
                  {creating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Preparing payment…
                    </>
                  ) : (
                    "Continue to card payment"
                  )}
                </Button>
                <Button variant="ghost" className="w-full" asChild>
                  <Link to={guidesPath}>Cancel</Link>
                </Button>
              </div>
            )}

            {clientSecret && stripePromise && (
              <>
                <div className="space-y-2 pt-2 border-t border-border">
                  <h2 className="text-base font-semibold">Complete payment</h2>
                  <p className="text-xs text-muted-foreground">
                    Amount due: <span className="font-semibold text-foreground">{formatUsd(amountUsd)}</span> USD
                  </p>
                </div>
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        borderRadius: "8px",
                      },
                    },
                    loader: "auto",
                  }}
                >
                  <StripeCardPaymentForm
                    returnUrl={paymentSuccessUrl}
                    payLabel={formatUsd(amountUsd)}
                    onPaid={(paymentIntentId) => {
                      navigate(`${localizedPath("/payment-success", lang)}?payment_intent_id=${encodeURIComponent(paymentIntentId)}&type=guide`);
                    }}
                  />
                </Elements>
              </>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default GuidePayment;
