import { NextResponse } from 'next/server'
import { cookies } from 'next/headers.js'
import { getPayloadClient } from '../../lib/frame'
import { getPublicServerURL, RECOMMENDER_TOKEN_EXPIRATION_SECONDS } from '@/lib/site'

// GET renders a "click to sign in" interstitial rather than consuming the
// token immediately — email security scanners (Outlook Safe Links, Gmail's
// link-checking, corporate proxies) auto-prefetch GET links in emails, which
// would silently burn the single-use token before the human ever clicks.
// Only the POST below (a genuine user-initiated form submit) actually
// redeems it.
export async function GET(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token')
  const origin = getPublicServerURL()

  if (!token) {
    return NextResponse.redirect(`${origin}/recommend?error=missing-token`)
  }

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Sign in — Tushar Jaryal</title>
<style>
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; background:#05070e; font-family:system-ui,sans-serif; }
  .card { max-width:420px; padding:40px; text-align:center; }
  h1 { color:#f1f5f9; font-size:22px; margin:0 0 12px; }
  p { color:rgba(226,232,240,.65); font-size:14px; line-height:1.6; margin:0 0 24px; }
  button { background:#67e8f9; color:#05070e; border:none; padding:13px 28px; border-radius:8px; font:500 14px system-ui,sans-serif; cursor:pointer; }
  button:hover { background:#a5f3fc; }
</style>
</head>
<body>
  <div class="card">
    <h1>Sign in to write your recommendation</h1>
    <p>Click below to confirm and sign in. This link can only be used once.</p>
    <form method="POST" action="/recommend/verify?token=${encodeURIComponent(token)}">
      <button type="submit">Sign in →</button>
    </form>
  </div>
</body>
</html>`

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

export async function POST(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token')
  const origin = getPublicServerURL()

  if (!token) {
    return NextResponse.redirect(`${origin}/recommend?error=missing-token`, { status: 303 })
  }

  const payload = await getPayloadClient()

  try {
    const result = await payload.resetPassword({
      collection: 'recommenders',
      data: { token, password: crypto.randomUUID() },
      overrideAccess: true,
    })

    const cookieStore = await cookies()
    cookieStore.set('payload-token', result.token ?? '', {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: RECOMMENDER_TOKEN_EXPIRATION_SECONDS,
    })

    return NextResponse.redirect(`${origin}/recommend/dashboard`, { status: 303 })
  } catch (err) {
    // Don't show the real error to the user (could be an expired/reused
    // token, but could also be something worth actually diagnosing) — but
    // don't swallow it entirely either.
    console.error('[recommend/verify] resetPassword failed:', err)
    return NextResponse.redirect(`${origin}/recommend?error=expired`, { status: 303 })
  }
}
