'use client'

import { useState } from 'react'
import { useGuzzlrStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

const RADIUS_OPTIONS = [5, 10, 15, 20]

export default function Settings() {
  const { user, setUser, setFillups, setFeedItems, setAchievements } = useGuzzlrStore()
  const router = useRouter()
  const [displayName, setDisplayName] = useState(user.displayName)
  const [homePostcode, setHomePostcode] = useState(user.homePostcode || '')
  const [workPostcode, setWorkPostcode] = useState(user.workPostcode || '')
  const [radius, setRadius] = useState(user.searchRadiusKm)
  const [saved, setSaved] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

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

  const handleResetDemo = () => {
    setFillups([])
    setFeedItems([])
    setAchievements([])
    setUser({
      xp: 0,
      level: 1,
      streakCount: 0,
      totalSavedCents: 0,
    })
    setShowResetConfirm(false)
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Account settings group */}
      <div className="card bg-surface rounded-[14px] overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <h3 className="font-display font-bold text-[11px] text-text-muted uppercase tracking-widest">Account</h3>
        </div>

        {/* Display Name row */}
        <div className="flex items-center justify-between px-4 py-3 min-h-[44px]" style={{ borderBottom: '0.5px solid #d1d1d6' }}>
          <label className="text-text-primary text-[15px] shrink-0 mr-4">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="text-right text-text-secondary text-[15px] bg-transparent focus:outline-none focus:text-text-primary transition-colors flex-1 min-w-0"
            placeholder="Your name"
          />
        </div>

        {/* Home Postcode row */}
        <div className="flex items-center justify-between px-4 py-3 min-h-[44px]" style={{ borderBottom: '0.5px solid #d1d1d6' }}>
          <label className="text-text-primary text-[15px] shrink-0 mr-4">Home Postcode</label>
          <input
            type="text"
            value={homePostcode}
            onChange={(e) => setHomePostcode(e.target.value)}
            className="text-right text-text-secondary text-[15px] bg-transparent focus:outline-none focus:text-text-primary transition-colors flex-1 min-w-0"
            placeholder="4000"
          />
        </div>

        {/* Work Postcode row */}
        <div className="flex items-center justify-between px-4 py-3 min-h-[44px]" style={{ borderBottom: '0.5px solid #d1d1d6' }}>
          <label className="text-text-primary text-[15px] shrink-0 mr-4">Work Postcode</label>
          <input
            type="text"
            value={workPostcode}
            onChange={(e) => setWorkPostcode(e.target.value)}
            className="text-right text-text-secondary text-[15px] bg-transparent focus:outline-none focus:text-text-primary transition-colors flex-1 min-w-0"
            placeholder="4006"
          />
        </div>

        {/* Search Radius row */}
        <div className="px-4 py-3 min-h-[44px]">
          <div className="flex items-center justify-between mb-3">
            <label className="text-text-primary text-[15px]">Search Radius</label>
            <span className="text-text-secondary text-[15px]">{radius}km</span>
          </div>
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
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className={`w-full py-3.5 rounded-[14px] font-display font-bold text-[15px] transition-all tap-active active:scale-[0.98] ${
          saved ? 'bg-surface text-success' : 'bg-tint text-white'
        }`}
      >
        {saved ? 'Saved!' : 'Save Settings'}
      </button>

      {/* Actions group */}
      <div className="card bg-surface rounded-[14px] overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <h3 className="font-display font-bold text-[11px] text-text-muted uppercase tracking-widest">Actions</h3>
        </div>

        <button
          onClick={() => router.push('/onboarding')}
          className="w-full flex items-center justify-between px-4 py-3 min-h-[44px] tap-active transition-all active:bg-surface-high"
          style={{ borderBottom: '0.5px solid #d1d1d6' }}
        >
          <span className="text-text-primary text-[15px]">Change Car</span>
          <span className="text-text-muted text-[15px]">&#8250;</span>
        </button>

        <button
          onClick={handleExportCSV}
          className="w-full flex items-center justify-between px-4 py-3 min-h-[44px] tap-active transition-all active:bg-surface-high"
        >
          <span className="text-text-primary text-[15px]">Export Fill-Up History (CSV)</span>
          <span className="text-text-muted text-[15px]">&#8250;</span>
        </button>
      </div>

      {/* Destructive actions group */}
      <div className="card bg-surface rounded-[14px] overflow-hidden">
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full px-4 py-3 min-h-[44px] tap-active transition-all active:bg-surface-high text-center"
          >
            <span className="text-error text-[15px] font-display font-bold">Reset Demo Data</span>
          </button>
        ) : (
          <div className="px-4 py-4 space-y-3">
            <p className="text-text-primary text-[13px] text-center">This will clear all fill-ups, achievements, and reset your XP. Are you sure?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 rounded-[10px] bg-surface-high text-text-primary text-[15px] font-display font-bold tap-active active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                onClick={handleResetDemo}
                className="flex-1 py-3 rounded-[10px] bg-error text-white text-[15px] font-display font-bold tap-active active:scale-[0.98]"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
