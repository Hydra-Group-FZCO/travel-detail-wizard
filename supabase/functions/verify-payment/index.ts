import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function slugify(v: string): string {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    const body = await req.json();
    const session_id = body?.session_id as string | undefined;
    const payment_intent_id = body?.payment_intent_id as string | undefined;

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    let meta: Record<string, string> = {};
    let stripePaymentId: string;
    let paymentIntentAmountCents: number | null = null;

    if (payment_intent_id) {
      const pi = await stripe.paymentIntents.retrieve(payment_intent_id);
      if (pi.status !== "succeeded") {
        return new Response(
          JSON.stringify({ status: "unpaid", payment_status: pi.status }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      }
      stripePaymentId = pi.id;
      paymentIntentAmountCents = pi.amount ?? null;

      const { data: prebakedGuide } = await supabaseAdmin
        .from("travel_guides")
        .select("id, user_id, status")
        .eq("stripe_payment_id", stripePaymentId)
        .maybeSingle();

      if (prebakedGuide) {
        const piCustomer = typeof pi.customer === "string" ? pi.customer : pi.customer?.id ?? null;
        const { data: prof } = await supabaseAdmin
          .from("profiles")
          .select("stripe_customer_id")
          .eq("user_id", user.id)
          .maybeSingle();
        const expectedCustomer = prof?.stripe_customer_id?.trim();
        if (!piCustomer || !expectedCustomer || piCustomer !== expectedCustomer) {
          throw new Error("Payment does not belong to this user");
        }
        if (prebakedGuide.user_id !== user.id) {
          throw new Error("Payment does not belong to this user");
        }
        if (prebakedGuide.status === "awaiting_payment") {
          const { error: upErr } = await supabaseAdmin
            .from("travel_guides")
            .update({ status: "pending" })
            .eq("id", prebakedGuide.id);
          if (upErr) throw upErr;
        }
        return new Response(
          JSON.stringify({ status: "paid", type: "guide", record_id: prebakedGuide.id }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      }

      meta = { ...(pi.metadata || {}) } as Record<string, string>;
    } else if (session_id) {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status !== "paid") {
        return new Response(
          JSON.stringify({ status: "unpaid", payment_status: session.payment_status }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      }
      meta = { ...(session.metadata || {}) } as Record<string, string>;
      stripePaymentId = session.payment_intent as string;
    } else {
      throw new Error("Missing session_id or payment_intent_id");
    }

    if (meta.user_id !== user.id) {
      throw new Error("Payment does not belong to this user");
    }

    const type = meta.type;
    let result: Record<string, unknown> = { status: "paid", type };

    if (type === "esim") {
      const { data: existing } = await supabaseAdmin
        .from("esim_orders")
        .select("id")
        .eq("stripe_payment_id", stripePaymentId)
        .maybeSingle();

      if (!existing) {
        const { data: order, error } = await supabaseAdmin
          .from("esim_orders")
          .insert({
            user_id: user.id,
            package_code: meta.package_code,
            // Column name is legacy; value is USD for new eSIM checkouts
            price_paid_eur: parseFloat(meta.price_usd || meta.price_eur || "0"),
            status: "paid",
            stripe_payment_id: stripePaymentId,
          })
          .select()
          .single();

        if (error) throw error;
        result.order_id = order.id;
      } else {
        result.order_id = existing.id;
      }
    } else if (type === "itinerary") {
      const { data: existing } = await supabaseAdmin
        .from("itineraries")
        .select("id")
        .eq("stripe_payment_id", stripePaymentId)
        .maybeSingle();

      if (!existing) {
        const insertData: Record<string, unknown> = {
          user_id: user.id,
          destination: meta.destination,
          departure_city: meta.departure_city || null,
          start_date: meta.start_date,
          end_date: meta.end_date,
          num_days: parseInt(meta.num_days || "1"),
          trip_type: meta.trip_type || "couple",
          travelers_adults: parseInt(meta.travelers_adults || "2"),
          travelers_children: parseInt(meta.travelers_children || "0"),
          children_ages: meta.children_ages ? JSON.parse(meta.children_ages) : [],
          interests: meta.interests ? JSON.parse(meta.interests) : [],
          budget_level: meta.budget_level || "mid-range",
          language: meta.language || "en",
          extras: meta.extras ? JSON.parse(meta.extras) : [],
          status: "pending",
          stripe_payment_id: stripePaymentId,
          price_paid: 15,
        };

        const { data: itinerary, error } = await supabaseAdmin
          .from("itineraries")
          .insert(insertData)
          .select()
          .single();

        if (error) throw error;
        result.record_id = itinerary.id;
      } else {
        result.record_id = existing.id;
      }
    } else if (type === "guide") {
      const { data: existing } = await supabaseAdmin
        .from("travel_guides")
        .select("id")
        .eq("stripe_payment_id", stripePaymentId)
        .maybeSingle();

      if (!existing) {
        const depth = meta.depth || "essential";
        const destSlug = meta.destination_slug || slugify(meta.destination || "");
        const tokenBudgetRaw = meta.token_budget ? parseInt(meta.token_budget, 10) : NaN;
        const token_budget = Number.isFinite(tokenBudgetRaw) ? tokenBudgetRaw : null;
        const metaUsd = meta.price_usd ? parseFloat(meta.price_usd) : NaN;
        let pricePaid = Number.isFinite(metaUsd) ? metaUsd : null;
        if (pricePaid == null && paymentIntentAmountCents != null) {
          pricePaid = paymentIntentAmountCents / 100;
        }
        if (pricePaid == null || !Number.isFinite(pricePaid)) pricePaid = 9;

        const { data: guide, error } = await supabaseAdmin
          .from("travel_guides")
          .insert({
            user_id: user.id,
            destination: meta.destination,
            destination_slug: destSlug,
            focus_areas: meta.focus_areas ? JSON.parse(meta.focus_areas) : [],
            depth,
            token_budget,
            language: meta.language || "en",
            season: meta.season || "unknown",
            price_paid: pricePaid,
            status: "pending",
            stripe_payment_id: stripePaymentId,
          })
          .select()
          .single();

        if (error) throw error;
        result.record_id = guide.id;
      } else {
        result.record_id = existing.id;
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("verify-payment error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
