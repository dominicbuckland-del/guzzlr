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
          className="w-24 h-24 rounded-full bg-secondary-container mx-auto flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-5xl text-on-surface">celebration</span>
        </motion.div>
      )}

      <div>
        <h2 className="font-headline text-2xl font-bold text-on-surface mb-1">
          {data.beatAverage ? 'Nice save!' : 'Fill-up logged'}
        </h2>
        <p className="text-on-surface-variant">{data.stationName}</p>
      </div>

      <div className="puffy-card p-5 text-left space-y-3">
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Price paid</span>
          <span className="font-headline font-bold text-on-surface">{(data.pricePerLitreCents / 10).toFixed(1)}c/L</span>
        </div>
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Total</span>
          <span className="font-headline font-bold text-on-surface">${(data.totalCostCents / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-on-surface-variant">vs area average</span>
          <span className={`font-headline font-bold ${parseFloat(data.percentVsAvg) < 0 ? 'text-primary' : 'text-error'}`}>
            {data.percentVsAvg}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-on-surface-variant">{data.beatAverage ? 'You saved' : 'Overspent'}</span>
          <span className={`font-headline font-bold ${data.beatAverage ? 'text-primary' : 'text-error'}`}>
            ${Math.abs(data.savedDollars).toFixed(2)}
          </span>
        </div>
        <hr className="border-outline-variant/20" />
        <div className="flex justify-between">
          <span className="text-on-surface-variant">XP earned</span>
          <span className="font-headline font-bold text-primary">+{data.xp} XP</span>
        </div>
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Streak</span>
          <span className="font-headline font-bold text-on-surface">
            {data.newStreak > 0 ? `${data.newStreak} days` : 'Reset'}
          </span>
        </div>
      </div>

      <button
        onClick={onDone}
        className="w-full btn-primary font-headline font-bold text-lg py-4 rounded-2xl tap-active transition-all active:scale-[0.98]"
      >
        Done
      </button>
    </motion.div>
  )
}
