import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { FilterBar } from "@/components/editorial/FilterBar";
import { PageHeader } from "@/components/editorial/Section";
import { eventLocationLabel, events, eventStatus, formatEventDates, getPlace } from "@/data/content";
import { cn } from "@/lib/utils";

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

type When = "On now" | "Upcoming" | "Past" | "All";
type Where = "Everywhere" | "In Indonesia" | "Around the world";

const WHEN: When[] = ["All", "On now", "Upcoming", "Past"];
const WHERE: Where[] = ["Everywhere", "In Indonesia", "Around the world"];

const statusTone: Record<string, string> = {
  "On now": "bg-primary text-primary-foreground",
  Upcoming: "bg-pale text-deep-red",
  Past: "bg-muted text-muted-foreground",
};

function EventsPage() {
  const [query, setQuery] = useState("");
  const [when, setWhen] = useState<When>("All");
  const [where, setWhere] = useState<Where>("Everywhere");

  const decorated = useMemo(
    () =>
      events
        .map((e) => ({ event: e, status: eventStatus(e), place: e.placeId ? getPlace(e.placeId) : undefined }))
        .sort((a, b) => {
          const rank = { "On now": 0, Upcoming: 1, Past: 2 } as const;
          if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
          return a.status === "Past"
            ? b.event.startDate.localeCompare(a.event.startDate)
            : a.event.startDate.localeCompare(b.event.startDate);
        }),
    [],
  );

  const q = query.trim().toLowerCase();
  const results = decorated.filter(({ event, status, place }) => {
    if (when !== "All" && status !== when) return false;
    if (
      q &&
      ![event.title, event.summary ?? "", eventLocationLabel(event), event.type ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q)
    )
      return false;
    const country = place?.country ?? event.location?.country;
    if (where === "In Indonesia" && country !== "Indonesia") return false;
    if (where === "Around the world" && country === "Indonesia") return false;
    return Boolean(event);
  });

  const count = (w: When) => (w === "All" ? decorated.length : decorated.filter((d) => d.status === w).length);

  return (
    <>
      <PageHeader
        eyebrow="Experience"
        title="Events"
        intro="Exhibitions, performances, screenings, workshops and residencies — the programme as it stands today. Every listing links on to the venue's own information."
      />

      <FilterBar
        search={{ value: query, onChange: setQuery, placeholder: "Event, venue, city or country" }}
        primary={[
          {
            id: "when",
            label: "When",
            options: WHEN.filter((w) => w !== "All").map((w) => `${w} (${count(w)})`),
            value: when === "All" ? null : `${when} (${count(when)})`,
            onChange: (v) => setWhen((v ? (v.replace(/ \(\d+\)$/, "") as When) : "All")),
            allLabel: `All (${count("All")})`,
          },
          {
            id: "where",
            label: "Where",
            options: WHERE.filter((w) => w !== "Everywhere"),
            value: where === "Everywhere" ? null : where,
            onChange: (v) => setWhere((v ?? "Everywhere") as Where),
            allLabel: "Everywhere",
          },
        ]}
        resultCount={results.length}
        resultNoun={results.length === 1 ? "event" : "events"}
      />

      <div className="container-editorial py-16">
        <h2 className="sr-only">Event listings</h2>
        {results.length ? (
          <ul className="divide-y divide-border border-y border-border">
            {results.map(({ event: e, status, place }) => (
              <li key={e.id}>
                <Link
                  to="/events/$slug"
                  params={{ slug: e.slug }}
                  className="group grid grid-cols-[minmax(0,1fr)] items-center gap-6 py-7 md:grid-cols-[10rem_minmax(0,1fr)_12rem]"
                >
                  {e.image ? (
                  <img
                    src={e.image}
                    alt=""
                    width={1600}
                    height={1104}
                    loading="lazy"
                    className={cn("hidden aspect-[4/3] w-40 object-cover md:block", status === "Past" && "opacity-60")}
                  />
                  ) : (
                    <span className="hidden aspect-[4/3] w-40 bg-muted md:block" aria-hidden="true" />
                  )}
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", statusTone[status])}>
                        {status}
                      </span>
                      <span className="eyebrow text-muted-foreground">
                        {[e.type, eventLocationLabel(e)].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                    <span className="mt-2.5 block text-xl leading-snug font-medium text-ink group-hover:text-primary">
                      {e.title}
                    </span>
                    {e.summary || e.sourceNote ? (
                      <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{e.summary ?? e.sourceNote}</span>
                    ) : null}
                  </span>
                  <span className="text-sm text-muted-foreground md:text-right">
                    {formatEventDates(e)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 max-w-xl border border-border p-8">
            <p className="text-ink">
              No events are listed for that combination yet — the programme is published a season at a
              time, so this is a gap in the calendar rather than in the culture.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setWhen("All");
                  setWhere("Everywhere");
                }}
                className="min-h-11 rounded-full bg-primary px-5 font-medium text-primary-foreground"
              >
                Show all events
              </button>
              <Link
                to="/around-the-world"
                className="inline-flex min-h-11 items-center rounded-full border border-border px-5 font-medium text-ink hover:border-primary hover:text-primary"
              >
                See the global map
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
