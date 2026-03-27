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
      <div className="card bg-surface rounded-[14px] p-4 space-y-0">
        <h3 className="font-display font-bold text-[11px] text-text-muted uppercase tracking-widest mb-3">Settings</h3>

        <div className="py-3" style={{ borderBottom: '0.5px solid #d1d1d6' }}>
          <label className="text-text-muted text-[11px] mb-1 block uppercase tracking-widest font-display">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-white rounded-[10px] px-4 py-3 text-text-primary text-[15px] focus:outline-none focus:ring-2 focus:ring-tint/20 transition-all"
            style={{ borderBottom: '0.5px solid #d1d1d6' }}
          />
        </div>

        <div className="py-3" style={{ borderBottom: '0.5px solid #d1d1d6' }}>
          <label className="text-text-muted text-[11px] mb-1 block uppercase tracking-widest font-display">Home Postcode</label>
          <input
            type="text"
            value={homePostcode}
            onChange={(e) => setHomePostcode(e.target.value)}
            className="w-full bg-white rounded-[10px] px-4 py-3 text-text-primary text-[15px] focus:outline-none focus:ring-2 focus:ring-tint/20 transition-all"
            style={{ borderBottom: '0.5px solid #d1d1d6' }}
          />
        </div>

        <div className="py-3" style={{ borderBottom: '0.5px solid #d1d1d6' }}>
          <label className="text-text-muted text-[11px] mb-1 block uppercase tracking-widest font-display">Work Postcode</label>
          <input
            type="text"
            value={workPostcode}
            onChange={(e) => setWorkPostcode(e.target.value)}
            className="w-full bg-white rounded-[10px] px-4 py-3 text-text-primary text-[15px] focus:outline-none focus:ring-2 focus:ring-tint/20 transition-all"
            style={{ borderBottom: '0.5px solid #d1d1d6' }}
          />
        </div>

        <div className="py-3" style={{ borderBottom: '0.5px solid #d1d1d6' }}>
          <label className="text-text-muted text-[11px] mb-2 block uppercase tracking-widest font-display">
            Search Radius: <span className="text-text-primary font-display font-bold">{radius}km</span>
          </label>
          <div className="flex gap-2">
            {RADIUS_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRadius(r)}
                className={`flex-1 py-2 rounded-full font-display font-bold text-[13px] transition-all tap-active active:scale-[0.98] ${
                  radius === r
                    ? 'bg-text-primary text-white'
                    : 'bg-surface-high text-text-muted'
                }`}
              >
                {r}km
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSave}
            className={`w-full py-3.5 rounded-[14px] font-display font-bold text-[15px] transition-all tap-active active:scale-[0.98] ${
              saved ? 'bg-surface-high text-success' : 'bg-tint text-white'
            }`}
          >
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="card bg-surface rounded-[14px] p-4 space-y-0">
        <button
          onClick={() => router.push('/onboarding')}
          className="w-full py-3 text-[15px] font-display font-bold text-text-secondary tap-active transition-all active:scale-[0.98] text-left"
          style={{ borderBottom: '0.5px solid #d1d1d6' }}
        >
          Change Car
        </button>
        <button
          onClick={handleExportCSV}
          className="w-full py-3 text-[15px] font-display font-bold text-text-secondary tap-active transition-all active:scale-[0.98] text-left"
        >
          Export Fill-Up History (CSV)
        </button>
      </div>
    </div>
  )
}
