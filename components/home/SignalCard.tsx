'use client'

import { useEffect, useState } from 'react'
import { useGuzzlrStore } from '@/lib/store'
import { getCycleState } from '@/lib/cycle-engine'
import { CycleState } from '@/lib/types'

function formatUpdatedTime(): string {
  const now = new Date()
  const h = now.getHours()
  const m = now.getMinutes().toString().padStart(2, '0')
  const ampm = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 || 12
  return `${h12}:${m} ${ampm}`
}

export default function SignalCard() {
  const { car } = useGuzzlrStore()
  const [cycle, setCycle] = useState<CycleState | null>(null)
  const [updatedAt] = useState(() => formatUpdatedTime())

  useEffect(() => {
    setCycle(getCycleState('brisbane', car?.tankSizeLitres || 80))
  }, [car])

  if (!cycle) return null

  const isUrgent = cycle.signal === 'fill_now' || cycle.signal === 'fill_soon'
  const signalClass = cycle.signal === 'fill_now' ? 'signal-fill-now' : cycle.signal === 'hold' ? 'signal-hold' : 'signal-wait'
  const color = cycle.signal === 'fill_now' ? '#34C759' : cycle.signal === 'hold' ? '#86868b' : '#FF3B30'

  return (
    <div className={`card p-5 ${signalClass} transition-all`} style={isUrgent ? { borderLeft: `3px solid ${color}` } : undefined}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="relative flex items-center justify-center">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <div className="absolute w-3 h-3 rounded-full animate-pulse-dot" style={{ backgroundColor: color }} />
        </div>
        <span className="text-[17px] font-bold" style={{ color }}>{cycle.signalLabel}</span>
      </div>
      <p className={`text-[15px] leading-relaxed mb-4 ${isUrgent ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>{cycle.signalDescription}</p>
      {car && (
        <div>
          <p className="text-text-muted text-[13px]">Filling your {car.make} {car.model} now saves approximately</p>
          <p className="text-[32px] font-bold tracking-tight mt-1" style={{ color }}>${cycle.personalSavingsDollars.toFixed(2)}</p>
        </div>
      )}
      <p className="text-text-muted text-[11px] mt-3">Last updated {updatedAt}</p>
    </div>
  )
}
