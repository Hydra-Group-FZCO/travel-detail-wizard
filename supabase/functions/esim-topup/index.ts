import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { iccid, esimTranNo, packageCode, transactionId, amount } = await req.json();

    const apiHost = Deno.env.get("ESIM_API_HOST")!;
    const accessCode = Deno.env.get("ESIM_ACCESS_CODE")!;

    const body: Record<string, any> = { packageCode, transactionId };
    if (iccid) body.iccid = iccid;
    if (esimTranNo) body.esimTranNo = esimTranNo;
    if (amount) body.amount = amount;

    const response = await fetch(`${apiHost}/api/v1/open/esim/topup`, {
      method: "POST",
      headers: {
        "RT-AccessCode": accessCode,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
