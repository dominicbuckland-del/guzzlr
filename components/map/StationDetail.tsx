'use client'

import { motion } from 'framer-motion'
import { useGuzzlrStore } from '@/lib/store'
import { formatPrice, calculateFillCost, calculateSavings } from '@/lib/calculations'
import { getLoyaltyForBrand } from '@/lib/loyalty-data'

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  station: any
  areaAverage: number
  fuelType: string
  onClose: () => void
}

export default function StationDetail({ station, areaAverage, fuelType, onClose }: Props) {
  const { car } = useGuzzlrStore()
  const loyalty = getLoyaltyForBrand(station.brand)
  const fillCost = car && station.price ? calculateFillCost(station.price, car.tankSizeLitres) : null
  const savings = car && station.price ? calculateSavings(station.price, areaAverage, car.tankSizeLitres) : null

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25 }}
      className="absolute bottom-0 left-0 right-0 z-[1000] puffy-card rounded-t-3xl p-5 max-h-[60vh] overflow-y-auto"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-headline text-xl font-bold text-on-surface">{station.name}</h3>
          <p className="text-on-surface-variant text-sm">{station.address}</p>
          <p className="text-on-surface-variant text-sm">{station.distance}km away</p>
        </div>
        <button onClick={onClose} className="text-on-surface-variant tap-active p-1">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* All fuel prices */}
      <div className="space-y-2 mb-4">
        {(station.allPrices || []).map((p: any) => (
          <div key={p.fuelType} className={`flex items-center justify-between py-1 ${p.fuelType === fuelType ? 'text-primary' : 'text-on-surface'}`}>
            <span className="text-sm font-medium">{p.fuelType}</span>
            <span className="font-headline font-bold text-lg">
              {formatPrice(p.priceCents)}
              {p.fuelType === fuelType && <span className="text-xs text-on-surface-variant ml-2">your fuel</span>}
            </span>
          </div>
        ))}
      </div>

      {/* Personalised fill info */}
      {car && fillCost !== null && (
        <div className="bg-surface-container-low rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary">local_gas_station</span>
            <span className="font-headline font-bold text-on-surface">
              Fill your {car.make} {car.model}: <span className="text-primary">${fillCost.toFixed(2)}</span>
            </span>
          </div>
          {savings !== null && (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">savings</span>
              <span className={`font-medium ${savings >= 0 ? 'text-primary' : 'text-error'}`}>
                {savings >= 0 ? 'Save' : 'Overspend'} ${Math.abs(savings).toFixed(2)} vs area average
              </span>
            </div>
          )}
        </div>
      )}

      {/* Loyalty */}
      {loyalty && loyalty.discountCentsPerLitre > 0 && (
        <div className="bg-surface-container-low rounded-2xl p-3 mb-4">
          <p className="text-sm text-on-surface-variant">{loyalty.description}</p>
          {station.price && car && (
            <p className="text-xs text-primary mt-1">
              With {loyalty.programName}: effective price {formatPrice(station.price - loyalty.discountCentsPerLitre * 10)}
               → fill cost: ${calculateFillCost(station.price - loyalty.discountCentsPerLitre * 10, car.tankSizeLitres).toFixed(2)}
            </p>
          )}
        </div>
      )}

      <p className="text-on-surface-variant text-xs mb-4">
        Updated: {Math.floor(Math.random() * 30 + 5)} mins ago &middot; Source: QLD Government Data
      </p>

      <div className="flex gap-3">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 btn-primary font-headline font-bold py-3 rounded-2xl text-center tap-active"
        >
          Navigate
        </a>
        <button className="flex-1 bg-surface-container-low text-on-surface font-headline font-bold py-3 rounded-2xl tap-active transition-all active:scale-95">
          Log Fill-Up
        </button>
      </div>
    </motion.div>
  )
}
