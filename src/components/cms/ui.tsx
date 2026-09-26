import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { CmsStatus } from "@/lib/cms/types";

export const btn = {
  primary: "inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground transition hover:bg-deep-red disabled:pointer-events-none disabled:opacity-50",
  secondary: "inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3.5 text-sm font-medium text-ink transition hover:bg-muted disabled:pointer-events-none disabled:opacity-50",
  ghost: "inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-2.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-ink",
  icon: "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-ink disabled:opacity-30",
};

export const inputClass = "h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-ink outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/15";

const STATUS_STYLE: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground",
  "In Review": "bg-sand text-ink ring-1 ring-border",
  Scheduled: "bg-blush text-deep-red",
  Published: "bg-primary/10 text-primary",
  Archived: "bg-muted text-muted-foreground line-through",
  New: "bg-primary text-primary-foreground",
  Reviewing: "bg-sand text-ink ring-1 ring-border",
  "Need Information": "bg-blush text-deep-red",
  "In Discussion": "bg-primary/10 text-primary",
  Closed: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: CmsStatus | string }) {
  return <span className={cn("inline-flex h-5 items-center whitespace-nowrap rounded-md px-1.5 text-[0.6875rem] font-medium", STATUS_STYLE[status] ?? "bg-muted text-muted-foreground")}>{status}</span>;
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
    <div className="min-w-0"><h1 className="text-xl font-semibold text-ink">{title}</h1>{description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}</div>
    {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
  </div>;
}

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: string | undefined; children: ReactNode; htmlFor?: string | undefined }) {
  return <div className="space-y-1.5">
    <label htmlFor={htmlFor} className="block text-xs font-medium text-ink">{label}</label>
    {children}
    {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
  </div>;
}

export function TextInput({ value, onChange, placeholder, id, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; id?: string; type?: string }) {
  return <input id={id} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputClass} />;
}

export function TextArea({ value, onChange, placeholder, rows = 3, id }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; id?: string }) {
  return <textarea id={id} rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={cn(inputClass, "h-auto py-2 leading-relaxed")} />;
}

export function Select({ value, onChange, options, id, placeholder }: { value: string; onChange: (v: string) => void; options: (string | { value: string; label: string })[]; id?: string; placeholder?: string }) {
  return <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={cn(inputClass, "pr-8")}>
    {placeholder !== undefined ? <option value="">{placeholder}</option> : null}
    {options.map((o) => typeof o === "string" ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>;
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex min-h-9 w-full items-center justify-between gap-3 text-sm text-ink">
    <span>{label}</span>
    <span className={cn("relative h-5 w-9 shrink-0 rounded-full transition", checked ? "bg-primary" : "bg-muted-foreground/30")}><span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition", checked ? "left-[1.125rem]" : "left-0.5")} /></span>
  </button>;
}

/** A plain settings group in the editor sidebar; collapsible when marked. */
export function Panel({ title, children, collapsible = false, defaultOpen = true }: { title: string; children: ReactNode; collapsible?: boolean; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return <section className="border-b border-border py-4 last:border-b-0">
    {collapsible
      ? <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between text-left text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground hover:text-ink">{title}<ChevronDown className={cn("h-3.5 w-3.5 transition", open && "rotate-180")} /></button>
      : <h2 className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>}
    {open ? <div className="mt-3 space-y-4">{children}</div> : null}
  </section>;
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string; count?: number }[]; value: T; onChange: (id: T) => void }) {
  return <div role="tablist" className="mb-4 flex gap-1 overflow-x-auto border-b border-border">
    {tabs.map((t) => <button key={t.id} role="tab" aria-selected={value === t.id} onClick={() => onChange(t.id)} className={cn("-mb-px flex h-10 shrink-0 items-center gap-1.5 border-b-2 px-3 text-sm transition", value === t.id ? "border-primary font-medium text-ink" : "border-transparent text-muted-foreground hover:text-ink")}>
      {t.label}{t.count !== undefined ? <span className="rounded bg-muted px-1.5 text-[0.6875rem] text-muted-foreground">{t.count}</span> : null}
    </button>)}
  </div>;
}

export function EmptyState({ title, text, action }: { title: string; text?: string | undefined; action?: ReactNode }) {
  return <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
    <p className="text-sm font-medium text-ink">{title}</p>
    {text ? <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p> : null}
    {action ? <div className="mt-4">{action}</div> : null}
  </div>;
}

/** Performance values stay empty until a real analytics source is connected. */
export const NO_DATA = "—";
