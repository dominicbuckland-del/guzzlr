'use client'

import { useGuzzlrStore } from '@/lib/store'

const FUEL_TYPES = ['E10', '91', '95', '98', 'Diesel']

interface Props {
  view: 'map' | 'list'
  setView: (v: 'map' | 'list') => void
  fuelType: string
  setFuelType: (v: string) => void
}

export default function MapFilters({ view, setView, fuelType, setFuelType }: Props) {
  const { car } = useGuzzlrStore()
  const activeFuelType = fuelType || car?.fuelType || 'Diesel'

  return (
    <div className="px-4 pt-4 pb-2 space-y-2 bg-surface">
      {/* View toggle + fuel type */}
      <div className="flex items-center gap-2">
        <div className="flex bg-surface-container-low rounded-xl p-0.5">
          <button
            onClick={() => setView('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-headline font-bold tracking-widest uppercase transition-all ${
              view === 'map' ? 'bg-primary text-white' : 'text-on-surface-variant'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-headline font-bold tracking-widest uppercase transition-all ${
              view === 'list' ? 'bg-primary text-white' : 'text-on-surface-variant'
            }`}
          >
            List
          </button>
        </div>

        <div className="flex gap-1 overflow-x-auto no-scrollbar flex-1">
          {FUEL_TYPES.map((ft) => (
            <button
              key={ft}
              onClick={() => setFuelType(ft === activeFuelType ? '' : ft)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-headline font-bold whitespace-nowrap transition-all ${
                ft === activeFuelType
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-low text-on-surface-variant'
              }`}
            >
              {ft}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
