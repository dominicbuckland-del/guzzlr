'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedNumberProps {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  className?: string
}

export default function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 2,
  duration = 600,
  className = '',
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const prevValue = useRef(value)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const start = prevValue.current
    const end = value
    const diff = end - start
    const startTime = performance.now()

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(start + diff * eased)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        prevValue.current = end
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value, duration])

  return (
    <span className={className}>
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </span>
  )
}
