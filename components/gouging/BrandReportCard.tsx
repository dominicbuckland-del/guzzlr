'use client'

import { useEffect, useState } from 'react'
import { STATIONS } from '@/seed/stations'
import { getCachedLatestPrices, getCachedAreaAverage } from '@/lib/price-cache'

export default function BrandReportCard() {
  const [brands, setBrands] = useState<{ brand: string; markup: number; count: number }[]>([])

  useEffect(() => {
    const latestPrices = getCachedLatestPrices()
    const avg = getCachedAreaAverage('E10')

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
    <div className="space-y-0 animate-fade-in">
      <p className="text-text-secondary text-[13px] mb-3">Average markup by brand vs area average (E10)</p>
      {brands.map((b, i) => (
        <div key={b.brand} className="flex items-center justify-between py-3" style={i < brands.length - 1 ? { borderBottom: '0.5px solid #d1d1d6' } : {}}>
          <div>
            <p className="font-medium text-[15px] text-text-primary">{b.brand}</p>
            <p className="text-text-muted text-[11px]">{b.count} stations</p>
          </div>
          <div className="text-right">
            <p className={`font-display font-bold text-[15px] ${
              b.markup < 0 ? 'text-success' : b.markup > 2 ? 'text-error' : 'text-text-primary'
            }`}>
              {b.markup > 0 ? '+' : ''}{b.markup.toFixed(1)}c/L
            </p>
            <p className="text-text-muted text-[11px]">
              {b.markup < 0 ? 'below avg' : 'above avg'}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
