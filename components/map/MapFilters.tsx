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
    <div className="px-4 pt-4 pb-2 space-y-2 bg-background">
      {/* View toggle + fuel type */}
      <div className="flex items-center gap-2">
        <div className="flex bg-surface rounded-lg p-0.5">
          <button
            onClick={() => setView('map')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              view === 'map' ? 'bg-primary text-background' : 'text-text-secondary'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              view === 'list' ? 'bg-primary text-background' : 'text-text-secondary'
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
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                ft === activeFuelType
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-surface text-text-secondary border border-surface-border'
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
