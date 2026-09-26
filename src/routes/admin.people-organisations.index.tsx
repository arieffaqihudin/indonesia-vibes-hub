import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Plus } from "lucide-react";

import { useKept } from "@/lib/cms/kept";
import { adminHead } from "@/lib/admin/head";
import { formatWhen, useCms } from "@/lib/cms/store";
import { useOptions } from "@/lib/cms/options";
import { matches, stringSearch, uniq } from "@/lib/cms/search";
import { CMS_STATUSES, TYPE_LABEL, type CmsRecord, type CmsType } from "@/lib/cms/types";
import { DataList, type Column } from "@/components/cms/DataList";
import { EmptyState, NO_DATA, PageHeader, StatusBadge, Tabs, btn } from "@/components/cms/ui";

export const Route = createFileRoute("/admin/people-organisations/")({
  validateSearch: stringSearch,
  head: adminHead("People & Organisations", "Manage people, communities, institutions and organisations."),
  component: Directory,
});

type Tab = "all" | "person" | "community" | "organisation";
const TYPE_NAME: Record<string, string> = { person: "Person", community: "Community", organisation: "Institution / Organisation" };

function NewMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useKept("admin.people-organisations.index:23", false);
  return <div className="relative">
    <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className={btn.primary}><Plus className="h-4 w-4" />New<ChevronDown className="h-3.5 w-3.5" /></button>
    {open ? <>
      <button type="button" aria-label="Close" className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} />
      <div className="absolute top-full right-0 z-50 mt-1 w-60 rounded-md border border-border bg-background p-1 shadow-lg">
        {(["person", "community", "organisation"] as CmsType[]).map((t) => <button key={t} type="button" onClick={() => void navigate({ to: "/admin/people-organisations/$id", params: { id: "new" }, search: { type: t } })} className="flex h-9 w-full items-center rounded px-3 text-left text-sm text-ink hover:bg-sand">{TYPE_NAME[t]}</button>)}
      </div>
    </> : null}
  </div>;
}

function Directory() {
  const cms = useCms();
  const navigate = useNavigate();
  const options = useOptions();
  const search = Route.useSearch();
  const [tab, setTab] = useKept<Tab>("admin.people-organisations.tab", (search["tab"] as Tab) ?? "all");
  const [q, setQ] = useKept("admin.people-organisations.index:41", "");
  const [topic, setTopic] = useKept("admin.people-organisations.index:42", "");
  const [heritage, setHeritage] = useKept("admin.people-organisations.index:43", "");
  const [location, setLocation] = useKept("admin.people-organisations.index:44", "");
  const [status, setStatus] = useKept("admin.people-organisations.index:45", "");
  const all = cms.byType("person", "community", "organisation");
  const heritageName = (id: string) => options.heritage.find((h) => h.id === id)?.label;
  const heritageOptions = uniq(all.flatMap((r) => (r.relations.heritage ?? []).map(heritageName)));
  const rows = all.filter((r) => (tab === "all" || r.type === tab) && (!q || matches(r.title, q)) && (!topic || (r.relations.topics ?? []).includes(topic)) && (!heritage || (r.relations.heritage ?? []).some((h) => heritageName(h) === heritage)) && (!location || r.fields["location"] === location) && (!status || r.status === status)).sort((a, b) => a.title.localeCompare(b.title));
  const count = (t: CmsType) => all.filter((r) => r.type === t).length;
  const columns: Column<CmsRecord>[] = [
    { key: "name", label: "Name", render: (r) => <span className="flex items-center gap-2.5">{r.image ? <img src={r.image} alt="" className="h-8 w-8 rounded-full object-cover" /> : <span className="h-8 w-8 rounded-full bg-muted" />}{r.title || "Untitled"}</span> },
    { key: "type", label: "Type", render: (r) => r.type === "organisation" ? (r.fields["orgType"] || "Organisation") : TYPE_LABEL[r.type].one, priority: 2 },
    { key: "focus", label: "Focus", render: (r) => <span className="line-clamp-1 whitespace-normal">{r.fields["role"] || r.summary || "—"}</span>, priority: 3 },
    { key: "location", label: "Location", render: (r) => r.fields["location"] || "—", priority: 3 },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "views", label: "Views", render: () => NO_DATA, priority: 3 },
    { key: "updated", label: "Updated", render: (r) => formatWhen(r.updatedAt), priority: 3 },
  ];
  return <>
    <PageHeader title="People & Organisations" actions={<NewMenu />} />
    <Tabs<Tab> value={tab} onChange={setTab} tabs={[{ id: "all", label: "All", count: all.length }, { id: "person", label: "People", count: count("person") }, { id: "community", label: "Communities", count: count("community") }, { id: "organisation", label: "Institutions & Organisations", count: count("organisation") }]} />
    <DataList resetKey={tab} rows={rows} columns={columns} onOpen={(r) => void navigate({ to: "/admin/people-organisations/$id", params: { id: r.id } })} search={q} onSearch={setQ} searchPlaceholder="Search by name…"
      mobileMeta={(r) => <><StatusBadge status={r.status} /><span>{TYPE_LABEL[r.type].one}</span><span>{r.fields["location"]}</span></>}
      filters={[
        { label: "Topic", value: topic, options: uniq(all.flatMap((r) => r.relations.topics ?? [])), onChange: setTopic },
        { label: "Heritage", value: heritage, options: heritageOptions, onChange: setHeritage },
        { label: "Location", value: location, options: uniq(all.map((r) => r.fields["location"])), onChange: setLocation },
        { label: "Status", value: status, options: [...CMS_STATUSES], onChange: setStatus },
      ]}
      empty={<EmptyState title="Nothing here yet." text="Add a person, community or organisation." />} />
  </>;
}
