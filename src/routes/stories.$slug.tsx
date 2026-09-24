import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { StoryCard } from "@/components/editorial/StoryCard";
import { ReadingProgress } from "@/components/motion/ReadingProgress";
import type { CulturalForm, Person, Place, Story } from "@/types/content";
import {
  formatDate,
  getForm,
  getPerson,
  getPlace,
  getStory,
  getStoryById,
  relatedStories,
} from "@/data/content";
import { publicFormat } from "@/lib/editorial";
import { attribution } from "@/lib/attribution";
import { useCollections } from "@/lib/collections";

export const Route = createFileRoute("/stories/$slug")({
  validateSearch: (search: Record<string, unknown>) => ({ collection: typeof search.collection === "string" ? search.collection : undefined }),
  loader: ({ params }): { story: Story } => {
    const story = getStory(params.slug);
    if (!story) throw notFound();
    return { story };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Story not found — Indonesia Vibes" }, { name: "robots", content: "noindex" }] };
    }
    const { story } = loaderData;
    return {
      meta: [
        { title: `${story.title} — Indonesia Vibes` },
        { name: "description", content: story.dek },
        { property: "og:title", content: story.title },
        { property: "og:description", content: story.dek },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/stories/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/stories/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: story.title,
            description: story.dek,
            datePublished: story.publishedAt,
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-editorial py-28 text-center">
      <h1 className="display-2 text-ink">Story not found</h1>
      <Link to="/stories" className="mt-6 inline-block text-primary underline underline-offset-4">
        Back to all stories
      </Link>
    </div>
  ),
  component: StoryPage,
});

function StoryPage() {
  const { story } = Route.useLoaderData();
  const { collection: collectionSlug } = Route.useSearch();
  const [collections] = useCollections();
  const collection = collectionSlug ? collections.find((item) => item.slug === collectionSlug && item.storyIds.includes(story.id)) : undefined;
  const collectionIndex = collection?.storyIds.indexOf(story.id) ?? -1;
  const previousStory = collectionIndex > 0 ? getStoryById(collection?.storyIds[collectionIndex - 1] ?? "") : undefined;
  const nextStory = collection && collectionIndex >= 0 ? getStoryById(collection.storyIds[collectionIndex + 1] ?? "") : undefined;
  const related = relatedStories(story);
  const forms = story.formIds.map(getForm).filter(Boolean) as CulturalForm[];
  const people = story.peopleIds.map(getPerson).filter(Boolean) as Person[];
  const placesIn = story.placeIds.map(getPlace).filter(Boolean) as Place[];
  const credit = attribution({
    ...(story.contentSource ? { contentSource: story.contentSource } : {}),
    ...(story.curationModel ? { curationModel: story.curationModel } : {}),
    ...(story.author ? { author: story.author } : {}),
    ...(story.authorRole ? { authorRole: story.authorRole } : {}),
    ...(story.sourceAttribution ? { sourceOrganisation: story.sourceAttribution } : {}),
    ...(story.coContributors ? { coContributors: story.coContributors } : {}),
  });

  return (
    <article>
      <ReadingProgress />
      {collection ? <nav aria-label="Collection reading journey" className="border-b border-border bg-blush"><div className="container-editorial flex flex-wrap items-center gap-x-5 gap-y-2 py-3 text-xs"><Link to="/understand-indonesia/collections/$slug" params={{ slug: collection.slug }} className="font-semibold text-ink hover:text-primary">{collection.title}</Link><span className="text-muted-foreground">Story {collectionIndex + 1} of {collection.storyIds.length}</span><span className="ml-auto flex items-center gap-4">{previousStory ? <Link to="/stories/$slug" params={{ slug: previousStory.slug }} search={{ collection: collection.slug }} className="inline-flex items-center gap-1 text-ink hover:text-primary"><ArrowLeft className="h-3.5 w-3.5" /> Previous</Link> : null}<Link to="/understand-indonesia/collections/$slug" params={{ slug: collection.slug }} className="text-ink hover:text-primary">Back to Collection</Link>{nextStory ? <Link to="/stories/$slug" params={{ slug: nextStory.slug }} search={{ collection: collection.slug }} className="inline-flex items-center gap-1 text-ink hover:text-primary">Next <ArrowRight className="h-3.5 w-3.5" /></Link> : null}</span></div></nav> : null}
      <header className="container-editorial pt-14 pb-10 md:pt-20">
        <p className="eyebrow text-primary">
          {publicFormat(story)} · {story.topics?.[0] ?? "Indonesia"} · {story.readingMinutes} min read
        </p>
        <h1 className="display-1 mt-5 max-w-4xl text-ink">{story.title}</h1>
        <p className="standfirst mt-6 max-w-2xl">{story.dek}</p>
        <div className="mt-7 flex flex-col gap-1 border-t border-border pt-5 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-4">
          <p className="text-ink">
            {credit.primary}
            {credit.role ? <span className="text-muted-foreground">, {credit.role}</span> : null}
            {credit.secondary ? <span className="block text-muted-foreground sm:inline sm:before:content-['·_'] sm:before:mx-1">{credit.secondary}</span> : null}
          </p>
          <p>Published {formatDate(story.publishedAt)}</p>
          {story.updatedAt ? <p>Updated {formatDate(story.updatedAt)}</p> : null}
        </div>
        {story.reviewedBy ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Reviewed for accuracy with {story.reviewedBy}.
          </p>
        ) : null}
      </header>

      <figure className="container-editorial">
        <img
          src={story.image}
          alt={story.imageAlt}
          width={1600}
          height={1104}
          className="aspect-[16/9] w-full object-cover"
        />
        <figcaption className="mt-3 text-xs text-muted-foreground">{story.imageAlt}</figcaption>
      </figure>

      <div className="container-editorial grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] lg:gap-20">
        <div className="max-w-2xl">
          <div className="prose-editorial text-ink">
            {story.body.map((p: string, i: number) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {story.sources?.length ? (
            <section className="mt-12 border-t border-border pt-8">
              <h2 className="eyebrow text-muted-foreground">References</h2>
              <ul className="mt-4 space-y-3">
                {story.sources.map((r, i: number) => (
                  <li key={i} className="text-sm leading-relaxed text-ink">
                    <span className="font-medium">{r.title}</span>
                    {r.author ? <span className="text-muted-foreground"> — {r.author}</span> : null}
                    {r.year ? <span className="text-muted-foreground">, {r.year}</span> : null}
                    {r.publisher ? <span className="text-muted-foreground"> · {r.publisher}</span> : null}
                    {r.note ? <span className="block text-muted-foreground">{r.note}</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <div className="space-y-10 border-t border-border pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          {forms.length ? (
            <div>
            <p className="eyebrow text-muted-foreground">Related topics</p>
              <ul className="mt-3 space-y-2">
                {forms.map((f) => (
                  <li key={f.id}>
                    <Link
                      to={f.pillar === "heritage" ? "/heritage" : f.pillar === "contemporary" ? "/contemporary" : "/research"}
                      className="text-sm text-ink hover:text-primary"
                    >
                      {f.name} <span className="text-muted-foreground">· {f.discipline}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {people.length ? (
            <div>
              <p className="eyebrow text-muted-foreground">People</p>
              <ul className="mt-3 space-y-4">
                {people.map((p) => (
                  <li key={p.id} className="flex min-w-0 items-center gap-3">
                    <img
                      src={p.image}
                      alt=""
                      width={96}
                      height={96}
                      loading="lazy"
                      className="h-11 w-11 shrink-0 rounded-full object-cover"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink">{p.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {p.role}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {placesIn.length ? (
            <div>
              <p className="eyebrow text-muted-foreground">Places</p>
              <ul className="mt-3 space-y-2">
                {placesIn.map((pl) => (
                  <li key={pl.id} className="text-sm text-ink">
                    {pl.name} <span className="text-muted-foreground">· {pl.country}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/events-places"
                className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-4"
              >
                All places
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      {related.length ? (
        <section className="border-t border-border bg-sand">
          <div className="container-editorial py-16">
            <h2 className="display-3 text-ink">Keep reading</h2>
            <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <StoryCard key={s.id} story={s} size="sm" />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}