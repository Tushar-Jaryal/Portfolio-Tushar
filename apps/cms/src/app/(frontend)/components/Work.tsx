import React from 'react'
import type { Project } from '@/payload-types'
import Reveal from './Reveal'

export default function Work({ projects }: { projects: Project[] }) {
  if (!projects || projects.length === 0) return null

  return (
    <div id="work" className="work-wrap">
      <Reveal>
        <div className="eyebrow" style={{ marginBottom: 26 }}>
          SELECTED WORK — CASE STUDIES
        </div>
      </Reveal>
      {projects.map((project, i) => {
        const even = i % 2 === 0
        const cardAccent = even ? 'accent-a' : 'accent-b'
        const tagClass = even ? 'tag-violet' : 'tag-cyan'
        const detailAccent = even ? 'accent-cyan-label' : 'accent-violet-label'

        return (
          <Reveal key={project.id}>
            <div className={`work-card ${cardAccent}`}>
              <div className="work-main">
                {project.tags && project.tags.length > 0 && (
                  <div className="tag-row">
                    {project.tags.map((tag, ti) => (
                      <span className={`tag ${tagClass}`} key={ti}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="work-title">{project.name}</div>
                {project.summary && <p className="work-desc">{project.summary}</p>}
                <a href={`/projects/${project.slug}`} className="work-cta">
                  Full case study →
                </a>
              </div>
              {project.highlightRows && project.highlightRows.length > 0 && (
                <div className="work-detail">
                  {project.highlightRows.map((row, ri) => (
                    <div className={`detail-row ${detailAccent}`} key={row.id ?? ri}>
                      <span className="detail-label">{row.label} — </span>
                      {row.value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        )
      })}
    </div>
  )
}
