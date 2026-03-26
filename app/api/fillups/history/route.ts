import { NextRequest, NextResponse } from 'next/server';
import { DEMO_FILLUPS } from '@/seed/users';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  const fillups = DEMO_FILLUPS.slice(offset, offset + limit);
  return NextResponse.json({
    fillups,
    total: DEMO_FILLUPS.length,
    hasMore: offset + limit < DEMO_FILLUPS.length,
  });
}
