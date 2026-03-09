import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple hash function for OTP storage
async function hashOTP(otp: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(otp);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
    const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
    const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || "";

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      return new Response(JSON.stringify({ error: "SMS service not configured" }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { phoneNumber } = await req.json();
    if (!phoneNumber || typeof phoneNumber !== "string") {
      return new Response(JSON.stringify({ error: "Phone number is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate phone number format (E.164)
    const e164Regex = /^\+[1-9]\d{7,14}$/;
    if (!e164Regex.test(phoneNumber)) {
      return new Response(JSON.stringify({ error: "Phone number must be in E.164 format (e.g. +923001234567)" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Rate limit: max 3 OTPs per phone per hour
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    const { count } = await adminClient
      .from("phone_otps")
      .select("*", { count: "exact", head: true })
      .eq("phone_number", phoneNumber)
      .gte("created_at", oneHourAgo);

    if ((count || 0) >= 3) {
      return new Response(JSON.stringify({ error: "Too many OTP requests. Please wait an hour before trying again." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await hashOTP(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // Delete old OTPs for this user
    await adminClient.from("phone_otps").delete().eq("user_id", user.id);

    // Store new OTP hash
    const { error: insertError } = await adminClient.from("phone_otps").insert({
      user_id: user.id,
      phone_number: phoneNumber,
      otp_hash: otpHash,
      expires_at: expiresAt,
    });
    if (insertError) throw insertError;

    // Send OTP via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const twilioResponse = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: TWILIO_PHONE_NUMBER,
        To: phoneNumber,
        Body: `Your PureNikah verification code is: ${otp}\n\nThis code expires in 10 minutes. Do not share this code with anyone.`,
      }),
    });

    if (!twilioResponse.ok) {
      const twilioError = await twilioResponse.json();
      console.error("Twilio error:", twilioError);
      throw new Error(twilioError.message || "Failed to send SMS");
    }

    return new Response(JSON.stringify({ success: true, message: "OTP sent successfully" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("send-otp error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Failed to send OTP" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
