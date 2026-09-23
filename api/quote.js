export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const host = String(req.headers.host || "").toLowerCase();

  try {
    // On Vercel preview/test hostnames, exercise the already-working live quote
    // endpoint instead of duplicating production credentials into the test project.
    if (host.endsWith(".vercel.app")) {
      const upstream = await fetch("https://lizardbrainwiring.com/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(req.body ?? {})
      });

      const body = await upstream.text();
      res.status(upstream.status);
      res.setHeader("content-type", upstream.headers.get("content-type") || "application/json; charset=utf-8");
      return res.send(body);
    }

    const secret = process.env.LBW_FORM_SECRET;
    if (!secret) {
      console.error("LBW_FORM_SECRET is not configured");
      return res.status(500).json({ error: "Unable to send your request right now. Please call or email us directly." });
    }

    const upstream = await fetch("https://cdukljrjgvjlwzkdbyfb.supabase.co/functions/v1/lbw-quote-form", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-lbw-form-secret": secret
      },
      body: JSON.stringify(req.body ?? {})
    });

    const body = await upstream.text();
    res.status(upstream.status);
    res.setHeader("content-type", upstream.headers.get("content-type") || "application/json; charset=utf-8");
    return res.send(body);
  } catch (error) {
    console.error("Quote proxy error", error);
    return res.status(502).json({ error: "Unable to send your request right now. Please call or email us directly." });
  }
}
