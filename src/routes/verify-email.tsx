import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MailCheck, RefreshCw, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

const emailSchema = z.string().trim().email().max(255);

export const Route = createFileRoute("/verify-email")({
  validateSearch: (s: Record<string, unknown>) => ({
    email: typeof s.email === "string" ? s.email : "",
  }),
  component: VerifyEmail,
  head: () => ({ meta: [{ title: "Verify your email — RigMarket" }] }),
});

function VerifyEmail() {
  const { email: initialEmail } = Route.useSearch();
  const { session } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(initialEmail);
  const [cooldown, setCooldown] = useState(0);
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(false);

  // If a session exists, the gate will route them onward — but trigger a check here too
  useEffect(() => {
    if (session) navigate({ to: "/onboarding", replace: true });
  }, [session, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const resend = async () => {
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error("Enter a valid email first");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: parsed.data,
      options: { emailRedirectTo: window.location.origin },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Verification email sent");
    setCooldown(45);
  };

  const refresh = async () => {
    setChecking(true);
    const { data } = await supabase.auth.getSession();
    setChecking(false);
    if (data.session) {
      navigate({ to: "/onboarding", replace: true });
    } else {
      toast.message("Still waiting for verification", {
        description: "Click the link in the email, then try again.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-background px-5 py-6">
      <div className="mx-auto max-w-sm">
        <Link
          to="/auth"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>

        <div className="mt-6 flex flex-col items-center text-center">
          <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
            <MailCheck className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a verification link to{" "}
            <span className="font-medium text-foreground">{email || "your email"}</span>.
            Open it on this device to finish signing in.
          </p>
        </div>

        <div className="mt-8 space-y-3 rounded-2xl border bg-card p-4">
          <label className="block text-xs font-medium text-muted-foreground">
            Sent to a different address?
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <Button
            onClick={resend}
            disabled={busy || cooldown > 0}
            variant="outline"
            className="h-11 w-full"
          >
            {busy
              ? "Sending…"
              : cooldown > 0
                ? `Resend in ${cooldown}s`
                : "Resend verification email"}
          </Button>
        </div>

        <Button
          onClick={refresh}
          disabled={checking}
          className="mt-4 h-12 w-full text-base font-semibold"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${checking ? "animate-spin" : ""}`} />
          {checking ? "Checking…" : "I've verified — continue"}
        </Button>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Didn't get it? Check your spam folder, or wait a minute and resend.
        </p>
      </div>
    </main>
  );
}