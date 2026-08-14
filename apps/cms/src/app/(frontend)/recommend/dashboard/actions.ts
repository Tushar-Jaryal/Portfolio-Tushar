'use server'

import { revalidatePath } from 'next/cache'
import { getPayloadClient } from '../../lib/frame'
import { getLoggedInRecommender } from '../../lib/recommender'

export async function saveRecommendation(formData: FormData) {
  const recommender = await getLoggedInRecommender()
  if (!recommender) {
    return { ok: false, error: 'You need to sign in again.' }
  }

  const name = String(formData.get('name') || '').trim()
  const role = String(formData.get('role') || '').trim()
  const relationship = String(formData.get('relationship') || '')
  const quote = String(formData.get('quote') || '').trim()

  if (!quote) {
    return { ok: false, error: 'Please write a recommendation before saving.' }
  }

  const payload = await getPayloadClient()

  try {
    const [, existing] = await Promise.all([
      payload.update({
        collection: 'recommenders',
        // Omit rather than send '' — the select field rejects any value not
        // in its options list, including an empty string.
        data: relationship ? { name, role, relationship: relationship as never } : { name, role },
        id: recommender.id,
        user: recommender,
        overrideAccess: false,
      }),
      payload.find({
        collection: 'recommendations',
        where: { recommender: { equals: recommender.id } },
        limit: 1,
        overrideAccess: true,
      }),
    ])

    if (existing.docs[0]) {
      await payload.update({
        collection: 'recommendations',
        id: existing.docs[0].id,
        data: { quote },
        user: recommender,
        overrideAccess: false,
      })
    } else {
      await payload.create({
        collection: 'recommendations',
        data: { quote, recommender: recommender.id },
        user: recommender,
        overrideAccess: false,
      })
    }
  } catch {
    return { ok: false, error: 'Something went wrong saving your recommendation. Please try again.' }
  }

  revalidatePath('/recommend/dashboard')
  revalidatePath('/')
  return { ok: true }
}
