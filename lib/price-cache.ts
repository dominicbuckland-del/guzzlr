import { STATIONS } from '@/seed/stations'
import { generatePriceHistory, getLatestPrices, getAreaAverage } from '@/seed/prices'
import { StationPrice } from '@/lib/types'

// Generate prices once and cache
let _allPrices: StationPrice[] | null = null
let _latestPrices: StationPrice[] | null = null
const _areaAverageCache = new Map<string, number>()

export function getAllPrices(): StationPrice[] {
  if (!_allPrices) {
    _allPrices = generatePriceHistory(STATIONS)
  }
  return _allPrices
}

export function getCachedLatestPrices(): StationPrice[] {
  if (!_latestPrices) {
    _latestPrices = getLatestPrices(getAllPrices())
  }
  return _latestPrices
}

export function getCachedAreaAverage(fuelType: string): number {
  if (!_areaAverageCache.has(fuelType)) {
    _areaAverageCache.set(fuelType, getAreaAverage(getCachedLatestPrices(), fuelType))
  }
  return _areaAverageCache.get(fuelType)!
}

// Invalidate cache (call if prices would change)
export function invalidatePriceCache() {
  _allPrices = null
  _latestPrices = null
  _areaAverageCache.clear()
}
