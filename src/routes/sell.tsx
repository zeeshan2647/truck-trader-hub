import { createFileRoute } from "@tanstack/react-router";
import { Camera, Plus } from "lucide-react";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/sell")({
  component: Sell,
  head: () => ({ meta: [{ title: "Sell Your Truck — RigMarket" }] }),
});

function Sell() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="text-2xl font-bold tracking-tight">List your truck or trailer</h1>
        <p className="mt-1 text-sm text-muted-foreground">Reach thousands of qualified buyers in minutes.</p>

        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
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
          <p className="text-center text-xs text-muted-foreground">Account & payments coming soon.</p>
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