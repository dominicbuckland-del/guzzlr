import { FillUp } from './types';

// Format price from cents*10 integer to display string
// e.g., 1789 -> "178.9"
export function formatPrice(priceCents: number): string {
  return (priceCents / 10).toFixed(1);
}

// Format dollars from cents to display string
// e.g., 11670 -> "$116.70"
export function formatDollars(cents: number): string {
  const dollars = Math.abs(cents) / 100;
  const sign = cents < 0 ? '-' : '';
  return `${sign}$${dollars.toFixed(2)}`;
}

// Calculate fill cost given price per litre (cents*10) and tank size
// Assumes half-tank fill by default
export function calculateFillCost(
  priceCents: number,
  tankSizeLitres: number,
  fillPercent: number = 0.65
): number {
  // priceCents is e.g. 1789 for 178.9c/L
  const pricePerLitre = priceCents / 1000; // convert to dollars
  return Math.round(pricePerLitre * tankSizeLitres * fillPercent * 100) / 100;
}

// Calculate savings vs area average
export function calculateSavings(
  priceCents: number,
  areaAverageCents: number,
  tankSizeLitres: number,
  fillPercent: number = 0.65
): number {
  const diffPerLitre = (areaAverageCents - priceCents) / 1000; // dollars
  return Math.round(diffPerLitre * tankSizeLitres * fillPercent * 100) / 100;
}

// Calculate fuel economy from fill-ups (L/100km)
export function calculateEconomy(fillups: FillUp[]): number | null {
  const fullTankFills = fillups
    .filter(f => f.isFullTank && f.odometerKm)
    .sort((a, b) => (a.odometerKm || 0) - (b.odometerKm || 0));

  if (fullTankFills.length < 2) return null;

  let totalLitres = 0;
  let totalKm = 0;

  for (let i = 1; i < fullTankFills.length; i++) {
    const km = (fullTankFills[i].odometerKm || 0) - (fullTankFills[i - 1].odometerKm || 0);
    if (km > 0) {
      totalKm += km;
      totalLitres += fullTankFills[i].litres;
    }
  }

  if (totalKm === 0) return null;
  return Math.round((totalLitres / totalKm) * 100 * 10) / 10;
}

// Calculate weekly fuel cost
export function calculateWeeklyCost(
  economyL100km: number,
  weeklyKm: number,
  pricePerLitreCents: number
): number {
  const litresPerWeek = (economyL100km / 100) * weeklyKm;
  const costDollars = litresPerWeek * (pricePerLitreCents / 1000);
  return Math.round(costDollars * 100) / 100;
}

// Calculate cost per km
export function calculateCostPerKm(
  economyL100km: number,
  pricePerLitreCents: number
): number {
  const costPerLitre = pricePerLitreCents / 1000;
  return Math.round((economyL100km / 100) * costPerLitre * 100) / 100;
}

// Distance between two coordinates in km (Haversine formula)
export function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Get weekly spend from fill-ups
export function getWeeklySpend(fillups: FillUp[], weeksBack: number = 1): number {
  const now = new Date();
  const weekStart = new Date(now.getTime() - weeksBack * 7 * 24 * 60 * 60 * 1000);
  const weekEnd = weeksBack === 1 ? now : new Date(now.getTime() - (weeksBack - 1) * 7 * 24 * 60 * 60 * 1000);

  return fillups
    .filter(f => {
      const d = new Date(f.filledAt);
      return d >= weekStart && d < weekEnd;
    })
    .reduce((sum, f) => sum + f.totalCostCents, 0);
}

// Get monthly spend from fill-ups
export function getMonthlySpend(fillups: FillUp[], monthsBack: number = 0): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() - monthsBack;

  return fillups
    .filter(f => {
      const d = new Date(f.filledAt);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .reduce((sum, f) => sum + f.totalCostCents, 0);
}

// Get total savings from fill-ups
export function getTotalSaved(fillups: FillUp[]): number {
  return fillups.reduce((sum, f) => sum + Math.max(0, f.savedCents), 0);
}

// Get sparkline data for weekly spend (last N weeks)
export function getWeeklySpendSeries(fillups: FillUp[], weeks: number = 8): number[] {
  return Array.from({ length: weeks }, (_, i) => {
    const spend = getWeeklySpend(fillups, weeks - i);
    return spend / 100; // Convert to dollars
  });
}
