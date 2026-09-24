import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { AuthShell } from "@/components/contributor/WorkspaceShell";
import { btn, inputClass, PrototypeNote } from "@/components/contributor/primitives";
import { useWorkspace } from "@/lib/contributor/store";

export const Route = createFileRoute("/contributor/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Indonesia Vibes Contributor Workspace" },
      {
        name: "description",
        content:
          "Sign in to the Indonesia Vibes Contributor Workspace to propose articles, events, profiles and collaborations.",
      },
      { property: "og:title", content: "Sign in — Indonesia Vibes Contributor Workspace" },
      { property: "og:description", content: "Propose and manage cultural contributions to Indonesia Vibes." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useWorkspace();
  const navigate = useNavigate();
  const [email, setEmail] = useState("maya.kusuma@kemlu.go.id");
  const [password, setPassword] = useState("prototype");
  const [error, setError] = useState("");

  return (
    <AuthShell
      title="Sign in"
      intro="Welcome back. Pick up where you left off."
      footer={
        <p>
          New here?{" "}
          <Link to="/contributor/register" className="text-primary underline underline-offset-4">
            Create a contributor account
          </Link>
        </p>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!email.includes("@")) {
            setError("Please enter a valid work email address.");
            return;
          }
          signIn(email);
          navigate({ to: "/contributor" });
        }}
      >
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
            Work email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "login-error" : undefined}
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error ? (
          <p id="login-error" role="alert" className="text-sm font-medium text-destructive">
            {error}
          </p>
        ) : null}
        <button type="submit" className={`${btn.primary} w-full`}>
          Sign in
        </button>
        <div className="flex justify-between text-sm">
          <Link to="/contributor/forgot-password" className="text-muted-foreground hover:text-primary">
            Forgot your password?
          </Link>
          <Link to="/contributor/invitation" className="text-muted-foreground hover:text-primary">
            I have an invitation
          </Link>
        </div>
        <PrototypeNote>
          Prototype sign-in. Any email and password will open the workspace with sample submissions.
        </PrototypeNote>
      </form>
    </AuthShell>
  );
}
