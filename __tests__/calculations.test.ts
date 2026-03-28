import { formatPrice, formatDollars, calculateFillCost, calculateSavings, distanceKm } from '@/lib/calculations'

describe('formatPrice', () => {
  it('formats cents*10 to display string', () => {
    expect(formatPrice(1789)).toBe('178.9')
    expect(formatPrice(2000)).toBe('200.0')
    expect(formatPrice(1650)).toBe('165.0')
  })
})

describe('formatDollars', () => {
  it('formats cents to dollar string', () => {
    expect(formatDollars(11670)).toBe('$116.70')
    expect(formatDollars(0)).toBe('$0.00')
    expect(formatDollars(-500)).toBe('-$5.00')
  })
})

describe('calculateFillCost', () => {
  it('calculates fill cost from price and tank size', () => {
    // 178.9c/L, 80L tank, 65% fill
    const cost = calculateFillCost(1789, 80, 0.65)
    expect(cost).toBeCloseTo(93.03, 1)
  })

  it('handles different fill percentages', () => {
    const fullTank = calculateFillCost(1789, 80, 1.0)
    expect(fullTank).toBeCloseTo(143.12, 1)
  })
})

describe('calculateSavings', () => {
  it('calculates positive savings when below average', () => {
    const savings = calculateSavings(1700, 1800, 80, 0.65)
    expect(savings).toBeGreaterThan(0)
  })

  it('returns negative when above average', () => {
    const savings = calculateSavings(1900, 1800, 80, 0.65)
    expect(savings).toBeLessThan(0)
  })
})

describe('distanceKm', () => {
  it('calculates distance between two points', () => {
    // Brisbane CBD to Chermside ~8km
    const dist = distanceKm(-27.4698, 153.0251, -27.3855, 153.0290)
    expect(dist).toBeGreaterThan(5)
    expect(dist).toBeLessThan(15)
  })

  it('returns 0 for same point', () => {
    expect(distanceKm(-27.47, 153.03, -27.47, 153.03)).toBe(0)
  })
})
