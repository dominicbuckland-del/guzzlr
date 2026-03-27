'use client'

import { useGuzzlrStore } from '@/lib/store'

function timeAgo(d: string): string {
  const diff = Date.now() - new Date(d).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function FuelFeed() {
  const { feedItems } = useGuzzlrStore()
  if (!feedItems.length) return null

  return (
    <div className="card p-4">
      <p className="text-text-muted text-[11px] font-semibold uppercase tracking-wider mb-3">Activity</p>
      <div className="space-y-3">
        {feedItems.slice(0, 6).map(item => (
          <div key={item.id} className="flex items-start gap-3">
            <span className="text-base flex-shrink-0">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] leading-snug">{item.message}</p>
              <p className="text-[12px] text-text-muted mt-0.5">{timeAgo(item.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
