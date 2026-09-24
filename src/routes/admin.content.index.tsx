import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { CONTENT_KINDS, SIMPLE_STATUSES, kindLabel, simpleStatus, type ContentKind, type ContentStatus } from "@/lib/admin/types";
import {
  Card,
  EmptyState,
  PageHeading,
  SearchInput,
  SelectFilter,
  SummaryStrip,
  FilterToolbar,
  RowLinkAction,
  Table,
  Tag,
  Td,
  abtn,
  dateFmt,
  relative,
} from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/content/")({
  head: adminHead("Content library", "Every publishable record with its editorial status, editor and review dates."),
  component: ContentLibrary,
});

function ContentLibrary() {
  const { content, users } = useAdmin();
  const [kind, setKind] = useState("");
  const [status, setStatus] = useState("");
  const [editor, setEditor] = useState("");
  const [theme, setTheme] = useState("");
  const [country, setCountry] = useState("");
  const [query, setQuery] = useState("");

  const themes = useMemo(() => [...new Set(content.flatMap((c) => c.themes))].sort(), [content]);
  const countries = useMemo(() => [...new Set(content.flatMap((c) => c.countries))].sort(), [content]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return content
      .filter((c) => (kind ? kindLabel(c.kind) === kind : true))
      .filter((c) => (status ? simpleStatus(c.status) === status : true))
      .filter((c) => (editor ? c.assignedTo === editor : true))
      .filter((c) => (theme ? c.themes.includes(theme) : true))
      .filter((c) => (country ? c.countries.includes(country) : true))
      .filter((c) =>
        q
          ? [c.title, c.organisation, c.contributor, c.location, c.themes.join(" "), Object.values(c.fields).join(" ")]
              .join(" ")
              .toLowerCase()
              .includes(q)
          : true,
      )
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [content, kind, status, editor, theme, country, query]);

  return (
    <>
      <PageHeading
        eyebrow="Content / All Content"
        title="All Content"
        description="Find, edit, review and publish every public record from one place."
        actions={
          <>
            <Link to="/admin/create" className={abtn.primary}>
              Create New
            </Link>
          </>
        }
      />

      <div className="scroll-strip mb-4 flex gap-1 border-b border-border" role="tablist" aria-label="Content types">
        {[{ kind: "", label: "", plural: "All" }, ...CONTENT_KINDS.filter((entry) => entry.kind !== "community")].map((entry) => (
          <button key={entry.kind || "all"} type="button" role="tab" aria-selected={kind === entry.label || (!kind && !entry.kind)} onClick={() => setKind(entry.kind ? entry.label : "")} className={`min-h-10 whitespace-nowrap border-b-2 px-3 text-xs font-medium ${kind === entry.label || (!kind && !entry.kind) ? "border-primary text-ink" : "border-transparent text-muted-foreground"}`}>{entry.kind === "story" ? "Stories" : entry.kind === "culture" ? "Culture" : entry.plural}</button>
        ))}
      </div>

      <FilterToolbar search={<SearchInput value={query} onChange={setQuery} label="Search content" placeholder="Search title, people, institution or theme" />}>
        <SelectFilter label="Status" value={status} onChange={setStatus} options={SIMPLE_STATUSES} />
        <SelectFilter label="Editor" value={editor} onChange={setEditor} options={users.map((u) => u.name)} />
        <SelectFilter label="Theme" value={theme} onChange={setTheme} options={themes} />
        <SelectFilter label="Country" value={country} onChange={setCountry} options={countries} />
      </FilterToolbar>

      <SummaryStrip items={[
        { label: "Total content", value: content.length },
        { label: "Published", value: content.filter((item) => simpleStatus(item.status) === "Published").length },
        { label: "In review", value: content.filter((item) => simpleStatus(item.status) === "In review").length },
        { label: "Needs changes", value: content.filter((item) => simpleStatus(item.status) === "Needs changes").length },
      ]} />

      <p className="mb-3 text-xs text-muted-foreground">
        {rows.length} record{rows.length === 1 ? "" : "s"}
      </p>

      {!rows.length ? (
        <EmptyState title="No records match these filters." hint="Clear a filter or widen the search." />
      ) : (
          <Table
            caption="Content records"
            head={["Title", "Type", "Status", "Editor", "Themes", "Updated", "Next review"]}
          >
            {rows.map((item) => (
              <tr key={item.id} className="group hover:bg-muted/35">
                <Td>
                  <Link to="/admin/content/$id" params={{ id: item.id }} className="font-medium underline-offset-4 hover:text-primary hover:underline">
                    {item.title}
                  </Link>
                  {item.organisation ? <span className="block text-xs text-muted-foreground">{item.organisation}</span> : null}
                </Td>
                <Td className="text-xs text-muted-foreground">{kindLabel(item.kind)}</Td>
                <Td><span className="inline-flex items-center gap-2 text-xs font-medium text-ink"><span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />{simpleStatus(item.status)}</span></Td>
                <Td className="text-xs text-muted-foreground">{item.assignedTo ?? "Unassigned"}</Td>
                <Td className="text-xs text-muted-foreground">{item.topics?.[0] ?? item.themes[0] ?? "—"}</Td>
                <Td className="text-xs text-muted-foreground">{relative(item.updatedAt)}</Td>
                <Td><RowLinkAction to="/admin/content/$id" params={{ id: item.id }} label={`Open ${item.title}`} /></Td>
              </tr>
            ))}
          </Table>
      )}
    </>
  );
}

export type { ContentKind, ContentStatus };
