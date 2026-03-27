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
        <div className="w-16 h-16 rounded-full bg-surface mx-auto flex items-center justify-center mb-3">
          <span className="text-3xl text-text-muted">⛽</span>
        </div>
        <p className="text-text-secondary text-[15px]">No fill-ups yet</p>
        <p className="text-text-muted text-[13px]">Log your first fill-up to start tracking</p>
      </div>
    )
  }

  return (
    <div>
      {fillups.map((fill, i) => {
        const saved = fill.savedCents > 0
        return (
          <div key={fill.id} className="py-3" style={i < fillups.length - 1 ? { borderBottom: '0.5px solid #d1d1d6' } : {}}>
            <div className="flex items-start justify-between mb-1.5">
              <div>
                <p className="font-medium text-[15px] text-text-primary">{fill.stationName}</p>
                <p className="text-text-muted text-[11px]">{timeAgo(fill.filledAt)}</p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-[17px] text-text-primary">{formatPrice(fill.pricePerLitreCents)}</p>
                <p className="text-text-muted text-[11px]">c/L</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-text-secondary">{fill.litres.toFixed(1)}L &middot; ${(fill.totalCostCents / 100).toFixed(2)}</span>
              <span className={`font-medium ${saved ? 'text-success' : fill.savedCents < 0 ? 'text-error' : 'text-text-muted'}`}>
                {saved ? '+' : ''}{(fill.savedCents / 100).toFixed(2)}
                <span className="text-[11px] ml-1">saved</span>
              </span>
            </div>
            {fill.xpEarned > 0 && (
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-[11px] text-tint font-display font-bold">+{fill.xpEarned} XP</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
