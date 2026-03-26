import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserCar, FillUp, Achievement, FeedItem } from './types';
import { DEMO_USER_ID } from './constants';

interface GuzzlrState {
  // Onboarding
  hasOnboarded: boolean;
  setHasOnboarded: (value: boolean) => void;

  // User
  user: User;
  setUser: (user: Partial<User>) => void;

  // Car
  car: UserCar | null;
  setCar: (car: UserCar | null) => void;

  // Location
  userLat: number | null;
  userLng: number | null;
  setUserLocation: (lat: number, lng: number) => void;

  // Fill-ups
  fillups: FillUp[];
  addFillup: (fillup: FillUp) => void;
  setFillups: (fillups: FillUp[]) => void;

  // Achievements
  achievements: Achievement[];
  addAchievement: (achievement: Achievement) => void;
  setAchievements: (achievements: Achievement[]) => void;

  // Feed
  feedItems: FeedItem[];
  addFeedItem: (item: FeedItem) => void;
  setFeedItems: (items: FeedItem[]) => void;

  // XP & Streak
  addXp: (amount: number) => void;
  updateStreak: (savedMoney: boolean) => void;
  addSavings: (cents: number) => void;
}

const defaultUser: User = {
  id: DEMO_USER_ID,
  displayName: 'You',
  homePostcode: '4000',
  homeLat: -27.4698,
  homeLng: 153.0251,
  workPostcode: '4006',
  workLat: -27.4575,
  workLng: 153.0365,
  commuteDistanceKm: 12,
  searchRadiusKm: 10,
  xp: 1340,
  level: 4,
  streakCount: 5,
  streakLastFillDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  totalSavedCents: 24780,
  createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
};

const defaultCar: UserCar = {
  id: 'car-001',
  userId: DEMO_USER_ID,
  year: 2023,
  make: 'Toyota',
  model: 'Hilux',
  fuelType: 'Diesel',
  tankSizeLitres: 80,
  ratedEconomyL100km: 8.3,
  vehicleType: 'ute',
  isActive: true,
};

export const useGuzzlrStore = create<GuzzlrState>()(
  persist(
    (set) => ({
      // Onboarding
      hasOnboarded: true, // true for demo user
      setHasOnboarded: (value) => set({ hasOnboarded: value }),

      // User
      user: defaultUser,
      setUser: (updates) => set((state) => ({
        user: { ...state.user, ...updates },
      })),

      // Car
      car: defaultCar,
      setCar: (car) => set({ car }),

      // Location
      userLat: -27.4698,
      userLng: 153.0251,
      setUserLocation: (lat, lng) => set({ userLat: lat, userLng: lng }),

      // Fill-ups
      fillups: [],
      addFillup: (fillup) => set((state) => ({
        fillups: [fillup, ...state.fillups],
      })),
      setFillups: (fillups) => set({ fillups }),

      // Achievements
      achievements: [],
      addAchievement: (achievement) => set((state) => ({
        achievements: [...state.achievements, achievement],
      })),
      setAchievements: (achievements) => set({ achievements }),

      // Feed
      feedItems: [],
      addFeedItem: (item) => set((state) => ({
        feedItems: [item, ...state.feedItems].slice(0, 50),
      })),
      setFeedItems: (items) => set({ feedItems: items }),

      // XP
      addXp: (amount) => set((state) => {
        const newXp = state.user.xp + amount;
        let newLevel = state.user.level;
        if (newXp >= 5000) newLevel = 6;
        else if (newXp >= 2500) newLevel = 5;
        else if (newXp >= 1000) newLevel = 4;
        else if (newXp >= 500) newLevel = 3;
        else if (newXp >= 200) newLevel = 2;
        else newLevel = 1;
        return {
          user: { ...state.user, xp: newXp, level: newLevel },
        };
      }),

      // Streak
      updateStreak: (savedMoney) => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        if (savedMoney) {
          return {
            user: {
              ...state.user,
              streakCount: state.user.streakCount + 1,
              streakLastFillDate: today,
            },
          };
        } else {
          return {
            user: {
              ...state.user,
              streakCount: 0,
              streakLastFillDate: today,
            },
          };
        }
      }),

      // Savings
      addSavings: (cents) => set((state) => ({
        user: {
          ...state.user,
          totalSavedCents: state.user.totalSavedCents + cents,
        },
      })),
    }),
    {
      name: 'guzzlr-storage',
      partialize: (state) => ({
        hasOnboarded: state.hasOnboarded,
        user: state.user,
        car: state.car,
        userLat: state.userLat,
        userLng: state.userLng,
        fillups: state.fillups,
        achievements: state.achievements,
        feedItems: state.feedItems,
      }),
    }
  )
);
