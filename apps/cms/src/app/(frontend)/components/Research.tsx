import React from 'react'
import type { AboutPage } from '@/payload-types'
import Reveal from './Reveal'

export default function Research({ achievements }: { achievements: AboutPage['achievements'] }) {
  if (!achievements || achievements.length === 0) return null

  return (
    <div id="research" className="section">
      <div className="section-inner">
        <Reveal>
          <div className="section-header-row">
            <span className="eyebrow">RESEARCH &amp; PUBLICATIONS</span>
          </div>
        </Reveal>
        <div className="research-list">
          {achievements.map((item, i) => (
            <Reveal key={item.id ?? i}>
              <div className="research-row">
                <span className="research-num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div className="research-title">{item.title}</div>
                  {item.description && <div className="research-desc">{item.description}</div>}
                </div>
                <span className="research-venue">
                  {[item.meta, item.year].filter(Boolean).join(' · ')}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
