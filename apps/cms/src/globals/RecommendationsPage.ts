import type { GlobalConfig } from 'payload'

/** The actual quotes now live in the `recommendations` collection (real submissions + guest/placeholder entries). */
export const RecommendationsPage: GlobalConfig = {
  slug: 'recommendationsPage',
  admin: { group: 'Pages' },
  access: { read: () => true },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'RECOMMENDATIONS' },
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
  ],
}
