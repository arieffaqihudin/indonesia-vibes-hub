import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";

import { WorldMap } from "@/components/map/WorldMap";
import { formatEventDates, getEventById, worldNodes } from "@/data/content";
import { cn } from "@/lib/utils";
import { pageIdentity } from "@/lib/public-seo";

export const Route = createFileRoute("/around-the-world")({
  head: () => ({
    meta: [
      { title: "Indonesia Around the World — Indonesia Vibes" },
      { name: "description", content: "A live map of Indonesian cultural programmes abroad, arcing out from Jakarta to six continents." },
      { property: "og:title", content: "Indonesia Around the World — Indonesia Vibes" },
      { property: "og:description", content: "A live map of Indonesian cultural programmes abroad, arcing out from Jakarta to six continents." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      ...pageIdentity("/around-the-world").meta,
    ],
    links: pageIdentity("/around-the-world").links,
  }),
  component: AroundTheWorldPage,
});

const FILTERS = ["All", "Active", "Upcoming", "Archive"] as const;
type Filter = (typeof FILTERS)[number];

function AroundTheWorldPage() {
  const [selected, setSelected] = useState<string | null>(worldNodes[0]?.id ?? null);
  const [filter, setFilter] = useState<Filter>("All");
  // On small screens the map and the full city list take turns.
  const [view, setView] = useState<"map" | "list">("map");
  const listRef = useRef<HTMLUListElement | null>(null);
  const node = worldNodes.find((n) => n.id === selected) ?? null;
  const visible = filter === "All" ? worldNodes : worldNodes.filter((n) => n.status === filter);
  const mapNodes = visible.some((n) => n.id === selected) || !node ? visible : [...visible, node];

  const select = (id: string, fromMap = false) => {
    setSelected(id);
    if (fromMap) {
      const row = listRef.current?.querySelector<HTMLElement>(`[data-node="${id}"]`);
      row?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  };

  return (
    <section className="grid border-b border-border lg:h-[calc(100dvh-4.5rem)] lg:min-h-[36rem] lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] xl:grid-cols-[minmax(0,61fr)_minmax(0,39fr)]">
      <div
        className={cn(
          "order-2 px-4 pb-8 sm:px-6 lg:order-none lg:col-start-1 lg:row-start-1 lg:block lg:h-full lg:p-0",
          view === "map" ? "block" : "hidden",
        )}
      >
        <div className="aspect-[940/420] border border-border lg:aspect-auto lg:h-full lg:border-0">
          <WorldMap nodes={mapNodes} selectedId={selected} onSelect={(id) => select(id, true)} focus fill />
        </div>
      </div>

      <aside className="order-1 min-w-0 lg:order-none lg:col-start-2 lg:row-start-1 lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:border-l lg:border-border">
        <div className="px-4 pt-8 pb-5 sm:px-6 lg:px-8 lg:pt-8">
          <p className="eyebrow text-primary">Experience</p>
          <h1 className="mt-2 text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.1] font-medium text-ink">Indonesia around the world</h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            See how Indonesian culture travels, connects and takes part in global conversations. Select a city on the map or in the list.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-full border border-border p-0.5 lg:hidden" role="group" aria-label="Choose a view">
              {(["map", "list"] as const).map((v) => (
                <button key={v} type="button" onClick={() => setView(v)} aria-pressed={view === v}
                  className={cn("min-h-10 rounded-full px-5 text-sm font-medium capitalize transition-colors", view === v ? "bg-primary text-primary-foreground" : "text-ink")}>
                  {v}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1" role="group" aria-label="Filter by status">
              {FILTERS.map((f) => (
                <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f}
                  className={cn("min-h-9 rounded-[10px] px-3 text-xs font-medium transition-colors",
                    filter === f ? "bg-blush text-primary" : "text-muted-foreground hover:text-ink")}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {node ? (
          <div key={node.id} className="list-swap mx-4 mb-6 border-y border-border bg-sand px-5 py-5 sm:mx-6 lg:mx-8">
            <p className="eyebrow text-primary">{node.status} · {node.continent}</p>
            <h2 className="mt-1.5 text-2xl font-medium text-ink">{node.city}</h2>
            <p className="text-sm text-muted-foreground">{node.country}</p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ink">{node.programme}</p>
            {node.eventIds.length ? (
              <ul className="mt-4 space-y-3">
                {node.eventIds.map(getEventById).filter(Boolean).map((e) => (
                  <li key={e!.id}>
                    <Link to="/events/$slug" params={{ slug: e!.slug }} className="link-underline text-sm font-medium text-ink">{e!.title}</Link>
                    <span className="block text-xs text-muted-foreground">{[e!.type, formatEventDates(e!)].filter(Boolean).join(" · ")}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        <ul ref={listRef} className={cn("mx-4 mb-8 divide-y divide-border border-y border-border sm:mx-6 lg:mx-8 lg:block", view === "list" ? "block" : "hidden")}>
          {visible.map((n) => (
            <li key={n.id} data-node={n.id}>
              <button type="button" onClick={() => select(n.id)} aria-pressed={selected === n.id}
                className={cn("press relative grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3 pr-2 pl-3 text-left transition-colors",
                  selected === n.id ? "bg-blush/60" : "hover:bg-sand")}>
                {selected === n.id ? <span aria-hidden="true" className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-primary" /> : null}
                <span className="min-w-0">
                  <span className={cn("block truncate text-sm font-medium", selected === n.id ? "text-primary" : "text-ink")}>{n.city}</span>
                  <span className="block truncate text-xs text-muted-foreground">{n.programme}</span>
                </span>
                <span className="shrink-0 text-[0.68rem] tracking-[0.12em] text-muted-foreground uppercase">{n.status}</span>
              </button>
            </li>
          ))}
          {!visible.length ? <li className="py-6 text-sm text-muted-foreground">No programmes with this status.</li> : null}
        </ul>
      </aside>
    </section>
  );
}
