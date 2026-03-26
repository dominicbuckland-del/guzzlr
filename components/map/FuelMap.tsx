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

function createMarkerIcon(color: string) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:3px solid ${color === '#00FF6A' ? 'rgba(0,255,106,0.3)' : color === '#FF3B3B' ? 'rgba(255,59,59,0.3)' : 'rgba(255,184,0,0.3)'};box-shadow:0 0 8px ${color}40;display:flex;align-items:center;justify-content:center"><div style="width:8px;height:8px;border-radius:50%;background:#fff"></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  })
}

function UserLocationMarker() {
  const { userLat, userLng } = useGuzzlrStore()
  const map = useMap()

  useEffect(() => {
    if (userLat && userLng) {
      map.setView([userLat, userLng], 12)
    }
  }, [userLat, userLng, map])

  if (!userLat || !userLng) return null

  return (
    <Circle
      center={[userLat, userLng]}
      radius={80}
      pathOptions={{ color: '#4A90D9', fillColor: '#4A90D9', fillOpacity: 0.8, weight: 2 }}
    />
  )
}

export default function FuelMap({ fuelType: fuelTypeOverride, brandFilter }: Props) {
  const { car, user, userLat, userLng } = useGuzzlrStore()
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  const fuelType = fuelTypeOverride || car?.fuelType || 'Diesel'

  const { stations, areaAverage } = useMemo(() => {
    const allPrices = generatePriceHistory(STATIONS)
    const latestPrices = getLatestPrices(allPrices)
    const avg = getAreaAverage(latestPrices, fuelType)

    const stationsData = STATIONS
      .map(s => {
        const price = latestPrices.find(p => p.stationId === s.id && p.fuelType === fuelType)
        const dist = distanceKm(userLat || -27.47, userLng || 153.03, s.latitude, s.longitude)
        return {
          ...s,
          price: price?.priceCents || null,
          distance: dist,
          allPrices: latestPrices.filter(p => p.stationId === s.id),
          fillCost: price && car ? calculateFillCost(price.priceCents, car.tankSizeLitres) : null,
          savings: price && car ? calculateSavings(price.priceCents, avg, car.tankSizeLitres) : null,
        }
      })
      .filter(s => s.distance <= (user.searchRadiusKm || 10))
      .filter(s => brandFilter.length === 0 || brandFilter.includes(s.brand))
      .filter(s => s.price !== null)

    return { stations: stationsData, areaAverage: avg }
  }, [fuelType, brandFilter, car, user, userLat, userLng])

  const pricesSorted = [...stations].sort((a, b) => (a.price || 9999) - (b.price || 9999))
  const cheapThreshold = pricesSorted[Math.floor(pricesSorted.length * 0.25)]?.price || 0
  const expensiveThreshold = pricesSorted[Math.floor(pricesSorted.length * 0.75)]?.price || 9999

  function getMarkerColor(price: number | null): string {
    if (!price) return '#8B8B8B'
    if (price <= cheapThreshold) return '#00FF6A'
    if (price >= expensiveThreshold) return '#FF3B3B'
    return '#FFB800'
  }

  const selected = selectedStation ? stations.find(s => s.id === selectedStation) : null

  return (
    <div className="flex-1 relative">
      <MapContainer
        center={[userLat || -27.4698, userLng || 153.0251]}
        zoom={12}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />
        <UserLocationMarker />
        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.latitude, station.longitude]}
            icon={createMarkerIcon(getMarkerColor(station.price))}
            eventHandlers={{
              click: () => setSelectedStation(station.id),
            }}
          >
            <Popup>
              <div style={{ color: '#FAFAFA', background: '#141416', padding: '4px', minWidth: '120px' }}>
                <strong>{station.name}</strong><br />
                <span style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: '#00FF6A' }}>
                  {station.price ? formatPrice(station.price) : 'N/A'}
                </span>
                <span style={{ color: '#8B8B8B', fontSize: '11px' }}> c/L</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {selected && (
        <StationDetail
          station={selected}
          areaAverage={areaAverage}
          fuelType={fuelType}
          onClose={() => setSelectedStation(null)}
        />
      )}
    </div>
  )
}
