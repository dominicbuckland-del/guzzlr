/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { motion } from 'framer-motion'
import { useGuzzlrStore } from '@/lib/store'
import { formatPrice, calculateFillCost, calculateSavings } from '@/lib/calculations'
import { getLoyaltyForBrand } from '@/lib/loyalty-data'

interface Props { station: any; areaAverage: number; fuelType: string; onClose: () => void }

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min${mins !== 1 ? 's' : ''} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hr${hours !== 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days !== 1 ? 's' : ''} ago`
}

export default function StationDetail({ station, areaAverage, fuelType, onClose }: Props) {
  const { car } = useGuzzlrStore()
  const loyalty = getLoyaltyForBrand(station.brand)
  const fillCost = car && station.price ? calculateFillCost(station.price, car.tankSizeLitres) : null
  const savings = car && station.price ? calculateSavings(station.price, areaAverage, car.tankSizeLitres) : null
  const matchingPrice = (station.allPrices || []).find((p: any) => p.fuelType === fuelType)

  return (
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }}
      className="absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-[16px] p-5 max-h-[60vh] overflow-y-auto"
      style={{ boxShadow: '0 -4px 24px rgba(0,0,0,0.08)' }}>
      {/* iOS-style grab handle */}
      <div style={{ width: 36, height: 5, borderRadius: 3, background: '#c7c7cc', margin: '0 auto 16px' }} />
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="font-display text-[17px] font-bold text-text-primary">{station.name}</h3>
          <p className="text-text-secondary text-[13px]">{station.address}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-text-muted text-[11px]">{station.distance}km away</span>
            {matchingPrice?.recordedAt && (
              <span className="text-text-muted text-[11px]">
                &middot; Updated {timeAgo(matchingPrice.recordedAt)}
              </span>
            )}
          </div>
        </div>
        <button onClick={onClose} className="text-text-muted tap-active text-[17px] w-8 h-8 flex items-center justify-center rounded-full bg-surface" aria-label="Close">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="#86868b" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
      </div>
      {/* Loyalty program card */}
      {loyalty && loyalty.discountCentsPerLitre > 0 && (
        <div className="flex items-center gap-2.5 bg-surface rounded-[12px] px-3.5 py-2.5 mb-4">
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#007AFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.76 3.57 3.94.57-2.85 2.78.67 3.93L7 10.07l-3.52 1.78.67-3.93L1.3 5.14l3.94-.57L7 1z" fill="#fff"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-text-primary">{loyalty.programName}</p>
            <p className="text-[11px] text-text-secondary">{loyalty.description}</p>
          </div>
          <span className="text-[13px] font-bold" style={{ color: '#34C759' }}>-{loyalty.discountCentsPerLitre}c/L</span>
        </div>
      )}
      <div className="space-y-0 mb-4">
        {(station.allPrices || []).map((p: any, i: number) => (
          <div key={p.fuelType} className={`flex justify-between py-2.5 ${p.fuelType === fuelType ? 'text-text-primary' : 'text-text-secondary'}`} style={i < (station.allPrices || []).length - 1 ? { borderBottom: '0.5px solid #d1d1d6' } : {}}>
            <span className="text-[15px]">{p.fuelType}</span>
            <span className="font-display font-bold text-[15px]">{formatPrice(p.priceCents)}{p.fuelType === fuelType && <span className="text-text-muted text-[11px] ml-2">yours</span>}</span>
          </div>
        ))}
      </div>
      {car && fillCost !== null && (
        <div className="bg-surface rounded-[14px] p-3.5 mb-4">
          <p className="text-[15px] text-text-primary">Fill {car.make} {car.model}: <span className="font-bold text-text-primary">${fillCost.toFixed(2)}</span></p>
          {savings !== null && <p className={`text-[15px] font-bold ${savings >= 0 ? 'text-success' : 'text-error'}`}>{savings >= 0 ? 'Save' : 'Overspend'} ${Math.abs(savings).toFixed(2)}</p>}
        </div>
      )}
      <div className="flex gap-3">
        <a href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-tint text-white font-display font-bold py-3.5 rounded-full text-center tap-active text-[15px] flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 8l-6 7V10H4a1 1 0 01-1-1V5a1 1 0 011-1h4V1z" fill="#fff"/></svg>
          Navigate
        </a>
        <button className="flex-1 bg-surface text-text-secondary font-display font-bold py-3.5 rounded-full tap-active text-[15px]">Log Fill</button>
      </div>
    </motion.div>
  )
}
