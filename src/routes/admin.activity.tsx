import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { can } from "@/lib/admin/types";
import { Card, EmptyState, PageHeading, SearchInput, Tag, dateFmt, timeFmt } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/activity")({
  head: adminHead("Activity log", "A plain record of who changed what, and when."),
  component: Activity,
});

function Activity() {
  const admin = useAdmin();
  const [query, setQuery] = useState("");
  const sensitiveVisible = can(admin.role, "configure");

  const entries = admin.activity
    .filter((a) => (a.sensitive ? sensitiveVisible : true))
    .filter((a) => (query ? `${a.actor} ${a.action} ${a.recordTitle}`.toLowerCase().includes(query.toLowerCase()) : true))
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  const days = [...new Set(entries.map((e) => e.date.slice(0, 10)))];

  return (
    <>
      <PageHeading
        eyebrow="System"
        title="Activity log"
        description="Accountability without surveillance: what happened to a record, not how long someone spent on it."
      />

      <div className="mb-4 max-w-sm">
        <SearchInput value={query} onChange={setQuery} label="Search activity" placeholder="Person, action or record" />
      </div>

      {entries.length ? (
        <div className="space-y-4">
          {days.map((day) => (
            <Card key={day} title={dateFmt(day)}>
              <ul className="space-y-2 text-sm">
                {entries
                  .filter((e) => e.date.startsWith(day))
                  .map((e) => (
                    <li key={e.id} className="flex flex-wrap items-baseline gap-2">
                      <span className="w-12 shrink-0 text-xs tabular-nums text-muted-foreground">{timeFmt(e.date)}</span>
                      <span className="text-ink">
                        <strong className="font-medium">{e.actor}</strong> {e.action} — {e.recordTitle}
                      </span>
                      <Tag tone="quiet">{e.recordType}</Tag>
                      {e.sensitive ? <Tag tone="alert">Internal only</Tag> : null}
                    </li>
                  ))}
              </ul>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No activity matches that search." />
      )}
    </>
  );
}
