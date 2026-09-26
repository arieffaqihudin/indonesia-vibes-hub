import { useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { useKept } from "@/lib/cms/kept";
import { adminHead } from "@/lib/admin/head";
import { formatWhen, useCms } from "@/lib/cms/store";
import { matches, stringSearch, uniq } from "@/lib/cms/search";
import { CMS_STATUSES, REQUEST_STATUSES, type CmsRecord, type CmsRequest } from "@/lib/cms/types";
import { DataList, type Column } from "@/components/cms/DataList";
import { EmptyState, PageHeader, StatusBadge, Tabs, btn } from "@/components/cms/ui";

export const Route = createFileRoute("/studio/collaborations/")({
  validateSearch: stringSearch,
  head: adminHead("Collaborations", "Manage collaborations and respond to collaboration requests."),
  component: Collaborations,
});

type Tab = "collaborations" | "requests";

function Collaborations() {
  const cms = useCms();
  const search = Route.useSearch();
  const [tab, setTab] = useState<Tab>(search["tab"] === "requests" ? "requests" : "collaborations");
  const unread = cms.requests.filter((r) => r.status === "New").length;
  return <>
    <PageHeader title="Collaborations" actions={tab === "collaborations" ? <Link to="/studio/collaborations/$id" params={{ id: "new" }} className={btn.primary}><Plus className="h-4 w-4" />New Collaboration</Link> : null} />
    <Tabs<Tab> value={tab} onChange={setTab} tabs={[{ id: "collaborations", label: "Collaborations" }, { id: "requests", label: "Requests", ...(unread ? { count: unread } : {}) }]} />
    {tab === "collaborations" ? <List /> : <Requests />}
  </>;
}

function List() {
  const cms = useCms();
  const navigate = useNavigate();
  const [q, setQ] = useKept("admin.collaborations.index:34", "");
  const [status, setStatus] = useKept("admin.collaborations.index:35", "");
  const [story, setStory] = useKept("admin.collaborations.index:36", "");
  const all = cms.byType("collaboration");
  const rows = all.filter((r) => (!q || matches(`${r.title} ${r.fields["partners"] ?? ""}`, q)) && (!status || r.status === status) && (!story || (story === "On") === (r.fields["publicStory"] === "on"))).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const columns: Column<CmsRecord>[] = [
    { key: "title", label: "Title", render: (r) => r.title || "Untitled" },
    { key: "countries", label: "Countries", render: (r) => r.fields["countries"] || "—", priority: 2 },
    { key: "partners", label: "Partners", render: (r) => <span className="line-clamp-1 whitespace-normal">{r.fields["partners"] || "—"}</span>, priority: 3 },
    { key: "visibility", label: "Visibility", render: (r) => r.fields["visibility"] || "Public", priority: 3 },
    { key: "story", label: "Public Story", render: (r) => (r.fields["publicStory"] === "on" ? <span className="font-medium text-primary">On</span> : "Off"), priority: 2 },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "updated", label: "Updated", render: (r) => formatWhen(r.updatedAt), priority: 3 },
  ];
  return <DataList rows={rows} columns={columns} onOpen={(r) => void navigate({ to: "/studio/collaborations/$id", params: { id: r.id } })} search={q} onSearch={setQ} searchPlaceholder="Search collaborations or partners…"
    filters={[{ label: "Status", value: status, options: [...CMS_STATUSES], onChange: setStatus }, { label: "Public Story", value: story, options: ["On", "Off"], onChange: setStory }]}
    empty={<EmptyState filtered={Boolean(all.length)} title={all.length ? "No collaborations match these filters." : "No collaborations yet."} text={all.length ? "Try another search or adjust your filters." : "Add your first collaboration."} />} />;
}

function Requests() {
  const cms = useCms();
  const navigate = useNavigate();
  const [q, setQ] = useKept("admin.collaborations.index:56", "");
  const [status, setStatus] = useKept("admin.collaborations.index:57", "");
  const [intent, setIntent] = useKept("admin.collaborations.index:58", "");
  const rows = cms.requests.filter((r) => (!q || matches(`${r.name} ${r.organisation} ${r.subject}`, q)) && (!status || r.status === status) && (!intent || r.intent === intent)).sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
  const columns: Column<CmsRequest>[] = [
    { key: "name", label: "Name", render: (r) => <span className={r.status === "New" ? "font-semibold" : ""}>{r.name}</span> },
    { key: "org", label: "Organisation", render: (r) => r.organisation, priority: 2 },
    { key: "country", label: "Country", render: (r) => r.country, priority: 3 },
    { key: "intent", label: "Intent", render: (r) => r.intent, priority: 3 },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "received", label: "Received", render: (r) => formatWhen(r.receivedAt), priority: 2 },
  ];
  return <DataList rows={rows} columns={columns} onOpen={(r) => void navigate({ to: "/studio/collaborations/requests/$id", params: { id: r.id } })} search={q} onSearch={setQ} searchPlaceholder="Search requests…"
    mobileMeta={(r) => <><StatusBadge status={r.status} /><span>{r.organisation}</span><span>{formatWhen(r.receivedAt)}</span></>}
    filters={[{ label: "Status", value: status, options: [...REQUEST_STATUSES], onChange: setStatus }, { label: "Intent", value: intent, options: uniq(cms.requests.map((r) => r.intent)), onChange: setIntent }]}
    empty={<EmptyState filtered={Boolean(cms.requests.length)} title={cms.requests.length ? "No requests match these filters." : "No requests yet."} text={cms.requests.length ? "Try another search or adjust your filters." : "Requests sent from the Collaborate page appear here."} />} />;
}
