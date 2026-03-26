'use client'

import { useEffect, useState } from 'react'
import { useGuzzlrStore } from '@/lib/store'
import { getCycleState } from '@/lib/cycle-engine'
import { CycleState } from '@/lib/types'
import { SIGNAL_COLORS } from '@/lib/constants'

export default function SignalCard() {
  const { car } = useGuzzlrStore()
  const [cycle, setCycle] = useState<CycleState | null>(null)

  useEffect(() => {
    const state = getCycleState('brisbane', car?.tankSizeLitres || 80)
    setCycle(state)
  }, [car])

  if (!cycle) return null

  const color = SIGNAL_COLORS[cycle.signal]
  const signalClass = cycle.signal === 'fill_now' ? 'signal-fill-now' :
                      cycle.signal === 'hold' ? 'signal-hold' : 'signal-wait'

  return (
    <div className={`glass-card p-6 ${signalClass} transition-all duration-500`}>
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-4 h-4 rounded-full animate-pulse"
          style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}` }}
        />
        <h2 className="font-heading text-2xl font-bold" style={{ color }}>
          {cycle.signalLabel}
        </h2>
      </div>

      <p className="text-text-secondary leading-relaxed mb-4">
        {cycle.signalDescription}
      </p>

      {car && (
        <div className="flex items-baseline gap-2">
          <span className="text-text-secondary">Filling your {car.make} {car.model} now saves you approximately</span>
        </div>
      )}
      {car && (
        <p className="font-heading text-3xl font-bold mt-1" style={{ color }}>
          ${cycle.personalSavingsDollars.toFixed(2)}
        </p>
      )}
    </div>
  )
}
