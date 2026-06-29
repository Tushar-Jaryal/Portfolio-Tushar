import { createClient, type SanityClient } from "@sanity/client";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID as string | undefined;
const dataset = (import.meta.env.PUBLIC_SANITY_DATASET as string) ?? "production";
const apiVersion =
  (import.meta.env.PUBLIC_SANITY_API_VERSION as string) ?? "2024-01-01";
const token = import.meta.env.SANITY_READ_TOKEN as string | undefined;

/** True only when a real Sanity project is configured. Lets pages fall back to seed data. */
export const isSanityConfigured = Boolean(projectId);

function makeClient(useCdn: boolean): SanityClient | null {
  if (!projectId) return null;
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    token: token || undefined,
    perspective: "published",
  });
}

/**
 * Build-time client — useCdn:false so a webhook-triggered rebuild never reads
 * stale CDN data immediately after a publish. Use for getStaticPaths and all
 * statically-rendered pages.
 */
export const buildClient = makeClient(false);

/**
 * Runtime client — useCdn:true (fast, edge-cached). Use only inside
 * prerender=false (SSR) routes like the Home page where instant-but-eventually
 * -consistent reads are fine.
 */
export const runtimeClient = makeClient(true);

type FetchOpts = { runtime?: boolean; params?: Record<string, unknown> };

/**
 * Run a GROQ query. Returns `null` (not throw) when Sanity isn't configured or
 * the request fails, so callers can fall back to seed data gracefully.
 */
export async function sanityFetch<T>(
  query: string,
  { runtime = false, params = {} }: FetchOpts = {},
): Promise<T | null> {
  const client = runtime ? runtimeClient : buildClient;
  if (!client) return null;
  try {
    return await client.fetch<T>(query, params);
  } catch (err) {
    console.error("[sanity] query failed:", err);
    return null;
  }
}
