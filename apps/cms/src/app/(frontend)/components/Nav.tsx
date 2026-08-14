'use client'

import React, { useState } from 'react'

/** These section ids only exist on the homepage, so links to them must resolve there from any page. */
function homeHref(href: string): string {
  return href.startsWith('#') ? `/${href}` : href
}

export default function Nav({
  brandName,
  brandSuffix,
  navItems,
}: {
  brandName: string
  brandSuffix: string
  navItems: { label: string; href: string }[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <nav className="nav">
      <div className="nav-row">
        <a href="/" className="nav-brand">
          {brandName}
          <span className="accent-cyan">{brandSuffix}</span>
        </a>
        <div className="nav-desktop">
          {navItems.map((item) => (
            <a key={item.href} href={homeHref(item.href)} className="nav-link">
              {item.label}
            </a>
          ))}
          <a href="/#contact" className="nav-contact">
            Contact
          </a>
        </div>
        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      {open && (
        <div className="nav-mobile-menu">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={homeHref(item.href)}
              className="nav-mobile-link"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a href="/#contact" className="nav-mobile-link" onClick={() => setOpen(false)}>
            Contact
          </a>
        </div>
      )}
    </nav>
  )
}
