/**
 * One listing used by every content type in the dashboard.
 *
 * Table-first: page title, status tabs, a contextual note when something needs
 * attention, a compact filter toolbar, a result count and a flat table. No
 * cards, no KPI tiles — the whole page is one working surface.
 */
import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { useAdmin } from "@/lib/admin/store";
import {
  SIMPLE_STATUSES,
  kindLabel,
  simpleStatus,
  type ContentItem,
  type ContentKind,
} from "@/lib/admin/types";
import { AdminFilterBar, type AdminFilterDef } from "./AdminFilterBar";
import {
  EmptyState,
  InlineNote,
  PageHeading,
  RowActions,
  StatusPill,
  Table,
  TabBar,
  Td,
  abtn,
  relative,
} from "./primitives";

const TABS = ["All", "Draft", "In review", "Needs changes", "Ready", "Published", "Archived"] as const;

export function ContentListing({
  title,
  description,
  kinds,
  createKind,
  createLabel,
  showTypeColumn,
}: {
  title: string;
  description: string;
  /** Which content kinds belong on this page. */
  kinds: ContentKind[];
  /** Kind used by the page's Create button. */
  createKind: ContentKind;
  createLabel?: string;
  showTypeColumn?: boolean;
}) {
  const { content, users } = useAdmin();
  const navigate = useNavigate();
  const [tab, setTab] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState<string | null>(null);
  const [theme, setTheme] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [sort, setSort] = useState("Recently updated");

  const scope = useMemo(() => content.filter((c) => kinds.includes(c.kind)), [content, kinds]);
  const themes = useMemo(() => [...new Set(scope.flatMap((c) => c.themes))].sort(), [scope]);
  const countries = useMemo(() => [...new Set(scope.flatMap((c) => c.countries))].sort(), [scope]);
  const needsSources = scope.filter((c) => c.status !== "archived" && (c.sources?.length ?? 0) === 0).length;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scope
      .filter((c) => (tab === "All" ? true : simpleStatus(c.status) === tab))
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
  }, [scope, tab, query, editor, theme, country, sort]);

  const primary: AdminFilterDef[] = [
    { id: "editor", label: "Assigned to", options: users.map((u) => u.name), value: editor, onChange: setEditor, allLabel: "Anyone" },
    { id: "theme", label: "Theme", options: themes, value: theme, onChange: setTheme, allLabel: "Any theme" },
  ];
  const secondary: AdminFilterDef[] = [
    { id: "country", label: "Country", options: countries, value: country, onChange: setCountry },
  ];

  return (
    <>
      <PageHeading
        title={title}
        description={description}
        actions={
          <Link to="/admin/content/new" search={{ kind: createKind }} className={abtn.primary}>
            + {createLabel ?? `Create ${kindLabel(createKind).toLowerCase()}`}
          </Link>
        }
      />

      <TabBar
        label={`${title} by status`}
        active={tab}
        onChange={setTab}
        tabs={TABS.map((t) => ({
          id: t,
          label: t,
          count:
            t === "All"
              ? scope.length
              : scope.filter((c) => simpleStatus(c.status) === t).length,
        })).filter((t) => t.id === "All" || t.count > 0 || SIMPLE_STATUSES.includes(t.id as never))}
      />

      <div className="pt-4">
        {needsSources ? (
          <InlineNote tone="attention">
            {needsSources} {needsSources === 1 ? "record has" : "records have"} no source recorded yet.
          </InlineNote>
        ) : null}

        <AdminFilterBar
          search={{ value: query, onChange: setQuery, placeholder: `Search ${title.toLowerCase()}…` }}
          primary={primary}
          secondary={secondary}
          sort={{ options: ["Recently updated", "Title"], value: sort, onChange: setSort }}
          resultCount={rows.length}
          resultNoun={rows.length === 1 ? "record" : "records"}
        />

        {rows.length ? (
          <Table
            caption={title}
            head={[
              "Title",
              ...(showTypeColumn ? ["Type"] : []),
              "Status",
              "Assigned to",
              "Last updated",
              "Public",
              "",
            ]}
          >
            {rows.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-blush/40">
                <Td>
                  <Link
                    to="/admin/content/$id"
                    params={{ id: item.id }}
                    className="font-medium text-ink underline-offset-4 hover:text-primary hover:underline"
                  >
                    {item.title}
                  </Link>
                  <span className="block text-xs text-muted-foreground">
                    {[kindLabel(item.kind), item.organisation ?? item.location ?? item.themes[0]]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </Td>
                {showTypeColumn ? <Td className="text-xs text-muted-foreground">{kindLabel(item.kind)}</Td> : null}
                <Td>
                  <StatusPill status={item.status} />
                </Td>
                <Td className="text-xs text-muted-foreground">{item.assignedTo ?? "Unassigned"}</Td>
                <Td className="text-xs text-muted-foreground">{relative(item.updatedAt)}</Td>
                <Td className="text-xs">
                  <PublicLink item={item} />
                </Td>
                <Td>
                  <RowActions
                    label={`Actions for ${item.title}`}
                    actions={[
                      {
                        label: item.status === "published" ? "Update" : "Edit",
                        onSelect: () => navigate({ to: "/admin/content/$id", params: { id: item.id } }),
                      },
                      {
                        label: "Preview public page",
                        onSelect: () => navigate({ to: "/admin/content/$id/preview", params: { id: item.id } }),
                      },
                      {
                        label: "Open review",
                        onSelect: () => navigate({ to: "/admin/review" }),
                      },
                    ]}
                  />
                </Td>
              </tr>
            ))}
          </Table>
        ) : (
          <EmptyState
            title={`No ${title.toLowerCase()} match these filters.`}
            hint="Clear a filter, switch tab, or create a new record."
          />
        )}
      </div>
    </>
  );
}

/** Makes the link between a dashboard record and the public site explicit. */
export function PublicLink({ item }: { item: ContentItem }) {
  if (item.status === "published" && item.publicPath) {
    return (
      <a href={item.publicPath} target="_blank" rel="noreferrer" className="text-primary hover:underline">
        Live ↗
      </a>
    );
  }
  return (
    <Link to="/admin/content/$id/preview" params={{ id: item.id }} className="text-muted-foreground hover:text-primary">
      Preview
    </Link>
  );
}
