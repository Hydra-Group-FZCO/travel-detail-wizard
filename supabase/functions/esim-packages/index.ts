import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { locationCode, packageCode } = await req.json().catch(() => ({}));

    const apiHost = Deno.env.get("ESIM_API_HOST")!;
    const accessCode = Deno.env.get("ESIM_ACCESS_CODE")!;
    const secretKey = Deno.env.get("ESIM_SECRET_KEY")!;

    const response = await fetch(`${apiHost}/api/v5/esim/package/list`, {
      method: "POST",
      headers: {
        "RT-AccessCode": accessCode,
        "RT-SecretKey": secretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locationCode: locationCode || "",
        type: "BASE",
        packageCode: packageCode || "",
        iccid: "",
      }),
    });

    const data = await response.json();

    if (!data.success && !data.obj) {
      return new Response(JSON.stringify({ error: "API error", details: data }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Cache packages to DB
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const packages = data.obj?.packageList || data.obj || [];

    for (const pkg of packages) {
      const wholesalePrice = pkg.price || 0;
      // Price is in units / 10000 = USD, convert to EUR (approx 0.92), apply 1.8x markup
      const priceUsd = wholesalePrice / 10000;
      const priceEur = Math.ceil(priceUsd * 0.92 * 1.8 * 100) / 100;

      await supabase.from("esim_packages_cache").upsert(
        {
          package_code: pkg.packageCode,
          name: pkg.name || pkg.packageCode,
          slug: pkg.slug || pkg.packageCode.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          price_wholesale: wholesalePrice,
          price_retail_eur: priceEur,
          data_gb: pkg.volume ? pkg.volume / 1024 : null,
          duration_days: pkg.duration || null,
          countries: pkg.locationNetworkList?.map((l: any) => l.locationCode) || [],
          location_code: pkg.location || locationCode || null,
          operator: pkg.operatorList?.[0]?.operatorName || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "package_code" }
      );
    }

    return new Response(JSON.stringify({ packages, count: packages.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
