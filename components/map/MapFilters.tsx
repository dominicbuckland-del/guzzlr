'use client'

import { useGuzzlrStore } from '@/lib/store'

const FUEL_TYPES = ['E10', '91', '95', '98', 'Diesel']

interface Props { view: 'map' | 'list'; setView: (v: 'map' | 'list') => void; fuelType: string; setFuelType: (v: string) => void }

export default function MapFilters({ view, setView, fuelType, setFuelType }: Props) {
  const { car } = useGuzzlrStore()
  const active = fuelType || car?.fuelType || 'Diesel'

  return (
    <div className="px-4 pt-4 pb-2 space-y-2 bg-bg">
      <div className="flex items-center gap-2">
        <div className="flex bg-surface border border-surface-border rounded-lg p-0.5">
          {(['map', 'list'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-colors ${view === v ? 'bg-white text-black' : 'text-text-muted'}`}>{v}</button>
          ))}
        </div>
        <div className="flex gap-1 overflow-x-auto no-scrollbar flex-1">
          {FUEL_TYPES.map(ft => (
            <button key={ft} onClick={() => setFuelType(ft === active ? '' : ft)} className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${ft === active ? 'bg-white text-black' : 'bg-surface border border-surface-border text-text-muted'}`}>{ft}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
