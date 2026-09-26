import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useKept } from "@/lib/cms/kept";

import { cn } from "@/lib/utils";
import { EmptyState, btn, inputClass } from "./ui";

export interface Column<T> {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  /** 1 = always, 2 = hidden below md, 3 = hidden below xl. */
  priority?: 1 | 2 | 3;
  className?: string;
}

export interface FilterDef {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const PAGE_SIZE = 20;

/** The one list pattern: search, filters, table (stacked rows on mobile), pagination. */
export function DataList<T extends { id: string }>({ rows, columns, onOpen, search, onSearch, searchPlaceholder = "Search…", filters = [], empty, mobileMeta }: {
  rows: T[];
  columns: Column<T>[];
  onOpen: (row: T) => void;
  search: string;
  onSearch: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterDef[];
  empty: ReactNode;
  /** Secondary line for the compact mobile row. */
  mobileMeta?: (row: T) => ReactNode;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname + String(s.location.search["tab"] ?? "") });
  const [page, setPage] = useKept(`page:${path}`, 0);
  const mounted = useRef(false);
  useEffect(() => { if (mounted.current) setPage(0); else mounted.current = true; }, [search, rows.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const cur = Math.min(page, pages - 1);
  const visible = rows.slice(cur * PAGE_SIZE, cur * PAGE_SIZE + PAGE_SIZE);
  const [first, ...rest] = columns;
  const hide = (p?: number) => (p === 2 ? "hidden md:table-cell" : p === 3 ? "hidden xl:table-cell" : "");

  return <div className="rounded-lg border border-border bg-background">
    <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
      <label className="relative min-w-[12rem] flex-1">
        <span className="sr-only">Search</span>
        <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder={searchPlaceholder} className={cn(inputClass, "pl-8")} />
      </label>
      {filters.length ? <div className="-mx-3 flex w-[calc(100%+1.5rem)] gap-2 overflow-x-auto px-3 sm:mx-0 sm:w-auto sm:flex-wrap sm:overflow-visible sm:px-0">{filters.map((f) => <select key={f.label} aria-label={f.label} value={f.value} onChange={(e) => f.onChange(e.target.value)} className={cn(inputClass, "w-auto min-w-[8rem] flex-none pr-8", f.value && "border-primary/50 text-primary")}>
        <option value="">{f.label}: All</option>
        {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>)}</div> : null}
    </div>

    {rows.length === 0 ? empty : <>
      <table className="hidden w-full text-sm sm:table">
        <thead><tr className="border-b border-border text-left text-[0.6875rem] uppercase tracking-wide text-muted-foreground">
          {columns.map((c) => <th key={c.key} scope="col" className={cn("px-3 py-2.5 font-medium", hide(c.priority), c.className)}>{c.label}</th>)}
        </tr></thead>
        <tbody>{visible.map((row) => <tr key={row.id} onClick={() => onOpen(row)} className="cursor-pointer border-b border-border last:border-b-0 transition-colors hover:bg-sand active:bg-blush">
          {columns.map((c, i) => <td key={c.key} className={cn("px-3 py-2.5 align-middle text-muted-foreground", i === 0 ? "font-medium text-ink" : "whitespace-nowrap", hide(c.priority), c.className)}>
            {i === 0 ? <button type="button" onClick={(e) => { e.stopPropagation(); onOpen(row); }} className="text-left hover:text-primary">{c.render(row)}</button> : c.render(row)}
          </td>)}
        </tr>)}</tbody>
      </table>
      <ul className="divide-y divide-border sm:hidden">{visible.map((row) => <li key={row.id}>
        <button type="button" onClick={() => onOpen(row)} className="flex w-full flex-col items-start gap-1 px-3 py-3 text-left active:bg-sand">
          <span className="text-sm font-medium text-ink">{first?.render(row)}</span>
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">{mobileMeta ? mobileMeta(row) : rest.slice(0, 2).map((c) => <span key={c.key}>{c.render(row)}</span>)}</span>
        </button>
      </li>)}</ul>
    </>}

    {rows.length > PAGE_SIZE ? <div className="flex items-center justify-between border-t border-border px-3 py-2 text-xs text-muted-foreground">
      <span>{page * PAGE_SIZE + 1}–{Math.min(rows.length, (page + 1) * PAGE_SIZE)} of {rows.length}</span>
      <span className="flex gap-1">
        <button type="button" aria-label="Previous page" disabled={page === 0} onClick={() => setPage(page - 1)} className={btn.iconSm}><ChevronLeft className="h-4 w-4" /></button>
        <button type="button" aria-label="Next page" disabled={page >= pages - 1} onClick={() => setPage(page + 1)} className={btn.iconSm}><ChevronRight className="h-4 w-4" /></button>
      </span>
    </div> : <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground">{rows.length} {rows.length === 1 ? "item" : "items"}</div>}
  </div>;
}

export { EmptyState };
