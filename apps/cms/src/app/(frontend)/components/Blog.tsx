import React from 'react'
import type { Post } from '@/payload-types'
import Reveal from './Reveal'
import BlogCard from './BlogCard'

export default function Blog({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) return null

  return (
    <div id="blog" className="section">
      <div className="section-inner">
        <Reveal>
          <div className="section-header-row">
            <span className="eyebrow">FROM THE BLOG</span>
            <a href="/blog" className="blog-read">
              ALL POSTS →
            </a>
          </div>
        </Reveal>
        <Reveal>
          <div className="blog-grid">
            {posts.map((post) => (
              <BlogCard post={post} key={post.id} />
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  )
}
