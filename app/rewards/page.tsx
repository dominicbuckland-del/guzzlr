'use client'

import { useState, useEffect, useMemo } from 'react'
import { useGuzzlrStore } from '@/lib/store'
import { getLevelInfo, getXpProgress, getXpToNextLevel } from '@/lib/constants'
import { ACHIEVEMENTS } from '@/lib/achievements'
import { DEMO_ACHIEVEMENTS } from '@/seed/users'
import AnimatedNumber from '@/components/shared/AnimatedNumber'
import AchievementGrid from '@/components/rewards/AchievementGrid'
import Leaderboard from '@/components/rewards/Leaderboard'
import { SkeletonCard } from '@/components/shared/Skeleton'
import PageTransition from '@/components/layout/PageTransition'

export default function RewardsPage() {
  const { user, fillups } = useGuzzlrStore()
  const [tab, setTab] = useState<'savings' | 'achievements' | 'leaderboard'>('savings')
  const [loading, setLoading] = useState(true)
  const levelInfo = getLevelInfo(user.xp)
  const xpProgress = getXpProgress(user.xp)
  const xpToNext = getXpToNextLevel(user.xp)

  const unlockedKeys = useMemo(() => new Set(DEMO_ACHIEVEMENTS.map(a => a.achievementKey)), [])
  const nextAchievement = useMemo(() => {
    // Simulated progress values for demo
    const progressMap: Record<string, number> = {
      five_hundy: 24780, // totalSavedCents
      grand_master: 24780,
      machine: 5, // streak
      inhuman: 5,
      fortune_teller: 4, // cycle fills
      time_lord: 4,
      dedicated: 12, // fills
      obsessed: 12,
      guzzlr_for_life: 12,
      watchdog: 8, // reports
      sentinel: 8,
      scout: 8,
      whistleblower: 2,
      night_owl: 0,
      early_bird: 0,
      road_tripper: 0,
      brand_switcher: 4,
      bargain_hunter: 0,
    }
    const locked = ACHIEVEMENTS
      .filter(a => !unlockedKeys.has(a.key))
      .map(a => {
        const current = progressMap[a.key] ?? 0
        const pct = Math.min(current / a.requirement, 0.99)
        return { ...a, current, pct }
      })
      .sort((a, b) => b.pct - a.pct)
    return locked[0] || null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const now = new Date()
  const monthlySaved = fillups
    .filter(f => { const d = new Date(f.filledAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() })
    .reduce((sum, f) => sum + Math.max(0, f.savedCents), 0) / 100
  const monthlyFills = fillups.filter(f => { const d = new Date(f.filledAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() }).length
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthSaved = fillups
    .filter(f => { const d = new Date(f.filledAt); return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear() })
    .reduce((sum, f) => sum + Math.max(0, f.savedCents), 0) / 100
  const savingsDiff = monthlySaved - lastMonthSaved
  const savingsDiffPct = lastMonthSaved > 0 ? Math.round((savingsDiff / lastMonthSaved) * 100) : monthlySaved > 0 ? 100 : 0
  const bestFill = [...fillups].sort((a, b) => b.savedCents - a.savedCents)[0]

  return (
    <PageTransition><div className="px-4 pt-6 space-y-4 min-h-screen bg-bg">
      <h1 className="font-display text-[22px] font-bold text-text-primary">Rewards</h1>

      {/* XP / Level Card */}
      <div className="card bg-surface rounded-[14px] p-5">
        <div className="flex items-center justify-between mb-1">
          <p className="text-text-muted text-[11px] uppercase tracking-widest font-display font-bold">Total Saved</p>
          <span className="text-2xl">{levelInfo.icon}</span>
        </div>
        <AnimatedNumber
          value={user.totalSavedCents / 100}
          prefix="$"
          duration={900}
          className="font-display font-bold text-[48px] leading-none text-text-primary"
        />
        <p className="text-text-muted text-[13px] mt-2">since joining Guzzlr</p>

        {/* Month-on-month comparison */}
        <div className="mt-3 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 text-[13px] font-display font-bold ${savingsDiff >= 0 ? 'text-success' : 'text-error'}`}>
            {savingsDiff >= 0 ? '\u25B2' : '\u25BC'} {savingsDiffPct >= 0 ? '+' : ''}{savingsDiffPct}%
          </span>
          <span className="text-text-muted text-[13px]">
            vs {lastMonth.toLocaleDateString('en-AU', { month: 'short' })}
          </span>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between mb-1">
            <span className="font-display font-bold text-[13px] text-text-primary">
              Level {levelInfo.level}: {levelInfo.name}
            </span>
            <span className="text-text-muted text-[11px]">
              {user.xp.toLocaleString()} / {levelInfo.maxXp === Infinity ? '\u221E' : (levelInfo.maxXp + 1).toLocaleString()} XP
            </span>
          </div>
          <div className="w-full rounded-full h-3 overflow-hidden" style={{ backgroundColor: '#f5f5f7' }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${xpProgress * 100}%`,
                background: 'linear-gradient(90deg, #f5f5f7 0%, #007AFF 100%)',
              }}
            />
          </div>
          {xpToNext > 0 && (
            <p className="text-text-muted text-[11px] mt-1">
              {xpToNext.toLocaleString()} XP to next level
            </p>
          )}
        </div>
      </div>

      {/* Next Achievement Teaser */}
      {nextAchievement && (
        <div className="card bg-surface rounded-[14px] p-4">
          <h3 className="font-display font-bold text-[11px] text-text-muted mb-3 uppercase tracking-widest">Next Achievement</h3>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full flex items-center justify-center opacity-50 grayscale" style={{ backgroundColor: '#f5f5f7' }}>
              <span className="text-2xl">{nextAchievement.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-[15px] text-text-primary">{nextAchievement.name}</p>
              <p className="text-text-muted text-[13px]">{nextAchievement.description}</p>
              <div className="mt-2 w-full rounded-full h-2 overflow-hidden" style={{ backgroundColor: '#f5f5f7' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${nextAchievement.pct * 100}%`,
                    backgroundColor: '#007AFF',
                  }}
                />
              </div>
              <p className="text-text-muted text-[11px] mt-1">
                {nextAchievement.current} / {nextAchievement.requirement} {nextAchievement.unit.replace(/_/g, ' ')}
              </p>
            </div>
          </div>
        </div>
      )}

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
              {now.toLocaleDateString('en-AU', { month: 'long' })}
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
            {/* vs last month inline */}
            <div className="mt-3 pt-3" style={{ borderTop: '0.5px solid #d1d1d6' }}>
              <div className="flex items-center justify-between">
                <span className="text-text-muted text-[13px]">{lastMonth.toLocaleDateString('en-AU', { month: 'long' })}</span>
                <span className="text-text-secondary text-[13px] font-display font-bold">${lastMonthSaved.toFixed(2)}</span>
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
    </div></PageTransition>
  )
}
