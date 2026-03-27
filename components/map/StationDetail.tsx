/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { motion } from 'framer-motion'
import { useGuzzlrStore } from '@/lib/store'
import { formatPrice, calculateFillCost, calculateSavings } from '@/lib/calculations'
import { getLoyaltyForBrand } from '@/lib/loyalty-data'

interface Props { station: any; areaAverage: number; fuelType: string; onClose: () => void }

export default function StationDetail({ station, areaAverage, fuelType, onClose }: Props) {
  const { car } = useGuzzlrStore()
  const loyalty = getLoyaltyForBrand(station.brand)
  const fillCost = car && station.price ? calculateFillCost(station.price, car.tankSizeLitres) : null
  const savings = car && station.price ? calculateSavings(station.price, areaAverage, car.tankSizeLitres) : null

  return (
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }}
      className="absolute bottom-0 left-0 right-0 z-[1000] bg-surface border-t border-surface-border rounded-t-2xl p-5 max-h-[60vh] overflow-y-auto">
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="font-headline text-lg font-bold">{station.name}</h3>
          <p className="text-text-secondary text-sm">{station.address}</p>
          <p className="text-text-muted text-xs">{station.distance}km away</p>
        </div>
        <button onClick={onClose} className="text-text-muted tap-active text-xl">x</button>
      </div>
      <div className="space-y-1.5 mb-4">
        {(station.allPrices || []).map((p: any) => (
          <div key={p.fuelType} className={`flex justify-between py-1 ${p.fuelType === fuelType ? 'text-white' : 'text-text-secondary'}`}>
            <span className="text-sm">{p.fuelType}</span>
            <span className="price-ticker">{formatPrice(p.priceCents)}{p.fuelType === fuelType && <span className="text-text-muted text-xs ml-2">yours</span>}</span>
          </div>
        ))}
      </div>
      {car && fillCost !== null && (
        <div className="bg-surface-high rounded-lg p-3 mb-4">
          <p className="text-sm">Fill {car.make} {car.model}: <span className="font-bold text-white">${fillCost.toFixed(2)}</span></p>
          {savings !== null && <p className={`text-sm font-bold ${savings >= 0 ? 'text-success' : 'text-error'}`}>{savings >= 0 ? 'Save' : 'Overspend'} ${Math.abs(savings).toFixed(2)}</p>}
        </div>
      )}
      {loyalty && loyalty.discountCentsPerLitre > 0 && (
        <p className="text-text-muted text-xs mb-4">{loyalty.description}</p>
      )}
      <div className="flex gap-3">
        <a href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-white text-black font-headline font-bold py-3 rounded-full text-center tap-active text-sm">Navigate</a>
        <button className="flex-1 bg-surface-high border border-surface-border text-white font-headline font-bold py-3 rounded-full tap-active text-sm">Log Fill</button>
      </div>
    </motion.div>
  )
}
