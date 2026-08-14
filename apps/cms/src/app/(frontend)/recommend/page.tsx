import React from 'react'
import { redirect } from 'next/navigation'
import Nav from '../components/Nav'
import Contact from '../components/Contact'
import RequestLinkForm from './components/RequestLinkForm'
import { getPayloadClient } from '../lib/frame'
import { toNavItems } from '../lib/nav'
import { getLoggedInRecommender } from '../lib/recommender'

export const dynamic = 'force-dynamic'

const ERROR_MESSAGES: Record<string, string> = {
  expired: 'That link has expired or was already used — request a new one below.',
  'missing-token': "That link didn't include a valid token — request a new one below.",
}

export default async function RecommendPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const recommender = await getLoggedInRecommender()
  if (recommender) redirect('/recommend/dashboard')

  const { error } = await searchParams
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
      <div className="recommend-wrap">
        <div className="eyebrow">SIGN IN TO RECOMMEND</div>
        <h1 className="page-heading" style={{ fontSize: 36 }}>
          Write a recommendation
        </h1>
        <p className="recommend-intro">
          Worked with me as a professor, manager, or client? Sign in below to write (or edit) your
          recommendation. Entries are reviewed before they go live.
        </p>
        {error && <div className="form-message is-error" style={{ marginBottom: 20 }}>{ERROR_MESSAGES[error] || 'Something went wrong.'}</div>}
        <RequestLinkForm />
      </div>
      <Contact contact={contactPage} settings={settings} />
    </>
  )
}
