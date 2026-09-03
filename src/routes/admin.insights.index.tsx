import { Link, createFileRoute } from "@tanstack/react-router";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { staleContent, upcomingReviews } from "@/lib/admin/selectors";
import { Card, Metric, PageHeading, PrototypeNote, abtn } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/insights/")({
  head: adminHead("Platform overview", "A short, honest picture of the platform's editorial and partnership health."),
  component: Insights,
});

function Insights() {
  const admin = useAdmin();
  const published = admin.content.filter((c) => c.status === "published");
  const inProgress = admin.content.filter((c) => c.status !== "published" && c.status !== "archived");
  const openInquiries = admin.inquiries.filter((i) => i.status !== "Closed" && i.status !== "Completed");
  const stale = staleContent(admin.content);

  return (
    <>
      <PageHeading
        eyebrow="Insights"
        title="Platform overview"
        description="Numbers here describe work, not popularity. They exist to show where attention is needed."
        actions={
          <Link to="/admin/insights/editorial" className={abtn.secondary}>
            Editorial health
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric value={published.length} label="Published records" />
        <Metric value={inProgress.length} label="In progress" hint="Anything between draft and approval." />
        <Metric value={openInquiries.length} label="Open inquiries" />
        <Metric value={stale.length} label="Needing a refresh" hint="Past their review date." />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Card title="Needs attention soon" description="Review dates falling within six weeks.">
          <ul className="space-y-1.5 text-sm">
            {upcomingReviews(admin.content).slice(0, 8).map((c) => (
              <li key={c.id}>
                <Link to="/admin/content/$id" params={{ id: c.id }} className="text-ink hover:text-primary">
                  {c.title}
                </Link>
              </li>
            ))}
            {!upcomingReviews(admin.content).length ? <li className="text-muted-foreground">Nothing due soon.</li> : null}
          </ul>
        </Card>

        <Card title="Where the work sits" description="Records by workflow stage.">
          <ul className="space-y-1 text-sm">
            {Object.entries(
              admin.content.reduce<Record<string, number>>((acc, c) => {
                acc[c.status] = (acc[c.status] ?? 0) + 1;
                return acc;
              }, {}),
            ).map(([status, count]) => (
              <li key={status} className="flex items-center justify-between gap-2">
                <span className="text-ink">{status.replace(/_/g, " ")}</span>
                <span className="tabular-nums text-muted-foreground">{count}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-5">
        <PrototypeNote>Figures are drawn from prototype data and are illustrative only.</PrototypeNote>
      </div>
    </>
  );
}
