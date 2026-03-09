import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || "";

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { otp, phoneNumber } = await req.json();
    if (!otp || !phoneNumber) {
      return new Response(JSON.stringify({ error: "OTP and phone number are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the OTP record for this user
    const { data: otpRecord, error: fetchError } = await adminClient
      .from("phone_otps")
      .select("*")
      .eq("user_id", user.id)
      .eq("phone_number", phoneNumber)
      .single();

    if (fetchError || !otpRecord) {
      return new Response(JSON.stringify({ error: "No OTP found. Please request a new code." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check expiry
    if (new Date(otpRecord.expires_at) < new Date()) {
      await adminClient.from("phone_otps").delete().eq("id", otpRecord.id);
      return new Response(JSON.stringify({ error: "OTP has expired. Please request a new code." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check max attempts (5)
    if (otpRecord.attempts >= 5) {
      await adminClient.from("phone_otps").delete().eq("id", otpRecord.id);
      return new Response(JSON.stringify({ error: "Too many failed attempts. Please request a new code." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify OTP hash
    const inputHash = await hashOTP(otp.trim());
    if (inputHash !== otpRecord.otp_hash) {
      // Increment attempts
      await adminClient
        .from("phone_otps")
        .update({ attempts: otpRecord.attempts + 1 })
        .eq("id", otpRecord.id);
      const remaining = 4 - otpRecord.attempts;
      return new Response(JSON.stringify({ error: `Incorrect code. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // OTP correct — mark phone as verified
    await Promise.all([
      adminClient
        .from("profiles")
        .update({ phone_number: phoneNumber, phone_verified: true })
        .eq("user_id", user.id),
      adminClient.from("phone_otps").delete().eq("id", otpRecord.id),
    ]);

    return new Response(JSON.stringify({ success: true, message: "Phone number verified successfully!" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("verify-otp error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Verification failed" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
