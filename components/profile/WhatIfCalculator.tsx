'use client'

import { useGuzzlrStore } from '@/lib/store'
import { calculateWeeklyCost } from '@/lib/calculations'

const alternatives = [
  { make: 'Mazda', model: '3', fuelType: '91', economyL100km: 6.2, type: 'efficient_ice' as const, label: 'Efficient ICE' },
  { make: 'Toyota', model: 'RAV4 Hybrid', fuelType: '91', economyL100km: 4.7, type: 'hybrid' as const, label: 'Hybrid' },
  { make: 'Tesla', model: 'Model 3', fuelType: 'EV', economyL100km: 0, type: 'ev' as const, label: 'Electric' },
]

export default function WhatIfCalculator() {
  const { car, user } = useGuzzlrStore()
  const weeklyKm = (user.commuteDistanceKm || 25) * 5
  const avgPrice = 1850

  const currentWeekly = car ? calculateWeeklyCost(car.ratedEconomyL100km, weeklyKm, avgPrice) : 0

  // EV cost: ~$0.05/km (home charging avg)
  const evWeeklyCost = weeklyKm * 0.05

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="glass-card p-4">
        <h3 className="font-heading font-bold mb-1">What if you drove something different?</h3>
        <p className="text-text-secondary text-sm">
          Currently spending <span className="text-primary font-heading font-bold">${currentWeekly.toFixed(0)}/week</span> on your {car?.make} {car?.model}
        </p>
      </div>

      {alternatives.map((alt) => {
        const altWeekly = alt.type === 'ev' ? evWeeklyCost : calculateWeeklyCost(alt.economyL100km, weeklyKm, avgPrice)
        const weeklySave = currentWeekly - altWeekly
        const yearlySave = weeklySave * 52

        return (
          <div key={alt.model} className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-heading font-bold text-sm">{alt.make} {alt.model}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-surface text-text-secondary">
                  {alt.label}
                </span>
              </div>
              <div className="text-right">
                <p className="text-text-secondary text-xs">{alt.type === 'ev' ? 'Electric' : `${alt.economyL100km}L/100km`}</p>
                <p className="font-heading font-bold text-sm">${altWeekly.toFixed(0)}/week</p>
              </div>
            </div>
            <div className="bg-primary/10 rounded-lg p-3">
              <p className="text-primary font-heading font-bold text-sm">
                Save ${weeklySave.toFixed(0)}/week (${yearlySave.toFixed(0)}/year)
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
