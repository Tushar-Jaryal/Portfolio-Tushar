import type { GlobalConfig } from 'payload'
import { accessibleImageField } from '../fields/accessibleImage'

/** Port of apps/studio/schemaTypes/documents/siteSettings.ts */
export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  admin: { group: 'Settings' },
  access: { read: () => true },
  fields: [
    { name: 'glyph', type: 'text', label: 'Logo glyph', defaultValue: '夏' },
    { name: 'brandName', type: 'text' },
    { name: 'brandSuffix', type: 'text' },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    { name: 'footerLine', type: 'text' },
    { name: 'copyright', type: 'text' },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'Default SEO',
      fields: [
        { name: 'title', type: 'text', label: 'Default title' },
        { name: 'description', type: 'textarea', label: 'Default description' },
        accessibleImageField('ogImage', { label: 'Default OG image' }),
      ],
    },
  ],
}
