import { NextResponse } from 'next/server';
import { STATIONS } from '@/seed/stations';
import { generatePriceHistory, getLatestPrices, getAreaAverage } from '@/seed/prices';

export async function GET() {
  const allPrices = generatePriceHistory(STATIONS);
  const latestPrices = getLatestPrices(allPrices);
  const areaAverage = getAreaAverage(latestPrices, 'E10');

  const brandMap = new Map<string, { total: number; count: number }>();

  for (const station of STATIONS) {
    const e10Price = latestPrices.find(
      (p) => p.stationId === station.id && p.fuelType === 'E10'
    );
    if (!e10Price) continue;

    const existing = brandMap.get(station.brand) || { total: 0, count: 0 };
    existing.total += e10Price.priceCents - areaAverage;
    existing.count += 1;
    brandMap.set(station.brand, existing);
  }

  const brands = Array.from(brandMap.entries())
    .map(([brand, { total, count }]) => ({
      brand,
      averageMarkupCents: Math.round(total / count),
      stationCount: count,
    }))
    .sort((a, b) => a.averageMarkupCents - b.averageMarkupCents);

  return NextResponse.json({ brands, areaAverage });
}
