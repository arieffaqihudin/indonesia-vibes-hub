import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { AuthShell } from "@/components/contributor/WorkspaceShell";
import { btn, inputClass, PrototypeNote } from "@/components/contributor/primitives";
import { useWorkspace } from "@/lib/contributor/store";

export const Route = createFileRoute("/contributor/invitation")({
  head: () => ({
    meta: [
      { title: "Accept your invitation — Indonesia Vibes Contributor Workspace" },
      {
        name: "description",
        content: "Accept an invitation to join your organisation's contributor workspace on Indonesia Vibes.",
      },
      { property: "og:title", content: "Accept your invitation — Indonesia Vibes" },
      { property: "og:description", content: "Join your organisation's contributor workspace." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: InvitationPage,
});

function InvitationPage() {
  const { organisation, register } = useWorkspace();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthShell
      title="You have been invited"
      intro={`${organisation.name} has invited you to contribute to Indonesia Vibes as a Contributor.`}
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          register({
            name: name || "New contributor",
            email: "invited@example.org",
            workspaceRole: "Contributor",
            country: organisation.country,
            emailVerified: true,
          });
          navigate({ to: "/contributor/onboarding" });
        }}
      >
        <div className="rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
          As a Contributor you can create submissions, edit your own drafts and respond to editorial
          feedback. Publication always stays with the Indonesia Vibes editorial team.
        </div>
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
            Full name
          </label>
          <input
            id="name"
            className={inputClass}
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
            Choose a password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className={`${btn.primary} w-full`}>
          Accept invitation
        </button>
        <PrototypeNote>Prototype invitation link.</PrototypeNote>
      </form>
    </AuthShell>
  );
}
