import type { GlobalConfig } from 'payload'

/** Home page — "Neural Field" design: hero, stat band, featured work/blog. */
export const HomePage: GlobalConfig = {
  slug: 'homePage',
  admin: { group: 'Pages' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'eyebrowLabel',
      type: 'text',
      admin: { description: 'e.g. "TUSHAR JARYAL · INDUSTRIAL AI × INFRASTRUCTURE · CHIAYI, TW"' },
    },
    { name: 'heading', type: 'textarea', admin: { description: 'Hero H1, e.g. two lines separated by a line break.' } },
    { name: 'subtext', type: 'textarea', admin: { description: 'Paragraph under the hero heading.' } },
    {
      name: 'ctaButtons',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
        { name: 'primary', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Stat band',
      fields: [
        { name: 'value', type: 'text' },
        { name: 'label', type: 'text' },
      ],
    },
    {
      name: 'featuredProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      maxRows: 4,
    },
    {
      name: 'featuredPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      maxRows: 4,
    },
  ],
}
