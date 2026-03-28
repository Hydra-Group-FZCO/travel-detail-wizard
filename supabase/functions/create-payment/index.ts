import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Fixed price IDs
const PRICES = {
  itinerary: "price_1TFzLp5ZCBLw7hwyOME76efy",
  guide_essential: "price_1TFzM95ZCBLw7hwyFKrEoWSX",
  guide_complete: "price_1TFzMk5ZCBLw7hwyf0Clsv7p",
  guide_ultimate: "price_1TFzN85ZCBLw7hwydqdiJuvd",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated");

    const { type, metadata } = await req.json();
    if (!type) throw new Error("Missing payment type");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Find or create Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    const origin = req.headers.get("origin") || "https://digitalmoonkey.travel";
    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
    let sessionMetadata: Record<string, string> = {
      user_id: user.id,
      type,
    };

    if (type === "esim") {
      // Dynamic pricing for eSIMs
      const { package_code, package_name, price_eur } = metadata || {};
      if (!package_code || !price_eur) throw new Error("Missing eSIM package data");

      lineItems = [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `eSIM: ${package_name || package_code}`,
              description: `eSIM data plan – ${package_code}`,
            },
            unit_amount: Math.round(price_eur * 100),
          },
          quantity: 1,
        },
      ];
      sessionMetadata.package_code = package_code;
      sessionMetadata.price_eur = String(price_eur);
    } else if (type === "itinerary") {
      lineItems = [{ price: PRICES.itinerary, quantity: 1 }];
      // Store itinerary data in metadata for fulfillment
      if (metadata) {
        sessionMetadata = { ...sessionMetadata, ...stringifyMetadata(metadata) };
      }
    } else if (type === "guide") {
      const depth = metadata?.depth || "essential";
      const priceKey = `guide_${depth}` as keyof typeof PRICES;
      const priceId = PRICES[priceKey];
      if (!priceId) throw new Error(`Invalid guide depth: ${depth}`);

      lineItems = [{ price: priceId, quantity: 1 }];
      if (metadata) {
        sessionMetadata = { ...sessionMetadata, ...stringifyMetadata(metadata) };
      }
    } else {
      throw new Error(`Unknown payment type: ${type}`);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=${type}`,
      cancel_url: `${origin}/${type === "esim" ? "esims" : type === "itinerary" ? "itinerary-generator" : "travel-guides"}`,
      metadata: sessionMetadata,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("create-payment error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

// Flatten metadata to string values (Stripe metadata must be string key-value pairs)
function stringifyMetadata(obj: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      result[key] = typeof value === "object" ? JSON.stringify(value) : String(value);
    }
  }
  return result;
}
