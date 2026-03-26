import { CycleConfig, CyclePhase, Signal, CycleState } from './types';
import { SIGNAL_LABELS } from './constants';

export const CYCLE_CONFIGS: Record<string, CycleConfig> = {
  brisbane: {
    city: 'brisbane',
    cycleLengthDays: 17,
    referenceBottomDate: '2026-03-20',
    bottomDurationDays: 3,
    riseSpeedCentsPerDay: 8,
    peakDurationDays: 2,
    fallSpeedCentsPerDay: 4,
  },
  sydney: {
    city: 'sydney',
    cycleLengthDays: 21,
    referenceBottomDate: '2026-03-18',
    bottomDurationDays: 4,
    riseSpeedCentsPerDay: 6,
    peakDurationDays: 3,
    fallSpeedCentsPerDay: 3,
  },
  melbourne: {
    city: 'melbourne',
    cycleLengthDays: 18,
    referenceBottomDate: '2026-03-19',
    bottomDurationDays: 3,
    riseSpeedCentsPerDay: 7,
    peakDurationDays: 2,
    fallSpeedCentsPerDay: 4,
  },
  adelaide: {
    city: 'adelaide',
    cycleLengthDays: 14,
    referenceBottomDate: '2026-03-21',
    bottomDurationDays: 2,
    riseSpeedCentsPerDay: 9,
    peakDurationDays: 2,
    fallSpeedCentsPerDay: 5,
  },
  perth: {
    city: 'perth',
    cycleLengthDays: 14,
    referenceBottomDate: '2026-03-22',
    bottomDurationDays: 2,
    riseSpeedCentsPerDay: 10,
    peakDurationDays: 2,
    fallSpeedCentsPerDay: 5,
  },
};

function daysBetween(date1: Date, date2: Date): number {
  const diffTime = date2.getTime() - date1.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function getCyclePosition(config: CycleConfig, date: Date = new Date()): number {
  const refDate = new Date(config.referenceBottomDate);
  const days = daysBetween(refDate, date);
  // Handle negative days (before reference)
  const position = ((days % config.cycleLengthDays) + config.cycleLengthDays) % config.cycleLengthDays;
  return position;
}

export function getCyclePhase(config: CycleConfig, date: Date = new Date()): CyclePhase {
  const pos = getCyclePosition(config, date);
  const { bottomDurationDays, peakDurationDays, cycleLengthDays } = config;

  // Phase boundaries
  const bottomEnd = bottomDurationDays;
  const risingEnd = cycleLengthDays - peakDurationDays - Math.floor((cycleLengthDays - bottomDurationDays - peakDurationDays) / 2);
  const peakEnd = risingEnd + peakDurationDays;

  if (pos < bottomEnd) return 'bottom';
  if (pos < risingEnd) return 'rising';
  if (pos < peakEnd) return 'peak';
  return 'falling';
}

export function getSignal(phase: CyclePhase, dayInCycle: number, config: CycleConfig): Signal {
  switch (phase) {
    case 'bottom':
      return 'fill_now';
    case 'rising':
      // If just started rising, still fill soon
      if (dayInCycle < config.bottomDurationDays + 2) return 'fill_soon';
      return 'wait';
    case 'peak':
      return 'wait';
    case 'falling':
      // If near bottom, hold
      const daysToBottom = config.cycleLengthDays - dayInCycle;
      if (daysToBottom <= 2) return 'hold';
      return 'wait';
    default:
      return 'hold';
  }
}

export function getPredictedChange(phase: CyclePhase, config: CycleConfig): number {
  // Returns predicted change in cents over next 3 days (positive = going up)
  switch (phase) {
    case 'bottom':
      return config.riseSpeedCentsPerDay * 3; // About to rise
    case 'rising':
      return config.riseSpeedCentsPerDay * 3;
    case 'peak':
      return -config.fallSpeedCentsPerDay * 3; // About to fall
    case 'falling':
      return -config.fallSpeedCentsPerDay * 3;
    default:
      return 0;
  }
}

export function getSignalDescription(phase: CyclePhase, city: string, predictedChange: number): string {
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  switch (phase) {
    case 'bottom':
      return `Prices in ${cityName} are at cycle low. Expected to rise ~${Math.abs(predictedChange)}c/L in the next 3 days.`;
    case 'rising':
      return `Prices in ${cityName} are rising. Expected to go up another ~${Math.abs(predictedChange)}c/L in the next 3 days.`;
    case 'peak':
      return `Prices in ${cityName} are at cycle peak. Expected to drop ~${Math.abs(predictedChange)}c/L in the next 3 days.`;
    case 'falling':
      return `Prices in ${cityName} are falling. Expected to drop another ~${Math.abs(predictedChange)}c/L in the next 3 days.`;
    default:
      return `Prices in ${cityName} are stable.`;
  }
}

export function getCycleState(
  city: string = 'brisbane',
  tankSizeLitres: number = 65,
  date: Date = new Date()
): CycleState {
  const config = CYCLE_CONFIGS[city] || CYCLE_CONFIGS.brisbane;
  const dayInCycle = getCyclePosition(config, date);
  const phase = getCyclePhase(config, date);
  const signal = getSignal(phase, dayInCycle, config);
  const predictedChange = getPredictedChange(phase, config);

  // Calculate personalised savings: price swing * tank size / 2 (assume half tank fill)
  const potentialSwingCents = Math.abs(predictedChange) * (config.cycleLengthDays / 3);
  const personalSavingsDollars = (potentialSwingCents * (tankSizeLitres * 0.65)) / 100;

  return {
    city,
    phase,
    signal,
    signalLabel: SIGNAL_LABELS[signal],
    signalDescription: getSignalDescription(phase, city, predictedChange),
    dayInCycle,
    predictedChangeCents: predictedChange,
    personalSavingsDollars: Math.round(personalSavingsDollars * 100) / 100,
    confidence: phase === 'bottom' || phase === 'peak' ? 0.85 : 0.7,
  };
}

// Generate price trend data for charting
export function generatePriceTrend(
  city: string = 'brisbane',
  fuelType: string = 'E10',
  days: number = 30
): { date: string; price: number; phase: CyclePhase }[] {
  const config = CYCLE_CONFIGS[city] || CYCLE_CONFIGS.brisbane;
  const basePrice = fuelType === 'E10' ? 175 : fuelType === '91' ? 179 : fuelType === '95' ? 191 : fuelType === '98' ? 203 : 183;
  const points: { date: string; price: number; phase: CyclePhase }[] = [];

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayInCycle = getCyclePosition(config, date);
    const phase = getCyclePhase(config, date);

    let priceOffset = 0;
    switch (phase) {
      case 'bottom':
        priceOffset = 0;
        break;
      case 'rising':
        priceOffset = (dayInCycle - config.bottomDurationDays) * config.riseSpeedCentsPerDay;
        break;
      case 'peak':
        priceOffset = (config.cycleLengthDays - config.bottomDurationDays - config.peakDurationDays) / 2 * config.riseSpeedCentsPerDay;
        break;
      case 'falling':
        const peakOffset = (config.cycleLengthDays - config.bottomDurationDays - config.peakDurationDays) / 2 * config.riseSpeedCentsPerDay;
        const fallingDays = config.cycleLengthDays - dayInCycle;
        priceOffset = peakOffset - (peakOffset - 0) * (1 - fallingDays / (config.cycleLengthDays - config.bottomDurationDays - config.peakDurationDays - (config.cycleLengthDays - config.bottomDurationDays - config.peakDurationDays) / 2));
        break;
    }

    // Add some random noise
    const noise = (Math.sin(i * 7.3 + dayInCycle * 3.7) * 3);
    const price = Math.round((basePrice + priceOffset + noise) * 10) / 10;

    points.push({
      date: date.toISOString().split('T')[0],
      price,
      phase,
    });
  }

  return points;
}
