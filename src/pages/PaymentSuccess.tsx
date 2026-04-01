import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { localizedPath, useLanguage } from "@/i18n";
import { ITINERARY_CHECKOUT_STORAGE_KEY, type ItineraryCheckoutPayload } from "@/lib/itineraryCheckoutStorage";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const lang = useLanguage();
  const sessionId = searchParams.get("session_id");
  const paymentIntentId =
    searchParams.get("payment_intent_id") ||
    searchParams.get("payment_intent") ||
    null;
  const type = searchParams.get("type");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [recordId, setRecordId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!sessionId && !paymentIntentId) {
      setStatus("error");
      setErrorMsg("No payment reference found.");
      return;
    }

    const verify = async () => {
      try {
        let itineraryPayload: ItineraryCheckoutPayload | null = null;
        if (type === "itinerary") {
          try {
            const raw = sessionStorage.getItem(ITINERARY_CHECKOUT_STORAGE_KEY);
            if (raw) itineraryPayload = JSON.parse(raw) as ItineraryCheckoutPayload;
          } catch {
            itineraryPayload = null;
          }
        }

        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: paymentIntentId
            ? {
                payment_intent_id: paymentIntentId,
                type,
                itinerary_payload: itineraryPayload,
              }
            : { session_id: sessionId, type },
        });

        if (error) throw error;
        if (data.status === "paid") {
          if (type === "itinerary") sessionStorage.removeItem(ITINERARY_CHECKOUT_STORAGE_KEY);
          setStatus("success");
          setRecordId(data.record_id || data.order_id || null);
        } else {
          setStatus("error");
          setErrorMsg("Payment has not been completed yet.");
        }
      } catch (err: unknown) {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Failed to verify payment.");
      }
    };

    verify();
  }, [sessionId, paymentIntentId]);

  const getRedirectPath = () => {
    if (type === "esim") return "/dashboard/esims";
    if (type === "itinerary" && recordId) return localizedPath(`/itinerary/${recordId}`, lang);
    if (type === "guide" && recordId) return localizedPath(`/travel-guides/view/${recordId}`, lang);
    return "/dashboard";
  };

  const getTypeLabel = () => {
    if (type === "esim") return "eSIM";
    if (type === "itinerary") return "AI Itinerary";
    if (type === "guide") return "Travel Guide";
    return "Product";
  };

  return (
    <PageLayout>
      <section className="min-h-[60vh] flex items-center justify-center py-20">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-6">
            {status === "loading" && (
              <>
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                <h2 className="text-xl font-bold">Processing your payment...</h2>
                <p className="text-muted-foreground">Please wait while we confirm your purchase.</p>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold">Payment Successful!</h2>
                <p className="text-muted-foreground">
                  Your {getTypeLabel()} has been purchased successfully.
                  {type === "itinerary" && " Your itinerary is now being generated."}
                  {type === "guide" && " Your guide is now being generated."}
                  {type === "esim" && " You can view your eSIM in your dashboard."}
                </p>
                <div className="flex flex-col gap-3 pt-4">
                  <Button onClick={() => navigate(getRedirectPath())} size="lg">
                    {type === "esim" ? "View My eSIMs" : type === "itinerary" ? "View My Itinerary" : type === "guide" ? "View My Guide" : "Go to Dashboard"}
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/")}>
                    Back to Home
                  </Button>
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <XCircle className="w-16 h-16 text-destructive mx-auto" />
                <h2 className="text-2xl font-bold">Payment Issue</h2>
                <p className="text-muted-foreground">{errorMsg}</p>
                <div className="flex flex-col gap-3 pt-4">
                  <Button onClick={() => navigate("/")} size="lg">
                    Back to Home
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/contact")}>
                    Contact Support
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </PageLayout>
  );
};

export default PaymentSuccess;
