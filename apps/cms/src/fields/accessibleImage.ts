import type { Field } from 'payload'

/**
 * Port of Sanity's `accessibleImage` object (apps/studio/schemaTypes/objects/accessibleImage.ts).
 * Sanity's `image` type stores the binary as a referenced `asset`; Payload's
 * equivalent is an `upload` field pointing at the `media` collection. This
 * group wraps that upload with the same accessibility metadata Sanity had:
 * alt (required unless decorative), caption, credit, decorative flag.
 *
 * Usage: accessibleImageField('cover'), accessibleImageField('portrait'), ...
 */
export function accessibleImageField(name: string, overrides: Partial<Field> = {}): Field {
  return {
    name,
    type: 'group',
    fields: [
      {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
      },
      {
        name: 'alt',
        type: 'text',
        admin: {
          description:
            'Describe the image for screen readers. Required unless decorative.',
        },
        validate: (value: unknown, { siblingData }: any) => {
          if (!siblingData?.image) return true // nothing uploaded — nothing to describe
          if (siblingData?.decorative) return true
          if (typeof value === 'string' && value.trim().length > 0) return true
          return 'Alt text is required (or mark the image as decorative).'
        },
      },
      {
        name: 'caption',
        type: 'text',
      },
      {
        name: 'credit',
        type: 'text',
      },
      {
        name: 'decorative',
        type: 'checkbox',
        defaultValue: false,
        label: 'Decorative (no alt needed)',
      },
    ],
    ...overrides,
  } as Field
}
