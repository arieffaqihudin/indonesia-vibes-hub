import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { INQUIRY_STATUSES } from "@/lib/admin/types";
import { EmptyState, FilterToolbar, PageHeading, RowLinkAction, SearchInput, SelectFilter, SummaryStrip, Table, Tag, Td, abtn, relative } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/inquiries/")({
  head: adminHead("Inquiries", "Public inquiries, qualified and routed to the right partner."),
  component: Inquiries,
});

function Inquiries() {
  const admin = useAdmin();
  const [status, setStatus] = useState("All");
  const [query, setQuery] = useState("");

  const items = admin.inquiries
    .filter((i) => (status === "All" ? true : i.status === status))
    .filter((i) => (query ? `${i.subject} ${i.organisation} ${i.country}`.toLowerCase().includes(query.toLowerCase()) : true))
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));

  return (
    <>
      <PageHeading
        eyebrow="Partnerships / Inquiries"
        title="Inquiries"
        description="Every inquiry ends somewhere: routed, answered or closed with a reason."
      />

      <FilterToolbar search={<SearchInput value={query} onChange={setQuery} label="Search inquiries" placeholder="Subject, organisation, country" />}>
        <SelectFilter label="Status" value={status === "All" ? "" : status} onChange={(value) => setStatus(value || "All")} options={INQUIRY_STATUSES} />
      </FilterToolbar>
      <SummaryStrip items={[
        { value: admin.inquiries.length, label: "Total inquiries" },
        { value: admin.inquiries.filter((i) => i.status === "New").length, label: "New" },
        { value: admin.inquiries.filter((i) => ["Under review", "Ready to route", "Forwarded", "In discussion"].includes(i.status)).length, label: "In progress" },
        { value: admin.inquiries.filter((i) => i.nextAction && !["Completed", "Closed"].includes(i.status)).length, label: "Needs follow-up" },
        { value: admin.inquiries.filter((i) => ["Completed", "Closed"].includes(i.status)).length, label: "Completed" },
      ]} />
      <p className="mb-3 text-xs text-muted-foreground">Showing {items.length} inquir{items.length === 1 ? "y" : "ies"}</p>

      {items.length ? (
        <Table caption="Partnership inquiries" head={["Requester", "Organisation", "Category", "Request", "Status", "Assigned to", "Next action", ""]}>
          {items.map((i) => (
            <tr key={i.id} className="group hover:bg-muted/35">
              <Td><Link to="/admin/inquiries/$id" params={{ id: i.id }} className="font-semibold hover:text-primary">{i.requesterName}</Link><span className="block text-xs text-muted-foreground">{i.reference} · {relative(i.receivedAt)}</span></Td>
              <Td className="text-xs text-muted-foreground">{i.organisation}<span className="block">{i.country}</span></Td>
              <Td><Tag tone="quiet">{i.category}</Tag></Td>
              <Td className="max-w-xs text-xs text-ink">{i.subject}</Td>
              <Td><Tag tone={i.status === "New" ? "alert" : "quiet"}>{i.status}</Tag></Td>
              <Td className="text-xs text-muted-foreground">{i.assignedTo ?? "Unassigned"}</Td>
              <Td className="max-w-xs text-xs text-muted-foreground">{i.nextAction ?? "Decide how this should be handled"}</Td>
              <Td><RowLinkAction to="/admin/inquiries/$id" params={{ id: i.id }} label={`Open inquiry from ${i.requesterName}`} /></Td>
            </tr>
          ))}
        </Table>
      ) : (
        <EmptyState
          title="No inquiries match these filters."
          action={
            <button
              type="button"
              className={abtn.secondary}
              onClick={() => {
                setStatus("All");
                setQuery("");
              }}
            >
              Clear filters
            </button>
          }
        />
      )}
    </>
  );
}
