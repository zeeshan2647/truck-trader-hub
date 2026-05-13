export type PlanId = "free" | "dealer" | "growth";

export type Plan = {
  id: PlanId;
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  notIncluded?: string[];
  listingLimit: number | null; // null = unlimited
  freeListings?: number;
  highlight?: boolean;
  cta: string;
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    cadence: "forever",
    blurb: "Get started — list your first 3 rigs at no cost.",
    features: [
      "First 3 listings free",
      "Standard listing visibility",
      "Buyer messaging",
      "30-day active window",
    ],
    listingLimit: 3,
    freeListings: 3,
    cta: "Start free",
  },
  {
    id: "dealer",
    name: "Dealer",
    price: "$29",
    cadence: "per month",
    blurb: "For growing dealers managing a small fleet of inventory.",
    features: [
      "Up to 20 active listings",
      "Priority placement in search",
      "Verified seller badge",
      "Email support",
    ],
    notIncluded: [
      "Homepage featured slots",
      "Bulk inventory tools",
      "Dedicated account manager",
    ],
    listingLimit: 20,
    highlight: true,
    cta: "Choose Dealer",
  },
  {
    id: "growth",
    name: "Growth Dealer",
    price: "$79",
    cadence: "per month",
    blurb: "Higher inventory caps with extra exposure for serious dealers.",
    features: [
      "Up to 100 active listings",
      "2 homepage featured slots",
      "Verified seller badge",
      "Priority support",
    ],
    notIncluded: [
      "Unlimited listings",
      "Dedicated account manager",
    ],
    listingLimit: 100,
    cta: "Choose Growth",
  },
];

export function getPlan(id: string | null | undefined): Plan {
  return PLANS.find((p) => p.id === (id as PlanId)) ?? PLANS[0];
}

export function planAllowsNewListing(planId: string | null | undefined, currentCount: number): boolean {
  const p = getPlan(planId);
  if (p.listingLimit === null) return true;
  return currentCount < p.listingLimit;
}