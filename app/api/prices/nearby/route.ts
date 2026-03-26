import { NextRequest, NextResponse } from 'next/server';
import { STATIONS } from '@/seed/stations';
import { generatePriceHistory, getLatestPrices, getAreaAverage } from '@/seed/prices';
import { distanceKm, calculateFillCost, calculateSavings } from '@/lib/calculations';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '-27.4698');
  const lng = parseFloat(searchParams.get('lng') || '153.0251');
  const radius = parseInt(searchParams.get('radius') || '10');
  const fuelType = searchParams.get('fuel_type') || 'Diesel';
  const tankSize = parseFloat(searchParams.get('tank_size') || '80');

  const allPrices = generatePriceHistory(STATIONS);
  const latestPrices = getLatestPrices(allPrices);
  const areaAverage = getAreaAverage(latestPrices, fuelType);

  const stations = STATIONS
    .map((station) => {
      const dist = distanceKm(lat, lng, station.latitude, station.longitude);
      const prices = latestPrices.filter((p) => p.stationId === station.id);
      const userFuelPrice = prices.find((p) => p.fuelType === fuelType);

      return {
        ...station,
        distance: dist,
        prices,
        userFuelPrice: userFuelPrice?.priceCents || null,
        fillCost: userFuelPrice ? calculateFillCost(userFuelPrice.priceCents, tankSize) : null,
        savings: userFuelPrice ? calculateSavings(userFuelPrice.priceCents, areaAverage, tankSize) : null,
      };
    })
    .filter((s) => s.distance <= radius)
    .sort((a, b) => (a.userFuelPrice || 9999) - (b.userFuelPrice || 9999));

  return NextResponse.json({
    stations,
    areaAverage,
    fuelType,
    count: stations.length,
  });
}
