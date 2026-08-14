import React from 'react'
import type { AboutPage } from '@/payload-types'
import Reveal from './Reveal'

function dotStyle(i: number, isLast: boolean): React.CSSProperties {
  if (i === 0) return { background: 'var(--cyan)' }
  if (isLast) return { border: '1px solid rgba(255,255,255,.35)' }
  return i % 2 === 1
    ? { border: '1px solid rgba(103,232,249,.7)' }
    : { border: '1px solid rgba(167,139,250,.7)' }
}

export default function Timeline({ timeline }: { timeline: AboutPage['timeline'] }) {
  if (!timeline || timeline.length === 0) return null

  return (
    <div id="timeline" className="section">
      <div className="section-inner">
        <Reveal>
          <div className="eyebrow" style={{ marginBottom: 34 }}>
            TIMELINE
          </div>
        </Reveal>
        {timeline.map((entry, i) => {
          const isLast = i === timeline.length - 1
          return (
            <Reveal key={entry.id ?? i}>
              <div className={`timeline-row ${i === 0 ? 'is-current' : ''}`}>
                <span className="timeline-span">{entry.span}</span>
                <div className="timeline-rail">
                  <span className="timeline-dot hollow" style={dotStyle(i, isLast)} />
                  {!isLast && <span className="timeline-line" />}
                </div>
                <div className="timeline-body">
                  <div className="timeline-role">{entry.role}</div>
                  {entry.note && <div className="timeline-note">{entry.note}</div>}
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
