import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2.57.2";
import {
  centsFromTokens,
  clampTokens,
  depthTierFromTokens,
  tokensFromLegacyDepth,
  usdFromTokens,
} from "../_shared/guide_token_pricing.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function stripeCountry(country: string | null | undefined): string | undefined {
  const t = country?.trim();
  if (!t) return undefined;
  return t.length === 2 ? t.toUpperCase() : t;
}

function customerAddressFromProfile(street: string | null | undefined, country: string | null | undefined):
  | Record<string, string>
  | undefined {
  const line1 = street?.trim();
  const c = stripeCountry(country ?? undefined);
  if (!line1 && !c) return undefined;
  const address: Record<string, string> = {};
  if (line1) address.line1 = line1.slice(0, 200);
  if (c) address.country = c;
  return Object.keys(address).length ? address : undefined;
}

type ProfileBilling = {
  full_name: string | null;
  phone: string | null;
  country: string | null;
  street: string | null;
};

async function resolveOrCreateStripeCustomer(
  stripe: Stripe,
  supabaseAdmin: SupabaseClient,
  userId: string,
  email: string,
  storedCustomerId: string | null,
  billing: ProfileBilling,
): Promise<string> {
  const address = customerAddressFromProfile(billing.street, billing.country);
  const name = billing.full_name?.trim() || undefined;
  const phone = billing.phone?.trim() || undefined;

  const rawStored = (storedCustomerId ?? "").trim();
  if (rawStored) {
    if (address || name || phone) {
      try {
        await stripe.customers.update(rawStored, {
          ...(name ? { name } : {}),
          ...(phone ? { phone } : {}),
          ...(address ? { address } : {}),
        });
      } catch (e) {
        console.warn("create-payment-intent: sync customer billing fields:", e);
      }
    }
    return rawStored;
  }

  const list = await stripe.customers.list({ email, limit: 100 });
  let customerId = list.data.find((c) => c.metadata?.supabase_user_id === userId)?.id ?? null;

  if (!customerId) {
    const created = await stripe.customers.create({
      email,
      metadata: { supabase_user_id: userId },
      ...(name ? { name } : {}),
      ...(phone ? { phone } : {}),
      ...(address ? { address } : {}),
    });
    customerId = created.id;
  } else if (address || name || phone) {
    try {
      await stripe.customers.update(customerId, {
        ...(name ? { name } : {}),
        ...(phone ? { phone } : {}),
        ...(address ? { address } : {}),
      });
    } catch (e) {
      console.warn("create-payment-intent: customer update:", e);
    }
  }

  if (!customerId) throw new Error("Could not resolve a Stripe customer id");

  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({ stripe_customer_id: customerId })
    .eq("user_id", userId);

  if (updateError) console.error("create-payment-intent: persist stripe_customer_id:", updateError);

  return customerId;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
  );

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user?.email) throw new Error("User not authenticated");

    const body = await req.json();

    if (body.type === "esim") {
      const package_code = String(body.package_code ?? "").trim();
      if (!package_code) throw new Error("Missing package_code");

      const { data: esimPkg, error: esimPkgError } = await supabaseAdmin
        .from("esim_packages_cache")
        .select("package_code, name, price_retail_eur")
        .eq("package_code", package_code)
        .maybeSingle();

      if (esimPkgError) throw esimPkgError;
      if (!esimPkg?.price_retail_eur || esimPkg.price_retail_eur <= 0) {
        throw new Error("Unknown or unavailable eSIM package");
      }

      const priceUsd = Number(esimPkg.price_retail_eur);
      const amountCents = Math.round(priceUsd * 100);
      if (amountCents < 50) throw new Error("Invalid package price");

      const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
        apiVersion: "2025-08-27.basil",
      });

      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("stripe_customer_id, full_name, phone, country, street")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) throw new Error("Profile not found for user");

      const customerId = await resolveOrCreateStripeCustomer(
        stripe,
        supabaseAdmin,
        user.id,
        user.email,
        profile.stripe_customer_id,
        profile as ProfileBilling,
      );

      const safeName = String(esimPkg.name ?? "").trim().slice(0, 450);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountCents,
        currency: "usd",
        customer: customerId,
        payment_method_types: ["card"],
        metadata: {
          user_id: user.id,
          type: "esim",
          package_code: esimPkg.package_code,
          price_usd: String(priceUsd),
          ...(safeName ? { package_name: safeName } : {}),
        },
      });

      return new Response(
        JSON.stringify({
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
      );
    }

    if (body.type === "itinerary") {
      const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
        apiVersion: "2025-08-27.basil",
      });

      /** Fixed USD amount (Stripe Product/Price for itinerary was retired). */
      const priceUsd = 15;
      const amountCents = priceUsd * 100;

      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("stripe_customer_id, full_name, phone, country, street")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) throw new Error("Profile not found for user");

      const customerId = await resolveOrCreateStripeCustomer(
        stripe,
        supabaseAdmin,
        user.id,
        user.email,
        profile.stripe_customer_id,
        profile as ProfileBilling,
      );

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountCents,
        currency: "usd",
        customer: customerId,
        payment_method_types: ["card"]
      });

      return new Response(
        JSON.stringify({
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          amountUsd: priceUsd,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
      );
    }

    const {
      token_budget: rawTokens,
      depth: legacyDepth,
      destination,
      focus_areas,
      language,
      season,
    } = body;

    if (!destination) throw new Error("Missing required fields");

    let tokenBudget: number;
    if (rawTokens !== undefined && rawTokens !== null) {
      const n = typeof rawTokens === "number" ? rawTokens : parseInt(String(rawTokens), 10);
      if (!Number.isFinite(n)) throw new Error("Invalid token_budget");
      tokenBudget = clampTokens(n);
    } else if (legacyDepth && typeof legacyDepth === "string") {
      tokenBudget = tokensFromLegacyDepth(legacyDepth);
    } else {
      throw new Error("Missing token_budget or depth");
    }

    const amountCents = centsFromTokens(tokenBudget);
    const depth = depthTierFromTokens(tokenBudget);
    const priceUsd = usdFromTokens(tokenBudget);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id, full_name, phone, country, street")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError) throw profileError;
    if (!profile) throw new Error("Profile not found for user");

    const customerId = await resolveOrCreateStripeCustomer(
      stripe,
      supabaseAdmin,
      user.id,
      user.email,
      profile.stripe_customer_id,
      profile as ProfileBilling,
    );

    const slugify = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const destinationSlug = slugify(destination);
    const focusList = Array.isArray(focus_areas)
      ? focus_areas.filter((x: unknown) => typeof x === "string") as string[]
      : [];

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "usd",
      customer: customerId,
      payment_method_types: ["card"],
    });

    const { error: guideInsertError } = await supabaseAdmin.from("travel_guides").insert({
      user_id: user.id,
      destination,
      destination_slug: destinationSlug,
      focus_areas: focusList,
      depth,
      token_budget: tokenBudget,
      language: language || "en",
      season: season || "unknown",
      price_paid: priceUsd,
      stripe_payment_id: paymentIntent.id,
      status: "awaiting_payment",
    });

    if (guideInsertError) throw guideInsertError;

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (error) {
    console.error("create-payment-intent error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    );
  }
});
