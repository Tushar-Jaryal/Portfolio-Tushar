import React from 'react'
import type { Post } from '@/payload-types'

export default function BlogCard({ post }: { post: Post }) {
  return (
    <a href={`/blog/${post.slug}`} className="blog-card">
      <span className="blog-kicker">{post.kicker || post.tags?.[0]}</span>
      <div className="blog-title">{post.title}</div>
      <span className="blog-read">Read →</span>
    </a>
  )
}
