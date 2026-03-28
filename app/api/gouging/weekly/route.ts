import { NextResponse } from 'next/server';
import { STATIONS } from '@/seed/stations';
import { getCachedLatestPrices, getCachedAreaAverage } from '@/lib/price-cache';

export async function GET() {
  const latestPrices = getCachedLatestPrices();
  const areaAverage = getCachedAreaAverage('E10');
  const tankSize = 80; // default

  const gougers = STATIONS
    .map((station) => {
      const e10Price = latestPrices.find(
        (p) => p.stationId === station.id && p.fuelType === 'E10'
      );
      if (!e10Price) return null;
      const aboveAverage = e10Price.priceCents - areaAverage;
      return {
        station,
        priceCents: e10Price.priceCents,
        areaAverageCents: areaAverage,
        aboveAverageCents: aboveAverage,
        overchargeDollars: Math.round((aboveAverage * tankSize * 0.65) / 1000 * 100) / 100,
      };
    })
    .filter((g): g is NonNullable<typeof g> => g !== null && g.aboveAverageCents > 0)
    .sort((a, b) => b.aboveAverageCents - a.aboveAverageCents)
    .slice(0, 10);

  return NextResponse.json({ gougers, areaAverage });
}
