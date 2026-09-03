import { Link, createFileRoute } from "@tanstack/react-router";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { countryRows } from "@/lib/admin/selectors";
import { daysUntil } from "@/lib/admin/types";
import { Card, EmptyState, Metric, PageHeading, Tag, dateFmt } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/global-agenda")({
  head: adminHead("Global agenda", "Where Indonesian culture is present internationally over the coming months."),
  component: GlobalAgenda,
});

function GlobalAgenda() {
  const admin = useAdmin();
  const rows = countryRows(admin.content, admin.inquiries, admin.partners, admin.pipeline).filter((r) => r.country !== "Indonesia");

  const abroad = admin.content
    .filter((c) => c.kind === "event" && c.countries.some((x) => x !== "Indonesia"))
    .filter((c) => !c.fields['startDate'] || daysUntil(c.fields['startDate']) >= -7)
    .sort((a, b) => (a.fields['startDate'] ?? "").localeCompare(b.fields['startDate'] ?? ""));

  const activeCollabs = admin.pipeline.filter((c) => c.stage !== "Completed" && c.stage !== "Closed");

  return (
    <>
      <PageHeading
        eyebrow="Programmes"
        title="Global agenda"
        description="A working view of international presence: what is happening where, and which countries the platform barely covers yet."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Metric value={rows.length} label="Countries with records" />
        <Metric value={abroad.length} label="Events abroad ahead" hint="Includes the last week so nothing is lost in transition." />
        <Metric value={activeCollabs.length} label="Live collaborations" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Events abroad">
          {abroad.length ? (
            <ul className="space-y-2 text-sm">
              {abroad.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-2">
                  <Link to="/admin/content/$id" params={{ id: e.id }} className="text-ink hover:text-primary">
                    {e.title}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {e.countries.join(", ")} · {dateFmt(e.fields['startDate'])}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No upcoming events recorded outside Indonesia." />
          )}
        </Card>

        <Card title="Collaborations in progress">
          <ul className="space-y-2 text-sm">
            {activeCollabs.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-2">
                <Link to="/admin/collaborations/$id" params={{ id: c.id }} className="text-ink hover:text-primary">
                  {c.title}
                </Link>
                <span className="text-xs text-muted-foreground">
                  {c.countries.join(", ")} · {c.stage}
                </span>
              </li>
            ))}
            {!activeCollabs.length ? <li className="text-muted-foreground">Nothing in the pipeline.</li> : null}
          </ul>
        </Card>
      </div>

      <div className="mt-4">
        <Card title="Country coverage" description="Coverage describes our records, not the cultural significance of a country.">
          <ul className="divide-y divide-border text-sm">
            {rows.map((r) => (
              <li key={r.country} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span className="text-ink">{r.country}</span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  {r.events} events · {r.partners} partners · {r.inquiries} inquiries
                  <Tag tone={r.coverage === "Limited records" ? "alert" : "quiet"}>{r.coverage}</Tag>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
