import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { averageQueueAge, queueBuckets } from "@/lib/admin/selectors";
import { kindLabel } from "@/lib/admin/types";
import { Card, EmptyState, Metric, PageHeading, StatusPill, TabBar, Tag, abtn, relative } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/review/")({
  head: adminHead("Review queue", "Work waiting on the team, grouped by what it is actually waiting for."),
  component: ReviewQueue,
});

function ReviewQueue() {
  const admin = useAdmin();
  const [bucketId, setBucketId] = useState(queueBuckets[0]!.id);
  const bucket = queueBuckets.find((b) => b.id === bucketId)!;
  const items = admin.content.filter((c) => bucket.match(c, admin.role, admin.user.name));

  return (
    <>
      <PageHeading
        eyebrow="Editorial"
        title="Needs review"
        description="Grouped by what each record is waiting for, so nothing sits in an unnamed pile."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Metric value={admin.content.filter((c) => queueBuckets.some((b) => b.match(c, admin.role, admin.user.name))).length} label="In the queue" />
        <Metric value={`${averageQueueAge(admin.content)} days`} label="Average time in stage" hint="Across everything currently in review." />
        <Metric value={admin.content.filter((c) => c.priority === "High").length} label="High priority" />
      </div>

      <TabBar
        label="Queue groups"
        tabs={queueBuckets.map((b) => ({
          id: b.id,
          label: b.label,
          count: admin.content.filter((c) => b.match(c, admin.role, admin.user.name)).length,
        }))}
        active={bucketId}
        onChange={setBucketId}
      />

      <div className="mt-4 space-y-3">
        {items.length ? (
          items.map((item) => (
            <Card key={item.id}>
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
                    {item.assignedTo ? `Assigned to ${item.assignedTo}` : "Unassigned"} · in this stage {relative(item.stageSince)}
                  </p>
                </div>
                <Link to="/admin/content/$id" params={{ id: item.id }} className={abtn.secondary}>
                  Open
                </Link>
              </div>
            </Card>
          ))
        ) : (
          <EmptyState title="Nothing waiting in this group." hint="Work appears here as it reaches this stage." />
        )}
      </div>
    </>
  );
}
