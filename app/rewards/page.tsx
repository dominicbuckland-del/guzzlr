'use client'

import { useState, useEffect } from 'react'
import { useGuzzlrStore } from '@/lib/store'
import { getLevelInfo, getXpProgress, getXpToNextLevel } from '@/lib/constants'
import AnimatedNumber from '@/components/shared/AnimatedNumber'
import AchievementGrid from '@/components/rewards/AchievementGrid'
import Leaderboard from '@/components/rewards/Leaderboard'
import { SkeletonCard } from '@/components/shared/Skeleton'

export default function RewardsPage() {
  const { user, fillups } = useGuzzlrStore()
  const [tab, setTab] = useState<'savings' | 'achievements' | 'leaderboard'>('savings')
  const [loading, setLoading] = useState(true)
  const levelInfo = getLevelInfo(user.xp)
  const xpProgress = getXpProgress(user.xp)
  const xpToNext = getXpToNextLevel(user.xp)

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

  // Monthly savings
  const monthlySaved = fillups
    .filter(f => {
      const d = new Date(f.filledAt)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((sum, f) => sum + Math.max(0, f.savedCents), 0) / 100

  const monthlyFills = fillups.filter(f => {
    const d = new Date(f.filledAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  // Best fill
  const bestFill = [...fillups].sort((a, b) => b.savedCents - a.savedCents)[0]

  return (
    <div className="px-4 pt-6 space-y-4 animate-fade-in bg-surface min-h-screen">
      <h1 className="font-headline text-2xl font-bold text-on-surface">Rewards</h1>

      {/* XP / Level Card — orange gradient streak card */}
      <div className="bg-primary-container rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between mb-2">
          <p className="text-white/80 text-xs uppercase tracking-widest font-headline font-bold">Total Saved</p>
          <span className="text-2xl">{levelInfo.icon}</span>
        </div>
        <AnimatedNumber
          value={user.totalSavedCents / 100}
          prefix="$"
          className="font-headline font-bold text-4xl text-white"
        />
        <p className="text-white/70 text-sm mt-1">since joining Guzzlr</p>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-headline font-bold text-sm text-white">
              Level {levelInfo.level}: {levelInfo.name}
            </span>
            <span className="text-white/70 text-xs">
              {user.xp.toLocaleString()} / {levelInfo.maxXp === Infinity ? '∞' : (levelInfo.maxXp + 1).toLocaleString()} XP
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-1000"
              style={{ width: `${xpProgress * 100}%` }}
            />
          </div>
          {xpToNext > 0 && (
            <p className="text-white/60 text-xs mt-1">
              {xpToNext.toLocaleString()} XP to next level
            </p>
          )}
        </div>
      </div>

      {/* Tab selector */}
      <div className="flex bg-surface-container-low rounded-xl p-0.5">
        {(['savings', 'achievements', 'leaderboard'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-xs font-headline font-bold tracking-widest uppercase transition-all ${
              tab === t ? 'bg-primary text-white' : 'text-on-surface-variant'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'savings' && (
        <div className="space-y-4 animate-fade-in">
          {/* Monthly summary */}
          <div className="puffy-card p-4">
            <h3 className="font-headline font-bold text-xs text-on-surface-variant mb-2 uppercase tracking-widest">
              {new Date().toLocaleDateString('en-AU', { month: 'long' })}
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-on-surface-variant text-xs uppercase tracking-widest font-headline">Saved</p>
                <p className="font-headline font-bold text-2xl text-primary">${monthlySaved.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-on-surface-variant text-xs uppercase tracking-widest font-headline">Fills</p>
                <p className="font-headline font-bold text-2xl text-on-surface">{monthlyFills}</p>
              </div>
            </div>
          </div>

          {/* Best fill */}
          {bestFill && bestFill.savedCents > 0 && (
            <div className="puffy-card p-4">
              <h3 className="font-headline font-bold text-xs text-on-surface-variant mb-2 uppercase tracking-widest">Best Fill Ever</h3>
              <p className="text-on-surface">
                Saved <span className="text-primary font-headline font-bold">${(bestFill.savedCents / 100).toFixed(2)}</span> at {bestFill.stationName}
              </p>
              <p className="text-on-surface-variant text-xs mt-1">
                {new Date(bestFill.filledAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
              </p>
            </div>
          )}

          {/* Streak — yellow progress badge */}
          <div className="puffy-card p-4">
            <h3 className="font-headline font-bold text-xs text-on-surface-variant mb-2 uppercase tracking-widest">Current Streak</h3>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-on-surface">local_fire_department</span>
              </div>
              <div>
                <p className="font-headline font-bold text-3xl text-on-surface">{user.streakCount}</p>
                <p className="text-on-surface-variant text-sm">fills beating the average</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'achievements' && <AchievementGrid />}
      {tab === 'leaderboard' && <Leaderboard />}
    </div>
  )
}
