import { NextRequest, NextResponse } from 'next/server';
import { STATIONS } from '@/seed/stations';
import { generatePriceHistory, getLatestPrices } from '@/seed/prices';
import { getLoyaltyForBrand } from '@/lib/loyalty-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const station = STATIONS.find((s) => s.id === params.id);
  if (!station) {
    return NextResponse.json({ error: 'Station not found' }, { status: 404 });
  }

  const allPrices = generatePriceHistory(STATIONS);
  const latestPrices = getLatestPrices(allPrices).filter((p) => p.stationId === station.id);
  const loyalty = getLoyaltyForBrand(station.brand);

  return NextResponse.json({
    ...station,
    prices: latestPrices,
    loyalty,
  });
}
