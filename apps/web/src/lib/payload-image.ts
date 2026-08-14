// Replacement for image.ts. Sanity's urlFor() built URLs from an image
// *reference*; Payload's upload docs already carry a resolved URL once
// populated (depth >= 1), so this is mostly a reshape rather than a fetch.

export type AccessibleImage = {
  image?: {
    url?: string
    alt?: string
    sizes?: Record<string, { url?: string; width?: number; height?: number }>
  } | null
  alt?: string
  caption?: string
  credit?: string
  decorative?: boolean
} | null

/**
 * Mirrors the old `urlFor(x)?.width(...).url()` null-safety contract:
 * returns null when there's no uploaded asset, so callers can render a
 * placeholder with `??` / optional chaining exactly as before.
 *
 *   mediaUrl(post.cover, "card") ?? "/placeholder.png"
 *
 * `size` is one of the imageSizes defined on the Media collection
 * (thumbnail/card/hero — see cms-app/src/collections/Media.ts).
 */
export function mediaUrl(source: AccessibleImage, size?: string): string | null {
  if (!source?.image) return null
  if (size && source.image.sizes?.[size]?.url) return source.image.sizes[size]!.url!
  return source.image.url ?? null
}

export function imageAlt(source: AccessibleImage): string {
  if (!source || source.decorative) return ''
  return source.alt ?? source.image?.alt ?? ''
}
