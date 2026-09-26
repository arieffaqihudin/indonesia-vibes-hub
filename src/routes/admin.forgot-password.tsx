import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { AdminAuthLayout } from "@/components/cms/AuthLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/forgot-password")({ head: () => ({ meta: [
  { title: "Reset CMS Password — Indonesia Vibes" }, { name: "description", content: "Request password reset instructions for Indonesia Vibes CMS." },
  { property: "og:title", content: "Reset CMS Password — Indonesia Vibes" }, { property: "og:description", content: "Request password reset instructions for Indonesia Vibes CMS." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
] }), component: ForgotPassword });
function ForgotPassword() {
  const [email, setEmail] = useState(""); const [error, setError] = useState(""); const [submitting, setSubmitting] = useState(false); const [sent, setSent] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); if (submitting) return; if (!email.trim()) { setError("Please enter your email."); return; } setError(""); setSubmitting(true); await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/admin/reset-password` }); setSubmitting(false); setSent(true); }
  return <AdminAuthLayout>{sent ? <div><p className="text-sm font-medium uppercase text-primary">Password reset</p><h1 className="mt-3 text-3xl font-semibold text-ink">Check your email</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">If an account exists for this email, we've sent password reset instructions.</p><Link to="/admin/login" search={{}} className="mt-7 inline-flex text-sm font-medium text-primary hover:underline">Return to sign in</Link></div> : <div><h1 className="text-3xl font-semibold text-ink">Forgot your password?</h1><p className="mt-2 text-sm text-muted-foreground">Enter the email associated with your account.</p><form className="mt-8 space-y-5" onSubmit={submit} noValidate><div><label htmlFor="reset-email" className="mb-1.5 block text-sm font-medium text-ink">Email</label><input id="reset-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@organisation.org" className="h-12 w-full rounded-md border border-input bg-background px-3.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />{error ? <p className="mt-1.5 text-xs text-deep-red">{error}</p> : null}</div><Button type="submit" disabled={submitting} className="h-12 w-full">{submitting ? "Sending..." : "Send Reset Link"}</Button><Link to="/admin/login" search={{}} className="block text-center text-sm font-medium text-primary hover:underline">Back to sign in</Link></form></div>}</AdminAuthLayout>;
}