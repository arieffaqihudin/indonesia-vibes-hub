import { Link, createFileRoute } from "@tanstack/react-router";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { daysUntil } from "@/lib/admin/types";
import { EmptyState, InlineNote, PageHeading, RowLinkAction, StatusPill, SummaryStrip, Table, Tag, Td, abtn, dateFmt } from "@/components/admin/primitives";

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
        eyebrow="Content / Opportunities"
        title="Opportunities"
        description="People make plans around these deadlines. An expired opportunity that is still published is a mistake, not a detail."
        actions={
          <Link to="/admin/content/new" search={{ kind: "opportunity" }} className={abtn.primary}>
            New opportunity
          </Link>
        }
      />

      <SummaryStrip items={[
        { value: items.length, label: "Total opportunities" },
        { value: items.filter((o) => o.status === "published").length, label: "Published" },
        { value: items.filter((o) => o.fields['deadline'] && daysUntil(o.fields['deadline']) >= 0).length, label: "Open" },
        { value: expired.length, label: "Needs update" },
      ]} />
      <p className="mb-3 text-xs text-muted-foreground">Showing {items.length} opportunit{items.length === 1 ? "y" : "ies"}</p>
      {expired.length ? <InlineNote tone="attention">{expired.length} published opportunities have passed their deadline and need an update.</InlineNote> : null}

      {items.length ? (
        <Table caption="Opportunities" head={["Opportunity", "Provider", "Deadline", "Time remaining", "Status", ""]}>
            {items.map((o) => {
              const days = o.fields['deadline'] ? daysUntil(o.fields['deadline']) : undefined;
              return (
                <tr key={o.id} className="group hover:bg-muted/35">
                  <Td><Link to="/admin/content/$id" params={{ id: o.id }} className="font-semibold hover:text-primary">{o.title}</Link></Td>
                  <Td className="text-xs text-muted-foreground">{o.fields['organisation'] ?? o.organisation ?? "Not recorded"}</Td>
                  <Td className="text-xs text-muted-foreground">{dateFmt(o.fields['deadline'])}</Td>
                  <Td>{typeof days === "number" && days >= 0 ? <Tag tone={days <= 10 ? "alert" : "quiet"}>{days} days</Tag> : <Tag tone="quiet">Closed</Tag>}</Td>
                  <Td><StatusPill status={o.status} /></Td>
                  <Td><RowLinkAction to="/admin/content/$id" params={{ id: o.id }} label={`Open ${o.title}`} /></Td>
                </tr>
              );
            })}
        </Table>
      ) : (
        <EmptyState title="No opportunities recorded yet." />
      )}
    </>
  );
}
