import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { PARTNER_TYPES, RELATIONSHIP_STATUSES } from "@/lib/admin/types";
import { EmptyState, FilterToolbar, PageHeading, RowLinkAction, SearchInput, SelectFilter, SummaryStrip, Table, Tag, Td, abtn, dateFmt } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/partners/")({
  head: adminHead("Partners", "Institutions, communities and organisations the team works with."),
  component: Partners,
});

function Partners() {
  const admin = useAdmin();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const partners = admin.partners
    .filter((p) => (!type ? true : p.type === type))
    .filter((p) => (!status ? true : p.relationshipStatus === status))
    .filter((p) => (query ? `${p.name} ${p.country} ${p.expertise.join(" ")}`.toLowerCase().includes(query.toLowerCase()) : true));

  return (
    <>
      <PageHeading
        eyebrow="Partnerships / Partners"
        title="Partners"
        description="A relationship record, not a sales pipeline: who they are, what they work on, and how contact is made."
      />

      <FilterToolbar search={<SearchInput value={query} onChange={setQuery} label="Search partners" placeholder="Name, country or expertise" />}>
        <SelectFilter label="Type" value={type} onChange={setType} options={PARTNER_TYPES} />
        <SelectFilter label="Relationship" value={status} onChange={setStatus} options={RELATIONSHIP_STATUSES} />
      </FilterToolbar>
      <SummaryStrip items={[
        { value: admin.partners.length, label: "Total partners" },
        { value: admin.partners.filter((p) => p.relationshipStatus === "Active").length, label: "Active" },
        { value: admin.partners.filter((p) => p.relationshipStatus === "Strategic").length, label: "Strategic" },
        { value: admin.partners.filter((p) => p.nextFollowUp).length, label: "Follow-up recorded" },
      ]} />
      <p className="mb-3 text-xs text-muted-foreground">Showing {partners.length} partner{partners.length === 1 ? "" : "s"}</p>

      {partners.length ? (
        <Table caption="Partner directory" head={["Partner", "Type", "Country", "Main focus", "Status", "Last interaction", ""]}>
          {partners.map((p) => (
            <tr key={p.id} className="group hover:bg-muted/35">
              <Td><Link to="/admin/partners/$id" params={{ id: p.id }} className="font-semibold hover:text-primary">{p.name}</Link><span className="block text-xs text-muted-foreground">{p.city}</span></Td>
              <Td><Tag tone="quiet">{p.type}</Tag></Td>
              <Td className="text-xs text-muted-foreground">{p.country}</Td>
              <Td className="max-w-xs text-xs text-ink">{p.expertise.slice(0, 3).join(" · ") || "—"}</Td>
              <Td><Tag tone={p.relationshipStatus === "Strategic" ? "alert" : "quiet"}>{p.relationshipStatus}</Tag></Td>
              <Td className="text-xs text-muted-foreground">{p.lastInteraction ? dateFmt(p.lastInteraction) : "Not recorded"}</Td>
              <Td><RowLinkAction to="/admin/partners/$id" params={{ id: p.id }} label={`Open ${p.name}`} /></Td>
            </tr>
          ))}
        </Table>
      ) : (
        <EmptyState
          title="No partners match these filters."
          action={
            <button
              type="button"
              className={abtn.secondary}
              onClick={() => {
                setQuery("");
                setType("");
                setStatus("");
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
