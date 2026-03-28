'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react'
import { useGuzzlrStore } from '@/lib/store'
import { STATIONS } from '@/seed/stations'
import { getCachedLatestPrices, getCachedAreaAverage } from '@/lib/price-cache'
import { formatPrice } from '@/lib/calculations'
import { SkeletonCard } from '@/components/shared/Skeleton'
import BrandReportCard from '@/components/gouging/BrandReportCard'
import PageTransition from '@/components/layout/PageTransition'

export default function GougingPage() {
  const { car } = useGuzzlrStore()
  const [loading, setLoading] = useState(true)
  const [gougers, setGougers] = useState<any[]>([])
  const [areaAverage, setAreaAverage] = useState(0)
  const [tab, setTab] = useState<'gougers' | 'brands'>('gougers')

  useEffect(() => {
    const latestPrices = getCachedLatestPrices()
    const avg = getCachedAreaAverage('E10')
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
    const aboveCpl = (gouger.aboveAverageCents / 10).toFixed(1)
    const text = `🚨 GOUGING ALERT: ${gouger.station.name} (${gouger.station.suburb})\n\nCharging ${aboveCpl}c/L ABOVE the area average of ${formatPrice(gouger.areaAverageCents)}c/L.\n\nThat's an extra $${gouger.overchargeDollars.toFixed(2)} per tank on a ${car?.year || ''} ${car?.make || ''} ${car?.model || ''}.\n\nDon't fill here. Check Guzzlr for cheaper options nearby.\n\n#Guzzlr #StopTheGouge #FuelPrices`

    if (navigator.share) {
      try {
        await navigator.share({ text, title: `Gouging Alert: ${gouger.station.name}` })
      } catch {}
    } else {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    }
  }

  const handleReport = (gouger: any) => {
    alert(`Report submitted for ${gouger.station.name}. We'll review this station's pricing behaviour. Thanks for helping keep fuel fair.`)
  }

  if (loading) {
    return (
      <div className="px-4 pt-6 space-y-4 bg-bg min-h-screen">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  const now = new Date()
  const weekStr = `Week of ${now.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}`
  const worstOffender = gougers.length > 0 ? gougers[0] : null

  return (
    <PageTransition><div className="px-4 pt-6 space-y-4 bg-bg min-h-screen pb-8">
      <div>
        <h1 className="font-display text-[22px] font-bold text-text-primary">Gouging Report</h1>
        <p className="text-text-secondary text-[13px]">{weekStr}</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-surface rounded-[10px] p-[3px]">
        <button
          onClick={() => setTab('gougers')}
          className={`flex-1 py-2 rounded-[8px] text-[13px] font-display font-bold transition-all ${
            tab === 'gougers' ? 'bg-text-primary text-white' : 'text-text-secondary'
          }`}
        >
          Biggest Rip-Offs
        </button>
        <button
          onClick={() => setTab('brands')}
          className={`flex-1 py-2 rounded-[8px] text-[13px] font-display font-bold transition-all ${
            tab === 'brands' ? 'bg-text-primary text-white' : 'text-text-secondary'
          }`}
        >
          Brand Report Card
        </button>
      </div>

      {tab === 'gougers' ? (
        <div className="space-y-3">
          {/* Worst Offender Hero Card */}
          {worstOffender && (
            <div className="card bg-error/8 border border-error/20 rounded-[14px] p-5">
              <p className="text-error font-display font-bold text-[11px] uppercase tracking-widest mb-3">Worst Offender</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-error/15 flex items-center justify-center">
                  <span className="text-[24px]">🚩</span>
                </div>
                <div>
                  <p className="font-display font-bold text-[17px] text-text-primary">{worstOffender.station.name}</p>
                  <p className="text-text-muted text-[13px]">{worstOffender.station.suburb}</p>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display font-bold text-[28px] text-error">{(worstOffender.aboveAverageCents / 10).toFixed(1)}c/L</span>
                <span className="text-text-muted text-[13px]">above average</span>
              </div>
              <p className="text-text-secondary text-[13px]">
                Costing you an extra <span className="font-display font-bold text-error">${worstOffender.overchargeDollars.toFixed(2)}</span> per tank
              </p>
            </div>
          )}

          <p className="text-text-muted text-[11px]">
            Area average: {formatPrice(areaAverage)}c/L (E10)
          </p>

          {gougers.map((g, i) => (
            <div key={g.station.id} className="card bg-surface rounded-[14px] p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-error text-[13px]">#{i + 1}</span>
                  <div>
                    <p className="font-display font-bold text-[15px] text-text-primary">{g.station.name}</p>
                    <p className="text-text-muted text-[11px]">{g.station.suburb}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary text-[13px]">E10: <span className="font-display font-bold text-[17px] text-text-primary">{formatPrice(g.priceCents)}</span></span>
                <span className="text-text-muted text-[11px]">(avg: {formatPrice(g.areaAverageCents)})</span>
              </div>

              <div className="bg-error/10 rounded-[12px] p-2.5 mb-3">
                <p className="text-error font-display font-bold text-[13px]">
                  {(g.aboveAverageCents / 10).toFixed(1)}c/L ABOVE AVERAGE
                </p>
                {car && (
                  <p className="text-text-muted text-[11px] mt-0.5">
                    Overcharging you <span className="text-error font-bold">${g.overchargeDollars.toFixed(2)}</span>/tank
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleShare(g)}
                  className="flex-1 bg-surface-high rounded-[12px] py-2.5 text-[13px] font-display font-bold text-text-secondary tap-active flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  Share
                </button>
                <button
                  onClick={() => handleReport(g)}
                  className="flex-1 bg-surface-high rounded-[12px] py-2.5 text-[13px] font-display font-bold text-error/80 tap-active flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  Report Station
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <BrandReportCard />
      )}
    </div></PageTransition>
  )
}
