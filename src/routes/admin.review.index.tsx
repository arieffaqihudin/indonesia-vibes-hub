import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { averageQueueAge, queueBuckets } from "@/lib/admin/selectors";
import { kindLabel } from "@/lib/admin/types";
import { EmptyState, PageHeading, StatusPill, SummaryStrip, TabBar, Table, Tag, Td, abtn, relative } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/review/")({
  head: adminHead("Needs review", "Work waiting on the team, grouped by what it is actually waiting for."),
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
        eyebrow="Editorial / Review"
        title="Needs review"
        description="Grouped by what each record is waiting for, so nothing sits in an unnamed pile."
      />

      <SummaryStrip items={[
        { value: admin.content.filter((c) => queueBuckets.some((b) => b.match(c, admin.role, admin.user.name))).length, label: "Total items" },
        { value: items.length, label: "Current group" },
        { value: `${averageQueueAge(admin.content)} days`, label: "Average age" },
        { value: admin.content.filter((c) => c.priority === "High").length, label: "High priority" },
      ]} />

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

      <div className="mt-4">
        {items.length ? (
          <Table caption="Review queue" head={["Title", "Type", "Issue", "Assigned to", "Updated", "Status", ""]}>
            {items.map((item) => (
              <tr key={item.id} className="group hover:bg-muted/35">
                <Td><Link to="/admin/content/$id" params={{ id: item.id }} className="font-semibold hover:text-primary">{item.title}</Link></Td>
                <Td className="text-xs text-muted-foreground">{kindLabel(item.kind)}</Td>
                <Td><Tag tone={item.priority === "High" ? "alert" : "quiet"}>{bucket.label}</Tag></Td>
                <Td className="text-xs text-muted-foreground">{item.assignedTo ?? "Unassigned"}</Td>
                <Td className="text-xs text-muted-foreground">{relative(item.updatedAt)}</Td>
                <Td><StatusPill status={item.status} /></Td>
                <Td><Link to="/admin/content/$id" params={{ id: item.id }} className={abtn.quiet}>Open</Link></Td>
              </tr>
            ))}
          </Table>
        ) : (
          <EmptyState title="Nothing waiting in this group." hint="Work appears here as it reaches this stage." />
        )}
      </div>
    </>
  );
}
