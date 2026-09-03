import { Link, createFileRoute } from "@tanstack/react-router";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { daysUntil } from "@/lib/admin/types";
import { Card, EmptyState, PageHeading, StatusPill, Tag, abtn, dateFmt } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/opportunities")({
  head: adminHead("Opportunities", "Open calls and programmes, with deadline accuracy treated as a duty of care."),
  component: Opportunities,
});

function Opportunities() {
  const admin = useAdmin();
  const items = admin.content
    .filter((c) => c.kind === "opportunity")
    .sort((a, b) => (a.fields['deadline'] ?? "9999").localeCompare(b.fields['deadline'] ?? "9999"));

  const expired = items.filter((o) => o.fields['deadline'] && daysUntil(o.fields['deadline']) < 0 && o.status === "published");

  return (
    <>
      <PageHeading
        eyebrow="Programmes"
        title="Opportunities"
        description="People make plans around these deadlines. An expired opportunity that is still published is a mistake, not a detail."
        actions={
          <Link to="/admin/content/new" search={{ kind: "opportunity" }} className={abtn.primary}>
            New opportunity
          </Link>
        }
      />

      {expired.length ? (
        <div className="mb-5">
          <Card title={`Published but past deadline · ${expired.length}`} description="Close these or update the dates.">
            <ul className="space-y-1.5 text-sm">
              {expired.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center justify-between gap-2">
                  <Link to="/admin/content/$id" params={{ id: o.id }} className="text-ink hover:text-primary">
                    {o.title}
                  </Link>
                  <span className="text-xs text-muted-foreground">Deadline {dateFmt(o.fields['deadline'])}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      ) : null}

      {items.length ? (
        <Card title={`All opportunities · ${items.length}`}>
          <ul className="space-y-2">
            {items.map((o) => {
              const days = o.fields['deadline'] ? daysUntil(o.fields['deadline']) : undefined;
              return (
                <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <Link to="/admin/content/$id" params={{ id: o.id }} className="text-sm text-ink hover:text-primary">
                      {o.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {o.fields['organisation'] ?? o.organisation ?? "Organisation not recorded"} · deadline {dateFmt(o.fields['deadline'])}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {typeof days === "number" && days >= 0 && days <= 10 ? <Tag tone="alert">Closes in {days} days</Tag> : null}
                    {typeof days === "number" && days < 0 ? <Tag tone="quiet">Closed</Tag> : null}
                    <StatusPill status={o.status} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      ) : (
        <EmptyState title="No opportunities recorded yet." />
      )}
    </>
  );
}
