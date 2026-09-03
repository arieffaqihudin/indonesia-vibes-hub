import { Link, createFileRoute } from "@tanstack/react-router";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { upcomingReviews } from "@/lib/admin/selectors";
import { kindLabel } from "@/lib/admin/types";
import { Card, EmptyState, PageHeading, StatusPill, Tag, abtn, dateFmt, timeFmt } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/calendar")({
  head: adminHead("Editorial calendar", "What is scheduled, what is due for review, and where the gaps are."),
  component: Calendar,
});

function weekKey(iso: string) {
  const d = new Date(iso);
  const day = (d.getUTCDay() + 6) % 7;
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - day));
  return monday.toISOString().slice(0, 10);
}

function Calendar() {
  const admin = useAdmin();
  const scheduled = admin.content.filter((c) => c.scheduledFor).sort((a, b) => a.scheduledFor!.localeCompare(b.scheduledFor!));
  const reviews = upcomingReviews(admin.content);

  const weeks = new Map<string, typeof scheduled>();
  scheduled.forEach((item) => {
    const key = weekKey(item.scheduledFor!);
    weeks.set(key, [...(weeks.get(key) ?? []), item]);
  });

  return (
    <>
      <PageHeading
        eyebrow="Editorial"
        title="Editorial calendar"
        description="Scheduled publication alongside content that is due for review, so quiet weeks are visible early."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-4">
          {weeks.size ? (
            [...weeks.entries()].map(([week, items]) => (
              <Card key={week} title={`Week of ${dateFmt(week)}`} description={`${items.length} scheduled`}>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2 last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <Link to="/admin/content/$id" params={{ id: item.id }} className="text-sm text-ink hover:text-primary">
                          {item.title}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {kindLabel(item.kind)} · {dateFmt(item.scheduledFor)} at {timeFmt(item.scheduledFor)} ({item.scheduleTimeZone})
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.featured?.map((f) => (
                          <Tag key={f} tone="quiet">
                            {f}
                          </Tag>
                        ))}
                        <StatusPill status={item.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            ))
          ) : (
            <EmptyState
              title="Nothing is scheduled yet."
              hint="Approved records can be scheduled from their workspace."
              action={
                <Link to="/admin/review" className={abtn.secondary}>
                  Open the review queue
                </Link>
              }
            />
          )}
        </div>

        <aside className="space-y-4">
          <Card title="Due for review" description="Published content with a review date in the next six weeks.">
            <ul className="space-y-2 text-sm">
              {reviews.length ? (
                reviews.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-2">
                    <Link to="/admin/content/$id" params={{ id: item.id }} className="text-ink hover:text-primary">
                      {item.title}
                    </Link>
                    <span className="shrink-0 text-xs text-muted-foreground">{dateFmt(item.nextReview)}</span>
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground">Nothing due in the next six weeks.</li>
              )}
            </ul>
          </Card>

          <Card title="Coverage gaps" description="A prompt, not a rule.">
            <p className="text-sm text-muted-foreground">
              {weeks.size < 3
                ? "Fewer than three weeks of scheduled publication are planned. Consider moving an approved record forward."
                : "Publication is planned across several weeks ahead."}
            </p>
          </Card>
        </aside>
      </div>
    </>
  );
}
