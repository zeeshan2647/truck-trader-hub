import { useEffect } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";

const PUBLIC_ROUTES = new Set(["/welcome", "/auth"]);

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { loading, session, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  useEffect(() => {
    if (loading) return;

    // Not signed in → only public routes allowed
    if (!session) {
      if (!PUBLIC_ROUTES.has(path)) {
        navigate({ to: "/welcome", replace: true });
      }
      return;
    }

    // Signed in but profile not yet loaded → wait
    if (!profile) return;

    // Signed in but not onboarded → force onboarding
    if (!profile.onboarded && path !== "/onboarding") {
      navigate({ to: "/onboarding", replace: true });
      return;
    }

    // Signed in & onboarded but still on public/onboarding → send home
    if (profile.onboarded && (PUBLIC_ROUTES.has(path) || path === "/onboarding")) {
      navigate({ to: "/", replace: true });
    }
  }, [loading, session, profile, path, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}