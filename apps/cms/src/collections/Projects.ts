import type { CollectionConfig } from 'payload'
import { accessibleImageField } from '../fields/accessibleImage'
import { richTextField } from '../fields/richText'

const slugify = (val: string) =>
  val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/** Port of apps/studio/schemaTypes/documents/project.ts */
export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'year', 'category', 'order'] },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) => (value ? slugify(value) : data?.name ? slugify(data.name) : value),
        ],
      },
    },
    { name: 'number', type: 'text', admin: { description: 'e.g. "01"' } },
    { name: 'order', type: 'number', defaultValue: 0 },
    { name: 'year', type: 'text' },
    {
      name: 'category',
      type: 'select',
      options: ['ml infra', 'mlops', 'dev tools', 'oss'],
    },
    { name: 'tags', type: 'text', hasMany: true },
    { name: 'featured', type: 'checkbox', defaultValue: false, label: 'Featured on home' },
    accessibleImageField('cover', { label: 'Card cover' }),
    { name: 'shotCaption', type: 'text', admin: { description: 'Placeholder label shown over the thumbnail in the design.' } },
    { name: 'summary', type: 'textarea', label: 'Summary (card)' },
    {
      name: 'highlightRows',
      type: 'array',
      label: 'Detail rows (case-study card)',
      admin: { description: 'e.g. DATA / BASELINES / RIG, or STACK / SECURITY / NEXT' },
      fields: [
        { name: 'label', type: 'text' },
        { name: 'value', type: 'text' },
      ],
    },
    accessibleImageField('hero', { label: 'Hero image' }),
    { name: 'intro', type: 'textarea', label: 'Intro paragraph' },
    { name: 'role', type: 'text' },
    { name: 'status', type: 'text' },
    { name: 'stack', type: 'text', hasMany: true },
    {
      name: 'stats',
      type: 'array',
      fields: [
        { name: 'value', type: 'text' },
        { name: 'label', type: 'text' },
      ],
    },
    richTextField('problem', { label: 'The problem' }),
    richTextField('approach', { label: 'The approach' }),
    richTextField('outcome', { label: 'The outcome' }),
    {
      name: 'testimonial',
      type: 'group',
      fields: [
        { name: 'quote', type: 'textarea' },
        { name: 'attribution', type: 'text' },
      ],
    },
    {
      name: 'links',
      type: 'group',
      fields: [
        { name: 'source', type: 'text' },
        { name: 'demo', type: 'text' },
      ],
    },
  ],
}
