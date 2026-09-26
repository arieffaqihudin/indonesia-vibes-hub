import { createFileRoute, Link } from "@tanstack/react-router";

import { adminHead } from "@/lib/admin/head";

export const Route = createFileRoute("/studio/unauthorized")({
  head: adminHead("Access Denied", "You don't have access to this part of Indonesia Vibes Studio."),
  component: AccessDenied,
});

function AccessDenied() {
  return <div className="mx-auto max-w-xl py-16">
    <h1 className="text-2xl font-semibold text-ink">Access denied</h1>
    <p className="mt-3 text-sm text-muted-foreground">Your account doesn't have permission to view this area. Contact your team if you need access.</p>
    <Link to="/studio/dashboard" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">Return to Dashboard</Link>
  </div>;
}