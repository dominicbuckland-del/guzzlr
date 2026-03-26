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
      <div className="px-4 pt-6 space-y-4 bg-surface min-h-screen">
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
    <div className="px-4 pt-6 space-y-4 animate-fade-in bg-surface min-h-screen">
      <h1 className="font-headline text-2xl font-bold text-on-surface">Profile</h1>

      {/* Tab selector */}
      <div className="flex bg-surface-container-low rounded-xl p-0.5">
        {(['profile', 'whatif', 'settings'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setSection(t)}
            className={`flex-1 py-2 rounded-lg text-xs font-headline font-bold tracking-widest uppercase transition-all ${
              section === t ? 'bg-primary text-white' : 'text-on-surface-variant'
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
            <div className="puffy-card p-5">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{vehicleIcons[car.vehicleType] || '🚗'}</span>
                <div>
                  <h2 className="font-headline text-xl font-bold text-on-surface">{car.year} {car.make} {car.model}</h2>
                  <p className="text-on-surface-variant text-sm capitalize">{car.vehicleType}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-surface-container-low rounded-2xl p-3 text-center">
                  <p className="font-headline font-bold text-lg text-primary">{car.tankSizeLitres}L</p>
                  <p className="text-on-surface-variant text-xs uppercase tracking-widest font-headline">Tank</p>
                </div>
                <div className="bg-surface-container-low rounded-2xl p-3 text-center">
                  <p className="font-headline font-bold text-lg text-primary">{car.fuelType}</p>
                  <p className="text-on-surface-variant text-xs uppercase tracking-widest font-headline">Fuel</p>
                </div>
                <div className="bg-surface-container-low rounded-2xl p-3 text-center">
                  <p className="font-headline font-bold text-lg text-primary">{car.ratedEconomyL100km}</p>
                  <p className="text-on-surface-variant text-xs uppercase tracking-widest font-headline">L/100km</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-outline-variant/20">
                <p className="text-on-surface-variant text-sm">
                  Your {car.make} {car.model} costs you <span className="text-primary font-headline font-bold">${weeklyCost.toFixed(0)}/week</span> in fuel
                </p>
              </div>
            </div>
          )}

          {/* Level Card */}
          <div className="puffy-card p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{levelInfo.icon}</span>
              <div>
                <p className="font-headline font-bold text-on-surface">Level {levelInfo.level}: {levelInfo.name}</p>
                <p className="text-on-surface-variant text-sm">{user.xp.toLocaleString()} XP</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="puffy-card p-4">
            <h3 className="font-headline font-bold text-xs text-on-surface-variant mb-3 uppercase tracking-widest">Your Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-on-surface-variant text-sm">Total saved</span>
                <span className="font-headline font-bold text-primary">${(user.totalSavedCents / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant text-sm">Current streak</span>
                <span className="font-headline font-bold text-on-surface">{user.streakCount} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant text-sm">Member since</span>
                <span className="text-sm text-on-surface">{new Date(user.createdAt).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })}</span>
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
