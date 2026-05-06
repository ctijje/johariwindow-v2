const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const { email, name, whatsapp, occupation, age, gender, referralSource, resultUrl, peerUrl, code } = body ?? {};

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "email required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("BREVO_API_KEY");
    const listIdRaw = Deno.env.get("BREVO_LIST_ID");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "BREVO_API_KEY not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const listIds = listIdRaw ? [Number(listIdRaw)].filter((n) => !isNaN(n)) : undefined;

    const [firstName, ...rest] = String(name ?? "").trim().split(/\s+/);
    const lastName = rest.join(" ");

    const attributes: Record<string, unknown> = {
      FIRSTNAME: firstName || undefined,
      LASTNAME: lastName || undefined,
      SMS: whatsapp || undefined,
      WHATSAPP: whatsapp || undefined,
      OCCUPATION: occupation || undefined,
      AGE: age ? Number(age) : undefined,
      GENDER: gender || undefined,
      REFERRAL_SOURCE: referralSource || undefined,
      RESULT_URL: resultUrl || undefined,
      PEER_URL: peerUrl || undefined,
      JOHARI_CODE: code || undefined,
    };
    Object.keys(attributes).forEach((k) => attributes[k] === undefined && delete attributes[k]);

    const payload: Record<string, unknown> = {
      email,
      attributes,
      updateEnabled: true,
    };
    if (listIds && listIds.length) payload.listIds = listIds;

    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    if (!res.ok) {
      console.error("Brevo error", res.status, text);
      return new Response(JSON.stringify({ error: "brevo_failed", status: res.status, detail: text }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, brevo: text ? JSON.parse(text) : null }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});