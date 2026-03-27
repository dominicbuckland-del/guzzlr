'use client'

import { useEffect, useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useGuzzlrStore } from '@/lib/store'
import { STATIONS } from '@/seed/stations'
import { generatePriceHistory, getLatestPrices, getAreaAverage } from '@/seed/prices'
import { distanceKm, formatPrice, calculateFillCost, calculateSavings } from '@/lib/calculations'
import StationDetail from '@/components/map/StationDetail'

interface Props {
  fuelType: string
  brandFilter: string[]
}

function createMarkerIcon(brightness: 'cheap' | 'mid' | 'expensive') {
  const color = brightness === 'cheap' ? '#34C759' : brightness === 'expensive' ? '#FF3B30' : '#1d1d1f'
  return L.divIcon({
    className: '',
    html: `<div style="width:24px;height:24px;border-radius:50%;background:${color};border:2px solid #ffffff;box-shadow:0 1px 4px rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center"><div style="width:6px;height:6px;border-radius:50%;background:#ffffff"></div></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  })
}

function UserLocationMarker() {
  const { userLat, userLng } = useGuzzlrStore()
  const map = useMap()
  useEffect(() => {
    if (userLat && userLng) map.setView([userLat, userLng], 12)
  }, [userLat, userLng, map])
  if (!userLat || !userLng) return null
  return <Circle center={[userLat, userLng]} radius={80} pathOptions={{ color: '#007AFF', fillColor: '#007AFF', fillOpacity: 0.3, weight: 2 }} />
}

export default function FuelMap({ fuelType: fuelTypeOverride, brandFilter }: Props) {
  const { car, user, userLat, userLng } = useGuzzlrStore()
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  const fuelType = fuelTypeOverride || car?.fuelType || 'Diesel'

  const { stations, areaAverage } = useMemo(() => {
    const allPrices = generatePriceHistory(STATIONS)
    const latestPrices = getLatestPrices(allPrices)
    const avg = getAreaAverage(latestPrices, fuelType)
    const data = STATIONS.map(s => {
      const price = latestPrices.find(p => p.stationId === s.id && p.fuelType === fuelType)
      const dist = distanceKm(userLat || -27.47, userLng || 153.03, s.latitude, s.longitude)
      return { ...s, price: price?.priceCents || null, distance: dist, allPrices: latestPrices.filter(p => p.stationId === s.id), fillCost: price && car ? calculateFillCost(price.priceCents, car.tankSizeLitres) : null, savings: price && car ? calculateSavings(price.priceCents, avg, car.tankSizeLitres) : null }
    }).filter(s => s.distance <= (user.searchRadiusKm || 10)).filter(s => brandFilter.length === 0 || brandFilter.includes(s.brand)).filter(s => s.price !== null)
    return { stations: data, areaAverage: avg }
  }, [fuelType, brandFilter, car, user, userLat, userLng])

  const sorted = [...stations].sort((a, b) => (a.price || 9999) - (b.price || 9999))
  const q25 = sorted[Math.floor(sorted.length * 0.25)]?.price || 0
  const q75 = sorted[Math.floor(sorted.length * 0.75)]?.price || 9999

  function tier(price: number | null): 'cheap' | 'mid' | 'expensive' {
    if (!price) return 'mid'
    if (price <= q25) return 'cheap'
    if (price >= q75) return 'expensive'
    return 'mid'
  }

  const selected = selectedStation ? stations.find(s => s.id === selectedStation) : null

  return (
    <div className="flex-1 relative" style={{ minHeight: '400px', height: '100%' }}>
      <MapContainer center={[userLat || -27.4698, userLng || 153.0251]} zoom={12} className="h-full w-full" zoomControl={false} style={{ height: '100%', width: '100%', background: '#f5f5f7' }}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; OSM &copy; CARTO' />
        <UserLocationMarker />
        {stations.map(station => (
          <Marker key={station.id} position={[station.latitude, station.longitude]} icon={createMarkerIcon(tier(station.price))} eventHandlers={{ click: () => setSelectedStation(station.id) }}>
            <Popup><div style={{ color: '#1d1d1f', padding: '4px', minWidth: '100px' }}><strong>{station.name}</strong><br /><span style={{ fontWeight: 700, fontSize: '16px' }}>{station.price ? formatPrice(station.price) : '--'}</span><span style={{ color: '#86868b', fontSize: '11px' }}> c/L</span></div></Popup>
          </Marker>
        ))}
      </MapContainer>
      {selected && <StationDetail station={selected} areaAverage={areaAverage} fuelType={fuelType} onClose={() => setSelectedStation(null)} />}
    </div>
  )
}
