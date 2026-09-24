import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { possibleDuplicates } from "@/lib/admin/selectors";
import { CONTENT_STATUS, kindLabel } from "@/lib/admin/types";
import { EmptyState, FilterToolbar, PageHeading, RowActions, SearchInput, StatusPill, SummaryStrip, TabBar, Table, Tag, Td, abtn, relative } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/submissions")({
  head: adminHead("Submissions", "Screen incoming contributor submissions before they enter editorial review."),
  component: Submissions,
});

const INCOMING = ["submitted", "initial_review"] as const;

function Submissions() {
  const admin = useAdmin();
  const [query, setQuery] = useState("");
  const [view, setView] = useState("new");

  const items = useMemo(
    () =>
      admin.content
        .filter((c) => (INCOMING as readonly string[]).includes(c.status) && c.contributor)
        .filter((c) => (query ? `${c.title} ${c.organisation ?? ""}`.toLowerCase().includes(query.toLowerCase()) : true))
        .sort((a, b) => a.stageSince.localeCompare(b.stageSince)),
    [admin.content, query],
  );

  return (
    <>
      <PageHeading
        eyebrow="Editorial / Submissions"
        title="Submissions"
        description="Contributor submissions arrive here for screening. Nothing is published from this screen."
      />
      <TabBar label="Submission status" tabs={[{ id: "new", label: "New" }, { id: "review", label: "In Review" }, { id: "changes", label: "Needs Changes" }, { id: "accepted", label: "Accepted" }, { id: "declined", label: "Declined" }]} active={view} onChange={setView} />
      <FilterToolbar search={<SearchInput value={query} onChange={setQuery} label="Search submissions" placeholder="Title or organisation" />} />
      <SummaryStrip items={[
        { value: items.length, label: "Total" },
        { value: items.filter((item) => item.status === "submitted").length, label: "New" },
        { value: items.filter((item) => item.status === "initial_review").length, label: "In review" },
        { value: admin.content.filter((item) => item.status === "revision_requested" && item.contributor).length, label: "Needs changes" },
        { value: admin.content.filter((item) => item.status === "approved" && item.contributor).length, label: "Accepted" },
      ]} />
      <p className="mb-3 text-xs text-muted-foreground">Showing {items.length} submission{items.length === 1 ? "" : "s"}</p>

      {items.length ? (
        <Table caption="Contributor submissions" head={["Submission", "Type", "Contributor", "Waiting", "Possible issue", "Status", ""]}>
          {items.map((item) => {
            const duplicates = possibleDuplicates(item.title, admin.content).filter((d) => d.item.id !== item.id);
            return (
              <tr key={item.id} className="group hover:bg-muted/35">
                <Td><Link to="/admin/content/$id" params={{ id: item.id }} className="font-semibold hover:text-primary">{item.title}</Link><span className="block text-xs text-muted-foreground">{CONTENT_STATUS[item.status].meaning}</span></Td>
                <Td><Tag tone="quiet">{kindLabel(item.kind)}</Tag></Td>
                <Td className="text-xs text-muted-foreground">{item.contributor}{item.organisation ? <span className="block">{item.organisation}</span> : null}</Td>
                <Td className="text-xs text-muted-foreground">{relative(item.stageSince)}</Td>
                <Td className="max-w-xs text-xs text-clay">{duplicates.length ? `Possible match: ${duplicates[0]?.item.title ?? "existing record"}` : item.priority !== "Normal" ? item.priority : "—"}</Td>
                <Td><StatusPill status={item.status} /></Td>
                <Td><RowActions label={`Actions for ${item.title}`} actions={[{ label: "Open record", onSelect: () => window.location.assign(`/admin/content/${item.id}`) }, ...(item.status === "submitted" ? [{ label: "Start screening", onSelect: () => admin.transition(item.id, "initial_review") }] : [])]} /></Td>
              </tr>
            );
          })}
        </Table>
      ) : (
        <EmptyState
          title="No submissions waiting."
          hint="New contributor submissions appear here as soon as they are sent for review."
          action={
            <Link to="/admin/content" className={abtn.secondary}>
              Go to the content library
            </Link>
          }
        />
      )}
    </>
  );
}
