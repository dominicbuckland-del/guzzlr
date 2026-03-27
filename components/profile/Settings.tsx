'use client'

import { useState } from 'react'
import { useGuzzlrStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

const RADIUS_OPTIONS = [5, 10, 15, 20]

export default function Settings() {
  const { user, setUser } = useGuzzlrStore()
  const router = useRouter()
  const [displayName, setDisplayName] = useState(user.displayName)
  const [homePostcode, setHomePostcode] = useState(user.homePostcode || '')
  const [workPostcode, setWorkPostcode] = useState(user.workPostcode || '')
  const [radius, setRadius] = useState(user.searchRadiusKm)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setUser({
      displayName,
      homePostcode,
      workPostcode,
      searchRadiusKm: radius,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleExportCSV = () => {
    const { fillups } = useGuzzlrStore.getState()
    const headers = 'Date,Station,Litres,Price (c/L),Total ($),Saved ($)\n'
    const rows = fillups.map(f =>
      `${new Date(f.filledAt).toLocaleDateString('en-AU')},${f.stationName},${f.litres},${(f.pricePerLitreCents/10).toFixed(1)},${(f.totalCostCents/100).toFixed(2)},${(f.savedCents/100).toFixed(2)}`
    ).join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'guzzlr-fillups.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="card p-4 space-y-4">
        <h3 className="font-headline font-bold text-xs text-text-muted uppercase tracking-widest">Settings</h3>

        <div>
          <label className="text-text-muted text-xs mb-1 block uppercase tracking-widest font-headline">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-surface-high border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
          />
        </div>

        <div>
          <label className="text-text-muted text-xs mb-1 block uppercase tracking-widest font-headline">Home Postcode</label>
          <input
            type="text"
            value={homePostcode}
            onChange={(e) => setHomePostcode(e.target.value)}
            className="w-full bg-surface-high border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
          />
        </div>

        <div>
          <label className="text-text-muted text-xs mb-1 block uppercase tracking-widest font-headline">Work Postcode</label>
          <input
            type="text"
            value={workPostcode}
            onChange={(e) => setWorkPostcode(e.target.value)}
            className="w-full bg-surface-high border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
          />
        </div>

        <div>
          <label className="text-text-muted text-xs mb-2 block uppercase tracking-widest font-headline">
            Search Radius: <span className="text-white font-headline font-bold">{radius}km</span>
          </label>
          <div className="flex gap-2">
            {RADIUS_OPTIONS.map((r) => (
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

        <button
          onClick={handleSave}
          className={`w-full py-3 rounded-full font-headline font-bold transition-all tap-active active:scale-[0.98] ${
            saved ? 'bg-surface-high text-success' : 'bg-white text-black'
          }`}
        >
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      <div className="card p-4 space-y-3">
        <button
          onClick={() => router.push('/onboarding')}
          className="w-full bg-surface-high border border-surface-border rounded-xl py-3 text-sm font-headline font-bold text-text-secondary tap-active transition-all active:scale-[0.98]"
        >
          Change Car
        </button>
        <button
          onClick={handleExportCSV}
          className="w-full bg-surface-high border border-surface-border rounded-xl py-3 text-sm font-headline font-bold text-text-secondary tap-active transition-all active:scale-[0.98]"
        >
          Export Fill-Up History (CSV)
        </button>
      </div>
    </div>
  )
}
