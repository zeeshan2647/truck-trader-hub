export type PlanId = "free" | "payg" | "dealer" | "growth" | "enterprise";

export type Plan = {
  id: PlanId;
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
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
    id: "payg",
    name: "Pay Per Listing",
    price: "$9.99",
    cadence: "per listing",
    blurb: "After your free listings — pay only for what you post.",
    features: [
      "$9.99 per listing",
      "Active for 30 days",
      "Standard visibility",
      "Add featured boost anytime",
    ],
    listingLimit: null,
    cta: "Choose pay-as-you-go",
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
    listingLimit: 100,
    cta: "Choose Growth",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    cadence: "talk to sales",
    blurb: "Unlimited listings, dedicated onboarding and account team.",
    features: [
      "Unlimited active listings",
      "Bulk inventory tools",
      "Dedicated account manager",
      "Custom integrations & reporting",
    ],
    listingLimit: null,
    cta: "Contact sales",
  },
];

export function getPlan(id: string | null | undefined): Plan {
  return PLANS.find((p) => p.id === (id as PlanId)) ?? PLANS[0];
}

export function planAllowsNewListing(planId: string | null | undefined, currentCount: number): boolean {
  const p = getPlan(planId);
  if (p.id === "payg") return true; // assumed paid per listing
  if (p.listingLimit === null) return true;
  return currentCount < p.listingLimit;
}