import React from 'react'
import { redirect } from 'next/navigation'
import Nav from '../../components/Nav'
import Contact from '../../components/Contact'
import RecommendationForm from './components/RecommendationForm'
import LogoutButton from '../components/LogoutButton'
import { getPayloadClient } from '../../lib/frame'
import { toNavItems } from '../../lib/nav'
import { getLoggedInRecommender } from '../../lib/recommender'

export const dynamic = 'force-dynamic'

export default async function RecommendDashboardPage() {
  const recommender = await getLoggedInRecommender()
  if (!recommender) redirect('/recommend')

  const payload = await getPayloadClient()
  const [settings, contactPage, existing] = await Promise.all([
    payload.findGlobal({ slug: 'siteSettings' }),
    payload.findGlobal({ slug: 'contactPage' }),
    payload.find({
      collection: 'recommendations',
      where: { recommender: { equals: recommender.id } },
      limit: 1,
      overrideAccess: true,
    }),
  ])
  const recommendation = existing.docs[0]

  return (
    <>
      <Nav
        brandName={settings.brandName || 'tj'}
        brandSuffix={settings.brandSuffix || ''}
        navItems={toNavItems(settings)}
      />
      <div className="recommend-wrap">
        <div className="eyebrow">SIGNED IN AS {recommender.email.toUpperCase()}</div>
        <h1 className="page-heading" style={{ fontSize: 36 }}>
          {recommendation ? 'Edit your recommendation' : 'Write your recommendation'}
        </h1>
        {recommendation && (
          <span className={`status-badge ${recommendation.status === 'approved' ? 'is-approved' : 'is-pending'}`}>
            {recommendation.status === 'approved' ? 'Live on the site' : 'Pending review'}
          </span>
        )}
        <p className="recommend-intro">
          {recommendation
            ? 'Editing sends this back for review before it goes live again.'
            : "This won't be published until it's reviewed."}
        </p>
        <RecommendationForm recommender={recommender} recommendation={recommendation} />
        <div style={{ marginTop: 24 }}>
          <LogoutButton />
        </div>
      </div>
      <Contact contact={contactPage} settings={settings} />
    </>
  )
}
