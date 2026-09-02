import { Search, X } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  allLabel = "All",
}: {
  label: string;
  options: readonly T[];
  value: T | null;
  onChange: (next: T | null) => void;
  allLabel?: string;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="eyebrow text-muted-foreground">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        <FilterChip active={value === null} onClick={() => onChange(null)}>
          {allLabel}
        </FilterChip>
        {options.map((option) => (
          <FilterChip
            key={option}
            active={value === option}
            onClick={() => onChange(value === option ? null : option)}
          >
            {option}
          </FilterChip>
        ))}
      </div>
    </fieldset>
  );
}

export function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-9 items-center rounded-full border px-3.5 text-sm transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-ink hover:border-primary hover:text-primary",
      )}
    >
      {children}
    </button>
  );
}

export function SearchField({
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="eyebrow text-muted-foreground">
        {label}
      </label>
      <div className="relative mt-3">
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id={id}
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-11 w-full rounded-full border border-border bg-background pr-4 pl-9 text-sm text-ink placeholder:text-muted-foreground/80"
        />
      </div>
    </div>
  );
}

/**
 * Filters are always visible on desktop and collapse into a disclosure on
 * small screens; both routes are keyboard operable.
 */
export function FilterPanel({
  children,
  resultCount,
  resultNoun,
  onReset,
  active,
}: {
  children: ReactNode;
  resultCount: number;
  resultNoun: string;
  onReset: () => void;
  active: boolean;
}) {
  return (
    <div className="border-y border-border bg-sand">
      <div className="container-editorial py-6">
        <details className="lg:hidden" name="filters">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-sm font-medium text-ink">
            <span>Filter {resultNoun}</span>
            <span className="text-muted-foreground">
              {resultCount} shown
            </span>
          </summary>
          <div className="mt-6 grid gap-6">{children}</div>
        </details>

        <div className="hidden gap-8 lg:grid lg:grid-cols-2 xl:grid-cols-3">{children}</div>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-4">
          <p aria-live="polite" className="text-sm text-muted-foreground">
            <span className="font-medium text-ink">{resultCount}</span> {resultNoun}
          </p>
          {active ? (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border px-3.5 text-sm text-ink transition-colors hover:border-primary hover:text-primary"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              Clear filters
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border border-dashed border-border bg-sand p-10 text-center">
      <h3 className="display-3 text-ink">{title}</h3>
      <div className="mt-4 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}
