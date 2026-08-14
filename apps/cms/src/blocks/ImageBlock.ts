import type { Block } from 'payload'

/** Inline image block for rich text — mirrors Sanity's `accessibleImage` array member inside portableText.ts. */
export const ImageBlock: Block = {
  slug: 'image',
  labels: { singular: 'Image', plural: 'Images' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'alt',
      type: 'text',
      validate: (value: unknown, { siblingData }: any) => {
        if (siblingData?.decorative) return true
        if (typeof value === 'string' && value.trim().length > 0) return true
        return 'Alt text is required (or mark the image as decorative).'
      },
    },
    { name: 'caption', type: 'text' },
    { name: 'credit', type: 'text' },
    { name: 'decorative', type: 'checkbox', defaultValue: false },
  ],
}
