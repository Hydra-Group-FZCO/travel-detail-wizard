import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { packageCode: rawPackageCode, amount: rawAmount, stripe_payment_id: rawStripePaymentId } = await req.json();
    const packageCode = String(rawPackageCode ?? "").trim();
    const stripePaymentId = String(rawStripePaymentId ?? "").trim();
    const amount = typeof rawAmount === "number" ? rawAmount : parseInt(String(rawAmount ?? "0"), 10);
    if (!packageCode) throw new Error("Missing packageCode");
    if (!Number.isFinite(amount) || amount < 1) throw new Error("Invalid amount");

    const apiHost = Deno.env.get("ESIM_API_HOST")!;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data: pkg, error: pkgError } = await supabase
      .from("esim_packages_cache")
      .select("price_retail_eur")
      .eq("package_code", packageCode)
      .maybeSingle();

    if (pkgError) throw pkgError;
    const priceEur = Number(pkg?.price_retail_eur ?? 0);
    if (!Number.isFinite(priceEur) || priceEur <= 0) throw new Error("Unknown package price in DB");
    const price = Math.round(priceEur * 100);

    const transactionId = crypto.randomUUID();

    const response = await fetch(`${apiHost}/api/esim/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ packageCode, transactionId, price, amount }),
    });

    const data = await response.json();
    if (!response.ok || data?.success === false) {
      throw new Error(String(data?.errorMsg || data?.error || "Failed to create provider eSIM order"));
    }

    const providerOrderNo = data?.obj?.orderNo ? String(data.obj.orderNo) : null;
    if (!providerOrderNo) {
      throw new Error("Provider order created without orderNo");
    }
    if (providerOrderNo && stripePaymentId) {
      const { error: updateError } = await supabase
        .from("esim_orders")
        .update({ order_no: providerOrderNo })
        .eq("stripe_payment_id", stripePaymentId);
      if (updateError) throw updateError;
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
