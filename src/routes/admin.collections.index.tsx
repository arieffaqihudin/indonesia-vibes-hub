import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { useKept } from "@/lib/cms/kept";
import { adminHead } from "@/lib/admin/head";
import { useCollections, type EditorialCollection } from "@/lib/collections";
import { formatWhen } from "@/lib/cms/store";
import { matches } from "@/lib/cms/search";
import { DataList, type Column } from "@/components/cms/DataList";
import { EmptyState, NO_DATA, PageHeader, StatusBadge, btn } from "@/components/cms/ui";

export const Route = createFileRoute("/admin/collections/")({
  head: adminHead("Collections", "Curate reading journeys from existing articles."),
  component: Collections,
});

function Collections() {
  const [items] = useCollections();
  const navigate = useNavigate();
  const [q, setQ] = useKept("admin.collections.index:19", "");
  const [status, setStatus] = useKept("admin.collections.index:20", "");
  const rows = items.filter((c) => (!q || matches(c.title, q)) && (!status || c.status === status));
  const columns: Column<EditorialCollection>[] = [
    { key: "title", label: "Collection", render: (c) => <span className="flex items-center gap-2.5">{c.image ? <img src={c.image} alt="" className="h-8 w-11 rounded object-cover" /> : null}{c.title || "Untitled"}</span> },
    { key: "stories", label: "Stories", render: (c) => c.storyIds.length },
    { key: "status", label: "Status", render: (c) => <StatusBadge status={c.status} /> },
    { key: "featured", label: "Featured", render: (c) => (c.featured ? <span className="text-primary">Yes</span> : "—"), priority: 2 },
    { key: "views", label: "Views", render: () => NO_DATA, priority: 3 },
    { key: "updated", label: "Updated", render: (c) => formatWhen(c.updatedAt), priority: 3 },
  ];
  const cta = <Link to="/admin/collections/$id" params={{ id: "new" }} className={btn.primary}><Plus className="h-4 w-4" />New Collection</Link>;
  return <>
    <PageHeader title="Collections" actions={cta} />
    <DataList rows={rows} columns={columns} onOpen={(c) => void navigate({ to: "/admin/collections/$id", params: { id: c.id } })} search={q} onSearch={setQ} searchPlaceholder="Search collections…"
      filters={[{ label: "Status", value: status, options: ["Draft", "Published", "Archived"], onChange: setStatus }]}
      empty={<EmptyState filtered={Boolean(items.length)} title={items.length ? "No collections match." : "No collections yet."} text={items.length ? "Try another search or adjust your filters." : "Create your first curated reading journey."} action={items.length ? undefined : cta} />} />
  </>;
}
