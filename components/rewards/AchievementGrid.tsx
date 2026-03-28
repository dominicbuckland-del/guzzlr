'use client'

import { useState, useMemo } from 'react'
import { hapticMedium } from '@/lib/haptics'
import { ACHIEVEMENTS } from '@/lib/achievements'
import { DEMO_ACHIEVEMENTS } from '@/seed/users'
import Badge from '@/components/shared/Badge'
import { motion, AnimatePresence } from 'framer-motion'

const CATEGORIES = [
  { key: 'savings', label: 'Savings' },
  { key: 'streak', label: 'Streaks' },
  { key: 'timing', label: 'Timing' },
  { key: 'volume', label: 'Volume' },
  { key: 'community', label: 'Community' },
  { key: 'special', label: 'Special' },
]

// Simulated progress for locked achievements (demo data)
const PROGRESS_MAP: Record<string, number> = {
  five_hundy: 24780,
  grand_master: 24780,
  machine: 5,
  inhuman: 5,
  fortune_teller: 4,
  time_lord: 4,
  dedicated: 12,
  obsessed: 12,
  guzzlr_for_life: 12,
  watchdog: 8,
  sentinel: 8,
  scout: 8,
  whistleblower: 2,
  night_owl: 0,
  early_bird: 0,
  road_tripper: 0,
  brand_switcher: 4,
  bargain_hunter: 0,
}

export default function AchievementGrid() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const unlockedKeys = new Set(DEMO_ACHIEVEMENTS.map(a => a.achievementKey))

  // Map of achievementKey -> achievedAt for recency check
  const unlockedDates = useMemo(() => {
    const map = new Map<string, string>()
    DEMO_ACHIEVEMENTS.forEach(a => map.set(a.achievementKey, a.achievedAt))
    return map
  }, [])

  const isRecentlyUnlocked = (key: string) => {
    const date = unlockedDates.get(key)
    if (!date) return false
    const diff = Date.now() - new Date(date).getTime()
    return diff < 7 * 24 * 60 * 60 * 1000
  }

  const selected = selectedKey ? ACHIEVEMENTS.find(a => a.key === selectedKey) : null
  const isUnlocked = selectedKey ? unlockedKeys.has(selectedKey) : false

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Count header */}
      <div className="flex items-center justify-between">
        <p className="font-display font-bold text-[15px] text-text-primary">
          {unlockedKeys.size} of {ACHIEVEMENTS.length} unlocked
        </p>
        <div className="w-24 rounded-full h-2 overflow-hidden" style={{ backgroundColor: '#f5f5f7' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${(unlockedKeys.size / ACHIEVEMENTS.length) * 100}%`,
              backgroundColor: '#007AFF',
            }}
          />
        </div>
      </div>

      {CATEGORIES.map(cat => {
        const achievements = ACHIEVEMENTS.filter(a => a.category === cat.key)
        return (
          <div key={cat.key}>
            <h3 className="font-display font-bold text-[11px] text-text-muted mb-2 uppercase tracking-widest">{cat.label}</h3>
            <div className="grid grid-cols-4 gap-3">
              {achievements.map(a => {
                const unlocked = unlockedKeys.has(a.key)
                const recent = isRecentlyUnlocked(a.key)
                const progress = !unlocked ? (PROGRESS_MAP[a.key] ?? 0) : 0
                const progressPct = !unlocked ? Math.min(progress / a.requirement, 0.99) : 0
                return (
                  <div key={a.key} className="flex flex-col items-center gap-1.5">
                    {/* Badge with optional blue ring for recent unlocks */}
                    <div
                      className={`rounded-full p-[3px] ${recent ? '' : 'p-0'}`}
                      style={recent ? {
                        background: 'linear-gradient(135deg, #007AFF, #5AC8FA)',
                        padding: '3px',
                        borderRadius: '9999px',
                      } : {}}
                    >
                      <Badge
                        icon={a.icon}
                        name=""
                        unlocked={unlocked}
                        size="md"
                        onClick={() => { hapticMedium(); setSelectedKey(a.key === selectedKey ? null : a.key) }}
                      />
                    </div>
                    <span className={`text-[11px] font-medium text-center leading-tight ${unlocked ? 'text-text-primary' : 'text-text-muted'}`}>
                      {a.name}
                    </span>
                    {/* Progress bar for locked achievements */}
                    {!unlocked && progressPct > 0 && (
                      <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ backgroundColor: '#f5f5f7' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${progressPct * 100}%`,
                            backgroundColor: '#aeaeb2',
                          }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-8"
            onClick={() => setSelectedKey(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-[16px] p-6 max-w-[320px] w-full text-center"
              style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-5xl mb-3">{selected.icon}</div>
              <h3 className="font-display text-[17px] font-bold text-text-primary mb-1">{selected.name}</h3>
              <p className="text-text-secondary text-[13px] mb-3">{selected.description}</p>

              {/* Progress in modal for locked */}
              {!isUnlocked && (
                <div className="mb-3">
                  <div className="w-full rounded-full h-2 overflow-hidden mx-auto max-w-[200px]" style={{ backgroundColor: '#f5f5f7' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(((PROGRESS_MAP[selected.key] ?? 0) / selected.requirement), 0.99) * 100}%`,
                        backgroundColor: '#007AFF',
                      }}
                    />
                  </div>
                  <p className="text-text-muted text-[11px] mt-1">
                    {PROGRESS_MAP[selected.key] ?? 0} / {selected.requirement} {selected.unit.replace(/_/g, ' ')}
                  </p>
                </div>
              )}

              <div className={`inline-block px-3 py-1 rounded-full text-[11px] font-display font-bold uppercase tracking-widest ${
                isUnlocked ? 'bg-surface text-tint' : 'bg-surface text-text-muted opacity-40'
              }`}>
                {isUnlocked ? 'Unlocked!' : 'Locked'}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
