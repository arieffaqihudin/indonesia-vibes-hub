import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { StoryCard } from "@/components/editorial/StoryCard";
import { ReadingProgress } from "@/components/motion/ReadingProgress";
import type { CulturalForm, Person, Place, Story } from "@/types/content";
import {
  formatDate,
  getForm,
  getPerson,
  getPlace,
  getStory,
  relatedStories,
} from "@/data/content";
import { publicFormat } from "@/lib/editorial";
import { attribution } from "@/lib/attribution";

export const Route = createFileRoute("/stories/$slug")({
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