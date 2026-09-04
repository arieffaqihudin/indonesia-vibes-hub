import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader } from "@/components/editorial/Section";
import { WorldMap } from "@/components/map/WorldMap";
import { formatEventDates, getEventById, worldNodes } from "@/data/content";
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
  // On small screens the map and the full city list take turns.
  const [view, setView] = useState<"map" | "list">("map");
  const node = worldNodes.find((n) => n.id === selected) ?? null;

  return (
    <>
      <PageHeader
        eyebrow="Experience"
        title="Indonesia around the world"
        intro="Every programme we run outside Indonesia, on one map. Select a city to see what is there and when."
      />
      <div className="container-editorial pt-8 lg:hidden">
        <div className="inline-flex rounded-full border border-border p-0.5" role="group" aria-label="Choose a view">
          {(["map", "list"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={cn(
                "min-h-10 rounded-full px-5 text-sm font-medium capitalize transition-colors",
                view === v ? "bg-primary text-primary-foreground" : "text-ink",
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <div className="container-editorial grid gap-10 py-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start lg:py-16">
        <div className={cn(view === "map" ? "block" : "hidden", "lg:block")}>
          <WorldMap selectedId={selected} onSelect={setSelected} focus />
        </div>

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
                      {[e!.type, formatEventDates(e!)].filter(Boolean).join(" · ")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <ul className={cn("mt-8 divide-y divide-border border-y border-border", view === "list" ? "block" : "hidden", "lg:block")}>
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
