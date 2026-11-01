import React from 'react'
import LegalPage from '../components/LegalPage'
import PrivacyContent, { PRIVACY_TITLE, PRIVACY_UPDATED } from '../components/legal/PrivacyContent'

export const dynamic = 'force-dynamic'

export const metadata = { title: `${PRIVACY_TITLE} — Tushar Jaryal` }

export default function PrivacyPage() {
  return (
    <LegalPage title={PRIVACY_TITLE} updated={PRIVACY_UPDATED}>
      <PrivacyContent />
    </LegalPage>
  )
}
