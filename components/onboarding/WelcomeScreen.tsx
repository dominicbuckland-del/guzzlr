'use client'

import { motion } from 'framer-motion'

interface Props {
  onNext: () => void
}

export default function WelcomeScreen({ onNext }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h1 className="font-heading text-5xl font-bold text-primary mb-2 tracking-tight">
          Guzzlr
          <span className="text-text-secondary text-lg align-super ml-1">TM</span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="font-heading text-2xl font-bold text-text-primary mt-8 leading-tight"
      >
        Stop getting ripped off
        <br />
        at the pump.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-text-secondary mt-4 text-base leading-relaxed max-w-[300px]"
      >
        Guzzlr tells you when to fill, where to fill, and exactly how much you&apos;re spending.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        onClick={onNext}
        className="mt-12 bg-primary text-background font-heading font-bold text-lg px-8 py-4 rounded-2xl tap-active hover:bg-primary/90 transition-colors"
      >
        Get Started →
      </motion.button>
    </div>
  )
}
