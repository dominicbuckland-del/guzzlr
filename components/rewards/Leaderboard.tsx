'use client'

import { MOCK_USERS } from '@/seed/users'
import { getLevelInfo } from '@/lib/constants'

export default function Leaderboard() {
  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="font-display font-bold text-[11px] text-text-muted uppercase tracking-widest">Top Savers This Month</h3>

      <div>
        {MOCK_USERS.map((entry, i) => {
          const level = getLevelInfo(entry.level === 6 ? 5000 : entry.level === 5 ? 2500 : entry.level === 4 ? 1000 : entry.level === 3 ? 500 : entry.level === 2 ? 200 : 0)
          return (
            <div
              key={entry.rank}
              className="flex items-center gap-3 py-3"
              style={i < MOCK_USERS.length - 1 ? { borderBottom: '0.5px solid #d1d1d6' } : {}}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-[13px] ${
                entry.rank <= 3 ? 'bg-text-primary text-white' : 'bg-surface text-text-muted'
              }`}>
                {entry.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-[15px] truncate text-text-primary">
                    {entry.displayName}
                  </p>
                  <span className="text-[11px]">{level.icon}</span>
                </div>
                <p className="text-text-muted text-[11px]">{entry.carModel}</p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-[15px] text-success">
                  ${entry.savedDollars.toFixed(2)}
                </p>
                {entry.streakCount > 0 && (
                  <p className="text-text-muted text-[11px]">{entry.streakCount} streak</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
