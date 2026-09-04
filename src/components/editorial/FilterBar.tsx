/**
 * One filter system for the whole public site.
 *
 * A page declares what can be filtered — a search field, a few primary
 * filters and any number of secondary ones — and this module decides how to
 * present them: chips for short lists, a searchable popover for long ones,
 * a "More filters" popover on desktop and a single sheet on mobile.
 *
 * Rules it enforces so no page has to re-invent them:
 * - nothing is exposed as a wall of chips; long lists collapse into popovers
 * - only *applied* filters appear as removable chips, in one place
 * - the result count and sort sit inside the same module as the controls
 */
import { Check, ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { useId, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface FilterDef {
  /** Stable key, also used for the control's accessible name. */
  id: string;
  label: string;
  options: readonly string[];
  value: string | null;
  onChange: (next: string | null) => void;
  /** Wording for the "no choice made" state, e.g. "Any", "Everyone". */
  allLabel?: string;
}

export interface SortDef {
  label?: string;
  options: readonly string[];
  value: string;
  onChange: (next: string) => void;
}

/** Short lists stay as chips; anything longer becomes a popover. */
const CHIP_LIMIT = 4;
/** Above this, the popover gets its own search field. */
const SEARCH_LIMIT = 8;

/* ---------------- small pieces ---------------- */

export function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-9 items-center rounded-full border px-3 text-[0.8125rem] transition-colors",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
        active
          ? "border-clay bg-blush font-medium text-clay"
          : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary",
      )}
    >
      {children}
    </button>
  );
}

function ChipGroup({ def }: { def: FilterDef }) {
  return (
    <fieldset className="flex min-w-0 flex-wrap items-center gap-1.5">
      <legend className="sr-only">{def.label}</legend>
      <span aria-hidden className="text-[0.6875rem] tracking-[0.12em] text-muted-foreground uppercase">
        {def.label}
      </span>
      <FilterChip active={def.value === null} onClick={() => def.onChange(null)}>
        {def.allLabel ?? "All"}
      </FilterChip>
      {def.options.map((o) => (
        <FilterChip key={o} active={def.value === o} onClick={() => def.onChange(def.value === o ? null : o)}>
          {o}
        </FilterChip>
      ))}
    </fieldset>
  );
}

/** A single-choice list with an optional search box, used inside a popover. */
function OptionList({ def, onPicked }: { def: FilterDef; onPicked?: () => void }) {
  const [q, setQ] = useState("");
  const searchable = def.options.length > SEARCH_LIMIT;
  const shown = searchable
    ? def.options.filter((o) => o.toLowerCase().includes(q.trim().toLowerCase()))
    : def.options;
  const inputId = useId();

  return (
    <div className="min-w-0">
      {searchable ? (
        <div className="relative mb-2">
          <label htmlFor={inputId} className="sr-only">
            Search {def.label.toLowerCase()}
          </label>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            id={inputId}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${def.label.toLowerCase()}`}
            className="min-h-9 w-full rounded-full border border-border bg-background pr-3 pl-8 text-sm text-ink placeholder:text-muted-foreground"
          />
        </div>
      ) : null}
      <div role="listbox" aria-label={def.label} className="max-h-64 overflow-y-auto">
        <button
          type="button"
          role="option"
          aria-selected={def.value === null}
          onClick={() => {
            def.onChange(null);
            onPicked?.();
          }}
          className="flex min-h-9 w-full items-center justify-between gap-3 rounded-md px-2 text-left text-sm text-muted-foreground hover:bg-sand"
        >
          {def.allLabel ?? "All"}
          {def.value === null ? <Check className="h-3.5 w-3.5 text-primary" aria-hidden /> : null}
        </button>
        {shown.map((o) => (
          <button
            key={o}
            type="button"
            role="option"
            aria-selected={def.value === o}
            onClick={() => {
              def.onChange(def.value === o ? null : o);
              onPicked?.();
            }}
            className={cn(
              "flex min-h-9 w-full items-center justify-between gap-3 rounded-md px-2 text-left text-sm hover:bg-sand",
              def.value === o ? "font-medium text-clay" : "text-ink",
            )}
          >
            <span className="min-w-0 truncate">{o}</span>
            {def.value === o ? <Check className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden /> : null}
          </button>
        ))}
        {shown.length === 0 ? (
          <p className="px-2 py-3 text-sm text-muted-foreground">No matches.</p>
        ) : null}
      </div>
    </div>
  );
}

const triggerClass = (active: boolean) =>
  cn(
    "inline-flex min-h-9 max-w-[14rem] items-center gap-1.5 rounded-full border px-3 text-[0.8125rem] transition-colors",
    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
    active
      ? "border-clay bg-blush font-medium text-clay"
      : "border-border bg-background text-ink hover:border-primary hover:text-primary",
  );

function SelectPopover({ def }: { def: FilterDef }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={triggerClass(def.value !== null)}>
        <span className="truncate">{def.value ?? def.label}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 rounded-xl border-border p-2">
        <OptionList def={def} onPicked={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}

function PrimaryControl({ def }: { def: FilterDef }) {
  return def.options.length <= CHIP_LIMIT ? <ChipGroup def={def} /> : <SelectPopover def={def} />;
}

function GroupedFilters({ defs }: { defs: FilterDef[] }) {
  return (
    <div className="space-y-4">
      {defs.map((def) => (
        <div key={def.id}>
          <p className="text-[0.6875rem] tracking-[0.12em] text-muted-foreground uppercase">{def.label}</p>
          <div className="mt-1.5">
            {def.options.length <= CHIP_LIMIT ? (
              <div className="flex flex-wrap gap-1.5">
                <FilterChip active={def.value === null} onClick={() => def.onChange(null)}>
                  {def.allLabel ?? "All"}
                </FilterChip>
                {def.options.map((o) => (
                  <FilterChip
                    key={o}
                    active={def.value === o}
                    onClick={() => def.onChange(def.value === o ? null : o)}
                  >
                    {o}
                  </FilterChip>
                ))}
              </div>
            ) : (
              <OptionList def={def} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- the toolbar ---------------- */

export function FilterBar({
  search,
  primary = [],
  secondary = [],
  sort,
  resultCount,
  resultNoun,
  children,
}: {
  search?: { value: string; onChange: (next: string) => void; placeholder: string };
  primary?: FilterDef[];
  secondary?: FilterDef[];
  sort?: SortDef;
  resultCount: number;
  resultNoun: string;
  /** Optional extra control shown at the end of the first row, e.g. a view switch. */
  children?: React.ReactNode;
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const searchId = useId();

  const all = [...primary, ...secondary];
  const applied = all.filter((d) => d.value !== null);
  const activeCount = applied.length + (search?.value ? 1 : 0);
  const secondaryActive = secondary.filter((d) => d.value !== null).length;

  const clearAll = () => {
    all.forEach((d) => d.onChange(null));
    search?.onChange("");
  };

  return (
    <div className="border-y border-border bg-sand">
      <div className="container-editorial py-4">
        {/* Row 1 — search, primary controls, more filters, sort */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5">
          {search ? (
            <div className="relative w-full sm:w-72">
              <label htmlFor={searchId} className="sr-only">
                Search {resultNoun}
              </label>
              <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id={searchId}
                type="search"
                value={search.value}
                placeholder={search.placeholder}
                onChange={(e) => search.onChange(e.target.value)}
                className="min-h-10 w-full rounded-full border border-border bg-background pr-3 pl-9 text-sm text-ink placeholder:text-muted-foreground"
              />
            </div>
          ) : null}

          {/* Desktop controls */}
          <div className="hidden flex-wrap items-center gap-x-3 gap-y-2.5 lg:flex">
            {primary.map((def) => (
              <PrimaryControl key={def.id} def={def} />
            ))}
            {secondary.length ? (
              <Popover open={moreOpen} onOpenChange={setMoreOpen}>
                <PopoverTrigger className={triggerClass(secondaryActive > 0)}>
                  <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                  More filters{secondaryActive ? ` (${secondaryActive})` : ""}
                </PopoverTrigger>
                <PopoverContent align="start" className="max-h-[70vh] w-80 overflow-y-auto rounded-xl border-border p-4">
                  <GroupedFilters defs={secondary} />
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <button
                      type="button"
                      onClick={() => secondary.forEach((d) => d.onChange(null))}
                      className="min-h-9 text-sm text-muted-foreground hover:text-primary"
                    >
                      Reset these
                    </button>
                    <button
                      type="button"
                      onClick={() => setMoreOpen(false)}
                      className="inline-flex min-h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-deep-red"
                    >
                      Done
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : null}
          </div>

          {/* Mobile: one drawer for everything */}
          {all.length ? (
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger className={cn(triggerClass(activeCount > 0), "lg:hidden")}>
                <SlidersHorizontal className="h-3.5 w-3.5 opacity-70" aria-hidden />
                Filters{activeCount ? ` (${activeCount})` : ""}
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto bg-background">
                <SheetHeader className="px-0">
                  <SheetTitle className="text-left text-ink">Filter {resultNoun}</SheetTitle>
                </SheetHeader>
                <div className="pb-4">
                  <GroupedFilters defs={all} />
                </div>
                <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-border bg-background pt-3 pb-safe">
                  <button
                    type="button"
                    onClick={clearAll}
                    className="min-h-11 text-sm text-muted-foreground hover:text-primary"
                  >
                    Clear all
                  </button>
                  <button
                    type="button"
                    onClick={() => setSheetOpen(false)}
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
                  >
                    Show {resultCount} {resultNoun}
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          ) : null}

          {children}

          {sort ? (
            <label className="ml-auto flex items-center gap-2 text-[0.8125rem] text-muted-foreground">
              <span className="hidden sm:inline">{sort.label ?? "Sort by"}</span>
              <select
                value={sort.value}
                onChange={(e) => sort.onChange(e.target.value)}
                aria-label={sort.label ?? "Sort by"}
                className="min-h-9 rounded-full border border-border bg-background px-3 text-[0.8125rem] text-ink"
              >
                {sort.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>

        {/* Row 2 — applied filters, count, clear all */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-3">
          <p aria-live="polite" className="text-sm text-muted-foreground">
            <span className="font-medium text-ink tabular-nums">{resultCount}</span> {resultNoun}
          </p>

          {search?.value ? (
            <AppliedChip label={`Search: “${search.value}”`} onRemove={() => search.onChange("")} />
          ) : null}
          {applied.map((d) => (
            <AppliedChip
              key={d.id}
              label={`${d.label}: ${d.value}`}
              onRemove={() => d.onChange(null)}
            />
          ))}

          {activeCount > 0 ? (
            <button
              type="button"
              onClick={clearAll}
              className="ml-auto min-h-9 text-[0.8125rem] text-muted-foreground underline underline-offset-4 hover:text-primary"
            >
              Clear all
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function AppliedChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-clay bg-blush px-2.5 text-[0.8125rem] text-clay">
      <span className="max-w-[16rem] truncate">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter ${label}`}
        className="grid h-5 w-5 place-items-center rounded-full hover:bg-clay/10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      >
        <X className="h-3 w-3" aria-hidden />
      </button>
    </span>
  );
}
