import type { CollectionConfig } from 'payload'

const slugify = (val: string) =>
  val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'slug'] },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
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
  ],
}
