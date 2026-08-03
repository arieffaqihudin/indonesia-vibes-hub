import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/editorial/Section";
import { places } from "@/data/content";

export const Route = createFileRoute("/places")({
  head: () => ({
    meta: [
      { title: "Places — Indonesia Vibes" },
      { name: "description", content: "Origins and venues, from East Sumba and Tanjung Bira to London, Tokyo and São Paulo." },
      { property: "og:title", content: "Places — Indonesia Vibes" },
      { property: "og:description", content: "Origins and venues, from East Sumba and Tanjung Bira to London, Tokyo and São Paulo." },
      { property: "og:url", content: "/places" },
    ],
    links: [{ rel: "canonical", href: "/places" }],
  }),
  component: PlacesPage,
});

function PlacesPage() {
  const origins = places.filter((p) => p.kind === "origin");
  const venues = places.filter((p) => p.kind !== "origin");

  return (
    <>
      <PageHeader
        eyebrow="Experience"
        title="Places"
        intro="Where the work comes from, and where it lands. Origins are villages, cities and forests; venues are the rooms that host them."
      />
      <div className="container-editorial py-16">
        {[
          { title: "Origins", list: origins },
          { title: "Venues and partners", list: venues },
        ].map((group) => (
          <section key={group.title} className="mb-16 last:mb-0">
            <h2 className="display-3 border-b border-border pb-5 text-ink">{group.title}</h2>
            <ul className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {group.list.map((p) => (
                <li key={p.id} className="border-l-2 border-primary/30 pl-5">
                  <p className="eyebrow text-primary">{p.region}, {p.country}</p>
                  <h3 className="mt-2 text-lg font-medium text-ink">{p.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
                  <p className="mt-3 text-xs text-muted-foreground tabular-nums">
                    {p.lat.toFixed(2)}, {p.lng.toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
