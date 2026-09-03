import { Link, createFileRoute } from "@tanstack/react-router";

import { WorkspaceShell } from "@/components/contributor/WorkspaceShell";
import {
  btn,
  EmptyState,
  PageHeading,
  StatusBadge,
  relativeTime,
} from "@/components/contributor/primitives";
import { TYPE_CONFIG, type Submission, type SubmissionStatus } from "@/lib/contributor/schema";
import { useWorkspace } from "@/lib/contributor/store";
import { cn } from "@/lib/utils";

interface SubmissionsSearch {
  tab?: string | undefined;
}

export const Route = createFileRoute("/contributor/submissions/")({
  validateSearch: (search: Record<string, unknown>): SubmissionsSearch => ({
    tab: typeof search["tab"] === "string" ? (search["tab"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Submissions — Indonesia Vibes Contributor Workspace" },
      {
        name: "description",
        content: "Every draft, submission and published contribution from your organisation, with its current status.",
      },
      { property: "og:title", content: "Submissions — Indonesia Vibes Contributor Workspace" },
      { property: "og:description", content: "Track drafts, reviews, revisions and published contributions." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SubmissionsPage,
});

const TABS: { id: string; label: string; statuses?: SubmissionStatus[] }[] = [
  { id: "all", label: "All" },
  { id: "draft", label: "Draft", statuses: ["draft"] },
  { id: "submitted", label: "Submitted", statuses: ["submitted"] },
  {
    id: "in-review",
    label: "In review",
    statuses: ["submitted", "initial_review", "editorial_review", "verification", "english_editing"],
  },
  { id: "revision_requested", label: "Needs revision", statuses: ["revision_requested"] },
  { id: "approved", label: "Approved", statuses: ["approved"] },
  { id: "scheduled", label: "Scheduled", statuses: ["scheduled"] },
  { id: "published", label: "Published", statuses: ["published"] },
  { id: "archived", label: "Archived", statuses: ["archived"] },
];

function actionFor(sub: Submission) {
  switch (sub.status) {
    case "draft":
      return { label: "Continue editing", to: "/contributor/submissions/$id/revise" as const };
    case "revision_requested":
      return { label: "Review feedback", to: "/contributor/submissions/$id" as const };
    case "published":
      return { label: "View published page", to: "/contributor/submissions/$id" as const };
    case "approved":
    case "scheduled":
      return { label: "View approval", to: "/contributor/submissions/$id" as const };
    case "submitted":
      return { label: "View submission", to: "/contributor/submissions/$id" as const };
    default:
      return { label: "View status", to: "/contributor/submissions/$id" as const };
  }
}

function SubmissionsPage() {
  const { submissions } = useWorkspace();
  const { tab } = Route.useSearch();
  const active = TABS.find((t) => t.id === tab) ?? TABS[0]!;
  const list = (active.statuses ? submissions.filter((s) => active.statuses!.includes(s.status)) : submissions).sort(
    (a, b) => (a.updatedAt < b.updatedAt ? 1 : -1),
  );

  return (
    <WorkspaceShell>
      <PageHeading
        eyebrow="Submissions"
        title="Your organisation's contributions"
        intro="Everything your team has started, sent, or had published — and what each status means."
        action={
          <Link to="/contributor/new" className={btn.primary}>
            Create new
          </Link>
        }
      />

      <div className="mt-7 -mx-1 overflow-x-auto">
        <ul className="flex min-w-max gap-1 px-1" role="tablist" aria-label="Filter submissions by status">
          {TABS.map((t) => {
            const count = t.statuses ? submissions.filter((s) => t.statuses!.includes(s.status)).length : submissions.length;
            const isActive = t.id === active.id;
            return (
              <li key={t.id}>
                <Link
                  role="tab"
                  aria-selected={isActive}
                  to="/contributor/submissions"
                  search={t.id === "all" ? {} : { tab: t.id }}
                  className={cn(
                    "inline-flex min-h-9 items-center gap-1.5 rounded-full px-3.5 text-sm transition-colors",
                    isActive
                      ? "bg-ink text-background"
                      : "border border-border text-muted-foreground hover:border-primary hover:text-ink",
                  )}
                >
                  {t.label}
                  <span className={cn("text-xs", isActive ? "opacity-70" : "text-muted-foreground")}>{count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <h2 className="sr-only">{active.label} submissions</h2>

      <div className="mt-6">
        {list.length === 0 ? (
          <EmptyState
            title={active.id === "draft" ? "No drafts waiting here." : "Nothing in this view yet."}
            body={
              active.id === "all"
                ? "You haven't submitted anything yet."
                : "As your contributions move through review, they will appear under the matching tab."
            }
            action={
              active.id === "all" || active.id === "draft" ? (
                <Link to="/contributor/new" className={btn.primary}>
                  Create your first submission
                </Link>
              ) : null
            }
          />
        ) : (
          <ul className="space-y-3">
            {list.map((sub) => {
              const action = actionFor(sub);
              return (
                <li
                  key={sub.id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to="/contributor/submissions/$id"
                        params={{ id: sub.id }}
                        className="text-sm font-semibold tracking-tight text-ink hover:text-primary"
                      >
                        {sub.title}
                      </Link>
                      <StatusBadge status={sub.status} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {TYPE_CONFIG[sub.type].label} · {sub.submittedBy} · updated {relativeTime(sub.updatedAt)}
                    </p>
                  </div>
                  <Link to={action.to} params={{ id: sub.id }} className={btn.quiet}>
                    {action.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </WorkspaceShell>
  );
}
