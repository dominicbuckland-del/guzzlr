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
  const { car, user, fillups, setFillups, setAchievements, setFeedItems } = useGuzzlrStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize demo data
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
      <div className="px-4 pt-6 space-y-4">
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
    <div className="px-4 pt-6 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-text-secondary text-sm">
            {car ? `${car.year} ${car.make} ${car.model}` : 'Set up your car'}
          </p>
          <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-surface border border-surface-border rounded-full px-3 py-1">
            <span className="text-primary font-heading font-bold text-sm">Lv.{user.level}</span>
          </div>
        </div>
      </div>

      {/* Signal Card */}
      <SignalCard />

      {/* Quick Stats Carousel */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
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
