import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Eye } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  completeness,
  stepsFor,
  validateStep,
  visibleFields,
  type FieldDef,
  type MediaItem,
  type SourceItem,
  type Submission,
} from "@/lib/contributor/schema";
import { useWorkspace } from "@/lib/contributor/store";
import { cn } from "@/lib/utils";
import { FieldControl } from "./FormFields";
import { MediaManager } from "./MediaManager";
import { SourceManager } from "./SourceManager";
import { btn, Meter, Panel, relativeTime } from "./primitives";

function valueLabel(value: unknown) {
  if (value === undefined || value === null || value === "") return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  if (value === true) return "Confirmed";
  if (value === false) return "Not confirmed";
  return String(value);
}

function PublicationPreview({ sub, data, media }: { sub: Submission; data: Record<string, unknown>; media: MediaItem[] }) {
  const hero = media.find((m) => m.kind === "image" && m.url);
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <p className="border-b border-border bg-sand px-4 py-2 text-xs text-muted-foreground">
        Preview only. Final editorial presentation may change, and text is usually edited before publication.
      </p>
      <article className="p-5">
        {hero ? (
          <img src={hero.url} alt={hero.altText ?? ""} className="mb-5 h-48 w-full rounded-md object-cover" />
        ) : null}
        <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-primary uppercase">
          {(data["storyType"] as string) ||
            (data["eventType"] as string) ||
            (data["profileKind"] as string) ||
            sub.type}
        </p>
        <h3 className="mt-2 text-2xl leading-tight font-semibold tracking-tight text-ink">
          {(data["title"] as string) || "Untitled"}
        </h3>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          {(data["summary"] as string) || "No summary yet."}
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          Contributed by {sub.submittedBy}
          {data["geography"] || data["city"] || data["country"]
            ? ` · ${[data["city"], data["country"], data["geography"]].filter(Boolean)[0]}`
            : ""}
        </p>
      </article>
    </div>
  );
}

export function SubmissionForm({
  submission,
  revision = false,
  initialStepId,
}: {
  submission: Submission;
  revision?: boolean;
  initialStepId?: string;
}) {
  const { patchSubmission, submitForReview, savedAt } = useWorkspace();
  const navigate = useNavigate();

  const [data, setData] = useState<Record<string, unknown>>(submission.data);
  const [media, setMedia] = useState<MediaItem[]>(submission.media);
  const [sources, setSources] = useState<SourceItem[]>(submission.sources);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const steps = useMemo(() => stepsFor(submission.type, data), [submission.type, data]);
  const [stepIndex, setStepIndex] = useState(() => {
    const i = steps.findIndex((s) => s.id === initialStepId);
    return i >= 0 ? i : 0;
  });
  const step = steps[Math.min(stepIndex, steps.length - 1)]!;
  const isReview = step.id === "review";
  const topRef = useRef<HTMLDivElement | null>(null);

  const working: Submission = useMemo(
    () => ({ ...submission, data, media, sources }),
    [submission, data, media, sources],
  );
  const ready = completeness(working);

  /** Auto-save: quiet, debounced, no toasts. */
  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(() => {
      patchSubmission(submission.id, {
        data,
        media,
        sources,
        title: (data["title"] as string) || submission.title,
      });
      setDirty(false);
    }, 700);
    return () => clearTimeout(t);
  }, [dirty, data, media, sources, patchSubmission, submission.id, submission.title]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const setField = (name: string, value: unknown) => {
    setData((d) => ({ ...d, [name]: value }));
    setDirty(true);
    setErrors((e) => {
      if (!e[name]) return e;
      const next = { ...e };
      delete next[name];
      return next;
    });
  };

  const flushSave = () => {
    patchSubmission(submission.id, {
      data,
      media,
      sources,
      title: (data["title"] as string) || submission.title,
    });
    setDirty(false);
  };

  const goTo = (i: number) => {
    setStepIndex(Math.max(0, Math.min(steps.length - 1, i)));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const next = () => {
    const found = validateStep(step, working);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      const firstKey = Object.keys(found)[0];
      document.getElementById(`f-${firstKey}`)?.focus();
      return;
    }
    flushSave();
    goTo(stepIndex + 1);
  };

  const submit = () => {
    // Validate every step before the submission leaves the workspace.
    const all: Record<string, string> = {};
    for (const s of steps) Object.assign(all, validateStep(s, working));
    if (Object.keys(all).length > 0) {
      setErrors(all);
      const firstStep = steps.findIndex((s) =>
        visibleFields(s, data).some((f) => all[f.name]),
      );
      if (firstStep >= 0) goTo(firstStep);
      return;
    }
    flushSave();
    submitForReview(submission.id, revision);
    setSubmitted(true);
  };

  const feedbackFields = useMemo(() => {
    if (!revision) return new Set<string>();
    const ids = new Set<string>();
    for (const f of submission.feedback.filter((x) => !x.resolved)) {
      if (!f.stepId) continue;
      const s = steps.find((x) => x.id === f.stepId);
      s?.fields.forEach((field) => ids.add(field.name));
    }
    return ids;
  }, [revision, submission.feedback, steps]);

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-border bg-card p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blush text-primary">
          <Check className="h-5 w-5" aria-hidden />
        </span>
        <h2 className="mt-5 text-xl font-semibold tracking-tight text-ink">
          {revision ? "Your revisions have been sent back to the editorial team." : "Thank you — we have it."}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {revision
            ? "An editor will pick this up again shortly. You can follow its progress on the submission page."
            : "Your submission is with the Indonesia Vibes editorial team. We check completeness and fit first, then read for editorial quality. You will be notified at each stage — nothing is needed from you right now."}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className={btn.primary}
            onClick={() => navigate({ to: "/contributor/submissions/$id", params: { id: submission.id } })}
          >
            View submission status
          </button>
          <button type="button" className={btn.secondary} onClick={() => navigate({ to: "/contributor" })}>
            Back to overview
          </button>
        </div>
      </div>
    );
  }

  const renderField = (field: FieldDef) => {
    if (field.type === "media") {
      return (
        <div key={field.name} className="sm:col-span-2">
          <p className="mb-1.5 text-sm font-medium text-ink">{field.label}</p>
          {field.help ? <p className="mb-3 text-xs text-muted-foreground">{field.help}</p> : null}
          <MediaManager
            value={media}
            onChange={(v) => {
              setMedia(v);
              setDirty(true);
            }}
          />
        </div>
      );
    }
    if (field.type === "sources") {
      return (
        <div key={field.name} className="sm:col-span-2">
          <p className="mb-1.5 text-sm font-medium text-ink">{field.label}</p>
          {field.help ? <p className="mb-3 text-xs text-muted-foreground">{field.help}</p> : null}
          <SourceManager
            value={sources}
            onChange={(v) => {
              setSources(v);
              setDirty(true);
            }}
          />
        </div>
      );
    }
    return (
      <FieldControl
        key={field.name}
        field={field}
        value={data[field.name]}
        onChange={(v) => setField(field.name, v)}
        {...(errors[field.name] ? { error: errors[field.name] } : {})}
        highlight={feedbackFields.has(field.name)}
      />
    );
  };

  return (
    <div ref={topRef} className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
      {/* Desktop progress rail */}
      <div className="hidden lg:block">
        <div className="sticky top-24 space-y-6">
          <ol className="space-y-1">
            {steps.map((s, i) => {
              const state = i === stepIndex ? "current" : i < stepIndex ? "done" : "todo";
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={state === "current" ? "step" : undefined}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                      state === "current"
                        ? "bg-blush font-medium text-clay"
                        : "text-muted-foreground hover:bg-sand hover:text-ink",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.65rem]",
                        state === "done"
                          ? "border-primary bg-primary text-primary-foreground"
                          : state === "current"
                            ? "border-primary text-primary"
                            : "border-border",
                      )}
                    >
                      {state === "done" ? <Check className="h-3 w-3" aria-hidden /> : s.index}
                    </span>
                    {s.title}
                    {state === "done" ? <span className="sr-only"> (completed)</span> : null}
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="rounded-lg border border-border bg-card p-4">
            <Meter percent={ready.percent} />
            {ready.missing.length > 0 ? (
              <div className="mt-3">
                <p className="text-xs font-medium text-ink">Still needed</p>
                <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
                  {ready.missing.slice(0, 4).map((m) => (
                    <li key={m.label}>· {m.label}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">Everything we need is here.</p>
            )}
          </div>
        </div>
      </div>

      <div className="min-w-0">
        {/* Mobile step progress */}
        <div className="mb-5 lg:hidden">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Step {stepIndex + 1} of {steps.length} — {step.title}
            </span>
            <span>{ready.percent}% ready</span>
          </div>
          <div className="mt-2 flex gap-1" aria-hidden>
            {steps.map((s, i) => (
              <span
                key={s.id}
                className={cn(
                  "h-1 flex-1 rounded-full",
                  i <= stepIndex ? "bg-primary" : "bg-muted",
                )}
              />
            ))}
          </div>
        </div>

        {revision && submission.feedback.some((f) => !f.resolved) ? (
          <div className="mb-6 rounded-lg border border-border bg-blush p-4">
            <p className="text-sm font-medium text-clay">
              You are revising this submission. The fields our editors asked about are marked.
            </p>
          </div>
        ) : null}

        <Panel
          title={`${step.index} · ${step.title}`}
          description={step.blurb ?? ""}
          action={
            <span className="text-xs text-muted-foreground">
              {dirty ? "Saving…" : savedAt ? `Saved ${relativeTime(savedAt)}` : "Draft saved"}
            </span>
          }
        >
          {isReview ? (
            <div className="space-y-8">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <Eye className="h-4 w-4 text-primary" aria-hidden /> How this might appear
                </h3>
                <div className="mt-3">
                  <PublicationPreview sub={submission} data={data} media={media} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-ink">Everything you have entered</h3>
                <div className="mt-3 space-y-6">
                  {steps
                    .filter((s) => s.id !== "review")
                    .map((s) => (
                      <div key={s.id}>
                        <div className="flex items-center justify-between border-b border-border pb-2">
                          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                            {s.index} · {s.title}
                          </p>
                          <button
                            type="button"
                            className="text-xs text-primary underline underline-offset-4"
                            onClick={() => goTo(steps.indexOf(s))}
                          >
                            Edit
                          </button>
                        </div>
                        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                          {visibleFields(s, data)
                            .filter((f) => f.type !== "media" && f.type !== "sources")
                            .map((f) => (
                              <div key={f.name}>
                                <dt className="text-xs text-muted-foreground">{f.label}</dt>
                                <dd className="mt-0.5 text-sm break-words text-ink">
                                  {valueLabel(data[f.name])}
                                </dd>
                              </div>
                            ))}
                          {s.fields.some((f) => f.type === "media") ? (
                            <>
                              <div>
                                <dt className="text-xs text-muted-foreground">Media</dt>
                                <dd className="mt-0.5 text-sm text-ink">
                                  {media.length
                                    ? media.map((m) => m.title || m.fileName).join(", ")
                                    : "None added"}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-xs text-muted-foreground">Sources</dt>
                                <dd className="mt-0.5 text-sm text-ink">
                                  {sources.length ? sources.map((x) => x.title).join(", ") : "None added"}
                                </dd>
                              </div>
                            </>
                          ) : null}
                        </dl>
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-3">{step.fields.map(renderField)}</div>

              {ready.missing.length > 0 ? (
                <div className="rounded-md border border-border bg-sand p-4">
                  <p className="text-sm font-medium text-ink">Before you send this</p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {ready.missing.map((m) => (
                      <li key={m.label}>· {m.label}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs text-muted-foreground">
                    You can still submit — our editors will ask if anything essential is missing.
                  </p>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {visibleFields(step, data).map(renderField)}
            </div>
          )}
        </Panel>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className={btn.secondary}
            onClick={() => goTo(stepIndex - 1)}
            disabled={stepIndex === 0}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back
          </button>
          {isReview ? (
            <button type="button" className={btn.primary} onClick={submit}>
              {revision ? "Resubmit for review" : "Submit for editorial review"}
            </button>
          ) : (
            <button type="button" className={btn.primary} onClick={next}>
              Next
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          )}
          <button
            type="button"
            className={btn.ghost}
            onClick={() => {
              flushSave();
              navigate({ to: "/contributor/submissions", search: {} });
            }}
          >
            Save draft & continue later
          </button>
        </div>
      </div>
    </div>
  );
}
