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
        <div className="flex bg-surface rounded-[10px] p-[3px]">
          {(['map', 'list'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} className={`px-3.5 py-[7px] rounded-[8px] text-[13px] font-bold capitalize transition-colors ${view === v ? 'bg-text-primary text-white' : 'text-text-secondary'}`}>{v}</button>
          ))}
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar flex-1">
          {FUEL_TYPES.map(ft => (
            <button key={ft} onClick={() => setFuelType(ft === active ? '' : ft)} className={`px-3 py-[7px] rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${ft === active ? 'bg-text-primary text-white' : 'bg-surface text-text-secondary'}`}>{ft}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
