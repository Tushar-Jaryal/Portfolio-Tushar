'use client'

import React from 'react'

export default function LogoutButton() {
  async function onLogout() {
    await fetch('/api/recommenders/logout', { method: 'POST', credentials: 'include' })
    window.location.href = '/recommend'
  }

  return (
    <button type="button" className="btn-secondary" onClick={onLogout}>
      Log out
    </button>
  )
}
