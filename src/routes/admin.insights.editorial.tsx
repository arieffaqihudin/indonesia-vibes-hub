import { Link, createFileRoute } from "@tanstack/react-router";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { averageQueueAge, contentSourceIssues, rightsIssues, staleContent } from "@/lib/admin/selectors";
import { Card, BarRow, Metric, PageHeading, PrototypeNote } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/insights/editorial")({
  head: adminHead("Editorial health", "How work is moving through review, verification and rights."),
  component: EditorialHealth,
});

function EditorialHealth() {
  const admin = useAdmin();
  const issues = contentSourceIssues(admin.content, admin.sources, admin.claims);
  const rights = rightsIssues(admin.media);
  const stale = staleContent(admin.content);

  const byKind = admin.content.reduce<Record<string, number>>((acc, c) => {
    acc[c.kind] = (acc[c.kind] ?? 0) + 1;
    return acc;
  }, {});
  const max = Math.max(1, ...Object.values(byKind));

  return (
    <>
      <PageHeading
        eyebrow="Insights"
        title="Editorial health"
        description="A queue that quietly grows old is the main risk in an editorial operation. These figures are here to catch that early."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric value={`${averageQueueAge(admin.content)} days`} label="Average time in stage" hint="Across everything not yet published." />
        <Metric value={issues.length} label="Records with source gaps" />
        <Metric value={rights.length} label="Media items with rights problems" />
        <Metric value={issues.reduce((n, i) => n + i.unsupported.length, 0)} label="Claims still unresolved" hint={`${stale.length} published records are overdue for review.`} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Card title="Coverage by record type" description="Where the platform is thin.">
          {Object.entries(byKind).map(([kind, count]) => (
            <BarRow key={kind} label={kind} value={count} max={max} />
          ))}
        </Card>

        <Card title="Records with source gaps">
          <ul className="space-y-1.5 text-sm">
            {issues.slice(0, 10).map(({ item, unverified, unsupported }) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-2">
                <Link to="/admin/content/$id" params={{ id: item.id }} className="text-ink hover:text-primary">
                  {item.title}
                </Link>
                <span className="text-xs text-muted-foreground">
                  {unverified.length} unverified · {unsupported.length} claims open
                </span>
              </li>
            ))}
            {!issues.length ? <li className="text-muted-foreground">Nothing outstanding.</li> : null}
          </ul>
        </Card>
      </div>

      <div className="mt-5">
        <PrototypeNote>Prototype data. No live traffic or audience analytics are connected.</PrototypeNote>
      </div>
    </>
  );
}
