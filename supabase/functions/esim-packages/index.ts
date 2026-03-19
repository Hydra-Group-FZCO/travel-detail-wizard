import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { locationCode, type, packageCode, iccid } = await req.json().catch(() => ({}));

    const apiHost = Deno.env.get("ESIM_API_HOST")!;
    const accessCode = Deno.env.get("ESIM_ACCESS_CODE")!;

    console.log("Calling eSIM Access API:", `${apiHost}/api/v1/open/package/list`);

    const response = await fetch(`${apiHost}/api/v1/open/package/list`, {
      method: "POST",
      headers: {
        "RT-AccessCode": accessCode,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locationCode: locationCode || "",
        type: type || "BASE",
        packageCode: packageCode || "",
        iccid: iccid || "",
      }),
    });

    const data = await response.json();
    console.log("API response success:", data.success, "errorCode:", data.errorCode);

    if (!data.success) {
      return new Response(JSON.stringify({ error: "API error", details: data }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const packages = data.obj?.packageList || [];

    // Cache packages to DB in batches
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const rows = packages.map((pkg: any) => {
      const wholesalePrice = pkg.price || 0;
      const priceUsd = wholesalePrice / 10000;
      const priceEur = Math.ceil(priceUsd * 0.92 * 1.8 * 100) / 100;
      const dataGb = pkg.volume ? parseFloat((pkg.volume / (1024 * 1024 * 1024)).toFixed(2)) : null;
      const locationStr = pkg.location || "";
      const countryCodes = locationStr ? locationStr.split(",").map((c: string) => c.trim()) : [];
      const locCode = countryCodes.length === 1 ? countryCodes[0] : (pkg.locationCode || locationCode || null);

      return {
        package_code: pkg.packageCode,
        name: pkg.name || pkg.packageCode,
        slug: pkg.slug || pkg.packageCode.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        price_wholesale: wholesalePrice,
        price_retail_eur: priceEur,
        data_gb: dataGb,
        duration_days: pkg.duration || null,
        countries: countryCodes,
        location_code: locCode,
        operator: pkg.locationNetworkList?.[0]?.operatorList?.[0]?.operatorName || null,
        updated_at: new Date().toISOString(),
      };
    });

    // Batch upsert in chunks of 50
    for (let i = 0; i < rows.length; i += 50) {
      const chunk = rows.slice(i, i + 50);
      await supabase.from("esim_packages_cache").upsert(chunk, { onConflict: "package_code" });
    }

    console.log(`Cached ${rows.length} packages`);

    return new Response(JSON.stringify({ count: packages.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
