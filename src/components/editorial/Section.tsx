import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  action,
  actionLabel = "See all",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  action?: string;
  actionLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6 border-b border-border pb-6",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow text-primary">{eyebrow}</p> : null}
        <h2 className="display-2 mt-3 text-ink">{title}</h2>
        {intro ? <p className="standfirst mt-4 max-w-2xl">{intro}</p> : null}
      </div>
      {action ? (
        <Link
          to={action}
          className="link-underline hidden shrink-0 items-center gap-1.5 pb-2 text-sm font-medium text-ink sm:inline-flex"
        >
          {actionLabel}
          <ArrowUpRight className="h-4 w-4 text-primary" />
        </Link>
      ) : null}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children?: ReactNode;
}) {
  return (
    <header className="wave-field border-b border-border bg-sand" style={{ ["--wave-x" as string]: "88%", ["--wave-y" as string]: "10%" }}>
      <div className="container-editorial py-16 md:py-24">
        <p className="eyebrow text-primary">{eyebrow}</p>
        <h1 className="display-1 mt-5 max-w-4xl text-ink">{title}</h1>
        <p className="standfirst mt-6 max-w-2xl">{intro}</p>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </header>
  );
}