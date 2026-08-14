// Replacement for the GROQ query exports. Each function replaces one old
// export (name noted below so the mapping is traceable): SITE_SETTINGS →
// getSiteSettings, HOME → getHome, ABOUT → getAbout, PROJECTS_PAGE →
// getProjectsPage, ALL_PROJECTS → getAllProjects, PROJECT_SLUGS →
// getProjectSlugs, PROJECT_BY_SLUG → getProjectBySlug, BLOG_PAGE →
// getBlogPage, ALL_POSTS → getAllPosts, POST_SLUGS → getPostSlugs,
// POST_BY_SLUG → getPostBySlug, RECOMMENDATIONS → getRecommendations,
// CONTACT → getContact. Shapes match the old GROQ projections field-for-field.
//
// Two fields in the original GROQ didn't map to anything in the schema
// (`tag` on featuredProjects, `meta` on blogPage.featured) — using the
// closest equivalent field, flagged inline below.

import { payloadFetch } from './cms'

export async function getSiteSettings() {
  return payloadFetch<any>('/globals/siteSettings', { depth: 2 })
}

export async function getHome() {
  const home = await payloadFetch<any>('/globals/homePage', { depth: 2 })
  if (!home) return null
  return {
    ...home,
    featuredProjects: (home.featuredProjects ?? []).map((p: any) => ({
      num: p.number,
      name: p.name,
      tag: p.category ?? null, // ⚠ see note above — using `category` in place of the nonexistent `tag`
      year: p.year,
      href: `/projects/${p.slug}`,
      desc: p.summary,
    })),
    featuredPosts: (home.featuredPosts ?? []).map((p: any) => ({
      date: p.date,
      title: p.title,
      excerpt: p.excerpt,
      meta: `${p.readingTime ?? ''} read · ${(p.tags ?? []).join(' · ')}`,
      href: `/blog/${p.slug}`,
    })),
  }
}

export async function getAbout() {
  return payloadFetch<any>('/globals/aboutPage', { depth: 2 })
}

export async function getProjectsPage() {
  return payloadFetch<any>('/globals/projectsPage', { depth: 1 })
}

export async function getAllProjects() {
  const res = await payloadFetch<{ docs: any[] }>('/projects', {
    depth: 1,
    params: { sort: 'order,-year', limit: 200 },
  })
  return (res?.docs ?? []).map((p) => ({
    num: p.number,
    name: p.name,
    slug: p.slug,
    year: p.year,
    category: p.category,
    tags: p.tags ?? [],
    shot: p.shotCaption,
    desc: p.summary,
    cover: p.cover,
  }))
}

export async function getProjectSlugs() {
  const res = await payloadFetch<{ docs: any[] }>('/projects', {
    depth: 0,
    params: { limit: 500 },
  })
  return (res?.docs ?? []).map((p) => p.slug).filter(Boolean)
}

export async function getProjectBySlug(slug: string) {
  const res = await payloadFetch<{ docs: any[] }>('/projects', {
    depth: 2,
    params: { 'where[slug][equals]': slug, limit: 1 },
  })
  const project = res?.docs?.[0]
  if (!project) return null

  const nextRes = await payloadFetch<{ docs: any[] }>('/projects', {
    depth: 0,
    params: {
      'where[order][greater_than]': project.order,
      sort: 'order',
      limit: 1,
    },
  })
  const next = nextRes?.docs?.[0]

  return {
    ...project,
    next: next ? { name: next.name, slug: next.slug } : null,
  }
}

export async function getBlogPage() {
  const page = await payloadFetch<any>('/globals/blogPage', { depth: 2 })
  if (!page) return null
  const featured = page.featured
    ? {
        title: page.featured.title,
        slug: page.featured.slug,
        excerpt: page.featured.excerpt,
        date: page.featured.date,
        readingTime: page.featured.readingTime,
        // ⚠ see note above — computing the same "Xmin read · tags" string
        // used elsewhere, in place of the nonexistent `meta` field.
        meta: `${page.featured.readingTime ?? ''} read · ${(page.featured.tags ?? []).join(' · ')}`,
        cover: page.featured.cover,
      }
    : null
  return { ...page, featured }
}

export async function getAllPosts() {
  const res = await payloadFetch<{ docs: any[] }>('/posts', {
    depth: 0,
    params: { sort: '-date', limit: 200 },
  })
  return (res?.docs ?? []).map((p) => ({
    title: p.title,
    slug: p.slug,
    date: p.date,
    readingTime: p.readingTime,
    excerpt: p.excerpt,
    tags: p.tags ?? [],
  }))
}

export async function getPostSlugs() {
  const res = await payloadFetch<{ docs: any[] }>('/posts', {
    depth: 0,
    params: { limit: 500 },
  })
  return (res?.docs ?? []).map((p) => p.slug).filter(Boolean)
}

export async function getPostBySlug(slug: string) {
  const res = await payloadFetch<{ docs: any[] }>('/posts', {
    depth: 2,
    params: { 'where[slug][equals]': slug, limit: 1 },
  })
  const post = res?.docs?.[0]
  if (!post) return null
  return {
    ...post,
    related: (post.related ?? []).map((r: any) => ({
      title: r.title,
      slug: r.slug,
      readingTime: r.readingTime,
    })),
  }
}

export async function getRecommendations() {
  return payloadFetch<any>('/globals/recommendationsPage', { depth: 1 })
}

export async function getContact() {
  return payloadFetch<any>('/globals/contactPage', { depth: 1 })
}
