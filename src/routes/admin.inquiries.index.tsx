import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { INQUIRY_STATUSES } from "@/lib/admin/types";
import { Card, EmptyState, Metric, PageHeading, SearchInput, SelectFilter, Tag, abtn, relative } from "@/components/admin/primitives";

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
        eyebrow="Partnerships"
        title="Inquiries"
        description="Every inquiry ends somewhere: routed, answered or closed with a reason."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Metric value={admin.inquiries.filter((i) => i.status === "New").length} label="New" />
        <Metric value={admin.inquiries.filter((i) => i.status === "Ready to route").length} label="Ready to route" />
        <Metric value={admin.inquiries.filter((i) => i.status === "Need more information").length} label="Awaiting a reply" />
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="w-full max-w-xs">
          <SearchInput value={query} onChange={setQuery} label="Search inquiries" placeholder="Subject, organisation, country" />
        </div>
        <div className="w-full max-w-xs">
          <SelectFilter label="Status" value={status} onChange={setStatus} options={["All", ...INQUIRY_STATUSES]} />
        </div>
      </div>

      {items.length ? (
        <ul className="space-y-3">
          {items.map((i) => (
            <li key={i.id}>
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag tone={i.status === "New" ? "alert" : "quiet"}>{i.status}</Tag>
                      <span className="text-xs text-muted-foreground">{i.reference}</span>
                      <Tag tone="quiet">{i.category}</Tag>
                    </div>
                    <h2 className="mt-2 font-display text-lg text-ink">
                      <Link to="/admin/inquiries/$id" params={{ id: i.id }} className="hover:text-primary">
                        {i.subject}
                      </Link>
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {i.organisation} · {i.country} · received {relative(i.receivedAt)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Next: {i.nextAction ?? "Decide how this should be handled"}
                    </p>
                  </div>
                  <Link to="/admin/inquiries/$id" params={{ id: i.id }} className={abtn.secondary}>
                    Open
                  </Link>
                </div>
              </Card>
            </li>
          ))}
        </ul>
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
