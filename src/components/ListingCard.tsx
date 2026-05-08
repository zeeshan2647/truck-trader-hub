import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Gauge, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import type { Listing } from "@/lib/listings";
import { isSaved, toggleSaved } from "@/lib/saved";

const fmtPrice = (n: number) => `$${n.toLocaleString()}`;
const fmtMiles = (n: number) => `${(n / 1000).toFixed(0)}k mi`;

export function ListingCard({ listing }: { listing: Listing }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => setSaved(isSaved(listing.id)), [listing.id]);

  return (
    <Link
      to="/listing/$id"
      params={{ id: listing.id }}
      className="group relative block overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={listing.images[0]}
          alt={listing.title}
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        {listing.promoted && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground shadow">
            <Sparkles className="h-3 w-3" /> Promoted
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setSaved(toggleSaved(listing.id));
          }}
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/90 text-foreground shadow hover:bg-background"
          aria-label="Save listing"
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-destructive text-destructive" : ""}`} />
        </button>
      </div>
      <div className="space-y-1.5 p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-semibold">{listing.title}</h3>
          <span className="shrink-0 text-sm font-bold text-primary">{fmtPrice(listing.price)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {listing.category === "truck" && (
            <span className="inline-flex items-center gap-1"><Gauge className="h-3 w-3" />{fmtMiles(listing.mileage)}</span>
          )}
          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{listing.location}</span>
          <span className="rounded bg-secondary px-1.5 py-0.5 text-secondary-foreground">{listing.condition}</span>
        </div>
      </div>
    </Link>
  );
}