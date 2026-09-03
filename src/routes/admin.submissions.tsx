import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { possibleDuplicates } from "@/lib/admin/selectors";
import { CONTENT_STATUS, kindLabel } from "@/lib/admin/types";
import { Card, EmptyState, PageHeading, SearchInput, StatusPill, Tag, abtn, relative } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/submissions")({
  head: adminHead("Submissions", "Screen incoming contributor submissions before they enter editorial review."),
  component: Submissions,
});

const INCOMING = ["submitted", "initial_review"] as const;

function Submissions() {
  const admin = useAdmin();
  const [query, setQuery] = useState("");

  const items = useMemo(
    () =>
      admin.content
        .filter((c) => (INCOMING as readonly string[]).includes(c.status) && c.contributor)
        .filter((c) => (query ? `${c.title} ${c.organisation ?? ""}`.toLowerCase().includes(query.toLowerCase()) : true))
        .sort((a, b) => a.stageSince.localeCompare(b.stageSince)),
    [admin.content, query],
  );

  return (
    <>
      <PageHeading
        eyebrow="Editorial"
        title="Submissions"
        description="Contributor submissions arrive here for screening. Nothing is published from this screen."
      />

      <div className="mb-4 max-w-md">
        <SearchInput value={query} onChange={setQuery} label="Search submissions" placeholder="Title or organisation" />
      </div>

      {items.length ? (
        <ul className="space-y-3">
          {items.map((item) => {
            const duplicates = possibleDuplicates(item.title, admin.content).filter((d) => d.item.id !== item.id);
            return (
              <li key={item.id}>
                <Card>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusPill status={item.status} />
                        <Tag tone="quiet">{kindLabel(item.kind)}</Tag>
                        {item.priority !== "Normal" ? <Tag tone="alert">{item.priority}</Tag> : null}
                      </div>
                      <h2 className="mt-2 font-display text-lg text-ink">
                        <Link to="/admin/content/$id" params={{ id: item.id }} className="hover:text-primary">
                          {item.title}
                        </Link>
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.contributor}
                        {item.organisation ? ` · ${item.organisation}` : ""} · waiting {relative(item.stageSince)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{CONTENT_STATUS[item.status].meaning}</p>
                      {duplicates.length ? (
                        <p className="mt-2 text-xs text-clay">
                          Possible existing record: {duplicates.map((d) => d.item.title).join(", ")}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <Link to="/admin/content/$id" params={{ id: item.id }} className={abtn.primary}>
                        Open submission
                      </Link>
                      {item.status === "submitted" ? (
                        <button type="button" className={abtn.secondary} onClick={() => admin.transition(item.id, "initial_review")}>
                          Start screening
                        </button>
                      ) : null}
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          title="No submissions waiting."
          hint="New contributor submissions appear here as soon as they are sent for review."
          action={
            <Link to="/admin/content" className={abtn.secondary}>
              Go to the content library
            </Link>
          }
        />
      )}
    </>
  );
}
