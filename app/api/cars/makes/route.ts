import { NextResponse } from 'next/server';
import { getUniqueMakes } from '@/lib/car-data';

export async function GET() {
  return NextResponse.json({ makes: getUniqueMakes() });
}
