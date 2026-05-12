import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Camera, Plus, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { getPlan, planAllowsNewListing } from "@/lib/plans";

export const Route = createFileRoute("/sell")({
  component: Sell,
  head: () => ({ meta: [{ title: "Sell Your Truck — RigMarket" }] }),
});

function Sell() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { count } = await supabase
        .from("user_listings")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "active");
      setCount(count ?? 0);
    })();
  }, [user]);

  const plan = getPlan(profile?.subscription_plan);
  const allowed = count === null ? true : planAllowsNewListing(profile?.subscription_plan, count);

  if (!allowed) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-xl px-4 py-12">
          <div className="rounded-2xl border bg-card p-8 text-center shadow-[var(--shadow-card)]">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight">You've reached your {plan.name} limit</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              You're using {count}/{plan.listingLimit} active listings on the {plan.name} plan.
              Upgrade to keep listing more inventory.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button asChild className="gap-2">
                <Link to="/pricing"><Sparkles className="h-4 w-4" /> See plans</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/account">Manage listings</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">List your truck or trailer</h1>
            <p className="mt-1 text-sm text-muted-foreground">Reach thousands of qualified buyers in minutes.</p>
          </div>
          <span className="shrink-0 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            {plan.name}{plan.listingLimit !== null && count !== null ? ` · ${count}/${plan.listingLimit}` : ""}
          </span>
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Listing draft saved — finish it from your account dashboard.");
            navigate({ to: "/account" });
          }}
        >
          <div className="rounded-xl border-2 border-dashed bg-card p-8 text-center">
            <Camera className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">Add up to 20 photos</p>
            <p className="text-xs text-muted-foreground">Bright, clear exterior shots get the most interest.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Year" placeholder="2022" />
            <Field label="Make" placeholder="Peterbilt" />
            <Field label="Model" placeholder="579" />
            <Field label="Mileage" placeholder="312,000" />
            <Field label="Price (USD)" placeholder="142,500" />
            <Field label="Location" placeholder="Dallas, TX" />
            <Field label="VIN" placeholder="1XPBD49X1ND…" className="col-span-2" />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">Description</label>
            <textarea
              rows={4}
              placeholder="Tell buyers about service history, modifications, and condition…"
              className="mt-1 w-full rounded-md border bg-card p-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4" /> Publish listing
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Need more visibility? <Link to="/pricing" className="font-medium text-primary hover:underline">Boost or upgrade your plan</Link>.
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ label, placeholder, className = "" }: { label: string; placeholder?: string; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border bg-card p-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}