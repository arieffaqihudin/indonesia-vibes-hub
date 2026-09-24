import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { possibleDuplicates } from "@/lib/admin/selectors";
import { CONTENT_STATUS, kindLabel } from "@/lib/admin/types";
import { EmptyState, FilterToolbar, PageHeading, SearchInput, StatusPill, SummaryStrip, Table, Tag, Td, abtn, relative } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/submissions")({
  head: adminHead("Submissions", "Screen incoming contributor submissions before they enter editorial review."),
  component: Submissions,
});

const INCOMING = ["submitted", "initial_review"] as const;

function Submissions() {
  const admin = useAdmin();
  const [query, setQuery] = useState("");

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

      <SummaryStrip items={[
        { value: items.length, label: "Waiting" },
        { value: items.filter((item) => item.status === "submitted").length, label: "New" },
        { value: items.filter((item) => item.status === "initial_review").length, label: "Screening" },
        { value: items.filter((item) => item.priority === "High").length, label: "High priority" },
      ]} />
      <FilterToolbar search={<SearchInput value={query} onChange={setQuery} label="Search submissions" placeholder="Title or organisation" />} />

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
                <Td><div className="flex justify-end gap-1"><Link to="/admin/content/$id" params={{ id: item.id }} className={abtn.quiet}>Open</Link>{item.status === "submitted" ? <button type="button" className={abtn.quiet} onClick={() => admin.transition(item.id, "initial_review")}>Screen</button> : null}</div></Td>
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
