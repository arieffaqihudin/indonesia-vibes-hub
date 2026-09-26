import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { useKept } from "@/lib/cms/kept";
import { adminHead } from "@/lib/admin/head";
import { useTopics, type TopicDefinition } from "@/lib/topics";
import { formatWhen, useCms } from "@/lib/cms/store";
import { matches } from "@/lib/cms/search";
import { DataList, type Column } from "@/components/cms/DataList";
import { EmptyState, PageHeader, StatusBadge, btn } from "@/components/cms/ui";

export const Route = createFileRoute("/admin/topics/")({
  head: adminHead("Topics", "Manage the topics used to organise articles and heritage."),
  component: Topics,
});

function Topics() {
  const [topics] = useTopics();
  const cms = useCms();
  const navigate = useNavigate();
  const [q, setQ] = useKept("admin.topics.index:20", "");
  const [status, setStatus] = useKept("admin.topics.index:21", "");
  const count = (topic: string, type: "article" | "heritage") => cms.records.filter((r) => r.type === type && (r.relations.topics ?? []).includes(topic)).length;
  const rows = topics.map((t) => ({ ...t, key: t.id })).map((t) => ({ ...t, id: t.slug, name: t.key })).filter((t) => (!q || matches(t.name, q)) && (!status || t.status === status));
  type Row = (typeof rows)[number];
  const columns: Column<Row>[] = [
    { key: "name", label: "Name", render: (t) => t.name },
    { key: "desc", label: "Description", render: (t) => <span className="line-clamp-1 whitespace-normal max-w-md">{t.intro}</span>, priority: 3 },
    { key: "articles", label: "Articles", render: (t) => count(t.name, "article") },
    { key: "heritage", label: "Heritage", render: (t) => count(t.name, "heritage"), priority: 2 },
    { key: "status", label: "Status", render: (t) => <StatusBadge status={t.status} /> },
    { key: "updated", label: "Updated", render: (t) => formatWhen(t.updatedAt), priority: 3 },
  ];
  return <>
    <PageHeader title="Topics" actions={<Link to="/admin/topics/$id" params={{ id: "new" }} className={btn.primary}><Plus className="h-4 w-4" />New Topic</Link>} />
    <DataList<Row> rows={rows} columns={columns} onOpen={(t) => void navigate({ to: "/admin/topics/$id", params: { id: t.slug } })} search={q} onSearch={setQ} searchPlaceholder="Search topics…"
      filters={[{ label: "Status", value: status, options: ["Draft", "Published", "Archived"], onChange: setStatus }]}
      empty={<EmptyState filtered={Boolean(topics.length)} title={topics.length ? "No topics match these filters." : "No topics yet."} text={topics.length ? "Try another search or adjust your filters." : "Add your first topic."} />} />
  </>;
}

export type { TopicDefinition };
