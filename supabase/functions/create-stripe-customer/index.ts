import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/** Stripe expects ISO 3166-1 alpha-2; pass through 2-letter codes, otherwise send trimmed value. */
function stripeCountry(country: string | null | undefined): string | undefined {
  const t = country?.trim();
  if (!t) return undefined;
  return t.length === 2 ? t.toUpperCase() : t;
}

function customerAddressFromProfile(
  street: string | null | undefined,
  country: string | null | undefined,
): Record<string, string> | undefined {
  const line1 = street?.trim();
  const c = stripeCountry(country ?? undefined);
  if (!line1 && !c) return undefined;
  const address: Record<string, string> = {};
  if (line1) address.line1 = line1.slice(0, 200);
  if (c) address.country = c;
  return Object.keys(address).length ? address : undefined;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const supabaseClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser(token);
    if (authError || !user?.email) throw new Error("User not authenticated");

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id, full_name, phone, country, street")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError) throw profileError;
    if (!profile) throw new Error("Profile not found");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const address = customerAddressFromProfile(profile.street, profile.country);
    const updateFromProfile: {
      name?: string;
      phone?: string;
      address?: Record<string, string>;
    } = {
      ...(profile.full_name?.trim() ? { name: profile.full_name.trim() } : {}),
      ...(profile.phone?.trim() ? { phone: profile.phone.trim() } : {}),
      ...(address ? { address } : {}),
    };

    if (profile.stripe_customer_id?.trim()) {
      if (Object.keys(updateFromProfile).length > 0) {
        try {
          await stripe.customers.update(profile.stripe_customer_id.trim(), updateFromProfile);
        } catch (e) {
          console.warn("create-stripe-customer: update existing customer:", e);
        }
      }
      return new Response(JSON.stringify({ stripe_customer_id: profile.stripe_customer_id.trim() }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const existing = await stripe.customers.list({ email: user.email, limit: 25 });
    const withMeta = existing.data.find((c) => c.metadata?.supabase_user_id === user.id) ?? existing.data[0];

    let customerId: string;

    if (withMeta) {
      customerId = withMeta.id;
      if (Object.keys(updateFromProfile).length > 0) {
        try {
          await stripe.customers.update(customerId, updateFromProfile);
        } catch (e) {
          console.warn("create-stripe-customer: update matched customer:", e);
        }
      }
    } else {
      const created = await stripe.customers.create({
        email: user.email,
        name: profile.full_name?.trim() || undefined,
        phone: profile.phone?.trim() || undefined,
        ...(address ? { address } : {}),
        metadata: { supabase_user_id: user.id },
      });
      customerId = created.id;
    }

    await supabaseAdmin.from("profiles").update({ stripe_customer_id: customerId }).eq("user_id", user.id);

    return new Response(JSON.stringify({ stripe_customer_id: customerId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
