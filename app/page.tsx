'use client'

import { useEffect, useState } from 'react'
import { useGuzzlrStore } from '@/lib/store'
import { DEMO_FILLUPS, DEMO_ACHIEVEMENTS, DEMO_FEED } from '@/seed/users'
import SignalCard from '@/components/home/SignalCard'
import QuickStatCard from '@/components/home/QuickStatCard'
import PriceTrendChart from '@/components/home/PriceTrendChart'
import FuelFeed from '@/components/home/FuelFeed'
import { SkeletonSignal, SkeletonCard } from '@/components/shared/Skeleton'
import Link from 'next/link'

export default function HomePage() {
  const { car, user, fillups, setFillups, setAchievements, setFeedItems } = useGuzzlrStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (fillups.length === 0) {
      setFillups(DEMO_FILLUPS)
      setAchievements(DEMO_ACHIEVEMENTS)
      setFeedItems(DEMO_FEED)
    }
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="px-4 pt-8 space-y-4">
        <SkeletonSignal />
        <div className="flex gap-3 overflow-x-auto no-scrollbar"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
        <SkeletonCard />
      </div>
    )
  }

  return (
    <div className="px-4 pt-8 space-y-5 animate-fade-in">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <p className="text-text-secondary text-sm">{car ? `${car.year} ${car.make} ${car.model}` : 'Set up your car'}</p>
          <h1 className="font-headline text-2xl font-extrabold tracking-tight">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-surface border border-surface-border rounded-full px-3 py-1 text-xs font-bold text-text-secondary">
            {user.xp.toLocaleString()} XP
          </div>
          <div className="bg-white text-black rounded-full px-3 py-1 text-xs font-bold">
            Lv.{user.level}
          </div>
        </div>
      </header>

      <SignalCard />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/log" className="card p-4 flex items-center gap-3 tap-active">
          <span className="text-2xl">+</span>
          <span className="font-headline font-bold text-sm">Log Fill</span>
        </Link>
        <Link href="/map" className="card p-4 flex items-center gap-3 tap-active">
          <span className="text-2xl">&#9678;</span>
          <span className="font-headline font-bold text-sm">Find Fuel</span>
        </Link>
      </div>

      {/* Stats carousel */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
        <QuickStatCard type="cheapest" />
        <QuickStatCard type="weekly" />
        <QuickStatCard type="saved" />
        <QuickStatCard type="streak" />
      </div>

      <PriceTrendChart />
      <FuelFeed />
    </div>
  )
}
