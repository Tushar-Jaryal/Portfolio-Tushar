import React from 'react'
import Nav from './Nav'
import Contact from './Contact'
import { getPayloadClient } from '../lib/frame'
import { toNavItems } from '../lib/nav'

/** Shared frame for /privacy and /terms — static legal text inside the usual Nav + footer. */
export default async function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: React.ReactNode
}) {
  const payload = await getPayloadClient()
  const [settings, contactPage] = await Promise.all([
    payload.findGlobal({ slug: 'siteSettings' }),
    payload.findGlobal({ slug: 'contactPage' }),
  ])

  return (
    <>
      <Nav
        brandName={settings.brandName || 'tj'}
        brandSuffix={settings.brandSuffix || ''}
        navItems={toNavItems(settings)}
      />
      <div className="post-header">
        <div className="eyebrow">LEGAL</div>
        <h1 className="post-title">{title}</h1>
        <div className="post-meta-row">Last updated: {updated}</div>
      </div>
      <article className="post-body legal-body">{children}</article>
      <Contact contact={contactPage} settings={settings} />
    </>
  )
}
