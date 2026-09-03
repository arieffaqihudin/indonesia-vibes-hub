import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { WorkspaceShell } from "@/components/contributor/WorkspaceShell";
import {
  btn,
  EmptyState,
  formatDate,
  Panel,
  PageHeading,
  PrototypeNote,
  StatusBadge,
  relativeTime,
} from "@/components/contributor/primitives";
import { STATUSES, SUBMISSION_TYPES, TYPE_CONFIG, type SubmissionStatus } from "@/lib/contributor/schema";
import { useWorkspace } from "@/lib/contributor/store";

export const Route = createFileRoute("/contributor/")({
  head: () => ({
    meta: [
      { title: "Overview — Indonesia Vibes Contributor Workspace" },
      {
        name: "description",
        content:
          "Everything happening with your Indonesia Vibes contributions: what needs your attention, what is in review, and what has been published.",
      },
      { property: "og:title", content: "Overview — Indonesia Vibes Contributor Workspace" },
      { property: "og:description", content: "Track your contributions through editorial review to publication." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OverviewPage,
});

const SUMMARY: { label: string; statuses: SubmissionStatus[]; tab: string }[] = [
  { label: "Drafts", statuses: ["draft"], tab: "draft" },
  {
    label: "In review",
    statuses: ["submitted", "initial_review", "editorial_review", "verification", "english_editing"],
    tab: "in-review",
  },
  { label: "Needs revision", statuses: ["revision_requested"], tab: "revision_requested" },
  { label: "Approved", statuses: ["approved", "scheduled"], tab: "approved" },
  { label: "Published", statuses: ["published"], tab: "published" },
];

function OverviewPage() {
  const { user, submissions } = useWorkspace();
  const needsAction = submissions.filter((s) => STATUSES[s.status].actionNeeded);
  const recent = [...submissions]
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 5);
  const published = submissions.filter((s) => s.status === "published");

  return (
    <WorkspaceShell>
      <PageHeading
        eyebrow="Contributor workspace"
        title={`Welcome back, ${user?.name?.split(" ")[0] ?? "there"}.`}
        intro="Here is what is happening with your Indonesia Vibes contributions."
        action={
          <Link to="/contributor/new" className={btn.primary}>
            Start something new
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        }
      />

      <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {SUMMARY.map((s) => {
          const count = submissions.filter((sub) => s.statuses.includes(sub.status)).length;
          return (
            <Link
              key={s.label}
              to="/contributor/submissions"
              search={{ tab: s.tab }}
              className="rounded-xl border border-border bg-card px-4 py-4 transition-colors hover:border-primary"
            >
              <p className="text-2xl font-semibold tracking-tight text-ink">{count}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Panel title="Action needed" description="Submissions waiting on you.">
            {needsAction.length === 0 ? (
              <EmptyState title="You're all caught up." body="Nothing needs your attention right now." />
            ) : (
              <ul className="space-y-4">
                {needsAction.map((sub) => (
                  <li key={sub.id} className="rounded-lg border border-border bg-sand p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={sub.status} />
                      <span className="text-xs text-muted-foreground">
                        {TYPE_CONFIG[sub.type].label}
                        {sub.dueDate ? ` · please respond by ${formatDate(sub.dueDate)}` : ""}
                      </span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold tracking-tight text-ink">{sub.title}</h3>
                    {sub.feedback[0] ? (
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        <span className="font-medium text-clay">{sub.feedback[0].section}:</span>{" "}
                        {sub.feedback[0].note}
                      </p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        to="/contributor/submissions/$id/revise"
                        params={{ id: sub.id }}
                        className={btn.quiet}
                      >
                        Resume revision
                      </Link>
                      <Link
                        to="/contributor/submissions/$id"
                        params={{ id: sub.id }}
                        className="self-center text-xs text-muted-foreground underline underline-offset-4 hover:text-primary"
                      >
                        See all feedback
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel
            title="Recent submissions"
            action={
              <Link
                to="/contributor/submissions"
                search={{}}
                className="text-xs text-primary underline underline-offset-4"
              >
                View all
              </Link>
            }
          >
            {recent.length === 0 ? (
              <EmptyState
                title="You haven't submitted anything yet."
                body="Your first contribution starts with a single form."
                action={
                  <Link to="/contributor/new" className={btn.primary}>
                    Create your first submission
                  </Link>
                }
              />
            ) : (
              <ul className="divide-y divide-border">
                {recent.map((sub) => (
                  <li key={sub.id}>
                    <Link
                      to="/contributor/submissions/$id"
                      params={{ id: sub.id }}
                      className="flex flex-wrap items-center gap-3 py-3 transition-colors hover:text-primary"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-ink">{sub.title}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {TYPE_CONFIG[sub.type].label} · updated {relativeTime(sub.updatedAt)} · {sub.submittedBy}
                        </span>
                      </span>
                      <StatusBadge status={sub.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Recently published">
            {published.length === 0 ? (
              <EmptyState title="Nothing published yet." body="Approved contributions appear here once they go live." />
            ) : (
              <ul className="space-y-4">
                {published.map((sub) => (
                  <li key={sub.id}>
                    <p className="text-sm font-medium text-ink">{sub.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Published {formatDate(sub.publishedAt)}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <a
                        href={sub.publicUrl ?? "/"}
                        className="text-xs font-medium text-primary underline underline-offset-4"
                      >
                        View published page ↗
                      </a>
                      <Link
                        to="/contributor/submissions/$id"
                        params={{ id: sub.id }}
                        className="text-xs text-muted-foreground underline underline-offset-4 hover:text-primary"
                      >
                        Suggest an update
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Start something new">
            <ul className="space-y-2">
              {SUBMISSION_TYPES.map((t) => (
                <li key={t.type}>
                  <Link
                    to="/contributor/submissions/new/$type"
                    params={{ type: t.type }}
                    className="flex items-center justify-between rounded-md border border-border px-3 py-2.5 text-sm text-ink transition-colors hover:border-primary hover:text-primary"
                  >
                    {t.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>

          <PrototypeNote>
            This workspace is a prototype. The submissions shown are sample records used to
            demonstrate every stage of the editorial workflow.
          </PrototypeNote>
        </div>
      </div>
    </WorkspaceShell>
  );
}
