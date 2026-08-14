import { headers as getHeaders } from 'next/headers.js'
import type { Recommender } from '@/payload-types'
import { getPayloadClient } from './frame'

/** Resolves the logged-in Recommender from the request's auth cookie, or null. */
export async function getLoggedInRecommender(): Promise<Recommender | null> {
  const payload = await getPayloadClient()
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })
  if (!user || user.collection !== 'recommenders') return null
  return user as Recommender
}
