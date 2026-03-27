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
          className="w-24 h-24 rounded-full bg-surface mx-auto flex items-center justify-center"
        >
          <span className="text-5xl text-success">+</span>
        </motion.div>
      )}

      <div>
        <h2 className="font-display text-[22px] font-bold text-text-primary mb-1">
          {data.beatAverage ? 'Nice save!' : 'Fill-up logged'}
        </h2>
        <p className="text-text-secondary text-[15px]">{data.stationName}</p>
      </div>

      <div className="card bg-surface rounded-[14px] p-5 text-left space-y-0">
        <div className="flex justify-between py-3" style={{ borderBottom: '0.5px solid #d1d1d6' }}>
          <span className="text-text-secondary text-[15px]">Price paid</span>
          <span className="font-display font-bold text-text-primary text-[15px]">{(data.pricePerLitreCents / 10).toFixed(1)}c/L</span>
        </div>
        <div className="flex justify-between py-3" style={{ borderBottom: '0.5px solid #d1d1d6' }}>
          <span className="text-text-secondary text-[15px]">Total</span>
          <span className="font-display font-bold text-text-primary text-[15px]">${(data.totalCostCents / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-3" style={{ borderBottom: '0.5px solid #d1d1d6' }}>
          <span className="text-text-secondary text-[15px]">vs area average</span>
          <span className={`font-display font-bold text-[15px] ${parseFloat(data.percentVsAvg) < 0 ? 'text-success' : 'text-error'}`}>
            {data.percentVsAvg}%
          </span>
        </div>
        <div className="flex justify-between py-3" style={{ borderBottom: '0.5px solid #d1d1d6' }}>
          <span className="text-text-secondary text-[15px]">{data.beatAverage ? 'You saved' : 'Overspent'}</span>
          <span className={`font-display font-bold text-[15px] ${data.beatAverage ? 'text-success' : 'text-error'}`}>
            ${Math.abs(data.savedDollars).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between py-3" style={{ borderBottom: '0.5px solid #d1d1d6' }}>
          <span className="text-text-secondary text-[15px]">XP earned</span>
          <span className="font-display font-bold text-tint text-[15px]">+{data.xp} XP</span>
        </div>
        <div className="flex justify-between py-3">
          <span className="text-text-secondary text-[15px]">Streak</span>
          <span className="font-display font-bold text-text-primary text-[15px]">
            {data.newStreak > 0 ? `${data.newStreak} days` : 'Reset'}
          </span>
        </div>
      </div>

      <button
        onClick={onDone}
        className="w-full bg-tint text-white font-display font-bold text-[15px] py-4 rounded-[14px] tap-active"
      >
        Done
      </button>
    </motion.div>
  )
}
