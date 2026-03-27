'use client'

import { useState, useEffect } from 'react'
import { useGuzzlrStore } from '@/lib/store'
import { getLevelInfo } from '@/lib/constants'
import { calculateWeeklyCost } from '@/lib/calculations'
import { SkeletonCard } from '@/components/shared/Skeleton'
import WhatIfCalculator from '@/components/profile/WhatIfCalculator'
import DriverBenchmark from '@/components/profile/DriverBenchmark'
import Settings from '@/components/profile/Settings'

const vehicleIcons: Record<string, string> = {
  sedan: '🚗', suv: '🚙', ute: '🛻', hatch: '🚗', van: '🚐',
}

export default function ProfilePage() {
  const { car, user } = useGuzzlrStore()
  const [loading, setLoading] = useState(true)
  const [section, setSection] = useState<'profile' | 'whatif' | 'settings'>('profile')
  const levelInfo = getLevelInfo(user.xp)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="px-4 pt-6 space-y-4 bg-bg min-h-screen">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  // Calculate weekly fuel cost
  const weeklyKm = (user.commuteDistanceKm || 25) * 5
  const avgPriceCents = 1850 // approximate area average
  const weeklyCost = car ? calculateWeeklyCost(car.ratedEconomyL100km, weeklyKm, avgPriceCents) : 0

  return (
    <div className="px-4 pt-6 space-y-4 animate-fade-in bg-bg min-h-screen">
      <h1 className="font-display text-[22px] font-bold text-text-primary">Profile</h1>

      {/* Tab selector */}
      <div className="flex bg-surface rounded-[10px] p-[3px]">
        {(['profile', 'whatif', 'settings'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setSection(t)}
            className={`flex-1 py-2 rounded-[8px] text-[13px] font-display font-bold transition-all ${
              section === t ? 'bg-text-primary text-white' : 'text-text-secondary'
            }`}
          >
            {t === 'whatif' ? 'What If?' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {section === 'profile' && (
        <div className="space-y-4 animate-fade-in">
          {/* Car Card */}
          {car && (
            <div className="card bg-surface rounded-[14px] p-5">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{vehicleIcons[car.vehicleType] || '🚗'}</span>
                <div>
                  <h2 className="font-display text-[17px] font-bold text-text-primary">{car.year} {car.make} {car.model}</h2>
                  <p className="text-text-secondary text-[13px] capitalize">{car.vehicleType}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-surface-high rounded-[12px] p-3 text-center">
                  <p className="font-display font-bold text-[17px] text-text-primary">{car.tankSizeLitres}L</p>
                  <p className="text-text-muted text-[11px] uppercase tracking-widest font-display">Tank</p>
                </div>
                <div className="bg-surface-high rounded-[12px] p-3 text-center">
                  <p className="font-display font-bold text-[17px] text-text-primary">{car.fuelType}</p>
                  <p className="text-text-muted text-[11px] uppercase tracking-widest font-display">Fuel</p>
                </div>
                <div className="bg-surface-high rounded-[12px] p-3 text-center">
                  <p className="font-display font-bold text-[17px] text-text-primary">{car.ratedEconomyL100km}</p>
                  <p className="text-text-muted text-[11px] uppercase tracking-widest font-display">L/100km</p>
                </div>
              </div>
              <div className="mt-4 pt-4" style={{ borderTop: '0.5px solid #d1d1d6' }}>
                <p className="text-text-secondary text-[13px]">
                  Your {car.make} {car.model} costs you <span className="text-text-primary font-display font-bold">${weeklyCost.toFixed(0)}/week</span> in fuel
                </p>
              </div>
            </div>
          )}

          {/* Level Card */}
          <div className="card bg-surface rounded-[14px] p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{levelInfo.icon}</span>
              <div>
                <p className="font-display font-bold text-[15px] text-text-primary">Level {levelInfo.level}: {levelInfo.name}</p>
                <p className="text-text-secondary text-[13px]">{user.xp.toLocaleString()} XP</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="card bg-surface rounded-[14px] p-4">
            <h3 className="font-display font-bold text-[11px] text-text-muted mb-3 uppercase tracking-widest">Your Stats</h3>
            <div className="space-y-0">
              <div className="flex justify-between py-2.5" style={{ borderBottom: '0.5px solid #d1d1d6' }}>
                <span className="text-text-secondary text-[15px]">Total saved</span>
                <span className="font-display font-bold text-success text-[15px]">${(user.totalSavedCents / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2.5" style={{ borderBottom: '0.5px solid #d1d1d6' }}>
                <span className="text-text-secondary text-[15px]">Current streak</span>
                <span className="font-display font-bold text-text-primary text-[15px]">{user.streakCount} days</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-text-secondary text-[15px]">Member since</span>
                <span className="text-[15px] text-text-primary">{new Date(user.createdAt).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <DriverBenchmark />
        </div>
      )}

      {section === 'whatif' && <WhatIfCalculator />}
      {section === 'settings' && <Settings />}
    </div>
  )
}
