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

  // Read at runtime from process.env (set via systemd EnvironmentFile / shared/.env)
  // so the key isn't baked into the build and can be rotated without rebuilding.
  // Fall back to import.meta.env for local dev.
  const apiKey = process.env.RESEND_API_KEY ?? import.meta.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? import.meta.env.CONTACT_TO_EMAIL;
  const from =
    process.env.CONTACT_FROM_EMAIL ??
    import.meta.env.CONTACT_FROM_EMAIL ??
    "site@example.dev";

  const smtpHost = process.env.SMTP_HOST ?? import.meta.env.SMTP_HOST;

  const subjectLine = subject
    ? `[portfolio] ${subject}`
    : `[portfolio] message from ${name}`;
  const text = `From: ${name} <${email}>\n\n${message}`;

  // No provider configured (e.g. local dev) — log and accept so the UI works.
  if (!to || (!apiKey && !smtpHost)) {
    console.log("[contact] (no email provider configured) message:", {
      name, email, subject, message,
    });
    return json({ ok: true, dev: true });
  }

  try {
    if (apiKey) {
      // Option A — Resend (REST API, no SDK needed).
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to, reply_to: email, subject: subjectLine, text }),
      });
      if (!res.ok) {
        console.error("[contact] resend error:", await res.text());
        return json({ ok: false, error: "Send failed" }, 502);
      }
    } else {
      // Option B — SMTP via Nodemailer (used when RESEND_API_KEY is blank).
      // Dynamic import keeps nodemailer external to the SSR bundle.
      const { default: nodemailer } = await import("nodemailer");
      const port = Number(process.env.SMTP_PORT ?? import.meta.env.SMTP_PORT ?? 587);
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port,
        secure: port === 465, // 465 = implicit TLS; 587 = STARTTLS
        auth: {
          user: process.env.SMTP_USER ?? import.meta.env.SMTP_USER,
          pass: process.env.SMTP_PASS ?? import.meta.env.SMTP_PASS,
        },
      });
      await transporter.sendMail({ from, to, replyTo: email, subject: subjectLine, text });
    }
    return json({ ok: true });
  } catch (err) {
    console.error("[contact] send error:", err);
    return json({ ok: false, error: "Send failed" }, 502);
  }
};
