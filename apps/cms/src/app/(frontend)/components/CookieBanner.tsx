'use client'

import React, { useEffect, useState } from 'react'

const COOKIE_NAME = 'cookie_notice'

/**
 * Informational notice only — the site sets no non-essential cookies, so
 * there is nothing to opt in or out of. Hidden until mount so the server
 * render (which can't see document.cookie) never flashes it for people who
 * already dismissed it.
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = document.cookie.split('; ').some((c) => c.startsWith(`${COOKIE_NAME}=`))
    setVisible(!dismissed)
  }, [])

  if (!visible) return null

  const dismiss = () => {
    document.cookie = `${COOKIE_NAME}=1; Max-Age=31536000; Path=/; SameSite=Lax; Secure`
    setVisible(false)
  }

  return (
    <div className="cookie-banner" role="region" aria-label="Cookie notice">
      <p className="cookie-banner-text">
        <strong>Cookies on this site.</strong> This site only uses cookies that are needed for it to
        work: keeping signed-in recommenders logged in, and Cloudflare security checks. There is no
        tracking or analytics. <a href="/privacy">Privacy Policy</a>
      </p>
      <button type="button" className="cookie-banner-button" onClick={dismiss}>
        OK
      </button>
    </div>
  )
}
