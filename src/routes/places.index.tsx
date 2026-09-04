import { createFileRoute, Link } from "@tanstack/react-router";
import { List, Map as MapIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/editorial/Filters";
import { FilterBar } from "@/components/editorial/FilterBar";
import type { FilterDef } from "@/components/editorial/FilterBar";
import { PlaceCard } from "@/components/editorial/EntityCards";
import { PageHeader } from "@/components/editorial/Section";
import { IndonesiaMap } from "@/components/map/IndonesiaMap";
import { indonesianPlaces, placeProvinces, placeRegions, placeTypes } from "@/data/graph";
import { THEMES } from "@/types/content";
import type { ThemeId } from "@/types/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/places/")({
  head: () => ({
    meta: [
      { title: "Places — Indonesia Vibes" },
      {
        name: "description",
        content:
          "Explore Indonesian cultural places on a map and in a list: museums, heritage sites, cultural villages, galleries, archives and landscapes, with visiting guidance.",
      },
      { property: "og:title", content: "Places — Indonesia Vibes" },
      {
        property: "og:description",
        content: "A map and directory of cultural places across the Indonesian archipelago.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/places" }],
  }),
  component: PlacesPage,
});

function PlacesPage() {
  const [view, setView] = useState<"map" | "list">("map");
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [province, setProvince] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeId | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return indonesianPlaces.filter((p) => {
      if (type && p.type !== type) return false;
      if (region && p.region !== region) return false;
      if (province && p.province !== province) return false;
      if (theme && !(p.themes ?? []).includes(theme)) return false;
      if (!q) return true;
      return [p.name, p.region, p.province ?? "", p.city ?? "", p.summary]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [query, type, region, province, theme]);

  const selected = results.find((p) => p.id === selectedId) ?? null;
  const primaryFilters: FilterDef[] = [
    { id: "type", label: "Type of place", options: placeTypes, value: type, onChange: setType, allLabel: "All types" },
    { id: "region", label: "Region", options: placeRegions, value: region, onChange: setRegion, allLabel: "All regions" },
  ];

  const secondaryFilters: FilterDef[] = [
    { id: "province", label: "Province", options: placeProvinces, value: province, onChange: setProvince },
    { id: "theme", label: "Theme", options: THEMES, value: theme, onChange: (v) => setTheme(v as ThemeId | null) },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Experience"
        title="Places"
        intro="Where Indonesian culture is made, kept and performed. Every place carries its significance, what to see, and honest guidance on visiting."
      />

      <FilterBar
        search={{ value: query, onChange: setQuery, placeholder: "Place, city or province" }}
        primary={primaryFilters}
        secondary={secondaryFilters}
        resultCount={results.length}
        resultNoun={results.length === 1 ? "place" : "places"}
      />

      <div className="container-editorial py-12">
        <div className="flex items-center justify-between gap-4">
          <h2 className="display-3 text-ink">Explore</h2>
          <div role="group" aria-label="Choose a view" className="flex rounded-full border border-border p-1">
            {(["map", "list"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={view === mode}
                onClick={() => setView(mode)}
                className={cn(
                  "inline-flex min-h-9 items-center gap-1.5 rounded-full px-4 text-sm capitalize transition-colors",
                  view === mode ? "bg-primary text-primary-foreground" : "text-ink hover:text-primary",
                )}
              >
                {mode === "map" ? (
                  <MapIcon className="h-4 w-4" aria-hidden />
                ) : (
                  <List className="h-4 w-4" aria-hidden />
                )}
                {mode}
              </button>
            ))}
          </div>
        </div>

        {results.length === 0 ? (
          <div className="mt-10">
            <EmptyState title="No places match those filters">
              <p>Try a wider region, or clear the filters to see the full archipelago.</p>
            </EmptyState>
          </div>
        ) : view === "map" ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
            <IndonesiaMap places={results} selectedId={selectedId} onSelect={setSelectedId} />
            <div className="border border-border p-6">
              {selected ? (
                <>
                  <p className="eyebrow text-primary">{selected.type ?? "Place"}</p>
                  <h3 className="mt-2.5 text-xl font-medium text-ink">{selected.name}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {selected.province ? `${selected.province} · ` : ""}
                    {selected.region}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {selected.summary}
                  </p>
                  <Link
                    to="/places/$slug"
                    params={{ slug: selected.slug }}
                    className="mt-6 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-deep-red"
                  >
                    Open place
                  </Link>
                </>
              ) : (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Select a marker to preview a place. Markers that sit close together are grouped —
                  select again to step through them. Prefer text? Switch to the list view.
                </p>
              )}
              <ul className="mt-8 max-h-80 space-y-1 overflow-y-auto border-t border-border pt-5">
                {results.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(p.id)}
                      aria-current={selectedId === p.id}
                      className={cn(
                        "w-full min-h-9 px-2 py-1.5 text-left text-sm",
                        selectedId === p.id ? "bg-blush text-clay" : "text-ink hover:text-primary",
                      )}
                    >
                      {p.name}
                      <span className="block text-xs text-muted-foreground">{p.region}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <li key={p.id}>
                <PlaceCard place={p} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
