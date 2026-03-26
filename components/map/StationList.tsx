'use client'

import { useMemo } from 'react'
import { useGuzzlrStore } from '@/lib/store'
import { STATIONS } from '@/seed/stations'
import { generatePriceHistory, getLatestPrices, getAreaAverage } from '@/seed/prices'
import { distanceKm, formatPrice, calculateFillCost, calculateSavings } from '@/lib/calculations'

interface Props {
  fuelType: string
  brandFilter: string[]
}

export default function StationList({ fuelType: fuelTypeOverride, brandFilter }: Props) {
  const { car, user, userLat, userLng } = useGuzzlrStore()
  const fuelType = fuelTypeOverride || car?.fuelType || 'Diesel'

  const stations = useMemo(() => {
    const allPrices = generatePriceHistory(STATIONS)
    const latestPrices = getLatestPrices(allPrices)
    const avg = getAreaAverage(latestPrices, fuelType)

    return STATIONS
      .map(s => {
        const price = latestPrices.find(p => p.stationId === s.id && p.fuelType === fuelType)
        const dist = distanceKm(userLat || -27.47, userLng || 153.03, s.latitude, s.longitude)
        return {
          ...s,
          price: price?.priceCents || null,
          distance: dist,
          fillCost: price && car ? calculateFillCost(price.priceCents, car.tankSizeLitres) : null,
          savings: price && car ? calculateSavings(price.priceCents, avg, car.tankSizeLitres) : null,
        }
      })
      .filter(s => s.distance <= (user.searchRadiusKm || 10))
      .filter(s => brandFilter.length === 0 || brandFilter.includes(s.brand))
      .filter(s => s.price !== null)
      .sort((a, b) => (a.price || 9999) - (b.price || 9999))
  }, [fuelType, brandFilter, car, user, userLat, userLng])

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
      {stations.map((station, i) => (
        <div key={station.id} className="glass-card p-3 flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-sm ${
            i < 3 ? 'bg-primary/20 text-primary' : 'bg-surface text-text-secondary'
          }`}>
            {i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{station.name}</p>
            <p className="text-text-secondary text-xs">{station.distance}km away</p>
          </div>
          <div className="text-right">
            <p className="price-ticker text-lg text-primary">{station.price ? formatPrice(station.price) : '--'}</p>
            {station.fillCost !== null && (
              <p className="text-text-secondary text-xs">${station.fillCost.toFixed(2)}</p>
            )}
            {station.savings !== null && (
              <p className={`text-xs font-medium ${station.savings >= 0 ? 'text-primary' : 'text-danger'}`}>
                {station.savings >= 0 ? '+' : ''}{station.savings.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
