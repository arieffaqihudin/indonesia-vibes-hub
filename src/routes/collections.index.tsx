import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/editorial/Section";
import { collections } from "@/data/content";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "Collections — Indonesia Vibes" },
      { name: "description", content: "Curated sets of Indonesian cultural stories, makers and forms." },
      { property: "og:title", content: "Collections — Indonesia Vibes" },
      { property: "og:description", content: "Curated sets of Indonesian cultural stories, makers and forms." },
      { property: "og:url", content: "/collections" },
    ],
    links: [{ rel: "canonical", href: "/collections" }],
  }),
  component: CollectionsPage,
});

function CollectionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Discover"
        title="Collections"
        intro="Curated sets that read as arguments: what is made slowly, what travels loudly, and who holds the knowledge."
      />
      <div className="container-editorial grid gap-x-8 gap-y-14 py-16 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <Link key={c.id} to="/collections/$slug" params={{ slug: c.slug }} className="group">
            <div className="media-zoom bg-muted">
              <img src={c.image} alt="" width={1600} height={1104} loading="lazy" className="aspect-[5/4] w-full object-cover" />
            </div>
            <h2 className="mt-4 text-xl font-medium tracking-tight text-ink">
              <span className="link-underline">{c.title}</span>
            </h2>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">{c.dek}</p>
            <p className="mt-3 text-xs text-muted-foreground">{c.storyIds.length} stories</p>
          </Link>
        ))}
      </div>
    </>
  );
}
