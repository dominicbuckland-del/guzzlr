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
    <div className="card bg-surface rounded-[14px] p-4">
      <h3 className="font-display font-bold text-[11px] text-text-muted mb-3 uppercase tracking-widest">
        Driver Benchmarks
      </h3>
      <div className="space-y-0">
        <div className="py-2.5" style={{ borderBottom: '0.5px solid #d1d1d6' }}>
          <div className="flex justify-between text-[15px] mb-1">
            <span className="text-text-secondary">Avg {car.model} driver in SEQ</span>
            <span className="text-text-secondary">${avgSpend}/week</span>
          </div>
          <div className="flex justify-between text-[15px]">
            <span className="text-text-secondary">You spend</span>
            <span className="text-text-primary font-display font-bold">${userSpend}/week</span>
          </div>
        </div>
        <div className="py-2.5" style={{ borderBottom: '0.5px solid #d1d1d6' }}>
          <div className="flex justify-between text-[15px] mb-1">
            <span className="text-text-secondary">Avg {car.model} economy</span>
            <span className="text-text-secondary">{avgEconomy.toFixed(1)}L/100km</span>
          </div>
          <div className="flex justify-between text-[15px]">
            <span className="text-text-secondary">Your economy</span>
            <span className="text-text-primary font-display font-bold">{userEconomy.toFixed(1)}L/100km</span>
          </div>
        </div>
        <div className="bg-surface-high rounded-[12px] p-3 text-center mt-3">
          <p className="text-success font-display font-bold text-[13px]">
            More fuel-efficient than {percentile}% of {car.model} drivers
          </p>
        </div>
      </div>
    </div>
  )
}
