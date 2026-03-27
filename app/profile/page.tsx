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
      <h1 className="font-headline text-2xl font-bold text-white">Profile</h1>

      {/* Tab selector */}
      <div className="flex bg-surface-high rounded-xl p-0.5">
        {(['profile', 'whatif', 'settings'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setSection(t)}
            className={`flex-1 py-2 rounded-lg text-xs font-headline font-bold tracking-widest uppercase transition-all ${
              section === t ? 'bg-white text-black' : 'text-text-muted'
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
            <div className="card p-5">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{vehicleIcons[car.vehicleType] || '🚗'}</span>
                <div>
                  <h2 className="font-headline text-xl font-bold text-white">{car.year} {car.make} {car.model}</h2>
                  <p className="text-text-secondary text-sm capitalize">{car.vehicleType}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-surface-high rounded-xl p-3 text-center">
                  <p className="font-headline font-bold text-lg text-white">{car.tankSizeLitres}L</p>
                  <p className="text-text-muted text-xs uppercase tracking-widest font-headline">Tank</p>
                </div>
                <div className="bg-surface-high rounded-xl p-3 text-center">
                  <p className="font-headline font-bold text-lg text-white">{car.fuelType}</p>
                  <p className="text-text-muted text-xs uppercase tracking-widest font-headline">Fuel</p>
                </div>
                <div className="bg-surface-high rounded-xl p-3 text-center">
                  <p className="font-headline font-bold text-lg text-white">{car.ratedEconomyL100km}</p>
                  <p className="text-text-muted text-xs uppercase tracking-widest font-headline">L/100km</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-surface-border">
                <p className="text-text-secondary text-sm">
                  Your {car.make} {car.model} costs you <span className="text-white font-headline font-bold">${weeklyCost.toFixed(0)}/week</span> in fuel
                </p>
              </div>
            </div>
          )}

          {/* Level Card */}
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{levelInfo.icon}</span>
              <div>
                <p className="font-headline font-bold text-white">Level {levelInfo.level}: {levelInfo.name}</p>
                <p className="text-text-secondary text-sm">{user.xp.toLocaleString()} XP</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="card p-4">
            <h3 className="font-headline font-bold text-xs text-text-muted mb-3 uppercase tracking-widest">Your Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text-secondary text-sm">Total saved</span>
                <span className="font-headline font-bold text-success">${(user.totalSavedCents / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary text-sm">Current streak</span>
                <span className="font-headline font-bold text-white">{user.streakCount} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary text-sm">Member since</span>
                <span className="text-sm text-white">{new Date(user.createdAt).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })}</span>
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
