import { createFileRoute, Link } from "@tanstack/react-router";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { FilterToolbar, PageHeading, SearchInput, SelectFilter, StatusIndicator, Table, Td, abtn, dateFmt } from "@/components/admin/primitives";
import { useCollections } from "@/lib/collections";

export const Route = createFileRoute("/admin/collections/")({ component: Collections });
function Collections() {
  const [collections] = useCollections();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const needle = query.toLowerCase().trim();
  const visible = collections.filter((item) => (!needle || `${item.title} ${item.introduction}`.toLowerCase().includes(needle)) && (!status || item.status === status));
  return <>
    <PageHeading eyebrow="Understand Indonesia / Collections" title="Collections" description="Curate deliberate reading journeys from existing Articles." actions={<Link to="/admin/collections/$id" params={{ id: "new" }} className={abtn.primary}>+ New Collection</Link>} />
    <FilterToolbar search={<SearchInput value={query} onChange={setQuery} label="Search collections" placeholder="Search collections" />}><SelectFilter label="Status" value={status} onChange={setStatus} options={["Draft", "Published", "Archived"]} /></FilterToolbar>
    <Table caption="Collections" head={["Collection", "Stories", "Featured", "Status", "Updated", "Action"]}>
      {visible.map((item) => <tr key={item.id} className="group"><Td><Link to="/admin/collections/$id" params={{ id: item.id }} className="font-medium hover:text-primary">{item.title}</Link><span className="mt-1 block max-w-lg truncate text-xs text-muted-foreground">{item.introduction}</span></Td><Td>{item.storyIds.length} {item.storyIds.length === 1 ? "story" : "stories"}</Td><Td><span aria-label={item.featured ? "Featured" : "Not featured"}>{item.featured ? "★" : "—"}</span></Td><Td><StatusIndicator attention={item.status !== "Published"}>{item.status}</StatusIndicator></Td><Td>{dateFmt(item.updatedAt)}</Td><Td><Link to="/admin/collections/$id" params={{ id: item.id }} className={abtn.quiet} aria-label={`Edit ${item.title}`}><MoreHorizontal className="h-4 w-4" /></Link></Td></tr>)}
    </Table>
  </>;
}