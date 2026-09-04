/**
 * One listing used by every content type in the dashboard.
 *
 * Stories, Culture, People & Communities, Institutions, Places and Collections
 * all render this, so a team member learns the page once: search, a couple of
 * filters, more filters behind a control, applied filters, a count, and one
 * primary action per row.
 */
import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { useAdmin } from "@/lib/admin/store";
import {
  CONTENT_STATUS,
  SIMPLE_STATUSES,
  kindLabel,
  simpleStatus,
  type ContentKind,
  type ContentItem,
} from "@/lib/admin/types";
import { AdminFilterBar, type AdminFilterDef } from "./AdminFilterBar";
import { Card, EmptyState, PageHeading, StatusPill, Table, Td, abtn, relative } from "./primitives";

export function ContentListing({
  title,
  description,
  kinds,
  createKind,
  showTypeColumn,
  extraNote,
}: {
  title: string;
  description: string;
  /** Which content kinds belong on this page. */
  kinds: ContentKind[];
  /** Kind used by the page's Create button. */
  createKind: ContentKind;
  showTypeColumn?: boolean;
  /** Contextual data-quality warning, e.g. "3 records are missing sources". */
  extraNote?: string;
}) {
  const { content, users } = useAdmin();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [editor, setEditor] = useState<string | null>(null);
  const [theme, setTheme] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [sort, setSort] = useState("Recently updated");

  const scope = useMemo(() => content.filter((c) => kinds.includes(c.kind)), [content, kinds]);
  const themes = useMemo(() => [...new Set(scope.flatMap((c) => c.themes))].sort(), [scope]);
  const countries = useMemo(() => [...new Set(scope.flatMap((c) => c.countries))].sort(), [scope]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scope
      .filter((c) => (status ? simpleStatus(c.status) === status : true))
      .filter((c) => (editor ? c.assignedTo === editor : true))
      .filter((c) => (theme ? c.themes.includes(theme) : true))
      .filter((c) => (country ? c.countries.includes(country) : true))
      .filter((c) =>
        q
          ? [c.title, c.organisation ?? "", c.contributor ?? "", c.location ?? "", c.themes.join(" ")]
              .join(" ")
              .toLowerCase()
              .includes(q)
          : true,
      )
      .sort((a, b) =>
        sort === "Title"
          ? a.title.localeCompare(b.title)
          : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  }, [scope, query, status, editor, theme, country, sort]);

  const primary: AdminFilterDef[] = [
    { id: "status", label: "Status", options: SIMPLE_STATUSES, value: status, onChange: setStatus, allLabel: "Any status" },
    { id: "editor", label: "Editor", options: users.map((u) => u.name), value: editor, onChange: setEditor, allLabel: "Anyone" },
  ];
  const secondary: AdminFilterDef[] = [
    { id: "theme", label: "Theme", options: themes, value: theme, onChange: setTheme },
    { id: "country", label: "Country", options: countries, value: country, onChange: setCountry },
  ];

  return (
    <>
      <PageHeading
        eyebrow="Content"
        title={title}
        description={description}
        actions={
          <Link to="/admin/content/new" search={{ kind: createKind }} className={abtn.primary}>
            + Create
          </Link>
        }
      />

      {extraNote ? (
        <p className="mb-4 rounded-md border border-clay/30 bg-blush px-3 py-2 text-xs text-clay">{extraNote}</p>
      ) : null}

      <AdminFilterBar
        search={{ value: query, onChange: setQuery, placeholder: "Search title, people or organisation" }}
        primary={primary}
        secondary={secondary}
        sort={{ options: ["Recently updated", "Title"], value: sort, onChange: setSort }}
        resultCount={rows.length}
        resultNoun={rows.length === 1 ? "record" : "records"}
      />

      {rows.length ? (
        <Card bodyClass="p-0">
          <Table
            caption={title}
            head={[
              "Title",
              ...(showTypeColumn ? ["Type"] : []),
              "Status",
              "Editor",
              "Updated",
              "Public",
              "",
            ]}
          >
            {rows.map((item) => (
              <tr key={item.id} className="hover:bg-muted/50">
                <Td>
                  <Link
                    to="/admin/content/$id"
                    params={{ id: item.id }}
                    className="font-medium underline-offset-4 hover:text-primary hover:underline"
                  >
                    {item.title}
                  </Link>
                  {item.organisation ? (
                    <span className="block text-xs text-muted-foreground">{item.organisation}</span>
                  ) : null}
                </Td>
                {showTypeColumn ? <Td className="text-xs text-muted-foreground">{kindLabel(item.kind)}</Td> : null}
                <Td>
                  <span className="text-xs text-ink">{simpleStatus(item.status)}</span>
                  {CONTENT_STATUS[item.status].label !== simpleStatus(item.status) ? (
                    <StatusPill status={item.status} className="ml-2 hidden xl:inline-flex" />
                  ) : null}
                </Td>
                <Td className="text-xs text-muted-foreground">{item.assignedTo ?? "Unassigned"}</Td>
                <Td className="text-xs text-muted-foreground">{relative(item.updatedAt)}</Td>
                <Td className="text-xs text-muted-foreground">
                  <PublicLink item={item} />
                </Td>
                <Td className="text-right">
                  <button
                    type="button"
                    className={abtn.small}
                    onClick={() => navigate({ to: "/admin/content/$id", params: { id: item.id } })}
                  >
                    {item.status === "published" ? "Update" : "Edit"}
                  </button>
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      ) : (
        <EmptyState
          title={`No ${title.toLowerCase()} match these filters.`}
          hint="Clear a filter, or create a new record."
        />
      )}
    </>
  );
}

/** Makes the link between a dashboard record and the public site explicit. */
export function PublicLink({ item }: { item: ContentItem }) {
  if (item.status === "published" && item.publicPath) {
    return (
      <a href={item.publicPath} target="_blank" rel="noreferrer" className="text-primary hover:underline">
        View published ↗
      </a>
    );
  }
  return (
    <Link to="/admin/content/$id/preview" params={{ id: item.id }} className="text-muted-foreground hover:text-primary">
      Preview
    </Link>
  );
}
