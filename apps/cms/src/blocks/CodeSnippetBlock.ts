import type { Block } from 'payload'

/** Code block for rich text — mirrors the `codeBlock` object in Sanity's portableText.ts. */
export const CodeSnippetBlock: Block = {
  slug: 'codeBlock',
  labels: { singular: 'Code Block', plural: 'Code Blocks' },
  fields: [
    { name: 'language', type: 'text' },
    { name: 'code', type: 'textarea' },
  ],
}
