import React from 'react'
import LegalPage from '../components/LegalPage'
import TermsContent, { TERMS_TITLE, TERMS_UPDATED } from '../components/legal/TermsContent'

export const dynamic = 'force-dynamic'

export const metadata = { title: `${TERMS_TITLE} — Tushar Jaryal` }

export default function TermsPage() {
  return (
    <LegalPage title={TERMS_TITLE} updated={TERMS_UPDATED}>
      <TermsContent />
    </LegalPage>
  )
}
