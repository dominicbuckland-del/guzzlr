'use client'

import { useState, useEffect } from 'react'
import { useGuzzlrStore } from '@/lib/store'
import { STATIONS } from '@/seed/stations'
import { generatePriceHistory, getLatestPrices, getAreaAverage } from '@/seed/prices'
import { distanceKm } from '@/lib/calculations'
import { XP_LOG_FILLUP, XP_BEAT_AVERAGE, XP_CYCLE_LOW_FILL } from '@/lib/constants'
import { getCycleState } from '@/lib/cycle-engine'
import FillConfirmation from '@/components/log/FillConfirmation'

export default function FillUpForm() {
  const { car, user, userLat, userLng, addFillup, addXp, updateStreak, addSavings, addFeedItem } = useGuzzlrStore()
  const [stationId, setStationId] = useState('')
  const [stationName, setStationName] = useState('')
  const [litres, setLitres] = useState('')
  const [priceCpl, setPriceCpl] = useState('')
  const [totalDollars, setTotalDollars] = useState('')
  const [odometer, setOdometer] = useState('')
  const [isFullTank, setIsFullTank] = useState(true)
  const [notes, setNotes] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [confirmData, setConfirmData] = useState<any>(null)

  // Find nearest station
  const nearestStations = STATIONS
    .map(s => ({
      ...s,
      dist: distanceKm(userLat || -27.47, userLng || 153.03, s.latitude, s.longitude)
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 5)

  // Get latest prices for suggestion
  const allPrices = generatePriceHistory(STATIONS)
  const latestPrices = getLatestPrices(allPrices)
  const fuelType = car?.fuelType || 'Diesel'
  const areaAverage = getAreaAverage(latestPrices, fuelType)

  useEffect(() => {
    if (stationId) {
      const stationPrice = latestPrices.find(p => p.stationId === stationId && p.fuelType === fuelType)
      if (stationPrice && !priceCpl) {
        setPriceCpl((stationPrice.priceCents / 10).toFixed(1))
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationId])

  // Auto-calculate third value
  useEffect(() => {
    const l = parseFloat(litres)
    const p = parseFloat(priceCpl)
    const t = parseFloat(totalDollars)

    if (l && p && !totalDollars) {
      setTotalDollars(((l * p) / 100).toFixed(2))
    } else if (l && t && !priceCpl) {
      setPriceCpl(((t / l) * 100).toFixed(1))
    } else if (p && t && !litres) {
      setLitres(((t * 100) / p).toFixed(1))
    }
  }, [litres, priceCpl, totalDollars])

  const handleSubmit = () => {
    const l = parseFloat(litres) || 0
    const p = Math.round(parseFloat(priceCpl) * 10) || 0
    const t = Math.round(parseFloat(totalDollars) * 100) || 0
    const savedCents = Math.round((areaAverage - p) * l / 10)
    const beatAverage = savedCents > 0

    // XP calculation
    let xp = XP_LOG_FILLUP
    if (beatAverage) xp += XP_BEAT_AVERAGE
    const cycle = getCycleState('brisbane', car?.tankSizeLitres || 80)
    if (cycle.phase === 'bottom') xp += XP_CYCLE_LOW_FILL

    const fillup = {
      id: `fill-${Date.now()}`,
      userId: user.id,
      carId: car?.id || 'car-001',
      stationId: stationId || undefined,
      stationName: stationName || 'Unknown Station',
      litres: l,
      pricePerLitreCents: p,
      totalCostCents: t,
      odometerKm: odometer ? parseInt(odometer) : undefined,
      isFullTank,
      areaAveragePriceCents: areaAverage,
      savedCents,
      xpEarned: xp,
      notes: notes || undefined,
      filledAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }

    addFillup(fillup)
    addXp(xp)
    updateStreak(beatAverage)
    if (savedCents > 0) addSavings(savedCents)

    addFeedItem({
      id: `feed-${Date.now()}`,
      type: 'saving',
      icon: beatAverage ? '⛽' : '📝',
      message: beatAverage
        ? `You saved $${(savedCents / 100).toFixed(2)} at ${stationName}`
        : `Fill-up logged at ${stationName}`,
      timestamp: new Date().toISOString(),
    })

    setConfirmData({
      ...fillup,
      beatAverage,
      xp,
      savedDollars: savedCents / 100,
      percentVsAvg: ((p - areaAverage) / areaAverage * 100).toFixed(1),
      newStreak: beatAverage ? user.streakCount + 1 : 0,
    })
    setShowConfirmation(true)
  }

  if (showConfirmation && confirmData) {
    return <FillConfirmation data={confirmData} onDone={() => {
      setShowConfirmation(false)
      setStationId('')
      setStationName('')
      setLitres('')
      setPriceCpl('')
      setTotalDollars('')
      setOdometer('')
      setNotes('')
    }} />
  }

  return (
    <div className="space-y-4">
      {/* Step 1: Station */}
      <div className="glass-card p-4">
        <h3 className="font-heading font-bold text-sm text-text-secondary mb-3">Station</h3>
        {nearestStations.length > 0 && !stationId && (
          <div className="mb-3 p-3 bg-background rounded-xl border border-primary/20">
            <p className="text-xs text-text-secondary mb-2">Nearest to you:</p>
            {nearestStations.slice(0, 3).map(s => (
              <button
                key={s.id}
                onClick={() => { setStationId(s.id); setStationName(s.name) }}
                className="w-full text-left py-2 px-2 rounded-lg hover:bg-surface transition-colors tap-active flex items-center justify-between"
              >
                <span className="text-sm font-medium">{s.name}</span>
                <span className="text-xs text-text-secondary">{s.dist}km</span>
              </button>
            ))}
          </div>
        )}
        {stationId ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{stationName}</p>
              <p className="text-xs text-primary">Selected</p>
            </div>
            <button onClick={() => { setStationId(''); setStationName(''); setPriceCpl('') }} className="text-text-secondary text-sm tap-active">Change</button>
          </div>
        ) : (
          <select
            value={stationId}
            onChange={(e) => {
              const s = STATIONS.find(st => st.id === e.target.value)
              if (s) { setStationId(s.id); setStationName(s.name) }
            }}
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-text-primary appearance-none"
          >
            <option value="">Search or select station...</option>
            {STATIONS.sort((a, b) => a.name.localeCompare(b.name)).map(s => (
              <option key={s.id} value={s.id}>{s.name} — {s.suburb}</option>
            ))}
          </select>
        )}
      </div>

      {/* Step 2: Fill details */}
      <div className="glass-card p-4">
        <h3 className="font-heading font-bold text-sm text-text-secondary mb-3">Fill Details</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-text-secondary text-xs mb-1 block">Litres</label>
            <input
              type="number"
              value={litres}
              onChange={(e) => { setLitres(e.target.value); if (priceCpl) setTotalDollars('') }}
              placeholder="65.0"
              step="0.1"
              className="w-full bg-surface border border-surface-border rounded-xl px-3 py-3 text-text-primary text-center font-heading font-bold text-lg focus:outline-none focus:border-primary/50"
            />
          </div>
          <div>
            <label className="text-text-secondary text-xs mb-1 block">Price (c/L)</label>
            <input
              type="number"
              value={priceCpl}
              onChange={(e) => { setPriceCpl(e.target.value); if (litres) setTotalDollars('') }}
              placeholder="178.9"
              step="0.1"
              className="w-full bg-surface border border-surface-border rounded-xl px-3 py-3 text-text-primary text-center font-heading font-bold text-lg focus:outline-none focus:border-primary/50"
            />
          </div>
          <div>
            <label className="text-text-secondary text-xs mb-1 block">Total ($)</label>
            <input
              type="number"
              value={totalDollars}
              onChange={(e) => { setTotalDollars(e.target.value); if (litres) setPriceCpl('') }}
              placeholder="116.29"
              step="0.01"
              className="w-full bg-surface border border-surface-border rounded-xl px-3 py-3 text-text-primary text-center font-heading font-bold text-lg focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>
      </div>

      {/* Step 3: Optional extras */}
      <div className="glass-card p-4">
        <h3 className="font-heading font-bold text-sm text-text-secondary mb-3">Optional</h3>
        <div className="space-y-3">
          <div>
            <label className="text-text-secondary text-xs mb-1 block">Odometer (km)</label>
            <input
              type="number"
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
              placeholder="45,230"
              className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary/50"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Full tank?</span>
            <button
              onClick={() => setIsFullTank(!isFullTank)}
              className={`w-12 h-7 rounded-full transition-colors ${isFullTank ? 'bg-primary' : 'bg-surface-border'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isFullTank ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div>
            <label className="text-text-secondary text-xs mb-1 block">Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
              className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!litres || !priceCpl}
        className="w-full bg-primary text-background font-heading font-bold text-lg py-4 rounded-2xl tap-active hover:bg-primary/90 transition-colors disabled:opacity-30"
      >
        Log Fill-Up
      </button>
    </div>
  )
}
