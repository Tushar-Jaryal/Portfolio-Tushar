import type { CollectionConfig, Where } from 'payload'

/**
 * Replaces the old hand-curated `recommendations` array on the
 * RecommendationsPage global. Real submissions come from a logged-in
 * Recommender (see the beforeChange hook below); `guestName`/`guestRole`
 * back the two seeded placeholder quotes that have no real login attached.
 */
export const Recommendations: CollectionConfig = {
  slug: 'recommendations',
  admin: { useAsTitle: 'quote', defaultColumns: ['quote', 'status', 'recommender', 'guestName'] },
  access: {
    read: ({ req }): boolean | Where => {
      if (req.user?.collection === 'users') return true
      if (req.user?.collection === 'recommenders') {
        return { or: [{ status: { equals: 'approved' } }, { recommender: { equals: req.user.id } }] }
      }
      return { status: { equals: 'approved' } }
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => {
      if (req.user?.collection === 'users') return true
      if (req.user?.collection === 'recommenders') return { recommender: { equals: req.user.id } }
      return false
    },
    delete: ({ req }) => req.user?.collection === 'users',
  },
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        // A recommender can only ever write their own doc, and any self-edit
        // — including to an already-approved quote — must be re-reviewed
        // before it goes live again.
        if (req.user?.collection === 'recommenders') {
          data.recommender = req.user.id
          data.status = 'pending'
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'recommender',
      type: 'relationship',
      relationTo: 'recommenders',
      unique: true,
      admin: { description: 'Blank for admin-entered quotes with no real login (use guestName/guestRole instead).' },
    },
    { name: 'quote', type: 'textarea', required: true },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'approved', 'rejected'],
      defaultValue: 'pending',
      admin: { description: 'Only approved quotes show on the site.' },
    },
    { name: 'guestName', type: 'text', label: 'Display name (if no recommender login)' },
    { name: 'guestRole', type: 'text', label: 'Display role (if no recommender login)' },
  ],
}
