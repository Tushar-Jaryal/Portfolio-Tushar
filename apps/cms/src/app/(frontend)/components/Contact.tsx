import React from 'react'
import type { ContactPage, SiteSetting } from '@/payload-types'
import Reveal from './Reveal'

export default function Contact({
  contact,
  settings,
}: {
  contact: ContactPage
  settings: SiteSetting
}) {
  // Matched loosely (case/whitespace, or a mailto: href) since directLinks.label
  // is free text an editor could easily retype as "Email" and silently lose the CTA.
  const isEmail = (l: NonNullable<ContactPage['directLinks']>[number]) =>
    l.label?.trim().toUpperCase() === 'EMAIL' || l.href?.startsWith('mailto:')
  const emailLink = contact.directLinks?.find(isEmail)
  const otherLinks = contact.directLinks?.filter((l) => !isEmail(l)) ?? []

  return (
    <div id="contact" className="section contact-section">
      <div className="section-inner">
        <Reveal>
          <div className="eyebrow accent-cyan">{contact.eyebrow || 'CONTACT'}</div>
        </Reveal>
        <Reveal>
          <div className="contact-heading">{contact.heading}</div>
        </Reveal>
        {emailLink && (
          <Reveal>
            <a href={emailLink.href || `mailto:${emailLink.value}`} className="contact-email">
              {emailLink.value}
            </a>
          </Reveal>
        )}
        {otherLinks.length > 0 && (
          <Reveal>
            <div className="contact-links">
              {otherLinks.map((link, i) => (
                <a key={link.id ?? i} href={link.href || '#'}>
                  {link.label}
                </a>
              ))}
            </div>
          </Reveal>
        )}
        <div className="footer-bar">
          <span>{settings.copyright}</span>
          <span className="footer-legal">
            <a href="/privacy" data-legal="privacy">Privacy</a>
            <a href="/terms" data-legal="terms">Terms</a>
          </span>
          <span>{settings.footerLine}</span>
        </div>
      </div>
    </div>
  )
}
