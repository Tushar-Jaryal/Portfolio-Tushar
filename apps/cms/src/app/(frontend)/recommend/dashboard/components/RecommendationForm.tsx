'use client'

import React, { useState } from 'react'
import type { Recommender, Recommendation } from '@/payload-types'
import { saveRecommendation } from '../actions'

export default function RecommendationForm({
  recommender,
  recommendation,
}: {
  recommender: Recommender
  recommendation?: Recommendation
}) {
  const [name, setName] = useState(recommender.name || '')
  const [role, setRole] = useState(recommender.role || '')
  const [relationship, setRelationship] = useState(recommender.relationship || '')
  const [quote, setQuote] = useState(recommendation?.quote || '')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving')
    setError('')
    const formData = new FormData()
    formData.set('name', name)
    formData.set('role', role)
    formData.set('relationship', relationship)
    formData.set('quote', quote)
    const result = await saveRecommendation(formData)
    if (!result.ok) {
      setError(result.error || 'Something went wrong.')
      setStatus('error')
      return
    }
    setStatus('saved')
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="field-group">
        <label className="field-label" htmlFor="name">
          Your name
        </label>
        <input
          id="name"
          className="field-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="role">
          Your role (shown under your name)
        </label>
        <input
          id="role"
          className="field-input"
          placeholder="e.g. Thesis Advisor, CCU"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="relationship">
          Relationship
        </label>
        <select
          id="relationship"
          className="field-select"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
        >
          <option value="">Select one</option>
          <option value="manager">Manager</option>
          <option value="professor">Professor</option>
          <option value="colleague">Colleague</option>
          <option value="client">Client</option>
          <option value="partner">Partner</option>
        </select>
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="quote">
          Your recommendation
        </label>
        <textarea
          id="quote"
          className="field-textarea"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn-primary" disabled={status === 'saving'}>
        {status === 'saving' ? 'Saving…' : 'Save recommendation'}
      </button>
      {status === 'saved' && (
        <div className="form-message is-success">Saved — it's back in the review queue.</div>
      )}
      {status === 'error' && <div className="form-message is-error">{error}</div>}
    </form>
  )
}
