'use client'

import { motion } from 'framer-motion'

interface Props {
  data: {
    stationName: string
    litres: number
    pricePerLitreCents: number
    totalCostCents: number
    beatAverage: boolean
    savedDollars: number
    percentVsAvg: string
    xp: number
    newStreak: number
  }
  onDone: () => void
}

export default function FillConfirmation({ data, onDone }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8 space-y-6"
    >
      {data.beatAverage && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-6xl"
        >
          🎉
        </motion.div>
      )}

      <div>
        <h2 className="font-heading text-2xl font-bold mb-1">
          {data.beatAverage ? 'Nice save!' : 'Fill-up logged'}
        </h2>
        <p className="text-text-secondary">{data.stationName}</p>
      </div>

      <div className="glass-card p-5 text-left space-y-3">
        <div className="flex justify-between">
          <span className="text-text-secondary">Price paid</span>
          <span className="font-heading font-bold">{(data.pricePerLitreCents / 10).toFixed(1)}c/L</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Total</span>
          <span className="font-heading font-bold">${(data.totalCostCents / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">vs area average</span>
          <span className={`font-heading font-bold ${parseFloat(data.percentVsAvg) < 0 ? 'text-primary' : 'text-danger'}`}>
            {data.percentVsAvg}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">{data.beatAverage ? 'You saved' : 'Overspent'}</span>
          <span className={`font-heading font-bold ${data.beatAverage ? 'text-primary' : 'text-danger'}`}>
            ${Math.abs(data.savedDollars).toFixed(2)}
          </span>
        </div>
        <hr className="border-surface-border" />
        <div className="flex justify-between">
          <span className="text-text-secondary">XP earned</span>
          <span className="font-heading font-bold text-primary">+{data.xp} XP</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Streak</span>
          <span className="font-heading font-bold">
            {data.newStreak > 0 ? `🔥 ${data.newStreak}` : 'Reset'}
          </span>
        </div>
      </div>

      <button
        onClick={onDone}
        className="w-full bg-primary text-background font-heading font-bold text-lg py-4 rounded-2xl tap-active"
      >
        Done
      </button>
    </motion.div>
  )
}
