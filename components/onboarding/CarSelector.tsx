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
      <button onClick={onBack} className="text-text-secondary text-sm mb-6 self-start tap-active font-headline">
        Back
      </button>

      <h2 className="font-headline text-3xl font-bold text-white mb-2">What do you drive?</h2>
      <p className="text-text-secondary mb-8 font-body">We&apos;ll personalise everything to your car.</p>

      <div className="space-y-4">
        <div>
          <label className="text-text-muted text-xs mb-1 block uppercase tracking-widest font-headline">Make</label>
          <select
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="w-full bg-surface-high border border-surface-border rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
          >
            <option value="">Select make...</option>
            {makes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-text-muted text-xs mb-1 block uppercase tracking-widest font-headline">Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!make}
            className="w-full bg-surface-high border border-surface-border rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-white/20 transition-all disabled:opacity-40"
          >
            <option value="">Select model...</option>
            {models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-text-muted text-xs mb-1 block uppercase tracking-widest font-headline">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            disabled={!model}
            className="w-full bg-surface-high border border-surface-border rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-white/20 transition-all disabled:opacity-40"
          >
            <option value="">Select year...</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {specs && (
        <div className="mt-6 card p-4 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{vehicleIcons[specs.vehicleType] || '🚗'}</span>
            <div>
              <p className="font-headline font-bold text-lg text-white">{year} {specs.make} {specs.model}</p>
              <p className="text-text-secondary text-sm">{specs.vehicleType.charAt(0).toUpperCase() + specs.vehicleType.slice(1)}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-bg rounded-xl p-2">
              <p className="text-white font-headline font-bold">{specs.tankSizeLitres}L</p>
              <p className="text-text-muted text-xs uppercase tracking-widest font-headline">Tank</p>
            </div>
            <div className="bg-bg rounded-xl p-2">
              <p className="text-white font-headline font-bold">{specs.fuelType}</p>
              <p className="text-text-muted text-xs uppercase tracking-widest font-headline">Fuel</p>
            </div>
            <div className="bg-bg rounded-xl p-2">
              <p className="text-white font-headline font-bold">{specs.ratedEconomyL100km}</p>
              <p className="text-text-muted text-xs uppercase tracking-widest font-headline">L/100km</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-auto pb-8">
        <button
          onClick={handleNext}
          disabled={!specs}
          className="w-full bg-white text-black font-headline font-bold text-lg py-4 rounded-full tap-active transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
