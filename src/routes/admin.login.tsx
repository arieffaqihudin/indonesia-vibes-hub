import { useEffect, useState } from "react";
import { Link, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";

import { AdminAuthLayout } from "@/components/cms/AuthLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type LoginSearch = { redirect?: string; denied?: string };
function safeDestination(value: string | undefined) { return value?.startsWith("/admin/") && !value.startsWith("//") ? value : "/admin/dashboard"; }

export const Route = createFileRoute("/admin/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    const redirectTo = search["redirect"];
    return { ...(typeof redirectTo === "string" ? { redirect: redirectTo } : {}), ...(search["denied"] ? { denied: "1" } : {}) };
  },
  beforeLoad: async ({ search }) => { const { data } = await supabase.auth.getUser(); if (data.user) throw redirect({ to: safeDestination(search.redirect) }); },
  head: () => ({ meta: [
    { title: "CMS Sign In — Indonesia Vibes" }, { name: "description", content: "Sign in to manage Indonesia Vibes." },
    { property: "og:title", content: "CMS Sign In — Indonesia Vibes" }, { property: "og:description", content: "Sign in to manage Indonesia Vibes." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }), component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate(); const search = Route.useSearch();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true); const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false); const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>(search.denied ? { form: "This account doesn't have CMS access, or it has been deactivated. Please contact an administrator." } : {});
  useEffect(() => { const { data } = supabase.auth.onAuthStateChange((event) => { if (event === "SIGNED_IN") void navigate({ to: safeDestination(search.redirect), replace: true }); }); return () => data.subscription.unsubscribe(); }, [navigate, search.redirect]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (submitting) return;
    const nextErrors: typeof errors = {}; if (!email.trim()) nextErrors.email = "Please enter your email."; if (!password) nextErrors.password = "Please enter your password.";
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return; }
    setSubmitting(true); setErrors({});
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) { setErrors({ form: /banned/i.test(error.message) ? "This account has been deactivated. Please contact an administrator." : "Incorrect email or password." }); setSubmitting(false); return; }
    window.localStorage.setItem("iv-cms-remember", remember ? "true" : "false");
    window.sessionStorage.setItem("iv-cms-session-active", "true");
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        display_name: data.user.user_metadata["display_name"] as string | undefined ?? data.user.user_metadata["full_name"] as string | undefined ?? null,
        avatar_url: data.user.user_metadata["avatar_url"] as string | undefined ?? null,
        updated_at: new Date().toISOString(),
      });
    }
    await navigate({ to: safeDestination(search.redirect), replace: true });
  }

  return <AdminAuthLayout>
    <div className="mb-9 hidden items-center gap-2.5 lg:flex"><span className="text-base font-semibold text-ink">Indonesia <span className="text-primary">Vibes</span></span></div>
    <h1 className="text-3xl font-semibold text-ink">Welcome back</h1><p className="mt-2 text-sm text-muted-foreground">Sign in to manage Indonesia Vibes.</p>
    <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
      <div><label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">Email</label><input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={Boolean(errors.email)} placeholder="name@organisation.org" className="h-12 w-full rounded-md border border-input bg-background px-3.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />{errors.email ? <p className="mt-1.5 text-xs text-deep-red">{errors.email}</p> : null}</div>
      <div><label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">Password</label><div className="relative"><input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} aria-invalid={Boolean(errors.password)} placeholder="Enter your password" className="h-12 w-full rounded-md border border-input bg-background px-3.5 pr-12 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground hover:text-ink" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>{errors.password ? <p className="mt-1.5 text-xs text-deep-red">{errors.password}</p> : null}</div>
      <div className="flex items-center justify-between gap-4 text-sm"><label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-muted-foreground"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-5 w-5 rounded border-input accent-primary" />Remember me</label><Link to="/admin/forgot-password" className="inline-flex min-h-11 items-center font-medium text-primary hover:underline">Forgot password?</Link></div>
      {errors.form ? <p role="alert" className="rounded-md bg-blush px-3 py-2.5 text-sm text-deep-red">{errors.form}</p> : null}
      <Button type="submit" disabled={submitting} className="h-12 w-full rounded-[var(--btn-radius)] text-sm">{submitting ? "Signing in..." : "Sign In"}</Button>
    </form>
  </AdminAuthLayout>;
}