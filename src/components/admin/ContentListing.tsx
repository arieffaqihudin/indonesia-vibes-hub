import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { useAdmin } from "@/lib/admin/store";
import { forms } from "@/data/content";
import { HERITAGE_TYPES, heritageType } from "@/lib/heritage";
import { kindLabel, simpleStatus, type ContentKind } from "@/lib/admin/types";
import { FilterToolbar, PageHeading, RowActions, SearchInput, SelectFilter, Table, Td, abtn, relative } from "./primitives";

export function ContentListing({ title, description, kinds, createKind, createLabel, showTypeColumn, heritage }: { title: string; description: string; kinds: ContentKind[]; createKind: ContentKind; createLabel?: string; showTypeColumn?: boolean; heritage?: boolean }) {
  const admin = useAdmin();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [hType, setHType] = useState("");
  const formFor = (title: string) => forms.find((f) => f.name.toLowerCase() === title.toLowerCase());
  const typeOf = (item: { title: string; fields: Record<string, string> }) => item.fields["heritageType"] ?? (formFor(item.title) ? heritageType(formFor(item.title)!) : "—");
  const articleCount = (item: { id: string; title: string }) => { const f = formFor(item.title); return admin.content.filter((c) => c.kind === "story" && (c.relationships.culture.includes(item.id) || (f && c.relationships.culture.includes(f.id)))).length; };
  const scope = useMemo(() => admin.content.filter((item) => kinds.includes(item.kind)), [admin.content, kinds]);
  const rows = scope.filter((item) => `${item.title} ${item.location ?? ""} ${item.countries.join(" ")}`.toLowerCase().includes(query.toLowerCase()) && (!status || simpleStatus(item.status) === status) && (!hType || typeOf(item) === hType));
  return <>
    <PageHeading title={title} description={description} actions={<Link to="/admin/content/new" search={{ kind: createKind }} className={abtn.primary}>+ {createLabel ?? `New ${kindLabel(createKind)}`}</Link>} />
    <FilterToolbar search={<SearchInput value={query} onChange={setQuery} placeholder={`Search ${title.toLowerCase()}…`} label={`Search ${title}`} />}><SelectFilter label="Status" value={status} onChange={setStatus} options={["Draft", "In review", "Scheduled", "Published", "Archived"]} />{heritage ? <SelectFilter label="Type" value={hType} onChange={setHType} options={[...HERITAGE_TYPES]} /> : null}</FilterToolbar>
    <p className="mb-3 text-xs text-muted-foreground">{rows.length} record{rows.length === 1 ? "" : "s"}</p>
    <Table caption={title} head={["Title", ...(showTypeColumn || heritage ? ["Type"] : []), ...(heritage ? ["Related Articles"] : []), "Location", "Status", "Updated", "Action"]}>
      {rows.map((item) => <tr key={item.id} className="group hover:bg-muted/35">
        <Td><Link to="/admin/content/$id" params={{ id: item.id }} className="font-medium text-ink hover:text-primary">{item.title}</Link><span className="block text-xs text-muted-foreground">{item.fields["summary"] ?? item.fields["role"] ?? item.fields["type"] ?? item.organisation ?? ""}</span></Td>
        {showTypeColumn ? <Td className="text-xs text-muted-foreground">{item.kind === "institution" ? "Institution & Organisation" : kindLabel(item.kind)}</Td> : null}{heritage ? <><Td className="text-xs text-muted-foreground">{typeOf(item)}</Td><Td className="text-xs">{articleCount(item)}</Td></> : null}
        <Td className="text-xs text-muted-foreground">{item.location ?? item.countries.join(", ") ?? "—"}</Td>
        <Td className="text-xs">{simpleStatus(item.status)}</Td>
        <Td className="text-xs text-muted-foreground">{relative(item.updatedAt)}</Td>
        <Td><RowActions label={`Actions for ${item.title}`} actions={[{ label: "Edit", onSelect: () => navigate({ to: "/admin/content/$id", params: { id: item.id } }) }, { label: "Preview", onSelect: () => navigate({ to: "/admin/content/$id/preview", params: { id: item.id } }) }, { label: "Archive", danger: true, onSelect: () => admin.transition(item.id, "archived") }]} /></Td>
      </tr>)}
    </Table>
  </>;
}