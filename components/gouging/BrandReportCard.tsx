'use client'

import { useEffect, useState } from 'react'
import { STATIONS } from '@/seed/stations'
import { generatePriceHistory, getLatestPrices, getAreaAverage } from '@/seed/prices'

export default function BrandReportCard() {
  const [brands, setBrands] = useState<{ brand: string; markup: number; count: number }[]>([])

  useEffect(() => {
    const allPrices = generatePriceHistory(STATIONS)
    const latestPrices = getLatestPrices(allPrices)
    const avg = getAreaAverage(latestPrices, 'E10')

    const brandMap = new Map<string, { total: number; count: number }>()
    for (const station of STATIONS) {
      const price = latestPrices.find(p => p.stationId === station.id && p.fuelType === 'E10')
      if (!price) continue
      const existing = brandMap.get(station.brand) || { total: 0, count: 0 }
      existing.total += price.priceCents - avg
      existing.count += 1
      brandMap.set(station.brand, existing)
    }

    const result = Array.from(brandMap.entries())
      .map(([brand, { total, count }]) => ({
        brand,
        markup: Math.round(total / count) / 10,
        count,
      }))
      .sort((a, b) => a.markup - b.markup)

    setBrands(result)
  }, [])

  return (
    <div className="space-y-3 animate-fade-in">
      <p className="text-text-secondary text-sm">Average markup by brand vs area average (E10)</p>
      {brands.map((b) => (
        <div key={b.brand} className="glass-card p-3 flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">{b.brand}</p>
            <p className="text-text-secondary text-xs">{b.count} stations</p>
          </div>
          <div className="text-right">
            <p className={`font-heading font-bold text-sm ${
              b.markup < 0 ? 'text-primary' : b.markup > 2 ? 'text-danger' : 'text-warning'
            }`}>
              {b.markup > 0 ? '+' : ''}{b.markup.toFixed(1)}c/L
            </p>
            <p className="text-text-secondary text-xs">
              {b.markup < 0 ? 'below avg' : 'above avg'}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
