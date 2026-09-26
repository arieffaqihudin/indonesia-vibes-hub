import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useKept } from "@/lib/cms/kept";
import { cn } from "@/lib/utils";
import { btn } from "./ui";
import { FilterSelect } from "./FilterBar";

const SIZES = [10, 20, 50, 100] as const;

function pageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const visible = new Set([1, total]);
  for (let i = Math.max(2, current - 2); i <= Math.min(total - 1, current + 2); i++) visible.add(i);
  if (current <= 3) for (let i = 2; i <= Math.min(5, total - 1); i++) visible.add(i);
  if (current >= total - 2) for (let i = Math.max(2, total - 4); i < total; i++) visible.add(i);
  const result: (number | "…")[] = [];
  [...visible].sort((a, b) => a - b).forEach((n, i, values) => {
    const previous = values[i - 1];
    if (previous !== undefined && n - previous > 1) result.push("…");
    result.push(n);
  });
  return result;
}

/** Shared pagination state for every CMS content list. Pages are kept in memory; page size persists across navigation. */
export function useListPagination(total: number, resetKey: string, section = "") {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [page, setPage] = useKept(`page:${path}${section}`, 0);
  const [size, setSize] = useKept(`size:${path}`, 10);
  const safeSize = SIZES.includes(size as (typeof SIZES)[number]) ? size : 10;
  const previousKey = useRef(resetKey);
  const anchor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (previousKey.current !== resetKey) {
      previousKey.current = resetKey;
      setPage(0);
    }
  }, [resetKey, setPage]);
  const pages = Math.max(1, Math.ceil(total / safeSize));
  const current = Math.min(Math.max(0, page), pages - 1);
  useEffect(() => { if (page !== current) setPage(current); }, [page, current, setPage]);
  const go = (next: number) => {
    setPage(Math.max(0, Math.min(pages - 1, next)));
    anchor.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const changeSize = (next: number) => { setSize(next); setPage(0); };
  return { anchor, current, pages, size: safeSize, go, changeSize, visibleStart: current * safeSize };
}

export function Pagination({ total, current, pages, size, go, changeSize }: {
  total: number; current: number; pages: number; size: number;
  go: (page: number) => void; changeSize: (size: number) => void;
}) {
  const numbers = pageNumbers(current + 1, pages);
  return <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border px-3 py-2.5 text-xs text-muted-foreground sm:px-4">
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-2">Rows per page
        <FilterSelect label="Rows per page" value={String(size)} onChange={(v) => changeSize(Number(v))} options={SIZES.map(String)} allowEmpty={false} className="w-20" />
      </label>
      <span aria-live="polite">{total ? current * size + 1 : 0}–{Math.min(total, (current + 1) * size)} of {total}</span>
    </div>
    <nav aria-label="Pagination" className="flex items-center gap-1">
      <button type="button" aria-label="Previous page" disabled={current === 0} onClick={() => go(current - 1)} className={cn(btn.iconSm, "sm:w-auto sm:px-2")}><ChevronLeft className="h-4 w-4" /><span className="hidden sm:inline">Previous</span></button>
      <span className="mx-2 sm:hidden">Page {current + 1} of {pages}</span>
      <span className="hidden items-center gap-0.5 sm:flex">{numbers.map((n, i) => n === "…" ? <span key={`dots-${i}`} className="px-1.5">…</span> : <button key={n} type="button" aria-label={`Page ${n}`} aria-current={n === current + 1 ? "page" : undefined} onClick={() => go(n - 1)} className={cn(btn.iconSm, "h-8 w-8", n === current + 1 && "bg-blush text-primary hover:bg-blush hover:text-primary")}>{n}</button>)}</span>
      <button type="button" aria-label="Next page" disabled={current >= pages - 1} onClick={() => go(current + 1)} className={cn(btn.iconSm, "sm:w-auto sm:px-2")}><span className="hidden sm:inline">Next</span><ChevronRight className="h-4 w-4" /></button>
    </nav>
  </div>;
}