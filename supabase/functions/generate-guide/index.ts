import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { guide_id } = await req.json();
    if (!guide_id) {
      return new Response(JSON.stringify({ error: "Missing guide_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: guide, error: fetchError } = await supabase
      .from("travel_guides")
      .select("*")
      .eq("id", guide_id)
      .single();

    if (fetchError || !guide) {
      return new Response(JSON.stringify({ error: "Guide not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const depthInstruction: Record<string, string> = {
      essential: "Write 15-20 pages worth of content. Cover key highlights concisely.",
      complete: "Write 30-40 pages worth of content. Deep dive into each section with details.",
      ultimate: "Write 60+ pages worth of content. Cover absolutely everything with insider secrets, hidden gems, and exhaustive detail.",
    };

    const tokenBudget =
      typeof guide.token_budget === "number" && guide.token_budget > 0
        ? guide.token_budget
        : guide.depth === "ultimate"
          ? 450_000
          : guide.depth === "complete"
            ? 232_500
            : 15_000;

    const lengthByTokens =
      tokenBudget < 120_000
        ? "Concise but complete: prioritize the most useful sections, best stops, and clear practical advice. Do not pad."
        : tokenBudget < 250_000
          ? "Balanced guide: strong detail in every major section, solid neighborhood and practical coverage."
          : "Exhaustive guide: go deep in every section, more options per category, insider angles, and thorough coverage without unnecessary filler.";

    const focusAreas = (guide.focus_areas || []).join(", ") || "General overview";
    const year = new Date().getFullYear();
    const depthText = depthInstruction[guide.depth] || depthInstruction.essential;
    const lengthText =
      typeof guide.token_budget === "number" && guide.token_budget > 0 ? lengthByTokens : depthText;

    const systemPrompt = `You are Digital Moonkey Travel's expert travel writer.

Generate a comprehensive, detailed travel guide.

Output language: ${guide.language}
Destination: ${guide.destination}
Focus areas: ${focusAreas}
Guide depth tier: ${guide.depth}
Approximate AI token budget for this generation: ${tokenBudget} tokens (scale thoroughness to match this budget).
Travel season: ${guide.season || "All seasons"}

IMPORTANT — LINKS & REFERENCES:
For every place, attraction, restaurant, hotel, market, or point of interest you mention, include:
- A Google Maps link: [Name](https://www.google.com/maps/search/Name+${encodeURIComponent(guide.destination)})
- If you know the official website, include it: [Official site](https://example.com)
- For booking platforms, link to them: e.g. [Book on GetYourGuide](https://www.getyourguide.com/s/?q=Name+${encodeURIComponent(guide.destination)})
- For restaurants, add a TripAdvisor search link: [Reviews](https://www.tripadvisor.com/Search?q=Name+${encodeURIComponent(guide.destination)})

This makes the guide genuinely useful — readers can tap any place to see it on the map or book instantly.

Structure EXACTLY as follows:

# 🌍 ${guide.destination} Travel Guide

## Digital Moonkey Travel | digitalmoonkey.travel

### The Complete Guide for ${year}

---

## 📍 DESTINATION OVERVIEW
- Geography & Location (include [📍 See on Map](https://www.google.com/maps/search/${encodeURIComponent(guide.destination)}))
- Climate & Best Time to Visit
- Population & Culture
- Language(s) spoken
- Currency & typical costs
- Time zone
- Electricity & plugs
- Safety overview (honest assessment)

## ✈️ GETTING THERE
- Best airports to fly into (with Google Maps links)
- Top airlines serving the route (link to airline websites)
- Average flight prices by season
- Airport transfer options with prices
- Visa & entry requirements overview

## 🏘️ NEIGHBORHOODS GUIDE
[For each major neighborhood: character, best for, must-see, where to stay, price range. Include a 📍 Google Maps link for each neighborhood]

## 🏛️ TOP ATTRACTIONS
[Top 15-20 attractions with: what it is, opening hours, ticket prices, insider tip, time needed, skip if overrated. EACH with:
- 📍 [See on Google Maps](link)
- 🎟️ [Book tickets](link) when applicable
- 🌐 [Official website](link) when known]

## 🍽️ FOOD & DRINK GUIDE
- Local cuisine overview, must-try dishes and drinks
- Top 10 restaurants by budget tier (each with 📍 Maps link + ⭐ TripAdvisor link)
- Best food markets & street food areas (with Maps links)
- Dining etiquette & tipping customs

## 🛏️ WHERE TO STAY
- Neighborhoods by traveler type
- Top hotels: Budget (<€80), Mid (€80-200), Luxury (€200+) — each with 📍 Maps link + 🔗 booking link
- Alternative accommodation tips

## 🚇 GETTING AROUND
- Public transport explained, best apps (link to app stores)
- Taxi & rideshare apps (link to download)
- Day trip transport, approximate costs

## 🛍️ SHOPPING GUIDE
- Best shopping areas (with Maps links), local products
- Markets with days/hours (with Maps links)
- Price negotiation tips, tourist traps to avoid

## 🎉 NIGHTLIFE & ENTERTAINMENT
- Scene overview, best areas (with Maps links)
- Local entertainment, dress codes
- Safety tips

## 🌅 DAY TRIPS
[Top 5 day trips: distance, how to get there, what to see, cost. Each with 📍 Google Maps link and 🎟️ tour booking link]

## 📅 SUGGESTED ITINERARIES
- Weekend (2 days), Short break (4 days), Full week (7 days)
- Link back to relevant attractions/restaurants mentioned above

## 💶 BUDGET GUIDE
| Category | Budget/day | Mid/day | Luxury/day |
|---|---|---|---|
| Accommodation | €X | €X | €X |
| Food | €X | €X | €X |
| Activities | €X | €X | €X |
| Transport | €X | €X | €X |
| **Total** | **€X** | **€X** | **€X** |

## 🧳 PACKING LIST
- Season-specific clothing, destination items
- Tech & connectivity (mention eSIM at /esims)
- Documents checklist

## 🗣️ LANGUAGE & PHRASES
- Essential phrases with pronunciation
- Cultural dos and don'ts
- Common scams, emergency numbers

## ⚡ DIGITAL MOONKEY INSIDER TIPS
[10 genuine insider tips most guides miss]

## 📱 USEFUL APPS & RESOURCES
- Navigation, transport, food delivery, translation, emergency apps
- Include download links for each app (App Store / Google Play when possible)
- Useful websites for the destination

---

Generate EVERYTHING in ${guide.language}.
Be specific, practical, genuinely useful.
Use real places, real neighborhoods, real prices.
Be honest about downsides and tourist traps.
Write like a knowledgeable friend, not a brochure.
ALL links must be real, functional URLs (Google Maps search links are always valid).
Length / detail: ${lengthText}`;

    await supabase
      .from("travel_guides")
      .update({ status: "generating" })
      .eq("id", guide_id);

    const usePro =
      guide.depth === "ultimate" ||
      (typeof guide.token_budget === "number" && guide.token_budget >= 280_000);
    const model = usePro ? "google/gemini-2.5-pro" : "google/gemini-2.5-flash";

    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Generate my travel guide for ${guide.destination} using the requested token budget (~${tokenBudget} tokens). Tier: ${guide.depth}. Make it comprehensive, practical, and amazing!`,
            },
          ],
          stream: true,
        }),
      }
    );

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);

      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await supabase.from("travel_guides").update({ status: "failed" }).eq("id", guide_id);
      return new Response(JSON.stringify({ error: "Failed to generate guide" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    (async () => {
      let fullContent = "";
      const reader = aiResponse.body!.getReader();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          let newlineIdx: number;

          while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, newlineIdx);
            buffer = buffer.slice(newlineIdx + 1);

            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") {
              await writer.write(encoder.encode("data: [DONE]\n\n"));
              break;
            }

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullContent += content;
                await writer.write(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
              }
            } catch { /* skip partial */ }
          }
        }

        const shareToken = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
        const wordCount = fullContent.split(/\s+/).length;

        await supabase
          .from("travel_guides")
          .update({
            content_markdown: fullContent,
            status: "completed",
            public_share_token: shareToken,
            word_count: wordCount,
          })
          .eq("id", guide_id);
      } catch (e) {
        console.error("Stream error:", e);
        await supabase.from("travel_guides").update({ status: "failed" }).eq("id", guide_id);
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
