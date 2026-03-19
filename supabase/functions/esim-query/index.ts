import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { orderNo, iccid, pager } = await req.json();

    const apiHost = Deno.env.get("ESIM_API_HOST")!;
    const accessCode = Deno.env.get("ESIM_ACCESS_CODE")!;

    const body: Record<string, any> = {
      pager: pager || { pageNum: 1, pageSize: 20 },
    };
    if (orderNo) body.orderNo = orderNo;
    if (iccid) body.iccid = iccid;

    const response = await fetch(`${apiHost}/api/v1/open/esim/query`, {
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
