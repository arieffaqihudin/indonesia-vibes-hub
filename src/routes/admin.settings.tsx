import { Link, createFileRoute } from "@tanstack/react-router";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { can } from "@/lib/admin/types";
import { Card, PageHeading, PrototypeNote, abtn, useConfirm } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/settings")({
  head: adminHead("Settings", "Workflow, review and prototype settings for the internal dashboard."),
  component: Settings,
});

function Settings() {
  const admin = useAdmin();
  const configure = can(admin.role, "configure");
  const { confirm, dialog } = useConfirm();

  return (
    <>
      <PageHeading eyebrow="System" title="Settings" description="Nothing here is hidden logic: these are the rules the workflow already follows." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Workflow rules">
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink">
            <li>Contributors can propose and update content, but never publish it.</li>
            <li>Cultural subjects and people always pass through cultural or subject review.</li>
            <li>Nothing can be approved while a required media item has unresolved rights.</li>
            <li>Every published record carries a review date so it can be checked again.</li>
          </ul>
        </Card>

        <Card title="Review cadence">
          <ul className="space-y-1.5 text-sm text-ink">
            <li>Cultural subjects — reviewed every 12 months</li>
            <li>People and institutions — every 12 months</li>
            <li>Events and opportunities — checked against their own dates</li>
            <li>Stories — every 24 months, or when a linked record changes</li>
          </ul>
        </Card>

        <Card title="Public surfaces">
          <p className="text-sm text-muted-foreground">
            Published records appear on the public platform. Contributors work in a separate workspace.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/" className={abtn.secondary}>
              Open public platform
            </Link>
            <Link to="/contributor" className={abtn.secondary}>
              Open contributor workspace
            </Link>
          </div>
        </Card>

        <Card title="Prototype data">
          <p className="text-sm text-muted-foreground">
            This dashboard runs entirely on prototype data held in your browser. Resetting restores the original demonstration state.
          </p>
          <button
            type="button"
            className={`${abtn.danger} mt-3`}
            disabled={!configure}
            onClick={() =>
              confirm(
                "Reset the prototype? All changes made in this session — workflow moves, notes, curation and partnership records — will be discarded.",
                () => admin.resetPrototype(),
              )
            }
          >
            Reset prototype data
          </button>
          {!configure ? <p className="mt-2 text-xs text-muted-foreground">Only a Super Admin can reset the prototype.</p> : null}
        </Card>
      </div>

      <div className="mt-4">
        <PrototypeNote>Settings are illustrative and are not connected to a live configuration service.</PrototypeNote>
      </div>
      {dialog}
    </>
  );
}
