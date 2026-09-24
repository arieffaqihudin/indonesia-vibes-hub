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
import { daysUntil } from "@/lib/admin/types";
import { stories } from "@/data/content";
import { useHomepageSettings } from "@/lib/homepage";
import { EmptyState, PageHeading, abtn, dateFmt, relative, timeFmt } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/")({
  head: adminHead("Dashboard", "What needs attention across editorial and partnership work today."),
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

function OverviewPage() {
  const admin = useAdmin();
  const [homepage] = useHomepageSettings(stories.map((item) => item.id));
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

  const articles = content.filter((c) => c.kind === "story");
  const publishedArticles = articles.filter((c) => c.status === "published");

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
    { count: homepage.hero.length ? 0 : 1, label: "homepage Hero has no article", hint: "Choose one to five published articles", to: "/admin/homepage/hero", cta: "Manage" },
    { count: stale.length, label: "published records overdue for review", hint: "Sent to the review queue, never unpublished automatically", to: "/admin/review", cta: "Review" },
  ].filter((a) => a.count > 0);

  return (
    <>
      <PageHeading
        eyebrow="Dashboard"
        title="Dashboard"
        description={
          leadership
            ? "A read-only view of publication status, inquiries and the collaboration pipeline."
            : `${greeting()}, ${user.name.split(" ")[0]}. Here is what needs attention today.`
        }
        actions={
          <Link to="/admin/review" className={abtn.secondary}>
            Open review queue
          </Link>
        }
      />

      <section aria-label="Content overview" className="mb-9 max-w-5xl border-y border-border">
        <dl className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
          {[
            [articles.length, "Total articles"], [publishedArticles.length, "Published"],
            [inReview.filter((item) => item.kind === "story").length, "In review"], [`${homepage.hero.length}/5`, "Homepage Hero"],
          ].map(([value, label]) => <div key={label} className="px-4 py-4"><dd className="text-xl font-semibold text-ink">{value}</dd><dt className="mt-1 text-xs text-muted-foreground">{label}</dt></div>)}
        </dl>
      </section>

      <section aria-labelledby="attention" className="mb-9 max-w-5xl">
        <h2 id="attention" className="border-b border-border pb-2 text-[0.68rem] font-semibold tracking-[0.12em] text-clay uppercase">
          Needs your attention
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

      <section aria-labelledby="today" className="mb-9 max-w-5xl">
        <h2 id="today" className="border-b border-border pb-2 text-[0.68rem] font-semibold tracking-[0.12em] text-clay uppercase">
          Coming up
        </h2>
        <ul>
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
          {!scheduled.length && !todayEvents.length ? (
            <li className="py-3 text-sm text-muted-foreground">Nothing is scheduled in the next week.</li>
          ) : null}
        </ul>

      </section>

      <section aria-labelledby="activity" className="mb-8 max-w-5xl">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 id="activity" className="text-[0.68rem] font-semibold tracking-[0.12em] text-clay uppercase">Recent activity</h2>
          <Link to="/admin/activity" className={abtn.quiet}>Full log →</Link>
        </div>
          <ul>
            {activity
              .filter((a) => !a.sensitive)
              .slice(0, 7)
              .map((entry) => (
                <li key={entry.id} className="flex gap-4 border-b border-border/70 py-3 text-sm">
                  <span className="w-24 shrink-0 text-xs text-muted-foreground">
                    {relative(entry.date) === "today" ? timeFmt(entry.date) : relative(entry.date)}
                  </span>
                  <span className="text-ink">
                    {entry.actor} {entry.action}
                    {entry.recordTitle ? ` — “${entry.recordTitle}”` : ""}.
                  </span>
                </li>
              ))}
          </ul>
      </section>
    </>
  );
}
