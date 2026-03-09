import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      // Gracefully skip moderation if AI not available
      return new Response(JSON.stringify({ flagged: false, skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || "";

    // Verify user
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messageId, conversationId, senderId, content } = await req.json();
    
    if (!content || !messageId || !conversationId || !senderId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call Lovable AI to moderate the message
    const moderationPrompt = `You are a content moderation AI for PureNikah, an Islamic matrimonial platform. 
Analyze the following message for inappropriate content. Check for:
- Explicit sexual content or innuendo
- Harassment or threatening language
- Profanity or vulgar language
- Attempts to share personal contact information too early (phone numbers, social media handles)
- Scam-like language (asking for money, investment schemes)
- Disrespectful language about religion or marriage
- Spam or promotional content

Message to analyze: "${content}"

Respond with a JSON object containing:
- flagged: boolean (true if inappropriate content detected)
- severity: "low" | "medium" | "high" (if flagged)
- reason: string (brief explanation if flagged)

Be lenient with normal conversation but strict with clearly inappropriate content. Consider the Islamic matrimonial context.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a content moderation AI. Always respond with valid JSON only." },
          { role: "user", content: moderationPrompt },
        ],
        temperature: 0.1,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        console.warn("AI rate limited, skipping moderation");
        return new Response(JSON.stringify({ flagged: false, skipped: true, reason: "rate_limited" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        console.warn("AI credits exhausted, skipping moderation");
        return new Response(JSON.stringify({ flagged: false, skipped: true, reason: "credits_exhausted" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await aiResponse.text();
      console.error("AI moderation error:", aiResponse.status, errorText);
      return new Response(JSON.stringify({ flagged: false, skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || "";
    
    // Parse AI response
    let modResult = { flagged: false, severity: "low", reason: "" };
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        modResult = JSON.parse(jsonMatch[0]);
      }
    } catch (parseErr) {
      console.error("Failed to parse AI response:", aiContent, parseErr);
      // Default to not flagged if parsing fails
    }

    // If flagged, store in database
    if (modResult.flagged) {
      const adminClient = createClient(supabaseUrl, supabaseServiceKey);
      
      const { error: insertError } = await adminClient.from("flagged_messages").insert({
        message_id: messageId,
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        reason: modResult.reason || "Inappropriate content detected",
        severity: modResult.severity || "medium",
        status: "pending",
      });

      if (insertError) {
        console.error("Failed to insert flagged message:", insertError);
      }
    }

    return new Response(JSON.stringify({ 
      flagged: modResult.flagged,
      severity: modResult.severity,
      reason: modResult.reason,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Moderation error:", error);
    return new Response(JSON.stringify({ error: "Internal error", flagged: false }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
