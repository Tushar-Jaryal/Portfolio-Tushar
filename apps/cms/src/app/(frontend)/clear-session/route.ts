import { NextResponse } from 'next/server'
import { cookies } from 'next/headers.js'
import { getPublicServerURL } from '@/lib/site'

/**
 * Manual escape hatch — visit this URL directly if you get stuck logged in
 * as the wrong Payload identity (e.g. /admin's own logout button throws
 * "Incorrect collection" and never clears the cookie if the active
 * payload-token belongs to a different auth collection, since Payload's
 * logout endpoints are collection-scoped but the cookie name is shared
 * across every auth collection). This isn't wired into any UI — it's not a
 * fix for that Payload behavior, just a manual way out of it.
 */
export async function GET() {
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')
  return NextResponse.redirect(`${getPublicServerURL()}/`)
}
