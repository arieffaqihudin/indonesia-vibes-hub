import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { STATUSES, type SubmissionStatus } from "@/lib/contributor/schema";

export const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-ink placeholder:text-warm-grey/70 shadow-none outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 disabled:opacity-60";

export const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-[background-color,color,border-color,transform] duration-200 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50";

export const btn = {
  primary: cn(buttonBase, "bg-primary text-primary-foreground hover:bg-deep-red"),
  secondary: cn(buttonBase, "border border-border text-ink hover:border-primary hover:text-primary"),
  ghost: cn(buttonBase, "text-muted-foreground hover:text-primary"),
  quiet: cn(buttonBase, "min-h-9 px-3 text-xs border border-border text-ink hover:border-primary hover:text-primary"),
};

const toneClass: Record<string, string> = {
  quiet: "bg-muted text-muted-foreground",
  neutral: "bg-blush text-clay",
  progress: "bg-blush text-clay",
  action: "bg-primary text-primary-foreground",
  good: "bg-ink text-background",
};

/**
 * Status is never communicated by colour alone: every badge carries the
 * status word, and action-needed states also carry a dot marker + label.
 */
export function StatusBadge({ status, className }: { status: SubmissionStatus; className?: string }) {
  const meta = STATUSES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-medium tracking-wide",
        toneClass[meta.tone],
        className,
      )}
    >
      {meta.tone === "progress" ? (
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden />
      ) : null}
      {meta.label}
      {meta.actionNeeded ? <span className="sr-only"> — your action is needed</span> : null}
    </span>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
  description,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-card", className)}>
      {title ? (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-ink">{title}</h2>
            {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
          </div>
          {action}
        </header>
      ) : null}
      <div className="p-5">{children}</div>
    </section>
  );
}

/** Restrained empty state — a wave rule, a line of copy, one action. */
export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-border px-6 py-12 text-center">
      <svg viewBox="0 0 120 24" className="h-6 w-28 text-pink" aria-hidden>
        <path
          d="M0 12c10-10 20-10 30 0s20 10 30 0 20-10 30 0 20 10 30 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
      <p className="mt-4 text-sm font-medium text-ink">{title}</p>
      {body ? <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function PageHeading({
  eyebrow,
  title,
  intro,
  action,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-primary uppercase">{eyebrow}</p>
        ) : null}
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h1>
        {intro ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{intro}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function Meter({ percent, label }: { percent: number; label?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-muted-foreground">{label ?? "Submission readiness"}</span>
        <span className="text-sm font-semibold text-ink">{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Submission readiness"}
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function PrototypeNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-dashed border-border bg-sand px-3 py-2 text-xs text-muted-foreground">
      {children}
    </p>
  );
}

export function ExternalCta({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="text-sm font-medium text-primary underline underline-offset-4">
      {children} <span aria-hidden>↗</span>
    </Link>
  );
}

export const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "—";

export function relativeTime(value?: string | number | null) {
  if (!value) return "";
  const then = typeof value === "number" ? value : new Date(value).getTime();
  const diff = Date.now() - then;
  if (diff < 45_000) return "just now";
  const mins = Math.round(diff / 60_000);
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return formatDate(new Date(then).toISOString());
}
