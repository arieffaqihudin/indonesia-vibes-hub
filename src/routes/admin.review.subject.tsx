import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { CONTENT_FIELDS, SENSITIVITY_FLAGS, kindLabel, type SensitivityFlag } from "@/lib/admin/types";
import { Card, EmptyState, PageHeading, PrototypeNote, abtn, field } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/review/subject")({
  head: adminHead("Subject review", "A focused view for cultural subject reviewers: read the substance, respond, nothing else."),
  component: SubjectReview,
});

type Outcome = NonNullable<NonNullable<ReturnType<typeof useAdmin>["content"][number]["subjectReview"]>["outcome"]>;

const OUTCOMES: Outcome[] = ["Substance approved", "Clarification requested", "Revision suggested", "Sensitivity flagged"];

function SubjectReview() {
  const admin = useAdmin();
  const items = admin.content.filter((c) => c.status === "subject_review");
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const current = items.find((i) => i.id === openId) ?? items[0];

  if (!current) {
    return (
      <>
        <PageHeading eyebrow="Editorial" title="Subject review" description="Cultural accuracy review, kept separate from editing." />
        <EmptyState
          title="Nothing is waiting for subject review."
          hint="Records appear here when an editor sends them for cultural accuracy review."
          action={
            <Link to="/admin/review" className={abtn.secondary}>
              Back to the review queue
            </Link>
          }
        />
      </>
    );
  }

  return (
    <>
      <PageHeading
        eyebrow="Editorial"
        title="Subject review"
        description="Read the substance and respond. You are not asked to edit the writing."
      />

      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <nav aria-label="Records awaiting subject review">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(item.id)}
                  aria-current={item.id === current.id}
                  className={`w-full rounded border px-3 py-2 text-left text-sm ${
                    item.id === current.id ? "border-primary bg-primary/5 text-ink" : "border-border text-muted-foreground hover:text-ink"
                  }`}
                >
                  <span className="block font-medium text-ink">{item.title}</span>
                  <span className="block text-xs">{kindLabel(item.kind)}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-4">
          <Card title={current.title} description="Substance only — formatting and house style are handled elsewhere.">
            <div className="space-y-4">
              {CONTENT_FIELDS[current.kind]
                .filter((f) => current.fields[f.name])
                .map((f) => (
                  <section key={f.name}>
                    <h3 className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">{f.label}</h3>
                    <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink">{current.fields[f.name]}</p>
                  </section>
                ))}
            </div>
          </Card>

          <Card title="Your response">
            <ResponseForm key={current.id} id={current.id} />
          </Card>

          <PrototypeNote>
            Subject reviewers see the content and its sources. Contributor contact details and internal partnership notes are
            not shown here.
          </PrototypeNote>
        </div>
      </div>
    </>
  );
}

function ResponseForm({ id }: { id: string }) {
  const admin = useAdmin();
  const item = admin.getContent(id)!;
  const [outcome, setOutcome] = useState<Outcome>("Substance approved");
  const [comment, setComment] = useState("");
  const [flags, setFlags] = useState<SensitivityFlag[]>(item.culturalReview.flags);
  const [saved, setSaved] = useState(false);

  const toggle = (f: SensitivityFlag) => setFlags((v) => (v.includes(f) ? v.filter((x) => x !== f) : [...v, f]));

  return (
    <div className="space-y-3">
      <label className="block text-xs text-muted-foreground">
        <span className="mb-1 block">Outcome</span>
        <select className={field} value={outcome} onChange={(e) => setOutcome(e.target.value as Outcome)}>
          {OUTCOMES.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>

      <label className="block text-xs text-muted-foreground">
        <span className="mb-1 block">Comment for the editorial team</span>
        <textarea className={field} rows={4} value={comment} onChange={(e) => setComment(e.target.value)} />
      </label>

      <fieldset>
        <legend className="text-xs font-medium text-ink">Sensitivity flags</legend>
        <div className="mt-1.5 grid gap-1.5 sm:grid-cols-2">
          {SENSITIVITY_FLAGS.map((f) => (
            <label key={f} className="flex items-center gap-2 text-xs text-ink">
              <input type="checkbox" checked={flags.includes(f)} onChange={() => toggle(f)} />
              {f}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={abtn.primary}
          onClick={() => {
            admin.updateContent(
              id,
              {
                subjectReview: { reviewer: admin.user.name, outcome, comment, date: new Date().toISOString() },
                culturalReview: { ...item.culturalReview, flags },
              },
              `recorded a subject review: ${outcome.toLowerCase()}`,
            );
            if (outcome === "Substance approved") admin.transition(id, "english_editing", "Substance approved by subject reviewer.");
            setSaved(true);
          }}
        >
          Send response
        </button>
        <span aria-live="polite" className="text-xs text-muted-foreground">
          {saved ? "Response recorded and sent to the editorial team." : ""}
        </span>
      </div>
    </div>
  );
}
