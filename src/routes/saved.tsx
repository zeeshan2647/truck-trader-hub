import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Header } from "@/components/Header";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/lib/listings";
import { getSaved } from "@/lib/saved";

export const Route = createFileRoute("/saved")({
  component: Saved,
  head: () => ({ meta: [{ title: "Saved Listings — RigMarket" }] }),
});

function Saved() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => setIds(getSaved());
    sync();
    window.addEventListener("rigmarket:saved-changed", sync);
    return () => window.removeEventListener("rigmarket:saved-changed", sync);
  }, []);

  const items = listings.filter((l) => ids.includes(l.id));
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-bold tracking-tight">Saved listings</h1>
        <p className="mt-1 text-sm text-muted-foreground">{items.length} saved</p>
        {items.length === 0 ? (
          <div className="mt-8 rounded-xl border bg-card p-10 text-center shadow-[var(--shadow-card)]">
            <Heart className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">Tap the heart on any listing to save it.</p>
            <Link to="/browse" className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Browse listings</Link>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </div>
    </div>
  );
}