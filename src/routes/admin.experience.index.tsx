import { useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { useKept } from "@/lib/cms/kept";
import { adminHead } from "@/lib/admin/head";
import { formatWhen, useCms } from "@/lib/cms/store";
import { useOptions } from "@/lib/cms/options";
import { matches, stringSearch, uniq } from "@/lib/cms/search";
import { CMS_STATUSES, TYPE_LABEL, editPath, type CmsRecord } from "@/lib/cms/types";
import { DataList, type Column } from "@/components/cms/DataList";
import { EmptyState, NO_DATA, PageHeader, StatusBadge, Tabs, Toggle, btn, inputClass } from "@/components/cms/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/experience/")({
  validateSearch: stringSearch,
  head: adminHead("Experience", "Manage events, places and Indonesia Around the World."),
  component: Experience,
});

type Tab = "events" | "places" | "world";

function Experience() {
  const search = Route.useSearch();
  const [tab, setTab] = useState<Tab>((search["tab"] as Tab) ?? "events");
  const cta = tab === "places"
    ? <Link to="/admin/experience/$id" params={{ id: "new" }} search={{ type: "place" }} className={btn.primary}><Plus className="h-4 w-4" />New Place</Link>
    : tab === "events" ? <Link to="/admin/experience/$id" params={{ id: "new" }} search={{ type: "event" }} className={btn.primary}><Plus className="h-4 w-4" />New Event</Link> : null;
  return <>
    <PageHeader title="Experience" actions={cta} />
    <Tabs<Tab> value={tab} onChange={setTab} tabs={[{ id: "events", label: "Events" }, { id: "places", label: "Places" }, { id: "world", label: "Around the World" }]} />
    {tab === "events" ? <Events missingOnly={search["missing"] === "1"} /> : tab === "places" ? <Places /> : <World />}
  </>;
}

function Events({ missingOnly }: { missingOnly: boolean }) {
  const cms = useCms();
  const navigate = useNavigate();
  const [q, setQ] = useKept("admin.experience.index:37", "");
  const [type, setType] = useKept("admin.experience.index:38", "");
  const [status, setStatus] = useKept("admin.experience.index:39", "");
  const [when, setWhen] = useState(missingOnly ? "Missing information" : "");
  const today = new Date().toISOString().slice(0, 10);
  const all = cms.byType("event");
  const missing = (r: CmsRecord) => Boolean(r.fields["missing"] || !r.image || !r.summary);
  const rows = all.filter((r) => (!q || matches(r.title, q)) && (!type || r.fields["eventType"] === type) && (!status || r.status === status)
    && (!when || (when === "Upcoming" ? (r.fields["startDate"] ?? "") >= today : when === "Past" ? (r.fields["startDate"] ?? "") < today : missing(r))))
    .sort((a, b) => (b.fields["startDate"] ?? "").localeCompare(a.fields["startDate"] ?? ""));
  const columns: Column<CmsRecord>[] = [
    { key: "title", label: "Event", render: (r) => <span className="flex items-center gap-2">{r.title || "Untitled"}{missing(r) ? <span className="h-1.5 w-1.5 rounded-full bg-primary" title="Missing information" /> : null}</span> },
    { key: "date", label: "Date", render: (r) => formatWhen(r.fields["startDate"]) },
    { key: "location", label: "Location", render: (r) => [r.fields["location"], r.fields["country"]].filter(Boolean).join(", ") || "—", priority: 2 },
    { key: "type", label: "Type", render: (r) => r.fields["eventType"] || "—", priority: 3 },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "views", label: "Views", render: () => NO_DATA, priority: 3 },
    { key: "updated", label: "Updated", render: (r) => formatWhen(r.updatedAt), priority: 3 },
  ];
  return <DataList rows={rows} columns={columns} onOpen={(r) => void navigate({ to: "/admin/experience/$id", params: { id: r.id } })} search={q} onSearch={setQ} searchPlaceholder="Search events…"
    mobileMeta={(r) => <><StatusBadge status={r.status} /><span>{formatWhen(r.fields["startDate"])}</span><span>{r.fields["country"]}</span></>}
    filters={[
      { label: "When", value: when, options: ["Upcoming", "Past", "Missing information"], onChange: setWhen },
      { label: "Type", value: type, options: uniq(all.map((r) => r.fields["eventType"])), onChange: setType },
      { label: "Status", value: status, options: [...CMS_STATUSES], onChange: setStatus },
    ]}
    empty={<EmptyState title="No events found." />} />;
}

function Places() {
  const cms = useCms();
  const options = useOptions();
  const navigate = useNavigate();
  const [q, setQ] = useKept("admin.experience.index:70", "");
  const [type, setType] = useKept("admin.experience.index:71", "");
  const [country, setCountry] = useKept("admin.experience.index:72", "");
  const all = cms.byType("place");
  const rows = all.filter((r) => (!q || matches(r.title, q)) && (!type || r.fields["placeType"] === type) && (!country || r.fields["country"] === country)).sort((a, b) => a.title.localeCompare(b.title));
  const columns: Column<CmsRecord>[] = [
    { key: "name", label: "Place", render: (r) => r.title || "Untitled" },
    { key: "type", label: "Type", render: (r) => r.fields["placeType"] || "—", priority: 2 },
    { key: "location", label: "Location", render: (r) => [r.fields["location"], r.fields["country"]].filter(Boolean).join(", ") || "—", priority: 2 },
    { key: "heritage", label: "Related Heritage", render: (r) => (r.relations.heritage ?? []).map((id) => options.heritage.find((h) => h.id === id)?.label).filter(Boolean).join(", ") || "—", priority: 3 },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "views", label: "Views", render: () => NO_DATA, priority: 3 },
    { key: "updated", label: "Updated", render: (r) => formatWhen(r.updatedAt), priority: 3 },
  ];
  return <DataList rows={rows} columns={columns} onOpen={(r) => void navigate({ to: "/admin/experience/$id", params: { id: r.id } })} search={q} onSearch={setQ} searchPlaceholder="Search places…"
    filters={[{ label: "Type", value: type, options: uniq(all.map((r) => r.fields["placeType"])), onChange: setType }, { label: "Country", value: country, options: uniq(all.map((r) => r.fields["country"])), onChange: setCountry }]}
    empty={<EmptyState title="No places found." />} />;
}

/** A management view over existing records outside Indonesia — no separate data. */
function World() {
  const cms = useCms();
  const navigate = useNavigate();
  const [country, setCountry] = useKept("admin.experience.index:93", "");
  const [type, setType] = useKept("admin.experience.index:94", "");
  const items = cms.byType("event", "place", "organisation", "collaboration").filter((r) => {
    const countries = (r.fields["countries"] ?? r.fields["country"] ?? "").split(",").map((c) => c.trim()).filter(Boolean);
    return countries.some((c) => c !== "Indonesia");
  });
  const countriesOf = (r: CmsRecord) => (r.fields["countries"] ?? r.fields["country"] ?? "").split(",").map((c) => c.trim()).filter((c) => c && c !== "Indonesia");
  const rows = items.filter((r) => (!country || countriesOf(r).includes(country)) && (!type || TYPE_LABEL[r.type].one === type));
  const onMap = rows.filter((r) => r.fields["lat"] && r.fields["lng"]);
  const visible = (r: CmsRecord) => r.fields["worldVisible"] !== "hidden";

  return <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Everything here comes from existing Events, Places, Organisations and Collaborations outside Indonesia. Edit the original record to change details.</p>
    <div className="overflow-hidden rounded-lg border border-border bg-sand">
      <svg viewBox="0 0 1000 480" className="h-auto w-full" role="img" aria-label="Map preview">
        {[...Array(11)].map((_, i) => <line key={`v${i}`} x1={i * 100} y1={0} x2={i * 100} y2={480} className="stroke-border" strokeWidth={1} />)}
        {[...Array(7)].map((_, i) => <line key={`h${i}`} x1={0} y1={i * 80} x2={1000} y2={i * 80} className="stroke-border" strokeWidth={1} />)}
        {onMap.map((r) => { const x = ((Number(r.fields["lng"]) + 180) / 360) * 1000; const y = ((90 - Number(r.fields["lat"])) / 180) * 480; return <g key={r.id} className="cursor-pointer" onClick={() => void navigate({ to: editPath(r.type), params: { id: r.id } } as never)}><title>{r.title}</title><circle cx={x} cy={y} r={7} className={cn(visible(r) ? "fill-primary" : "fill-muted-foreground/40")} opacity={0.85} /></g>; })}
      </svg>
    </div>
    <div className="flex flex-wrap gap-2">
      <select aria-label="Country" value={country} onChange={(e) => setCountry(e.target.value)} className={cn(inputClass, "w-auto")}><option value="">Country: All</option>{uniq(items.flatMap(countriesOf)).map((c) => <option key={c}>{c}</option>)}</select>
      <select aria-label="Type" value={type} onChange={(e) => setType(e.target.value)} className={cn(inputClass, "w-auto")}><option value="">Type: All</option>{["Event", "Place", "Organisation", "Collaboration"].map((c) => <option key={c}>{c}</option>)}</select>
    </div>
    <ul className="divide-y divide-border rounded-lg border border-border bg-background">
      {rows.map((r) => <li key={r.id} className="flex flex-wrap items-center gap-3 px-4 py-2.5">
        <button type="button" onClick={() => void navigate({ to: editPath(r.type), params: { id: r.id } } as never)} className="min-w-0 flex-1 text-left"><span className="block truncate text-sm font-medium text-ink hover:text-primary">{r.title}</span><span className="block text-xs text-muted-foreground">{TYPE_LABEL[r.type].one} · {countriesOf(r).join(", ")}</span></button>
        <div className="w-44"><Toggle label="Show on map" checked={visible(r)} onChange={(on) => cms.updateRecord(r.id, { fields: { ...r.fields, worldVisible: on ? "" : "hidden" } })} /></div>
      </li>)}
      {!rows.length ? <li className="px-4 py-8 text-center text-sm text-muted-foreground">Nothing matches these filters.</li> : null}
    </ul>
  </div>;
}
