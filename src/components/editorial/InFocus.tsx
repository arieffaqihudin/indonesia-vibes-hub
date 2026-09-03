import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { getFreshContent } from "@/lib/freshness";

/**
 * IN FOCUS — a compact editorial composition of what is currently relevant
 * across the platform: a dominant feature plus three to four current items.
 * Every item is derived from canonical data, so the strip stays populated even
 * in a quiet month for events.
 */
export function InFocus() {
  const items = getFreshContent({ limit: 5 });
  const [feature, ...rest] = items;
  if (!feature) return null;

  return (
    <section
      id="in-focus"
      aria-labelledby="in-focus-title"
      className="scroll-mt-24 border-y border-border bg-ink-deep text-[oklch(0.96_0.01_40)]"
    >
      <div className="container-editorial py-14 md:py-16">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 id="in-focus-title" className="text-2xl font-semibold tracking-[-0.03em]">
            In focus
          </h2>
          <p className="max-w-md text-sm text-[oklch(0.78_0.02_30)] sm:text-right">
            What&rsquo;s happening, emerging and worth following across Indonesian culture.
          </p>
        </div>

        <div className="mt-8 grid gap-px overflow-hidden border border-white/10 bg-white/10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          {/* Dominant feature */}
          <article className="stagger-item bg-ink-deep">
            <Link
              to={feature.href}
              className="group grid h-full gap-6 p-6 transition-colors duration-200 hover:bg-clay/60 md:p-8"
            >
              {feature.image ? (
                <span className="media-zoom block overflow-hidden">
                  <img
                    src={feature.image}
                    alt=""
                    width={1200}
                    height={800}
                    loading="lazy"
                    className="aspect-[16/9] w-full object-cover"
                  />
                </span>
              ) : null}
              <span>
                <span className="eyebrow text-pink">{feature.label}</span>
                <span className="mt-3 block text-2xl leading-tight font-medium tracking-tight md:text-[1.75rem]">
                  {feature.headline}
                </span>
                <span className="mt-3 flex items-center gap-1.5 text-sm text-[oklch(0.76_0.02_30)]">
                  {feature.meta}
                  <ArrowUpRight className="arrow-nudge h-4 w-4 text-pink" />
                </span>
              </span>
            </Link>
          </article>

          {/* Current items */}
          <ul className="grid gap-px bg-white/10">
            {rest.map((item, i) => (
              <li
                key={item.id}
                className="stagger-item bg-ink-deep"
                style={{ ["--reveal-delay" as string]: `${60 + i * 60}ms` }}
              >
                <Link
                  to={item.href}
                  className="group flex h-full min-h-11 flex-col justify-center gap-2 p-6 transition-colors duration-200 hover:bg-clay/60"
                >
                  <span className="eyebrow text-pink">{item.label}</span>
                  <span className="block text-lg leading-snug font-medium tracking-tight">
                    {item.headline}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-[oklch(0.76_0.02_30)]">
                    {item.meta}
                    <ArrowUpRight className="arrow-nudge h-3.5 w-3.5 text-pink" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
