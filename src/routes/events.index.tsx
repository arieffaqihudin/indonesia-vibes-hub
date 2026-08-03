import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/editorial/Section";
import { events, formatRange, getPlace } from "@/data/content";

export const Route = createFileRoute("/events/")({
  head: () => ({
    meta: [
      { title: "Events — Indonesia Vibes" },
      { name: "description", content: "Exhibitions, performances, screenings, workshops and residencies presenting Indonesian culture worldwide." },
      { property: "og:title", content: "Events — Indonesia Vibes" },
      { property: "og:description", content: "Exhibitions, performances, screenings, workshops and residencies presenting Indonesian culture worldwide." },
      { property: "og:url", content: "/events" },
    ],
    links: [{ rel: "canonical", href: "/events" }],
  }),
  component: EventsPage,
});

function EventsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Experience"
        title="Events"
        intro="Exhibitions, performances, screenings, workshops and residencies — the programme as it stands today."
      />
      <div className="container-editorial py-16">
        <ul className="divide-y divide-border border-y border-border">
          {events.map((e) => {
            const place = getPlace(e.placeId);
            return (
              <li key={e.id}>
                <Link
                  to="/events/$slug"
                  params={{ slug: e.slug }}
                  className="group grid grid-cols-[minmax(0,1fr)] items-center gap-6 py-7 md:grid-cols-[10rem_minmax(0,1fr)_12rem]"
                >
                  <img src={e.image} alt="" width={1600} height={1104} loading="lazy" className="hidden aspect-[4/3] w-40 object-cover md:block" />
                  <span className="min-w-0">
                    <span className="eyebrow text-primary">
                      {e.type} · {place?.name}, {place?.country}
                    </span>
                    <span className="mt-2 block text-xl leading-snug font-medium text-ink group-hover:text-primary">
                      {e.title}
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{e.summary}</span>
                  </span>
                  <span className="text-sm text-muted-foreground md:text-right">{formatRange(e.startDate, e.endDate)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
