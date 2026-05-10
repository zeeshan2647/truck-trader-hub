import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/welcome")({
  component: Welcome,
  head: () => ({
    meta: [
      { title: "RigMarket — Buy and sell trucks & trailers faster" },
      { name: "description", content: "Welcome to RigMarket. Buy and sell commercial trucks and trailers faster." },
    ],
  }),
});

function Welcome() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background px-6 py-10">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-6 grid h-20 w-20 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elevated)]">
          <Truck className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          RigMarket
        </h1>
        <p className="mt-3 max-w-xs text-base text-muted-foreground">
          Buy and sell trucks &amp; trailers faster.
        </p>
      </div>
      <div className="w-full max-w-sm space-y-3">
        <Button asChild size="lg" className="h-14 w-full text-base font-semibold">
          <Link to="/auth">Get started</Link>
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to our Terms &amp; Privacy Policy.
        </p>
      </div>
    </main>
  );
}