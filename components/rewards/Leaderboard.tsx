'use client'

import { MOCK_USERS } from '@/seed/users'
import { getLevelInfo } from '@/lib/constants'

export default function Leaderboard() {
  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="font-headline font-bold text-xs text-text-muted uppercase tracking-widest">Top Savers This Month</h3>

      <div className="space-y-2">
        {MOCK_USERS.map((entry) => {
          const level = getLevelInfo(entry.level === 6 ? 5000 : entry.level === 5 ? 2500 : entry.level === 4 ? 1000 : entry.level === 3 ? 500 : entry.level === 2 ? 200 : 0)
          return (
            <div
              key={entry.rank}
              className={`card p-3 flex items-center gap-3 ${
                entry.isCurrentUser ? 'border-white/20' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-headline font-bold text-sm ${
                entry.rank <= 3 ? 'bg-white text-black' : 'bg-surface-high text-text-muted'
              }`}>
                {entry.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`font-medium text-sm truncate ${entry.isCurrentUser ? 'text-white' : 'text-white'}`}>
                    {entry.displayName}
                  </p>
                  <span className="text-xs">{level.icon}</span>
                </div>
                <p className="text-text-muted text-xs">{entry.carModel}</p>
              </div>
              <div className="text-right">
                <p className="font-headline font-bold text-sm text-success">
                  ${entry.savedDollars.toFixed(2)}
                </p>
                {entry.streakCount > 0 && (
                  <p className="text-text-muted text-xs">{entry.streakCount} streak</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
