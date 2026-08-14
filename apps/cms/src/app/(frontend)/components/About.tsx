import React from 'react'
import type { AboutPage } from '@/payload-types'
import { richTextToParagraphs } from '../lib/richText'
import Reveal from './Reveal'

export default function About({ about }: { about: AboutPage }) {
  const [lead, ...rest] = richTextToParagraphs(about.bio)

  return (
    <Reveal>
      <div className="about-grid">
        <div>
          {about.eyebrow && <div className="eyebrow" style={{ marginBottom: 22 }}>{about.eyebrow}</div>}
          {lead && <p className="about-lead">{lead}</p>}
          {rest.map((p, i) => (
            <p className="about-sub" key={i}>
              {p}
            </p>
          ))}
        </div>
        {about.metaLines && about.metaLines.length > 0 && (
          <div className="meta-card">
            {about.metaLines.map((m, i) => (
              <div className="meta-row" key={m.id ?? i}>
                <span className="meta-key">{m.key}</span>
                <span className="meta-val">{m.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Reveal>
  )
}
