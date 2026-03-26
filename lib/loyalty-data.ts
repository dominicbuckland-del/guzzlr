import { LoyaltyProgram } from './types';

export const LOYALTY_PROGRAMS: LoyaltyProgram[] = [
  {
    brand: 'Coles Express',
    programName: 'Flybuys',
    discountCentsPerLitre: 4,
    description: 'Save 4c/L with Flybuys at Coles Express',
  },
  {
    brand: 'Shell',
    programName: 'Flybuys',
    discountCentsPerLitre: 4,
    description: 'Save 4c/L with Flybuys at Shell',
  },
  {
    brand: 'Woolworths',
    programName: 'Everyday Rewards',
    discountCentsPerLitre: 4,
    description: 'Save 4c/L with Everyday Rewards at Woolworths',
  },
  {
    brand: '7-Eleven',
    programName: 'Fuel Price Lock',
    discountCentsPerLitre: 0,
    description: 'Lock in a fuel price with the 7-Eleven app',
  },
  {
    brand: 'Ampol',
    programName: 'AmpCharge Rewards',
    discountCentsPerLitre: 2,
    description: 'Save 2c/L with AmpCharge Rewards',
  },
  {
    brand: 'BP',
    programName: 'BPme Rewards',
    discountCentsPerLitre: 2,
    description: 'Save 2c/L with BPme Rewards',
  },
];

export function getLoyaltyForBrand(brand: string): LoyaltyProgram | undefined {
  return LOYALTY_PROGRAMS.find(l => l.brand === brand);
}
