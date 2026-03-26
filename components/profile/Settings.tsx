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
      <div className="glass-card p-4 space-y-4">
        <h3 className="font-heading font-bold text-sm text-text-secondary">Settings</h3>

        <div>
          <label className="text-text-secondary text-xs mb-1 block">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary/50"
          />
        </div>

        <div>
          <label className="text-text-secondary text-xs mb-1 block">Home Postcode</label>
          <input
            type="text"
            value={homePostcode}
            onChange={(e) => setHomePostcode(e.target.value)}
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary/50"
          />
        </div>

        <div>
          <label className="text-text-secondary text-xs mb-1 block">Work Postcode</label>
          <input
            type="text"
            value={workPostcode}
            onChange={(e) => setWorkPostcode(e.target.value)}
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary/50"
          />
        </div>

        <div>
          <label className="text-text-secondary text-xs mb-2 block">
            Search Radius: <span className="text-primary font-heading font-bold">{radius}km</span>
          </label>
          <div className="flex gap-2">
            {RADIUS_OPTIONS.map((r) => (
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

        <button
          onClick={handleSave}
          className={`w-full py-3 rounded-xl font-heading font-bold transition-all tap-active ${
            saved ? 'bg-primary/20 text-primary' : 'bg-primary text-background'
          }`}
        >
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      <div className="glass-card p-4 space-y-3">
        <button
          onClick={() => router.push('/onboarding')}
          className="w-full bg-surface border border-surface-border rounded-xl py-3 text-sm font-medium text-text-secondary tap-active"
        >
          Change Car
        </button>
        <button
          onClick={handleExportCSV}
          className="w-full bg-surface border border-surface-border rounded-xl py-3 text-sm font-medium text-text-secondary tap-active"
        >
          Export Fill-Up History (CSV)
        </button>
      </div>
    </div>
  )
}
