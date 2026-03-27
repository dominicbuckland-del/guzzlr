'use client'

import { useGuzzlrStore } from '@/lib/store'
import { STATIONS } from '@/seed/stations'
import { generatePriceHistory, getLatestPrices } from '@/seed/prices'
import { distanceKm, formatPrice, calculateFillCost } from '@/lib/calculations'
import AnimatedNumber from '@/components/shared/AnimatedNumber'

interface Props { type: 'cheapest' | 'weekly' | 'saved' | 'streak' }

export default function QuickStatCard({ type }: Props) {
  const { car, user, fillups, userLat, userLng } = useGuzzlrStore()

  const content = (() => {
    switch (type) {
      case 'cheapest': {
        const latestPrices = getLatestPrices(generatePriceHistory(STATIONS))
        const ft = car?.fuelType || 'Diesel'
        const cheapest = STATIONS.map(s => ({
          ...s, price: latestPrices.find(p => p.stationId === s.id && p.fuelType === ft)?.priceCents || 9999,
          distance: distanceKm(userLat || -27.47, userLng || 153.03, s.latitude, s.longitude),
        })).filter(s => s.distance <= (user.searchRadiusKm || 10)).sort((a, b) => a.price - b.price)[0]
        if (!cheapest) return null
        return <>
          <p className="text-text-muted text-[11px] font-semibold uppercase tracking-wider">Cheapest</p>
          <p className="text-[13px] font-medium truncate mt-1">{cheapest.name}</p>
          <p className="price-ticker text-[22px] mt-1">{formatPrice(cheapest.price)}<span className="text-text-muted text-[13px] font-normal ml-0.5">c/L</span></p>
          {car && <p className="text-tint text-[13px] font-medium mt-1">${calculateFillCost(cheapest.price, car.tankSizeLitres).toFixed(2)} fill</p>}
        </>
      }
      case 'weekly': {
        const spend = fillups.filter(f => new Date(f.filledAt) > new Date(Date.now() - 7*24*60*60*1000)).reduce((s, f) => s + f.totalCostCents, 0) / 100
        return <>
          <p className="text-text-muted text-[11px] font-semibold uppercase tracking-wider">This Week</p>
          <AnimatedNumber value={spend} prefix="$" className="price-ticker text-[22px] block mt-1" />
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
          <p className="price-ticker text-[22px] mt-1">🔥 {user.streakCount}</p>
          <p className="text-text-muted text-[11px] mt-1">in a row</p>
        </>
    }
  })()

  return <div className="card p-4 min-w-[148px] flex-shrink-0">{content}</div>
}
