import { FormEvent, useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreditCard, Loader2, Lock } from "lucide-react";

export type StripeCardPaymentFormProps = {
  returnUrl: string;
  payLabel: string;
  onPaid: (paymentIntentId: string) => void;
};

export const StripeCardPaymentForm = ({ returnUrl, payLabel, onPaid }: StripeCardPaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: "if_required",
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message ?? "Payment failed.");
      return;
    }

    if (paymentIntent?.status === "succeeded" && paymentIntent.id) {
      onPaid(paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-border bg-muted/20 px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="h-4 w-4 shrink-0 text-foreground/70" aria-hidden />
        <span>Payments are processed securely by Stripe. Your card details never touch our servers.</span>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <CreditCard className="h-4 w-4" aria-hidden />
          Card payment
        </h3>
        <p className="text-xs text-muted-foreground">
          Visa or Mastercard only. Enter your email and card details below — the full form is loaded from Stripe.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-background p-4 md:p-5 shadow-sm">
        <div className="min-h-[240px] w-full">
          <PaymentElement
            options={{
              fields: {
                billingDetails: "auto",
              },
              terms: {
                card: "never",
              },
            }}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={!stripe || submitting}>
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing…
          </>
        ) : (
          <>Pay {payLabel}</>
        )}
      </Button>
    </form>
  );
};
