'use client'

import React, { useState } from 'react'

export default function RequestLinkForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submittedAt] = useState(() => Date.now())
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/recommend/api/request-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, _ts: submittedAt }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }
      setStatus('sent')
    } catch {
      setError('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="form-message is-success">
        Check your email — we sent a sign-in link to {email}. It's valid for 1 hour.
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="honeypot-field" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="name">
          Your name
        </label>
        <input
          id="name"
          className="field-input"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className="field-input"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <span className="field-hint">We'll email you a one-time sign-in link — no password to remember.</span>
      </div>
      <button type="submit" className="btn-primary" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send sign-in link'}
      </button>
      {status === 'error' && <div className="form-message is-error">{error}</div>}
    </form>
  )
}
