import { Link, createFileRoute } from "@tanstack/react-router";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { EmptyState, PageHeading, SummaryStrip, Table, Tag, Td, abtn, relative } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/collaborations/")({
  head: adminHead("Collaborations", "International collaborations from first idea to recorded outcome."),
  component: Collaborations,
});

function Collaborations() {
  const admin = useAdmin();

  return (
    <>
      <PageHeading
        eyebrow="Partnerships / Collaborations"
        title="Collaborations"
        description="Grouped by stage. A collaboration only becomes public content once it is confirmed and written up."
      />

      <SummaryStrip items={[
        { value: admin.pipeline.length, label: "Total collaborations" },
        { value: admin.pipeline.filter((item) => item.stage === "Discussion").length, label: "In discussion" },
        { value: admin.pipeline.filter((item) => item.stage === "Ongoing").length, label: "Ongoing" },
        { value: admin.pipeline.filter((item) => item.stage === "Completed").length, label: "Completed" },
      ]} />

      {admin.pipeline.length ? (
        <Table caption="Collaborations" head={["Collaboration", "Stage", "Origin", "Countries", "Lead", "Updated", "Next action", ""]}>
          {admin.pipeline.map((item) => (
            <tr key={item.id} className="group hover:bg-muted/35">
              <Td><Link to="/admin/collaborations/$id" params={{ id: item.id }} className="font-semibold hover:text-primary">{item.title}</Link><span className="block max-w-sm text-xs text-muted-foreground">{item.objective}</span></Td>
              <Td><Tag tone={item.stage === "Ongoing" ? "alert" : "quiet"}>{item.stage}</Tag></Td>
              <Td className="text-xs text-muted-foreground">{item.origin}</Td>
              <Td className="text-xs text-muted-foreground">{item.countries.join(", ")}</Td>
              <Td className="text-xs text-muted-foreground">{item.leadOfficer}</Td>
              <Td className="text-xs text-muted-foreground">{relative(item.updatedAt)}</Td>
              <Td className="max-w-xs text-xs text-ink">{item.nextActions[0] ?? "—"}</Td>
              <Td><Link to="/admin/collaborations/$id" params={{ id: item.id }} className={abtn.quiet}>Open</Link></Td>
            </tr>
          ))}
        </Table>
      ) : (
        <EmptyState
          title="No collaborations recorded."
          action={
            <Link to="/admin/inquiries" className={abtn.secondary}>
              Look at open inquiries
            </Link>
          }
        />
      )}
    </>
  );
}
