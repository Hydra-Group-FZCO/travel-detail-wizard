import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { orderNo } = await req.json();

    const apiHost = Deno.env.get("ESIM_API_HOST")!;
    const accessCode = Deno.env.get("ESIM_ACCESS_CODE")!;
    const secretKey = Deno.env.get("ESIM_SECRET_KEY")!;

    const response = await fetch(`${apiHost}/api/v5/esim/query`, {
      method: "POST",
      headers: {
        "RT-AccessCode": accessCode,
        "RT-SecretKey": secretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderNo }),
    });

    const data = await response.json();

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
