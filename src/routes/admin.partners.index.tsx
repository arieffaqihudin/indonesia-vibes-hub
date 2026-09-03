import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { PARTNER_TYPES, RELATIONSHIP_STATUSES } from "@/lib/admin/types";
import { Card, EmptyState, PageHeading, SearchInput, SelectFilter, Tag, abtn, dateFmt } from "@/components/admin/primitives";

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
        eyebrow="Partnerships"
        title="Partners"
        description="A relationship record, not a sales pipeline: who they are, what they work on, and how contact is made."
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="w-full max-w-xs">
          <SearchInput value={query} onChange={setQuery} label="Search partners" placeholder="Name, country or expertise" />
        </div>
        <div className="w-full max-w-xs">
          <SelectFilter label="Type" value={type} onChange={setType} options={PARTNER_TYPES} />
        </div>
        <div className="w-full max-w-xs">
          <SelectFilter label="Relationship" value={status} onChange={setStatus} options={RELATIONSHIP_STATUSES} />
        </div>
      </div>

      {partners.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {partners.map((p) => (
            <Card key={p.id}>
              <div className="flex flex-wrap items-center gap-2">
                <Tag tone="quiet">{p.type}</Tag>
                <Tag tone={p.relationshipStatus === "Strategic" ? "alert" : "default"}>{p.relationshipStatus}</Tag>
              </div>
              <h2 className="mt-2 font-display text-lg text-ink">
                <Link to="/admin/partners/$id" params={{ id: p.id }} className="hover:text-primary">
                  {p.name}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {p.city}, {p.country}
              </p>
              <p className="mt-2 text-sm text-ink">{p.expertise.slice(0, 3).join(" · ")}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Last interaction {p.lastInteraction ? dateFmt(p.lastInteraction) : "not recorded"}
                {p.nextFollowUp ? ` · next follow-up ${dateFmt(p.nextFollowUp)}` : ""}
              </p>
            </Card>
          ))}
        </div>
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
