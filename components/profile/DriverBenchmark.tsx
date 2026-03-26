'use client'

import { useGuzzlrStore } from '@/lib/store'

export default function DriverBenchmark() {
  const { car } = useGuzzlrStore()
  if (!car) return null

  // Mock benchmark data - would come from API in production
  const avgSpend = 74
  const userSpend = 68
  const avgEconomy = car.ratedEconomyL100km + 1.2
  const userEconomy = car.ratedEconomyL100km + 0.6
  const percentile = 62

  return (
    <div className="glass-card p-4">
      <h3 className="font-heading font-bold text-sm text-text-secondary mb-3">
        Driver Benchmarks
      </h3>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-text-secondary">Avg {car.model} driver in SEQ</span>
            <span>${avgSpend}/week</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">You spend</span>
            <span className="text-primary font-heading font-bold">${userSpend}/week</span>
          </div>
        </div>
        <hr className="border-surface-border" />
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-text-secondary">Avg {car.model} economy</span>
            <span>{avgEconomy.toFixed(1)}L/100km</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Your economy</span>
            <span className="text-primary font-heading font-bold">{userEconomy.toFixed(1)}L/100km</span>
          </div>
        </div>
        <hr className="border-surface-border" />
        <div className="bg-primary/10 rounded-lg p-3 text-center">
          <p className="text-primary font-heading font-bold">
            More fuel-efficient than {percentile}% of {car.model} drivers
          </p>
        </div>
      </div>
    </div>
  )
}
