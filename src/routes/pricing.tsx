import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { PLANS, type PlanId } from "@/lib/plans";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Pricing — RigMarket" },
      { name: "description", content: "Simple, transparent pricing for sellers and dealers on RigMarket." },
      { property: "og:title", content: "RigMarket Pricing — Free, Pay-Per-Listing, Dealer & Enterprise" },
      { property: "og:description", content: "Choose the plan that fits how you sell trucks and trailers." },
    ],
  }),
});

function PricingPage() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState<PlanId | null>(null);
  const current = (profile?.subscription_plan as PlanId) ?? "free";

  const choose = async (id: PlanId) => {
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    setBusy(id);
    const { error } = await supabase.from("profiles").update({ subscription_plan: id }).eq("id", user.id);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success(`You're on the ${id.charAt(0).toUpperCase() + id.slice(1)} plan`);
    await refreshProfile();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3 w-3 text-accent" /> Pricing
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Plans built for how you sell</h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
          Start free. Upgrade when you're ready to move more inventory. Cancel anytime.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 pb-16 md:grid-cols-2 lg:grid-cols-3">
        {PLANS.map((p) => {
          const active = current === p.id;
          return (
            <div
              key={p.id}
              className={`relative flex flex-col rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)] transition ${
                p.highlight ? "ring-2 ring-primary" : ""
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most popular
                </span>
              )}
              {active && (
                <span className="absolute -top-3 right-6 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  Current plan
                </span>
              )}
              <h3 className="text-lg font-bold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl font-bold tracking-tight">{p.price}</span>
                <span className="pb-1 text-sm text-muted-foreground">{p.cadence}</span>
              </div>
              <ul className="mt-5 flex-1 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
                {p.notIncluded?.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-muted-foreground">
                    <X className="mt-0.5 h-4 w-4 shrink-0 opacity-60" />
                    <span className="line-through decoration-1">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 h-11 w-full"
                variant={p.highlight ? "default" : "outline"}
                disabled={busy === p.id || active}
                onClick={() => choose(p.id)}
              >
                {active ? "You're on this plan" : busy === p.id ? "Updating…" : p.cta}
              </Button>
            </div>
          );
        })}
      </section>

      <section className="border-t bg-card/40">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-3">
          <Boost title="Featured listing boost" body="Pin your listing to the top of search results for 7 days." price="$19" />
          <Boost title="Homepage featured placement" body="Showcase your rig on the RigMarket homepage." price="$49" />
          <Boost title="Verified seller badge" body="Build buyer trust with identity verification." price="$25" />
        </div>
        <div className="pb-12 text-center">
          <Link to="/account" className="text-sm font-medium text-primary hover:underline">
            Manage your subscription →
          </Link>
        </div>
      </section>
    </div>
  );
}

function Boost({ title, body, price }: { title: string; body: string; price: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">{title}</h4>
        <span className="text-sm font-bold text-primary">{price}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}