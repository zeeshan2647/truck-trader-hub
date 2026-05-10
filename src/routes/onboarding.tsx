import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, ShoppingBag, Store, Building2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth, type Role } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
  head: () => ({ meta: [{ title: "Set up your profile — RigMarket" }] }),
});

const INTERESTS = ["Sleeper trucks", "Day cabs", "Flatbeds", "Reefers", "Dump trucks", "Tankers", "Box trucks"];

function Onboarding() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);

  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState<Role | null>(null);

  // role-specific
  const [interests, setInterests] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sellerItems, setSellerItems] = useState("");
  const [dealerNotes, setDealerNotes] = useState("");

  const totalSteps = 4;

  const submit = async () => {
    if (!user) return;
    setBusy(true);
    const payload = {
      id: user.id,
      full_name: fullName.trim() || null,
      location: location.trim() || null,
      role,
      buyer_interests: role === "buyer" ? interests : null,
      buyer_min_price: role === "buyer" && minPrice ? Number(minPrice) : null,
      buyer_max_price: role === "buyer" && maxPrice ? Number(maxPrice) : null,
      seller_items: role === "seller" ? sellerItems.trim() || null : null,
      dealer_inventory_notes: role === "dealer" ? dealerNotes.trim() || null : null,
      onboarded: true,
    };
    const { error } = await supabase.from("profiles").upsert(payload);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await refreshProfile();
    if (role === "seller") navigate({ to: "/sell" });
    else if (role === "dealer") navigate({ to: "/sell" });
    else navigate({ to: "/browse" });
  };

  const canAdvance = () => {
    if (step === 0) return fullName.trim().length > 1;
    if (step === 1) return location.trim().length > 1;
    if (step === 2) return !!role;
    if (step === 3) {
      if (role === "buyer") return interests.length > 0;
      if (role === "seller") return sellerItems.trim().length > 1;
      if (role === "dealer") return dealerNotes.trim().length > 1;
    }
    return false;
  };

  return (
    <main className="min-h-screen bg-background px-5 py-6">
      <div className="mx-auto max-w-md">
        {/* Progress */}
        <div className="mb-6 flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        {step === 0 && (
          <Section title="What's your name?" subtitle="So buyers and sellers know who they're dealing with.">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" autoFocus value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" />
          </Section>
        )}

        {step === 1 && (
          <Section title="Where are you based?" subtitle="We'll use this to show nearby listings.">
            <Label htmlFor="loc">City, State</Label>
            <Input id="loc" autoFocus value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Dallas, TX" />
          </Section>
        )}

        {step === 2 && (
          <Section title="How will you use RigMarket?" subtitle="Pick the role that fits you best.">
            <div className="space-y-3">
              <RoleCard icon={ShoppingBag} title="Buyer" desc="Looking for a truck or trailer." active={role === "buyer"} onClick={() => setRole("buyer")} />
              <RoleCard icon={Store} title="Seller" desc="Selling one or two units." active={role === "seller"} onClick={() => setRole("seller")} />
              <RoleCard icon={Building2} title="Dealer" desc="Managing a fleet or inventory." active={role === "dealer"} onClick={() => setRole("dealer")} />
            </div>
          </Section>
        )}

        {step === 3 && role === "buyer" && (
          <Section title="What are you shopping for?" subtitle="We'll personalize your feed.">
            <div className="grid grid-cols-2 gap-2">
              {INTERESTS.map((i) => {
                const checked = interests.includes(i);
                return (
                  <label key={i} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm ${checked ? "border-primary bg-primary/5" : ""}`}>
                    <Checkbox checked={checked} onCheckedChange={() => setInterests(checked ? interests.filter((x) => x !== i) : [...interests, i])} />
                    {i}
                  </label>
                );
              })}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="min">Min price</Label>
                <Input id="min" inputMode="numeric" value={minPrice} onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ""))} placeholder="$0" />
              </div>
              <div>
                <Label htmlFor="max">Max price</Label>
                <Input id="max" inputMode="numeric" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ""))} placeholder="$200,000" />
              </div>
            </div>
          </Section>
        )}

        {step === 3 && role === "seller" && (
          <Section title="What are you selling?" subtitle="A short description helps us route the right buyers.">
            <Textarea rows={5} value={sellerItems} onChange={(e) => setSellerItems(e.target.value)} placeholder="2019 Freightliner Cascadia, sleeper, 450k miles…" />
          </Section>
        )}

        {step === 3 && role === "dealer" && (
          <Section title="Tell us about your inventory" subtitle="What kinds of rigs do you typically carry?">
            <Textarea rows={5} value={dealerNotes} onChange={(e) => setDealerNotes(e.target.value)} placeholder="Sleepers, day cabs, flatbeds — fleet of 50+ units rotated monthly." />
          </Section>
        )}

        <div className="mt-8 flex items-center gap-2">
          {step > 0 && (
            <Button variant="ghost" onClick={() => setStep(step - 1)} className="h-12">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
          )}
          <Button
            disabled={!canAdvance() || busy}
            onClick={() => (step < totalSteps - 1 ? setStep(step + 1) : submit())}
            className="h-12 flex-1 text-base font-semibold"
          >
            {step < totalSteps - 1 ? (
              <>
                Continue <ArrowRight className="ml-1 h-4 w-4" />
              </>
            ) : busy ? (
              "Saving…"
            ) : (
              <>
                Finish <Check className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-6 space-y-2">{children}</div>
    </section>
  );
}

function RoleCard({
  icon: Icon,
  title,
  desc,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
        active ? "border-primary bg-primary/5 shadow-[var(--shadow-card)]" : "hover:bg-secondary/50"
      }`}
    >
      <div className={`grid h-11 w-11 place-items-center rounded-xl ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      {active && <Check className="h-5 w-5 text-primary" />}
    </button>
  );
}