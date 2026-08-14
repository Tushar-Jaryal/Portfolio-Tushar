// Replacement for the @portabletext/to-html usage that rendered Sanity's
// portableText fields. Payload's Lexical richText serializes to a JSON tree;
// this converts it to HTML using the package's built-in converters.
//
// Covers paragraphs/headings/lists/links/bold/italic/code out of the box —
// that's the bulk of blog-post and case-study prose. The two custom blocks
// (inline `image`, `codeBlock` — see cms-app/src/blocks/) are NOT rendered
// by the default converters; once there's real authored content to look at
// in the admin, add entries for them to `converters` below (the package
// exports an `UploadHTMLConverter` you can adapt for the image block, and a
// codeBlock converter is a ~5 line template-string function). Left as a
// follow-up rather than guessed blind.
import { convertLexicalToHTML, defaultHTMLConverters } from '@payloadcms/richtext-lexical/html'

export function richTextToHTML(data: unknown): string {
  if (!data) return ''
  return convertLexicalToHTML({
    data: data as any,
    converters: defaultHTMLConverters,
  })
}
