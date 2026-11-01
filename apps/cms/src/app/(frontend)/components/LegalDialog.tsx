'use client'

import React, { useEffect, useRef, useState } from 'react'
import PrivacyContent, { PRIVACY_TITLE, PRIVACY_UPDATED } from './legal/PrivacyContent'
import TermsContent, { TERMS_TITLE, TERMS_UPDATED } from './legal/TermsContent'

type Doc = 'privacy' | 'terms'

const DOCS: Record<Doc, { title: string; updated: string; Content: () => React.ReactElement }> = {
  privacy: { title: PRIVACY_TITLE, updated: PRIVACY_UPDATED, Content: PrivacyContent },
  terms: { title: TERMS_TITLE, updated: TERMS_UPDATED, Content: TermsContent },
}

/**
 * Opens the privacy policy / terms in a modal over the current page. Any
 * link carrying data-legal="privacy|terms" (footer, cookie notice, links
 * inside the dialog itself) is intercepted here by one delegated listener,
 * so server components only need the attribute. The href still points at
 * the real page, so modifier/middle clicks and no-JS visitors navigate.
 */
export default function LegalDialog() {
  const [doc, setDoc] = useState<Doc | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[data-legal]')
      const target = link?.dataset.legal
      if (target !== 'privacy' && target !== 'terms') return
      e.preventDefault()
      setDoc(target)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !doc) return
    if (!dialog.open) dialog.showModal()
    dialog.querySelector('.legal-dialog-scroll')?.scrollTo(0, 0)
    // Lock the page behind the dialog only while it's open.
    const html = document.documentElement
    const prevOverflow = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prevOverflow
    }
  }, [doc])

  const close = () => {
    dialogRef.current?.close()
  }

  const current = doc ? DOCS[doc] : null

  return (
    <dialog
      ref={dialogRef}
      className="legal-dialog"
      aria-labelledby="legal-dialog-title"
      onClose={() => setDoc(null)}
      onClick={(e) => {
        // A click on the ::backdrop lands on the <dialog> element itself.
        if (e.target === e.currentTarget) close()
      }}
    >
      {current && (
        <div className="legal-dialog-inner">
          <div className="legal-dialog-head">
            <div>
              <h2 id="legal-dialog-title" className="legal-dialog-title">
                {current.title}
              </h2>
              <div className="legal-dialog-meta">Last updated: {current.updated}</div>
            </div>
            <button type="button" className="legal-dialog-close" aria-label="Close" onClick={close}>
              ×
            </button>
          </div>
          <div className="legal-dialog-scroll post-body">
            <current.Content />
          </div>
        </div>
      )}
    </dialog>
  )
}
