import React from 'react'
import type { AboutPage } from '@/payload-types'
import Reveal from './Reveal'

export default function Skills({ skillGroups }: { skillGroups: AboutPage['skillGroups'] }) {
  if (!skillGroups || skillGroups.length === 0) return null

  return (
    <div id="skills" className="section">
      <div className="section-inner">
        <Reveal>
          <div className="eyebrow" style={{ marginBottom: 30 }}>
            STACK
          </div>
        </Reveal>
        <Reveal>
          <div className="skills-grid">
            {skillGroups.map((group, i) => (
              <div className="skill-card" key={group.id ?? i}>
                <div className={`skill-label ${i % 2 === 1 ? 'accent-violet' : 'accent-cyan'}`}>
                  {group.label}
                </div>
                <div className="skill-items">
                  {(group.items ?? []).map((item, ii) => (
                    <React.Fragment key={ii}>
                      {item}
                      {ii < (group.items?.length ?? 0) - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  )
}
