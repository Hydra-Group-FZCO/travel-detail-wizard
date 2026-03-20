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

    // Get auth token
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { itinerary_id } = await req.json();
    if (!itinerary_id) {
      return new Response(JSON.stringify({ error: "Missing itinerary_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch itinerary data
    const { data: itinerary, error: fetchError } = await supabase
      .from("itineraries")
      .select("*")
      .eq("id", itinerary_id)
      .single();

    if (fetchError || !itinerary) {
      return new Response(JSON.stringify({ error: "Itinerary not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const extras = itinerary.extras || [];
    const extrasText = extras.length > 0 ? extras.join(", ") : "None";

    const systemPrompt = `You are Digital Moonkey Travel's expert AI travel planner.

Generate a complete, detailed, personalized travel itinerary.

Output language: ${itinerary.language}
Destination: ${itinerary.destination}
Departure city: ${itinerary.departure_city || "Not specified"}
Travel dates: ${itinerary.start_date} to ${itinerary.end_date} (${itinerary.num_days} days)
Travelers: ${itinerary.travelers_adults} adults, ${itinerary.travelers_children} children${itinerary.children_ages?.length ? " (ages: " + itinerary.children_ages.join(", ") + ")" : ""}
Trip type: ${itinerary.trip_type}
Interests: ${(itinerary.interests || []).join(", ")}
Budget level: ${itinerary.budget_level}
Extras requested: ${extrasText}

Structure the itinerary EXACTLY as follows (write all content in ${itinerary.language}, but ALWAYS keep the markdown headers "## Day X:" in English exactly as shown — do NOT translate "Day" to another language):

# 🌍 ${itinerary.destination} — ${itinerary.num_days} Day Itinerary

## Digital Moonkey Travel | digitalmoonkey.travel

### Trip Overview
[2-3 sentence personalized introduction based on their preferences]

### Best Time to Visit & Weather
[Current season context for their travel dates]

### Getting There
[Best transport options from departure city to destination]

---

For each day (Day 1 through Day ${itinerary.num_days}):

## Day X: [Creative day title]

**Morning (9:00 - 13:00)**
[2-3 activities with descriptions, opening hours, tips]

**Afternoon (13:00 - 18:00)**
[2-3 activities]

**Evening (18:00 - 22:00)**
[Dinner recommendation + evening activity]

💡 **Pro tip:** [Local insider tip for the day]

---

${extras.includes("restaurants") ? `### 🍽️ Must-Try Restaurants
[Top 5 restaurants with cuisine type, price range, must-order dish]

` : ""}${extras.includes("accommodation") ? `### 🏨 Where to Stay
[Neighborhoods breakdown with pros/cons per budget level]

` : ""}${extras.includes("transport") ? `### 🚇 Getting Around
[Transport tips: metro lines, taxi apps, day passes]

` : ""}${extras.includes("budget") ? `### 💶 Daily Budget Estimate
| Category | Budget | Mid-range | Luxury |
|---|---|---|---|
| Accommodation | €X | €X | €X |
| Food | €X | €X | €X |
| Activities | €X | €X | €X |
| Transport | €X | €X | €X |
| **Total/day** | **€X** | **€X** | **€X** |

` : ""}${extras.includes("packing") ? `### 🧳 Packing Tips
[Season-specific and destination-specific packing list]

` : ""}${extras.includes("phrases") ? `### 🗣️ Useful Phrases
[10 essential phrases in destination language with pronunciation]

` : ""}### ⚡ Digital Moonkey Travel Tips
- eSIM recommendation: "Stay connected in ${itinerary.destination} — check our eSIM plans at /esims"
- Travel services: "Need visa assistance? Visit /services"

---

Generate everything in ${itinerary.language}.
Be specific, enthusiastic, and genuinely helpful.
Include real place names, real neighborhoods, real local tips.
Do NOT be generic. Tailor everything to the specific interests and trip type.`;

    // Update status to generating
    await supabase
      .from("itineraries")
      .update({ status: "generating" })
      .eq("id", itinerary_id);

    // Call Lovable AI with streaming
    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Generate my complete ${itinerary.num_days}-day travel itinerary for ${itinerary.destination}. Make it amazing!`,
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
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      await supabase
        .from("itineraries")
        .update({ status: "failed" })
        .eq("id", itinerary_id);

      return new Response(
        JSON.stringify({ error: "Failed to generate itinerary" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a TransformStream to collect content while streaming
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Process stream in background
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
                await writer.write(
                  encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                );
              }
            } catch {
              // skip partial JSON
            }
          }
        }

        // Generate share token
        const shareToken = crypto.randomUUID().replace(/-/g, "").slice(0, 12);

        // Save completed itinerary
        await supabase
          .from("itineraries")
          .update({
            content_markdown: fullContent,
            status: "completed",
            public_share_token: shareToken,
          })
          .eq("id", itinerary_id);
      } catch (e) {
        console.error("Stream processing error:", e);
        await supabase
          .from("itineraries")
          .update({ status: "failed" })
          .eq("id", itinerary_id);
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
