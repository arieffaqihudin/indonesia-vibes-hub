import { Link, createFileRoute } from "@tanstack/react-router";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { daysUntil } from "@/lib/admin/types";
import { Card, EmptyState, PageHeading, StatusPill, Tag, abtn, dateFmt } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/events")({
  head: adminHead("Events", "Event records, their dates and what still needs checking before they go live."),
  component: Events,
});

function Events() {
  const admin = useAdmin();
  const events = admin.content
    .filter((c) => c.kind === "event")
    .sort((a, b) => (a.fields['startDate'] ?? "").localeCompare(b.fields['startDate'] ?? ""));

  const upcoming = events.filter((e) => !e.fields['startDate'] || daysUntil(e.fields['startDate']) >= 0);
  const past = events.filter((e) => e.fields['startDate'] && daysUntil(e.fields['startDate']) < 0);

  return (
    <>
      <PageHeading
        eyebrow="Programmes"
        title="Events"
        description="An event is only useful to a reader if the date, venue and access details are right. Past events stay published as a record."
        actions={
          <Link to="/admin/content/new" search={{ kind: "event" }} className={abtn.primary}>
            New event
          </Link>
        }
      />

      {events.length ? (
        <div className="space-y-5">
          <Card title={`Upcoming · ${upcoming.length}`}>
            <EventList items={upcoming} />
          </Card>
          <Card title={`Past · ${past.length}`} description="Kept for the archive; check that any follow-up outcome has been recorded.">
            <EventList items={past} />
          </Card>
        </div>
      ) : (
        <EmptyState title="No event records yet." />
      )}
    </>
  );
}

function EventList({ items }: { items: ReturnType<typeof useAdmin>["content"] }) {
  if (!items.length) return <p className="text-sm text-muted-foreground">Nothing here.</p>;
  return (
    <ul className="space-y-2">
      {items.map((e) => {
        const days = e.fields['startDate'] ? daysUntil(e.fields['startDate']) : undefined;
        return (
          <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2 last:border-0 last:pb-0">
            <div className="min-w-0">
              <Link to="/admin/content/$id" params={{ id: e.id }} className="text-sm text-ink hover:text-primary">
                {e.title}
              </Link>
              <p className="text-xs text-muted-foreground">
                {dateFmt(e.fields['startDate'])}
                {e.fields['venue'] ? ` · ${e.fields['venue']}` : ""}
                {e.location ? ` · ${e.location}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {typeof days === "number" && days >= 0 && days <= 14 && e.status !== "published" ? (
                <Tag tone="alert">Starts in {days} days and is not published</Tag>
              ) : null}
              <StatusPill status={e.status} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
