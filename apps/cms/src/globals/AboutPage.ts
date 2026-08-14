import type { GlobalConfig } from 'payload'
import { richTextField } from '../fields/richText'

/** About section, Research & Publications, Stack (skills), Timeline — "Neural Field" design. */
export const AboutPage: GlobalConfig = {
  slug: 'aboutPage',
  admin: { group: 'Pages' },
  access: { read: () => true },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: '// about' },
    richTextField('bio'),
    {
      name: 'metaLines',
      type: 'array',
      label: 'Meta lines (base/now/before/speaks/also)',
      fields: [
        { name: 'key', type: 'text' },
        { name: 'value', type: 'text' },
      ],
    },
    {
      name: 'skillGroups',
      type: 'array',
      label: 'Stack (skills) groups',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'items', type: 'text', hasMany: true },
      ],
    },
    {
      name: 'timeline',
      type: 'array',
      label: 'Experience timeline',
      fields: [
        { name: 'span', type: 'text' },
        { name: 'role', type: 'text' },
        { name: 'org', type: 'text' },
        { name: 'note', type: 'textarea' },
      ],
    },
    {
      name: 'achievements',
      type: 'array',
      label: 'Research & Publications',
      fields: [
        { name: 'kind', type: 'select', options: ['publication', 'certification', 'award'] },
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'meta', type: 'text', label: 'Venue' },
        { name: 'year', type: 'text', admin: { description: 'e.g. "2024–2026"' } },
        { name: 'href', type: 'text', label: 'Link (optional)' },
      ],
    },
  ],
}
