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
      <div className="px-4 pt-6 space-y-4 min-h-screen bg-bg">
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
    <div className="px-4 pt-6 space-y-4 animate-fade-in min-h-screen bg-bg">
      <h1 className="font-display text-[22px] font-bold text-text-primary">Rewards</h1>

      {/* XP / Level Card */}
      <div className="card bg-surface rounded-[14px] p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-text-muted text-[11px] uppercase tracking-widest font-display font-bold">Total Saved</p>
          <span className="text-2xl">{levelInfo.icon}</span>
        </div>
        <AnimatedNumber
          value={user.totalSavedCents / 100}
          prefix="$"
          className="font-display font-bold text-[34px] text-text-primary"
        />
        <p className="text-text-muted text-[13px] mt-1">since joining Guzzlr</p>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-display font-bold text-[13px] text-text-primary">
              Level {levelInfo.level}: {levelInfo.name}
            </span>
            <span className="text-text-muted text-[11px]">
              {user.xp.toLocaleString()} / {levelInfo.maxXp === Infinity ? '∞' : (levelInfo.maxXp + 1).toLocaleString()} XP
            </span>
          </div>
          <div className="w-full bg-surface-high rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full bg-tint rounded-full transition-all duration-1000"
              style={{ width: `${xpProgress * 100}%` }}
            />
          </div>
          {xpToNext > 0 && (
            <p className="text-text-muted text-[11px] mt-1">
              {xpToNext.toLocaleString()} XP to next level
            </p>
          )}
        </div>
      </div>

      {/* Tab selector */}
      <div className="flex bg-surface rounded-[10px] p-[3px]">
        {(['savings', 'achievements', 'leaderboard'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-[8px] text-[13px] font-bold capitalize transition-colors ${
              tab === t ? 'bg-text-primary text-white' : 'text-text-secondary'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'savings' && (
        <div className="space-y-4 animate-fade-in">
          {/* Monthly summary */}
          <div className="card bg-surface rounded-[14px] p-4">
            <h3 className="font-display font-bold text-[11px] text-text-muted mb-2 uppercase tracking-widest">
              {new Date().toLocaleDateString('en-AU', { month: 'long' })}
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-[11px] uppercase tracking-widest font-display">Saved</p>
                <p className="font-display font-bold text-[22px] text-success">${monthlySaved.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-text-muted text-[11px] uppercase tracking-widest font-display">Fills</p>
                <p className="font-display font-bold text-[22px] text-text-primary">{monthlyFills}</p>
              </div>
            </div>
          </div>

          {/* Best fill */}
          {bestFill && bestFill.savedCents > 0 && (
            <div className="card bg-surface rounded-[14px] p-4">
              <h3 className="font-display font-bold text-[11px] text-text-muted mb-2 uppercase tracking-widest">Best Fill Ever</h3>
              <p className="text-text-primary text-[15px]">
                Saved <span className="text-success font-display font-bold">${(bestFill.savedCents / 100).toFixed(2)}</span> at {bestFill.stationName}
              </p>
              <p className="text-text-muted text-[11px] mt-1">
                {new Date(bestFill.filledAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
              </p>
            </div>
          )}

          {/* Streak */}
          <div className="card bg-surface rounded-[14px] p-4">
            <h3 className="font-display font-bold text-[11px] text-text-muted mb-2 uppercase tracking-widest">Current Streak</h3>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-surface-high flex items-center justify-center">
                <span className="text-2xl text-text-primary">*</span>
              </div>
              <div>
                <p className="font-display font-bold text-[28px] text-text-primary">{user.streakCount}</p>
                <p className="text-text-secondary text-[13px]">fills beating the average</p>
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
