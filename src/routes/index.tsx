import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, Sparkles, Truck, Wrench } from "lucide-react";
import { Header } from "@/components/Header";
import { ListingCard } from "@/components/ListingCard";
import { HomeSearch } from "@/components/HomeSearch";
import { listings } from "@/lib/listings";
import { HeroVideo } from "@/components/HeroVideo";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "RigMarket — Buy & Sell Commercial Trucks and Trailers" },
      { name: "description", content: "The mobile-first marketplace for commercial trucks and trailers. Browse semi-trucks, reefers, flatbeds and more." },
    ],
  }),
});

function Index() {
  const featured = listings.filter((l) => l.promoted).concat(listings.filter((l) => !l.promoted)).slice(0, 4);
  const { profile } = useAuth();
  const recs = personalizedRecs(profile?.location ?? null, profile?.role ?? null);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroVideo />

      <HomeSearch />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-4 text-xl font-bold tracking-tight">Browse by category</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Sleeper Trucks", icon: Truck, q: "Sleeper" },
            { label: "Day Cabs", icon: Truck, q: "Day" },
            { label: "Flatbeds", icon: Wrench, q: "Flatbed" },
            { label: "Reefers", icon: ShieldCheck, q: "Refrigerated" },
          ].map((c) => (
            <Link
              key={c.label}
              to="/browse"
              search={{ q: c.q }}
              className="flex flex-col items-start gap-2 rounded-xl border bg-card p-4 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]"
            >
              <c.icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-bold tracking-tight">Featured listings</h2>
          <Link to="/browse" className="text-sm font-medium text-primary hover:underline">See all</Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <Sparkles className="h-5 w-5 text-accent" />
              {profile?.location ? `Recommended near ${profile.location.split(",")[0]}` : "Recommended for you"}
            </h2>
            <p className="text-sm text-muted-foreground">Curated based on your profile and location.</p>
          </div>
          <Link to="/browse" className="text-sm font-medium text-primary hover:underline">More</Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recs.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      </section>

      <footer className="border-t bg-card">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} RigMarket. Built for owner-operators and fleets.
        </div>
      </footer>
    </div>
  );
}

function personalizedRecs(location: string | null, role: string | null) {
  const region = location?.split(",")[0]?.trim().toLowerCase() ?? "";
  const sorted = [...listings].sort((a, b) => {
    const aMatch = a.location.toLowerCase().includes(region) ? 1 : 0;
    const bMatch = b.location.toLowerCase().includes(region) ? 1 : 0;
    if (aMatch !== bMatch) return bMatch - aMatch;
    if (role === "dealer") return b.price - a.price;
    if (role === "buyer") return a.price - b.price;
    return 0;
  });
  return sorted.slice(0, 4);
}
