'use client'

import { useMemo } from 'react'
import { useGuzzlrStore } from '@/lib/store'
import { STATIONS } from '@/seed/stations'
import { generatePriceHistory, getLatestPrices, getAreaAverage } from '@/seed/prices'
import { distanceKm, formatPrice, calculateFillCost, calculateSavings } from '@/lib/calculations'

interface Props { fuelType: string; brandFilter: string[] }

export default function StationList({ fuelType: override, brandFilter }: Props) {
  const { car, user, userLat, userLng } = useGuzzlrStore()
  const fuelType = override || car?.fuelType || 'Diesel'

  const stations = useMemo(() => {
    const latestPrices = getLatestPrices(generatePriceHistory(STATIONS))
    const avg = getAreaAverage(latestPrices, fuelType)
    return STATIONS.map(s => {
      const price = latestPrices.find(p => p.stationId === s.id && p.fuelType === fuelType)
      const dist = distanceKm(userLat || -27.47, userLng || 153.03, s.latitude, s.longitude)
      return { ...s, price: price?.priceCents || null, distance: dist, fillCost: price && car ? calculateFillCost(price.priceCents, car.tankSizeLitres) : null, savings: price && car ? calculateSavings(price.priceCents, avg, car.tankSizeLitres) : null }
    }).filter(s => s.distance <= (user.searchRadiusKm || 10)).filter(s => brandFilter.length === 0 || brandFilter.includes(s.brand)).filter(s => s.price !== null).sort((a, b) => (a.price || 9999) - (b.price || 9999))
  }, [fuelType, brandFilter, car, user, userLat, userLng])

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4 bg-bg">
      {stations.map((s, i) => (
        <div key={s.id} className="flex items-center gap-3 py-3" style={i < stations.length - 1 ? { borderBottom: '0.5px solid #d1d1d6' } : {}}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-[11px] ${i < 3 ? 'bg-text-primary text-white' : 'bg-surface text-text-muted'}`}>{i + 1}</div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[15px] text-text-primary truncate">{s.name}</p>
            <p className="text-text-muted text-[11px]">{s.distance}km</p>
          </div>
          <div className="text-right">
            <p className="font-display font-bold text-[17px] text-text-primary">{s.price ? formatPrice(s.price) : '--'}</p>
            {s.fillCost !== null && <p className="text-text-muted text-[11px]">${s.fillCost.toFixed(2)}</p>}
            {s.savings !== null && <p className={`text-[11px] font-bold ${s.savings >= 0 ? 'text-success' : 'text-error'}`}>{s.savings >= 0 ? '+' : ''}{s.savings.toFixed(2)}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
