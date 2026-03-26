// User types
export interface User {
  id: string;
  email?: string;
  displayName: string;
  homePostcode?: string;
  homeLat?: number;
  homeLng?: number;
  workPostcode?: string;
  workLat?: number;
  workLng?: number;
  commuteDistanceKm?: number;
  searchRadiusKm: number;
  xp: number;
  level: number;
  streakCount: number;
  streakLastFillDate?: string;
  totalSavedCents: number;
  createdAt: string;
}

// Car types
export interface CarModel {
  make: string;
  model: string;
  years: number[];
  fuelType: string;
  tankSizeLitres: number;
  ratedEconomyL100km: number;
  vehicleType: 'sedan' | 'suv' | 'ute' | 'hatch' | 'van';
}

export interface UserCar {
  id: string;
  userId: string;
  year: number;
  make: string;
  model: string;
  variant?: string;
  fuelType: string;
  tankSizeLitres: number;
  ratedEconomyL100km: number;
  vehicleType: 'sedan' | 'suv' | 'ute' | 'hatch' | 'van';
  isActive: boolean;
}

// Station types
export interface Station {
  id: string;
  name: string;
  brand: string;
  address: string;
  suburb: string;
  postcode: string;
  state: string;
  latitude: number;
  longitude: number;
  hasToilet: boolean;
  hasShop: boolean;
  hasCarwash: boolean;
  loyaltyProgram?: string;
  loyaltyDiscountCents?: number;
  distance?: number; // calculated field
}

export interface StationPrice {
  id: string;
  stationId: string;
  fuelType: string;
  priceCents: number; // 1789 = 178.9c/L
  source: 'government' | 'user' | 'scrape';
  reportedBy?: string;
  reporterAccuracy?: number;
  recordedAt: string;
}

export interface StationWithPrices extends Station {
  prices: StationPrice[];
  fillCost?: number; // personalised
  savings?: number; // vs area average
}

// Fill-up types
export interface FillUp {
  id: string;
  userId: string;
  carId: string;
  stationId?: string;
  stationName: string;
  litres: number;
  pricePerLitreCents: number;
  totalCostCents: number;
  odometerKm?: number;
  isFullTank: boolean;
  areaAveragePriceCents: number;
  savedCents: number;
  xpEarned: number;
  notes?: string;
  filledAt: string;
  createdAt: string;
}

// Cycle/prediction types
export type CyclePhase = 'bottom' | 'rising' | 'peak' | 'falling';
export type Signal = 'fill_now' | 'hold' | 'wait' | 'fill_soon';

export interface CycleConfig {
  city: string;
  cycleLengthDays: number;
  referenceBottomDate: string;
  bottomDurationDays: number;
  riseSpeedCentsPerDay: number;
  peakDurationDays: number;
  fallSpeedCentsPerDay: number;
}

export interface CycleState {
  city: string;
  phase: CyclePhase;
  signal: Signal;
  signalLabel: string;
  signalDescription: string;
  dayInCycle: number;
  predictedChangeCents: number;
  personalSavingsDollars: number;
  confidence: number;
}

// Achievement types
export interface AchievementDef {
  key: string;
  name: string;
  description: string;
  category: 'savings' | 'streak' | 'timing' | 'volume' | 'community' | 'special';
  icon: string;
  requirement: number;
  unit: string;
}

export interface Achievement {
  id: string;
  userId: string;
  achievementKey: string;
  achievementName: string;
  achievementDescription: string;
  achievedAt: string;
}

export interface AchievementWithProgress extends AchievementDef {
  unlocked: boolean;
  progress: number;
  achievedAt?: string;
}

// Leaderboard
export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  level: number;
  levelName: string;
  savedDollars: number;
  streakCount: number;
  isCurrentUser: boolean;
  carModel?: string;
}

// Notification / Feed
export interface FeedItem {
  id: string;
  type: 'saving' | 'achievement' | 'prediction' | 'streak' | 'gouging';
  icon: string;
  message: string;
  timestamp: string;
}

// Gouging
export interface GougingEntry {
  station: Station;
  priceCents: number;
  areaAverageCents: number;
  aboveAverageCents: number;
  overchargeDollars: number; // personalised per tank
}

export interface BrandReport {
  brand: string;
  averageMarkupCents: number;
  stationCount: number;
}

// Loyalty
export interface LoyaltyProgram {
  brand: string;
  programName: string;
  discountCentsPerLitre: number;
  description: string;
}

// What-if calculator
export interface WhatIfComparison {
  make: string;
  model: string;
  fuelType: string;
  economyL100km: number;
  weeklyFuelCost: number;
  weeklySavings: number;
  yearlySavings: number;
  type: 'efficient_ice' | 'hybrid' | 'ev';
}

// Price trend data point
export interface PriceTrendPoint {
  date: string;
  price: number; // cents/L as decimal e.g. 178.9
  phase?: CyclePhase;
}

// Fuel types
export type FuelType = 'E10' | '91' | '95' | '98' | 'Diesel';
export const FUEL_TYPES: FuelType[] = ['E10', '91', '95', '98', 'Diesel'];
