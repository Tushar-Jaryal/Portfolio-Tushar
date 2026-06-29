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

  const { email, company } = body;
  if (company) return json({ ok: true }); // honeypot
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email))) {
    return json({ ok: false, error: "Invalid email" }, 422);
  }

  const buttondownKey = import.meta.env.BUTTONDOWN_API_KEY;

  if (!buttondownKey) {
    console.log("[subscribe] (no newsletter provider configured):", email);
    return json({ ok: true, dev: true });
  }

  try {
    const res = await fetch("https://api.buttondown.com/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${buttondownKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_address: email }),
    });
    // 201 created, or 200/409 if already subscribed — treat as success.
    if (res.ok || res.status === 409) return json({ ok: true });
    console.error("[subscribe] buttondown error:", await res.text());
    return json({ ok: false, error: "Subscribe failed" }, 502);
  } catch (err) {
    console.error("[subscribe] error:", err);
    return json({ ok: false, error: "Subscribe failed" }, 502);
  }
};
