import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { StripeCardPaymentForm } from "@/components/StripeCardPaymentForm";
import { consultancyPlanById } from "@/lib/consultancyPlans";
import { readConsultancyCheckoutPayload } from "@/lib/consultancyCheckoutStorage";
import { toast } from "sonner";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

function formatUsd(n: number): string {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
}

const TravelConsultancyPayment = () => {
  const navigate = useNavigate();
  const payload = readConsultancyCheckoutPayload();
  const plan = consultancyPlanById(payload?.plan);
  const adults = payload?.adults ?? 0;
  const children = payload?.children ?? 0;
  const travelers = adults + children;
  const fallbackTotal = plan ? plan.priceUsd * travelers : 0;
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [amountUsd, setAmountUsd] = useState<number | null>(null);

  const stripePromise = useMemo(() => (publishableKey ? loadStripe(publishableKey) : null), []);

  const createPaymentIntent = async () => {
    if (!plan || !payload) return;
    setCreating(true);
    setInitError(null);
    try {
      const { data, error } = await supabase.functions.invoke("create-payment-intent", {
        body: { type: "consultancy", plan: plan.id, adults: payload.adults, children: payload.children },
      });
      if (error) throw error;
      if (!data?.clientSecret) throw new Error("Missing payment session.");
      if (typeof data.amountUsd === "number" && Number.isFinite(data.amountUsd)) {
        setAmountUsd(data.amountUsd);
      }
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
    return <div className="text-muted-foreground">Stripe is not configured.</div>;
  }

  if (!plan || !payload) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">Missing travel assistant selection.</p>
        <Button asChild>
          <Link to="/dashboard/consultancy">Back to Travel Assistant</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Travel Assistant — Payment</h1>
        <p className="text-sm text-muted-foreground mt-2">{plan.title}</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Assistant plan</span>
          <span className="font-medium">{plan.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Adults</span>
          <span className="font-medium">{adults}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Children</span>
          <span className="font-medium">{children}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Per traveler</span>
          <span className="font-medium">{formatUsd(plan.priceUsd)}</span>
        </div>
        <div className="flex justify-between items-baseline border-t border-border pt-3">
          <span className="font-medium">Total</span>
          <span className="text-xl font-semibold">{formatUsd(amountUsd ?? fallbackTotal)}</span>
        </div>
      </div>

      {initError && <p className="text-sm text-destructive text-center">{initError}</p>}

      {!clientSecret ? (
        <div className="flex flex-col gap-3 max-w-sm mx-auto w-full">
          <Button onClick={createPaymentIntent} disabled={creating}>
            {creating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing payment...
              </>
            ) : (
              "Continue to card payment"
            )}
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/dashboard/consultancy">Back to Travel Assistant</Link>
          </Button>
        </div>
      ) : (
        <div className="max-w-md mx-auto w-full">
          <Elements stripe={stripePromise} options={{ clientSecret, loader: "auto" }}>
            <StripeCardPaymentForm
              returnUrl={`${window.location.origin}/dashboard/consultancy-success`}
              payLabel={formatUsd(amountUsd ?? fallbackTotal)}
              onPaid={(paymentIntentId) => {
                navigate(`/dashboard/consultancy-success?payment_intent_id=${encodeURIComponent(paymentIntentId)}&type=consultancy`);
              }}
            />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default TravelConsultancyPayment;
