export type Filters = {
  q: string;
  category: "all" | "truck" | "trailer";
  brands: string[];
  condition: "all" | "New" | "Used";
  minPrice: number;
  maxPrice: number;
  minMileage: number;
  maxMileage: number;
  location: { label: string; lat: number; lng: number } | null;
  radius: number; // miles
};

export const PRICE_MIN = 0;
export const PRICE_MAX = 500000;
export const MILEAGE_MIN = 0;
export const MILEAGE_MAX = 1000000;
export const DEFAULT_RADIUS = 100;

export const ALL_BRANDS = [
  "Freightliner",
  "Peterbilt",
  "Kenworth",
  "Volvo Trucks",
  "Mack Trucks",
  "International",
  "Western Star",
  "Hino",
  "Isuzu",
  "Great Dane",
  "Wabash",
  "Utility Trailer",
  "Hyundai Translead",
  "Stoughton",
  "Fontaine",
];

export const defaultFilters = (): Filters => ({
  q: "",
  category: "all",
  brands: [],
  condition: "all",
  minPrice: PRICE_MIN,
  maxPrice: PRICE_MAX,
  minMileage: MILEAGE_MIN,
  maxMileage: MILEAGE_MAX,
  location: null,
  radius: DEFAULT_RADIUS,
});

export function activeFilterCount(f: Filters): number {
  let n = 0;
  if (f.category !== "all") n++;
  if (f.brands.length) n++;
  if (f.condition !== "all") n++;
  if (f.minPrice !== PRICE_MIN || f.maxPrice !== PRICE_MAX) n++;
  if (f.minMileage !== MILEAGE_MIN || f.maxMileage !== MILEAGE_MAX) n++;
  if (f.location) n++;
  return n;
}

// Haversine distance in miles
export function distanceMiles(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}

export const fmtPrice = (n: number) =>
  n >= PRICE_MAX ? `$${(PRICE_MAX / 1000).toFixed(0)}k+` : `$${n.toLocaleString()}`;

export const fmtMileage = (n: number) =>
  n >= MILEAGE_MAX ? `${(MILEAGE_MAX / 1000).toFixed(0)}k+ mi` : `${n.toLocaleString()} mi`;