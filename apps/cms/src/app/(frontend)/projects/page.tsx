import React from 'react'
import Nav from '../components/Nav'
import Contact from '../components/Contact'
import ProjectCard from '../components/ProjectCard'
import { getPayloadClient } from '../lib/frame'
import { toNavItems } from '../lib/nav'

export const dynamic = 'force-dynamic'

export default async function ProjectsIndexPage() {
  const payload = await getPayloadClient()
  const [settings, contactPage, projectsPage, projects] = await Promise.all([
    payload.findGlobal({ slug: 'siteSettings' }),
    payload.findGlobal({ slug: 'contactPage' }),
    payload.findGlobal({ slug: 'projectsPage' }),
    payload.find({ collection: 'projects', sort: 'order', limit: 100 }),
  ])

  return (
    <>
      <Nav
        brandName={settings.brandName || 'tj'}
        brandSuffix={settings.brandSuffix || ''}
        navItems={toNavItems(settings)}
      />
      <div className="page-hero">
        <div className="eyebrow">{projectsPage.eyebrow || 'PROJECTS'}</div>
        <h1 className="page-heading">{projectsPage.heading || 'Selected work'}</h1>
        {projectsPage.intro && <p className="page-intro">{projectsPage.intro}</p>}
      </div>
      <div className="projects-grid">
        {projects.docs.length === 0 && <p className="post-empty">No projects yet.</p>}
        {projects.docs.map((project) => (
          <ProjectCard project={project} key={project.id} />
        ))}
      </div>
      <Contact contact={contactPage} settings={settings} />
    </>
  )
}
