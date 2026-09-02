import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader } from "@/components/editorial/Section";
import { WorldMap } from "@/components/map/WorldMap";
import { formatRange, getEventById, worldNodes } from "@/data/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/around-the-world")({
  head: () => ({
    meta: [
      { title: "Indonesia Around the World — Indonesia Vibes" },
      { name: "description", content: "A live map of Indonesian cultural programmes abroad, arcing out from Jakarta to six continents." },
      { property: "og:title", content: "Indonesia Around the World — Indonesia Vibes" },
      { property: "og:description", content: "A live map of Indonesian cultural programmes abroad, arcing out from Jakarta to six continents." },
      { property: "og:url", content: "/around-the-world" },
    ],
    links: [{ rel: "canonical", href: "/around-the-world" }],
  }),
  component: AroundTheWorldPage,
});

function AroundTheWorldPage() {
  const [selected, setSelected] = useState<string | null>(worldNodes[0]?.id ?? null);
  const node = worldNodes.find((n) => n.id === selected) ?? null;

  return (
    <>
      <PageHeader
        eyebrow="Experience"
        title="Indonesia around the world"
        intro="Every programme we run outside Indonesia, on one map. Select a city to see what is there and when."
      />
      <div className="container-editorial grid gap-10 py-16 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start">
        <WorldMap selectedId={selected} onSelect={setSelected} focus />

        <div>
          {node ? (
            <div key={node.id} className="list-swap border border-border bg-sand p-6">
              <p className="eyebrow text-primary">{node.status} · {node.continent}</p>
              <h2 className="display-3 mt-2 text-ink">{node.city}</h2>
              <p className="text-sm text-muted-foreground">{node.country}</p>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-ink">{node.programme}</p>
              <ul className="mt-5 space-y-3">
                {node.eventIds.map(getEventById).filter(Boolean).map((e) => (
                  <li key={e!.id}>
                    <Link to="/events/$slug" params={{ slug: e!.slug }} className="link-underline text-sm font-medium text-ink">
                      {e!.title}
                    </Link>
                    <span className="block text-xs text-muted-foreground">
                      {formatRange(e!.startDate, e!.endDate)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <ul className="mt-8 divide-y divide-border border-y border-border">
            {worldNodes.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => setSelected(n.id)}
                  aria-pressed={selected === n.id}
                  className={cn(
                    "press grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3.5 text-left",
                    selected === n.id ? "text-primary" : "text-ink hover:text-primary",
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{n.city}</span>
                    <span className="block truncate text-xs text-muted-foreground">{n.programme}</span>
                  </span>
                  <span className="shrink-0 text-[0.7rem] tracking-[0.12em] text-muted-foreground uppercase">
                    {n.status}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
