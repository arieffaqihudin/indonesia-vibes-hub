import { Link, createFileRoute } from "@tanstack/react-router";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { overdueFollowUps } from "@/lib/admin/selectors";
import { PIPELINE_STAGES } from "@/lib/admin/types";
import { BarRow, Card, Metric, PageHeading, PrototypeNote } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/insights/partnerships")({
  head: adminHead("Partnership outcomes", "What inquiries and introductions actually led to."),
  component: PartnershipInsights,
});

function PartnershipInsights() {
  const admin = useAdmin();
  const open = admin.followUps.filter((f) => f.status === "Open");
  const outcomes = admin.pipeline.flatMap((c) => c.outcomes);
  const stageCounts = PIPELINE_STAGES.map((stage) => ({ stage, count: admin.pipeline.filter((c) => c.stage === stage).length }));
  const max = Math.max(1, ...stageCounts.map((s) => s.count));

  return (
    <>
      <PageHeading
        eyebrow="Insights"
        title="Partnership outcomes"
        description="The measure of cultural diplomacy is what continued after the first meeting, not how many inquiries arrived."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric value={admin.inquiries.length} label="Inquiries received" />
        <Metric value={admin.inquiries.filter((i) => i.introductions.length).length} label="Introductions made" hint="Always with both sides' consent." />
        <Metric value={admin.pipeline.filter((c) => c.stage === "Completed").length} label="Collaborations completed" />
        <Metric value={overdueFollowUps(open).length} label="Overdue follow-ups" />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Card title="Pipeline by stage">
          {stageCounts.map((s) => (
            <BarRow key={s.stage} label={s.stage} value={s.count} max={max} />
          ))}
        </Card>

        <Card title="Recorded outcomes" description="Written in plain language, not scored.">
          <ul className="space-y-1.5 text-sm">
            {outcomes.map((o, i) => (
              <li key={`${o.label}-${i}`}>
                <span className="text-ink">{o.label}</span>
                <span className="ml-2 text-xs text-muted-foreground">{o.type}</span>
              </li>
            ))}
            {!outcomes.length ? <li className="text-muted-foreground">No outcomes recorded yet.</li> : null}
          </ul>
        </Card>
      </div>

      <div className="mt-4">
        <Card title="Collaborations needing attention" description="Nothing recorded recently, or no next action agreed.">
          <ul className="space-y-1.5 text-sm">
            {admin.pipeline
              .filter((c) => !c.nextActions.length && c.stage !== "Completed" && c.stage !== "Closed")
              .map((c) => (
                <li key={c.id}>
                  <Link to="/admin/collaborations/$id" params={{ id: c.id }} className="text-ink hover:text-primary">
                    {c.title}
                  </Link>
                  <span className="ml-2 text-xs text-muted-foreground">No agreed next action</span>
                </li>
              ))}
          </ul>
        </Card>
      </div>

      <div className="mt-5">
        <PrototypeNote>Prototype data. Outcomes are recorded by the team, not inferred automatically.</PrototypeNote>
      </div>
    </>
  );
}
