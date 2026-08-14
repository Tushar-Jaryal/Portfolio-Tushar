import React from 'react'
import type { Project } from '@/payload-types'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <a href={`/projects/${project.slug}`} className="project-card">
      {project.tags && project.tags.length > 0 && (
        <div className="tag-row">
          {project.tags.slice(0, 3).map((tag, i) => (
            <span className="tag tag-cyan" key={i}>
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="blog-title">{project.name}</div>
      {project.summary && <p className="work-desc">{project.summary}</p>}
      <span className="blog-read">Case study →</span>
    </a>
  )
}
