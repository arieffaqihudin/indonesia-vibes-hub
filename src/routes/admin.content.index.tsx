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
  StatusPill,
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
        eyebrow="Editorial"
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

      <div className="scroll-strip mb-4 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 md:flex-wrap md:overflow-visible">
        <SearchInput value={query} onChange={setQuery} label="Search content" placeholder="Search title, people, institution or theme" />
        <SelectFilter label="Status" value={status} onChange={setStatus} options={SIMPLE_STATUSES} />
        <SelectFilter label="Editor" value={editor} onChange={setEditor} options={users.map((u) => u.name)} />
        <SelectFilter label="Theme" value={theme} onChange={setTheme} options={themes} />
        <SelectFilter label="Country" value={country} onChange={setCountry} options={countries} />
      </div>

      <p className="mb-3 text-xs text-muted-foreground">
        {rows.length} record{rows.length === 1 ? "" : "s"}
      </p>

      {!rows.length ? (
        <EmptyState title="No records match these filters." hint="Clear a filter or widen the search." />
      ) : (
        <Card bodyClass="p-0">
          <Table
            caption="Content records"
            head={["Title", "Type", "Status", "Editor", "Themes", "Updated", "Next review"]}
          >
            {rows.map((item) => (
              <tr key={item.id} className="hover:bg-muted/50">
                <Td>
                  <Link to="/admin/content/$id" params={{ id: item.id }} className="font-medium underline-offset-4 hover:text-primary hover:underline">
                    {item.title}
                  </Link>
                  {item.organisation ? <span className="block text-xs text-muted-foreground">{item.organisation}</span> : null}
                </Td>
                <Td className="text-xs text-muted-foreground">{kindLabel(item.kind)}</Td>
                <Td><span className="inline-flex items-center gap-2 text-xs font-medium text-ink"><span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />{simpleStatus(item.status)}</span></Td>
                <Td className="text-xs text-muted-foreground">{item.assignedTo ?? "Unassigned"}</Td>
                <Td className="text-xs text-muted-foreground">{item.themes.slice(0, 2).join(", ") || "—"}</Td>
                <Td className="text-xs text-muted-foreground">{relative(item.updatedAt)}</Td>
                <Td className="text-xs text-muted-foreground">{item.nextReview ? dateFmt(item.nextReview) : "—"}</Td>
              </tr>
            ))}
          </Table>
        </Card>
      )}
    </>
  );
}

export type { ContentKind, ContentStatus };
