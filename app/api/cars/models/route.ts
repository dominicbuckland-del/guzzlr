import { NextRequest, NextResponse } from 'next/server';
import { getModelsByMake } from '@/lib/car-data';

export async function GET(request: NextRequest) {
  const make = new URL(request.url).searchParams.get('make') || '';
  return NextResponse.json({ models: getModelsByMake(make) });
}
