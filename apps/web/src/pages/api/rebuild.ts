import type { APIRoute } from "astro";

export const prerender = false;

/**
 * Receives the Sanity publish webhook and triggers a site rebuild.
 *
 * Security: Sanity signs each webhook. The simplest robust check is a shared
 * secret in the URL or a header that we compare here. (For full HMAC signature
 * verification, use @sanity/webhook's isValidSignature with the request body.)
 *
 * The actual build is delegated to an external script (deploy/deploy.sh) so a
 * long build never blocks this request. Here we just validate and enqueue.
 */
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  const secret = import.meta.env.SANITY_WEBHOOK_SECRET;
  const provided =
    request.headers.get("x-webhook-secret") ||
    new URL(request.url).searchParams.get("secret");

  if (!secret || provided !== secret) {
    return json({ ok: false, error: "Unauthorized" }, 401);
  }

  // Enqueue a rebuild. Replace this with your trigger of choice:
  //  - touch a file that a systemd path-unit watches, or
  //  - hit a tiny local builder service, or
  //  - write to a queue the deploy script drains (debounced).
  // Kept as a stub so the endpoint is safe to deploy before wiring the runner.
  console.log("[rebuild] webhook accepted — enqueue build here");

  return json({ ok: true, queued: true });
};
