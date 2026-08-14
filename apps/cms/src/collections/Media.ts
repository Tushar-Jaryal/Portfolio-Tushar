import type { CollectionConfig } from 'payload'

/** Backs every `accessibleImageField()` upload relation and inline image block. */
export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 900 },
      { name: 'hero', width: 1920 },
    ],
    mimeTypes: ['image/*'],
  },
  access: { read: () => true },
  fields: [{ name: 'alt', type: 'text' }],
}
