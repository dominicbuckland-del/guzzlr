'use client'

import { useEffect, useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useGuzzlrStore } from '@/lib/store'
import { STATIONS } from '@/seed/stations'
import { getCachedLatestPrices, getCachedAreaAverage } from '@/lib/price-cache'
import { distanceKm, formatPrice, calculateFillCost, calculateSavings } from '@/lib/calculations'
import StationDetail from '@/components/map/StationDetail'

interface Props {
  fuelType: string
  brandFilter: string[]
}

function createMarkerIcon(brightness: 'cheap' | 'mid' | 'expensive', isSelected = false) {
  const color = brightness === 'cheap' ? '#34C759' : brightness === 'expensive' ? '#FF3B30' : '#1d1d1f'
  const size = isSelected ? 32 : 24
  const innerSize = isSelected ? 8 : 6
  const pulseRing = isSelected
    ? `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${size + 16}px;height:${size + 16}px;border-radius:50%;background:${color};opacity:0.2;animation:guzzlr-pulse 1.5s ease-in-out infinite"></div>`
    : ''
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:${size + 16}px;height:${size + 16}px;display:flex;align-items:center;justify-content:center">${pulseRing}<div style="position:relative;z-index:1;width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2.5px solid #ffffff;box-shadow:0 1px 6px rgba(0,0,0,${isSelected ? '0.25' : '0.15'});display:flex;align-items:center;justify-content:center;transition:all 0.2s ease"><div style="width:${innerSize}px;height:${innerSize}px;border-radius:50%;background:#ffffff"></div></div></div>`,
    iconSize: [size + 16, size + 16],
    iconAnchor: [(size + 16) / 2, (size + 16) / 2],
    popupAnchor: [0, -(size + 16) / 2],
  })
}

function LocateMeButton() {
  const { userLat, userLng } = useGuzzlrStore()
  const map = useMap()
  const handleClick = () => {
    if (userLat && userLng) map.flyTo([userLat, userLng], 13, { duration: 0.8 })
  }
  return (
    <button
      onClick={handleClick}
      aria-label="Locate me"
      style={{
        position: 'absolute', bottom: 24, right: 16, zIndex: 1000,
        width: 44, height: 44, borderRadius: 12,
        background: '#ffffff', border: 'none',
        boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="3" fill="#007AFF" />
        <circle cx="10" cy="10" r="7" stroke="#007AFF" strokeWidth="1.5" fill="none" />
        <line x1="10" y1="0" x2="10" y2="4" stroke="#007AFF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="10" y1="16" x2="10" y2="20" stroke="#007AFF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="0" y1="10" x2="4" y2="10" stroke="#007AFF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="16" y1="10" x2="20" y2="10" stroke="#007AFF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  )
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
    const latestPrices = getCachedLatestPrices()
    const avg = getCachedAreaAverage(fuelType)
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
      <style>{`@keyframes guzzlr-pulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.2}50%{transform:translate(-50%,-50%) scale(1.5);opacity:0}}`}</style>
      <MapContainer center={[userLat || -27.4698, userLng || 153.0251]} zoom={12} className="h-full w-full" zoomControl={false} style={{ height: '100%', width: '100%', background: '#f5f5f7' }}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; OSM &copy; CARTO' />
        <UserLocationMarker />
        {stations.map(station => (
          <Marker key={station.id} position={[station.latitude, station.longitude]} icon={createMarkerIcon(tier(station.price), station.id === selectedStation)} eventHandlers={{ click: () => setSelectedStation(station.id) }}>
            <Popup><div style={{ color: '#1d1d1f', padding: '4px', minWidth: '100px' }}><strong>{station.name}</strong><br /><span style={{ fontWeight: 700, fontSize: '16px' }}>{station.price ? formatPrice(station.price) : '--'}</span><span style={{ color: '#86868b', fontSize: '11px' }}> c/L</span></div></Popup>
          </Marker>
        ))}
        <LocateMeButton />
      </MapContainer>
      {/* Station count badge */}
      <div style={{
        position: 'absolute', top: 16, left: 16, zIndex: 1000,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 20, padding: '6px 14px',
        boxShadow: '0 1px 8px rgba(0,0,0,0.08)',
        fontSize: 13, fontWeight: 600, color: '#1d1d1f',
      }}>
        {stations.length} station{stations.length !== 1 ? 's' : ''} nearby
      </div>
      {selected && <StationDetail station={selected} areaAverage={areaAverage} fuelType={fuelType} onClose={() => setSelectedStation(null)} />}
    </div>
  )
}
