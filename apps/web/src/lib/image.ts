import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID as string | undefined;
const dataset = (import.meta.env.PUBLIC_SANITY_DATASET as string) ?? "production";

const builder = projectId ? imageUrlBuilder({ projectId, dataset }) : null;

/**
 * Build an optimized image URL from a Sanity image reference.
 * Returns null when Sanity isn't configured OR when the image object has no
 * uploaded asset (GROQ returns `{asset: null, ...}` for empty image fields).
 * Callers use `urlFor(x)?.width(...).url()` — optional chaining short-circuits
 * the whole chain when this returns null, so the placeholder renders instead.
 *
 *   urlFor(post.cover)?.width(1200).auto("format").url()
 */
export function urlFor(source: SanityImageSource | null | undefined) {
  if (!builder || !source) return null;
  // An accessibleImage object with no uploaded asset → no URL.
  if (typeof source === "object" && "asset" in source && !(source as any).asset) {
    return null;
  }
  return builder.image(source);
}

/** Our reusable accessibleImage object shape (mirrors the Studio schema). */
export type AccessibleImage = {
  asset?: SanityImageSource;
  alt?: string;
  caption?: string;
  credit?: string;
  decorative?: boolean;
};
