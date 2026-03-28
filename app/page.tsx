'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useGuzzlrStore } from '@/lib/store'
import { getLevelInfo } from '@/lib/constants'
import { DEMO_FILLUPS, DEMO_ACHIEVEMENTS, DEMO_FEED } from '@/seed/users'
import SignalCard from '@/components/home/SignalCard'
import QuickStatCard from '@/components/home/QuickStatCard'
import PriceTrendChart from '@/components/home/PriceTrendChart'
import FuelFeed from '@/components/home/FuelFeed'
import { SkeletonSignal, SkeletonCard } from '@/components/shared/Skeleton'
import PageTransition from '@/components/layout/PageTransition'
import Link from 'next/link'

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function HomePage() {
  const { car, user, fillups, setFillups, setAchievements, setFeedItems } = useGuzzlrStore()
  const [loading, setLoading] = useState(true)

  const greeting = useMemo(() => getGreeting(), [])
  const levelInfo = useMemo(() => getLevelInfo(user.xp), [user.xp])
  const totalSavedDollars = (user.totalSavedCents / 100).toFixed(2)

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
    <PageTransition><div className="px-5 pt-14 space-y-5">
      {/* Greeting */}
      <p className="text-[22px] font-bold tracking-tight">{greeting}</p>

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

      {/* Stat Bar: Streak | Total Saved | Level */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card px-3 py-2.5 text-center">
          <p className="text-[11px] text-text-muted font-semibold uppercase tracking-wider">Streak</p>
          <p className="text-[18px] font-bold tracking-tight mt-0.5">{user.streakCount}</p>
        </div>
        <div className="card px-3 py-2.5 text-center">
          <p className="text-[11px] text-text-muted font-semibold uppercase tracking-wider">Total Saved</p>
          <p className="text-[18px] font-bold tracking-tight text-success mt-0.5">${totalSavedDollars}</p>
        </div>
        <div className="card px-3 py-2.5 text-center">
          <p className="text-[11px] text-text-muted font-semibold uppercase tracking-wider">Level</p>
          <p className="text-[18px] font-bold tracking-tight mt-0.5">{levelInfo.icon} {levelInfo.level}</p>
        </div>
      </div>

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

      {/* Gouging Report link */}
      <Link href="/gouging" className="card p-4 flex items-center justify-between active:opacity-70 transition-opacity">
        <div className="flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-semibold text-[15px]">Gouging Report</p>
            <p className="text-text-secondary text-[13px]">See who&apos;s overcharging near you</p>
          </div>
        </div>
        <span className="text-text-muted text-[15px]">›</span>
      </Link>

      {/* Stats -- streak removed, now in stat bar above */}
      <motion.div
        className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-1"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        {(['cheapest', 'weekly', 'saved'] as const).map((type) => (
          <motion.div
            key={type}
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <QuickStatCard type={type} />
          </motion.div>
        ))}
      </motion.div>

      <PriceTrendChart />
      <FuelFeed />
    </div></PageTransition>
  )
}
