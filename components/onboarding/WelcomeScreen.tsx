'use client'

import { motion } from 'framer-motion'

interface Props {
  onNext: () => void
}

const features = [
  { emoji: '🔔', title: 'Know when to fill', description: 'We track the price cycle so you never fill at the peak' },
  { emoji: '💰', title: 'Save on every tank', description: 'Find the cheapest station near you, every single time' },
  { emoji: '📊', title: 'Track your spending', description: 'See exactly where your fuel money goes each week' },
]

export default function WelcomeScreen({ onNext }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h1 className="font-display text-5xl font-bold text-text-primary mb-2 tracking-tight">
          Guzzlr
          <span className="text-text-muted text-[15px] align-super ml-1">TM</span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="font-display text-[22px] font-bold text-text-primary mt-8 leading-tight"
      >
        Stop getting ripped off
        <br />
        at the pump.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-text-secondary mt-4 text-[15px] leading-relaxed max-w-[300px]"
      >
        Guzzlr tells you when to fill, where to fill, and exactly how much you&apos;re spending.
      </motion.p>

      {/* Feature highlights */}
      <div className="w-full max-w-[320px] mt-10 space-y-4">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + i * 0.15, duration: 0.45, ease: 'easeOut' }}
            className="flex items-start gap-4 text-left"
          >
            <span className="text-[28px] leading-none mt-0.5 shrink-0">{feature.emoji}</span>
            <div>
              <p className="font-display font-bold text-[15px] text-text-primary">{feature.title}</p>
              <p className="text-text-secondary text-[13px] leading-snug mt-0.5">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        onClick={onNext}
        className="mt-12 bg-tint text-white font-display font-bold text-[17px] px-8 py-4 rounded-full tap-active transition-all active:scale-[0.98]"
      >
        Get Started
      </motion.button>
    </div>
  )
}
