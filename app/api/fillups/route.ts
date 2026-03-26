import { NextRequest, NextResponse } from 'next/server';
import { DEMO_FILLUPS } from '@/seed/users';

export async function GET() {
  return NextResponse.json({ fillups: DEMO_FILLUPS });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // In production, would save to DB. For demo, return success with calculated data.
  return NextResponse.json({
    success: true,
    fillup: body,
    message: 'Fill-up logged successfully',
  });
}
