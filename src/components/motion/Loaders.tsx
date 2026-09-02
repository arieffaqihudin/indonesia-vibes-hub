import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Wave-inspired loading indicator — three concentric arcs, not a spinner. */
export function WaveLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-3">
      <svg viewBox="0 0 40 24" className="h-6 w-10" aria-hidden>
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx="6"
            cy="12"
            r={4 + i * 5}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="1.2"
            className="ring-ping"
            style={{ animationDelay: `${i * 700}ms`, transformOrigin: "6px 12px" }}
          />
        ))}
      </svg>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

/** Skeleton block that matches the layout it replaces. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton-wave rounded-sm", className)} aria-hidden />;
}

export function CardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[3/2] w-full" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-3 w-full" />
    </div>
  );
}

/** Editorial empty state — a sentence and a way onward, never a mascot. */
export function EmptyState({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <div className="wave-field border border-border bg-sand px-6 py-16 text-center" style={{ ["--wave-x" as string]: "50%", ["--wave-y" as string]: "40%" }}>
      <p className="display-3 mx-auto max-w-xl text-ink">{title}</p>
      <p className="mx-auto mt-4 max-w-lg text-[0.95rem] leading-relaxed text-muted-foreground">
        {body}
      </p>
      {children ? <div className="mt-7 flex flex-wrap justify-center gap-3">{children}</div> : null}
    </div>
  );
}
