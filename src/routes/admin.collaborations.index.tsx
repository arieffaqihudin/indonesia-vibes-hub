import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { EmptyState, PageHeading, RowLinkAction, Table, TabBar, Tag, Td, abtn, relative } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/collaborations/")({
  head: adminHead("Collaborations", "Collaboration records and requests from first idea to recorded outcome."),
  component: Collaborations,
});

function Collaborations() {
  const admin = useAdmin();
  const [tab, setTab] = useState("Collaborations");

  return (
    <>
      <PageHeading
        eyebrow="Connect / Collaborations"
        title="Collaborations"
        description="Grouped by stage. A collaboration only becomes public content once it is confirmed and written up."
      />
      <TabBar label="Connect records" active={tab} onChange={setTab} tabs={[{ id: "Collaborations", label: "Collaborations", count: admin.pipeline.length }, { id: "Requests", label: "Requests", count: admin.inquiries.length }]} />

      {tab === "Collaborations" ? <>
      <p className="mb-3 text-xs text-muted-foreground">Showing {admin.pipeline.length} collaboration{admin.pipeline.length === 1 ? "" : "s"}</p>

      {admin.pipeline.length ? (
        <Table caption="Collaborations" head={["Collaboration", "Stage", "Origin", "Countries", "Public Story", "Lead", "Updated", "Next action", ""]}>
          {admin.pipeline.map((item) => (
            <tr key={item.id} className="group hover:bg-muted/35">
              <Td><Link to="/admin/collaborations/$id" params={{ id: item.id }} className="font-semibold hover:text-primary">{item.title}</Link><span className="block max-w-sm text-xs text-muted-foreground">{item.objective}</span></Td>
              <Td><Tag tone={item.stage === "Ongoing" ? "alert" : "quiet"}>{item.stage}</Tag></Td>
              <Td className="text-xs text-muted-foreground">{item.origin}</Td>
              <Td className="text-xs text-muted-foreground">{item.countries.join(", ")}</Td>
              <Td className="text-xs">{item.publicStory ? "Yes" : "No"}</Td>
              <Td className="text-xs text-muted-foreground">{item.leadOfficer}</Td>
              <Td className="text-xs text-muted-foreground">{relative(item.updatedAt)}</Td>
              <Td className="max-w-xs text-xs text-ink">{item.nextActions[0] ?? "—"}</Td>
              <Td><RowLinkAction to="/admin/collaborations/$id" params={{ id: item.id }} label={`Open ${item.title}`} /></Td>
            </tr>
          ))}
        </Table>
      ) : (
        <EmptyState
          title="No collaborations recorded."
          action={
            <button type="button" className={abtn.secondary} onClick={() => setTab("Requests")}>Look at requests</button>
          }
        />
      )}</> : <Table caption="Collaboration requests" head={["Requester", "Organisation", "Request", "Status", "Assigned to", ""]}>{admin.inquiries.map((item) => <tr key={item.id} className="hover:bg-muted/35"><Td className="font-medium">{item.requesterName}<span className="block text-xs text-muted-foreground">{item.country}</span></Td><Td>{item.organisation}</Td><Td>{item.subject}</Td><Td><Tag tone={item.status === "New" ? "alert" : "quiet"}>{item.status}</Tag></Td><Td>{item.assignedTo ?? "Unassigned"}</Td><Td><RowLinkAction to="/admin/inquiries/$id" params={{ id: item.id }} label={`Open request from ${item.requesterName}`} /></Td></tr>)}</Table>}
    </>
  );
}
