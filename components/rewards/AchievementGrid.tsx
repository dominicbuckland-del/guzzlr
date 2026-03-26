'use client'

import { useState } from 'react'
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

export default function AchievementGrid() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const unlockedKeys = new Set(DEMO_ACHIEVEMENTS.map(a => a.achievementKey))

  const selected = selectedKey ? ACHIEVEMENTS.find(a => a.key === selectedKey) : null
  const isUnlocked = selectedKey ? unlockedKeys.has(selectedKey) : false

  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-on-surface-variant text-sm">
        {unlockedKeys.size} / {ACHIEVEMENTS.length} unlocked
      </p>

      {CATEGORIES.map(cat => {
        const achievements = ACHIEVEMENTS.filter(a => a.category === cat.key)
        return (
          <div key={cat.key}>
            <h3 className="font-headline font-bold text-xs text-on-surface-variant mb-2 uppercase tracking-widest">{cat.label}</h3>
            <div className="grid grid-cols-4 gap-3">
              {achievements.map(a => (
                <Badge
                  key={a.key}
                  icon={a.icon}
                  name={a.name}
                  unlocked={unlockedKeys.has(a.key)}
                  size="md"
                  onClick={() => setSelectedKey(a.key === selectedKey ? null : a.key)}
                />
              ))}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-8"
            onClick={() => setSelectedKey(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="puffy-card p-6 max-w-[320px] w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-5xl mb-3">{selected.icon}</div>
              <h3 className="font-headline text-xl font-bold text-on-surface mb-1">{selected.name}</h3>
              <p className="text-on-surface-variant text-sm mb-3">{selected.description}</p>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-headline font-bold uppercase tracking-widest ${
                isUnlocked ? 'bg-secondary-container text-on-surface' : 'bg-surface-container-low text-on-surface-variant'
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
