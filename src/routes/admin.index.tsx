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

/** One flat row in the attention list — never a KPI tile. */
function AttentionRow({
  count,
  label,
  hint,
  to,
  cta,
}: {
  count: number;
  label: string;
  hint: string;
  to: string;
  cta: string;
}) {
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border/70 py-3 last:border-0">
      <span className="w-8 shrink-0 text-base font-semibold tabular-nums text-ink">{count}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm text-ink">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
      <Link
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        to={to as any}
        className="text-xs font-medium text-primary underline-offset-4 hover:underline"
      >
        {cta} →
      </Link>
    </li>
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
            to: "/admin/review", cta: "Review",
          },
        ]
      : []),
    ...(partnershipFirst
      ? [
          { count: routing.length, label: "inquiries need routing", hint: "New or qualified and waiting for a partner", to: "/admin/inquiries", cta: "Route" },
          { count: overdue.length, label: "partner follow-ups overdue", hint: "Past their due date", to: "/admin/follow-ups", cta: "View" },
        ]
      : []),
    { count: awaitingReview.length, label: "submissions awaiting editorial review", hint: "Arrived from the Contributor Workspace", to: "/admin/submissions", cta: "Review" },
    { count: unresolvedClaims.length, label: "claims waiting for source verification", hint: "Flagged by an editor as requiring evidence", to: "/admin/sources", cta: "Verify" },
    { count: rights.length, label: "media assets missing usage rights", hint: "Publication is blocked while rights are unresolved", to: "/admin/media", cta: "Resolve" },
    ...(partnershipFirst
      ? []
      : [
          { count: routing.length, label: "inquiries need routing", hint: "New or qualified and waiting for a partner", to: "/admin/inquiries", cta: "Route" },
          { count: overdue.length, label: "partner follow-ups overdue", hint: "Past their due date", to: "/admin/follow-ups", cta: "View" },
        ]),
    { count: closingSoon.length, label: "opportunities close this week", hint: "Check the official source before the deadline", to: "/admin/opportunities", cta: "View" },
    { count: stale.length, label: "published records overdue for review", hint: "Sent to the review queue, never unpublished automatically", to: "/admin/review", cta: "Review" },
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
        <h2 id="attention" className="mb-1 border-b border-border pb-2 text-[0.68rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Needs attention
        </h2>
        {attention.length ? (
          <ul>
            {attention.map((a) => (
              <AttentionRow key={a.label} {...a} />
            ))}
          </ul>
        ) : (
          <EmptyState title="Nothing is waiting on the team right now." hint="New submissions and inquiries will appear here." />
        )}
      </section>

      <section aria-labelledby="today" className="mb-8">
        <h2 id="today" className="mb-3 border-b border-border pb-2 text-[0.68rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Coming up
        </h2>
        <ul className="mb-4">
          {scheduled.map((item) => (
            <li key={item.id} className="flex flex-wrap items-baseline gap-x-4 border-b border-border/70 py-2.5 last:border-0">
              <span className="w-24 shrink-0 text-xs text-muted-foreground">{dateFmt(item.scheduledFor)}</span>
              <Link to="/admin/content/$id" params={{ id: item.id }} className="text-sm text-ink underline-offset-4 hover:text-primary hover:underline">
                {item.title}
              </Link>
              <span className="text-xs text-muted-foreground">
                Publication · {timeFmt(item.scheduledFor)} {item.scheduleTimeZone ?? ""}
              </span>
            </li>
          ))}
          {todayEvents.map((item) => (
            <li key={item.id} className="flex flex-wrap items-baseline gap-x-4 border-b border-border/70 py-2.5 last:border-0">
              <span className="w-24 shrink-0 text-xs text-muted-foreground">{item.fields["dates"] ?? "Date to confirm"}</span>
              <Link to="/admin/content/$id" params={{ id: item.id }} className="text-sm text-ink underline-offset-4 hover:text-primary hover:underline">
                {item.title}
              </Link>
              <span className="text-xs text-muted-foreground">Event · {item.location ?? item.countries.join(", ")}</span>
            </li>
          ))}
          {closingSoon.map((item) => (
            <li key={item.id} className="flex flex-wrap items-baseline gap-x-4 border-b border-border/70 py-2.5 last:border-0">
              <span className="w-24 shrink-0 text-xs text-muted-foreground">{item.fields["deadline"]}</span>
              <Link to="/admin/content/$id" params={{ id: item.id }} className="text-sm text-ink underline-offset-4 hover:text-primary hover:underline">
                {item.title}
              </Link>
              <span className="text-xs text-muted-foreground">Opportunity deadline</span>
            </li>
          ))}
          {!scheduled.length && !todayEvents.length && !closingSoon.length ? (
            <li className="py-3 text-sm text-muted-foreground">Nothing is scheduled in the next week.</li>
          ) : null}
        </ul>

        <dl className="flex flex-wrap gap-x-8 gap-y-2 border-t border-border pt-3 text-xs">
          {[
            { label: "In review", value: inReview.length },
            { label: "Scheduled", value: scheduled.length },
            { label: "With contributors", value: revisionsReturned.length },
            { label: "New inquiries", value: inquiries.filter((q) => q.status === "New").length },
            { label: "Follow-ups due today", value: dueToday.length },
            { label: "Reviews overdue", value: stale.length },
          ].map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-1.5">
              <dt className="text-muted-foreground">{stat.label}</dt>
              <dd className="font-semibold tabular-nums text-ink">{stat.value}</dd>
            </div>
          ))}
        </dl>
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
