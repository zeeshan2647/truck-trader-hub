import { Link } from "@tanstack/react-router";
import heroPoster from "@/assets/hero-truck.jpg";

const VIDEO_SOURCES = [
  // Royalty-free truck/highway b-roll. Replace with self-hosted asset for production.
  "https://cdn.coverr.co/videos/coverr-driving-on-the-highway-1572/1080p.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-truck-driving-on-a-highway-at-sunset-34562-large.mp4",
];

export function HeroVideo() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroPoster}
          aria-hidden="true"
        >
          {VIDEO_SOURCES.map((src) => (
            <source key={src} src={src} type="video/mp4" />
          ))}
        </video>
        {/* Fallback image — shown if <video> tag is unsupported */}
        <img
          src={heroPoster}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover -z-10"
        />
        {/* Dark readability overlay + brand wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/55 via-foreground/40 to-foreground/70" />
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-60 mix-blend-multiply" />
      </div>

      <div className="relative mx-auto flex min-h-[78svh] max-w-6xl flex-col justify-end px-4 pb-14 pt-24 text-primary-foreground sm:min-h-[82svh] sm:pb-20 sm:pt-32">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-1 text-xs font-medium uppercase tracking-wider backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          The marketplace for commercial rigs
        </span>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          Buy and Sell Trucks <span className="text-accent">&amp; Trailers</span> Faster
        </h1>
        <p className="mt-4 max-w-xl text-base text-primary-foreground/85 sm:text-lg">
          Find the perfect rig or list yours in minutes — trusted by dealers and owner-operators across North America.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/browse"
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition hover:bg-primary/90"
          >
            Browse Listings
          </Link>
          <Link
            to="/sell"
            className="inline-flex h-12 items-center justify-center rounded-md border border-primary-foreground/30 bg-primary-foreground/10 px-6 text-sm font-semibold text-primary-foreground backdrop-blur transition hover:bg-primary-foreground/20"
          >
            Sell Your Rig
          </Link>
        </div>
        <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-primary-foreground/20 pt-6 text-primary-foreground/90">
          <div><dt className="text-xs uppercase tracking-wider opacity-70">Listings</dt><dd className="mt-1 text-xl font-bold">12k+</dd></div>
          <div><dt className="text-xs uppercase tracking-wider opacity-70">Verified dealers</dt><dd className="mt-1 text-xl font-bold">800+</dd></div>
          <div><dt className="text-xs uppercase tracking-wider opacity-70">Avg. sale</dt><dd className="mt-1 text-xl font-bold">9 days</dd></div>
        </dl>
      </div>
    </section>
  );
}