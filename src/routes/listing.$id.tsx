import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, MapPin, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { listings } from "@/lib/listings";
import { isSaved, toggleSaved } from "@/lib/saved";

export const Route = createFileRoute("/listing/$id")({
  component: ListingDetail,
  loader: ({ params }) => {
    const listing = listings.find((l) => l.id === params.id);
    if (!listing) throw notFound();
    return { listing };
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-md p-8 text-center">
        <h1 className="text-xl font-bold">Listing not found</h1>
        <Link to="/browse" className="mt-4 inline-block text-primary hover:underline">Back to browse</Link>
      </div>
    </div>
  ),
  errorComponent: () => (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-md p-8 text-center text-sm text-muted-foreground">Something went wrong.</div>
    </div>
  ),
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.listing.title} — RigMarket` },
          { name: "description", content: loaderData.listing.description.slice(0, 155) },
          { property: "og:image", content: loaderData.listing.images[0] },
        ]
      : [{ title: "Listing — RigMarket" }],
  }),
});

function ListingDetail() {
  const { listing } = Route.useLoaderData();
  const [active, setActive] = useState(0);
  const [saved, setSaved] = useState(false);
  useEffect(() => setSaved(isSaved(listing.id)), [listing.id]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-4">
        <Link to="/browse" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="mt-3 overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)]">
          <div className="relative aspect-[4/3] bg-muted sm:aspect-[16/9]">
            <img src={listing.images[active]} alt={listing.title} className="h-full w-full object-cover" />
            {listing.promoted && (
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground shadow">
                <Sparkles className="h-3 w-3" /> Promoted
              </span>
            )}
          </div>
          {listing.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-2">
              {listing.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 ${i === active ? "border-primary" : "border-transparent"}`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{listing.title}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{listing.location}</span>
                <span>•</span>
                <span>{listing.condition}</span>
                {listing.category === "truck" && (<><span>•</span><span>{listing.mileage.toLocaleString()} mi</span></>)}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">${listing.price.toLocaleString()}</span>
                <button
                  onClick={() => setSaved(toggleSaved(listing.id))}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm ${saved ? "border-destructive bg-destructive/5 text-destructive" : "hover:bg-secondary"}`}
                >
                  <Heart className={`h-4 w-4 ${saved ? "fill-destructive" : ""}`} /> {saved ? "Saved" : "Save"}
                </button>
              </div>
            </div>

            <section className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Specifications</h2>
              <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                <div className="flex justify-between border-b py-1.5"><dt className="text-muted-foreground">Year</dt><dd className="font-medium">{listing.year}</dd></div>
                <div className="flex justify-between border-b py-1.5"><dt className="text-muted-foreground">Brand</dt><dd className="font-medium">{listing.brand}</dd></div>
                <div className="flex justify-between border-b py-1.5"><dt className="text-muted-foreground">Model</dt><dd className="font-medium">{listing.model}</dd></div>
                <div className="flex justify-between border-b py-1.5"><dt className="text-muted-foreground">Type</dt><dd className="font-medium">{listing.type}</dd></div>
                <div className="flex justify-between border-b py-1.5"><dt className="text-muted-foreground">Transmission</dt><dd className="font-medium">{listing.transmission}</dd></div>
                <div className="flex justify-between border-b py-1.5"><dt className="text-muted-foreground">VIN</dt><dd className="font-mono text-xs font-medium">{listing.vin}</dd></div>
                {Object.entries(listing.specs).map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b py-1.5">
                    <dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Description</h2>
              <p className="mt-2 text-sm leading-relaxed">{listing.description}</p>
            </section>
          </div>

          <aside className="space-y-3 rounded-xl border bg-card p-4 shadow-[var(--shadow-card)] lg:sticky lg:top-20 lg:h-fit">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary font-semibold">
                {listing.sellerName.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-semibold">{listing.sellerName}</div>
                <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3 w-3 text-primary" /> Verified {listing.sellerType}
                </div>
              </div>
            </div>
            <a
              href={`tel:${listing.sellerPhone.replace(/[^0-9]/g, "")}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <Phone className="h-4 w-4" /> {listing.sellerPhone}
            </a>
            <button className="w-full rounded-md border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-secondary">
              Send message
            </button>
            <p className="text-xs text-muted-foreground">Mention RigMarket when you call.</p>
          </aside>
        </div>
      </div>
    </div>
  );
}