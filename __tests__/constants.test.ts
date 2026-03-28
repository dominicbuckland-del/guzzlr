import { getLevelInfo, getXpToNextLevel, getXpProgress, LEVELS } from '@/lib/constants'

describe('getLevelInfo', () => {
  it('returns Learner for 0 XP', () => {
    expect(getLevelInfo(0).name).toBe('Learner')
    expect(getLevelInfo(0).level).toBe(1)
  })

  it('returns Shark for 1340 XP', () => {
    expect(getLevelInfo(1340).name).toBe('Shark')
    expect(getLevelInfo(1340).level).toBe(4)
  })

  it('returns Fuel Boss for 5000+ XP', () => {
    expect(getLevelInfo(5000).name).toBe('Fuel Boss')
    expect(getLevelInfo(10000).level).toBe(6)
  })
})

describe('getXpToNextLevel', () => {
  it('returns positive number for non-max level', () => {
    expect(getXpToNextLevel(0)).toBeGreaterThan(0)
    expect(getXpToNextLevel(1340)).toBeGreaterThan(0)
  })

  it('returns 0 for max level', () => {
    expect(getXpToNextLevel(5000)).toBe(0)
  })
})

describe('getXpProgress', () => {
  it('returns 0 at level start', () => {
    expect(getXpProgress(0)).toBe(0)
  })

  it('returns value between 0 and 1', () => {
    const progress = getXpProgress(1340)
    expect(progress).toBeGreaterThan(0)
    expect(progress).toBeLessThan(1)
  })

  it('returns 1 for max level', () => {
    expect(getXpProgress(5000)).toBe(1)
  })
})
