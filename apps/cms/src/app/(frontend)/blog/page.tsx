import React from 'react'
import Nav from '../components/Nav'
import Contact from '../components/Contact'
import BlogCard from '../components/BlogCard'
import { getPayloadClient } from '../lib/frame'
import { toNavItems } from '../lib/nav'

export const dynamic = 'force-dynamic'

export default async function BlogIndexPage() {
  const payload = await getPayloadClient()
  const [settings, contactPage, blogPage, posts] = await Promise.all([
    payload.findGlobal({ slug: 'siteSettings' }),
    payload.findGlobal({ slug: 'contactPage' }),
    payload.findGlobal({ slug: 'blogPage' }),
    payload.find({ collection: 'posts', sort: '-date', limit: 100 }),
  ])

  return (
    <>
      <Nav
        brandName={settings.brandName || 'tj'}
        brandSuffix={settings.brandSuffix || ''}
        navItems={toNavItems(settings)}
      />
      <div className="page-hero">
        <div className="eyebrow">{blogPage.eyebrow || 'BLOG'}</div>
        <h1 className="page-heading">{blogPage.heading || 'From the blog'}</h1>
        {blogPage.intro && <p className="page-intro">{blogPage.intro}</p>}
      </div>
      <div className="blog-index-grid">
        {posts.docs.length === 0 && <p className="post-empty">No posts yet.</p>}
        {posts.docs.map((post) => (
          <BlogCard post={post} key={post.id} />
        ))}
      </div>
      <Contact contact={contactPage} settings={settings} />
    </>
  )
}
