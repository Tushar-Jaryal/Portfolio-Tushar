import React from 'react'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Nav from '../../components/Nav'
import Contact from '../../components/Contact'
import { getPayloadClient } from '../../lib/frame'
import { toNavItems } from '../../lib/nav'

export const dynamic = 'force-dynamic'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const [settings, contactPage, result] = await Promise.all([
    payload.findGlobal({ slug: 'siteSettings' }),
    payload.findGlobal({ slug: 'contactPage' }),
    payload.find({ collection: 'posts', where: { slug: { equals: slug } }, limit: 1 }),
  ])
  const post = result.docs[0]
  if (!post) notFound()

  const date = post.date
    ? new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <>
      <Nav
        brandName={settings.brandName || 'tj'}
        brandSuffix={settings.brandSuffix || ''}
        navItems={toNavItems(settings)}
      />
      <div className="post-header">
        <a href="/blog" className="back-link">
          ← All posts
        </a>
        <div className="eyebrow" style={{ marginTop: 18 }}>
          {post.kicker || post.tags?.[0]}
        </div>
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta-row">
          {date && <span>{date}</span>}
          {post.readingTime && <span>{post.readingTime}</span>}
        </div>
      </div>
      <div className="post-body">
        {post.body ? <RichText data={post.body} /> : <p className="post-empty">Coming soon.</p>}
      </div>
      <Contact contact={contactPage} settings={settings} />
    </>
  )
}
