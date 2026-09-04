import { Link, createFileRoute } from "@tanstack/react-router";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import {
  blockedForPublication,
  contentSourceIssues,
  dueTodayFollowUps,
  inquiriesNeedingRouting,
  isInReview,
  overdueFollowUps,
  rightsIssues,
  staleContent,
} from "@/lib/admin/selectors";
import { CONTENT_STATUS, daysUntil, type ContentItem } from "@/lib/admin/types";
import { Card, EmptyState, PageHeading, StatusPill, Tag, abtn, dateFmt, relative, timeFmt } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/")({
  head: adminHead("Overview", "What needs attention across editorial and partnership work today."),
  component: OverviewPage,
});

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/** Compact, actionable card — never a giant statistic. */
function AttentionCard({
  count,
  label,
  hint,
  to,
  params,
  search,
}: {
  count: number;
  label: string;
  hint: string;
  to: string;
  params?: Record<string, string>;
  search?: Record<string, string>;
}) {
  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      to={to as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      params={params as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      search={search as any}
      className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50"
    >
      <span className="text-lg font-semibold tabular-nums text-ink">{count}</span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink">{label}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>
      </span>
    </Link>
  );
}

function ContentRow({ item }: { item: ContentItem }) {
  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border py-2 last:border-0">
      <Link to="/admin/content/$id" params={{ id: item.id }} className="text-sm font-medium text-ink underline-offset-4 hover:text-primary hover:underline">
        {item.title}
      </Link>
      <StatusPill status={item.status} />
      <span className="text-xs text-muted-foreground">
        {item.assignedTo ?? "Unassigned"} · in this stage {relative(item.stageSince)}
      </span>
    </li>
  );
}

function OverviewPage() {
  const admin = useAdmin();
  const { content, inquiries, followUps, media, sources, claims, activity, user, role } = admin;

  const inReview = content.filter(isInReview);
  const awaitingReview = content.filter((c) => c.status === "submitted" || c.status === "initial_review");
  const sourceIssues = contentSourceIssues(content, sources, claims);
  const unresolvedClaims = sourceIssues.flatMap((i) => i.unsupported);
  const rights = rightsIssues(media);
  const routing = inquiriesNeedingRouting(inquiries);
  const overdue = overdueFollowUps(followUps);
  const dueToday = dueTodayFollowUps(followUps);
  const scheduled = content.filter((c) => c.status === "scheduled");
  const revisionsReturned = content.filter((c) => c.status === "revision_requested");
  const stale = staleContent(content);

  const closingSoon = content.filter(
    (c) => c.kind === "opportunity" && c.status === "published" && c.fields["deadline"] && daysUntil(c.fields["deadline"]!) >= 0 && daysUntil(c.fields["deadline"]!) <= 7,
  );

  const todayEvents = content.filter((c) => {
    if (c.kind !== "event") return false;
    const dates = c.fields["dates"] ?? "";
    const [start] = dates.split("–").map((s) => s.trim());
    return start ? daysUntil(start) >= 0 && daysUntil(start) <= 7 : false;
  });

  /* Role-based ordering: each role sees its own work first. */
  const partnershipFirst = role === "Partnership Officer";
  const languageFirst = role === "English Editor";
  const leadership = role === "Viewer / Leadership";

  const attention = [
    ...(languageFirst
      ? [
          {
            count: content.filter((c) => c.status === "english_editing").length,
            label: "language reviews waiting",
            hint: "Content held for international readability",
            to: "/admin/review",
          },
        ]
      : []),
    ...(partnershipFirst
      ? [
          { count: routing.length, label: "inquiries need routing", hint: "New or qualified and waiting for a partner", to: "/admin/inquiries" },
          { count: overdue.length, label: "partner follow-ups overdue", hint: "Past their due date", to: "/admin/follow-ups" },
        ]
      : []),
    { count: awaitingReview.length, label: "submissions awaiting editorial review", hint: "Arrived from the Contributor Workspace", to: "/admin/submissions" },
    { count: unresolvedClaims.length, label: "claims waiting for source verification", hint: "Flagged by an editor as requiring evidence", to: "/admin/sources" },
    { count: rights.length, label: "media assets missing usage rights", hint: "Publication is blocked while rights are unresolved", to: "/admin/media" },
    ...(partnershipFirst
      ? []
      : [
          { count: routing.length, label: "inquiries need routing", hint: "New or qualified and waiting for a partner", to: "/admin/inquiries" },
          { count: overdue.length, label: "partner follow-ups overdue", hint: "Past their due date", to: "/admin/follow-ups" },
        ]),
    { count: closingSoon.length, label: "opportunities close this week", hint: "Check the official source before the deadline", to: "/admin/opportunities" },
    { count: stale.length, label: "published records overdue for review", hint: "Sent to the review queue, never unpublished automatically", to: "/admin/review" },
  ].filter((a) => a.count > 0);

  return (
    <>
      <PageHeading
        eyebrow={user.role}
        title={`${greeting()}, ${user.name.split(" ")[0]}.`}
        description={
          leadership
            ? "A read-only view of publication status, inquiries and the collaboration pipeline."
            : "Here is what is waiting on the team today."
        }
        actions={
          <Link to="/admin/review" className={abtn.secondary}>
            Open review queue
          </Link>
        }
      />

      <section aria-labelledby="attention" className="mb-8">
        <h2 id="attention" className="mb-3 text-[0.68rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          What needs attention
        </h2>
        {attention.length ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {attention.map((a) => (
              <AttentionCard key={a.label} {...a} />
            ))}
          </div>
        ) : (
          <EmptyState title="Nothing is waiting on the team right now." hint="New submissions and inquiries will appear here." />
        )}
      </section>

      <section aria-labelledby="today" className="mb-8">
        <h2 id="today" className="mb-3 text-[0.68rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          Today
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card title="Editorial">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Content awaiting review</dt>
                <dd className="tabular-nums text-ink">{inReview.length}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Scheduled publications</dt>
                <dd className="tabular-nums text-ink">{scheduled.length}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Revisions with contributors</dt>
                <dd className="tabular-nums text-ink">{revisionsReturned.length}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Reviews overdue</dt>
                <dd className="tabular-nums text-ink">{stale.length}</dd>
              </div>
            </dl>
            {scheduled.length ? (
              <ul className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                {scheduled.map((s) => (
                  <li key={s.id}>
                    {s.title} — {dateFmt(s.scheduledFor)} {timeFmt(s.scheduledFor)} {s.scheduleTimeZone ?? ""}
                  </li>
                ))}
              </ul>
            ) : null}
          </Card>

          <Card title="Partnership">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">New inquiries</dt>
                <dd className="tabular-nums text-ink">{inquiries.filter((q) => q.status === "New").length}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Introductions awaiting follow-up</dt>
                <dd className="tabular-nums text-ink">
                  {inquiries.filter((q) => q.introductions.some((i) => !i.outcome)).length}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Follow-ups due today</dt>
                <dd className="tabular-nums text-ink">{dueToday.length}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Collaborations needing an update</dt>
                <dd className="tabular-nums text-ink">{admin.pipeline.filter((c) => c.nextActions.length).length}</dd>
              </div>
            </dl>
          </Card>

          <Card title="Global agenda">
            <ul className="space-y-2 text-sm">
              {todayEvents.length ? (
                todayEvents.map((e) => (
                  <li key={e.id} className="flex flex-wrap items-center gap-2">
                    <Link to="/admin/content/$id" params={{ id: e.id }} className="text-ink underline-offset-4 hover:text-primary hover:underline">
                      {e.title}
                    </Link>
                    <Tag tone="quiet">{e.location ?? e.countries.join(", ")}</Tag>
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground">No events begin in the next week.</li>
              )}
            </ul>
            {closingSoon.length ? (
              <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                {closingSoon.length} opportunity deadline{closingSoon.length === 1 ? "" : "s"} within seven days.
              </p>
            ) : null}
          </Card>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Waiting on you" description={`Filtered for ${user.role.toLowerCase()}`}>
          {(() => {
            const mine = inReview.filter(
              (c) =>
                c.assignedTo === user.name ||
                (role === "Researcher / Fact Checker" && c.status === "verification") ||
                (role === "Subject Reviewer" && c.status === "subject_review") ||
                (role === "English Editor" && c.status === "english_editing") ||
                (role === "Multimedia Editor" && c.status === "media_rights") ||
                (role === "Managing Editor" && c.status === "ready_for_approval"),
            );
            return mine.length ? (
              <ul>
                {mine.slice(0, 6).map((item) => (
                  <ContentRow key={item.id} item={item} />
                ))}
              </ul>
            ) : (
              <EmptyState title="Nothing is assigned to you." hint="Items appear here when an editor assigns them or a stage matches your role." />
            );
          })()}
        </Card>

        <Card title="Recent activity" action={<Link to="/admin/activity" className={abtn.quiet}>Full log</Link>}>
          <ul className="space-y-2.5">
            {activity
              .filter((a) => !a.sensitive)
              .slice(0, 7)
              .map((entry) => (
                <li key={entry.id} className="flex gap-3 text-sm">
                  <span className="w-20 shrink-0 text-xs text-muted-foreground">
                    {relative(entry.date) === "today" ? timeFmt(entry.date) : relative(entry.date)}
                  </span>
                  <span className="text-ink">
                    {entry.actor} {entry.action}
                    {entry.recordTitle ? ` — “${entry.recordTitle}”` : ""}.
                  </span>
                </li>
              ))}
          </ul>
        </Card>
      </div>

      <p className="mt-6 text-[0.7rem] text-muted-foreground">
        Prototype workspace. Statuses such as “{CONTENT_STATUS.ready_for_approval.label}” behave exactly as they would in
        production, but no content is transmitted outside this browser.
      </p>
    </>
  );
}
