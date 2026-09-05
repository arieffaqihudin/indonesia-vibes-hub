import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { CONTENT_KINDS, CONTENT_STATUS, kindLabel, type ContentKind, type ContentStatus } from "@/lib/admin/types";
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
  const [view, setView] = useState<"list" | "cards">("list");
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
      .filter((c) => (status ? CONTENT_STATUS[c.status].label === status : true))
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
        title="Content library"
        description="All publishable content types in one place, filtered by status, editor, theme and geography."
        actions={
          <>
            <div className="flex rounded-md border border-border p-0.5" role="group" aria-label="View mode">
              {(["list", "cards"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={view === mode}
                  onClick={() => setView(mode)}
                  className={`min-h-8 rounded px-3 text-xs ${view === mode ? "bg-blush text-ink" : "text-muted-foreground"}`}
                >
                  {mode === "list" ? "List" : "Editorial cards"}
                </button>
              ))}
            </div>
            <Link to="/admin/content/new" search={{ kind: "story" }} className={abtn.primary}>
              + Create
            </Link>
          </>
        }
      />

      <div className="scroll-strip mb-4 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 md:flex-wrap md:overflow-visible">
        <SearchInput value={query} onChange={setQuery} label="Search content" placeholder="Search title, people, institution or theme" />
        <SelectFilter label="Type" value={kind} onChange={setKind} options={CONTENT_KINDS.map((k) => k.label)} />
        <SelectFilter label="Status" value={status} onChange={setStatus} options={Object.values(CONTENT_STATUS).map((s) => s.label)} />
        <SelectFilter label="Editor" value={editor} onChange={setEditor} options={users.map((u) => u.name)} />
        <SelectFilter label="Theme" value={theme} onChange={setTheme} options={themes} />
        <SelectFilter label="Country" value={country} onChange={setCountry} options={countries} />
      </div>

      <p className="mb-3 text-xs text-muted-foreground">
        {rows.length} record{rows.length === 1 ? "" : "s"}
      </p>

      {!rows.length ? (
        <EmptyState title="No records match these filters." hint="Clear a filter or widen the search." />
      ) : view === "list" ? (
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
                <Td>
                  <StatusPill status={item.status} />
                </Td>
                <Td className="text-xs text-muted-foreground">{item.assignedTo ?? "Unassigned"}</Td>
                <Td className="text-xs text-muted-foreground">{item.themes.slice(0, 2).join(", ") || "—"}</Td>
                <Td className="text-xs text-muted-foreground">{relative(item.updatedAt)}</Td>
                <Td className="text-xs text-muted-foreground">{item.nextReview ? dateFmt(item.nextReview) : "—"}</Td>
              </tr>
            ))}
          </Table>
        </Card>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((item) => (
            <li key={item.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <Tag tone="quiet">{kindLabel(item.kind)}</Tag>
                <StatusPill status={item.status} />
              </div>
              <Link to="/admin/content/$id" params={{ id: item.id }} className="mt-2 block text-sm font-medium text-ink hover:text-primary">
                {item.title}
              </Link>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {item.fields["standfirst"] ?? item.fields["summary"] ?? item.fields["introduction"] ?? item.fields["profile"] ?? "No standfirst yet."}
              </p>
              <p className="mt-3 text-[0.7rem] text-muted-foreground">
                {item.assignedTo ?? "Unassigned"} · updated {relative(item.updatedAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export type { ContentKind, ContentStatus };
