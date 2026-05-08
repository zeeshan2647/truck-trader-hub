import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Search, ShieldCheck, Truck, Wrench } from "lucide-react";
import heroImg from "@/assets/hero-truck.jpg";
import { Header } from "@/components/Header";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/lib/listings";

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
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative isolate overflow-hidden">
        <img src={heroImg} alt="" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-primary-foreground sm:py-24">
          <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Find the right rig. <span className="text-accent">Move your business.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-primary-foreground/85 sm:text-base">
            Thousands of commercial trucks and trailers from trusted dealers and private sellers.
          </p>
          <Link
            to="/browse"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-semibold text-foreground shadow-lg hover:bg-background/95"
          >
            <Search className="h-4 w-4" /> Browse listings
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
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

      <footer className="border-t bg-card">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} RigMarket. Built for owner-operators and fleets.
        </div>
      </footer>
    </div>
  );
}
