import { Link, createFileRoute } from "@tanstack/react-router";
import { Check, FileText, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

import { WorkspaceShell } from "@/components/contributor/WorkspaceShell";
import {
  btn,
  EmptyState,
  formatDate,
  inputClass,
  Meter,
  PageHeading,
  Panel,
  PrototypeNote,
  StatusBadge,
} from "@/components/contributor/primitives";
import {
  completeness,
  STATUSES,
  stepsFor,
  TIMELINE_STAGES,
  TYPE_CONFIG,
  visibleFields,
} from "@/lib/contributor/schema";
import { useWorkspace } from "@/lib/contributor/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contributor/submissions/$id/")({
  head: () => ({
    meta: [
      { title: "Submission status — Indonesia Vibes Contributor Workspace" },
      {
        name: "description",
        content: "Where your submission stands, what our editors have asked for, and the full activity history.",
      },
      { property: "og:title", content: "Submission status — Indonesia Vibes Contributor Workspace" },
      { property: "og:description", content: "Status, editorial feedback and activity history for your submission." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SubmissionDetail,
});

function Timeline({ status }: { status: keyof typeof STATUSES }) {
  const currentIndex = TIMELINE_STAGES.findIndex((s) => s.statuses.includes(status));
  const published = status === "published";
  return (
    <ol className="space-y-0">
      {TIMELINE_STAGES.map((stage, i) => {
        const state =
          published || (currentIndex >= 0 && i < currentIndex)
            ? "done"
            : i === currentIndex
              ? "current"
              : "todo";
        return (
          <li key={stage.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border text-[0.65rem]",
                  state === "done"
                    ? "border-primary bg-primary text-primary-foreground"
                    : state === "current"
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground",
                )}
              >
                {state === "done" ? <Check className="h-3 w-3" aria-hidden /> : i + 1}
              </span>
              {i < TIMELINE_STAGES.length - 1 ? (
                <span className={cn("w-px flex-1", state === "done" ? "bg-primary" : "bg-border")} />
              ) : null}
            </div>
            <div className="pb-5">
              <p
                className={cn(
                  "text-sm",
                  state === "current" ? "font-semibold text-ink" : "text-muted-foreground",
                )}
              >
                {stage.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {state === "done" ? "Completed" : state === "current" ? "Current stage" : "Not started"}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function SubmissionDetail() {
  const { id } = Route.useParams();
  const { getSubmission, hydrated, suggestUpdate } = useWorkspace();
  const submission = getSubmission(id);
  const [updateKind, setUpdateKind] = useState("Correction");
  const [updateDetail, setUpdateDetail] = useState("");
  const [updateSent, setUpdateSent] = useState(false);

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
          action={
            <Link to="/contributor/submissions" search={{}} className={btn.primary}>
              Back to submissions
            </Link>
          }
        />
      </WorkspaceShell>
    );
  }

  const meta = STATUSES[submission.status];
  const ready = completeness(submission);
  const steps = stepsFor(submission.type, submission.data);
  const openFeedback = submission.feedback.filter((f) => !f.resolved);

  return (
    <WorkspaceShell>
      <PageHeading
        eyebrow={TYPE_CONFIG[submission.type].label}
        title={submission.title}
        intro={meta.meaning}
        action={
          submission.status === "draft" ? (
            <Link to="/contributor/submissions/$id/revise" params={{ id }} className={btn.primary}>
              Continue editing
            </Link>
          ) : submission.status === "revision_requested" ? (
            <Link to="/contributor/submissions/$id/revise" params={{ id }} className={btn.primary}>
              Revise submission
            </Link>
          ) : submission.status === "published" ? (
            <a href={submission.publicUrl ?? "/"} className={btn.primary}>
              View on Indonesia Vibes ↗
            </a>
          ) : null
        }
      />

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-border bg-card px-5 py-4 text-xs text-muted-foreground">
        <StatusBadge status={submission.status} />
        <span>Submitted by {submission.submittedBy}</span>
        <span>Created {formatDate(submission.createdAt)}</span>
        <span>Last updated {formatDate(submission.updatedAt)}</span>
        {submission.currentEditor ? <span>With {submission.currentEditor}</span> : null}
        {submission.publishedAt ? <span>Published {formatDate(submission.publishedAt)}</span> : null}
      </div>

      {openFeedback.length > 0 ? (
        <section className="mt-6 rounded-xl border border-primary/30 bg-blush p-5">
          <h2 className="text-base font-semibold tracking-tight text-clay">Revision requested</h2>
          <p className="mt-1 text-sm leading-relaxed text-clay/80">
            Our editorial team needs a few updates before this submission can continue.
          </p>
          <ul className="mt-4 space-y-3">
            {openFeedback.map((f) => (
              <li key={f.id} className="rounded-lg bg-background p-4">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{f.section}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink">{f.note}</p>
                <Link
                  to="/contributor/submissions/$id/revise"
                  params={{ id }}
                  className="mt-2 inline-block text-xs font-medium text-primary underline underline-offset-4"
                >
                  Go to this section
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/contributor/submissions/$id/revise" params={{ id }} className={`${btn.primary} mt-5`}>
            Revise submission
          </Link>
        </section>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Panel title="Submission preview" description="A simplified view of what you sent us.">
            {Object.keys(submission.data).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing filled in yet. Open the form to start this submission.
              </p>
            ) : null}
            <div className="space-y-6">
              {steps
                .filter((s) => s.id !== "review")
                .map((s) => {
                  const fields = visibleFields(s, submission.data).filter(
                    (f) => f.type !== "media" && f.type !== "sources" && submission.data[f.name],
                  );
                  if (fields.length === 0) return null;
                  return (
                    <div key={s.id}>
                      <h3 className="border-b border-border pb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        {s.index} · {s.title}
                      </h3>
                      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                        {fields.map((f) => {
                          const v = submission.data[f.name];
                          return (
                            <div key={f.name}>
                              <dt className="text-xs text-muted-foreground">{f.label}</dt>
                              <dd className="mt-0.5 text-sm break-words text-ink">
                                {Array.isArray(v) ? v.join(", ") : v === true ? "Confirmed" : String(v)}
                              </dd>
                            </div>
                          );
                        })}
                      </dl>
                    </div>
                  );
                })}
            </div>
          </Panel>

          <Panel title="Files">
            {submission.media.length === 0 ? (
              <EmptyState title="No files attached." />
            ) : (
              <ul className="space-y-3">
                {submission.media.map((m) => (
                  <li key={m.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                    {m.kind === "image" && m.url ? (
                      <img src={m.url} alt="" className="h-14 w-14 rounded object-cover" />
                    ) : (
                      <span className="flex h-14 w-14 items-center justify-center rounded bg-sand text-muted-foreground">
                        {m.kind === "image" ? (
                          <ImageIcon className="h-5 w-5" aria-hidden />
                        ) : (
                          <FileText className="h-5 w-5" aria-hidden />
                        )}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">{m.title}</p>
                      <p className="text-xs text-muted-foreground">{m.caption}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {m.credit ? `${m.credit} · ` : ""}
                        {m.permission || "Rights status still needed"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Sources">
            {submission.sources.length === 0 ? (
              <EmptyState title="No sources yet." body="Sources help our editors verify claims quickly." />
            ) : (
              <ul className="space-y-3">
                {submission.sources.map((s) => (
                  <li key={s.id} className="border-l-2 border-border pl-3">
                    <p className="text-sm text-ink">{s.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {[s.author, s.year, s.publisher, s.type].filter(Boolean).join(" · ")}
                    </p>
                    {s.url ? (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-xs text-primary underline underline-offset-4"
                      >
                        Open source ↗
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {submission.status === "published" ? (
            <Panel
              title="Suggest an update"
              description="Published pages are edited by our team. Send a change here and an editor will apply it."
            >
              {updateSent ? (
                <p className="rounded-md bg-blush px-4 py-3 text-sm text-clay">
                  Thank you — your update request is with the editorial team.
                </p>
              ) : (
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!updateDetail.trim()) return;
                    suggestUpdate(submission.id, updateKind, updateDetail.trim());
                    setUpdateDetail("");
                    setUpdateSent(true);
                  }}
                >
                  <div>
                    <label htmlFor="update-kind" className="mb-1.5 block text-sm font-medium text-ink">
                      What kind of update?
                    </label>
                    <select
                      id="update-kind"
                      className={inputClass}
                      value={updateKind}
                      onChange={(e) => setUpdateKind(e.target.value)}
                    >
                      {[
                        "Correction",
                        "Updated event information",
                        "New programme",
                        "New image",
                        "Changed website",
                        "Changed institution information",
                      ].map((k) => (
                        <option key={k}>{k}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="update-detail" className="mb-1.5 block text-sm font-medium text-ink">
                      What should change?
                    </label>
                    <textarea
                      id="update-detail"
                      rows={4}
                      required
                      className={inputClass}
                      value={updateDetail}
                      onChange={(e) => setUpdateDetail(e.target.value)}
                    />
                  </div>
                  <button type="submit" className={btn.primary}>
                    Send update request
                  </button>
                </form>
              )}
              {submission.updates && submission.updates.length > 0 ? (
                <ul className="mt-5 space-y-2 border-t border-border pt-4">
                  {submission.updates.map((u) => (
                    <li key={u.id} className="text-sm">
                      <span className="text-ink">{u.kind}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {formatDate(u.createdAt)} · {u.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Panel>
          ) : null}
        </div>

        <div className="space-y-6">
          <Panel title="Where it stands">
            <Timeline status={submission.status} />
            <p className="mt-2 rounded-md bg-sand px-3 py-2 text-xs leading-relaxed text-muted-foreground">
              {meta.meaning}
            </p>
          </Panel>

          {submission.status === "draft" ? (
            <Panel title="Readiness">
              <Meter percent={ready.percent} />
              {ready.missing.length > 0 ? (
                <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                  {ready.missing.slice(0, 5).map((m) => (
                    <li key={m.label}>· {m.label}</li>
                  ))}
                </ul>
              ) : null}
            </Panel>
          ) : null}

          <Panel title="Activity history">
            <ol className="space-y-4">
              {[...submission.activity].reverse().map((a) => (
                <li key={a.id}>
                  <p className="text-xs text-muted-foreground">{formatDate(a.date)}</p>
                  <p className="text-sm text-ink">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.by}</p>
                </li>
              ))}
            </ol>
          </Panel>

          {submission.prototype ? (
            <PrototypeNote>Prototype record, used to demonstrate this workflow state.</PrototypeNote>
          ) : null}
        </div>
      </div>
    </WorkspaceShell>
  );
}
