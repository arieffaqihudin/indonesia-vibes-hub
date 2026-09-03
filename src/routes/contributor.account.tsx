import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { WorkspaceShell } from "@/components/contributor/WorkspaceShell";
import { btn, inputClass, PageHeading, Panel, PrototypeNote } from "@/components/contributor/primitives";
import { useWorkspace } from "@/lib/contributor/store";

export const Route = createFileRoute("/contributor/account")({
  head: () => ({
    meta: [
      { title: "Your account — Indonesia Vibes Contributor Workspace" },
      { name: "description", content: "Your contributor details, language preference and notification settings." },
      { property: "og:title", content: "Your account — Indonesia Vibes Contributor Workspace" },
      { property: "og:description", content: "Contributor details and notification preferences." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

const PREFS: { key: string; label: string; help: string }[] = [
  { key: "statusChanges", label: "Status changes", help: "When a submission moves to a new stage." },
  { key: "revisionRequests", label: "Revision requests", help: "When our editors need something from you." },
  { key: "publication", label: "Publication", help: "When a contribution goes live on the public platform." },
  { key: "opportunities", label: "Opportunities and calls", help: "Occasional invitations relevant to your work." },
];

function AccountPage() {
  const { user, updateUser, signOut } = useWorkspace();
  const [saved, setSaved] = useState(false);

  if (!user) return <WorkspaceShell><p className="text-sm text-muted-foreground">Loading…</p></WorkspaceShell>;

  const prefs = user.notify ?? {};

  return (
    <WorkspaceShell>
      <PageHeading eyebrow="Account" title="Your details" intro="How we address you and how we reach you." />

      <div className="mt-8 grid max-w-4xl gap-6 lg:grid-cols-2">
        <Panel title="Contributor profile">
          <div className="space-y-5">
            <div>
              <label htmlFor="acct-name" className="mb-1.5 block text-sm font-medium text-ink">
                Full name
              </label>
              <input
                id="acct-name"
                className={inputClass}
                value={user.name}
                onChange={(e) => {
                  updateUser({ name: e.target.value });
                  setSaved(false);
                }}
              />
            </div>
            <div>
              <label htmlFor="acct-role" className="mb-1.5 block text-sm font-medium text-ink">
                Your role at the organisation
              </label>
              <input
                id="acct-role"
                className={inputClass}
                value={user.role ?? ""}
                onChange={(e) => {
                  updateUser({ role: e.target.value });
                  setSaved(false);
                }}
              />
            </div>
            <div>
              <label htmlFor="acct-email" className="mb-1.5 block text-sm font-medium text-ink">
                Work email
              </label>
              <input id="acct-email" className={inputClass} value={user.email} readOnly />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Contact us if this address needs to change.
              </p>
            </div>
            <div>
              <label htmlFor="acct-lang" className="mb-1.5 block text-sm font-medium text-ink">
                Preferred language for correspondence
              </label>
              <select
                id="acct-lang"
                className={inputClass}
                value={user.language ?? "English"}
                onChange={(e) => {
                  updateUser({ language: e.target.value });
                  setSaved(false);
                }}
              >
                <option>English</option>
                <option>Bahasa Indonesia</option>
              </select>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Submissions are published in English. Our team can help polish translated text.
              </p>
            </div>
            <div className="flex items-center gap-3 border-t border-border pt-4">
              <button type="button" className={btn.primary} onClick={() => setSaved(true)}>
                Save changes
              </button>
              <span aria-live="polite" className="text-xs text-muted-foreground">
                {saved ? "Saved." : "Changes save as you type."}
              </span>
            </div>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title="Email notifications">
            <ul className="space-y-3">
              {PREFS.map((p) => (
                <li key={p.key}>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 accent-[oklch(0.5705_0.2242_31.05)]"
                      checked={prefs[p.key] !== false}
                      onChange={(e) => updateUser({ notify: { ...prefs, [p.key]: e.target.checked } })}
                    />
                    <span>
                      <span className="block text-sm font-medium text-ink">{p.label}</span>
                      <span className="block text-xs text-muted-foreground">{p.help}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Sign out">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Drafts stay saved in this workspace for when you come back.
            </p>
            <button type="button" className={`${btn.secondary} mt-4`} onClick={() => signOut()}>
              Sign out
            </button>
          </Panel>

          <PrototypeNote>Account settings are stored locally in this prototype.</PrototypeNote>
        </div>
      </div>
    </WorkspaceShell>
  );
}
