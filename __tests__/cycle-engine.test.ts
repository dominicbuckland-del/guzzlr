import { getCyclePosition, getCyclePhase, getCycleState, CYCLE_CONFIGS } from '@/lib/cycle-engine'

describe('cycle-engine', () => {
  const config = CYCLE_CONFIGS.brisbane

  describe('getCyclePosition', () => {
    it('returns 0 at reference bottom date', () => {
      const refDate = new Date(config.referenceBottomDate)
      expect(getCyclePosition(config, refDate)).toBe(0)
    })

    it('wraps around cycle length', () => {
      const refDate = new Date(config.referenceBottomDate)
      const futureDate = new Date(refDate.getTime() + config.cycleLengthDays * 24 * 60 * 60 * 1000)
      expect(getCyclePosition(config, futureDate)).toBe(0)
    })

    it('returns positive value for dates after reference', () => {
      const refDate = new Date(config.referenceBottomDate)
      const nextDay = new Date(refDate.getTime() + 24 * 60 * 60 * 1000)
      expect(getCyclePosition(config, nextDay)).toBe(1)
    })
  })

  describe('getCyclePhase', () => {
    it('returns bottom at reference date', () => {
      const refDate = new Date(config.referenceBottomDate)
      expect(getCyclePhase(config, refDate)).toBe('bottom')
    })

    it('returns a valid phase', () => {
      const phase = getCyclePhase(config)
      expect(['bottom', 'rising', 'peak', 'falling']).toContain(phase)
    })
  })

  describe('getCycleState', () => {
    it('returns complete state object', () => {
      const state = getCycleState('brisbane', 80)
      expect(state).toHaveProperty('phase')
      expect(state).toHaveProperty('signal')
      expect(state).toHaveProperty('signalLabel')
      expect(state).toHaveProperty('personalSavingsDollars')
      expect(state.personalSavingsDollars).toBeGreaterThanOrEqual(0)
    })

    it('signal is one of valid values', () => {
      const state = getCycleState('brisbane', 80)
      expect(['fill_now', 'hold', 'wait', 'fill_soon']).toContain(state.signal)
    })

    it('uses default city if invalid', () => {
      const state = getCycleState('invalid_city', 80)
      expect(state.city).toBe('invalid_city')
      expect(state).toHaveProperty('signal')
    })
  })
})
