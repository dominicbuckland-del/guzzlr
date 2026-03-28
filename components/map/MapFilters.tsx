'use client'

import { useGuzzlrStore } from '@/lib/store'

const FUEL_TYPES = ['E10', '91', '95', '98', 'Diesel']

export type SortMode = 'price' | 'distance'

interface Props { view: 'map' | 'list'; setView: (v: 'map' | 'list') => void; fuelType: string; setFuelType: (v: string) => void; sortMode: SortMode; setSortMode: (v: SortMode) => void }

export default function MapFilters({ view, setView, fuelType, setFuelType, sortMode, setSortMode }: Props) {
  const { car } = useGuzzlrStore()
  const active = fuelType || car?.fuelType || 'Diesel'

  return (
    <div className="px-4 pt-4 pb-2 space-y-2.5 bg-bg">
      <div className="flex items-center gap-2">
        <div className="flex bg-surface rounded-[10px] p-[3px]">
          {(['map', 'list'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} className={`px-3.5 py-[7px] rounded-[8px] text-[13px] font-bold capitalize transition-colors ${view === v ? 'bg-text-primary text-white' : 'text-text-secondary'}`}>{v}</button>
          ))}
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar flex-1">
          {FUEL_TYPES.map(ft => (
            <button key={ft} onClick={() => setFuelType(ft === active ? '' : ft)} className={`px-3 py-[7px] rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${ft === active ? 'text-[#007AFF] bg-[#007AFF]/10' : 'bg-surface text-text-secondary'}`}>{ft}</button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-text-muted text-[11px] font-medium mr-1">Sort</span>
        <div className="flex bg-surface rounded-[10px] p-[3px]">
          {(['price', 'distance'] as const).map(s => (
            <button key={s} onClick={() => setSortMode(s)} className={`px-3 py-[5px] rounded-[8px] text-[12px] font-bold capitalize transition-colors ${sortMode === s ? 'bg-white text-text-primary shadow-sm' : 'text-text-secondary'}`}>{s}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
