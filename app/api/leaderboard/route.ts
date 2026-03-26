import { NextResponse } from 'next/server';
import { MOCK_USERS } from '@/seed/users';

export async function GET() {
  return NextResponse.json({ leaderboard: MOCK_USERS });
}
