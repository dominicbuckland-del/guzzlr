import { NextResponse } from 'next/server';
import { getLevelInfo } from '@/lib/constants';
import { DEMO_FILLUPS } from '@/seed/users';

export async function GET() {
  const xp = 1340;
  const level = getLevelInfo(xp);

  return NextResponse.json({
    id: 'demo-user-001',
    displayName: 'You',
    xp,
    level: level.level,
    levelName: level.name,
    streakCount: 5,
    totalSavedCents: 24780,
    fillCount: DEMO_FILLUPS.length,
    car: {
      year: 2023,
      make: 'Toyota',
      model: 'Hilux',
      fuelType: 'Diesel',
      tankSizeLitres: 80,
      ratedEconomyL100km: 8.3,
      vehicleType: 'ute',
    },
  });
}
