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
          className="w-24 h-24 rounded-full bg-surface-high mx-auto flex items-center justify-center"
        >
          <span className="text-5xl text-success">+</span>
        </motion.div>
      )}

      <div>
        <h2 className="font-headline text-2xl font-bold text-white mb-1">
          {data.beatAverage ? 'Nice save!' : 'Fill-up logged'}
        </h2>
        <p className="text-text-secondary">{data.stationName}</p>
      </div>

      <div className="card p-5 text-left space-y-3">
        <div className="flex justify-between">
          <span className="text-text-secondary">Price paid</span>
          <span className="font-headline font-bold text-white">{(data.pricePerLitreCents / 10).toFixed(1)}c/L</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Total</span>
          <span className="font-headline font-bold text-white">${(data.totalCostCents / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">vs area average</span>
          <span className={`font-headline font-bold ${parseFloat(data.percentVsAvg) < 0 ? 'text-success' : 'text-error'}`}>
            {data.percentVsAvg}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">{data.beatAverage ? 'You saved' : 'Overspent'}</span>
          <span className={`font-headline font-bold ${data.beatAverage ? 'text-success' : 'text-error'}`}>
            ${Math.abs(data.savedDollars).toFixed(2)}
          </span>
        </div>
        <hr className="border-surface-border" />
        <div className="flex justify-between">
          <span className="text-text-secondary">XP earned</span>
          <span className="font-headline font-bold text-white">+{data.xp} XP</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Streak</span>
          <span className="font-headline font-bold text-white">
            {data.newStreak > 0 ? `${data.newStreak} days` : 'Reset'}
          </span>
        </div>
      </div>

      <button
        onClick={onDone}
        className="w-full bg-white text-black font-headline font-bold text-base py-3.5 rounded-full tap-active"
      >
        Done
      </button>
    </motion.div>
  )
}
