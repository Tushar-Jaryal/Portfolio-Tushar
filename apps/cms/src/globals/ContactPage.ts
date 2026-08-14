import type { GlobalConfig } from 'payload'

/** Port of the `contactPage` type in apps/studio/schemaTypes/documents/simplePages.ts */
export const ContactPage: GlobalConfig = {
  slug: 'contactPage',
  admin: { group: 'Pages' },
  access: { read: () => true },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: '// contact' },
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    {
      name: 'directLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'value', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'availability',
      type: 'group',
      label: 'Availability block',
      fields: [
        { name: 'timezone', type: 'text' },
        { name: 'replies', type: 'text' },
        { name: 'openTo', type: 'text', hasMany: true, label: 'Open to' },
      ],
    },
  ],
}
