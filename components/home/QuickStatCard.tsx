'use client'

import { useGuzzlrStore } from '@/lib/store'
import { STATIONS } from '@/seed/stations'
import { generatePriceHistory, getLatestPrices } from '@/seed/prices'
import { distanceKm, formatPrice, calculateFillCost } from '@/lib/calculations'
import AnimatedNumber from '@/components/shared/AnimatedNumber'

interface Props {
  type: 'cheapest' | 'weekly' | 'saved' | 'economy' | 'streak'
}

export default function QuickStatCard({ type }: Props) {
  const { car, user, fillups, userLat, userLng } = useGuzzlrStore()

  const renderContent = () => {
    switch (type) {
      case 'cheapest': {
        const allPrices = generatePriceHistory(STATIONS)
        const latestPrices = getLatestPrices(allPrices)
        const fuelType = car?.fuelType || 'Diesel'

        const stationsWithPrices = STATIONS
          .map(s => {
            const price = latestPrices.find(p => p.stationId === s.id && p.fuelType === fuelType)
            const dist = distanceKm(userLat || -27.47, userLng || 153.03, s.latitude, s.longitude)
            return { ...s, price: price?.priceCents || 9999, distance: dist }
          })
          .filter(s => s.distance <= (user.searchRadiusKm || 10))
          .sort((a, b) => a.price - b.price)

        const cheapest = stationsWithPrices[0]
        if (!cheapest) return null

        const fillCost = car ? calculateFillCost(cheapest.price, car.tankSizeLitres) : 0

        return (
          <>
            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Cheapest Nearby</span>
            <p className="font-headline font-bold text-sm text-on-surface truncate mt-1">{cheapest.name}</p>
            <p className="price-ticker text-2xl text-primary mt-1">{formatPrice(cheapest.price)}<span className="text-sm opacity-50 ml-1">c/L</span></p>
            <p className="text-on-surface-variant text-xs mt-1">{cheapest.distance}km away</p>
            {car && <p className="text-primary text-xs font-bold mt-1">Fill: ${fillCost.toFixed(2)}</p>}
          </>
        )
      }

      case 'weekly': {
        const thisWeek = fillups
          .filter(f => new Date(f.filledAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
          .reduce((sum, f) => sum + f.totalCostCents, 0) / 100
        const lastWeek = fillups
          .filter(f => {
            const d = new Date(f.filledAt)
            return d > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) && d <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          })
          .reduce((sum, f) => sum + f.totalCostCents, 0) / 100
        const change = thisWeek - lastWeek

        return (
          <>
            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Weekly Spend</span>
            <AnimatedNumber value={thisWeek} prefix="$" className="price-ticker text-2xl text-on-surface block mt-1" />
            <p className={`text-xs font-bold mt-1 ${change > 0 ? 'text-error' : 'text-primary'}`}>
              {change > 0 ? '↑' : '↓'}${Math.abs(change).toFixed(2)} vs last week
            </p>
          </>
        )
      }

      case 'saved': {
        const monthlySaved = fillups
          .filter(f => {
            const d = new Date(f.filledAt)
            const now = new Date()
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
          })
          .reduce((sum, f) => sum + Math.max(0, f.savedCents), 0) / 100

        return (
          <>
            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Saved This Month</span>
            <AnimatedNumber value={monthlySaved} prefix="$" className="price-ticker text-2xl text-primary block mt-1" />
            <p className="text-on-surface-variant text-xs mt-1">vs area average</p>
          </>
        )
      }

      case 'economy': {
        const rated = car?.ratedEconomyL100km || 0
        return (
          <>
            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Your Economy</span>
            <p className="price-ticker text-2xl text-on-surface mt-1">{rated}<span className="text-sm opacity-50 ml-1">L/100km</span></p>
            <p className="text-xs text-on-surface-variant mt-1">Rated economy</p>
          </>
        )
      }

      case 'streak': {
        return (
          <>
            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Streak</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              <AnimatedNumber value={user.streakCount} decimals={0} className="price-ticker text-2xl text-on-surface" />
            </div>
            <p className="text-on-surface-variant text-xs mt-1">fills beating avg</p>
          </>
        )
      }
    }
  }

  return (
    <div className="puffy-card p-4 min-w-[170px] flex-shrink-0">
      {renderContent()}
    </div>
  )
}
