import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BOKUN_BASE = "https://api.bokun.io";

function formatDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

async function bokunSign(
  secretKey: string,
  accessKey: string,
  method: string,
  path: string,
  date: string
): Promise<string> {
  const signatureBase = date + accessKey + method + path;
  const key = new TextEncoder().encode(secretKey);
  const data = new TextEncoder().encode(signatureBase);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, data);
  return base64Encode(new Uint8Array(sig));
}

async function bokunFetch(
  accessKey: string,
  secretKey: string,
  method: string,
  path: string,
  body?: unknown
) {
  const date = formatDate(new Date());
  const signature = await bokunSign(secretKey, accessKey, method, path, date);

  const headers: Record<string, string> = {
    "X-Bokun-Date": date,
    "X-Bokun-AccessKey": accessKey,
    "X-Bokun-Signature": signature,
    "Content-Type": "application/json",
  };

  const res = await fetch(`${BOKUN_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bókun API ${res.status}: ${text}`);
  }
  return res.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accessKey = Deno.env.get("BOKUN_ACCESS_KEY");
    const secretKey = Deno.env.get("BOKUN_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!accessKey || !secretKey) throw new Error("Bókun API keys not configured");
    if (!supabaseUrl || !serviceRoleKey) throw new Error("Supabase config missing");

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Fetch recent bookings from Bókun (last 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startDate = thirtyDaysAgo.toISOString().slice(0, 10);
    const endDate = now.toISOString().slice(0, 10);

    const searchPath = `/booking.json/search`;
    const searchBody = {
      startDate,
      endDate,
      confirmationStatuses: ["CONFIRMED", "CANCELLED"],
      pageSize: 100,
      page: 1,
    };

    let bokunBookings: any[];
    try {
      const result = await bokunFetch(accessKey, secretKey, "POST", searchPath, searchBody);
      bokunBookings = result.items || result.results || result || [];
      if (!Array.isArray(bokunBookings)) {
        bokunBookings = [];
      }
    } catch (e) {
      console.error("Error fetching from Bókun:", e);
      return new Response(JSON.stringify({ error: e.message, synced: 0 }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let synced = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const booking of bokunBookings) {
      try {
        const customerEmail = (
          booking.customer?.email ||
          booking.contactEmail ||
          booking.mainContactEmail ||
          ""
        ).toLowerCase().trim();

        if (!customerEmail) {
          skipped++;
          continue;
        }

        // Find user by email via auth admin API
        const { data: authUsers } = await supabase.auth.admin.listUsers();
        const matchedUser = authUsers?.users?.find(
          (u: any) => u.email?.toLowerCase() === customerEmail
        );

        if (!matchedUser) {
          skipped++;
          continue;
        }

        const bokunId = String(booking.id || booking.confirmationCode || "");
        const bookingDate =
          booking.startDate || booking.date || new Date().toISOString().slice(0, 10);
        const experienceName =
          booking.productTitle || booking.activityTitle || booking.title || "Bókun Experience";
        const guests = booking.totalParticipants || booking.participants || 1;
        const totalAmount = booking.totalPrice || booking.price || null;
        const currency = booking.currency || "GBP";
        const status =
          booking.confirmationStatus === "CANCELLED" ? "Cancelled" : "Confirmed";

        // Upsert: check if we already have this booking by notes containing bokunId
        const { data: existing } = await supabase
          .from("bookings")
          .select("id")
          .eq("user_id", matchedUser.id)
          .ilike("notes", `%bokun:${bokunId}%`)
          .maybeSingle();

        if (existing) {
          // Update status if changed
          await supabase
            .from("bookings")
            .update({ status, total_amount: totalAmount, currency })
            .eq("id", existing.id);
        } else {
          await supabase.from("bookings").insert({
            user_id: matchedUser.id,
            booking_date: bookingDate,
            experience_name: experienceName,
            guests,
            total_amount: totalAmount,
            currency,
            status,
            notes: `bokun:${bokunId}`,
          });
        }
        synced++;
      } catch (e) {
        errors.push(e.message);
      }
    }

    console.log(`Bókun sync: ${synced} synced, ${skipped} skipped, ${errors.length} errors`);

    return new Response(
      JSON.stringify({ synced, skipped, errors: errors.slice(0, 5), total: bokunBookings.length }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("sync-bokun-bookings error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
