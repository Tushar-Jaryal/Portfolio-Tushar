import React from 'react'
import type { HomePage } from '@/payload-types'

export default function StatBand({ stats }: { stats: HomePage['stats'] }) {
  if (!stats || stats.length === 0) return null

  return (
    <div className="stat-band">
      {stats.map((s, i) => (
        <div className="stat" key={s.id ?? i}>
          <div className="stat-value">{s.value}</div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
