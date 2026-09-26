import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { btn } from "./ui";

export interface FilterDef {
  label: string;
  value: string;
  options: (string | { value: string; label: string })[];
  onChange: (value: string) => void;
}

const control = "h-10 rounded-[var(--btn-radius)] border border-btn-border bg-background text-sm text-ink outline-none transition-[background-color,border-color,box-shadow] duration-150 hover:border-muted-foreground/40 hover:bg-sand focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background max-sm:h-11";

export function FilterSearch({ value, onChange, placeholder, label }: { value: string; onChange: (value: string) => void; placeholder: string; label?: string }) {
  return <div className="relative w-full min-w-0 sm:w-64 sm:shrink-0">
    <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <input type="search" aria-label={label ?? placeholder} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cn(control, "w-full appearance-none bg-sand/40 pr-10 pl-9 placeholder:text-muted-foreground/70 [&::-webkit-search-cancel-button]:hidden")} />
    {value ? <button type="button" aria-label="Clear search" title="Clear search" onClick={() => onChange("")} className={cn(btn.iconSm, "absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 rounded-[var(--btn-radius-sm)] focus-visible:ring-2")}><X className="h-4 w-4" /></button> : null}
  </div>;
}

export function FilterSelect({ label, value, options, onChange, className, emptyLabel, allowEmpty = true }: FilterDef & { className?: string; emptyLabel?: string; allowEmpty?: boolean }) {
  return <div className={cn("relative min-w-0", className)}>
    <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className={cn(control, "w-full cursor-pointer appearance-none truncate py-0 pr-9 pl-3", value && "border-primary/35 bg-blush text-deep-red hover:border-primary/50 hover:bg-blush")}>
      {allowEmpty ? <option value="">{emptyLabel ?? `${label}: All`}</option> : null}
      {options.map((o) => typeof o === "string" ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    <ChevronDown aria-hidden className={cn("pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground", value && "text-deep-red")} />
  </div>;
}

export function FilterBar({ search, filters = [], children, className }: {
  search?: { value: string; onChange: (value: string) => void; placeholder: string; label?: string };
  filters?: FilterDef[];
  children?: React.ReactNode;
  className?: string;
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const primary = filters.slice(0, 3);
  const secondary = filters.slice(3);
  const active = filters.filter((f) => f.value);
  const clear = () => { search?.onChange(""); filters.forEach((f) => f.onChange("")); };
  return <div className={cn("mb-4 flex flex-wrap items-center gap-2", className)}>
    {search ? <FilterSearch {...search} /> : null}
    {filters.length ? <>
      <div className="hidden flex-wrap items-center gap-2 sm:flex">
        {primary.map((f) => <FilterSelect key={f.label} {...f} className="w-36 max-w-full" />)}
        {secondary.length ? <Popover open={moreOpen} onOpenChange={setMoreOpen}>
          <PopoverTrigger className={cn(btn.secondary, "!h-10 gap-2 !rounded-[var(--btn-radius)] !px-3 font-normal hover:border-muted-foreground/40", secondary.some((f) => f.value) && "border-primary/35 bg-blush text-deep-red")}><SlidersHorizontal className="h-4 w-4" />More Filters{secondary.some((f) => f.value) ? ` (${secondary.filter((f) => f.value).length})` : ""}<ChevronDown className="h-4 w-4" /></PopoverTrigger>
          <PopoverContent align="start" className="w-64 space-y-3 rounded-[var(--btn-radius)] border-btn-border bg-popover p-4 shadow-md">
            {secondary.map((f) => <label key={f.label} className="block space-y-1.5"><span className="text-xs font-medium text-muted-foreground">{f.label}</span><FilterSelect {...f} /></label>)}
          </PopoverContent>
        </Popover> : null}
      </div>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger className={cn(btn.secondary, "!h-11 !rounded-[var(--btn-radius)] sm:hidden", active.length && "border-primary/35 bg-blush text-deep-red")}><SlidersHorizontal className="h-4 w-4" />Filters{active.length ? ` (${active.length})` : ""}</SheetTrigger>
        <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-[var(--btn-radius)] border-btn-border bg-background px-5 pb-6">
          <SheetHeader><SheetTitle className="text-left text-ink">Filters</SheetTitle></SheetHeader>
          <div className="mt-5 space-y-4">{filters.map((f) => <label key={f.label} className="block space-y-1.5"><span className="text-xs font-medium text-muted-foreground">{f.label}</span><FilterSelect {...f} /></label>)}</div>
          <div className="mt-6 flex items-center justify-between border-t border-border pt-4"><button type="button" onClick={clear} className={btn.text}>Clear filters</button><button type="button" onClick={() => setSheetOpen(false)} className={btn.primary}>Show results</button></div>
        </SheetContent>
      </Sheet>
    </> : null}
    {children}
    {active.length || search?.value ? <button type="button" onClick={clear} className={cn(btn.text, "min-h-10 text-xs sm:ml-auto")}>Clear filters</button> : null}
  </div>;
}