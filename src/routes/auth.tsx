import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Truck, Mail, Phone, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({ meta: [{ title: "Sign in — RigMarket" }] }),
});

function AuthPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-6">
      <div className="mx-auto max-w-sm">
        <Link
          to="/welcome"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Welcome to RigMarket</h1>
            <p className="text-xs text-muted-foreground">Sign in or create your account</p>
          </div>
        </div>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email"><Mail className="mr-1 h-3.5 w-3.5" />Email</TabsTrigger>
            <TabsTrigger value="phone"><Phone className="mr-1 h-3.5 w-3.5" />Phone</TabsTrigger>
            <TabsTrigger value="google">Google</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="mt-4">
            <EmailForm />
          </TabsContent>
          <TabsContent value="phone" className="mt-4">
            <PhoneForm />
          </TabsContent>
          <TabsContent value="google" className="mt-4">
            <GoogleSignIn />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function EmailForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        // If email confirmation is required, there's no session yet.
        if (!data.session) {
          navigate({ to: "/verify-email", search: { email } });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          // Surface the unverified-email case to the verify screen
          if (/confirm/i.test(error.message) || /verify/i.test(error.message)) {
            navigate({ to: "/verify-email", search: { email } });
            return;
          }
          throw error;
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button type="submit" className="h-12 w-full text-base font-semibold" disabled={busy}>
        {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
      </Button>
      <button
        type="button"
        className="block w-full text-center text-sm text-primary hover:underline"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
      >
        {mode === "signin" ? "New here? Create an account" : "Have an account? Sign in"}
      </button>
    </form>
  );
}

function PhoneForm() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"phone" | "code">("phone");
  const [busy, setBusy] = useState(false);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
      toast.success("Code sent");
      setStage("code");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send code. Phone provider may not be configured yet.");
    } finally {
      setBusy(false);
    }
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.verifyOtp({ phone, token: code, type: "sms" });
      if (error) throw error;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setBusy(false);
    }
  };

  return stage === "phone" ? (
    <form onSubmit={sendCode} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone number</Label>
        <Input id="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+15551234567" />
        <p className="text-xs text-muted-foreground">Include country code, e.g. +1</p>
      </div>
      <Button type="submit" className="h-12 w-full text-base font-semibold" disabled={busy}>
        {busy ? "Sending…" : "Send code"}
      </Button>
    </form>
  ) : (
    <form onSubmit={verify} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code">Verification code</Label>
        <Input id="code" inputMode="numeric" required value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" />
      </div>
      <Button type="submit" className="h-12 w-full text-base font-semibold" disabled={busy}>
        {busy ? "Verifying…" : "Verify & sign in"}
      </Button>
      <button type="button" className="block w-full text-center text-sm text-muted-foreground" onClick={() => setStage("phone")}>
        Use a different number
      </button>
    </form>
  );
}

function GoogleSignIn() {
  const [busy, setBusy] = useState(false);
  const handle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Could not sign in with Google");
      setBusy(false);
    }
    // If redirected, the browser will navigate away
  };
  return (
    <div className="space-y-3 py-2">
      <p className="text-sm text-muted-foreground">Use your Google account to sign in instantly.</p>
      <Button onClick={handle} disabled={busy} className="h-12 w-full text-base font-semibold" variant="outline">
        {busy ? "Connecting…" : "Continue with Google"}
      </Button>
    </div>
  );
}