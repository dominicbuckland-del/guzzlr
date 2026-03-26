import { NextRequest, NextResponse } from 'next/server';
import { getCycleState } from '@/lib/cycle-engine';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'brisbane';
  const tankSize = parseFloat(searchParams.get('tank_size') || '80');

  const state = getCycleState(city, tankSize);
  return NextResponse.json(state);
}
