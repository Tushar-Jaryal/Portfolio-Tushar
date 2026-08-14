import React from 'react'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Nav from '../../components/Nav'
import Contact from '../../components/Contact'
import { getPayloadClient } from '../../lib/frame'
import { toNavItems } from '../../lib/nav'
import type { Media } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const [settings, contactPage, result] = await Promise.all([
    payload.findGlobal({ slug: 'siteSettings' }),
    payload.findGlobal({ slug: 'contactPage' }),
    payload.find({ collection: 'projects', where: { slug: { equals: slug } }, limit: 1, depth: 1 }),
  ])
  const project = result.docs[0]
  if (!project) notFound()

  const heroImage = project.hero?.image && typeof project.hero.image === 'object' ? (project.hero.image as Media) : null

  return (
    <>
      <Nav
        brandName={settings.brandName || 'tj'}
        brandSuffix={settings.brandSuffix || ''}
        navItems={toNavItems(settings)}
      />
      <div className="project-header">
        <a href="/projects" className="back-link">
          ← All projects
        </a>
        {project.tags && project.tags.length > 0 && (
          <div className="tag-row" style={{ marginTop: 18 }}>
            {project.tags.map((tag, i) => (
              <span className="tag tag-cyan" key={i}>
                {tag}
              </span>
            ))}
          </div>
        )}
        <h1 className="post-title">{project.name}</h1>
        <div className="project-meta-row">
          {project.year && <span>{project.year}</span>}
          {project.role && <span>{project.role}</span>}
          {project.status && <span>{project.status}</span>}
        </div>
      </div>

      {heroImage?.url && (
        <img
          src={heroImage.url}
          alt={project.hero?.alt || project.name}
          className="project-hero-img"
        />
      )}

      {project.intro && <p className="project-intro">{project.intro}</p>}

      {project.stats && project.stats.length > 0 && (
        <div className="project-stats-row">
          {project.stats.map((stat, i) => (
            <div key={stat.id ?? i}>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {project.stack && project.stack.length > 0 && (
        <div className="project-stack-row">
          {project.stack.map((item, i) => (
            <span className="tag tag-violet" key={i}>
              {item}
            </span>
          ))}
        </div>
      )}

      {project.problem && (
        <div className="project-section">
          <div className="project-section-label">THE PROBLEM</div>
          <div className="post-body" style={{ padding: 0, maxWidth: 'none' }}>
            <RichText data={project.problem} />
          </div>
        </div>
      )}
      {project.approach && (
        <div className="project-section">
          <div className="project-section-label">THE APPROACH</div>
          <div className="post-body" style={{ padding: 0, maxWidth: 'none' }}>
            <RichText data={project.approach} />
          </div>
        </div>
      )}
      {project.outcome && (
        <div className="project-section">
          <div className="project-section-label">THE OUTCOME</div>
          <div className="post-body" style={{ padding: 0, maxWidth: 'none' }}>
            <RichText data={project.outcome} />
          </div>
        </div>
      )}

      {project.testimonial?.quote && (
        <div className="project-testimonial">
          <blockquote>
            &ldquo;{project.testimonial.quote}&rdquo;
            {project.testimonial.attribution && <cite>— {project.testimonial.attribution}</cite>}
          </blockquote>
        </div>
      )}

      {(project.links?.source || project.links?.demo) && (
        <div className="project-links-row">
          {project.links?.source && (
            <a href={project.links.source} className="btn-secondary">
              Source →
            </a>
          )}
          {project.links?.demo && (
            <a href={project.links.demo} className="btn-secondary">
              Live demo →
            </a>
          )}
        </div>
      )}

      <Contact contact={contactPage} settings={settings} />
    </>
  )
}
