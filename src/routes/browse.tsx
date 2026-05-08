import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Header } from "@/components/Header";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/lib/listings";

type BrowseSearch = {
  q?: string;
  category?: "all" | "truck" | "trailer";
  brand?: string;
  condition?: "all" | "New" | "Used";
  maxPrice?: number;
};

export const Route = createFileRoute("/browse")({
  validateSearch: (s: Record<string, unknown>): BrowseSearch => ({
    q: typeof s.q === "string" ? s.q : undefined,
    category: (s.category === "truck" || s.category === "trailer" || s.category === "all" ? s.category : "all") as BrowseSearch["category"],
    brand: typeof s.brand === "string" ? s.brand : undefined,
    condition: (s.condition === "New" || s.condition === "Used" || s.condition === "all" ? s.condition : "all") as BrowseSearch["condition"],
    maxPrice: typeof s.maxPrice === "number" ? s.maxPrice : undefined,
  }),
  component: Browse,
  head: () => ({
    meta: [
      { title: "Browse Trucks & Trailers — RigMarket" },
      { name: "description", content: "Filter and search commercial trucks and trailers by brand, type, price and more." },
    ],
  }),
});

const BRANDS = ["All", "Peterbilt", "Freightliner", "Kenworth", "Great Dane", "Wabash"];

function Browse() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/browse" });

  const results = useMemo(() => {
    return listings.filter((l) => {
      if (search.category && search.category !== "all" && l.category !== search.category) return false;
      if (search.brand && search.brand !== "All" && l.brand !== search.brand) return false;
      if (search.condition && search.condition !== "all" && l.condition !== search.condition) return false;
      if (search.maxPrice && l.price > search.maxPrice) return false;
      if (search.q) {
        const q = search.q.toLowerCase();
        const blob = `${l.title} ${l.brand} ${l.model} ${l.type} ${l.location}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [search]);

  const update = (patch: Partial<BrowseSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search make, model, location…"
            defaultValue={search.q ?? ""}
            onChange={(e) => update({ q: e.target.value || undefined })}
            className="w-full rounded-full border bg-card py-2.5 pl-10 pr-4 text-sm shadow-[var(--shadow-card)] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />
          {(["all", "truck", "trailer"] as const).map((c) => (
            <button
              key={c}
              onClick={() => update({ category: c })}
              className={`shrink-0 rounded-full border px-3 py-1.5 capitalize ${
                (search.category ?? "all") === c ? "border-primary bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-secondary"
              }`}
            >
              {c === "all" ? "All" : c + "s"}
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-border" />
          {BRANDS.map((b) => (
            <button
              key={b}
              onClick={() => update({ brand: b === "All" ? undefined : b })}
              className={`shrink-0 rounded-full border px-3 py-1.5 ${
                (search.brand ?? "All") === b ? "border-primary bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-secondary"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">{results.length} results</p>

        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
        {results.length === 0 && (
          <div className="mt-12 rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
            No listings match your filters.
          </div>
        )}
      </div>
    </div>
  );
}