import type { GlobalConfig } from 'payload'

/** Port of the `blogPage` type in apps/studio/schemaTypes/documents/simplePages.ts */
export const BlogPage: GlobalConfig = {
  slug: 'blogPage',
  admin: { group: 'Pages' },
  access: { read: () => true },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: '// blog' },
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    { name: 'featured', type: 'relationship', relationTo: 'posts', label: 'Featured post' },
    { name: 'newsletterHeading', type: 'text' },
    { name: 'newsletterSubtext', type: 'text' },
  ],
}
