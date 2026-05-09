import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, MapPin } from "lucide-react";
import { Header } from "@/components/Header";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/lib/listings";
import { FilterSheet } from "@/components/filters/FilterSheet";
import {
  activeFilterCount,
  defaultFilters,
  distanceMiles,
  fmtMileage,
  fmtPrice,
  MILEAGE_MAX,
  MILEAGE_MIN,
  PRICE_MAX,
  PRICE_MIN,
  type Filters,
} from "@/lib/filters";

export const Route = createFileRoute("/browse")({
  component: Browse,
  head: () => ({
    meta: [
      { title: "Browse Trucks & Trailers — RigMarket" },
      {
        name: "description",
        content:
          "Filter trucks and trailers by brand, mileage, price, and distance from you.",
      },
    ],
  }),
});

function Browse() {
  const [filters, setFilters] = useState<Filters>(() => {
    if (typeof window === "undefined") return defaultFilters();
    try {
      const raw = sessionStorage.getItem("rigmarket:filters");
      if (raw) {
        sessionStorage.removeItem("rigmarket:filters");
        return { ...defaultFilters(), ...JSON.parse(raw) };
      }
    } catch {}
    return defaultFilters();
  });
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    return listings.filter((l) => {
      if (filters.category !== "all" && l.category !== filters.category) return false;
      if (filters.brands.length && !filters.brands.includes(l.brand)) return false;
      if (filters.condition !== "all" && l.condition !== filters.condition) return false;
      if (l.price < filters.minPrice || l.price > filters.maxPrice) return false;
      if (l.category === "truck" && (l.mileage < filters.minMileage || l.mileage > filters.maxMileage))
        return false;
      if (filters.location) {
        const d = distanceMiles(filters.location, { lat: l.lat, lng: l.lng });
        if (d > filters.radius) return false;
      }
      if (filters.q) {
        const q = filters.q.toLowerCase();
        const blob = `${l.title} ${l.brand} ${l.model} ${l.type} ${l.location}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [filters]);

  const count = activeFilterCount(filters);
  const update = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search make, model…"
              value={filters.q}
              onChange={(e) => update({ q: e.target.value })}
              className="w-full rounded-full border bg-card py-2.5 pl-10 pr-4 text-sm shadow-[var(--shadow-card)] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            onClick={() => setOpen(true)}
            className="relative flex h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)]"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {count > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground">
                {count}
              </span>
            )}
          </button>
        </div>

        {/* Category pills */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {(["all", "truck", "trailer"] as const).map((c) => (
            <button
              key={c}
              onClick={() => update({ category: c })}
              className={`shrink-0 rounded-full border px-3 py-1.5 capitalize ${
                filters.category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-secondary"
              }`}
            >
              {c === "all" ? "All" : c + "s"}
            </button>
          ))}
        </div>

        {/* Active filter chips */}
        <ActiveChips filters={filters} onChange={setFilters} />

        <p className="mt-4 text-xs text-muted-foreground">{results.length} results</p>

        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
        {results.length === 0 && (
          <div className="mt-12 rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
            No listings match your filters.
            <div className="mt-3">
              <button
                onClick={() => setFilters(defaultFilters())}
                className="text-primary font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      <FilterSheet
        open={open}
        onOpenChange={setOpen}
        value={filters}
        onApply={(f) => setFilters(f)}
      />
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
      {label}
      <button
        onClick={onRemove}
        className="grid h-4 w-4 place-items-center rounded-full hover:bg-primary/20"
        aria-label={`Remove ${label}`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function ActiveChips({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  const chips: { key: string; label: React.ReactNode; clear: () => void }[] = [];

  if (filters.condition !== "all") {
    chips.push({
      key: "cond",
      label: filters.condition,
      clear: () => onChange({ ...filters, condition: "all" }),
    });
  }
  filters.brands.forEach((b) =>
    chips.push({
      key: "b-" + b,
      label: b,
      clear: () => onChange({ ...filters, brands: filters.brands.filter((x) => x !== b) }),
    }),
  );
  if (filters.minPrice !== PRICE_MIN || filters.maxPrice !== PRICE_MAX) {
    chips.push({
      key: "price",
      label: `${fmtPrice(filters.minPrice)} – ${fmtPrice(filters.maxPrice)}`,
      clear: () => onChange({ ...filters, minPrice: PRICE_MIN, maxPrice: PRICE_MAX }),
    });
  }
  if (filters.minMileage !== MILEAGE_MIN || filters.maxMileage !== MILEAGE_MAX) {
    chips.push({
      key: "mi",
      label: `${fmtMileage(filters.minMileage)} – ${fmtMileage(filters.maxMileage)}`,
      clear: () => onChange({ ...filters, minMileage: MILEAGE_MIN, maxMileage: MILEAGE_MAX }),
    });
  }
  if (filters.location) {
    chips.push({
      key: "loc",
      label: (
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {filters.location.label} · {filters.radius}mi
        </span>
      ),
      clear: () => onChange({ ...filters, location: null }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
      {chips.map((c) => (
        <Chip key={c.key} label={c.label as string} onRemove={c.clear} />
      ))}
      <button
        onClick={() => onChange(defaultFilters())}
        className="shrink-0 px-2 text-xs font-medium text-muted-foreground hover:text-destructive"
      >
        Clear all
      </button>
    </div>
  );
}