'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import MapFilters from '@/components/map/MapFilters'
import StationList from '@/components/map/StationList'

const FuelMap = dynamic(() => import('@/components/map/FuelMap'), {
  ssr: false,
  loading: () => <div className="flex-1 bg-bg flex items-center justify-center text-text-muted text-[15px]">Loading map...</div>,
})

export default function MapPage() {
  const [view, setView] = useState<'map' | 'list'>('map')
  const [fuelType, setFuelType] = useState<string>('')
  const [brandFilter] = useState<string[]>([])

  return (
    <div className="flex flex-col h-[calc(100dvh-80px)] bg-bg">
      <MapFilters view={view} setView={setView} fuelType={fuelType} setFuelType={setFuelType} />
      {view === 'map' ? (
        <FuelMap fuelType={fuelType} brandFilter={brandFilter} />
      ) : (
        <StationList fuelType={fuelType} brandFilter={brandFilter} />
      )}
    </div>
  )
}
