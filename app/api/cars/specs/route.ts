import { NextRequest, NextResponse } from 'next/server';
import { getCarSpecs } from '@/lib/car-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const make = searchParams.get('make') || '';
  const model = searchParams.get('model') || '';
  const year = parseInt(searchParams.get('year') || '2023');

  const specs = getCarSpecs(make, model, year);
  if (!specs) {
    return NextResponse.json({ error: 'Car not found' }, { status: 404 });
  }
  return NextResponse.json(specs);
}
