'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { hapticSuccess } from '@/lib/haptics'

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
  const [shared, setShared] = useState(false)
  const bigSave = data.beatAverage && data.savedDollars > 5

  useEffect(() => {
    hapticSuccess()
  }, [])

  const handleShare = async () => {
    const text = `Just saved $${data.savedDollars.toFixed(2)} on fuel at ${data.stationName} with Guzzlr! That's ${Math.abs(parseFloat(data.percentVsAvg))}% below the area average. #Guzzlr #FuelSavings`

    if (navigator.share) {
      try {
        await navigator.share({ text, title: 'My Guzzlr Save' })
        setShared(true)
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(text)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8 space-y-6"
    >
      {/* Confetti burst for big saves */}
      {bigSave && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-[40px] leading-none"
        >
          🎉🎊🎉
        </motion.div>
      )}

      {data.beatAverage && !bigSave && (
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
          {bigSave ? 'Massive save!' : data.beatAverage ? 'Nice save!' : 'Fill-up logged'}
        </h2>
        <p className="text-text-secondary text-[15px]">{data.stationName}</p>
      </div>

      {/* Streak highlight */}
      {data.newStreak > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 bg-surface rounded-full px-5 py-2.5 mx-auto"
        >
          <span className="text-[24px]">🔥</span>
          <span className="font-display font-bold text-text-primary text-[17px]">{data.newStreak} day streak</span>
        </motion.div>
      )}

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

      {/* Share your save button */}
      {data.beatAverage && (
        <button
          onClick={handleShare}
          className="w-full bg-surface rounded-[14px] py-3.5 font-display font-bold text-[15px] text-tint tap-active transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {shared ? 'Copied!' : 'Share your save'}
        </button>
      )}

      <button
        onClick={onDone}
        className="w-full bg-tint text-white font-display font-bold text-[15px] py-4 rounded-[14px] tap-active"
      >
        Done
      </button>
    </motion.div>
  )
}
