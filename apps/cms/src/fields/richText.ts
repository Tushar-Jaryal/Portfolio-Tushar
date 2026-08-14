import type { Field } from 'payload'
import {
  BlockquoteFeature,
  BlocksFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { ImageBlock } from '../blocks/ImageBlock'
import { CodeSnippetBlock } from '../blocks/CodeSnippetBlock'

/**
 * Port of Sanity's `portableText` object (apps/studio/schemaTypes/objects/portableText.ts):
 * normal/h2/h3/blockquote styles, bullet + numbered lists, bold/italic/code
 * marks, link annotation, plus inline image and code-block members.
 */
export function richTextField(name: string, overrides: Partial<Field> = {}): Field {
  return {
    name,
    type: 'richText',
    editor: lexicalEditor({
      features: ({ defaultFeatures }) => [
        ...defaultFeatures.filter(
          (f) => !['heading', 'blockquote', 'unorderedList', 'orderedList'].includes(f.key),
        ),
        HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
        BlockquoteFeature(),
        UnorderedListFeature(),
        OrderedListFeature(),
        BoldFeature(),
        ItalicFeature(),
        InlineCodeFeature(),
        LinkFeature(),
        BlocksFeature({ blocks: [ImageBlock, CodeSnippetBlock] }),
        FixedToolbarFeature(),
        InlineToolbarFeature(),
      ],
    }),
    ...overrides,
  } as Field
}
