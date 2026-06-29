import type { APIRoute } from "astro";

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, any>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const { name, email, subject, message, company, _ts } = body;

  // Spam: honeypot + submit-timing.
  if (company) return json({ ok: true }); // silently accept bots
  if (_ts && Date.now() - Number(_ts) < 2000) {
    return json({ ok: false, error: "Too fast" }, 422);
  }

  // Validation.
  if (!name || !email || !message) {
    return json({ ok: false, error: "Missing required fields" }, 422);
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email))) {
    return json({ ok: false, error: "Invalid email" }, 422);
  }
  if (String(message).length > 5000) {
    return json({ ok: false, error: "Message too long" }, 422);
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_TO_EMAIL;
  const from = import.meta.env.CONTACT_FROM_EMAIL || "site@example.dev";

  // No provider configured (e.g. local dev) — log and accept so the UI works.
  if (!apiKey || !to) {
    console.log("[contact] (no email provider configured) message:", {
      name, email, subject, message,
    });
    return json({ ok: true, dev: true });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: email,
        subject: subject ? `[portfolio] ${subject}` : `[portfolio] message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });
    if (!res.ok) {
      console.error("[contact] resend error:", await res.text());
      return json({ ok: false, error: "Send failed" }, 502);
    }
    return json({ ok: true });
  } catch (err) {
    console.error("[contact] error:", err);
    return json({ ok: false, error: "Send failed" }, 502);
  }
};
