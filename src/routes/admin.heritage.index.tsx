import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { useKept } from "@/lib/cms/kept";
import { adminHead } from "@/lib/admin/head";
import { HERITAGE_TYPES } from "@/lib/heritage";
import { formatWhen, useCms } from "@/lib/cms/store";
import { matches, uniq } from "@/lib/cms/search";
import { CMS_STATUSES, type CmsRecord } from "@/lib/cms/types";
import { DataList, type Column } from "@/components/cms/DataList";
import { EmptyState, NO_DATA, PageHeader, StatusBadge, btn } from "@/components/cms/ui";

export const Route = createFileRoute("/admin/heritage/")({
  head: adminHead("Heritage", "Manage heritage records such as Gamelan, Batik and Wayang."),
  component: Heritage,
});

function Heritage() {
  const cms = useCms();
  const navigate = useNavigate();
  const [q, setQ] = useKept("admin.heritage.index:20", "");
  const [type, setType] = useKept("admin.heritage.index:21", "");
  const [status, setStatus] = useKept("admin.heritage.index:22", "");
  const [region, setRegion] = useKept("admin.heritage.index:23", "");
  const all = cms.byType("heritage");
  const articles = cms.byType("article");
  const articleCount = (id: string) => articles.filter((a) => (a.relations.heritage ?? []).includes(id)).length;
  const rows = all.filter((r) => (!q || matches(r.title, q)) && (!type || r.fields["heritageType"] === type) && (!status || r.status === status) && (!region || r.fields["region"] === region)).sort((a, b) => a.title.localeCompare(b.title));
  const columns: Column<CmsRecord>[] = [
    { key: "name", label: "Heritage", render: (r) => <span className="flex items-center gap-2.5">{r.image ? <img src={r.image} alt="" className="h-8 w-8 rounded object-cover" /> : <span className="h-8 w-8 rounded bg-muted" />}{r.title || "Untitled"}</span> },
    { key: "type", label: "Type", render: (r) => r.fields["heritageType"] || "—", priority: 2 },
    { key: "region", label: "Region", render: (r) => r.fields["region"] || "—", priority: 3 },
    { key: "articles", label: "Articles", render: (r) => articleCount(r.id), priority: 2 },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "views", label: "Views", render: () => NO_DATA, priority: 3 },
    { key: "updated", label: "Updated", render: (r) => formatWhen(r.updatedAt), priority: 3 },
  ];
  const cta = <Link to="/admin/heritage/$id" params={{ id: "new" }} className={btn.primary}><Plus className="h-4 w-4" />New Heritage</Link>;
  return <>
    <PageHeader title="Heritage" actions={cta} />
    <DataList rows={rows} columns={columns} onOpen={(r) => void navigate({ to: "/admin/heritage/$id", params: { id: r.id } })} search={q} onSearch={setQ} searchPlaceholder="Search heritage…"
      mobileMeta={(r) => <><StatusBadge status={r.status} /><span>{r.fields["heritageType"]}</span><span>{articleCount(r.id)} articles</span></>}
      filters={[
        { label: "Type", value: type, options: [...HERITAGE_TYPES], onChange: setType },
        { label: "Status", value: status, options: [...CMS_STATUSES], onChange: setStatus },
        { label: "Region", value: region, options: uniq(all.map((r) => r.fields["region"])), onChange: setRegion },
      ]}
      empty={<EmptyState filtered={Boolean(all.length)} title={all.length ? "No heritage matches these filters." : "No heritage yet."} text={all.length ? "Try another search or adjust your filters." : "Add the first cultural tradition."} action={!all.length ? cta : undefined} />} />
  </>;
}
