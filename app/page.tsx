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
  const { car, fillups, setFillups, setAchievements, setFeedItems } = useGuzzlrStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (fillups.length === 0) {
      setFillups(DEMO_FILLUPS)
      setAchievements(DEMO_ACHIEVEMENTS)
      setFeedItems(DEMO_FEED)
    }
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return <div className="px-5 pt-14 space-y-4"><SkeletonSignal /><div className="flex gap-3 overflow-x-auto"><SkeletonCard /><SkeletonCard /></div><SkeletonCard /></div>
  }

  return (
    <div className="px-5 pt-14 space-y-5 animate-fade-in">
      {/* Car Card -- FRONT AND CENTER */}
      <Link href="/onboarding" className="card p-4 flex items-center justify-between active:opacity-70 transition-opacity">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{car?.vehicleType === 'ute' ? '🛻' : car?.vehicleType === 'suv' ? '🚙' : car?.vehicleType === 'van' ? '🚐' : '🚗'}</span>
          <div>
            <p className="font-semibold text-[15px]">{car ? `${car.year} ${car.make} ${car.model}` : 'Select your car'}</p>
            <p className="text-text-secondary text-[13px]">{car ? `${car.tankSizeLitres}L ${car.fuelType} · ${car.ratedEconomyL100km}L/100km` : 'Tap to personalise everything'}</p>
          </div>
        </div>
        <span className="text-tint text-[15px] font-medium">Change</span>
      </Link>

      <SignalCard />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/log" className="card p-4 flex items-center gap-3 active:opacity-70 transition-opacity">
          <span className="text-xl">⛽</span>
          <span className="font-semibold text-[15px]">Log Fill-Up</span>
        </Link>
        <Link href="/map" className="card p-4 flex items-center gap-3 active:opacity-70 transition-opacity">
          <span className="text-xl">📍</span>
          <span className="font-semibold text-[15px]">Find Fuel</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-1">
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
