'use client'

import { useGuzzlrStore } from '@/lib/store'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function FuelFeed() {
  const { feedItems } = useGuzzlrStore()

  if (feedItems.length === 0) return null

  return (
    <div className="puffy-card p-5">
      <h3 className="font-headline font-bold text-xs text-on-surface-variant uppercase tracking-widest mb-4">Activity</h3>
      <div className="space-y-4">
        {feedItems.slice(0, 8).map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-on-surface leading-snug font-medium">{item.message}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{timeAgo(item.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
