import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { OUTCOME_TYPES, OUTPUT_TYPES, PIPELINE_STAGES, can, type PipelineStage } from "@/lib/admin/types";
import { Card, EmptyState, PageHeading, Tag, abtn, dateFmt, field, relative } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/collaborations/$id")({
  head: adminHead("Collaboration", "One collaboration: origin, partners, activities, outputs and outcomes."),
  component: CollaborationDetail,
});

function CollaborationDetail() {
  const { id } = Route.useParams();
  const admin = useAdmin();
  const collab = admin.pipeline.find((c) => c.id === id);
  const editable = can(admin.role, "partnership");
  const [outputType, setOutputType] = useState<string>(OUTPUT_TYPES[0]);
  const [outputLabel, setOutputLabel] = useState("");
  const [outcomeType, setOutcomeType] = useState<string>(OUTCOME_TYPES[0]);
  const [outcomeLabel, setOutcomeLabel] = useState("");

  if (!collab) {
    return (
      <EmptyState
        title="That collaboration no longer exists."
        action={
          <Link to="/admin/collaborations" className={abtn.secondary}>
            Back to collaborations
          </Link>
        }
      />
    );
  }

  const inquiries = admin.inquiries.filter((i) => collab.inquiryIds.includes(i.id));

  return (
    <>
      <PageHeading
        eyebrow={`${collab.countries.join(" · ")} · ${collab.stage}`}
        title={collab.title}
        description={collab.objective}
        actions={
          <Link to="/admin/collaborations" className={abtn.secondary}>
            Back to collaborations
          </Link>
        }
      />

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="space-y-4">
          <Card title="How this started" description="The trail from public content to a working collaboration.">
            <ol className="space-y-2 text-sm">
              {collab.originTrail.map((step, i) => (
                <li key={`${step.label}-${i}`} className="flex gap-3">
                  <span className="w-24 shrink-0 text-xs text-muted-foreground">{dateFmt(step.date)}</span>
                  <span className="text-ink">
                    {step.label} <span className="text-xs text-muted-foreground">— {step.recordType}</span>
                  </span>
                </li>
              ))}
              {!collab.originTrail.length ? <li className="text-muted-foreground">No origin trail recorded.</li> : null}
            </ol>
          </Card>

          {collab.publicStory ? <>
          <Card title="Context and activities">
            <p className="text-sm leading-relaxed text-ink">{collab.context}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink">
              {collab.activities.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </Card>

          <Card title="Timeline">
            <ul className="space-y-1.5 text-sm">
              {collab.timeline.map((t) => (
                <li key={t.period} className="flex gap-3">
                  <span className="w-32 shrink-0 text-xs text-muted-foreground">{t.period}</span>
                  <span className="text-ink">{t.label}</span>
                </li>
              ))}
              {!collab.timeline.length ? <li className="text-muted-foreground">No timeline recorded.</li> : null}
            </ul>
          </Card>

          <Card title="Outputs" description="What the collaboration produced.">
            <ul className="space-y-1.5 text-sm">
              {collab.outputs.map((o, i) => (
                <li key={`${o.label}-${i}`} className="flex items-center gap-2">
                  <Tag tone="quiet">{o.type}</Tag>
                  <span className="text-ink">{o.label}</span>
                </li>
              ))}
              {!collab.outputs.length ? <li className="text-muted-foreground">No outputs recorded yet.</li> : null}
            </ul>
            {editable ? (
              <div className="mt-3 flex flex-wrap items-end gap-2 border-t border-border pt-3">
                <label className="text-xs text-muted-foreground">
                  <span className="mb-1 block">Type</span>
                  <select className={`${field} min-h-8 w-44 py-1 text-xs`} value={outputType} onChange={(e) => setOutputType(e.target.value)}>
                    {OUTPUT_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="flex-1 text-xs text-muted-foreground">
                  <span className="mb-1 block">Description</span>
                  <input className={`${field} min-h-8 py-1 text-xs`} value={outputLabel} onChange={(e) => setOutputLabel(e.target.value)} />
                </label>
                <button
                  type="button"
                  className={abtn.secondary}
                  disabled={!outputLabel.trim()}
                  onClick={() => {
                    admin.updateCollaboration(collab.id, { outputs: [...collab.outputs, { type: outputType, label: outputLabel }] }, "recorded an output");
                    setOutputLabel("");
                  }}
                >
                  Add output
                </button>
              </div>
            ) : null}
          </Card>

          <Card title="Outcomes" description="What changed as a result — the part that matters for cultural diplomacy.">
            <ul className="space-y-1.5 text-sm">
              {collab.outcomes.map((o, i) => (
                <li key={`${o.label}-${i}`} className="flex items-center gap-2">
                  <Tag tone="quiet">{o.type}</Tag>
                  <span className="text-ink">{o.label}</span>
                </li>
              ))}
              {!collab.outcomes.length ? <li className="text-muted-foreground">No outcomes recorded yet.</li> : null}
            </ul>
            {editable ? (
              <div className="mt-3 flex flex-wrap items-end gap-2 border-t border-border pt-3">
                <label className="text-xs text-muted-foreground">
                  <span className="mb-1 block">Type</span>
                  <select className={`${field} min-h-8 w-52 py-1 text-xs`} value={outcomeType} onChange={(e) => setOutcomeType(e.target.value)}>
                    {OUTCOME_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="flex-1 text-xs text-muted-foreground">
                  <span className="mb-1 block">Description</span>
                  <input className={`${field} min-h-8 py-1 text-xs`} value={outcomeLabel} onChange={(e) => setOutcomeLabel(e.target.value)} />
                </label>
                <button
                  type="button"
                  className={abtn.secondary}
                  disabled={!outcomeLabel.trim()}
                  onClick={() => {
                    admin.updateCollaboration(collab.id, { outcomes: [...collab.outcomes, { type: outcomeType, label: outcomeLabel }] }, "recorded an outcome");
                    setOutcomeLabel("");
                  }}
                >
                  Add outcome
                </button>
              </div>
            ) : null}
          </Card>
          </> : <p className="border border-dashed border-border p-4 text-sm text-muted-foreground">This collaboration appears publicly as a short showcase card with no page of its own. Turn on <strong className="text-ink">Public Story</strong> to write background, activities and outcomes for a full Collaboration Story.</p>}
        </div>

        <aside className="space-y-4 border-t border-border pt-5 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-6">
          <Card title="Public Story">
            <label className="flex min-h-11 items-center justify-between gap-3 text-sm text-ink"><span>Public Story page</span><input type="checkbox" checked={Boolean(collab.publicStory)} disabled={!editable} onChange={(e) => admin.updateCollaboration(collab.id, { publicStory: e.target.checked }, e.target.checked ? "turned on the public story" : "turned off the public story")} /></label>
            {(() => { const filled = [collab.context, collab.activities.length, collab.outcomes.length, collab.timeline.length, collab.confirmedPartnerIds.length].filter(Boolean).length; return <p className="mt-1 text-xs text-muted-foreground">{collab.publicStory ? (filled < 3 ? "Not enough content yet — add background, activities and outcomes before publishing the story." : "Card links to “Read the Collaboration Story →”.") : "Off: shown as an informational card only, with no public page."}</p>; })()}
          </Card>
          <Card title="Stage">
            <label className="block text-xs text-muted-foreground">
              <span className="mb-1 block">Current stage</span>
              <select
                className={field}
                value={collab.stage}
                disabled={!editable}
                onChange={(e) => admin.updateCollaboration(collab.id, { stage: e.target.value as PipelineStage }, `moved the collaboration to ${e.target.value}`)}
              >
                {PIPELINE_STAGES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <p className="mt-2 text-xs text-muted-foreground">Updated {relative(collab.updatedAt)} · led by {collab.leadOfficer}</p>
          </Card>

          <Card title="Partners">
            <p className="text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase">Confirmed</p>
            <ul className="mt-1 space-y-1 text-sm">
              {collab.confirmedPartnerIds.map((pid) => {
                const p = admin.partners.find((x) => x.id === pid);
                return p ? (
                  <li key={pid}>
                    <Link to="/admin/partners/$id" params={{ id: pid }} className="text-ink hover:text-primary">
                      {p.name}
                    </Link>
                  </li>
                ) : null;
              })}
              {!collab.confirmedPartnerIds.length ? <li className="text-muted-foreground">None yet.</li> : null}
            </ul>
            <p className="mt-3 text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase">Being considered</p>
            <ul className="mt-1 space-y-1 text-sm">
              {collab.potentialPartnerIds.map((pid) => {
                const p = admin.partners.find((x) => x.id === pid);
                return p ? (
                  <li key={pid}>
                    <Link to="/admin/partners/$id" params={{ id: pid }} className="text-ink hover:text-primary">
                      {p.name}
                    </Link>
                  </li>
                ) : null;
              })}
              {!collab.potentialPartnerIds.length ? <li className="text-muted-foreground">None recorded.</li> : null}
            </ul>
          </Card>

          <Card title="Related inquiries">
            <ul className="space-y-1 text-sm">
              {inquiries.map((i) => (
                <li key={i.id}>
                  <Link to="/admin/inquiries/$id" params={{ id: i.id }} className="text-ink hover:text-primary">
                    {i.reference} — {i.subject}
                  </Link>
                </li>
              ))}
              {!inquiries.length ? <li className="text-muted-foreground">None linked.</li> : null}
            </ul>
          </Card>

          <Card title="Next actions">
            <ul className="list-disc space-y-1 pl-5 text-sm text-ink">
              {collab.nextActions.map((a) => (
                <li key={a}>{a}</li>
              ))}
              {!collab.nextActions.length ? <li className="list-none text-muted-foreground">Nothing outstanding.</li> : null}
            </ul>
          </Card>
        </aside>
      </div>
    </>
  );
}
