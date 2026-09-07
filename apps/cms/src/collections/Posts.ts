import type { CollectionConfig } from 'payload'
import { accessibleImageField } from '../fields/accessibleImage'
import { richTextField } from '../fields/richText'

const slugify = (val: string) =>
  val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/** Port of apps/studio/schemaTypes/documents/post.ts */
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'date', 'featured'] },
  access: { read: () => true },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) => (value ? slugify(value) : data?.title ? slugify(data.title) : value),
        ],
      },
    },
    { name: 'date', type: 'date', required: true },
    { name: 'readingTime', type: 'text', admin: { description: 'e.g. "8 min"' } },
    { name: 'tags', type: 'text', hasMany: true },
    {
      name: 'kicker',
      type: 'text',
      admin: { description: 'Teaser eyebrow, e.g. "DRAFT · RESEARCH". Falls back to tags[0] if blank.' },
    },
    { name: 'excerpt', type: 'textarea' },
    { name: 'featured', type: 'checkbox', defaultValue: false, label: 'Featured (blog hero)' },
    accessibleImageField('cover', { label: 'Cover image' }),
    richTextField('body'),
    {
      name: 'related',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      maxRows: 3,
      label: 'Related posts',
    },
  ],
}
