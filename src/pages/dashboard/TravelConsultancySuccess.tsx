import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  CONSULTANCY_CHECKOUT_STORAGE_KEY,
  readConsultancyCheckoutPayload,
} from "@/lib/consultancyCheckoutStorage";

const TravelConsultancySuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paymentIntentId =
    searchParams.get("payment_intent_id") ||
    searchParams.get("payment_intent") ||
    null;
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!paymentIntentId) {
      setStatus("error");
      setErrorMsg("No payment reference found.");
      return;
    }
    const verify = async () => {
      try {
        const consultancyPayload = readConsultancyCheckoutPayload();
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: {
            payment_intent_id: paymentIntentId,
            type: "consultancy",
            consultancy_payload: consultancyPayload,
          },
        });
        if (error) throw error;
        if (data.status === "paid") {
          sessionStorage.removeItem(CONSULTANCY_CHECKOUT_STORAGE_KEY);
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMsg("Payment has not been completed yet.");
        }
      } catch (err) {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Failed to verify payment.");
      }
    };
    verify();
  }, [paymentIntentId]);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="rounded-xl border border-border bg-card p-8 text-center space-y-5">
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <h1 className="text-2xl font-bold">Processing your payment...</h1>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold">Payment Successful</h1>
            <p className="text-muted-foreground">
              Within 24 hours you will hear from your travel assistant by email to get started on your documents and next steps.
            </p>
            <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold">Payment Issue</h1>
            <p className="text-muted-foreground">{errorMsg}</p>
            <Button variant="outline" onClick={() => navigate("/dashboard/consultancy")}>
              Back to Travel Assistant
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TravelConsultancySuccess;
