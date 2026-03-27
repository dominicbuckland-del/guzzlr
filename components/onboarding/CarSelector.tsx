'use client'

import { useState, useEffect } from 'react'
import { useGuzzlrStore } from '@/lib/store'
import { getUniqueMakes, getModelsByMake, getYearsByMakeModel, getCarSpecs } from '@/lib/car-data'

interface Props {
  onNext: () => void
  onBack: () => void
}

const vehicleIcons: Record<string, string> = {
  sedan: '🚗',
  suv: '🚙',
  ute: '🛻',
  hatch: '🚗',
  van: '🚐',
}

export default function CarSelector({ onNext, onBack }: Props) {
  const { setCar, car } = useGuzzlrStore()
  const [make, setMake] = useState(car?.make || '')
  const [model, setModel] = useState(car?.model || '')
  const [year, setYear] = useState<number | ''>(car?.year || '')

  const makes = getUniqueMakes()
  const models = make ? getModelsByMake(make) : []
  const years = make && model ? getYearsByMakeModel(make, model) : []

  const specs = make && model && year ? getCarSpecs(make, model, Number(year)) : null

  useEffect(() => {
    setModel('')
    setYear('')
  }, [make])

  useEffect(() => {
    setYear('')
  }, [model])

  const handleNext = () => {
    if (specs && year) {
      setCar({
        id: 'car-001',
        userId: 'demo-user-001',
        year: Number(year),
        make: specs.make,
        model: specs.model,
        fuelType: specs.fuelType,
        tankSizeLitres: specs.tankSizeLitres,
        ratedEconomyL100km: specs.ratedEconomyL100km,
        vehicleType: specs.vehicleType,
        isActive: true,
      })
      onNext()
    }
  }

  return (
    <div className="flex flex-col min-h-[80vh] px-6 pt-12">
      <button onClick={onBack} className="text-tint text-[15px] mb-6 self-start tap-active font-display">
        Back
      </button>

      <h2 className="font-display text-[28px] font-bold text-text-primary mb-2">What do you drive?</h2>
      <p className="text-text-secondary text-[15px] mb-8">We&apos;ll personalise everything to your car.</p>

      <div className="space-y-4">
        <div>
          <label className="text-text-muted text-[11px] mb-1 block uppercase tracking-widest font-display">Make</label>
          <select
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="w-full bg-white rounded-[10px] px-4 py-3 text-text-primary text-[15px] appearance-none focus:outline-none focus:ring-2 focus:ring-tint/20 transition-all"
            style={{ borderBottom: '0.5px solid #d1d1d6' }}
          >
            <option value="">Select make...</option>
            {makes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-text-muted text-[11px] mb-1 block uppercase tracking-widest font-display">Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!make}
            className="w-full bg-white rounded-[10px] px-4 py-3 text-text-primary text-[15px] appearance-none focus:outline-none focus:ring-2 focus:ring-tint/20 transition-all disabled:opacity-40"
            style={{ borderBottom: '0.5px solid #d1d1d6' }}
          >
            <option value="">Select model...</option>
            {models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-text-muted text-[11px] mb-1 block uppercase tracking-widest font-display">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            disabled={!model}
            className="w-full bg-white rounded-[10px] px-4 py-3 text-text-primary text-[15px] appearance-none focus:outline-none focus:ring-2 focus:ring-tint/20 transition-all disabled:opacity-40"
            style={{ borderBottom: '0.5px solid #d1d1d6' }}
          >
            <option value="">Select year...</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {specs && (
        <div className="mt-6 card bg-surface rounded-[14px] p-4 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{vehicleIcons[specs.vehicleType] || '🚗'}</span>
            <div>
              <p className="font-display font-bold text-[17px] text-text-primary">{year} {specs.make} {specs.model}</p>
              <p className="text-text-secondary text-[13px]">{specs.vehicleType.charAt(0).toUpperCase() + specs.vehicleType.slice(1)}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-surface-high rounded-[12px] p-2">
              <p className="text-text-primary font-display font-bold text-[15px]">{specs.tankSizeLitres}L</p>
              <p className="text-text-muted text-[11px] uppercase tracking-widest font-display">Tank</p>
            </div>
            <div className="bg-surface-high rounded-[12px] p-2">
              <p className="text-text-primary font-display font-bold text-[15px]">{specs.fuelType}</p>
              <p className="text-text-muted text-[11px] uppercase tracking-widest font-display">Fuel</p>
            </div>
            <div className="bg-surface-high rounded-[12px] p-2">
              <p className="text-text-primary font-display font-bold text-[15px]">{specs.ratedEconomyL100km}</p>
              <p className="text-text-muted text-[11px] uppercase tracking-widest font-display">L/100km</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-auto pb-8">
        <button
          onClick={handleNext}
          disabled={!specs}
          className="w-full bg-tint text-white font-display font-bold text-[17px] py-4 rounded-full tap-active transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
