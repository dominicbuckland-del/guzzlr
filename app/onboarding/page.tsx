'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import WelcomeScreen from '@/components/onboarding/WelcomeScreen'
import CarSelector from '@/components/onboarding/CarSelector'
import CommuteSetup from '@/components/onboarding/CommuteSetup'
import { useGuzzlrStore } from '@/lib/store'

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const router = useRouter()
  const { setHasOnboarded } = useGuzzlrStore()

  const handleComplete = () => {
    setHasOnboarded(true)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <WelcomeScreen onNext={() => setStep(1)} />
          </motion.div>
        )}
        {step === 1 && (
          <motion.div
            key="car"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <CarSelector onNext={() => setStep(2)} onBack={() => setStep(0)} />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key="commute"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <CommuteSetup onComplete={handleComplete} onBack={() => setStep(1)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 pb-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === step ? 'bg-primary w-6' : i < step ? 'bg-primary/50' : 'bg-surface-border'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
