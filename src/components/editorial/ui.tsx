import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ExternalLink as ExternalIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { InquirySearch } from "@/lib/inquiry";

export function Pill({
  children,
  tone = "quiet",
}: {
  children: ReactNode;
  tone?: "quiet" | "brand" | "outline";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.7rem] font-medium tracking-wide",
        tone === "brand" && "bg-primary text-primary-foreground",
        tone === "quiet" && "bg-blush text-clay",
        tone === "outline" && "border border-border text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

export function InquiryButton({
  search,
  children,
  variant = "primary",
}: {
  search: InquirySearch;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      to="/contact"
      search={search}
      hash="inquiry"
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors",
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:bg-deep-red"
          : "border border-border text-ink hover:border-primary hover:text-primary",
      )}
    >
      {children}
      <ArrowUpRight className="h-4 w-4" aria-hidden />
    </Link>
  );
}

export function OutboundLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "inline-flex min-h-9 items-center gap-1.5 text-sm font-medium text-primary underline underline-offset-4",
        className,
      )}
    >
      {children}
      <ExternalIcon className="h-3.5 w-3.5" aria-hidden />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export function FactList({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="space-y-5">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="eyebrow text-muted-foreground">{item.label}</dt>
          <dd className="mt-2 text-sm leading-relaxed text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function DetailSection({
  title,
  intro,
  children,
  className,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-t border-border pt-10", className)}>
      <h2 className="display-3 text-ink">{title}</h2>
      {intro ? <p className="standfirst mt-3 max-w-2xl">{intro}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function LastReviewed({ date }: { date: string }) {
  return (
    <p className="text-xs text-muted-foreground">
      Last reviewed{" "}
      <time dateTime={date}>
        {new Date(date + "T00:00:00Z").toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        })}
      </time>
    </p>
  );
}
