'use client'

import { useEffect, useState } from 'react'
import { useGuzzlrStore } from '@/lib/store'
import { getCycleState } from '@/lib/cycle-engine'
import { CycleState } from '@/lib/types'

export default function SignalCard() {
  const { car } = useGuzzlrStore()
  const [cycle, setCycle] = useState<CycleState | null>(null)

  useEffect(() => {
    const state = getCycleState('brisbane', car?.tankSizeLitres || 80)
    setCycle(state)
  }, [car])

  if (!cycle) return null

  const signalClass = cycle.signal === 'fill_now' ? 'signal-fill-now' :
                      cycle.signal === 'hold' ? 'signal-hold' : 'signal-wait'

  const signalColor = cycle.signal === 'fill_now' ? '#16a34a' :
                      cycle.signal === 'hold' ? '#d97706' : '#dc2626'

  return (
    <div className={`puffy-card p-6 ${signalClass} overflow-hidden relative`}>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-4 h-4 rounded-full animate-pulse"
            style={{ backgroundColor: signalColor, boxShadow: `0 0 12px ${signalColor}40` }}
          />
          <h2 className="font-headline text-2xl font-extrabold" style={{ color: signalColor }}>
            {cycle.signalLabel}
          </h2>
        </div>

        <p className="text-on-surface-variant leading-relaxed mb-4">
          {cycle.signalDescription}
        </p>

        {car && (
          <>
            <p className="text-on-surface-variant text-sm">
              Filling your {car.make} {car.model} now saves you approximately
            </p>
            <p className="font-headline text-3xl font-extrabold mt-1 text-primary">
              ${cycle.personalSavingsDollars.toFixed(2)}
            </p>
          </>
        )}
      </div>
      {/* Abstract background shape */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
    </div>
  )
}
