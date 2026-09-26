import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowDown, ArrowRight } from "lucide-react";

import { getStoryById } from "@/data/content";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { collectionBySlug, collectionReadingMinutes, collectionStoryLabel } from "@/lib/collections";
import { publicFormat } from "@/lib/editorial";
import type { Story } from "@/types/content";
import { pageIdentity, breadcrumbSchema } from "@/lib/public-seo";
import { socialImageMeta } from "@/lib/social-image";

export const Route = createFileRoute("/understand-indonesia/collections/$slug")({
  loader: ({ params }) => { const collection = collectionBySlug(params.slug); if (!collection) throw notFound(); return collection; },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Collection not found — Indonesia Vibes" }, { name: "robots", content: "noindex" }] };
    const path = `/understand-indonesia/collections/${params.slug}`;
    const meaningful = loaderData.status === "Published" && loaderData.storyIds.filter((id) => Boolean(getStoryById(id))).length >= 2 && Boolean(loaderData.longIntroduction?.trim());
    return { meta: [
      { title: `${loaderData.title} | Indonesia Vibes` }, { name: "description", content: loaderData.introduction },
      { property: "og:title", content: `${loaderData.title} — Indonesia Vibes` }, { property: "og:description", content: loaderData.introduction },
      { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" },
      ...socialImageMeta(loaderData.image),
      ...pageIdentity(path).meta, ...(!meaningful ? [{ name: "robots", content: "noindex, follow" }] : []),
    ], links: pageIdentity(path).links, scripts: [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Understand Indonesia", path: "/understand-indonesia" }, { name: "Collections", path: "/understand-indonesia/collections" }, { name: loaderData.title, path }])] };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const collection = Route.useLoaderData();
  const stories = collection.storyIds.map(getStoryById).filter(Boolean) as Story[];
  const minutes = collectionReadingMinutes(collection);
  return (
    <>
      <header className="bg-ink text-primary-foreground">
        <div className="container-editorial grid gap-8 py-10 lg:grid-cols-[minmax(20rem,0.8fr)_minmax(0,1.4fr)] lg:items-end lg:py-16">
          <div className="pb-2">
            <Breadcrumbs tone="light" className="mb-5" items={[{ label: "Understand Indonesia", to: "/understand-indonesia" }, { label: "Collections", to: "/understand-indonesia/collections" }, { label: collection.title }]} />
            <p className="eyebrow text-pink">Curated collection</p>
            <h1 className="mt-5 text-[clamp(2.8rem,6vw,5.75rem)] leading-[0.98] font-medium">{collection.title}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">{collection.introduction}</p>
             <p className="mt-7 text-xs text-primary-foreground/60">{collectionStoryLabel(collection)}{minutes ? ` · ${minutes} min reading` : ""} · Read in sequence</p>
             {stories[0] ? <Link to="/stories/$slug" params={{ slug: stories[0].slug }} search={{ collection: collection.slug }} className="mt-7 inline-flex min-h-11 items-center gap-2 border-b border-primary-foreground pb-1 text-sm font-semibold">Start Reading <ArrowDown className="h-4 w-4" /></Link> : null}
          </div>
          <img src={collection.image} alt="" width={960} height={600} className="aspect-[16/10] w-full object-cover" />
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
             <p className="eyebrow mb-5 text-primary">The Journey</p>
             <h2 className="sr-only">Stories in this collection</h2>
             <ol className="relative before:absolute before:top-8 before:bottom-8 before:left-[1.05rem] before:w-px before:bg-border sm:before:left-[1.7rem]">
              {stories.map((story, index) => (
                 <li key={story.id} className="relative border-t border-border bg-background last:border-b">
                   <Link to="/stories/$slug" params={{ slug: story.slug }} search={{ collection: collection.slug }} className="group grid gap-4 py-7 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:items-start md:py-9">
                     <span className="relative z-10 flex h-[2.15rem] w-[2.15rem] items-center justify-center rounded-full border border-primary bg-background text-sm font-medium text-primary tabular-nums sm:h-[3.4rem] sm:w-[3.4rem] sm:text-xl">{String(index + 1).padStart(2, "0")}</span>
                    <span>
                       {index === 0 ? <span className="eyebrow mb-2 block text-primary">Start here</span> : null}
                       <span className="eyebrow text-muted-foreground">{publicFormat(story)} · {story.topics?.[0] ?? "Indonesia"} · {story.readingMinutes} min</span>
                      <span className="mt-2 block text-2xl leading-tight font-medium text-ink group-hover:text-primary md:text-3xl">{story.title}</span>
                       <span className="mt-3 block max-w-2xl text-sm leading-relaxed text-muted-foreground">{story.dek}</span><span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink group-hover:text-primary">Read Article <ArrowRight className="h-4 w-4" /></span>
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