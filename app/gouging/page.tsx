'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react'
import { useGuzzlrStore } from '@/lib/store'
import { STATIONS } from '@/seed/stations'
import { generatePriceHistory, getLatestPrices, getAreaAverage } from '@/seed/prices'
import { formatPrice } from '@/lib/calculations'
import { SkeletonCard } from '@/components/shared/Skeleton'
import BrandReportCard from '@/components/gouging/BrandReportCard'

export default function GougingPage() {
  const { car } = useGuzzlrStore()
  const [loading, setLoading] = useState(true)
  const [gougers, setGougers] = useState<any[]>([])
  const [areaAverage, setAreaAverage] = useState(0)
  const [tab, setTab] = useState<'gougers' | 'brands'>('gougers')

  useEffect(() => {
    const allPrices = generatePriceHistory(STATIONS)
    const latestPrices = getLatestPrices(allPrices)
    const avg = getAreaAverage(latestPrices, 'E10')
    setAreaAverage(avg)

    const tankSize = car?.tankSizeLitres || 80

    const gougingList = STATIONS
      .map(station => {
        const e10Price = latestPrices.find(p => p.stationId === station.id && p.fuelType === 'E10')
        if (!e10Price) return null
        const above = e10Price.priceCents - avg
        return {
          station,
          priceCents: e10Price.priceCents,
          areaAverageCents: avg,
          aboveAverageCents: above,
          overchargeDollars: Math.round((above * tankSize * 0.65) / 1000 * 100) / 100,
        }
      })
      .filter((g): g is NonNullable<typeof g> => g !== null && g.aboveAverageCents > 0)
      .sort((a, b) => b.aboveAverageCents - a.aboveAverageCents)
      .slice(0, 10)

    setGougers(gougingList)
    setLoading(false)
  }, [car])

  const handleShare = async (gouger: any) => {
    const text = `GUZZLR GOUGING REPORT\n\n${gouger.station.name} is charging ${(gouger.aboveAverageCents / 10).toFixed(1)}c/L ABOVE AVERAGE\n\nThat's $${gouger.overchargeDollars.toFixed(2)} extra on a full tank of a ${car?.make} ${car?.model}.\n\n#StopTheGouge\nDownload Guzzlr`

    if (navigator.share) {
      try {
        await navigator.share({ text, title: 'Guzzlr Gouging Report' })
      } catch {}
    } else {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="px-4 pt-6 space-y-4 bg-surface min-h-screen">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  const now = new Date()
  const weekStr = `Week of ${now.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}`

  return (
    <div className="px-4 pt-6 space-y-4 animate-fade-in bg-surface min-h-screen">
      <div>
        <h1 className="font-headline text-2xl font-bold text-on-surface">Gouging Report</h1>
        <p className="text-on-surface-variant text-sm">{weekStr}</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-surface-container-low rounded-xl p-0.5">
        <button
          onClick={() => setTab('gougers')}
          className={`flex-1 py-2 rounded-lg text-xs font-headline font-bold tracking-widest uppercase transition-all ${
            tab === 'gougers' ? 'bg-error text-white' : 'text-on-surface-variant'
          }`}
        >
          Biggest Rip-Offs
        </button>
        <button
          onClick={() => setTab('brands')}
          className={`flex-1 py-2 rounded-lg text-xs font-headline font-bold tracking-widest uppercase transition-all ${
            tab === 'brands' ? 'bg-error text-white' : 'text-on-surface-variant'
          }`}
        >
          Brand Report Card
        </button>
      </div>

      {tab === 'gougers' ? (
        <div className="space-y-3">
          <p className="text-error font-headline font-bold text-sm uppercase tracking-widest">
            This Week&apos;s Biggest Rip-Offs
          </p>
          <p className="text-on-surface-variant text-xs">
            Area average: {formatPrice(areaAverage)}c/L (E10)
          </p>

          {gougers.map((g, i) => (
            <div key={g.station.id} className="puffy-card p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-headline font-bold text-error text-sm">#{i + 1}</span>
                  <div>
                    <p className="font-headline font-bold text-sm text-on-surface">{g.station.name}</p>
                    <p className="text-on-surface-variant text-xs">{g.station.suburb}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-on-surface-variant text-sm">E10: <span className="font-headline font-bold text-lg text-on-surface">{formatPrice(g.priceCents)}</span></span>
                <span className="text-on-surface-variant text-xs">(avg: {formatPrice(g.areaAverageCents)})</span>
              </div>

              <div className="bg-error/10 rounded-2xl p-2 mb-3">
                <p className="text-error font-headline font-bold text-sm">
                  {(g.aboveAverageCents / 10).toFixed(1)}c/L ABOVE AVERAGE
                </p>
                {car && (
                  <p className="text-on-surface-variant text-xs mt-0.5">
                    Overcharging you ${g.overchargeDollars.toFixed(2)}/tank
                  </p>
                )}
              </div>

              <button
                onClick={() => handleShare(g)}
                className="w-full bg-surface-container-low rounded-2xl py-2 text-sm font-headline font-bold text-on-surface-variant tap-active flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-sm">share</span>
                Share
              </button>
            </div>
          ))}
        </div>
      ) : (
        <BrandReportCard />
      )}
    </div>
  )
}
