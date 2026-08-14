import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Project, Post } from '@/payload-types'

import Nav from './components/Nav'
import Hero from './components/Hero'
import StatBand from './components/StatBand'
import About from './components/About'
import Work from './components/Work'
import Research from './components/Research'
import Skills from './components/Skills'
import Timeline from './components/Timeline'
import Recommendations from './components/Recommendations'
import Blog from './components/Blog'
import Contact from './components/Contact'
import { toNavItems } from './lib/nav'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const [settings, home, about, recommendationsPage, recommendations, contactPage] = await Promise.all([
    payload.findGlobal({ slug: 'siteSettings' }),
    payload.findGlobal({ slug: 'homePage', depth: 2 }),
    payload.findGlobal({ slug: 'aboutPage' }),
    payload.findGlobal({ slug: 'recommendationsPage' }),
    payload.find({ collection: 'recommendations', where: { status: { equals: 'approved' } }, depth: 1 }),
    payload.findGlobal({ slug: 'contactPage' }),
  ])

  const featuredProjects = (home.featuredProjects ?? []).filter(
    (p): p is Project => typeof p === 'object',
  )
  const featuredPosts = (home.featuredPosts ?? []).filter((p): p is Post => typeof p === 'object')

  return (
    <>
      <Nav
        brandName={settings.brandName || 'tj'}
        brandSuffix={settings.brandSuffix || ''}
        navItems={toNavItems(settings)}
      />
      <Hero home={home} />
      <StatBand stats={home.stats} />
      <About about={about} />
      <Work projects={featuredProjects} />
      <Research achievements={about.achievements} />
      <Skills skillGroups={about.skillGroups} />
      <Timeline timeline={about.timeline} />
      <Recommendations page={recommendationsPage} recommendations={recommendations.docs} />
      <Blog posts={featuredPosts} />
      <Contact contact={contactPage} settings={settings} />
    </>
  )
}
