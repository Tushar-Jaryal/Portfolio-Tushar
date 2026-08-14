import React from 'react'
import type { RecommendationsPage, Recommendation } from '@/payload-types'
import Reveal from './Reveal'

export default function Recommendations({
  page,
  recommendations,
}: {
  page: RecommendationsPage
  recommendations: Recommendation[]
}) {
  if (!recommendations || recommendations.length === 0) return null

  return (
    <div id="recs" className="section recs-section">
      <div className="section-inner">
        <div>
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 26 }}>
              {page.eyebrow || 'RECOMMENDATIONS'}
            </div>
          </Reveal>
          {recommendations.map((rec, i) => {
            const recommender = typeof rec.recommender === 'object' ? rec.recommender : null
            const name = recommender?.name || rec.guestName
            const role = recommender?.role || rec.guestRole
            return (
              <Reveal key={rec.id ?? i}>
                <div className="rec-item">
                  <p className="rec-quote">&ldquo;{rec.quote}&rdquo;</p>
                  <div className="rec-attr">— {[name, role].filter(Boolean).join(' · ')}</div>
                </div>
              </Reveal>
            )
          })}
        </div>
        <Reveal>
          <div className="rec-cta-card">
            <div className="rec-cta-title">Worked with me?</div>
            <p className="rec-cta-text">
              Professors and employers sign in with a magic link to write a recommendation. Entries
              are reviewed before publishing — powered by a self-hosted, open-source CMS.
            </p>
            <a href="/recommend" className="rec-cta-btn">
              Sign in to recommend →
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
