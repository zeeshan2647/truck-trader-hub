import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search, MapPin, Loader2, Crosshair } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { lazy, Suspense } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
const LocationMap = lazy(() =>
  import("./LocationMap").then((m) => ({ default: m.LocationMap })),
);
import {
  ALL_BRANDS,
  DEFAULT_RADIUS,
  MILEAGE_MAX,
  MILEAGE_MIN,
  PRICE_MAX,
  PRICE_MIN,
  defaultFilters,
  fmtMileage,
  fmtPrice,
  type Filters,
} from "@/lib/filters";

type Screen = "root" | "brand" | "mileage" | "location" | "price";

export function FilterSheet({
  open,
  onOpenChange,
  value,
  onApply,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  value: Filters;
  onApply: (f: Filters) => void;
}) {
  const [draft, setDraft] = useState<Filters>(value);
  const [screen, setScreen] = useState<Screen>("root");

  useEffect(() => {
    if (open) {
      setDraft(value);
      setScreen("root");
    }
  }, [open, value]);

  const update = (patch: Partial<Filters>) => setDraft((d) => ({ ...d, ...patch }));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[92vh] w-full max-w-xl rounded-t-2xl p-0 sm:max-w-xl"
      >
        <div className="flex h-full flex-col">
          <Header
            screen={screen}
            onBack={() => setScreen("root")}
            onClose={() => onOpenChange(false)}
          />

          <div className="flex-1 overflow-y-auto">
            {screen === "root" && (
              <RootScreen draft={draft} onPick={setScreen} />
            )}
            {screen === "brand" && (
              <BrandScreen
                selected={draft.brands}
                onChange={(brands) => update({ brands })}
              />
            )}
            {screen === "mileage" && (
              <MileageScreen
                min={draft.minMileage}
                max={draft.maxMileage}
                onChange={(minMileage, maxMileage) => update({ minMileage, maxMileage })}
              />
            )}
            {screen === "price" && (
              <PriceScreen
                min={draft.minPrice}
                max={draft.maxPrice}
                onChange={(minPrice, maxPrice) => update({ minPrice, maxPrice })}
              />
            )}
            {screen === "location" && (
              <LocationScreen
                location={draft.location}
                radius={draft.radius}
                onChange={(location, radius) => update({ location, radius })}
              />
            )}
          </div>

          <div className="flex items-center gap-2 border-t bg-background p-3">
            <Button
              variant="ghost"
              className="flex-1 h-12 text-sm"
              onClick={() => setDraft(defaultFilters())}
            >
              Clear all
            </Button>
            <Button
              className="flex-[2] h-12 text-sm font-semibold"
              onClick={() => {
                onApply(draft);
                onOpenChange(false);
              }}
            >
              Apply filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Header({
  screen,
  onBack,
  onClose,
}: {
  screen: Screen;
  onBack: () => void;
  onClose: () => void;
}) {
  const titles: Record<Screen, string> = {
    root: "Filters",
    brand: "Brand",
    mileage: "Mileage",
    location: "Location",
    price: "Price",
  };
  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-b px-2">
      {screen === "root" ? (
        <span className="w-10" />
      ) : (
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary"
          aria-label="Back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      <h2 className="text-base font-semibold">{titles[screen]}</h2>
      <button
        onClick={onClose}
        className="px-3 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        Close
      </button>
    </div>
  );
}

function Row({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between border-b px-4 py-4 text-left transition hover:bg-secondary/40"
    >
      <div>
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{value}</div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

function RootScreen({ draft, onPick }: { draft: Filters; onPick: (s: Screen) => void }) {
  const brandSummary =
    draft.brands.length === 0
      ? "Any brand"
      : draft.brands.length <= 2
        ? draft.brands.join(", ")
        : `${draft.brands.length} selected`;
  const mileageSummary =
    draft.minMileage === MILEAGE_MIN && draft.maxMileage === MILEAGE_MAX
      ? "Any mileage"
      : `${fmtMileage(draft.minMileage)} – ${fmtMileage(draft.maxMileage)}`;
  const priceSummary =
    draft.minPrice === PRICE_MIN && draft.maxPrice === PRICE_MAX
      ? "Any price"
      : `${fmtPrice(draft.minPrice)} – ${fmtPrice(draft.maxPrice)}`;
  const locationSummary = draft.location
    ? `${draft.location.label} · ${draft.radius} mi`
    : "Anywhere";

  return (
    <div>
      <Row label="Brand" value={brandSummary} onClick={() => onPick("brand")} />
      <Row label="Mileage" value={mileageSummary} onClick={() => onPick("mileage")} />
      <Row label="Location" value={locationSummary} onClick={() => onPick("location")} />
      <Row label="Price" value={priceSummary} onClick={() => onPick("price")} />
    </div>
  );
}

function BrandScreen({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (brands: string[]) => void;
}) {
  const [q, setQ] = useState("");
  const filtered = ALL_BRANDS.filter((b) => b.toLowerCase().includes(q.toLowerCase()));
  const toggle = (b: string) =>
    onChange(selected.includes(b) ? selected.filter((x) => x !== b) : [...selected, b]);

  return (
    <div>
      <div className="sticky top-0 border-b bg-background p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search brands…"
            className="w-full rounded-full border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
      {selected.length > 0 && (
        <div className="flex items-center justify-between border-b px-4 py-2 text-xs">
          <span className="text-muted-foreground">{selected.length} selected</span>
          <button
            onClick={() => onChange([])}
            className="font-medium text-primary hover:underline"
          >
            Clear
          </button>
        </div>
      )}
      <ul>
        {filtered.map((b) => {
          const checked = selected.includes(b);
          return (
            <li key={b}>
              <label className="flex cursor-pointer items-center gap-3 border-b px-4 py-3.5 hover:bg-secondary/40">
                <Checkbox checked={checked} onCheckedChange={() => toggle(b)} />
                <span className="text-sm">{b}</span>
              </label>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-muted-foreground">
            No brands match "{q}"
          </li>
        )}
      </ul>
    </div>
  );
}

function MileageScreen({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}) {
  return (
    <div className="p-6">
      <div className="mb-6 rounded-xl border bg-card p-4 text-center shadow-[var(--shadow-card)]">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          Mileage range
        </div>
        <div className="mt-1 text-lg font-semibold">
          {fmtMileage(min)} – {fmtMileage(max)}
        </div>
      </div>
      <Slider
        min={MILEAGE_MIN}
        max={MILEAGE_MAX}
        step={5000}
        value={[min, max]}
        onValueChange={(v) => onChange(v[0], v[1])}
      />
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>0 mi</span>
        <span>1,000,000 mi</span>
      </div>
    </div>
  );
}

function PriceScreen({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}) {
  return (
    <div className="p-6">
      <div className="mb-6 rounded-xl border bg-card p-4 text-center shadow-[var(--shadow-card)]">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          Price range
        </div>
        <div className="mt-1 text-lg font-semibold">
          {fmtPrice(min)} – {fmtPrice(max)}
        </div>
      </div>
      <Slider
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={2500}
        value={[min, max]}
        onValueChange={(v) => onChange(v[0], v[1])}
      />
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>$0</span>
        <span>$500k+</span>
      </div>
    </div>
  );
}

const RADIUS_OPTIONS = [25, 50, 100, 250, 500];

async function geocode(query: string): Promise<{ label: string; lat: number; lng: number } | null> {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`,
      { headers: { Accept: "application/json" } },
    );
    const data = (await r.json()) as Array<{ display_name: string; lat: string; lon: string }>;
    if (!data.length) return null;
    return {
      label: data[0].display_name.split(",").slice(0, 2).join(",").trim(),
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch {
    return null;
  }
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    );
    const d = (await r.json()) as { address?: Record<string, string> };
    const a = d.address ?? {};
    const city = a.city || a.town || a.village || a.hamlet || "";
    const state = a.state || "";
    return [city, state].filter(Boolean).join(", ") || "Current location";
  } catch {
    return "Current location";
  }
}

function LocationScreen({
  location,
  radius,
  onChange,
}: {
  location: Filters["location"];
  radius: number;
  onChange: (loc: Filters["location"], radius: number) => void;
}) {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const label = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        onChange({ label, lat: pos.coords.latitude, lng: pos.coords.longitude }, radius);
        setBusy(false);
      },
      () => setBusy(false),
      { enableHighAccuracy: false, timeout: 8000 },
    );
  };

  const submitSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setBusy(true);
    const res = await geocode(q.trim());
    setBusy(false);
    if (res) onChange(res, radius || DEFAULT_RADIUS);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-3 border-b p-4">
        <form onSubmit={submitSearch} className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search city, state, or zip"
            className="w-full rounded-full border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </form>
        <button
          onClick={useMyLocation}
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/5 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
          Use my current location
        </button>
        {location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium">{location.label}</span>
          </div>
        )}
      </div>

      <div className="h-64 w-full shrink-0 bg-muted">
        {location ? (
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                Loading map…
              </div>
            }
          >
            <LocationMap lat={location.lat} lng={location.lng} radius={radius} />
          </Suspense>
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
            Pick a location to see a search radius on the map.
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Search radius</span>
          <span className="text-primary font-semibold">{radius} mi</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {RADIUS_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => onChange(location, r)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                radius === r
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card hover:bg-secondary"
              }`}
            >
              {r} mi
            </button>
          ))}
        </div>
        {location && (
          <button
            onClick={() => onChange(null, DEFAULT_RADIUS)}
            className="text-xs font-medium text-muted-foreground hover:text-destructive"
          >
            Clear location
          </button>
        )}
      </div>
    </div>
  );
}