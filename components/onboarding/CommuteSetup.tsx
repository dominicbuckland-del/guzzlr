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
      <button onClick={onBack} className="text-text-secondary text-sm mb-6 self-start tap-active">
        ← Back
      </button>

      <h2 className="font-heading text-3xl font-bold mb-2">Your commute</h2>
      <p className="text-text-secondary mb-8">So we can find the cheapest fuel on your route.</p>

      <div className="space-y-5">
        <div>
          <label className="text-text-secondary text-sm mb-1 block">Where&apos;s home?</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={homePostcode}
              onChange={(e) => setHomePostcode(e.target.value)}
              placeholder="Postcode"
              className="flex-1 bg-surface border border-surface-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
            />
            <button
              onClick={requestLocation}
              className={`px-4 py-3 rounded-xl border transition-colors tap-active ${
                locationGranted
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-surface border-surface-border text-text-secondary'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
              </svg>
            </button>
          </div>
          {locationGranted && (
            <p className="text-primary text-xs mt-1">Location detected</p>
          )}
        </div>

        <div>
          <label className="text-text-secondary text-sm mb-1 block">Where do you work? (optional)</label>
          <input
            type="text"
            value={workPostcode}
            onChange={(e) => setWorkPostcode(e.target.value)}
            placeholder="Suburb or postcode"
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <div>
          <label className="text-text-secondary text-sm mb-2 block">
            How far do you usually search? <span className="text-primary font-heading font-bold">{radius}km</span>
          </label>
          <div className="flex gap-2">
            {radiusOptions.map((r) => (
              <button
                key={r}
                onClick={() => setRadius(r)}
                className={`flex-1 py-2 rounded-xl font-heading font-bold text-sm transition-all tap-active ${
                  radius === r
                    ? 'bg-primary text-background'
                    : 'bg-surface border border-surface-border text-text-secondary'
                }`}
              >
                {r}km
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-text-secondary text-sm mb-1 block">Daily commute distance (optional)</label>
          <div className="relative">
            <input
              type="number"
              value={commute}
              onChange={(e) => setCommute(e.target.value)}
              placeholder="e.g. 25"
              className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary/50 transition-colors pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary text-sm">km</span>
          </div>
        </div>
      </div>

      <div className="mt-auto pb-8">
        <button
          onClick={handleComplete}
          className="w-full bg-primary text-background font-heading font-bold text-lg py-4 rounded-2xl tap-active hover:bg-primary/90 transition-colors"
        >
          Start Saving →
        </button>
      </div>
    </div>
  )
}
