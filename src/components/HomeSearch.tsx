import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Search,
  Truck,
  Container,
  ChevronDown,
  MapPin,
  Crosshair,
  Loader2,
  DollarSign,
  Gauge,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  defaultFilters,
  fmtMileage,
  fmtPrice,
  MILEAGE_MAX,
  MILEAGE_MIN,
  PRICE_MAX,
  PRICE_MIN,
  DEFAULT_RADIUS,
  type Filters,
} from "@/lib/filters";

const HOME_BRANDS = ["Freightliner", "Peterbilt", "Kenworth", "Volvo Trucks", "Mack Trucks"];
const RADIUS_OPTIONS = [25, 50, 100, 250, 500];

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    );
    const d = (await r.json()) as { address?: Record<string, string> };
    const a = d.address ?? {};
    return [a.city || a.town || a.village || a.hamlet || "", a.state || ""]
      .filter(Boolean)
      .join(", ") || "Current location";
  } catch {
    return "Current location";
  }
}

async function geocode(q: string) {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`,
    );
    const d = (await r.json()) as Array<{ display_name: string; lat: string; lon: string }>;
    if (!d.length) return null;
    return {
      label: d[0].display_name.split(",").slice(0, 2).join(",").trim(),
      lat: parseFloat(d[0].lat),
      lng: parseFloat(d[0].lon),
    };
  } catch {
    return null;
  }
}

export function HomeSearch() {
  const navigate = useNavigate();
  const [f, setF] = useState<Filters>(defaultFilters());
  const [locQuery, setLocQuery] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (p: Partial<Filters>) => setF((s) => ({ ...s, ...p }));

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const label = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        update({
          location: { label, lat: pos.coords.latitude, lng: pos.coords.longitude },
          radius: f.radius || DEFAULT_RADIUS,
        });
        setBusy(false);
      },
      () => setBusy(false),
      { enableHighAccuracy: false, timeout: 8000 },
    );
  };

  const submitLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locQuery.trim()) return;
    setBusy(true);
    const res = await geocode(locQuery.trim());
    setBusy(false);
    if (res) update({ location: res, radius: f.radius || DEFAULT_RADIUS });
  };

  const findRig = async () => {
    try {
      sessionStorage.setItem("rigmarket:filters", JSON.stringify(f));
    } catch {}
    navigate({ to: "/browse" });
  };

  return (
    <section className="mx-auto -mt-10 w-full max-w-4xl px-4 sm:-mt-14">
      <div className="rounded-2xl border bg-card p-4 shadow-[var(--shadow-elevated)] sm:p-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-bold tracking-tight sm:text-xl">Find your next rig</h2>
          <button
            onClick={() => {
              setF(defaultFilters());
              setLocQuery("");
            }}
            className="text-xs font-medium text-muted-foreground hover:text-destructive"
          >
            Reset
          </button>
        </div>

        {/* Vehicle Type — always visible */}
        <div className="mb-3 grid grid-cols-3 gap-2">
          {([
            { key: "all", label: "All", icon: Search },
            { key: "truck", label: "Truck", icon: Truck },
            { key: "trailer", label: "Trailer", icon: Container },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => update({ category: t.key })}
              className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition ${
                f.category === t.key
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "bg-background hover:bg-secondary"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <FilterCard
            icon={<Truck className="h-4 w-4" />}
            label="Brand"
            summary={
              f.brands.length === 0
                ? "Any brand"
                : f.brands.length <= 2
                  ? f.brands.join(", ")
                  : `${f.brands.length} selected`
            }
          >
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {HOME_BRANDS.map((b) => {
                const on = f.brands.includes(b);
                return (
                  <button
                    key={b}
                    onClick={() =>
                      update({
                        brands: on ? f.brands.filter((x) => x !== b) : [...f.brands, b],
                      })
                    }
                    className={`rounded-lg border px-3 py-2 text-sm transition ${
                      on
                        ? "border-primary bg-primary/10 font-semibold text-primary"
                        : "bg-background hover:bg-secondary"
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </FilterCard>

          <FilterCard
            icon={<DollarSign className="h-4 w-4" />}
            label="Price"
            summary={
              f.minPrice === PRICE_MIN && f.maxPrice === PRICE_MAX
                ? "Any price"
                : `${fmtPrice(f.minPrice)} – ${fmtPrice(f.maxPrice)}`
            }
          >
            <div className="mb-3 text-center text-sm font-semibold">
              {fmtPrice(f.minPrice)} – {fmtPrice(f.maxPrice)}
            </div>
            <Slider
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={2500}
              value={[f.minPrice, f.maxPrice]}
              onValueChange={(v) => update({ minPrice: v[0], maxPrice: v[1] })}
            />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>$500k+</span>
            </div>
          </FilterCard>

          <FilterCard
            icon={<Gauge className="h-4 w-4" />}
            label="Mileage"
            summary={
              f.minMileage === MILEAGE_MIN && f.maxMileage === MILEAGE_MAX
                ? "Any mileage"
                : `${fmtMileage(f.minMileage)} – ${fmtMileage(f.maxMileage)}`
            }
          >
            <div className="mb-3 text-center text-sm font-semibold">
              {fmtMileage(f.minMileage)} – {fmtMileage(f.maxMileage)}
            </div>
            <Slider
              min={MILEAGE_MIN}
              max={MILEAGE_MAX}
              step={5000}
              value={[f.minMileage, f.maxMileage]}
              onValueChange={(v) => update({ minMileage: v[0], maxMileage: v[1] })}
            />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>0 mi</span>
              <span>1M+ mi</span>
            </div>
          </FilterCard>

          <FilterCard
            icon={<MapPin className="h-4 w-4" />}
            label="Location"
            summary={f.location ? `${f.location.label} · ${f.radius} mi` : "Anywhere"}
          >
            <form onSubmit={submitLocation} className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={locQuery}
                onChange={(e) => setLocQuery(e.target.value)}
                placeholder="City, state, or zip"
                className="w-full rounded-full border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </form>
            <button
              type="button"
              onClick={detectLocation}
              disabled={busy}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/5 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
              Use current location
            </button>
            {f.location && (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">{f.location.label}</span>
              </div>
            )}
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">Radius</span>
                <span className="font-semibold text-primary">{f.radius} mi</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {RADIUS_OPTIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => update({ radius: r })}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      f.radius === r
                        ? "border-primary bg-primary text-primary-foreground"
                        : "bg-background hover:bg-secondary"
                    }`}
                  >
                    {r} mi
                  </button>
                ))}
              </div>
            </div>
          </FilterCard>
        </div>

        <Button
          onClick={findRig}
          className="mt-5 h-14 w-full rounded-xl text-base font-bold tracking-tight shadow-[var(--shadow-card)]"
        >
          <Search className="mr-2 h-5 w-5" />
          Find My Rig
        </Button>
      </div>
    </section>
  );
}

function FilterCard({
  icon,
  label,
  summary,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  summary: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="rounded-xl border bg-background">
        <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
              {icon}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-semibold">{label}</div>
              <div className="truncate text-xs text-muted-foreground">{summary}</div>
            </div>
          </div>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t px-4 py-4">{children}</CollapsibleContent>
      </div>
    </Collapsible>
  );
}