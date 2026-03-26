import { AchievementDef } from './types';

export const ACHIEVEMENTS: AchievementDef[] = [
  // Savings Milestones
  { key: 'first_blood', name: 'First Blood', description: 'Save money on your first fill', category: 'savings', icon: '🩸', requirement: 1, unit: 'saves' },
  { key: 'fifty_bucks', name: 'Fifty Bucks', description: 'Save $50 lifetime', category: 'savings', icon: '💵', requirement: 5000, unit: 'cents' },
  { key: 'century', name: 'Century', description: 'Save $100 lifetime', category: 'savings', icon: '💯', requirement: 10000, unit: 'cents' },
  { key: 'five_hundy', name: 'Five Hundy', description: 'Save $500 lifetime', category: 'savings', icon: '🤑', requirement: 50000, unit: 'cents' },
  { key: 'grand_master', name: 'Grand Master', description: 'Save $1,000 lifetime', category: 'savings', icon: '🏆', requirement: 100000, unit: 'cents' },

  // Streak Badges
  { key: 'on_fire', name: 'On Fire', description: '3 fills beating the average in a row', category: 'streak', icon: '🔥', requirement: 3, unit: 'streak' },
  { key: 'unstoppable', name: 'Unstoppable', description: '7 consecutive fills below average', category: 'streak', icon: '⚡', requirement: 7, unit: 'streak' },
  { key: 'machine', name: 'Machine', description: '15 consecutive fills below average', category: 'streak', icon: '🤖', requirement: 15, unit: 'streak' },
  { key: 'inhuman', name: 'Inhuman', description: '30 consecutive fills below average', category: 'streak', icon: '👽', requirement: 30, unit: 'streak' },

  // Timing Badges
  { key: 'cycle_surfer', name: 'Cycle Surfer', description: 'Fill during a predicted cycle low 3 times', category: 'timing', icon: '🏄', requirement: 3, unit: 'cycle_fills' },
  { key: 'fortune_teller', name: 'Fortune Teller', description: 'Fill during cycle low 10 times', category: 'timing', icon: '🔮', requirement: 10, unit: 'cycle_fills' },
  { key: 'time_lord', name: 'Time Lord', description: 'Fill during cycle low 25 times', category: 'timing', icon: '⏰', requirement: 25, unit: 'cycle_fills' },

  // Volume Badges
  { key: 'regular', name: 'Regular', description: 'Log 10 fill-ups', category: 'volume', icon: '⛽', requirement: 10, unit: 'fills' },
  { key: 'dedicated', name: 'Dedicated', description: 'Log 25 fill-ups', category: 'volume', icon: '🎖️', requirement: 25, unit: 'fills' },
  { key: 'obsessed', name: 'Obsessed', description: 'Log 50 fill-ups', category: 'volume', icon: '🏅', requirement: 50, unit: 'fills' },
  { key: 'guzzlr_for_life', name: 'Guzzlr for Life', description: 'Log 100 fill-ups', category: 'volume', icon: '💎', requirement: 100, unit: 'fills' },

  // Community Badges
  { key: 'scout', name: 'Scout', description: 'Report 5 prices', category: 'community', icon: '🔍', requirement: 5, unit: 'reports' },
  { key: 'watchdog', name: 'Watchdog', description: 'Report 25 prices', category: 'community', icon: '🐕', requirement: 25, unit: 'reports' },
  { key: 'sentinel', name: 'Sentinel', description: 'Report 100 prices', category: 'community', icon: '🛡️', requirement: 100, unit: 'reports' },
  { key: 'whistleblower', name: 'Whistleblower', description: 'Share 5 gouging reports', category: 'community', icon: '📢', requirement: 5, unit: 'shares' },

  // Special Badges
  { key: 'night_owl', name: 'Night Owl', description: 'Fill up between midnight and 5am', category: 'special', icon: '🦉', requirement: 1, unit: 'special' },
  { key: 'early_bird', name: 'Early Bird', description: 'Fill up before 7am', category: 'special', icon: '🐦', requirement: 1, unit: 'special' },
  { key: 'road_tripper', name: 'Road Tripper', description: 'Fill up 200km+ from home', category: 'special', icon: '🗺️', requirement: 1, unit: 'special' },
  { key: 'loyal_customer', name: 'Loyal Customer', description: 'Fill at the same station 10 times', category: 'special', icon: '🤝', requirement: 10, unit: 'station_fills' },
  { key: 'brand_switcher', name: 'Brand Switcher', description: 'Fill at 10 different brands', category: 'special', icon: '🔄', requirement: 10, unit: 'brands' },
  { key: 'bargain_hunter', name: 'Bargain Hunter', description: 'Save 20c/L+ on a single fill vs area average', category: 'special', icon: '🎯', requirement: 200, unit: 'cents_saved_single' },
];

export function getAchievementByKey(key: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find(a => a.key === key);
}

export function getAchievementsByCategory(category: string): AchievementDef[] {
  return ACHIEVEMENTS.filter(a => a.category === category);
}
