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
      className="absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-[16px] p-5 max-h-[60vh] overflow-y-auto"
      style={{ boxShadow: '0 -4px 24px rgba(0,0,0,0.08)' }}>
      <div className="w-9 h-[5px] rounded-full bg-surface-high mx-auto mb-4" />
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="font-display text-[17px] font-bold text-text-primary">{station.name}</h3>
          <p className="text-text-secondary text-[13px]">{station.address}</p>
          <p className="text-text-muted text-[11px]">{station.distance}km away</p>
        </div>
        <button onClick={onClose} className="text-text-muted tap-active text-[17px] w-8 h-8 flex items-center justify-center">x</button>
      </div>
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
      {loyalty && loyalty.discountCentsPerLitre > 0 && (
        <p className="text-text-muted text-[11px] mb-4">{loyalty.description}</p>
      )}
      <div className="flex gap-3">
        <a href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-tint text-white font-display font-bold py-3.5 rounded-full text-center tap-active text-[15px]">Navigate</a>
        <button className="flex-1 bg-surface text-text-secondary font-display font-bold py-3.5 rounded-full tap-active text-[15px]">Log Fill</button>
      </div>
    </motion.div>
  )
}
