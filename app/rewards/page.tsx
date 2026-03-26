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
      <div className="px-4 pt-6 space-y-4">
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
    <div className="px-4 pt-6 space-y-4 animate-fade-in">
      <h1 className="font-heading text-2xl font-bold">Rewards</h1>

      {/* XP / Level Card */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-text-secondary text-xs">TOTAL SAVED</p>
          <span className="text-2xl">{levelInfo.icon}</span>
        </div>
        <AnimatedNumber
          value={user.totalSavedCents / 100}
          prefix="$"
          className="price-ticker text-4xl text-primary"
        />
        <p className="text-text-secondary text-sm mt-1">since joining Guzzlr</p>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-heading font-bold text-sm">
              Level {levelInfo.level}: {levelInfo.name}
            </span>
            <span className="text-text-secondary text-xs">
              {user.xp.toLocaleString()} / {levelInfo.maxXp === Infinity ? '∞' : (levelInfo.maxXp + 1).toLocaleString()} XP
            </span>
          </div>
          <div className="w-full bg-surface-border rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000"
              style={{ width: `${xpProgress * 100}%` }}
            />
          </div>
          {xpToNext > 0 && (
            <p className="text-text-secondary text-xs mt-1">
              {xpToNext.toLocaleString()} XP to next level
            </p>
          )}
        </div>
      </div>

      {/* Tab selector */}
      <div className="flex bg-surface rounded-lg p-0.5">
        {(['savings', 'achievements', 'leaderboard'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors capitalize ${
              tab === t ? 'bg-primary text-background' : 'text-text-secondary'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'savings' && (
        <div className="space-y-4 animate-fade-in">
          {/* Monthly summary */}
          <div className="glass-card p-4">
            <h3 className="font-heading font-bold text-sm text-text-secondary mb-2">
              {new Date().toLocaleDateString('en-AU', { month: 'long' })}
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-xs">Saved</p>
                <p className="price-ticker text-2xl text-primary">${monthlySaved.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-text-secondary text-xs">Fills</p>
                <p className="price-ticker text-2xl">{monthlyFills}</p>
              </div>
            </div>
          </div>

          {/* Best fill */}
          {bestFill && bestFill.savedCents > 0 && (
            <div className="glass-card p-4">
              <h3 className="font-heading font-bold text-sm text-text-secondary mb-2">Best Fill Ever</h3>
              <p className="text-text-primary">
                Saved <span className="text-primary font-heading font-bold">${(bestFill.savedCents / 100).toFixed(2)}</span> at {bestFill.stationName}
              </p>
              <p className="text-text-secondary text-xs mt-1">
                {new Date(bestFill.filledAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
              </p>
            </div>
          )}

          {/* Streak */}
          <div className="glass-card p-4">
            <h3 className="font-heading font-bold text-sm text-text-secondary mb-2">Current Streak</h3>
            <div className="flex items-center gap-3">
              <span className="text-4xl">🔥</span>
              <div>
                <p className="price-ticker text-3xl">{user.streakCount}</p>
                <p className="text-text-secondary text-sm">fills beating the average</p>
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
