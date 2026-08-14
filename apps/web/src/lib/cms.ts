// Replacement for sanity.ts. Talks to the self-hosted Payload instance
// instead of Sanity's Content Lake. Keeps the same contract: never throws,
// returns null when unconfigured or on error, so callers fall back to seed
// data exactly as before.
//
// process.env first, import.meta.env as fallback: this app runs as a
// prebuilt container image whose env vars are injected at pod runtime
// (k8s envFrom secretRef), not at `docker build` time — import.meta.env.*
// gets statically inlined by Vite at build time, so it would always be
// empty in the deployed image. process.env.* is read live by Node at
// request time, which is what we actually want. import.meta.env stays as
// the fallback so local dev (`astro dev` with a `.env` file) keeps working.
// See pages/api/contact.ts for the same pattern already used for SMTP creds.

const serverURL = (process.env.PUBLIC_PAYLOAD_URL ??
  (import.meta.env.PUBLIC_PAYLOAD_URL as string | undefined)) as string | undefined; // e.g. https://studio.tusharjaryal.in
// Only needed if you lock down reads (access.read on collections/globals) —
// the schema port in this delivery sets `read: () => true`, so public GET
// requests work unauthenticated. Set this if you tighten that later.
const apiKey = (process.env.PAYLOAD_API_KEY ??
  (import.meta.env.PAYLOAD_API_KEY as string | undefined)) as string | undefined;

export const isCmsConfigured = Boolean(serverURL);

type FetchOpts = {
  params?: Record<string, string | number | boolean>;
  depth?: number; // how many levels of relationships/uploads to populate — mirrors Sanity's `->` dereference
};

/**
 * Low-level GET against Payload's REST API. `path` is anything after /api,
 * e.g. "/globals/homePage" or "/projects?where[featured][equals]=true".
 */
export async function payloadFetch<T>(path: string, { params = {}, depth = 2 }: FetchOpts = {}): Promise<T | null> {
  if (!serverURL) return null;
  const hasQuery = path.includes('?');
  const qs = new URLSearchParams({ depth: String(depth), ...stringifyParams(params) });
  const url = `${serverURL}/api${path}${hasQuery ? '&' : '?'}${qs}`;
  try {
    const res = await fetch(url, {
      headers: apiKey ? { Authorization: `users API-Key ${apiKey}` } : undefined,
    });
    if (!res.ok) throw new Error(`Payload ${path} → ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    console.error('[payload] fetch failed:', err);
    return null;
  }
}

function stringifyParams(params: Record<string, string | number | boolean>) {
  return Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
}
