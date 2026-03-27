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
      <button onClick={onBack} className="text-text-secondary text-sm mb-6 self-start tap-active font-headline">
        Back
      </button>

      <h2 className="font-headline text-3xl font-bold text-white mb-2">Your commute</h2>
      <p className="text-text-secondary mb-8 font-body">So we can find the cheapest fuel on your route.</p>

      <div className="space-y-5">
        <div>
          <label className="text-text-muted text-xs mb-1 block uppercase tracking-widest font-headline">Where&apos;s home?</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={homePostcode}
              onChange={(e) => setHomePostcode(e.target.value)}
              placeholder="Postcode"
              className="flex-1 bg-surface-high border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
            />
            <button
              onClick={requestLocation}
              className={`px-4 py-3 rounded-xl transition-all tap-active active:scale-[0.98] ${
                locationGranted
                  ? 'bg-surface-high text-success border border-surface-border'
                  : 'bg-surface-high border border-surface-border text-text-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-xl">my_location</span>
            </button>
          </div>
          {locationGranted && (
            <p className="text-success text-xs mt-1 font-headline">Location detected</p>
          )}
        </div>

        <div>
          <label className="text-text-muted text-xs mb-1 block uppercase tracking-widest font-headline">Where do you work? (optional)</label>
          <input
            type="text"
            value={workPostcode}
            onChange={(e) => setWorkPostcode(e.target.value)}
            placeholder="Suburb or postcode"
            className="w-full bg-surface-high border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
          />
        </div>

        <div>
          <label className="text-text-muted text-xs mb-2 block uppercase tracking-widest font-headline">
            How far do you usually search? <span className="text-white font-headline font-bold">{radius}km</span>
          </label>
          <div className="flex gap-2">
            {radiusOptions.map((r) => (
              <button
                key={r}
                onClick={() => setRadius(r)}
                className={`flex-1 py-2 rounded-full font-headline font-bold text-sm transition-all tap-active active:scale-[0.98] ${
                  radius === r
                    ? 'bg-white text-black'
                    : 'bg-surface-high border border-surface-border text-text-muted'
                }`}
              >
                {r}km
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-text-muted text-xs mb-1 block uppercase tracking-widest font-headline">Daily commute distance (optional)</label>
          <div className="relative">
            <input
              type="number"
              value={commute}
              onChange={(e) => setCommute(e.target.value)}
              placeholder="e.g. 25"
              className="w-full bg-surface-high border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">km</span>
          </div>
        </div>
      </div>

      <div className="mt-auto pb-8">
        <button
          onClick={handleComplete}
          className="w-full bg-white text-black font-headline font-bold text-lg py-4 rounded-full tap-active transition-all active:scale-[0.98]"
        >
          Start Saving
        </button>
      </div>
    </div>
  )
}
