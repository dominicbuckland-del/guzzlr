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
    <div className="puffy-card p-4">
      <h3 className="font-headline font-bold text-xs text-on-surface-variant mb-3 uppercase tracking-widest">
        Driver Benchmarks
      </h3>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-on-surface-variant">Avg {car.model} driver in SEQ</span>
            <span className="text-on-surface">${avgSpend}/week</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">You spend</span>
            <span className="text-primary font-headline font-bold">${userSpend}/week</span>
          </div>
        </div>
        <hr className="border-outline-variant/20" />
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-on-surface-variant">Avg {car.model} economy</span>
            <span className="text-on-surface">{avgEconomy.toFixed(1)}L/100km</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Your economy</span>
            <span className="text-primary font-headline font-bold">{userEconomy.toFixed(1)}L/100km</span>
          </div>
        </div>
        <hr className="border-outline-variant/20" />
        <div className="bg-[#fff0ea] rounded-2xl p-3 text-center">
          <p className="text-primary font-headline font-bold">
            More fuel-efficient than {percentile}% of {car.model} drivers
          </p>
        </div>
      </div>
    </div>
  )
}
