import { Link, useNavigate } from "@tanstack/react-router";
import { Truck, Search, Heart, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-[image:var(--gradient-primary)] text-primary-foreground">
            <Truck className="h-4 w-4" />
          </span>
          <span className="text-lg">RigMarket</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link to="/browse" className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground font-medium" }}>
            <Search className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Browse</span>
          </Link>
          <Link to="/saved" className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground font-medium" }}>
            <Heart className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Saved</span>
          </Link>
          <Link to="/sell" className="rounded-md bg-primary px-3 py-2 text-primary-foreground hover:opacity-90">
            Sell
          </Link>
          <Link to="/account" className="rounded-md p-2 text-muted-foreground hover:text-foreground">
            <User className="h-4 w-4" />
          </Link>
          <ThemeToggle />
          {session && (
            <button
              onClick={async () => { await signOut(); navigate({ to: "/welcome" }); }}
              className="rounded-md p-2 text-muted-foreground hover:text-foreground"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}