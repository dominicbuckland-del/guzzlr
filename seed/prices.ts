import { StationPrice } from '../lib/types';

// Brisbane price cycle: ~17 day cycle
// E10 bottom: 165-178c/L, E10 peak: 200-222c/L
// Fuel offsets: 91: +4c, 95: +16c, 98: +28c, Diesel: +8c

const FUEL_TYPES = ['E10', '91', '95', '98', 'Diesel'];
const FUEL_OFFSETS: Record<string, number> = {
  'E10': 0,
  '91': 40,
  '95': 160,
  '98': 280,
  'Diesel': 80,
};

// Station-level variance (some consistently cheaper/more expensive)
// Use a deterministic hash of stationId to generate consistent variance
function stationVariance(stationId: string): number {
  let hash = 0;
  for (let i = 0; i < stationId.length; i++) {
    hash = ((hash << 5) - hash) + stationId.charCodeAt(i);
    hash |= 0;
  }
  return (hash % 100) / 10 - 5; // -5 to +5 cents variance
}

// Special brand adjustments
function brandAdjustment(brand: string): number {
  switch (brand) {
    case 'Costco': return -100; // 10c/L cheaper
    case 'Liberty': return -30;
    case 'United': return -20;
    case 'Metro': return -15;
    case 'Shell': return 20;
    case 'Coles Express': return 15;
    case 'BP': return 10;
    default: return 0;
  }
}

function getCyclePrice(day: number, cycleLengthDays: number = 17): number {
  // Base E10 cycle: bottom at 170c/L, peak at 212c/L
  const bottomPrice = 1700; // 170.0c/L in cents*10
  const peakPrice = 2120; // 212.0c/L
  const amplitude = (peakPrice - bottomPrice) / 2;
  const midpoint = bottomPrice + amplitude;

  // Asymmetric cycle: fast rise (~5 days), slow fall (~12 days)
  const position = (day % cycleLengthDays) / cycleLengthDays;

  // Create sawtooth-like wave: sharp rise, gradual fall
  let cycleValue: number;
  if (position < 0.18) { // bottom phase (3 days of 17)
    cycleValue = -amplitude;
  } else if (position < 0.47) { // rising phase (5 days)
    const riseProgress = (position - 0.18) / 0.29;
    cycleValue = -amplitude + (2 * amplitude * riseProgress);
  } else if (position < 0.59) { // peak phase (2 days)
    cycleValue = amplitude;
  } else { // falling phase (7 days)
    const fallProgress = (position - 0.59) / 0.41;
    cycleValue = amplitude - (2 * amplitude * fallProgress);
  }

  return Math.round(midpoint + cycleValue);
}

export function generatePriceHistory(stations: { id: string; brand: string }[]): StationPrice[] {
  const prices: StationPrice[] = [];
  const now = new Date();

  for (let dayOffset = 44; dayOffset >= 0; dayOffset--) {
    const date = new Date(now);
    date.setDate(date.getDate() - dayOffset);
    date.setHours(6, 0, 0, 0);

    for (const station of stations) {
      const basePrice = getCyclePrice(44 - dayOffset);
      const sVariance = stationVariance(station.id);
      const bAdjust = brandAdjustment(station.brand);

      // Daily random noise (deterministic based on day + station)
      const dayNoise = Math.sin((44 - dayOffset) * 13.7 + parseInt(station.id.split('-')[1]) * 7.3) * 20;

      for (const fuelType of FUEL_TYPES) {
        const fuelOffset = FUEL_OFFSETS[fuelType];
        const finalPrice = Math.round(basePrice + fuelOffset + sVariance * 10 + bAdjust + dayNoise);

        prices.push({
          id: `price-${station.id}-${fuelType}-${dayOffset}`,
          stationId: station.id,
          fuelType,
          priceCents: Math.max(1500, Math.min(2500, finalPrice)),
          source: 'government',
          recordedAt: date.toISOString(),
        });
      }
    }
  }

  return prices;
}

// Get latest prices for all stations
export function getLatestPrices(allPrices: StationPrice[]): StationPrice[] {
  const latest = new Map<string, StationPrice>();

  for (const price of allPrices) {
    const key = `${price.stationId}-${price.fuelType}`;
    const existing = latest.get(key);
    if (!existing || new Date(price.recordedAt) > new Date(existing.recordedAt)) {
      latest.set(key, price);
    }
  }

  return Array.from(latest.values());
}

// Get area average for a fuel type
export function getAreaAverage(latestPrices: StationPrice[], fuelType: string): number {
  const relevant = latestPrices.filter(p => p.fuelType === fuelType);
  if (relevant.length === 0) return 0;
  return Math.round(relevant.reduce((sum, p) => sum + p.priceCents, 0) / relevant.length);
}
