'use client'

import { useEffect, useState } from 'react'
import { useGuzzlrStore } from '@/lib/store'
import { DEMO_FILLUPS, DEMO_ACHIEVEMENTS, DEMO_FEED } from '@/seed/users'
import SignalCard from '@/components/home/SignalCard'
import QuickStatCard from '@/components/home/QuickStatCard'
import PriceTrendChart from '@/components/home/PriceTrendChart'
import FuelFeed from '@/components/home/FuelFeed'
import { SkeletonSignal, SkeletonCard } from '@/components/shared/Skeleton'

export default function HomePage() {
  const { user, fillups, setFillups, setAchievements, setFeedItems } = useGuzzlrStore()
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
      <div className="px-6 pt-6 space-y-4">
        <SkeletonSignal />
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonCard />
      </div>
    )
  }

  return (
    <div className="px-6 pt-6 space-y-6 animate-fade-in">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">
            G&apos;day, Mate!<br />
            <span className="text-primary">Ready to refuel?</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full font-headline font-bold text-sm flex items-center gap-1.5 shadow-sm">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            {user.xp.toLocaleString()} pts
          </div>
        </div>
      </header>

      {/* Signal Card */}
      <SignalCard />

      {/* Quick Actions */}
      <div className="flex gap-4">
        <a href="/log" className="flex-1 bg-primary text-on-primary rounded-[1rem] p-5 flex flex-col items-center gap-2 shadow-lg tap-active">
          <span className="material-symbols-outlined text-3xl">bolt</span>
          <span className="font-headline font-bold text-sm">Log Fill-Up</span>
        </a>
        <a href="/map" className="flex-1 bg-surface-container-low text-on-surface rounded-[1rem] p-5 flex flex-col items-center gap-2 shadow-sm tap-active">
          <span className="material-symbols-outlined text-3xl text-primary">distance</span>
          <span className="font-headline font-bold text-sm">Find Fuel</span>
        </a>
      </div>

      {/* Quick Stats Carousel */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-6 px-6">
        <QuickStatCard type="cheapest" />
        <QuickStatCard type="weekly" />
        <QuickStatCard type="saved" />
        <QuickStatCard type="economy" />
        <QuickStatCard type="streak" />
      </div>

      {/* Price Trend Chart */}
      <PriceTrendChart />

      {/* Fuel Feed */}
      <FuelFeed />
    </div>
  )
}
