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
    const requestedType = body?.type as string | undefined;
    const itineraryPayload = body?.itinerary_payload as Record<string, unknown> | undefined;
    const consultancyPayload = body?.consultancy_payload as Record<string, unknown> | undefined;

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

      const { data: prebakedGuide } = await supabaseAdmin
        .from("travel_guides")
        .select("id, user_id, status")
        .eq("stripe_payment_id", stripePaymentId)
        .maybeSingle();

      if (prebakedGuide) {
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

    if (meta.user_id && meta.user_id !== user.id) {
      throw new Error("Payment does not belong to this user");
    }

    const type = meta.type || requestedType;
    if (!type) throw new Error("Missing payment type");
    const result: Record<string, unknown> = { status: "paid", type };

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
        const metaUsdItin = meta.price_usd ? parseFloat(meta.price_usd) : NaN;
        let pricePaidItin = Number.isFinite(metaUsdItin) ? metaUsdItin : null;
        if (pricePaidItin == null && paymentIntentAmountCents != null) {
          pricePaidItin = paymentIntentAmountCents / 100;
        }
        if (pricePaidItin == null || !Number.isFinite(pricePaidItin)) pricePaidItin = 15;

        const safeArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);
        const parseMetaArray = (value: string | undefined): unknown[] => {
          if (!value) return [];
          try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        };

        const destination =
          (meta.destination && meta.destination.trim()) ||
          (typeof itineraryPayload?.destination === "string" ? itineraryPayload.destination.trim() : "");
        const startDate =
          (meta.start_date && meta.start_date.trim()) ||
          (typeof itineraryPayload?.start_date === "string" ? itineraryPayload.start_date.trim() : "");
        const endDate =
          (meta.end_date && meta.end_date.trim()) ||
          (typeof itineraryPayload?.end_date === "string" ? itineraryPayload.end_date.trim() : "");
        const numDaysFromPayload =
          typeof itineraryPayload?.num_days === "number"
            ? itineraryPayload.num_days
            : parseInt(String(itineraryPayload?.num_days ?? "0"), 10);
        const numDays = parseInt(meta.num_days || String(numDaysFromPayload || 1), 10);
        if (!destination || !startDate || !endDate || !Number.isFinite(numDays) || numDays < 1) {
          throw new Error("Missing itinerary trip details");
        }

        const insertData: Record<string, unknown> = {
          user_id: user.id,
          destination,
          departure_city:
            meta.departure_city ||
            (typeof itineraryPayload?.departure_city === "string" ? itineraryPayload.departure_city : null),
          start_date: startDate,
          end_date: endDate,
          num_days: numDays,
          trip_type:
            meta.trip_type ||
            (typeof itineraryPayload?.trip_type === "string" ? itineraryPayload.trip_type : "couple"),
          travelers_adults: parseInt(
            meta.travelers_adults ||
              String(typeof itineraryPayload?.travelers_adults === "number" ? itineraryPayload.travelers_adults : 2),
            10
          ),
          travelers_children: parseInt(
            meta.travelers_children ||
              String(typeof itineraryPayload?.travelers_children === "number" ? itineraryPayload.travelers_children : 0),
            10
          ),
          children_ages: (meta.children_ages ? parseMetaArray(meta.children_ages) : safeArray(itineraryPayload?.children_ages)) as number[],
          interests: (meta.interests ? parseMetaArray(meta.interests) : safeArray(itineraryPayload?.interests)) as string[],
          budget_level:
            meta.budget_level ||
            (typeof itineraryPayload?.budget_level === "string" ? itineraryPayload.budget_level : "mid-range"),
          language: meta.language || (typeof itineraryPayload?.language === "string" ? itineraryPayload.language : "en"),
          extras: (meta.extras ? parseMetaArray(meta.extras) : safeArray(itineraryPayload?.extras)) as string[],
          status: "pending",
          stripe_payment_id: stripePaymentId,
          price_paid: pricePaidItin,
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
    } else if (type === "consultancy") {
      const safePlan = typeof consultancyPayload?.plan === "string" ? consultancyPayload.plan : null;
      const safeAdults =
        typeof consultancyPayload?.adults === "number"
          ? consultancyPayload.adults
          : parseInt(String(consultancyPayload?.adults ?? "0"), 10);
      const safeChildren =
        typeof consultancyPayload?.children === "number"
          ? consultancyPayload.children
          : parseInt(String(consultancyPayload?.children ?? "0"), 10);
      result.plan = safePlan;
      result.adults = Number.isFinite(safeAdults) && safeAdults >= 1 ? safeAdults : null;
      result.children = Number.isFinite(safeChildren) && safeChildren >= 0 ? safeChildren : null;
      result.amount_usd = paymentIntentAmountCents != null ? paymentIntentAmountCents / 100 : null;
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
