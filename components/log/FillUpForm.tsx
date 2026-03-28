'use client'

import { useState, useEffect, useMemo } from 'react'
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

  // Quick-fill suggestion
  const typicalLitres = car ? Math.round(car.tankSizeLitres * 0.65) : 65
  const avgPriceCpl = (areaAverage / 10).toFixed(1)

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

  // Live running total calculation
  const runningTotal = useMemo(() => {
    const l = parseFloat(litres)
    const p = parseFloat(priceCpl)
    if (l > 0 && p > 0) {
      return ((l * p) / 100).toFixed(2)
    }
    return null
  }, [litres, priceCpl])

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
      {/* Quick-fill suggestion */}
      {car && (
        <div className="bg-tint/8 rounded-[14px] px-4 py-3 flex items-start gap-3">
          <span className="text-[20px] mt-0.5">💡</span>
          <p className="text-text-secondary text-[13px] leading-snug">
            Based on your {car.make} {car.model}, a typical fill is <span className="font-display font-bold text-text-primary">~{typicalLitres}L</span> at the current avg of <span className="font-display font-bold text-text-primary">{avgPriceCpl}c/L</span>
          </p>
        </div>
      )}

      {/* Step 1: Station */}
      <div className="card bg-surface rounded-[14px] p-4">
        <h3 className="font-display font-bold text-[11px] text-text-muted mb-3 uppercase tracking-widest">Station</h3>
        {nearestStations.length > 0 && !stationId && (
          <div className="mb-3">
            <p className="text-[11px] text-text-muted mb-2 uppercase tracking-widest font-display font-bold">Nearest to you</p>
            {nearestStations.slice(0, 3).map((s, i) => (
              <button
                key={s.id}
                onClick={() => { setStationId(s.id); setStationName(s.name) }}
                className="w-full text-left py-3 px-0 tap-active flex items-center justify-between active:scale-[0.98]"
                style={i < 2 ? { borderBottom: '0.5px solid #d1d1d6' } : {}}
              >
                <span className="text-[15px] font-medium text-text-primary">{s.name}</span>
                <span className="text-[11px] text-text-muted">{s.dist}km</span>
              </button>
            ))}
          </div>
        )}
        {stationId ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[15px] text-text-primary">{stationName}</p>
              <p className="text-[11px] text-text-secondary">Selected</p>
            </div>
            <button onClick={() => { setStationId(''); setStationName(''); setPriceCpl('') }} className="text-tint text-[15px] tap-active">Change</button>
          </div>
        ) : (
          <select
            value={stationId}
            onChange={(e) => {
              const s = STATIONS.find(st => st.id === e.target.value)
              if (s) { setStationId(s.id); setStationName(s.name) }
            }}
            className="w-full bg-white rounded-[10px] px-4 py-3 text-text-primary text-[15px] appearance-none focus:outline-none focus:ring-2 focus:ring-tint/20 transition-all"
            style={{ borderBottom: '0.5px solid #d1d1d6' }}
          >
            <option value="">Search or select station...</option>
            {STATIONS.sort((a, b) => a.name.localeCompare(b.name)).map(s => (
              <option key={s.id} value={s.id}>{s.name} — {s.suburb}</option>
            ))}
          </select>
        )}
      </div>

      {/* Step 2: Fill details */}
      <div className="card bg-surface rounded-[14px] p-4">
        <h3 className="font-display font-bold text-[11px] text-text-muted mb-3 uppercase tracking-widest">Fill Details</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-text-muted text-[11px] mb-1 block uppercase tracking-widest font-display">Litres</label>
            <input
              type="number"
              inputMode="decimal"
              value={litres}
              onChange={(e) => { setLitres(e.target.value); if (priceCpl) setTotalDollars('') }}
              placeholder="65.0"
              step="0.1"
              className="w-full bg-white rounded-[10px] px-3 py-4 text-text-primary text-center font-display font-bold text-2xl focus:outline-none focus:ring-2 focus:ring-tint/20 transition-all"
              style={{ borderBottom: '0.5px solid #d1d1d6' }}
            />
          </div>
          <div>
            <label className="text-text-muted text-[11px] mb-1 block uppercase tracking-widest font-display">c/L</label>
            <input
              type="number"
              inputMode="decimal"
              value={priceCpl}
              onChange={(e) => { setPriceCpl(e.target.value); if (litres) setTotalDollars('') }}
              placeholder="178.9"
              step="0.1"
              className="w-full bg-white rounded-[10px] px-3 py-4 text-text-primary text-center font-display font-bold text-2xl focus:outline-none focus:ring-2 focus:ring-tint/20 transition-all"
              style={{ borderBottom: '0.5px solid #d1d1d6' }}
            />
          </div>
          <div>
            <label className="text-text-muted text-[11px] mb-1 block uppercase tracking-widest font-display">Total $</label>
            <input
              type="number"
              inputMode="decimal"
              value={totalDollars}
              onChange={(e) => { setTotalDollars(e.target.value); if (litres) setPriceCpl('') }}
              placeholder="116.29"
              step="0.01"
              className="w-full bg-white rounded-[10px] px-3 py-4 text-text-primary text-center font-display font-bold text-2xl focus:outline-none focus:ring-2 focus:ring-tint/20 transition-all"
              style={{ borderBottom: '0.5px solid #d1d1d6' }}
            />
          </div>
        </div>

        {/* Live running total */}
        {runningTotal && !totalDollars && (
          <div className="mt-3 pt-3" style={{ borderTop: '0.5px solid #d1d1d6' }}>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-[13px]">Estimated total</span>
              <span className="font-display font-bold text-text-primary text-[17px]">${runningTotal}</span>
            </div>
          </div>
        )}
      </div>

      {/* Step 3: Optional extras */}
      <div className="card bg-surface rounded-[14px] p-4">
        <h3 className="font-display font-bold text-[11px] text-text-muted mb-3 uppercase tracking-widest">Optional</h3>
        <div className="space-y-0">
          <div className="py-3" style={{ borderBottom: '0.5px solid #d1d1d6' }}>
            <label className="text-text-muted text-[11px] mb-1 block uppercase tracking-widest font-display">Odometer (km)</label>
            <input
              type="number"
              inputMode="numeric"
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
              placeholder="45,230"
              className="w-full bg-white rounded-[10px] px-4 py-3 text-text-primary text-[15px] focus:outline-none focus:ring-2 focus:ring-tint/20 transition-all"
              style={{ borderBottom: '0.5px solid #d1d1d6' }}
            />
          </div>
          <div className="flex items-center justify-between py-3" style={{ borderBottom: '0.5px solid #d1d1d6' }}>
            <span className="text-[15px] text-text-primary">Full tank?</span>
            <button
              onClick={() => setIsFullTank(!isFullTank)}
              className={`w-[51px] h-[31px] rounded-full transition-all ${isFullTank ? 'bg-tint' : 'bg-surface-high'}`}
            >
              <div className={`w-[27px] h-[27px] rounded-full bg-white transition-transform shadow-sm ${isFullTank ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
            </button>
          </div>
          <div className="py-3">
            <label className="text-text-muted text-[11px] mb-1 block uppercase tracking-widest font-display">Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
              className="w-full bg-white rounded-[10px] px-4 py-3 text-text-primary text-[15px] focus:outline-none focus:ring-2 focus:ring-tint/20 transition-all"
              style={{ borderBottom: '0.5px solid #d1d1d6' }}
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!litres || !priceCpl}
        className="w-full bg-tint text-white font-display font-bold text-[15px] py-4 rounded-[14px] tap-active disabled:opacity-30"
      >
        Log Fill-Up
      </button>
    </div>
  )
}
