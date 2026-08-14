import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../../lib/frame'

export async function POST(req: Request) {
  let body: { name?: string; email?: string; company?: string; _ts?: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }

  const { name, email, company, _ts } = body

  // Honeypot + submit-timing, same anti-spam pattern as the old contact form.
  if (company) return NextResponse.json({ ok: true })
  if (_ts && Date.now() - Number(_ts) < 2000) {
    return NextResponse.json({ ok: false, error: 'Too fast' }, { status: 422 })
  }

  if (!name || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'Please provide your name and a valid email.' }, { status: 422 })
  }

  const payload = await getPayloadClient()

  const existing = await payload.find({
    collection: 'recommenders',
    where: { email: { equals: email.toLowerCase().trim() } },
    limit: 1,
  })
  let recommender = existing.docs[0]

  if (!recommender) {
    recommender = await payload.create({
      collection: 'recommenders',
      // The value here doesn't matter — Recommenders' own beforeChange hook
      // always overwrites password on create with its own random value.
      data: { name, email: email.toLowerCase().trim(), password: crypto.randomUUID() },
      overrideAccess: true,
    })
  }

  try {
    await payload.forgotPassword({ collection: 'recommenders', data: { email: recommender.email } })
  } catch {
    // Recommenders' own beforeChange hook enforces the real cooldown (keyed
    // off a dedicated lastLinkRequestedAt field, not general-purpose
    // updatedAt — that would also trip on an unrelated profile-save). Same
    // generic response either way — don't leak timing/enumeration info.
  }

  return NextResponse.json({ ok: true })
}
