import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { WorkspaceShell } from "@/components/contributor/WorkspaceShell";
import {
  btn,
  formatDate,
  inputClass,
  PageHeading,
  Panel,
  PrototypeNote,
} from "@/components/contributor/primitives";
import { useWorkspace } from "@/lib/contributor/store";

export const Route = createFileRoute("/contributor/team")({
  head: () => ({
    meta: [
      { title: "Team — Indonesia Vibes Contributor Workspace" },
      { name: "description", content: "Invite colleagues to draft and submit contributions alongside you." },
      { property: "og:title", content: "Team — Indonesia Vibes Contributor Workspace" },
      { property: "og:description", content: "Invite colleagues and manage who can contribute." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TeamPage,
});

const ROLES = ["Organisation Admin", "Contributor"] as const;

function TeamPage() {
  const { user, members, inviteMember, updateMemberRole, removeMember } = useWorkspace();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<(typeof ROLES)[number]>("Contributor");
  const [message, setMessage] = useState("");
  const isAdmin = user?.role === "Organisation Admin";

  return (
    <WorkspaceShell>
      <PageHeading
        eyebrow="Team"
        title="Who can contribute"
        intro="Everyone here can create drafts and send submissions. Publication always stays with the Indonesia Vibes editorial team."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Panel title="Members">
          <ul className="divide-y divide-border">
            {members.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center gap-3 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blush text-xs font-semibold text-clay">
                  {m.name
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-ink">{m.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {m.email} · {m.status === "invited" ? `Invited ${formatDate(m.invitedAt)}` : "Active"}
                  </span>
                </span>
                {isAdmin && m.id !== user?.id ? (
                  <>
                    <label className="sr-only" htmlFor={`role-${m.id}`}>
                      Role for {m.name}
                    </label>
                    <select
                      id={`role-${m.id}`}
                      className={`${inputClass} w-auto`}
                      value={m.role}
                      onChange={(e) => updateMemberRole(m.id, e.target.value as (typeof ROLES)[number])}
                    >
                      {ROLES.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="text-xs text-muted-foreground underline underline-offset-4 hover:text-primary"
                      onClick={() => removeMember(m.id)}
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">{m.role}</span>
                )}
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-6">
          <Panel
            title="Invite a colleague"
            description={isAdmin ? undefined : "Only organisation admins can invite new members."}
          >
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!isAdmin || !email.trim()) return;
                inviteMember({ name: name.trim() || email.split("@")[0]!, email: email.trim(), role });
                setMessage(`Invitation sent to ${email.trim()}.`);
                setEmail("");
                setName("");
              }}
            >
              <div>
                <label htmlFor="invite-name" className="mb-1.5 block text-sm font-medium text-ink">
                  Full name
                </label>
                <input
                  id="invite-name"
                  className={inputClass}
                  value={name}
                  disabled={!isAdmin}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="invite-email" className="mb-1.5 block text-sm font-medium text-ink">
                  Work email
                </label>
                <input
                  id="invite-email"
                  type="email"
                  required
                  className={inputClass}
                  value={email}
                  disabled={!isAdmin}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="invite-role" className="mb-1.5 block text-sm font-medium text-ink">
                  Role
                </label>
                <select
                  id="invite-role"
                  className={inputClass}
                  value={role}
                  disabled={!isAdmin}
                  onChange={(e) => setRole(e.target.value as (typeof ROLES)[number])}
                >
                  {ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  Organisation admins manage the organisation profile and team. Contributors create and send
                  submissions.
                </p>
              </div>
              <button type="submit" className={btn.primary} disabled={!isAdmin}>
                Send invitation
              </button>
              <p aria-live="polite" className="text-xs text-muted-foreground">
                {message}
              </p>
            </form>
          </Panel>
          <PrototypeNote>Invitations are simulated in this prototype — no email is sent.</PrototypeNote>
        </div>
      </div>
    </WorkspaceShell>
  );
}
