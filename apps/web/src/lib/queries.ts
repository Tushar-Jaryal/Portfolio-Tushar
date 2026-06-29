// All GROQ queries live here so they're reviewable in one place.
// Field names mirror the Sanity schemas in apps/studio/schemaTypes.

const imageFields = `asset, "alt": alt, caption, credit, decorative`;

export const SITE_SETTINGS = /* groq */ `
*[_type == "siteSettings"][0]{
  glyph, brandName, brandSuffix,
  navItems[]{label, href},
  footerLine, copyright,
  socialLinks[]{label, href},
  seo{title, description, ogImage{${imageFields}}}
}`;

export const HOME = /* groq */ `
*[_type == "homePage"][0]{
  available, availabilityText,
  name, kanjiSubtitle, tagline,
  typingWords,
  ctaButtons[]{label, href, primary},
  whoamiLines[]{key, value},
  "featuredProjects": featuredProjects[]->{
    "num": number, name, tag, year, "href": "/projects/" + slug.current, "desc": summary
  },
  "featuredPosts": featuredPosts[]->{
    "date": date, title, excerpt,
    "meta": readingTime + " read · " + array::join(tags, " · "),
    "href": "/blog/" + slug.current
  },
  stackItems,
  ctaHeading, ctaButtonLabel, ctaButtonHref
}`;

export const ABOUT = /* groq */ `
*[_type == "aboutPage"][0]{
  eyebrow, heading, bio, portrait{${imageFields}},
  metaLines[]{key, value},
  skillGroups[]{label, items},
  timeline[]{span, role, org, note},
  beliefs[]{n, h, t},
  achievements[]{kind, title, meta, year, href}
}`;

export const PROJECTS_PAGE = /* groq */ `
*[_type == "projectsPage"][0]{ eyebrow, heading, intro, filters }`;

export const ALL_PROJECTS = /* groq */ `
*[_type == "project"] | order(order asc, year desc){
  "num": number, name, "slug": slug.current, year, category,
  tags, "shot": shotCaption, "desc": summary, cover{${imageFields}}
}`;

export const PROJECT_SLUGS = /* groq */ `*[_type == "project" && defined(slug.current)].slug.current`;

export const PROJECT_BY_SLUG = /* groq */ `
*[_type == "project" && slug.current == $slug][0]{
  name, "slug": slug.current, year, role, status, stack,
  tags, summary, intro, hero{${imageFields}},
  stats[]{value, label},
  problem, approach, outcome,
  testimonial{quote, attribution},
  links{source, demo},
  "next": *[_type == "project" && order > ^.order] | order(order asc)[0]{ name, "slug": slug.current }
}`;

export const BLOG_PAGE = /* groq */ `
*[_type == "blogPage"][0]{
  eyebrow, heading, intro,
  "featured": featured->{ title, "slug": slug.current, excerpt, date, readingTime, "meta": meta, cover{${imageFields}} },
  newsletterHeading, newsletterSubtext
}`;

export const ALL_POSTS = /* groq */ `
*[_type == "post"] | order(date desc){
  title, "slug": slug.current, date, readingTime, excerpt, tags
}`;

export const POST_SLUGS = /* groq */ `*[_type == "post" && defined(slug.current)].slug.current`;

export const POST_BY_SLUG = /* groq */ `
*[_type == "post" && slug.current == $slug][0]{
  title, "slug": slug.current, date, readingTime, tags, excerpt,
  cover{${imageFields}}, body,
  "related": related[]->{ title, "slug": slug.current, readingTime }
}`;

export const RECOMMENDATIONS = /* groq */ `
*[_type == "recommendationsPage"][0]{
  eyebrow, heading, intro,
  recommendations[]{quote, name, role, initials, relationship}
}`;

export const CONTACT = /* groq */ `
*[_type == "contactPage"][0]{
  eyebrow, heading, intro,
  directLinks[]{label, value, href},
  availability{timezone, replies, openTo}
}`;
