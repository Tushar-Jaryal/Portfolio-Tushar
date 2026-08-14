import React from 'react'
import type { HomePage } from '@/payload-types'
import Hero3D from './Hero3D'

export default function Hero({ home }: { home: HomePage }) {
  const headingLines = (home.heading ?? '').split('\n')

  return (
    <div className="hero">
      <Hero3D />
      <div className="hero-copy">
        {home.eyebrowLabel && <div className="hero-eyebrow">{home.eyebrowLabel}</div>}
        {home.heading && (
          <h1 className="hero-heading">
            {headingLines.map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < headingLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
        )}
        {home.subtext && <p className="hero-sub">{home.subtext}</p>}
        {home.ctaButtons && home.ctaButtons.length > 0 && (
          <div className="hero-ctas">
            {home.ctaButtons.map((btn, i) => (
              <a
                key={btn.id ?? i}
                href={btn.href || '#'}
                className={btn.primary ? 'btn-primary' : 'btn-secondary'}
              >
                {btn.label}
              </a>
            ))}
          </div>
        )}
      </div>
      <div className="hero-scroll-hint">SCROLL — THE NETWORK FOLLOWS ↓</div>
    </div>
  )
}
