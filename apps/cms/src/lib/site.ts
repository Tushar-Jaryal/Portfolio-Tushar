/** Canonical public origin — used for links that must resolve outside the cluster (emails, redirects). */
export function getPublicServerURL(): string {
  const url = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'https://demo.tusharjaryal.in'
  return url.replace(/\/+$/, '')
}

/** Keep in sync with Recommenders.auth.tokenExpiration — used to set the cookie's maxAge on magic-link verify. */
export const RECOMMENDER_TOKEN_EXPIRATION_SECONDS = 60 * 24 * 60 * 60
