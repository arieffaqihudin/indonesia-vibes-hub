/**
 * Dashboard version of the public filter bar: same behaviour, denser styling.
 * Search, a couple of primary filters, everything else behind "More filters",
 * applied filters as removable chips, a live count and an optional sort.
 */
import { useId, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { field } from "./primitives";

export interface AdminFilterDef {
  id: string;
  label: string;
  options: readonly string[];
  value: string | null;
  onChange: (next: string | null) => void;
  allLabel?: string;
}

const trigger = (active: boolean) =>
  cn(
    "inline-flex min-h-9 max-w-[13rem] shrink-0 items-center gap-1.5 rounded-md border px-2.5 text-xs transition-colors md:min-h-8",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    active ? "border-clay bg-blush font-medium text-clay" : "border-border text-ink hover:border-primary hover:text-primary",
  );

function OptionList({ def, onPicked }: { def: AdminFilterDef; onPicked?: () => void }) {
  const [q, setQ] = useState("");
  const searchable = def.options.length > 8;
  const shown = searchable ? def.options.filter((o) => o.toLowerCase().includes(q.trim().toLowerCase())) : def.options;
  const id = useId();
  return (
    <div>
      {searchable ? (
        <>
          <label htmlFor={id} className="sr-only">
            Search {def.label.toLowerCase()}
          </label>
          <input
            id={id}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${def.label.toLowerCase()}`}
            className={cn(field, "mb-2 min-h-8 py-1 text-xs")}
          />
        </>
      ) : null}
      <div role="listbox" aria-label={def.label} className="max-h-56 overflow-y-auto">
        <button
          type="button"
          role="option"
          aria-selected={def.value === null}
          onClick={() => {
            def.onChange(null);
            onPicked?.();
          }}
          className="block w-full rounded px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-muted"
        >
          {def.allLabel ?? "All"}
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
              "block w-full truncate rounded px-2 py-1.5 text-left text-xs hover:bg-muted",
              def.value === o ? "bg-blush font-medium text-clay" : "text-ink",
            )}
          >
            {o}
          </button>
        ))}
        {!shown.length ? <p className="px-2 py-2 text-xs text-muted-foreground">No matches.</p> : null}
      </div>
    </div>
  );
}

function SelectFilterPopover({ def }: { def: AdminFilterDef }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={trigger(def.value !== null)}>
        <span className="truncate">{def.value ?? def.label}</span>
        <span aria-hidden className="opacity-60">
          ▾
        </span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 rounded-md p-2">
        <OptionList def={def} onPicked={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}

export function AdminFilterBar({
  search,
  primary = [],
  secondary = [],
  sort,
  resultCount,
  resultNoun,
  children,
}: {
  search?: { value: string; onChange: (v: string) => void; placeholder: string };
  primary?: AdminFilterDef[];
  secondary?: AdminFilterDef[];
  sort?: { options: readonly string[]; value: string; onChange: (v: string) => void };
  resultCount: number;
  resultNoun: string;
  children?: React.ReactNode;
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const searchId = useId();
  const all = [...primary, ...secondary];
  const applied = all.filter((d) => d.value !== null);
  const secondaryActive = secondary.filter((d) => d.value !== null).length;
  const clearAll = () => {
    all.forEach((d) => d.onChange(null));
    search?.onChange("");
  };

  return (
    <div className="mb-1 border-b border-border py-2.5">
      {search ? (
        <div className="mb-2 md:hidden">
          <label htmlFor={`${searchId}-m`} className="sr-only">
            Search {resultNoun}
          </label>
          <input
            id={`${searchId}-m`}
            type="search"
            value={search.value}
            placeholder={search.placeholder}
            onChange={(e) => search.onChange(e.target.value)}
            className={cn(field, "min-h-10 py-1.5 text-sm")}
          />
        </div>
      ) : null}

      <div className="scroll-strip flex items-center gap-2 pb-1 md:flex-wrap md:overflow-visible md:pb-0">
        {search ? (
          <div className="hidden min-w-[12rem] flex-1 md:block md:max-w-xs">
            <label htmlFor={searchId} className="sr-only">
              Search {resultNoun}
            </label>
            <input
              id={searchId}
              type="search"
              value={search.value}
              placeholder={search.placeholder}
              onChange={(e) => search.onChange(e.target.value)}
              className={cn(field, "min-h-8 py-1 text-xs")}
            />
          </div>
        ) : null}

        {primary.map((def) => (
          <SelectFilterPopover key={def.id} def={def} />
        ))}

        {secondary.length ? (
          <Popover open={moreOpen} onOpenChange={setMoreOpen}>
            <PopoverTrigger className={trigger(secondaryActive > 0)}>
              More filters{secondaryActive ? ` (${secondaryActive})` : ""}
            </PopoverTrigger>
            <PopoverContent align="start" className="max-h-[70vh] w-64 overflow-y-auto rounded-md p-3">
              <div className="space-y-3">
                {secondary.map((def) => (
                  <div key={def.id}>
                    <p className="mb-1 text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                      {def.label}
                    </p>
                    <OptionList def={def} />
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        ) : null}

        {children}

        {sort ? (
          <label className="ml-auto flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
            <span className="hidden sm:inline">Sort</span>
            <select
              value={sort.value}
              onChange={(e) => sort.onChange(e.target.value)}
              aria-label="Sort by"
              className={cn(field, "min-h-8 w-auto py-1 text-xs")}
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

      <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-border pt-2">
        <p aria-live="polite" className="text-xs text-muted-foreground">
          <span className="font-medium text-ink tabular-nums">{resultCount}</span> {resultNoun}
        </p>
        {search?.value ? <AppliedChip label={`Search: ${search.value}`} onRemove={() => search.onChange("")} /> : null}
        {applied.map((d) => (
          <AppliedChip key={d.id} label={`${d.label}: ${d.value}`} onRemove={() => d.onChange(null)} />
        ))}
        {applied.length || search?.value ? (
          <button type="button" onClick={clearAll} className="ml-auto text-xs text-muted-foreground underline hover:text-primary">
            Clear all
          </button>
        ) : null}
      </div>
    </div>
  );
}

function AppliedChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-clay/40 bg-blush px-1.5 py-0.5 text-[0.7rem] text-clay">
      <span className="max-w-[14rem] truncate">{label}</span>
      <button type="button" onClick={onRemove} aria-label={`Remove filter ${label}`} className="hover:text-primary">
        ×
      </button>
    </span>
  );
}
