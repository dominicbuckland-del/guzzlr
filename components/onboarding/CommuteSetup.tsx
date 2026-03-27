'use client'

import { useState } from 'react'
import { useGuzzlrStore } from '@/lib/store'

interface Props {
  onComplete: () => void
  onBack: () => void
}

const radiusOptions = [5, 10, 15, 20]

export default function CommuteSetup({ onComplete, onBack }: Props) {
  const { setUser, setUserLocation } = useGuzzlrStore()
  const [homePostcode, setHomePostcode] = useState('4000')
  const [workPostcode, setWorkPostcode] = useState('')
  const [radius, setRadius] = useState(10)
  const [commute, setCommute] = useState('')
  const [locationGranted, setLocationGranted] = useState(false)

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation(pos.coords.latitude, pos.coords.longitude)
          setLocationGranted(true)
        },
        () => {
          // Fallback to Brisbane CBD
          setUserLocation(-27.4698, 153.0251)
        }
      )
    }
  }

  const handleComplete = () => {
    setUser({
      homePostcode,
      homeLat: -27.4698,
      homeLng: 153.0251,
      workPostcode: workPostcode || undefined,
      searchRadiusKm: radius,
      commuteDistanceKm: commute ? Number(commute) : undefined,
    })
    if (!locationGranted) {
      setUserLocation(-27.4698, 153.0251)
    }
    onComplete()
  }

  return (
    <div className="flex flex-col min-h-[80vh] px-6 pt-12">
      <button onClick={onBack} className="text-tint text-[15px] mb-6 self-start tap-active font-display">
        Back
      </button>

      <h2 className="font-display text-[28px] font-bold text-text-primary mb-2">Your commute</h2>
      <p className="text-text-secondary text-[15px] mb-8">So we can find the cheapest fuel on your route.</p>

      <div className="space-y-5">
        <div>
          <label className="text-text-muted text-[11px] mb-1 block uppercase tracking-widest font-display">Where&apos;s home?</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={homePostcode}
              onChange={(e) => setHomePostcode(e.target.value)}
              placeholder="Postcode"
              className="flex-1 bg-white rounded-[10px] px-4 py-3 text-text-primary text-[15px] focus:outline-none focus:ring-2 focus:ring-tint/20 transition-all"
              style={{ borderBottom: '0.5px solid #d1d1d6' }}
            />
            <button
              onClick={requestLocation}
              className={`px-4 py-3 rounded-[10px] transition-all tap-active active:scale-[0.98] ${
                locationGranted
                  ? 'bg-surface text-success'
                  : 'bg-surface text-text-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-xl">my_location</span>
            </button>
          </div>
          {locationGranted && (
            <p className="text-success text-[11px] mt-1 font-display">Location detected</p>
          )}
        </div>

        <div>
          <label className="text-text-muted text-[11px] mb-1 block uppercase tracking-widest font-display">Where do you work? (optional)</label>
          <input
            type="text"
            value={workPostcode}
            onChange={(e) => setWorkPostcode(e.target.value)}
            placeholder="Suburb or postcode"
            className="w-full bg-white rounded-[10px] px-4 py-3 text-text-primary text-[15px] focus:outline-none focus:ring-2 focus:ring-tint/20 transition-all"
            style={{ borderBottom: '0.5px solid #d1d1d6' }}
          />
        </div>

        <div>
          <label className="text-text-muted text-[11px] mb-2 block uppercase tracking-widest font-display">
            How far do you usually search? <span className="text-text-primary font-display font-bold">{radius}km</span>
          </label>
          <div className="flex gap-2">
            {radiusOptions.map((r) => (
              <button
                key={r}
                onClick={() => setRadius(r)}
                className={`flex-1 py-2 rounded-full font-display font-bold text-[13px] transition-all tap-active active:scale-[0.98] ${
                  radius === r
                    ? 'bg-text-primary text-white'
                    : 'bg-surface text-text-muted'
                }`}
              >
                {r}km
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-text-muted text-[11px] mb-1 block uppercase tracking-widest font-display">Daily commute distance (optional)</label>
          <div className="relative">
            <input
              type="number"
              value={commute}
              onChange={(e) => setCommute(e.target.value)}
              placeholder="e.g. 25"
              className="w-full bg-white rounded-[10px] px-4 py-3 text-text-primary text-[15px] focus:outline-none focus:ring-2 focus:ring-tint/20 transition-all pr-12"
              style={{ borderBottom: '0.5px solid #d1d1d6' }}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-[13px]">km</span>
          </div>
        </div>
      </div>

      <div className="mt-auto pb-8">
        <button
          onClick={handleComplete}
          className="w-full bg-tint text-white font-display font-bold text-[17px] py-4 rounded-full tap-active transition-all active:scale-[0.98]"
        >
          Start Saving
        </button>
      </div>
    </div>
  )
}
