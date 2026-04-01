import { useEffect, useMemo, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Link, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { StripeCardPaymentForm } from "@/components/StripeCardPaymentForm";
import { supabase } from "@/integrations/supabase/client";
import { ITINERARY_CHECKOUT_STORAGE_KEY, type ItineraryCheckoutPayload } from "@/lib/itineraryCheckoutStorage";
import { localizedPath, useLanguage } from "@/i18n";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

function formatUsd(n: number): string {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
}

function readCheckoutPayload(): ItineraryCheckoutPayload | null {
  try {
    const raw = sessionStorage.getItem(ITINERARY_CHECKOUT_STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as ItineraryCheckoutPayload;
    if (!p?.destination?.trim() || !p.start_date || !p.end_date || !p.num_days || p.num_days < 1) {
      return null;
    }
    return p;
  } catch {
    return null;
  }
}

const ItineraryPayment = () => {
  const navigate = useNavigate();
  const lang = useLanguage();
  const { user, loading: authLoading } = useAuth();

  const [payload, setPayload] = useState<ItineraryCheckoutPayload | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [amountUsd, setAmountUsd] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  const stripePromise = useMemo(
    () => (publishableKey ? loadStripe(publishableKey) : null),
    []
  );

  const generatorPath = localizedPath("/itinerary-generator", lang);
  const paymentSuccessUrl = useMemo(
    () => `${window.location.origin}${localizedPath("/payment-success", lang)}?type=itinerary`,
    [lang]
  );

  useEffect(() => {
    setPayload(readCheckoutPayload());
  }, []);

  const createPaymentIntent = async () => {
    if (!user || !payload) return;

    setCreating(true);
    setInitError(null);
    try {
      const { data, error } = await supabase.functions.invoke("create-payment-intent", {
        body: { type: "itinerary" },
      });
      if (error) throw error;
      if (data?.error) throw new Error(typeof data.error === "string" ? data.error : "Could not start payment.");
      if (!data?.clientSecret) throw new Error("Missing payment session.");
      const usd =
        typeof data.amountUsd === "number" && Number.isFinite(data.amountUsd) ? data.amountUsd : 15;
      setAmountUsd(usd);
      setClientSecret(data.clientSecret);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not start payment.";
      setInitError(msg);
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  };

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
          <h1 className="text-2xl font-semibold">Pay for your AI itinerary</h1>
          <p className="text-sm text-muted-foreground mt-2">Secure card payment · USD</p>
        </div>
      </section>

      <section className="py-10">
        <div className="container max-w-xl mx-auto px-4 flex flex-col items-center">
          <div className="w-full rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm space-y-6">
            {!payload && (
              <p className="text-sm text-destructive">
                Missing trip details.{" "}
                <Link to={generatorPath} className="underline text-primary">
                  Open itinerary planner
                </Link>
              </p>
            )}

            {payload && (
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Destination</span>
                  <span className="font-medium text-right">{payload.destination}</span>
                </div>
                {payload.departure_city ? (
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">From</span>
                    <span className="font-medium text-right">{payload.departure_city}</span>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Dates</span>
                  <span className="font-medium text-right">
                    {format(parseISO(payload.start_date), "PP")} – {format(parseISO(payload.end_date), "PP")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">
                    {payload.num_days} {payload.num_days === 1 ? "day" : "days"}
                  </span>
                </div>
                {amountUsd != null && (
                  <div className="flex justify-between items-baseline pt-2 border-t border-border">
                    <span className="font-medium">Total</span>
                    <span className="text-xl font-semibold tabular-nums">{formatUsd(amountUsd)}</span>
                  </div>
                )}
              </div>
            )}

            {initError && <p className="text-sm text-destructive">{initError}</p>}

            {payload && !clientSecret && (
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
                  <Link to={generatorPath}>Cancel</Link>
                </Button>
              </div>
            )}

            {clientSecret && stripePromise && payload && amountUsd !== null && (
              <>
                <div className="space-y-2 pt-2 border-t border-border">
                  <h2 className="text-base font-semibold">Complete payment</h2>
                  <p className="text-xs text-muted-foreground">
                    Amount due:{" "}
                    <span className="font-semibold text-foreground">{formatUsd(amountUsd)}</span> USD
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
                      navigate(
                        `${localizedPath("/payment-success", lang)}?payment_intent_id=${encodeURIComponent(paymentIntentId)}&type=itinerary`
                      );
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

export default ItineraryPayment;
