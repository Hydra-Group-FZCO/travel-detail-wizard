import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/** Resolve eSIM row from lookup response: `obj.esimList[]` or legacy flat `obj`. */
function pickEsimFromLookup(obj: unknown, orderNo: string): Record<string, unknown> | null {
  if (!obj || typeof obj !== "object") return null;
  const o = obj as Record<string, unknown>;
  const list = o.esimList;
  if (Array.isArray(list) && list.length > 0) {
    const match = list.find((item) => {
      if (!item || typeof item !== "object") return false;
      const row = item as Record<string, unknown>;
      return String(row.orderNo ?? "").trim() === orderNo;
    });
    const first = list[0];
    if (match && typeof match === "object") return match as Record<string, unknown>;
    if (first && typeof first === "object") return first as Record<string, unknown>;
  }
  if (typeof o.orderNo === "string" || typeof o.iccid === "string") {
    return o;
  }
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { orderNo } = await req.json();
    const safeOrderNo = String(orderNo ?? "").trim();
    if (!safeOrderNo) throw new Error("Missing orderNo");

    const apiHost = Deno.env.get("ESIM_API_HOST")!;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const response = await fetch(`${apiHost}/api/esim/orders/lookup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderNo: safeOrderNo }),
    });

    const data = await response.json();

    const ok =
      response.ok &&
      data?.success === true &&
      (data?.errorCode === "0" || data?.errorCode === 0 || data?.errorCode == null) &&
      data?.errorMsg == null;

    const payload = ok ? pickEsimFromLookup(data?.obj, safeOrderNo) : null;
    if (payload) {
      const rawStatus = String(payload.esimStatus ?? "").trim();
      const normalizedStatus = rawStatus ? rawStatus.toLowerCase() : null;
      const { error: updateError } = await supabase
        .from("esim_orders")
        .update({
          order_no: String(payload.orderNo ?? safeOrderNo),
          iccid: payload.iccid != null && payload.iccid !== "" ? String(payload.iccid) : null,
          qr_code_url: payload.qrCodeUrl != null && String(payload.qrCodeUrl).trim() !== ""
            ? String(payload.qrCodeUrl)
            : null,
          activation_code: payload.ac != null && String(payload.ac).trim() !== "" ? String(payload.ac) : null,
          ...(normalizedStatus ? { status: normalizedStatus } : {}),
        })
        .eq("order_no", safeOrderNo);
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
