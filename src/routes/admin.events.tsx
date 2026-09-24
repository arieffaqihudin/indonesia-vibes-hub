import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { daysUntil } from "@/lib/admin/types";
import { eventsNeedingVerification } from "@/data/content";
import { EmptyState, FilterToolbar, PageHeading, SearchInput, SelectFilter, StatusPill, SummaryStrip, Table, Tag, Td, abtn, dateFmt } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/events")({
  head: adminHead("Events", "Event records, their dates and what still needs checking before they go live."),
  component: Events,
});

function Events() {
  const admin = useAdmin();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const allEvents = admin.content.filter((c) => c.kind === "event");
  const events = allEvents
    .filter((c) => c.kind === "event")
    .filter((c) => (!status ? true : c.status === status))
    .filter((c) => (query ? `${c.title} ${c.location ?? ""} ${c.fields['venue'] ?? ""}`.toLowerCase().includes(query.toLowerCase()) : true))
    .sort((a, b) => (a.fields['startDate'] ?? "").localeCompare(b.fields['startDate'] ?? ""));

  const upcoming = events.filter((e) => !e.fields['startDate'] || daysUntil(e.fields['startDate']) >= 0);
  const past = events.filter((e) => e.fields['startDate'] && daysUntil(e.fields['startDate']) < 0);
  const unverified = eventsNeedingVerification();

  return (
    <>
      <PageHeading
        eyebrow="Content / Events"
        title="Events"
        description="An event is only useful to a reader if the date, venue and access details are right. Past events stay published as a record."
        actions={
          <Link to="/admin/content/new" search={{ kind: "event" }} className={abtn.primary}>
            New event
          </Link>
        }
      />

      <SummaryStrip items={[
        { value: allEvents.length, label: "Total events" },
        { value: allEvents.filter((e) => !e.fields['startDate'] || daysUntil(e.fields['startDate']) >= 0).length, label: "Upcoming" },
        { value: Math.max(0, allEvents.length - unverified.length), label: "Verified" },
        { value: unverified.length, label: "Needs review" },
      ]} />

      <FilterToolbar search={<SearchInput value={query} onChange={setQuery} label="Search events" placeholder="Search event, venue or location" />}>
        <SelectFilter label="Status" value={status} onChange={setStatus} options={["draft", "submitted", "initial_review", "verification", "approved", "scheduled", "published"]} />
      </FilterToolbar>

      {events.length ? (
        <Table caption="Events" head={["Event", "Date", "Location", "Related topic", "Status", "Public status", ""]}>
          {[...upcoming, ...past].map((event) => {
            const needsReview = unverified.some((item) => item.title === event.title);
            return (
              <tr key={event.id} className="group hover:bg-muted/35">
                <Td><Link to="/admin/content/$id" params={{ id: event.id }} className="font-semibold hover:text-primary">{event.title}</Link><span className="block text-xs text-muted-foreground">{event.fields['venue'] ?? "Venue not recorded"}</span></Td>
                <Td className="text-xs text-muted-foreground">{dateFmt(event.fields['startDate'])}</Td>
                <Td className="text-xs text-muted-foreground">{event.location ?? "—"}</Td>
                <Td className="text-xs text-muted-foreground">{event.topics?.[0] ?? event.themes[0] ?? "—"}</Td>
                <Td>{needsReview ? <Tag tone="alert">Needs verification</Tag> : <Tag tone="quiet">Verified</Tag>}</Td>
                <Td><StatusPill status={event.status} /></Td>
                <Td><Link to="/admin/content/$id" params={{ id: event.id }} className={abtn.quiet}>Open</Link></Td>
              </tr>
            );
          })}
        </Table>
      ) : (
        <EmptyState title="No event records yet." />
      )}

    </>
  );
}
