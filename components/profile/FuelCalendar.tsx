'use client'

import { useGuzzlrStore } from '@/lib/store'

export default function FuelCalendar() {
  const { fillups } = useGuzzlrStore()

  // Build a map of date -> total cost for last 60 days
  const costByDate = new Map<string, number>()
  fillups.forEach(f => {
    const date = new Date(f.filledAt).toISOString().split('T')[0]
    costByDate.set(date, (costByDate.get(date) || 0) + f.totalCostCents / 100)
  })

  // Generate last 35 days (5 weeks)
  const days: { date: string; cost: number; dayOfWeek: number }[] = []
  for (let i = 34; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    days.push({ date: key, cost: costByDate.get(key) || 0, dayOfWeek: d.getDay() })
  }

  const maxCost = Math.max(...days.map(d => d.cost), 1)

  return (
    <div className="card p-4">
      <p className="text-text-muted text-[11px] font-semibold uppercase tracking-wider mb-3">Fill-Up Activity</p>
      <div className="grid grid-cols-7 gap-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-center text-[10px] text-text-muted font-medium pb-1">{d}</div>
        ))}
        {/* Pad the first row */}
        {Array.from({ length: days[0]?.dayOfWeek || 0 }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {days.map((day) => {
          const intensity = day.cost > 0 ? Math.max(0.2, day.cost / maxCost) : 0
          return (
            <div
              key={day.date}
              className="aspect-square rounded-[4px] transition-colors"
              style={{
                backgroundColor: intensity > 0
                  ? `rgba(0, 122, 255, ${intensity})`
                  : '#f5f5f7',
              }}
              title={day.cost > 0 ? `$${day.cost.toFixed(2)} on ${day.date}` : day.date}
            />
          )
        })}
      </div>
      <div className="flex items-center justify-end gap-1 mt-2">
        <span className="text-[10px] text-text-muted">Less</span>
        {[0, 0.2, 0.4, 0.7, 1].map((v, i) => (
          <div key={i} className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: v === 0 ? '#f5f5f7' : `rgba(0, 122, 255, ${v})` }} />
        ))}
        <span className="text-[10px] text-text-muted">More</span>
      </div>
    </div>
  )
}
