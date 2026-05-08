import { createFileRoute, Link } from "@tanstack/react-router";
import { User } from "lucide-react";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/account")({
  component: Account,
  head: () => ({ meta: [{ title: "Account — RigMarket" }] }),
});

function Account() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-md px-4 py-10 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground">
          <User className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-xl font-bold">Sign in to RigMarket</h1>
        <p className="mt-1 text-sm text-muted-foreground">Save listings, message sellers, and manage your dealership.</p>
        <button className="mt-6 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Continue with email</button>
        <Link to="/" className="mt-3 inline-block text-xs text-muted-foreground hover:underline">Back home</Link>
      </div>
    </div>
  );
}