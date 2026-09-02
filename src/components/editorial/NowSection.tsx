import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

import { nowItems } from "@/data/content";
import type { NowItem } from "@/types/content";
import { cn } from "@/lib/utils";

const kindLabel: Record<string, string> = {
  live: "Live",
  opening: "Next",
  call: "Open call",
  release: "New",
};

const lenses: { id: string; label: string; match: (i: NowItem) => boolean }[] = [
  { id: "all", label: "Everything", match: () => true },
  { id: "live", label: "On now", match: (i) => i.kind === "live" },
  { id: "next", label: "Opening next", match: (i) => i.kind === "opening" },
  { id: "call", label: "Open calls", match: (i) => i.kind === "call" },
  { id: "new", label: "Just published", match: (i) => i.kind === "release" },
];

/**
 * NOW — the platform's signature strip. One glance answers: what is happening
 * with Indonesian culture in the world today? Switching lens animates the
 * list rather than reloading the screen.
 */
export function NowSection() {
  const [lens, setLens] = useState("all");
  const current = lenses.find((l) => l.id === lens) ?? lenses[0]!;
  const items = nowItems.filter(current.match);

  return (
    <section
      id="now"
      aria-labelledby="now-title"
      className="scroll-mt-24 border-y border-border bg-ink-deep text-[oklch(0.96_0.01_40)]"
    >
      <div className="container-editorial py-14 md:py-16">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="relative grid h-3 w-3 shrink-0 place-items-center">
              <span className="wave-pulse absolute inset-0 rounded-full border border-primary" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <h2 id="now-title" className="truncate text-2xl font-semibold tracking-[-0.03em]">
              NOW
            </h2>
          </div>
          <p className="col-span-2 text-sm text-[oklch(0.78_0.02_30)] sm:col-auto sm:max-w-sm sm:text-right">
            What is open, on stage or closing this week.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Filter what is happening now"
          className="mt-7 -mx-1 flex snap-x gap-1 overflow-x-auto pb-1"
        >
          {lenses.map((l) => {
            const isActive = l.id === lens;
            const count = nowItems.filter(l.match).length;
            return (
              <button
                key={l.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                disabled={count === 0}
                onClick={() => setLens(l.id)}
                className={cn(
                  "press relative snap-start rounded-full px-4 py-2 text-sm whitespace-nowrap disabled:opacity-40",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-[oklch(0.82_0.02_30)] hover:bg-white/10",
                )}
              >
                {l.label}
                <span className="ml-2 text-xs opacity-70 tabular-nums">{count}</span>
              </button>
            );
          })}
        </div>

        <ul
          key={lens}
          className="list-swap mt-6 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {items.map((item, i) => (
            <li
              key={item.id}
              className="stagger-item bg-ink-deep"
              style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}
            >
              <a
                href={item.href}
                className="group flex h-full min-h-11 flex-col justify-between gap-8 p-6 transition-colors duration-200 hover:bg-clay/60"
              >
                <span className="flex items-center gap-2">
                  {item.kind === "live" ? (
                    <span className="relative grid h-2 w-2 place-items-center">
                      <span className="wave-pulse absolute inset-0 rounded-full border border-pink" />
                      <span className="h-1 w-1 rounded-full bg-pink" />
                    </span>
                  ) : null}
                  <span className="eyebrow text-pink">{kindLabel[item.kind] ?? item.label}</span>
                </span>
                <span>
                  <span className="block text-lg leading-snug font-medium tracking-tight">
                    {item.headline}
                  </span>
                  <span className="mt-3 flex items-center gap-1.5 text-xs text-[oklch(0.76_0.02_30)]">
                    {item.meta}
                    <ArrowUpRight className="arrow-nudge h-3.5 w-3.5 text-pink" />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
