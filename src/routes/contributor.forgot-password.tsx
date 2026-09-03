import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AuthShell } from "@/components/contributor/WorkspaceShell";
import { btn, inputClass, PrototypeNote } from "@/components/contributor/primitives";

export const Route = createFileRoute("/contributor/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — Indonesia Vibes Contributor Workspace" },
      { name: "description", content: "Request a password reset link for your Indonesia Vibes contributor account." },
      { property: "og:title", content: "Reset your password — Indonesia Vibes" },
      { property: "og:description", content: "Request a password reset link for your contributor account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <AuthShell
      title="Reset your password"
      intro="Enter the work email you use for Indonesia Vibes and we will send a reset link."
      footer={
        <Link to="/contributor/login" className="text-primary underline underline-offset-4">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="space-y-5">
          <p className="rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
            If an account exists for <span className="text-ink">{email}</span>, a reset link is on its
            way. The link is valid for one hour.
          </p>
          <PrototypeNote>Prototype flow — no email is actually sent.</PrototypeNote>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
              Work email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className={`${btn.primary} w-full`}>
            Send reset link
          </button>
        </form>
      )}
    </AuthShell>
  );
}
