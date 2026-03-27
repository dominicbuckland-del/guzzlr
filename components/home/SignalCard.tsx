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
  const color = cycle.signal === 'fill_now' ? '#34C759' : cycle.signal === 'hold' ? '#86868b' : '#FF3B30'

  return (
    <div className={`card p-5 ${signalClass}`}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[17px] font-bold" style={{ color }}>{cycle.signalLabel}</span>
      </div>
      <p className="text-text-secondary text-[15px] leading-relaxed mb-4">{cycle.signalDescription}</p>
      {car && (
        <div>
          <p className="text-text-muted text-[13px]">Filling your {car.make} {car.model} now saves approximately</p>
          <p className="text-[32px] font-bold tracking-tight mt-1" style={{ color }}>${cycle.personalSavingsDollars.toFixed(2)}</p>
        </div>
      )}
    </div>
  )
}
