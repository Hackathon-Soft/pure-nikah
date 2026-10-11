import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const extractCnic = (text: string) => {
  const match = text.replace(/\s+/g, " ").match(/\b\d{5}[-\s]\d{7}[-\s]\d\b/);
  return match?.[0]?.replace(/\s/g, "-") || null;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Unauthorized" }, 401);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || "",
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return json({ error: "Unauthorized" }, 401);

  const apiKey = Deno.env.get("OCR_SPACE_API_KEY");
  if (!apiKey) return json({ error: "OCR service is not configured" }, 503);

  try {
    const { base64, mimeType } = await req.json();
    if (typeof base64 !== "string" || !base64 || typeof mimeType !== "string") {
      return json({ error: "A document image is required" }, 400);
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(mimeType)) {
      return json({ error: "Only JPG, PNG, and WEBP images are supported" }, 400);
    }
    if (base64.length > 8_000_000) return json({ error: "Document image is too large to scan" }, 413);

    const form = new FormData();
    form.append("apikey", apiKey);
    form.append("base64Image", `data:${mimeType};base64,${base64}`);
    form.append("language", "eng");
    form.append("OCREngine", "2");
    form.append("isOverlayRequired", "false");

    const response = await fetch("https://api.ocr.space/parse/image", { method: "POST", body: form });
    if (!response.ok) return json({ error: "OCR provider request failed" }, 502);
    const result = await response.json();
    if (result.IsErroredOnProcessing) return json({ error: "The document could not be read. Upload a clearer image." }, 422);

    const text = (result.ParsedResults || []).map((item: { ParsedText?: string }) => item.ParsedText || "").join("\n").trim();
    return json({ text, extracted: { cnicNumber: extractCnic(text) } });
  } catch (error) {
    console.error("extract-document-text error", error);
    return json({ error: "Document scanning failed" }, 500);
  }
});