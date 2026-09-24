import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/editorial/Section";
import { eventLocationLabel } from "@/data/content";
import { comingUpEvents } from "@/lib/freshness";
import type { CulturalEvent } from "@/types/content";

/** "8–12", "21", or nothing at all when only the month is confirmed. */
const dayLabel = (e: CulturalEvent) => {
  if (e.datePrecision === "month") return "";
  const day = (iso: string) => String(Number(iso.slice(8, 10)));
  if (!e.endDate || e.endDate === e.startDate) return day(e.startDate);
  const sameMonth = e.endDate.slice(0, 7) === e.startDate.slice(0, 7);
  return sameMonth ? `${day(e.startDate)}–${day(e.endDate)}` : `${day(e.startDate)} –`;
};

const monthLabel = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

/**
 * A chronological, month-grouped read of the canonical event records — the
 * same records the events pages and the map use, never a second copy.
 */
export function ComingUpAroundWorld({ limit = 12 }: { limit?: number }) {
  const events = comingUpEvents().slice(0, limit);

  const months: { key: string; label: string; items: CulturalEvent[] }[] = [];
  for (const e of events) {
    const key = e.startDate.slice(0, 7);
    const group = months.find((m) => m.key === key);
    if (group) group.items.push(e);
    else months.push({ key, label: monthLabel(e.startDate), items: [e] });
  }

  return (
    <section className="container-editorial py-16 md:py-24">
      <Reveal>
        <SectionHeading
          eyebrow="Experience"
          title="Coming up around the world"
          intro="Indonesian culture, ideas, and collaborations taking place across the world."
          action="/events-places"
          actionLabel="All events"
        />
      </Reveal>

      {months.length ? (
        <div className="mt-10 space-y-10">
          {months.map((m, mi) => (
            <Reveal key={m.key} delay={mi * 60}>
              <h3 className="eyebrow border-b border-border pb-3 text-primary">{m.label}</h3>
              <ul className="divide-y divide-border">
                {m.items.map((e) => {
                  const location = eventLocationLabel(e);
                  return (
                    <li key={e.id}>
                      <Link
                        to="/events/$slug"
                        params={{ slug: e.slug }}
                        className="group grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-baseline gap-4 py-5 md:grid-cols-[5rem_10rem_minmax(0,1fr)_auto] md:gap-6"
                      >
                        <span className="text-sm font-medium text-ink tabular-nums">{dayLabel(e)}</span>
                        <span className="text-sm text-muted-foreground md:truncate">{location}</span>
                        <span className="col-span-2 text-lg leading-snug font-medium text-ink group-hover:text-primary md:col-span-1">
                          {e.title}
                        </span>
                        <ArrowUpRight className="arrow-nudge hidden h-5 w-5 shrink-0 self-center text-primary md:block" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mt-10 border-y border-border py-6 text-sm text-muted-foreground">
          No upcoming dates are currently listed. Programmes in preparation appear under{" "}
          <Link to="/collaborate" className="link-underline text-primary">
            collaborations
          </Link>
          .
        </p>
      )}
    </section>
  );
}
