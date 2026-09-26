import { type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { EmptyState } from "./ui";
import { FilterBar, type FilterDef } from "./FilterBar";
import { Pagination, useListPagination } from "./Pagination";

export interface Column<T> {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  /** 1 = always, 2 = hidden below md, 3 = hidden below xl. */
  priority?: 1 | 2 | 3;
  className?: string;
}

/** The one list pattern: search, filters, table (stacked rows on mobile), pagination. */
export function DataList<T extends { id: string }>({ rows, columns, onOpen, search, onSearch, searchPlaceholder = "Search…", filters = [], empty, mobileMeta, resetKey = "" }: {
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
  resetKey?: string;
}) {
  const pagination = useListPagination(rows.length, JSON.stringify([resetKey, search, filters.map((f) => f.value)]));
  const visible = rows.slice(pagination.visibleStart, pagination.visibleStart + pagination.size);
  const [first, ...rest] = columns;
  const hide = (p?: number) => (p === 2 ? "hidden md:table-cell" : p === 3 ? "hidden xl:table-cell" : "");

  return <div ref={pagination.anchor} className="scroll-mt-5">
    <FilterBar search={{ value: search, onChange: onSearch, placeholder: searchPlaceholder, label: `Search ${searchPlaceholder.replace(/^Search\s*/i, "")}` }} filters={filters} />
    <div className="rounded-lg border border-border bg-background">

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

    <Pagination total={rows.length} {...pagination} />
    </div>
  </div>;
}

export { EmptyState };
