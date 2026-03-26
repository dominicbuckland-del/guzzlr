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
      <div className="puffy-card p-4">
        <h3 className="font-headline font-bold text-on-surface mb-1">What if you drove something different?</h3>
        <p className="text-on-surface-variant text-sm">
          Currently spending <span className="text-primary font-headline font-bold">${currentWeekly.toFixed(0)}/week</span> on your {car?.make} {car?.model}
        </p>
      </div>

      {alternatives.map((alt) => {
        const altWeekly = alt.type === 'ev' ? evWeeklyCost : calculateWeeklyCost(alt.economyL100km, weeklyKm, avgPrice)
        const weeklySave = currentWeekly - altWeekly
        const yearlySave = weeklySave * 52

        return (
          <div key={alt.model} className="puffy-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-headline font-bold text-sm text-on-surface">{alt.make} {alt.model}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-headline uppercase tracking-widest">
                  {alt.label}
                </span>
              </div>
              <div className="text-right">
                <p className="text-on-surface-variant text-xs">{alt.type === 'ev' ? 'Electric' : `${alt.economyL100km}L/100km`}</p>
                <p className="font-headline font-bold text-sm text-on-surface">${altWeekly.toFixed(0)}/week</p>
              </div>
            </div>
            <div className="bg-[#fff0ea] rounded-2xl p-3">
              <p className="text-primary font-headline font-bold text-sm">
                Save ${weeklySave.toFixed(0)}/week (${yearlySave.toFixed(0)}/year)
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
