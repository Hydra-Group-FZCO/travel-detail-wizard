import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser(token);
    if (authError || !user?.email) throw new Error("User not authenticated");

    // Check if already has stripe_customer_id
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id, full_name, phone, country, street")
      .eq("user_id", user.id)
      .single();

    if (profile?.stripe_customer_id) {
      return new Response(JSON.stringify({ stripe_customer_id: profile.stripe_customer_id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Create Stripe customer
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if customer already exists in Stripe by email
    const existing = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string;

    if (existing.data.length > 0) {
      customerId = existing.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.full_name || undefined,
        phone: profile?.phone || undefined,
        address: {
          line1: profile?.street || undefined,
          country: profile?.country || undefined,
        },
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
    }

    // Save stripe_customer_id to profile
    await supabaseAdmin.from("profiles").update({ stripe_customer_id: customerId }).eq("user_id", user.id);

    return new Response(JSON.stringify({ stripe_customer_id: customerId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
