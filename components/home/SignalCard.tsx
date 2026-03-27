'use client'

import { useEffect, useState } from 'react'
import { useGuzzlrStore } from '@/lib/store'
import { getCycleState } from '@/lib/cycle-engine'
import { CycleState } from '@/lib/types'

export default function SignalCard() {
  const { car } = useGuzzlrStore()
  const [cycle, setCycle] = useState<CycleState | null>(null)

  useEffect(() => {
    setCycle(getCycleState('brisbane', car?.tankSizeLitres || 80))
  }, [car])

  if (!cycle) return null

  const signalClass = cycle.signal === 'fill_now' ? 'signal-fill-now' : cycle.signal === 'hold' ? 'signal-hold' : 'signal-wait'
  const color = cycle.signal === 'fill_now' ? '#4ade80' : cycle.signal === 'hold' ? '#888888' : '#ef4444'

  return (
    <div className={`card p-5 ${signalClass}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: color }} />
        <span className="font-headline text-xl font-extrabold tracking-tight" style={{ color }}>{cycle.signalLabel}</span>
      </div>
      <p className="text-text-secondary text-sm leading-relaxed mb-4">{cycle.signalDescription}</p>
      {car && (
        <div>
          <p className="text-text-muted text-xs uppercase tracking-widest">Potential savings</p>
          <p className="font-headline text-3xl font-extrabold mt-1" style={{ color }}>${cycle.personalSavingsDollars.toFixed(2)}</p>
        </div>
      )}
    </div>
  )
}
