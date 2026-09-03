import { Link, createFileRoute } from "@tanstack/react-router";

import { SubmissionForm } from "@/components/contributor/SubmissionForm";
import { WorkspaceShell } from "@/components/contributor/WorkspaceShell";
import { btn, EmptyState, PageHeading, Panel } from "@/components/contributor/primitives";
import { TYPE_CONFIG } from "@/lib/contributor/schema";
import { useWorkspace } from "@/lib/contributor/store";

export const Route = createFileRoute("/contributor/submissions/$id/revise")({
  head: () => ({
    meta: [
      { title: "Edit submission — Indonesia Vibes Contributor Workspace" },
      { name: "description", content: "Continue a draft or respond to editorial feedback on your submission." },
      { property: "og:title", content: "Edit submission — Indonesia Vibes Contributor Workspace" },
      { property: "og:description", content: "Continue a draft or respond to editorial feedback." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RevisePage,
});

function RevisePage() {
  const { id } = Route.useParams();
  const { getSubmission, resolveFeedback, hydrated } = useWorkspace();
  const submission = getSubmission(id);

  if (!hydrated) {
    return (
      <WorkspaceShell>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </WorkspaceShell>
    );
  }

  if (!submission) {
    return (
      <WorkspaceShell>
        <EmptyState
          title="We couldn't find that submission."
          body="It may have been removed, or the link may be out of date."
          action={
            <Link to="/contributor/submissions" search={{}} className={btn.primary}>
              Back to submissions
            </Link>
          }
        />
      </WorkspaceShell>
    );
  }

  const revision = submission.status === "revision_requested";
  const open = submission.feedback.filter((f) => !f.resolved);
  const firstStep = open[0]?.stepId;

  return (
    <WorkspaceShell>
      <PageHeading
        eyebrow={`${TYPE_CONFIG[submission.type].label} · ${revision ? "Revision" : "Draft"}`}
        title={submission.title}
        intro={
          revision
            ? "The fields our editors asked about are marked as you go. Everything else stays editable."
            : "Everything saves as you type. You can leave and come back at any point."
        }
        action={
          <Link to="/contributor/submissions/$id" params={{ id }} className={btn.secondary}>
            Submission status
          </Link>
        }
      />

      {revision && submission.feedback.length > 0 ? (
        <div className="mt-7">
          <Panel
            title={`${submission.feedback.length} requested update${submission.feedback.length === 1 ? "" : "s"}`}
            description="Tick each one off as you address it. This checklist is for you — our editors re-read the whole submission."
          >
            <ul className="space-y-2">
              {submission.feedback.map((f) => (
                <li key={f.id}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3">
                    <input
                      type="checkbox"
                      checked={Boolean(f.resolved)}
                      onChange={(e) => resolveFeedback(submission.id, f.id, e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-[oklch(0.5705_0.2242_31.05)]"
                    />
                    <span>
                      <span className="block text-sm font-medium text-ink">{f.section}</span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">{f.note}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      ) : null}

      <div className="mt-8">
        <SubmissionForm
          submission={submission}
          revision={revision}
          {...(firstStep ? { initialStepId: firstStep } : {})}
        />
      </div>
    </WorkspaceShell>
  );
}
