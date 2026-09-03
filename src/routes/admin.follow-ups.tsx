import { Link, createFileRoute } from "@tanstack/react-router";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { dueTodayFollowUps, overdueFollowUps, undatedFollowUps, upcomingFollowUps } from "@/lib/admin/selectors";
import type { FollowUp } from "@/lib/admin/types";
import { Card, EmptyState, PageHeading, abtn, dateFmt } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/follow-ups")({
  head: adminHead("Follow-ups", "Commitments the team has made, grouped by when they are due."),
  component: FollowUps,
});

function FollowUps() {
  const admin = useAdmin();
  const open = admin.followUps.filter((f) => f.status === "Open");
  const groups: { label: string; hint: string; items: FollowUp[] }[] = [
    { label: "Overdue", hint: "Past their date and still open.", items: overdueFollowUps(open) },
    { label: "Due today", hint: "", items: dueTodayFollowUps(open) },
    { label: "Coming up", hint: "Due in the next two weeks.", items: upcomingFollowUps(open) },
    { label: "No date set", hint: "Still worth doing, but nobody has committed to when.", items: undatedFollowUps(open) },
  ];

  const completed = admin.followUps.filter((f) => f.status === "Completed");

  return (
    <>
      <PageHeading
        eyebrow="Partnerships"
        title="Follow-ups"
        description="Cultural diplomacy is mostly follow-up. Nothing here should quietly disappear."
      />

      {open.length ? (
        <div className="space-y-5">
          {groups.map((g) =>
            g.items.length ? (
              <Card key={g.label} title={`${g.label} · ${g.items.length}`} description={g.hint}>
                <ul className="space-y-2">
                  {g.items.map((f) => (
                    <li key={f.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2 last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="text-sm text-ink">{f.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {f.relatedType}: <RelatedLink followUp={f} /> · owner {f.owner}
                          {f.dueDate ? ` · due ${dateFmt(f.dueDate)}` : ""}
                        </p>
                      </div>
                      <button type="button" className={abtn.small} onClick={() => admin.updateFollowUp(f.id, { status: "Completed", completedAt: new Date().toISOString() })}>
                        Mark done<span className="sr-only">: {f.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null,
          )}
        </div>
      ) : (
        <EmptyState title="No open follow-ups." hint="Follow-ups created from inquiries, partners and collaborations appear here." />
      )}

      {completed.length ? (
        <div className="mt-6">
          <Card title="Recently completed">
            <ul className="space-y-1.5 text-sm">
              {completed.slice(-8).reverse().map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-2">
                  <span className="text-ink">{f.title}</span>
                  <span className="text-xs text-muted-foreground">{dateFmt(f.completedAt)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
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
