import { NextResponse } from 'next/server';
import { ACHIEVEMENTS } from '@/lib/achievements';
import { DEMO_ACHIEVEMENTS } from '@/seed/users';

export async function GET() {
  const withProgress = ACHIEVEMENTS.map((def) => {
    const unlocked = DEMO_ACHIEVEMENTS.find((a) => a.achievementKey === def.key);
    return {
      ...def,
      unlocked: !!unlocked,
      achievedAt: unlocked?.achievedAt,
      progress: unlocked ? def.requirement : Math.floor(Math.random() * def.requirement * 0.7),
    };
  });

  return NextResponse.json({ achievements: withProgress });
}
