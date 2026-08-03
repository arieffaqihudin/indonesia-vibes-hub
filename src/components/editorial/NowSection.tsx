import { ArrowUpRight } from "lucide-react";

import { nowItems } from "@/data/content";

const kindLabel: Record<string, string> = {
  live: "Live",
  opening: "Next",
  call: "Open call",
  release: "New",
};

/**
 * NOW — the platform's signature strip. One glance answers: what is happening
 * with Indonesian culture in the world today?
 */
export function NowSection() {
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

        <ul className="mt-10 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {nowItems.map((item) => (
            <li key={item.id} className="bg-ink-deep">
              <a
                href={item.href}
                className="group flex h-full min-h-11 flex-col justify-between gap-8 p-6 transition-colors hover:bg-clay/60"
              >
                <span className="eyebrow text-pink">{kindLabel[item.kind] ?? item.label}</span>
                <span>
                  <span className="block text-lg leading-snug font-medium tracking-tight">
                    {item.headline}
                  </span>
                  <span className="mt-3 flex items-center gap-1.5 text-xs text-[oklch(0.76_0.02_30)]">
                    {item.meta}
                    <ArrowUpRight className="h-3.5 w-3.5 text-pink transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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