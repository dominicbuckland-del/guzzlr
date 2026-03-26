import { NextResponse } from 'next/server';
import { DEMO_FILLUPS } from '@/seed/users';
import { getWeeklySpend, getMonthlySpend, getTotalSaved, getWeeklySpendSeries } from '@/lib/calculations';

export async function GET() {
  const weeklySpend = getWeeklySpend(DEMO_FILLUPS);
  const lastWeekSpend = getWeeklySpend(DEMO_FILLUPS, 2);
  const monthlySpend = getMonthlySpend(DEMO_FILLUPS);
  const totalSaved = getTotalSaved(DEMO_FILLUPS);
  const weeklySeries = getWeeklySpendSeries(DEMO_FILLUPS, 8);

  return NextResponse.json({
    weeklySpend: weeklySpend / 100,
    weeklyChange: (weeklySpend - lastWeekSpend) / 100,
    monthlySpend: monthlySpend / 100,
    totalSaved: totalSaved / 100,
    weeklySeries,
    fillCount: DEMO_FILLUPS.length,
  });
}
