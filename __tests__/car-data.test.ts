import { CAR_DATABASE, getUniqueMakes, getModelsByMake, getYearsByMakeModel, getCarSpecs } from '@/lib/car-data'

describe('car-data', () => {
  it('has at least 50 vehicles', () => {
    expect(CAR_DATABASE.length).toBeGreaterThanOrEqual(50)
  })

  it('getUniqueMakes returns sorted unique makes', () => {
    const makes = getUniqueMakes()
    expect(makes.length).toBeGreaterThan(10)
    expect(makes).toContain('Toyota')
    expect(makes).toContain('Ford')
    // Check sorted
    const sorted = [...makes].sort()
    expect(makes).toEqual(sorted)
  })

  it('getModelsByMake returns models for Toyota', () => {
    const models = getModelsByMake('Toyota')
    expect(models.length).toBeGreaterThan(5)
    expect(models).toContain('Hilux')
    expect(models).toContain('Corolla')
  })

  it('getCarSpecs returns correct specs for Hilux', () => {
    const specs = getCarSpecs('Toyota', 'Hilux', 2023)
    expect(specs).toBeDefined()
    expect(specs?.fuelType).toBe('Diesel')
    expect(specs?.tankSizeLitres).toBe(80)
    expect(specs?.vehicleType).toBe('ute')
  })

  it('getCarSpecs returns undefined for non-existent car', () => {
    expect(getCarSpecs('Fake', 'Car', 2023)).toBeUndefined()
  })
})
