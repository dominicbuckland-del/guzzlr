'use client'

import { useGuzzlrStore } from '@/lib/store'
import { STATIONS } from '@/seed/stations'
import { getCachedLatestPrices } from '@/lib/price-cache'
import { distanceKm, formatPrice, calculateFillCost } from '@/lib/calculations'
import AnimatedNumber from '@/components/shared/AnimatedNumber'
import Sparkline from '@/components/shared/Sparkline'

interface Props { type: 'cheapest' | 'weekly' | 'saved' | 'streak' }

export default function QuickStatCard({ type }: Props) {
  const { car, user, fillups, userLat, userLng } = useGuzzlrStore()

  const content = (() => {
    switch (type) {
      case 'cheapest': {
        const latestPrices = getCachedLatestPrices()
        const ft = car?.fuelType || 'Diesel'
        const cheapest = STATIONS.map(s => ({
          ...s, price: latestPrices.find(p => p.stationId === s.id && p.fuelType === ft)?.priceCents || 9999,
          distance: distanceKm(userLat || -27.47, userLng || 153.03, s.latitude, s.longitude),
        })).filter(s => s.distance <= (user.searchRadiusKm || 10)).sort((a, b) => a.price - b.price)[0]
        if (!cheapest) return null
        return <>
          <p className="text-text-muted text-[11px] font-semibold uppercase tracking-wider">Cheapest</p>
          <p className="text-[13px] font-medium truncate mt-1">{cheapest.name}</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <p className="price-ticker text-[22px]">{formatPrice(cheapest.price)}<span className="text-text-muted text-[13px] font-normal ml-0.5">c/L</span></p>
          </div>
          <p className="text-tint text-[13px] font-semibold mt-1">{cheapest.distance} km away</p>
          {car && <p className="text-text-secondary text-[12px] mt-0.5">${calculateFillCost(cheapest.price, car.tankSizeLitres).toFixed(2)} fill</p>}
        </>
      }
      case 'weekly': {
        const thisWeekSpend = fillups.filter(f => new Date(f.filledAt) > new Date(Date.now() - 7*24*60*60*1000)).reduce((s, f) => s + f.totalCostCents, 0) / 100
        const lastWeekSpend = fillups.filter(f => {
          const d = new Date(f.filledAt).getTime()
          return d > Date.now() - 14*24*60*60*1000 && d <= Date.now() - 7*24*60*60*1000
        }).reduce((s, f) => s + f.totalCostCents, 0) / 100
        const diff = lastWeekSpend > 0 ? thisWeekSpend - lastWeekSpend : 0
        const diffPct = lastWeekSpend > 0 ? Math.round((diff / lastWeekSpend) * 100) : 0

        // Build last 8 weeks of spending for sparkline
        const weeklySpendData: number[] = []
        for (let w = 7; w >= 0; w--) {
          const weekStart = Date.now() - (w + 1) * 7 * 24 * 60 * 60 * 1000
          const weekEnd = Date.now() - w * 7 * 24 * 60 * 60 * 1000
          const spend = fillups.filter(f => {
            const t = new Date(f.filledAt).getTime()
            return t > weekStart && t <= weekEnd
          }).reduce((s, f) => s + f.totalCostCents, 0) / 100
          weeklySpendData.push(spend)
        }

        return <>
          <p className="text-text-muted text-[11px] font-semibold uppercase tracking-wider">This Week</p>
          <AnimatedNumber value={thisWeekSpend} prefix="$" className="price-ticker text-[22px] block mt-1" />
          <Sparkline data={weeklySpendData} color={diff <= 0 ? '#34C759' : '#FF3B30'} />
          {lastWeekSpend > 0 && (
            <p className={`text-[12px] font-medium mt-1 ${diff <= 0 ? 'text-success' : 'text-error'}`}>
              {diff <= 0 ? '↓' : '↑'} {Math.abs(diffPct)}% vs last week
            </p>
          )}
        </>
      }
      case 'saved': {
        const saved = fillups.filter(f => { const d = new Date(f.filledAt); const n = new Date(); return d.getMonth() === n.getMonth() }).reduce((s, f) => s + Math.max(0, f.savedCents), 0) / 100
        return <>
          <p className="text-text-muted text-[11px] font-semibold uppercase tracking-wider">Saved</p>
          <AnimatedNumber value={saved} prefix="$" className="price-ticker text-[22px] text-success block mt-1" />
          <p className="text-text-muted text-[11px] mt-1">this month</p>
        </>
      }
      case 'streak':
        return <>
          <p className="text-text-muted text-[11px] font-semibold uppercase tracking-wider">Streak</p>
          <p className="price-ticker text-[22px] mt-1">{user.streakCount}</p>
          <p className="text-text-muted text-[11px] mt-1">in a row</p>
        </>
    }
  })()

  return <div className="card p-4 min-w-[148px] flex-shrink-0">{content}</div>
}
