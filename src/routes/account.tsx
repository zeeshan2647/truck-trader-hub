import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut, Mail, Pencil, Plus, Save, Sparkles, Trash2, X } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth, type Role } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { REGIONS } from "@/lib/regions";
import { getPlan } from "@/lib/plans";

export const Route = createFileRoute("/account")({
  component: Account,
  head: () => ({ meta: [{ title: "Account — RigMarket" }] }),
});

type UserListing = {
  id: string;
  user_id: string;
  title: string;
  category: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  price: number | null;
  mileage: number | null;
  location: string | null;
  description: string | null;
};

function Account() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const plan = getPlan(profile?.subscription_plan);

  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [listings, setListings] = useState<UserListing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [editing, setEditing] = useState<UserListing | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setFullName(profile?.full_name ?? "");
    setLocation(profile?.location ?? "");
    setRole((profile?.role as Role) ?? "");
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoadingListings(true);
      const { data, error } = await supabase
        .from("user_listings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) toast.error(error.message);
      else setListings((data ?? []) as UserListing[]);
      setLoadingListings(false);
    })();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim() || null,
        location: location.trim() || null,
        role: role || null,
      })
      .eq("id", user.id);
    setSavingProfile(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
    await refreshProfile();
  };

  const deleteListing = async (id: string) => {
    const { error } = await supabase.from("user_listings").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setListings((l) => l.filter((x) => x.id !== id));
    toast.success("Listing deleted");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-6 space-y-8">
        <header>
          <h1 className="text-2xl font-bold tracking-tight">Your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your profile and listings.</p>
        </header>

        {/* Subscription card */}
        <section className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Subscription</h2>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xl font-bold">{plan.name}</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {plan.price} {plan.cadence}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {plan.listingLimit === null
                  ? `${listings.length} active listing${listings.length === 1 ? "" : "s"} · unlimited`
                  : `${listings.length}/${plan.listingLimit} active listings used`}
              </p>
            </div>
            <Button asChild variant="outline" className="gap-2">
              <Link to="/pricing"><Sparkles className="h-4 w-4" /> Upgrade</Link>
            </Button>
          </div>
          {plan.listingLimit !== null && (
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${Math.min(100, (listings.length / plan.listingLimit) * 100)}%` }}
              />
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-md border px-2 py-1">Billing: managed at checkout</span>
            <Link to="/pricing" className="rounded-md border px-2 py-1 hover:text-foreground">Change plan</Link>
          </div>
        </section>

        {/* Profile card */}
        <section className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Profile
          </h2>

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="truncate">{user?.email ?? "—"}</span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <Label htmlFor="loc">State / Province</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="loc" className="h-11">
                  <SelectValue placeholder="Select state or province" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectGroup>
                    <SelectLabel>United States</SelectLabel>
                    {REGIONS.filter((r) => r.country === "USA").map((r) => (
                      <SelectItem key={`US-${r.code}`} value={`${r.name}, USA`}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Canada</SelectLabel>
                    {REGIONS.filter((r) => r.country === "Canada").map((r) => (
                      <SelectItem key={`CA-${r.code}`} value={`${r.name}, Canada`}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger id="role" className="h-11">
                  <SelectValue placeholder="Pick a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                  <SelectItem value="dealer">Dealer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={saveProfile} disabled={savingProfile} className="gap-2">
                <Save className="h-4 w-4" />
                {savingProfile ? "Saving…" : "Save changes"}
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/welcome" });
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </section>

        {/* My listings */}
        <section className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Your listings
            </h2>
            <Button size="sm" className="gap-1" onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4" />
              New
            </Button>
          </div>

          {loadingListings ? (
            <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
          ) : listings.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              You haven't listed anything yet. Tap <span className="font-semibold">New</span> to add your first
              truck or trailer.
            </p>
          ) : (
            <ul className="mt-4 divide-y">
              {listings.map((l) => (
                <li key={l.id} className="flex items-start justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{l.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {[l.year, l.brand, l.model].filter(Boolean).join(" ")}
                      {l.price ? ` · $${l.price.toLocaleString()}` : ""}
                      {l.location ? ` · ${l.location}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditing(l)} aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteListing(l.id)}
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {(editing || creating) && (
        <ListingEditor
          initial={editing}
          userId={user!.id}
          defaultLocation={location}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSaved={(saved) => {
            setListings((arr) => {
              const exists = arr.some((x) => x.id === saved.id);
              return exists ? arr.map((x) => (x.id === saved.id ? saved : x)) : [saved, ...arr];
            });
            setEditing(null);
            setCreating(false);
          }}
        />
      )}
    </div>
  );
}

function ListingEditor({
  initial,
  userId,
  defaultLocation,
  onClose,
  onSaved,
}: {
  initial: UserListing | null;
  userId: string;
  defaultLocation: string;
  onClose: () => void;
  onSaved: (l: UserListing) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(initial?.category ?? "truck");
  const [brand, setBrand] = useState(initial?.brand ?? "");
  const [model, setModel] = useState(initial?.model ?? "");
  const [year, setYear] = useState(initial?.year?.toString() ?? "");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [mileage, setMileage] = useState(initial?.mileage?.toString() ?? "");
  const [location, setLocation] = useState(initial?.location ?? defaultLocation ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!title.trim()) return toast.error("Title is required");
    setBusy(true);
    const payload = {
      user_id: userId,
      title: title.trim(),
      category,
      brand: brand.trim() || null,
      model: model.trim() || null,
      year: year ? Number(year) : null,
      price: price ? Number(price) : null,
      mileage: mileage ? Number(mileage) : null,
      location: location.trim() || null,
      description: description.trim() || null,
    };
    const q = initial
      ? supabase.from("user_listings").update(payload).eq("id", initial.id).select().single()
      : supabase.from("user_listings").insert(payload).select().single();
    const { data, error } = await q;
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(initial ? "Listing updated" : "Listing created");
    onSaved(data as UserListing);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 sm:items-center">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-background p-5 sm:rounded-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">{initial ? "Edit listing" : "New listing"}</h3>
          <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <Label htmlFor="t">Title</Label>
            <Input id="t" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="2022 Peterbilt 579" />
          </div>
          <div>
            <Label htmlFor="cat">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="cat" className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="truck">Truck</SelectItem>
                <SelectItem value="trailer">Trailer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="b">Brand</Label>
              <Input id="b" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Peterbilt" />
            </div>
            <div>
              <Label htmlFor="m">Model</Label>
              <Input id="m" value={model} onChange={(e) => setModel(e.target.value)} placeholder="579" />
            </div>
            <div>
              <Label htmlFor="y">Year</Label>
              <Input id="y" inputMode="numeric" value={year} onChange={(e) => setYear(e.target.value.replace(/\D/g, ""))} placeholder="2022" />
            </div>
            <div>
              <Label htmlFor="p">Price (USD)</Label>
              <Input id="p" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} placeholder="142500" />
            </div>
            <div>
              <Label htmlFor="mi">Mileage</Label>
              <Input id="mi" inputMode="numeric" value={mileage} onChange={(e) => setMileage(e.target.value.replace(/\D/g, ""))} placeholder="312000" />
            </div>
            <div>
              <Label htmlFor="loc">Location</Label>
              <Input id="loc" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Texas, USA" />
            </div>
          </div>
          <div>
            <Label htmlFor="d">Description</Label>
            <Textarea id="d" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
