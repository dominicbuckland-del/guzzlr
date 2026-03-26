import { NextRequest, NextResponse } from 'next/server';
import { generatePriceTrend } from '@/lib/cycle-engine';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'brisbane';
  const fuelType = searchParams.get('fuel_type') || 'E10';
  const days = parseInt(searchParams.get('days') || '30');

  const trend = generatePriceTrend(city, fuelType, days);
  return NextResponse.json({ trend, city, fuelType });
}
