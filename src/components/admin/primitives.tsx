import { Link } from "@tanstack/react-router";
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";


import { cn } from "@/lib/utils";
import { CONTENT_STATUS, type ContentStatus } from "@/lib/admin/types";

/* ---------------- form + button styles ---------------- */

export const field =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-ink placeholder:text-muted-foreground/60 outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 disabled:opacity-60";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50";

export const abtn = {
  primary: cn(base, "min-h-9 bg-primary px-4 text-primary-foreground hover:bg-deep-red"),
  secondary: cn(base, "min-h-9 border border-border px-4 text-ink hover:border-primary hover:text-primary"),
  quiet: cn(base, "min-h-8 px-2.5 text-xs text-muted-foreground hover:text-primary"),
  small: cn(base, "min-h-8 border border-border px-3 text-xs text-ink hover:border-primary hover:text-primary"),
  danger: cn(base, "min-h-9 border border-primary/40 px-4 text-primary hover:bg-primary/5"),
};

/* ---------------- status ---------------- */

const groupDot: Record<string, string> = {
  incoming: "bg-muted-foreground",
  working: "bg-clay",
  waiting: "bg-primary",
  cleared: "bg-clay",
  live: "bg-ink",
  closed: "bg-border",
};

/** Status never relies on colour alone: a small dot plus the word. */
export function StatusPill({ status, className }: { status: ContentStatus; className?: string }) {
  const meta = CONTENT_STATUS[status];
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-xs whitespace-nowrap text-ink", className)}
      title={meta.meaning}
    >
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", groupDot[meta.group])} aria-hidden />
      {meta.label}
    </span>
  );
}

export function Tag({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "alert" | "quiet" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-1.5 py-0.5 text-[0.68rem] font-medium whitespace-nowrap",
        tone === "alert" && "border-primary/40 text-primary",
        tone === "quiet" && "border-border text-muted-foreground",
        tone === "default" && "border-border text-ink",
      )}
    >
      {children}
    </span>
  );
}

/* ---------------- layout blocks ---------------- */

export function PageHeading({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <header className="mb-5 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
      <div className="min-w-0 max-w-2xl">
        {eyebrow ? (
          <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">{eyebrow}</p>
        ) : null}
        <h1 className="mt-1 text-[1.375rem] leading-tight font-semibold tracking-tight text-ink sm:text-2xl">{title}</h1>
        {description ? <p className="mt-1.5 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2 [&>*]:max-sm:flex-1 [&>*]:max-sm:justify-center">{actions}</div>
      ) : null}
    </header>

  );
}

export function Card({
  title,
  description,
  action,
  children,
  className,
  bodyClass,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClass?: string;
}) {
  return (
    <section className={cn("mb-8", className)}>
      {title ? (
        <header className="mb-3 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-2">
          <div>
            <h2 className="text-[0.72rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">{title}</h2>
            {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
          </div>
          {action}
        </header>
      ) : null}
      <div className={bodyClass}>{children}</div>
    </section>
  );
}

/** Flat single-line notice used instead of a boxed alert card. */
export function InlineNote({
  children,
  tone = "info",
  action,
}: {
  children: ReactNode;
  tone?: "info" | "attention";
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-4 flex flex-wrap items-center gap-2 border-l-2 px-3 py-2 text-xs",
        tone === "attention" ? "border-primary bg-blush text-clay" : "border-border bg-muted text-ink",
      )}
    >
      <span className="flex-1">{children}</span>
      {action}
    </div>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="border-y border-border px-4 py-10 text-center">
      <p className="text-sm font-medium text-ink">{title}</p>
      {hint ? <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">{hint}</p> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function Metric({ value, label, hint }: { value: ReactNode; label: string; hint?: string }) {
  return (
    <div className="border-l border-border py-1 pl-3">
      <p className="text-xl font-semibold tracking-tight text-ink tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-ink">{label}</p>
      {hint ? <p className="mt-0.5 text-[0.7rem] leading-snug text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/** Compact horizontal bar used instead of chart libraries. */
export function BarRow({ label, value, max, suffix }: { label: string; value: number; max: number; suffix?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="w-40 shrink-0 truncate text-xs text-ink">{label}</span>
      <span className="h-1.5 flex-1 rounded-full bg-muted" aria-hidden>
        <span className="block h-full rounded-full bg-clay" style={{ width: `${pct}%` }} />
      </span>
      <span className="w-14 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
        {value}
        {suffix ?? ""}
      </span>
    </div>
  );
}

/* ---------------- tabs / filters ---------------- */

export function TabBar({
  tabs,
  active,
  onChange,
  label,
}: {
  tabs: { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
  label: string;
}) {
  return (
    <div className="scroll-strip -mx-4 border-b border-border px-4 sm:mx-0 sm:px-0">
      <div role="tablist" aria-label={label} className="flex w-max min-w-full gap-1 sm:w-auto sm:flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={active === tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "-mb-px min-h-10 shrink-0 rounded-t border-b-2 px-3 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              active === tab.id
                ? "border-primary text-ink"
                : "border-transparent text-muted-foreground hover:text-ink",
            )}
          >
            {tab.label}
            {typeof tab.count === "number" ? (
              <span className="ml-1.5 tabular-nums text-muted-foreground">{tab.count}</span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );

}

export function SelectFilter({
  label,
  value,
  options,
  onChange,
  allLabel = "All",
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  allLabel?: string;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span>{label}</span>
      <select id={id} className={cn(field, "min-h-8 w-auto py-1 text-xs")} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{allLabel}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}) {
  const id = useId();
  return (
    <div className="min-w-48 flex-1">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="search"
        className={cn(field, "min-h-8 py-1.5 text-xs")}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* ---------------- table ---------------- */

/**
 * One table component with two intentional shapes.
 *
 * From 48rem up it is a normal dense table (horizontally scrollable only if the
 * columns genuinely need it). Below that, `.table-adaptive` turns each row into
 * a structured record block: headline first, remaining values labelled with
 * their column name, row actions pinned top-right. Column names are injected
 * into each cell automatically, so no page has to repeat them.
 */
export function Table({
  head,
  children,
  caption,
  /** Force the desktop table shape at every width (genuinely tabular data). */
  alwaysTable,
}: {
  head: string[];
  children: ReactNode;
  caption?: string;
  alwaysTable?: boolean;
}) {
  const labelled = Children.map(children, (row) => {
    if (!isValidElement(row)) return row;
    const rowProps = row.props as { children?: ReactNode };
    let i = 0;
    const cells = Children.map(rowProps.children, (cell) => {
      if (!isValidElement(cell)) return cell;
      const label = head[i] ?? "";
      i += 1;
      const cellProps = cell.props as { label?: string };
      if (cellProps.label !== undefined) return cell;
      return cloneElement(cell as ReactElement<{ label?: string }>, { label });
    });
    return cloneElement(row as ReactElement<{ children?: ReactNode }>, { children: cells });
  });

  return (
    <div className={cn(alwaysTable ? "overflow-x-auto" : "md:overflow-x-auto")}>
      <table
        className={cn(
          "w-full border-collapse text-left text-sm",
          alwaysTable ? "min-w-[46rem]" : "table-adaptive md:min-w-[46rem]",
        )}
      >
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead className="sticky top-0 z-10 bg-background">
          <tr className="border-b border-border">
            {head.map((h, i) => (
              <th
                key={h || `col-${i}`}
                scope="col"
                className="border-b border-border px-3 pb-2 text-[0.68rem] font-medium tracking-[0.12em] text-muted-foreground uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{alwaysTable ? children : labelled}</tbody>
      </table>
    </div>
  );
}

export function Td({
  children,
  className,
  label,
  colSpan,
}: {
  children: ReactNode;
  className?: string;
  /** Column name, injected by Table; shown as the label in the mobile shape. */
  label?: string;
  colSpan?: number;
}) {
  return (
    <td
      data-label={label}
      colSpan={colSpan}
      className={cn("border-b border-border/70 px-3 py-3 align-middle text-ink md:border-b", className)}
    >
      {children}
    </td>
  );
}


/* ---------------- dialogs ---------------- */

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>("button, input, select, textarea, a[href]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !ref.current) return;
      const focusable = ref.current.querySelectorAll<HTMLElement>(
        "button:not([disabled]), input, select, textarea, a[href]",
      );
      if (!focusable.length) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-auto rounded-lg border border-border bg-card shadow-lg"
      >
        <header className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
          <h2 id={titleId} className="text-sm font-semibold text-ink">
            {title}
          </h2>
          <button type="button" className={abtn.quiet} onClick={onClose}>
            Close
          </button>
        </header>
        <div className="space-y-3 p-4 text-sm text-ink">{children}</div>
        {footer ? <footer className="flex flex-wrap justify-end gap-2 border-t border-border px-4 py-3">{footer}</footer> : null}
      </div>
    </div>
  );
}

/** Confirmation before publishing, archiving, or removing a relationship. */
export function useConfirm() {
  const [pending, setPending] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const dialog = (
    <Modal
      open={Boolean(pending)}
      onClose={() => setPending(null)}
      title="Please confirm"
      footer={
        <>
          <button type="button" className={abtn.secondary} onClick={() => setPending(null)}>
            Cancel
          </button>
          <button
            type="button"
            className={abtn.primary}
            onClick={() => {
              pending?.onConfirm();
              setPending(null);
            }}
          >
            Confirm
          </button>
        </>
      }
    >
      <p>{pending?.message}</p>
    </Modal>
  );
  return { confirm: (message: string, onConfirm: () => void) => setPending({ message, onConfirm }), dialog };
}

/* ---------------- misc ---------------- */

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline">
      {children}
      <span aria-hidden>↗</span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export function InternalOnly({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-clay/50 bg-blush/40 px-3 py-2 text-xs text-clay">
      <p className="font-semibold tracking-wide uppercase">Internal only</p>
      <div className="mt-1 text-ink">{children}</div>
    </div>
  );
}

export function PrototypeNote({ children }: { children: ReactNode }) {
  return <p className="text-[0.7rem] leading-relaxed text-muted-foreground">Prototype: {children}</p>;
}

export const dateFmt = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

export const timeFmt = (iso?: string) =>
  iso ? new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "";

export function relative(iso?: string) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.round(diff / 86_400_000);
  if (Math.abs(days) < 1) return "today";
  if (days === 1) return "yesterday";
  if (days > 1 && days < 30) return `${days} days ago`;
  if (days <= -1 && days > -30) return `in ${Math.abs(days)} days`;
  return dateFmt(iso);
}

export function RecordLink({
  to,
  params,
  children,
}: {
  to: string;
  params?: Record<string, string>;
  children: ReactNode;
}) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Link to={to as any} params={params as any} className="font-medium text-ink underline-offset-4 hover:text-primary hover:underline">
      {children}
    </Link>
  );
}

/* ---------------- row actions ---------------- */

export interface RowAction {
  label: string;
  onSelect: () => void;
  danger?: boolean;
}

/** The "•••" menu at the end of a table row; keeps rows free of button clusters. */
export function RowActions({ actions, label }: { actions: RowAction[]; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span aria-hidden>•••</span>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute top-9 right-0 z-20 w-44 border border-border bg-card py-1 shadow-md"
        >
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                a.onSelect();
              }}
              className={cn(
                "block w-full px-3 py-1.5 text-left text-xs hover:bg-muted",
                a.danger ? "text-primary" : "text-ink",
              )}
            >
              {a.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
