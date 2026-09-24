import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { getStoryById } from "@/data/content";
import { collectionBySlug } from "@/lib/collections";
import { publicFormat } from "@/lib/editorial";
import type { Story } from "@/types/content";

export const Route = createFileRoute("/understand-indonesia/collections/$slug")({
  loader: ({ params }) => { const collection = collectionBySlug(params.slug); if (!collection) throw notFound(); return collection; },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Collection not found — Indonesia Vibes" }, { name: "robots", content: "noindex" }] };
    return { meta: [
      { title: `${loaderData.title} — Indonesia Vibes` }, { name: "description", content: loaderData.introduction },
      { property: "og:title", content: `${loaderData.title} — Indonesia Vibes` }, { property: "og:description", content: loaderData.introduction },
      { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: `/understand-indonesia/collections/${params.slug}` },
    ], links: [{ rel: "canonical", href: `/understand-indonesia/collections/${params.slug}` }] };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const collection = Route.useLoaderData();
  const stories = collection.storyIds.map(getStoryById).filter(Boolean) as Story[];
  return (
    <>
      <header className="bg-ink text-primary-foreground">
        <div className="container-editorial grid gap-8 py-10 lg:grid-cols-[minmax(20rem,0.8fr)_minmax(0,1.4fr)] lg:items-end lg:py-16">
          <div className="pb-2">
            <p className="eyebrow text-pink">Curated collection</p>
            <h1 className="mt-5 text-[clamp(2.8rem,6vw,5.75rem)] leading-[0.98] font-medium">{collection.title}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">{collection.introduction}</p>
            <p className="mt-7 text-xs text-primary-foreground/60">{stories.length} stories · Read in sequence</p>
          </div>
          <img src={collection.image} alt="" className="aspect-[16/10] w-full object-cover" />
        </div>
      </header>
      <div className="container-editorial py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(15rem,0.55fr)_minmax(0,1.45fr)] lg:gap-16">
          <aside>
            <p className="eyebrow text-primary">About this journey</p>
            <p className="mt-5 text-lg leading-relaxed text-ink">{collection.longIntroduction}</p>
            {collection.primaryTopic ? <p className="mt-5 text-xs text-muted-foreground">Primary topic · {collection.primaryTopic}</p> : null}
          </aside>
          <section>
            <h2 className="sr-only">Stories in this collection</h2>
            <ol className="border-t border-border">
              {stories.map((story, index) => (
                <li key={story.id} className="border-b border-border">
                  <Link to="/stories/$slug" params={{ slug: story.slug }} className="group grid gap-4 py-7 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:items-start md:py-9">
                    <span className="text-xl font-medium text-primary tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="eyebrow text-muted-foreground">{publicFormat(story)}</span>
                      <span className="mt-2 block text-2xl leading-tight font-medium text-ink group-hover:text-primary md:text-3xl">{story.title}</span>
                      <span className="mt-3 block max-w-2xl text-sm leading-relaxed text-muted-foreground">{story.dek}</span>
                    </span>
                    <ArrowRight aria-hidden className="mt-1 hidden h-5 w-5 text-primary transition-transform group-hover:translate-x-1 sm:block" />
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </>
  );
}