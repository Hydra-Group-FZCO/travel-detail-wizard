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

    const focusAreas = (guide.focus_areas || []).join(", ") || "General overview";
    const year = new Date().getFullYear();

    const systemPrompt = `You are Digital Moonkey Travel's expert travel writer.

Generate a comprehensive, detailed travel guide.

Output language: ${guide.language}
Destination: ${guide.destination}
Focus areas: ${focusAreas}
Guide depth: ${guide.depth} — ${depthInstruction[guide.depth] || depthInstruction.essential}
Travel season: ${guide.season || "All seasons"}

Structure EXACTLY as follows:

# 🌍 ${guide.destination} Travel Guide

## Digital Moonkey Travel | digitalmoonkey.travel

### The Complete Guide for ${year}

---

## 📍 DESTINATION OVERVIEW
- Geography & Location
- Climate & Best Time to Visit
- Population & Culture
- Language(s) spoken
- Currency & typical costs
- Time zone
- Electricity & plugs
- Safety overview (honest assessment)

## ✈️ GETTING THERE
- Best airports to fly into
- Top airlines serving the route
- Average flight prices by season
- Airport transfer options with prices
- Visa & entry requirements overview
  ⚡ "Need travel authorization? Check our services at /services"

## 🏘️ NEIGHBORHOODS GUIDE
[For each major neighborhood:]
- Character & vibe
- Best for: (type of traveler)
- Must-see streets/squares
- Where to stay in this area
- Price range

## 🏛️ TOP ATTRACTIONS
[Top 15-20 attractions with:]
- What it is & why it's special
- Opening hours & best time to visit
- Ticket prices
- Insider tip
- Time needed
- Skip if: (honest advice on overrated spots)

## 🍽️ FOOD & DRINK GUIDE
- Local cuisine overview
- Must-try dishes (with descriptions)
- Must-try drinks
- Top 10 restaurants by category (budget/mid/luxury)
- Best food markets & street food areas
- Local dining etiquette & tips
- Tipping customs

## 🛏️ WHERE TO STAY
- Neighborhood recommendations by traveler type
- Top hotels by budget tier (3 per tier):
  Budget (under €80/night)
  Mid-range (€80-200/night)
  Luxury (€200+/night)
- Alternative accommodation tips

## 🚇 GETTING AROUND
- Public transport system explained
- Best apps for navigation & transport
- Taxi & rideshare situation
- Car rental advice (when yes, when no)
- Day trip transport options
- Approximate costs for common routes

## 🛍️ SHOPPING GUIDE
- Best shopping areas & streets
- Local products worth buying
- Markets (with days/hours)
- Price negotiation tips (if applicable)
- What NOT to buy (tourist traps)

## 🎉 NIGHTLIFE & ENTERTAINMENT
- Nightlife scene overview
- Best areas for bars/clubs
- Local entertainment (theatre, music, etc.)
- Dress codes & entry requirements
- Safety tips for nightlife

## 🌅 DAY TRIPS
[Top 5 day trips with:]
- Distance & travel time
- How to get there
- What to see
- Cost estimate

## 📅 SUGGESTED ITINERARIES
- Weekend (2 days)
- Short break (4 days)
- Full week (7 days)

## 💶 BUDGET GUIDE
| Category | Budget/day | Mid/day | Luxury/day |
|---|---|---|---|
| Accommodation | €X | €X | €X |
| Food | €X | €X | €X |
| Activities | €X | €X | €X |
| Transport | €X | €X | €X |
| **Total** | **€X** | **€X** | **€X** |

## 🧳 PACKING LIST
- Season-specific clothing
- Destination-specific items
- Tech & connectivity
  ⚡ "Stay connected with a Digital Moonkey eSIM → /esims"
- Documents checklist

## 🗣️ LANGUAGE & PHRASES
- Essential phrases with pronunciation
- Cultural dos and don'ts
- Common scams to avoid
- Emergency numbers

## ⚡ DIGITAL MOONKEY INSIDER TIPS
[10 genuine insider tips that most guides don't mention]

## 📱 USEFUL APPS & RESOURCES
- Navigation apps
- Transport apps
- Food delivery apps
- Translation apps
- Emergency apps

---

Generate EVERYTHING in ${guide.language}.
Be specific, practical, and genuinely useful.
Use real place names, real neighborhoods, real prices (approximate).
Be honest — mention downsides and tourist traps.
Write like a knowledgeable friend who lives there, not a brochure.
Length: ${depthInstruction[guide.depth] || depthInstruction.essential}`;

    await supabase
      .from("travel_guides")
      .update({ status: "generating" })
      .eq("id", guide_id);

    // Use gemini-2.5-pro for longer guides, flash for essential
    const model = guide.depth === "ultimate" ? "google/gemini-2.5-pro" : "google/gemini-2.5-flash";

    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: \`Bearer \${LOVABLE_API_KEY}\`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: \`Generate my complete \${guide.depth} travel guide for \${guide.destination}. Make it comprehensive, practical, and amazing!\`,
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

          while ((newlineIdx = buffer.indexOf("\\n")) !== -1) {
            let line = buffer.slice(0, newlineIdx);
            buffer = buffer.slice(newlineIdx + 1);

            if (line.endsWith("\\r")) line = line.slice(0, -1);
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") {
              await writer.write(encoder.encode("data: [DONE]\\n\\n"));
              break;
            }

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullContent += content;
                await writer.write(encoder.encode(\`data: \${JSON.stringify({ content })}\\n\\n\`));
              }
            } catch { /* skip partial */ }
          }
        }

        const shareToken = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
        const wordCount = fullContent.split(/\\s+/).length;

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
