'use client'

import { useGuzzlrStore } from '@/lib/store'
import { formatPrice } from '@/lib/calculations'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / (24 * 60 * 60 * 1000))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

export default function FillHistory() {
  const { fillups } = useGuzzlrStore()

  if (fillups.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-surface-container-low mx-auto flex items-center justify-center mb-3">
          <span className="material-symbols-outlined text-3xl text-on-surface-variant">local_gas_station</span>
        </div>
        <p className="text-on-surface-variant">No fill-ups yet</p>
        <p className="text-on-surface-variant text-sm">Log your first fill-up to start tracking</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {fillups.map((fill) => {
        const saved = fill.savedCents > 0
        return (
          <div key={fill.id} className="puffy-card p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-sm text-on-surface">{fill.stationName}</p>
                <p className="text-on-surface-variant text-xs">{timeAgo(fill.filledAt)}</p>
              </div>
              <div className="text-right">
                <p className="font-headline font-bold text-lg text-on-surface">{formatPrice(fill.pricePerLitreCents)}</p>
                <p className="text-on-surface-variant text-xs">c/L</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-on-surface-variant">{fill.litres.toFixed(1)}L &middot; ${(fill.totalCostCents / 100).toFixed(2)}</span>
              <span className={`font-medium ${saved ? 'text-primary' : fill.savedCents < 0 ? 'text-error' : 'text-on-surface-variant'}`}>
                {saved ? '+' : ''}{(fill.savedCents / 100).toFixed(2)}
                <span className="text-xs ml-1">saved</span>
              </span>
            </div>
            {fill.xpEarned > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-primary font-headline font-bold">+{fill.xpEarned} XP</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
