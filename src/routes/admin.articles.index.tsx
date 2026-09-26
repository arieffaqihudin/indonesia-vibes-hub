import { useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { useKept } from "@/lib/cms/kept";
import { adminHead } from "@/lib/admin/head";
import { formatWhen, useCms } from "@/lib/cms/store";
import { matches, stringSearch, uniq } from "@/lib/cms/search";
import { CMS_STATUSES, FORMAT_OPTIONS, type CmsRecord } from "@/lib/cms/types";
import { DataList, type Column } from "@/components/cms/DataList";
import { EmptyState, NO_DATA, PageHeader, StatusBadge, btn } from "@/components/cms/ui";

export const Route = createFileRoute("/admin/articles/")({
  validateSearch: stringSearch,
  head: adminHead("Articles", "Write, edit and publish articles."),
  component: Articles,
});

function Articles() {
  const cms = useCms();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [q, setQ] = useKept("admin.articles.index:21", "");
  const [status, setStatus] = useKept("status:" + (search["status"] ?? ""), search["status"] ?? "");
  const [topic, setTopic] = useKept("admin.articles.index:23", "");
  const [format, setFormat] = useKept("admin.articles.index:24", "");
  const [author, setAuthor] = useKept("admin.articles.index:25", "");
  const [source, setSource] = useKept("admin.articles.index:26", "");
  const all = cms.byType("article");
  const rows = all
    .filter((r) => (!q || matches(r.title, q)) && (!status || r.status === status) && (!topic || (r.relations.topics ?? []).includes(topic)) && (!format || r.fields["format"] === format) && (!author || r.author === author) && (!source || r.fields["source"] === source))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const columns: Column<CmsRecord>[] = [
    { key: "title", label: "Article", render: (r) => r.title || "Untitled" },
    { key: "author", label: "Author", render: (r) => r.author ?? "—", priority: 2 },
    { key: "topic", label: "Topic", render: (r) => r.relations.topics?.[0] ?? "—", priority: 3 },
    { key: "format", label: "Format", render: (r) => r.fields["format"] ?? "—", priority: 3 },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "views", label: "Views", render: () => NO_DATA, priority: 3, className: "text-right" },
    { key: "updated", label: "Updated", render: (r) => formatWhen(r.updatedAt), priority: 2 },
  ];

  return <>
    <PageHeader title="Articles" actions={<Link to="/admin/articles/$id" params={{ id: "new" }} className={btn.primary}><Plus className="h-4 w-4" />New Article</Link>} />
    <DataList rows={rows} columns={columns} onOpen={(r) => void navigate({ to: "/admin/articles/$id", params: { id: r.id } })} search={q} onSearch={setQ} searchPlaceholder="Search articles…"
      mobileMeta={(r) => <><StatusBadge status={r.status} /><span>{r.author ?? "No author"}</span><span>{formatWhen(r.updatedAt)}</span></>}
      filters={[
        { label: "Status", value: status, options: [...CMS_STATUSES], onChange: setStatus },
        { label: "Topic", value: topic, options: uniq(all.flatMap((r) => r.relations.topics ?? [])), onChange: setTopic },
        { label: "Format", value: format, options: FORMAT_OPTIONS.map((o) => o.value), onChange: setFormat },
        { label: "Author", value: author, options: uniq(all.map((r) => r.author)), onChange: setAuthor },
        { label: "Source", value: source, options: ["Internal", "By Curation"], onChange: setSource },
      ]}
      empty={<EmptyState title={all.length ? "No articles match these filters." : "No articles yet."} text={all.length ? undefined : "Write your first article."} action={!all.length ? <Link to="/admin/articles/$id" params={{ id: "new" }} className={btn.primary}><Plus className="h-4 w-4" />New Article</Link> : undefined} />} />
  </>;
}
