'use client'

import { useMemo } from 'react'
import { useGuzzlrStore } from '@/lib/store'
import { FeedItem } from '@/lib/types'
import Link from 'next/link'

function getDayLabel(d: string): string {
  const now = new Date()
  const then = new Date(d)
  const diffMs = now.getTime() - then.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 14) return '1 week ago'
  return `${Math.floor(diffDays / 7)} weeks ago`
}

function groupByDay(items: FeedItem[]): { label: string; items: FeedItem[] }[] {
  const groups: { label: string; items: FeedItem[] }[] = []
  const map = new Map<string, FeedItem[]>()

  for (const item of items) {
    const label = getDayLabel(item.timestamp)
    if (!map.has(label)) {
      map.set(label, [])
      groups.push({ label, items: map.get(label)! })
    }
    map.get(label)!.push(item)
  }

  return groups
}

export default function FuelFeed() {
  const { feedItems } = useGuzzlrStore()

  const grouped = useMemo(() => groupByDay(feedItems.slice(0, 8)), [feedItems])

  if (!feedItems.length) return null

  return (
    <div className="card p-4">
      <p className="text-text-muted text-[11px] font-semibold uppercase tracking-wider mb-3">Activity</p>
      <div className="space-y-4">
        {grouped.map(group => (
          <div key={group.label}>
            <p className="text-text-secondary text-[12px] font-semibold mb-2">{group.label}</p>
            <div className="space-y-3">
              {group.items.map(item => (
                <div key={item.id} className="flex items-start gap-3">
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] leading-snug">{item.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Link href="/history" className="block text-center text-tint text-[14px] font-medium mt-4 pt-3" style={{ borderTop: '0.5px solid #d1d1d6' }}>
        View All
      </Link>
    </div>
  )
}
