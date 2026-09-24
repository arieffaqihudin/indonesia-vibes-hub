import { Link, createFileRoute } from "@tanstack/react-router";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { dueTodayFollowUps, overdueFollowUps, undatedFollowUps, upcomingFollowUps } from "@/lib/admin/selectors";
import type { FollowUp } from "@/lib/admin/types";
import { EmptyState, PageHeading, StatusIndicator, SummaryStrip, Table, Td, abtn, dateFmt } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/follow-ups")({
  head: adminHead("Follow-ups", "Commitments the team has made, grouped by when they are due."),
  component: FollowUps,
});

function FollowUps() {
  const admin = useAdmin();
  const open = admin.followUps.filter((f) => f.status === "Open");
  const overdue = overdueFollowUps(open);
  const dueToday = dueTodayFollowUps(open);
  const upcoming = upcomingFollowUps(open);
  const undated = undatedFollowUps(open);
  const rows = [...overdue.map((item) => ({ item, timing: "Overdue" })), ...dueToday.map((item) => ({ item, timing: "Due today" })), ...upcoming.map((item) => ({ item, timing: "Coming up" })), ...undated.map((item) => ({ item, timing: "No date" }))];

  const completed = admin.followUps.filter((f) => f.status === "Completed");

  return (
    <>
      <PageHeading
        eyebrow="Partnerships"
        title="Follow-ups"
        description="Cultural diplomacy is mostly follow-up. Nothing here should quietly disappear."
      />

      <SummaryStrip items={[{ label: "Open", value: open.length }, { label: "Overdue", value: overdue.length }, { label: "Due today", value: dueToday.length }, { label: "Coming up", value: upcoming.length }, { label: "Completed", value: completed.length }]} />
      <p className="mb-3 text-xs text-muted-foreground">Showing {rows.length} open follow-up{rows.length === 1 ? "" : "s"}</p>
      {open.length ? (
        <Table caption="Follow-ups" head={["Follow-up", "Related record", "Owner", "Due", "Status", "Action"]}>
          {rows.map(({ item: f, timing }) => <tr key={f.id} className="group"><Td><span className="font-semibold">{f.title}</span><span className="block text-xs text-muted-foreground">{f.relatedType}</span></Td><Td><RelatedLink followUp={f} /></Td><Td className="text-xs text-muted-foreground">{f.owner}</Td><Td className="text-xs text-muted-foreground">{dateFmt(f.dueDate)}</Td><Td><StatusIndicator attention={timing === "Overdue"}>{timing}</StatusIndicator></Td><Td><button type="button" className={abtn.quiet} onClick={() => admin.updateFollowUp(f.id, { status: "Completed", completedAt: new Date().toISOString() })}>Mark done</button></Td></tr>)}
        </Table>
      ) : (
        <EmptyState title="No open follow-ups." hint="Follow-ups created from inquiries, partners and collaborations appear here." />
      )}

      {completed.length ? (
        <section className="mt-8 border-t border-border pt-5">
          <h2 className="mb-3 text-[0.7rem] font-semibold tracking-[0.1em] text-clay uppercase">Recently completed</h2>
            <ul className="space-y-1.5 text-sm">
              {completed.slice(-8).reverse().map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-2">
                  <span className="text-ink">{f.title}</span>
                  <span className="text-xs text-muted-foreground">{dateFmt(f.completedAt)}</span>
                </li>
              ))}
            </ul>
        </section>
      ) : null}
    </>
  );
}

function RelatedLink({ followUp }: { followUp: FollowUp }) {
  const label = followUp.relatedLabel;
  if (followUp.relatedType === "Inquiry")
    return (
      <Link to="/admin/inquiries/$id" params={{ id: followUp.relatedId }} className="text-primary underline-offset-4 hover:underline">
        {label}
      </Link>
    );
  if (followUp.relatedType === "Partner")
    return (
      <Link to="/admin/partners/$id" params={{ id: followUp.relatedId }} className="text-primary underline-offset-4 hover:underline">
        {label}
      </Link>
    );
  if (followUp.relatedType === "Collaboration")
    return (
      <Link to="/admin/collaborations/$id" params={{ id: followUp.relatedId }} className="text-primary underline-offset-4 hover:underline">
        {label}
      </Link>
    );
  return (
    <Link to="/admin/content/$id" params={{ id: followUp.relatedId }} className="text-primary underline-offset-4 hover:underline">
      {label}
    </Link>
  );
}
