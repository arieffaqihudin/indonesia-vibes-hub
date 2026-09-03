import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { WorkspaceShell } from "@/components/contributor/WorkspaceShell";
import { btn, inputClass, PageHeading, Panel } from "@/components/contributor/primitives";
import { ORGANISATION_TYPES, TYPE_CONFIG } from "@/lib/contributor/schema";
import { useWorkspace } from "@/lib/contributor/store";

export const Route = createFileRoute("/contributor/organisation")({
  head: () => ({
    meta: [
      { title: "Organisation profile — Indonesia Vibes Contributor Workspace" },
      {
        name: "description",
        content: "Keep your organisation's description, contact details and areas of cultural focus up to date.",
      },
      { property: "og:title", content: "Organisation profile — Indonesia Vibes Contributor Workspace" },
      { property: "og:description", content: "Your organisation's details as our editors see them." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrganisationPage,
});

function OrganisationPage() {
  const { organisation, updateOrganisation, submissions } = useWorkspace();
  const [saved, setSaved] = useState(false);

  if (!organisation) return <WorkspaceShell><p className="text-sm text-muted-foreground">Loading…</p></WorkspaceShell>;

  const field = (name: keyof typeof organisation, label: string, help?: string, textarea = false) => (
    <div>
      <label htmlFor={String(name)} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={String(name)}
          rows={4}
          className={inputClass}
          value={String(organisation[name] ?? "")}
          onChange={(e) => {
            updateOrganisation({ [name]: e.target.value });
            setSaved(false);
          }}
        />
      ) : (
        <input
          id={String(name)}
          className={inputClass}
          value={String(organisation[name] ?? "")}
          onChange={(e) => {
            updateOrganisation({ [name]: e.target.value });
            setSaved(false);
          }}
        />
      )}
      {help ? <p className="mt-1.5 text-xs text-muted-foreground">{help}</p> : null}
    </div>
  );

  const byType = Object.entries(
    submissions.reduce<Record<string, number>>((acc, s) => {
      acc[s.type] = (acc[s.type] ?? 0) + 1;
      return acc;
    }, {}),
  );

  return (
    <WorkspaceShell>
      <PageHeading
        eyebrow="Organisation"
        title={organisation.name}
        intro="This is how our editorial team understands who you are. It also becomes the attribution on anything we publish from you."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Panel title="About the organisation">
            <div className="space-y-5">
              {field("name", "Organisation name")}
              <div>
                <label htmlFor="org-type" className="mb-1.5 block text-sm font-medium text-ink">
                  Type of organisation
                </label>
                <select
                  id="org-type"
                  className={inputClass}
                  value={organisation.type}
                  onChange={(e) => {
                    updateOrganisation({ type: e.target.value });
                    setSaved(false);
                  }}
                >
                  {ORGANISATION_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              {field("country", "Country")}
              {field("city", "City")}
              {field(
                "description",
                "Description",
                "Two or three sentences. What you do, who you serve, and what makes your work distinctive.",
                true,
              )}
              {field("focus", "Areas of cultural focus", "For example: textile heritage, contemporary performance, archives.")}
            </div>
          </Panel>

          <Panel title="Contact and links">
            <div className="space-y-5">
              {field("website", "Website")}
              {field("contactEmail", "Public contact email")}
              {field("contactPerson", "Main contact person")}
            </div>
            <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
              <button type="button" className={btn.primary} onClick={() => setSaved(true)}>
                Save changes
              </button>
              <span aria-live="polite" className="text-xs text-muted-foreground">
                {saved ? "Saved." : "Changes save as you type."}
              </span>
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Contribution summary">
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Total submissions</span>
                <span className="text-ink">{submissions.length}</span>
              </li>
              {byType.map(([type, count]) => (
                <li key={type} className="flex justify-between">
                  <span className="text-muted-foreground">
                    {TYPE_CONFIG[type as keyof typeof TYPE_CONFIG]?.label ?? type}
                  </span>
                  <span className="text-ink">{count}</span>
                </li>
              ))}
              <li className="flex justify-between border-t border-border pt-2">
                <span className="text-muted-foreground">Published</span>
                <span className="text-ink">{submissions.filter((s) => s.status === "published").length}</span>
              </li>
            </ul>
          </Panel>
          <Panel title="Your team">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Colleagues can draft and submit alongside you. Organisation admins manage who has access.
            </p>
            <Link to="/contributor/team" className={`${btn.secondary} mt-4`}>
              Manage team
            </Link>
          </Panel>
        </div>
      </div>
    </WorkspaceShell>
  );
}
