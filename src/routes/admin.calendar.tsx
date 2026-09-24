import { Link, createFileRoute } from "@tanstack/react-router";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { upcomingReviews } from "@/lib/admin/selectors";
import { kindLabel } from "@/lib/admin/types";
import { EmptyState, PageHeading, RowLinkAction, StatusPill, SummaryStrip, Table, Tag, Td, abtn, dateFmt, timeFmt } from "@/components/admin/primitives";

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

      <SummaryStrip items={[{ label: "Scheduled", value: scheduled.length }, { label: "Weeks planned", value: weeks.size }, { label: "Due for review", value: reviews.length }, { label: "Coverage", value: weeks.size < 3 ? "Needs planning" : "On track" }]} />
      <div>
          {weeks.size ? (
            <Table caption="Editorial calendar" head={["Content", "Week", "Publication date", "Placement", "Status", ""]}>
              {scheduled.map((item) => <tr key={item.id} className="group"><Td><Link to="/admin/content/$id" params={{ id: item.id }} className="font-semibold hover:text-primary">{item.title}</Link><span className="block text-xs text-muted-foreground">{kindLabel(item.kind)}</span></Td><Td className="text-xs text-muted-foreground">Week of {dateFmt(weekKey(item.scheduledFor!))}</Td><Td className="text-xs text-muted-foreground">{dateFmt(item.scheduledFor)} · {timeFmt(item.scheduledFor)}</Td><Td>{item.featured?.[0] ? <Tag tone="quiet">{item.featured[0]}</Tag> : "—"}</Td><Td><StatusPill status={item.status} /></Td><Td><RowLinkAction to="/admin/content/$id" params={{ id: item.id }} label={`Open ${item.title}`} /></Td></tr>)}
            </Table>
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
        <section className="mt-8 border-t border-border pt-5">
          <h2 className="mb-3 text-[0.7rem] font-semibold tracking-[0.1em] text-clay uppercase">Due for review</h2>
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
        </section>
      </div>
    </>
  );
}
