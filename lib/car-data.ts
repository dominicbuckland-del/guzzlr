export interface CarModel {
  make: string;
  model: string;
  years: number[];
  fuelType: string;
  tankSizeLitres: number;
  ratedEconomyL100km: number;
  vehicleType: 'sedan' | 'suv' | 'ute' | 'hatch' | 'van';
}

function yearRange(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export const CAR_DATABASE: CarModel[] = [
  // --- Toyota ---
  {
    make: 'Toyota',
    model: 'Hilux',
    years: yearRange(2015, 2026),
    fuelType: 'Diesel',
    tankSizeLitres: 80,
    ratedEconomyL100km: 8.3,
    vehicleType: 'ute',
  },
  {
    make: 'Toyota',
    model: 'RAV4',
    years: yearRange(2019, 2026),
    fuelType: '91',
    tankSizeLitres: 55,
    ratedEconomyL100km: 6.8,
    vehicleType: 'suv',
  },
  {
    make: 'Toyota',
    model: 'RAV4 Hybrid',
    years: yearRange(2019, 2026),
    fuelType: '91',
    tankSizeLitres: 55,
    ratedEconomyL100km: 4.7,
    vehicleType: 'suv',
  },
  {
    make: 'Toyota',
    model: 'Corolla',
    years: yearRange(2018, 2026),
    fuelType: '91',
    tankSizeLitres: 50,
    ratedEconomyL100km: 6.5,
    vehicleType: 'hatch',
  },
  {
    make: 'Toyota',
    model: 'Corolla Hybrid',
    years: yearRange(2019, 2026),
    fuelType: '91',
    tankSizeLitres: 43,
    ratedEconomyL100km: 3.5,
    vehicleType: 'hatch',
  },
  {
    make: 'Toyota',
    model: 'Camry',
    years: yearRange(2017, 2026),
    fuelType: '91',
    tankSizeLitres: 60,
    ratedEconomyL100km: 6.8,
    vehicleType: 'sedan',
  },
  {
    make: 'Toyota',
    model: 'Camry Hybrid',
    years: yearRange(2018, 2026),
    fuelType: '91',
    tankSizeLitres: 50,
    ratedEconomyL100km: 4.2,
    vehicleType: 'sedan',
  },
  {
    make: 'Toyota',
    model: 'LandCruiser 300',
    years: yearRange(2021, 2026),
    fuelType: 'Diesel',
    tankSizeLitres: 110,
    ratedEconomyL100km: 9.0,
    vehicleType: 'suv',
  },
  {
    make: 'Toyota',
    model: 'LandCruiser 70',
    years: yearRange(2016, 2026),
    fuelType: 'Diesel',
    tankSizeLitres: 130,
    ratedEconomyL100km: 10.7,
    vehicleType: 'suv',
  },
  {
    make: 'Toyota',
    model: 'Prado',
    years: yearRange(2015, 2026),
    fuelType: 'Diesel',
    tankSizeLitres: 87,
    ratedEconomyL100km: 7.9,
    vehicleType: 'suv',
  },
  {
    make: 'Toyota',
    model: 'Yaris Cross',
    years: yearRange(2020, 2026),
    fuelType: '91',
    tankSizeLitres: 36,
    ratedEconomyL100km: 5.3,
    vehicleType: 'suv',
  },
  {
    make: 'Toyota',
    model: 'HiAce',
    years: yearRange(2019, 2026),
    fuelType: 'Diesel',
    tankSizeLitres: 70,
    ratedEconomyL100km: 9.3,
    vehicleType: 'van',
  },
  {
    make: 'Toyota',
    model: 'GR86',
    years: yearRange(2022, 2026),
    fuelType: '95',
    tankSizeLitres: 50,
    ratedEconomyL100km: 8.8,
    vehicleType: 'sedan',
  },
  {
    make: 'Toyota',
    model: 'C-HR',
    years: yearRange(2019, 2026),
    fuelType: '91',
    tankSizeLitres: 43,
    ratedEconomyL100km: 4.8,
    vehicleType: 'suv',
  },

  // --- Ford ---
  {
    make: 'Ford',
    model: 'Ranger',
    years: yearRange(2015, 2026),
    fuelType: 'Diesel',
    tankSizeLitres: 80,
    ratedEconomyL100km: 7.6,
    vehicleType: 'ute',
  },
  {
    make: 'Ford',
    model: 'Everest',
    years: yearRange(2015, 2026),
    fuelType: 'Diesel',
    tankSizeLitres: 80,
    ratedEconomyL100km: 8.0,
    vehicleType: 'suv',
  },
  {
    make: 'Ford',
    model: 'Focus',
    years: yearRange(2012, 2018),
    fuelType: '91',
    tankSizeLitres: 52,
    ratedEconomyL100km: 6.3,
    vehicleType: 'hatch',
  },

  // --- Mazda ---
  {
    make: 'Mazda',
    model: 'CX-5',
    years: yearRange(2017, 2026),
    fuelType: '91',
    tankSizeLitres: 56,
    ratedEconomyL100km: 6.9,
    vehicleType: 'suv',
  },
  {
    make: 'Mazda',
    model: 'Mazda3',
    years: yearRange(2019, 2026),
    fuelType: '91',
    tankSizeLitres: 51,
    ratedEconomyL100km: 6.2,
    vehicleType: 'hatch',
  },
  {
    make: 'Mazda',
    model: 'CX-30',
    years: yearRange(2020, 2026),
    fuelType: '91',
    tankSizeLitres: 51,
    ratedEconomyL100km: 6.5,
    vehicleType: 'suv',
  },
  {
    make: 'Mazda',
    model: 'CX-8',
    years: yearRange(2018, 2025),
    fuelType: 'Diesel',
    tankSizeLitres: 72,
    ratedEconomyL100km: 6.3,
    vehicleType: 'suv',
  },
  {
    make: 'Mazda',
    model: 'CX-60',
    years: yearRange(2022, 2026),
    fuelType: 'Diesel',
    tankSizeLitres: 58,
    ratedEconomyL100km: 5.8,
    vehicleType: 'suv',
  },
  {
    make: 'Mazda',
    model: 'BT-50',
    years: yearRange(2020, 2026),
    fuelType: 'Diesel',
    tankSizeLitres: 76,
    ratedEconomyL100km: 7.7,
    vehicleType: 'ute',
  },

  // --- Hyundai ---
  {
    make: 'Hyundai',
    model: 'i30',
    years: yearRange(2017, 2026),
    fuelType: '91',
    tankSizeLitres: 50,
    ratedEconomyL100km: 6.5,
    vehicleType: 'hatch',
  },
  {
    make: 'Hyundai',
    model: 'Tucson',
    years: yearRange(2019, 2026),
    fuelType: '91',
    tankSizeLitres: 54,
    ratedEconomyL100km: 7.2,
    vehicleType: 'suv',
  },
  {
    make: 'Hyundai',
    model: 'Kona',
    years: yearRange(2019, 2026),
    fuelType: '91',
    tankSizeLitres: 47,
    ratedEconomyL100km: 6.3,
    vehicleType: 'suv',
  },
  {
    make: 'Hyundai',
    model: 'Kona Electric',
    years: yearRange(2019, 2026),
    fuelType: 'EV',
    tankSizeLitres: 0,
    ratedEconomyL100km: 0,
    vehicleType: 'suv',
  },
  {
    make: 'Hyundai',
    model: 'Staria',
    years: yearRange(2021, 2026),
    fuelType: 'Diesel',
    tankSizeLitres: 75,
    ratedEconomyL100km: 8.6,
    vehicleType: 'van',
  },
  {
    make: 'Hyundai',
    model: 'Santa Fe',
    years: yearRange(2019, 2026),
    fuelType: 'Diesel',
    tankSizeLitres: 67,
    ratedEconomyL100km: 6.8,
    vehicleType: 'suv',
  },

  // --- Kia ---
  {
    make: 'Kia',
    model: 'Cerato',
    years: yearRange(2018, 2026),
    fuelType: '91',
    tankSizeLitres: 50,
    ratedEconomyL100km: 6.8,
    vehicleType: 'sedan',
  },
  {
    make: 'Kia',
    model: 'Sportage',
    years: yearRange(2019, 2026),
    fuelType: '91',
    tankSizeLitres: 54,
    ratedEconomyL100km: 7.0,
    vehicleType: 'suv',
  },
  {
    make: 'Kia',
    model: 'Carnival',
    years: yearRange(2019, 2026),
    fuelType: '91',
    tankSizeLitres: 72,
    ratedEconomyL100km: 9.4,
    vehicleType: 'van',
  },
  {
    make: 'Kia',
    model: 'Sorento',
    years: yearRange(2019, 2026),
    fuelType: 'Diesel',
    tankSizeLitres: 67,
    ratedEconomyL100km: 6.3,
    vehicleType: 'suv',
  },

  // --- MG ---
  {
    make: 'MG',
    model: 'ZS',
    years: yearRange(2019, 2026),
    fuelType: '91',
    tankSizeLitres: 45,
    ratedEconomyL100km: 7.0,
    vehicleType: 'suv',
  },
  {
    make: 'MG',
    model: 'ZST',
    years: yearRange(2020, 2026),
    fuelType: '91',
    tankSizeLitres: 45,
    ratedEconomyL100km: 6.9,
    vehicleType: 'suv',
  },
  {
    make: 'MG',
    model: 'HS',
    years: yearRange(2019, 2026),
    fuelType: '91',
    tankSizeLitres: 57,
    ratedEconomyL100km: 7.7,
    vehicleType: 'suv',
  },

  // --- Tesla ---
  {
    make: 'Tesla',
    model: 'Model 3',
    years: yearRange(2019, 2026),
    fuelType: 'EV',
    tankSizeLitres: 0,
    ratedEconomyL100km: 0,
    vehicleType: 'sedan',
  },
  {
    make: 'Tesla',
    model: 'Model Y',
    years: yearRange(2022, 2026),
    fuelType: 'EV',
    tankSizeLitres: 0,
    ratedEconomyL100km: 0,
    vehicleType: 'suv',
  },

  // --- Mitsubishi ---
  {
    make: 'Mitsubishi',
    model: 'Outlander',
    years: yearRange(2019, 2026),
    fuelType: '91',
    tankSizeLitres: 60,
    ratedEconomyL100km: 7.5,
    vehicleType: 'suv',
  },
  {
    make: 'Mitsubishi',
    model: 'Outlander PHEV',
    years: yearRange(2019, 2026),
    fuelType: '91',
    tankSizeLitres: 45,
    ratedEconomyL100km: 1.7,
    vehicleType: 'suv',
  },
  {
    make: 'Mitsubishi',
    model: 'Triton',
    years: yearRange(2015, 2026),
    fuelType: 'Diesel',
    tankSizeLitres: 75,
    ratedEconomyL100km: 8.0,
    vehicleType: 'ute',
  },
  {
    make: 'Mitsubishi',
    model: 'ASX',
    years: yearRange(2019, 2026),
    fuelType: '91',
    tankSizeLitres: 55,
    ratedEconomyL100km: 7.7,
    vehicleType: 'suv',
  },

  // --- Subaru ---
  {
    make: 'Subaru',
    model: 'Forester',
    years: yearRange(2018, 2026),
    fuelType: '91',
    tankSizeLitres: 63,
    ratedEconomyL100km: 7.4,
    vehicleType: 'suv',
  },
  {
    make: 'Subaru',
    model: 'Outback',
    years: yearRange(2019, 2026),
    fuelType: '91',
    tankSizeLitres: 63,
    ratedEconomyL100km: 7.3,
    vehicleType: 'suv',
  },

  // --- Isuzu ---
  {
    make: 'Isuzu',
    model: 'D-Max',
    years: yearRange(2019, 2026),
    fuelType: 'Diesel',
    tankSizeLitres: 76,
    ratedEconomyL100km: 7.7,
    vehicleType: 'ute',
  },

  // --- Nissan ---
  {
    make: 'Nissan',
    model: 'X-Trail',
    years: yearRange(2019, 2026),
    fuelType: '91',
    tankSizeLitres: 55,
    ratedEconomyL100km: 7.3,
    vehicleType: 'suv',
  },
  {
    make: 'Nissan',
    model: 'Navara',
    years: yearRange(2015, 2026),
    fuelType: 'Diesel',
    tankSizeLitres: 80,
    ratedEconomyL100km: 8.3,
    vehicleType: 'ute',
  },
  {
    make: 'Nissan',
    model: 'Qashqai',
    years: yearRange(2019, 2026),
    fuelType: '91',
    tankSizeLitres: 55,
    ratedEconomyL100km: 6.6,
    vehicleType: 'suv',
  },

  // --- Volkswagen ---
  {
    make: 'Volkswagen',
    model: 'Golf',
    years: yearRange(2019, 2026),
    fuelType: '95',
    tankSizeLitres: 50,
    ratedEconomyL100km: 6.0,
    vehicleType: 'hatch',
  },
  {
    make: 'Volkswagen',
    model: 'Amarok',
    years: yearRange(2019, 2026),
    fuelType: 'Diesel',
    tankSizeLitres: 80,
    ratedEconomyL100km: 8.2,
    vehicleType: 'ute',
  },

  // --- GWM ---
  {
    make: 'GWM',
    model: 'Ute',
    years: yearRange(2020, 2026),
    fuelType: 'Diesel',
    tankSizeLitres: 80,
    ratedEconomyL100km: 9.0,
    vehicleType: 'ute',
  },
  {
    make: 'GWM',
    model: 'Haval H6',
    years: yearRange(2021, 2026),
    fuelType: '91',
    tankSizeLitres: 57,
    ratedEconomyL100km: 7.5,
    vehicleType: 'suv',
  },

  // --- BYD ---
  {
    make: 'BYD',
    model: 'Atto 3',
    years: yearRange(2022, 2026),
    fuelType: 'EV',
    tankSizeLitres: 0,
    ratedEconomyL100km: 0,
    vehicleType: 'suv',
  },
  {
    make: 'BYD',
    model: 'Dolphin',
    years: yearRange(2023, 2026),
    fuelType: 'EV',
    tankSizeLitres: 0,
    ratedEconomyL100km: 0,
    vehicleType: 'hatch',
  },

  // --- Honda ---
  {
    make: 'Honda',
    model: 'CR-V',
    years: yearRange(2019, 2026),
    fuelType: '91',
    tankSizeLitres: 53,
    ratedEconomyL100km: 7.0,
    vehicleType: 'suv',
  },
  {
    make: 'Honda',
    model: 'Civic',
    years: yearRange(2019, 2026),
    fuelType: '91',
    tankSizeLitres: 47,
    ratedEconomyL100km: 6.3,
    vehicleType: 'sedan',
  },

  // --- Suzuki ---
  {
    make: 'Suzuki',
    model: 'Swift',
    years: yearRange(2017, 2026),
    fuelType: '91',
    tankSizeLitres: 37,
    ratedEconomyL100km: 5.0,
    vehicleType: 'hatch',
  },
  {
    make: 'Suzuki',
    model: 'Jimny',
    years: yearRange(2019, 2026),
    fuelType: '91',
    tankSizeLitres: 40,
    ratedEconomyL100km: 6.4,
    vehicleType: 'suv',
  },

  // --- Holden ---
  {
    make: 'Holden',
    model: 'Commodore',
    years: yearRange(2013, 2020),
    fuelType: '91',
    tankSizeLitres: 61,
    ratedEconomyL100km: 9.5,
    vehicleType: 'sedan',
  },

  // --- LDV ---
  {
    make: 'LDV',
    model: 'T60',
    years: yearRange(2019, 2026),
    fuelType: 'Diesel',
    tankSizeLitres: 75,
    ratedEconomyL100km: 9.3,
    vehicleType: 'ute',
  },
];

// --- Helper Functions ---

export function getUniqueMakes(): string[] {
  const makes = new Set(CAR_DATABASE.map((car) => car.make));
  return Array.from(makes).sort();
}

export function getModelsByMake(make: string): string[] {
  const models = CAR_DATABASE
    .filter((car) => car.make.toLowerCase() === make.toLowerCase())
    .map((car) => car.model);
  return Array.from(new Set(models)).sort();
}

export function getYearsByMakeModel(make: string, model: string): number[] {
  const car = CAR_DATABASE.find(
    (c) =>
      c.make.toLowerCase() === make.toLowerCase() &&
      c.model.toLowerCase() === model.toLowerCase()
  );
  return car ? [...car.years] : [];
}

export function getCarSpecs(
  make: string,
  model: string,
  year: number
): CarModel | undefined {
  return CAR_DATABASE.find(
    (c) =>
      c.make.toLowerCase() === make.toLowerCase() &&
      c.model.toLowerCase() === model.toLowerCase() &&
      c.years.includes(year)
  );
}
