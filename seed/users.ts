import { User, FillUp, Achievement, FeedItem, LeaderboardEntry } from '../lib/types';
import { DEMO_USER_ID } from '../lib/constants';

// 25 mock users for leaderboard
export const MOCK_USERS: LeaderboardEntry[] = [
  { rank: 1, displayName: 'Sarah M.', level: 6, levelName: 'Fuel Boss', savedDollars: 892.40, streakCount: 24, isCurrentUser: false, carModel: 'Toyota Corolla Hybrid' },
  { rank: 2, displayName: 'James T.', level: 5, levelName: 'Legend', savedDollars: 745.20, streakCount: 18, isCurrentUser: false, carModel: 'Mazda3' },
  { rank: 3, displayName: 'Emily R.', level: 5, levelName: 'Legend', savedDollars: 612.80, streakCount: 15, isCurrentUser: false, carModel: 'Hyundai i30' },
  { rank: 4, displayName: 'Michael K.', level: 5, levelName: 'Legend', savedDollars: 534.60, streakCount: 12, isCurrentUser: false, carModel: 'Ford Ranger' },
  { rank: 5, displayName: 'Jessica W.', level: 4, levelName: 'Shark', savedDollars: 467.30, streakCount: 9, isCurrentUser: false, carModel: 'Toyota RAV4 Hybrid' },
  { rank: 6, displayName: 'David L.', level: 4, levelName: 'Shark', savedDollars: 389.50, streakCount: 11, isCurrentUser: false, carModel: 'Mazda CX-5' },
  { rank: 7, displayName: 'You', level: 4, levelName: 'Shark', savedDollars: 247.80, streakCount: 5, isCurrentUser: true, carModel: 'Toyota Hilux' },
  { rank: 8, displayName: 'Chris P.', level: 4, levelName: 'Shark', savedDollars: 234.10, streakCount: 7, isCurrentUser: false, carModel: 'Isuzu D-Max' },
  { rank: 9, displayName: 'Amanda H.', level: 3, levelName: 'Hunter', savedDollars: 198.70, streakCount: 4, isCurrentUser: false, carModel: 'Kia Cerato' },
  { rank: 10, displayName: 'Ben S.', level: 3, levelName: 'Hunter', savedDollars: 176.40, streakCount: 6, isCurrentUser: false, carModel: 'Hyundai Tucson' },
  { rank: 11, displayName: 'Rachel N.', level: 3, levelName: 'Hunter', savedDollars: 156.20, streakCount: 3, isCurrentUser: false, carModel: 'Toyota Yaris Cross' },
  { rank: 12, displayName: 'Tom B.', level: 3, levelName: 'Hunter', savedDollars: 143.80, streakCount: 5, isCurrentUser: false, carModel: 'Mitsubishi Triton' },
  { rank: 13, displayName: 'Nicole F.', level: 3, levelName: 'Hunter', savedDollars: 128.50, streakCount: 2, isCurrentUser: false, carModel: 'Suzuki Swift' },
  { rank: 14, displayName: 'Andrew G.', level: 2, levelName: 'Saver', savedDollars: 112.30, streakCount: 4, isCurrentUser: false, carModel: 'VW Golf' },
  { rank: 15, displayName: 'Sophie C.', level: 2, levelName: 'Saver', savedDollars: 98.70, streakCount: 3, isCurrentUser: false, carModel: 'Honda CR-V' },
  { rank: 16, displayName: 'Mark D.', level: 2, levelName: 'Saver', savedDollars: 87.40, streakCount: 2, isCurrentUser: false, carModel: 'Toyota Camry' },
  { rank: 17, displayName: 'Kate J.', level: 2, levelName: 'Saver', savedDollars: 76.20, streakCount: 1, isCurrentUser: false, carModel: 'Mazda CX-30' },
  { rank: 18, displayName: 'Daniel M.', level: 2, levelName: 'Saver', savedDollars: 64.80, streakCount: 3, isCurrentUser: false, carModel: 'Ford Everest' },
  { rank: 19, displayName: 'Lisa A.', level: 1, levelName: 'Learner', savedDollars: 52.30, streakCount: 2, isCurrentUser: false, carModel: 'Hyundai Kona' },
  { rank: 20, displayName: 'Steve R.', level: 1, levelName: 'Learner', savedDollars: 43.60, streakCount: 1, isCurrentUser: false, carModel: 'Nissan X-Trail' },
  { rank: 21, displayName: 'Jenny T.', level: 1, levelName: 'Learner', savedDollars: 34.20, streakCount: 0, isCurrentUser: false, carModel: 'Toyota C-HR' },
  { rank: 22, displayName: 'Paul W.', level: 1, levelName: 'Learner', savedDollars: 28.50, streakCount: 1, isCurrentUser: false, carModel: 'Mitsubishi ASX' },
  { rank: 23, displayName: 'Megan Y.', level: 1, levelName: 'Learner', savedDollars: 19.80, streakCount: 0, isCurrentUser: false, carModel: 'Kia Sportage' },
  { rank: 24, displayName: 'Ryan K.', level: 1, levelName: 'Learner', savedDollars: 14.60, streakCount: 1, isCurrentUser: false, carModel: 'GWM Ute' },
  { rank: 25, displayName: 'Hannah L.', level: 1, levelName: 'Learner', savedDollars: 12.40, streakCount: 0, isCurrentUser: false, carModel: 'Subaru Forester' },
];

// Demo user's 12 fill-ups over last 2 months
export const DEMO_FILLUPS: FillUp[] = [
  {
    id: 'fill-001', userId: DEMO_USER_ID, carId: 'car-001',
    stationId: 'station-005', stationName: 'BP Chermside',
    litres: 62.4, pricePerLitreCents: 1729, totalCostCents: 10789,
    odometerKm: 45230, isFullTank: true, areaAveragePriceCents: 1856,
    savedCents: 793, xpEarned: 115, filledAt: daysAgo(3), createdAt: daysAgo(3),
  },
  {
    id: 'fill-002', userId: DEMO_USER_ID, carId: 'car-001',
    stationId: 'station-042', stationName: 'Costco Bundamba',
    litres: 71.2, pricePerLitreCents: 1659, totalCostCents: 11812,
    odometerKm: 44580, isFullTank: true, areaAveragePriceCents: 1789,
    savedCents: 926, xpEarned: 115, filledAt: daysAgo(10), createdAt: daysAgo(10),
  },
  {
    id: 'fill-003', userId: DEMO_USER_ID, carId: 'car-001',
    stationId: 'station-015', stationName: '7-Eleven Fortitude Valley',
    litres: 55.8, pricePerLitreCents: 1819, totalCostCents: 10150,
    odometerKm: 43920, isFullTank: false, areaAveragePriceCents: 1845,
    savedCents: 145, xpEarned: 75, filledAt: daysAgo(17), createdAt: daysAgo(17),
  },
  {
    id: 'fill-004', userId: DEMO_USER_ID, carId: 'car-001',
    stationId: 'station-008', stationName: 'Ampol Woolworths Carindale',
    litres: 68.1, pricePerLitreCents: 1749, totalCostCents: 11909,
    odometerKm: 43280, isFullTank: true, areaAveragePriceCents: 1812,
    savedCents: 429, xpEarned: 75, filledAt: daysAgo(24), createdAt: daysAgo(24),
  },
  {
    id: 'fill-005', userId: DEMO_USER_ID, carId: 'car-001',
    stationId: 'station-005', stationName: 'BP Chermside',
    litres: 64.3, pricePerLitreCents: 2089, totalCostCents: 13432,
    odometerKm: 42650, isFullTank: true, areaAveragePriceCents: 2045,
    savedCents: -283, xpEarned: 50, filledAt: daysAgo(31), createdAt: daysAgo(31),
    notes: 'Tank was almost empty, had to fill at peak',
  },
  {
    id: 'fill-006', userId: DEMO_USER_ID, carId: 'car-001',
    stationId: 'station-022', stationName: 'United Petroleum Ipswich',
    litres: 70.5, pricePerLitreCents: 1689, totalCostCents: 11907,
    odometerKm: 42010, isFullTank: true, areaAveragePriceCents: 1834,
    savedCents: 1022, xpEarned: 115, filledAt: daysAgo(38), createdAt: daysAgo(38),
  },
  {
    id: 'fill-007', userId: DEMO_USER_ID, carId: 'car-001',
    stationId: 'station-012', stationName: 'Shell Coles Express Mt Gravatt',
    litres: 58.9, pricePerLitreCents: 1779, totalCostCents: 10478,
    odometerKm: 41380, isFullTank: true, areaAveragePriceCents: 1823,
    savedCents: 259, xpEarned: 75, filledAt: daysAgo(42), createdAt: daysAgo(42),
  },
  {
    id: 'fill-008', userId: DEMO_USER_ID, carId: 'car-001',
    stationId: 'station-042', stationName: 'Costco Bundamba',
    litres: 73.1, pricePerLitreCents: 1639, totalCostCents: 11981,
    odometerKm: 40740, isFullTank: true, areaAveragePriceCents: 1798,
    savedCents: 1162, xpEarned: 115, filledAt: daysAgo(48), createdAt: daysAgo(48),
  },
  {
    id: 'fill-009', userId: DEMO_USER_ID, carId: 'car-001',
    stationId: 'station-003', stationName: 'Ampol South Brisbane',
    litres: 60.2, pricePerLitreCents: 1759, totalCostCents: 10591,
    odometerKm: 40100, isFullTank: true, areaAveragePriceCents: 1801,
    savedCents: 253, xpEarned: 75, filledAt: daysAgo(52), createdAt: daysAgo(52),
  },
  {
    id: 'fill-010', userId: DEMO_USER_ID, carId: 'car-001',
    stationId: 'station-018', stationName: 'Puma Strathpine',
    litres: 66.7, pricePerLitreCents: 1709, totalCostCents: 11399,
    odometerKm: 39460, isFullTank: true, areaAveragePriceCents: 1867,
    savedCents: 1054, xpEarned: 115, filledAt: daysAgo(56), createdAt: daysAgo(56),
  },
  {
    id: 'fill-011', userId: DEMO_USER_ID, carId: 'car-001',
    stationId: 'station-005', stationName: 'BP Chermside',
    litres: 59.4, pricePerLitreCents: 2139, totalCostCents: 12706,
    odometerKm: 38830, isFullTank: true, areaAveragePriceCents: 2098,
    savedCents: -243, xpEarned: 50, filledAt: daysAgo(60), createdAt: daysAgo(60),
    notes: 'Caught in price spike again',
  },
  {
    id: 'fill-012', userId: DEMO_USER_ID, carId: 'car-001',
    stationId: 'station-042', stationName: 'Costco Bundamba',
    litres: 74.8, pricePerLitreCents: 1619, totalCostCents: 12110,
    odometerKm: 38190, isFullTank: true, areaAveragePriceCents: 1756,
    savedCents: 1025, xpEarned: 115, filledAt: daysAgo(65), createdAt: daysAgo(65),
  },
];

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

// Demo user's 8 unlocked achievements
export const DEMO_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-001', userId: DEMO_USER_ID, achievementKey: 'first_blood', achievementName: 'First Blood', achievementDescription: 'Save money on your first fill', achievedAt: daysAgo(65) },
  { id: 'ach-002', userId: DEMO_USER_ID, achievementKey: 'fifty_bucks', achievementName: 'Fifty Bucks', achievementDescription: 'Save $50 lifetime', achievedAt: daysAgo(48) },
  { id: 'ach-003', userId: DEMO_USER_ID, achievementKey: 'century', achievementName: 'Century', achievementDescription: 'Save $100 lifetime', achievedAt: daysAgo(31) },
  { id: 'ach-004', userId: DEMO_USER_ID, achievementKey: 'on_fire', achievementName: 'On Fire', achievementDescription: '3 fills beating the average in a row', achievedAt: daysAgo(42) },
  { id: 'ach-005', userId: DEMO_USER_ID, achievementKey: 'unstoppable', achievementName: 'Unstoppable', achievementDescription: '7 consecutive fills below average', achievedAt: daysAgo(10) },
  { id: 'ach-006', userId: DEMO_USER_ID, achievementKey: 'cycle_surfer', achievementName: 'Cycle Surfer', achievementDescription: 'Fill during a predicted cycle low 3 times', achievedAt: daysAgo(24) },
  { id: 'ach-007', userId: DEMO_USER_ID, achievementKey: 'regular', achievementName: 'Regular', achievementDescription: 'Log 10 fill-ups', achievedAt: daysAgo(17) },
  { id: 'ach-008', userId: DEMO_USER_ID, achievementKey: 'loyal_customer', achievementName: 'Loyal Customer', achievementDescription: 'Fill at the same station 10 times', achievedAt: daysAgo(3) },
];

// Demo feed items
export const DEMO_FEED: FeedItem[] = [
  { id: 'feed-001', type: 'saving', icon: '⛽', message: 'You saved $7.93 at BP Chermside', timestamp: daysAgo(3) },
  { id: 'feed-002', type: 'achievement', icon: '🏆', message: 'Achievement unlocked: Loyal Customer!', timestamp: daysAgo(3) },
  { id: 'feed-003', type: 'streak', icon: '🔥', message: 'Your streak is at 5 — keep it going!', timestamp: daysAgo(3) },
  { id: 'feed-004', type: 'prediction', icon: '📊', message: 'Prices predicted to rise in the next 3 days — fill soon', timestamp: daysAgo(1) },
  { id: 'feed-005', type: 'gouging', icon: '⚠️', message: 'Shell Carindale is charging 24c/L above average right now', timestamp: daysAgo(2) },
  { id: 'feed-006', type: 'saving', icon: '⛽', message: 'You saved $9.26 at Costco Bundamba', timestamp: daysAgo(10) },
  { id: 'feed-007', type: 'achievement', icon: '🏆', message: 'Achievement unlocked: Unstoppable!', timestamp: daysAgo(10) },
  { id: 'feed-008', type: 'prediction', icon: '📊', message: 'Prices at cycle low — great time to fill up', timestamp: daysAgo(11) },
  { id: 'feed-009', type: 'saving', icon: '⛽', message: 'You saved $1.45 at 7-Eleven Fortitude Valley', timestamp: daysAgo(17) },
  { id: 'feed-010', type: 'achievement', icon: '🏆', message: 'Achievement unlocked: Regular — 10 fill-ups!', timestamp: daysAgo(17) },
];
