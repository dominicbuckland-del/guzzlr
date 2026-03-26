// XP Values
export const XP_LOG_FILLUP = 50;
export const XP_BEAT_AVERAGE = 25;
export const XP_REPORT_PRICE = 30;
export const XP_CYCLE_LOW_FILL = 40;
export const XP_STREAK_7 = 100;
export const XP_STREAK_30 = 500;
export const XP_SHARE_GOUGING = 20;
export const XP_REFER_FRIEND = 200;

// Level thresholds
export const LEVELS = [
  { level: 1, name: 'Learner', minXp: 0, maxXp: 199, icon: '📖' },
  { level: 2, name: 'Saver', minXp: 200, maxXp: 499, icon: '💰' },
  { level: 3, name: 'Hunter', minXp: 500, maxXp: 999, icon: '🎯' },
  { level: 4, name: 'Shark', minXp: 1000, maxXp: 2499, icon: '🦈' },
  { level: 5, name: 'Legend', minXp: 2500, maxXp: 4999, icon: '⭐' },
  { level: 6, name: 'Fuel Boss', minXp: 5000, maxXp: Infinity, icon: '👑' },
];

export function getLevelInfo(xp: number) {
  return LEVELS.find(l => xp >= l.minXp && xp <= l.maxXp) || LEVELS[0];
}

export function getXpToNextLevel(xp: number) {
  const current = getLevelInfo(xp);
  if (current.level === 6) return 0;
  return (current.maxXp + 1) - xp;
}

export function getXpProgress(xp: number) {
  const current = getLevelInfo(xp);
  if (current.level === 6) return 1;
  const range = current.maxXp - current.minXp + 1;
  const progress = xp - current.minXp;
  return progress / range;
}

// Fuel type price offsets from E10 base (in cents x10)
export const FUEL_OFFSETS: Record<string, number> = {
  'E10': 0,
  '91': 40,   // +4c/L
  '95': 160,  // +16c/L
  '98': 280,  // +28c/L
  'Diesel': 80, // +8c/L
};

// Default search radius options
export const RADIUS_OPTIONS = [5, 10, 15, 20];

// Demo user ID
export const DEMO_USER_ID = 'demo-user-001';

// Brand colors for station markers
export const BRAND_COLORS: Record<string, string> = {
  'BP': '#009900',
  'Shell': '#FFD500',
  'Coles Express': '#E01A22',
  'Ampol': '#003DA5',
  'United': '#0066CC',
  'Puma': '#FF6600',
  '7-Eleven': '#008C46',
  'Liberty': '#0033A0',
  'Costco': '#E31837',
  'Metro': '#333333',
  'Independent': '#666666',
};

// Signal colors
export const SIGNAL_COLORS = {
  fill_now: '#00FF6A',
  hold: '#FFB800',
  wait: '#FF3B3B',
  fill_soon: '#FF3B3B',
};

export const SIGNAL_LABELS: Record<string, string> = {
  fill_now: 'FILL NOW',
  hold: 'HOLD',
  wait: 'WAIT',
  fill_soon: 'FILL SOON — SPIKE COMING',
};
