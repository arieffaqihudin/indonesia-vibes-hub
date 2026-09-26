import { createFileRoute, Link, notFound, useLocation } from "@tanstack/react-router";
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
import { topicById } from "@/lib/topics";
import { pageIdentity, publicUrl, breadcrumbSchema } from "@/lib/public-seo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

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
    const path = `/stories/${params.slug}`;
    return {
      meta: [
        { title: `${story.title} | Indonesia Vibes` },
        { name: "description", content: story.dek },
        { property: "og:title", content: story.title },
        { property: "og:description", content: story.dek },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(story.image?.startsWith("https://") ? [{ property: "og:image", content: story.image }, { name: "twitter:image", content: story.image }] : []),
        ...pageIdentity(path).meta,
      ],
      links: pageIdentity(path).links,
      scripts: [
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Understand Indonesia", path: "/understand-indonesia" }, { name: story.title, path }]),
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: story.title,
            description: story.dek,
            datePublished: story.publishedAt,
            ...(story.updatedAt ? { dateModified: story.updatedAt } : {}),
            ...(story.author ? { author: { "@type": "Person", name: story.author } } : {}),
            publisher: { "@type": "Organization", name: "Indonesia Vibes", url: publicUrl("/") },
            mainEntityOfPage: publicUrl(path),
            ...(story.image?.startsWith("https://") ? { image: story.image } : {}),
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
  const location = useLocation();
  const collectionSlug = new URLSearchParams(location.searchStr).get("collection") ?? undefined;
  const [collections] = useCollections();
  const collection = collectionSlug ? collections.find((item) => item.slug === collectionSlug && item.storyIds.includes(story.id)) : undefined;
  const collectionIndex = collection?.storyIds.indexOf(story.id) ?? -1;
  const previousStory = collectionIndex > 0 ? getStoryById(collection?.storyIds[collectionIndex - 1] ?? "") : undefined;
  const nextStory = collection && collectionIndex >= 0 ? getStoryById(collection.storyIds[collectionIndex + 1] ?? "") : undefined;
  const related = relatedStories(story);
  const forms = story.formIds.map(getForm).filter(Boolean) as CulturalForm[];
  const people = story.peopleIds.map(getPerson).filter(Boolean) as Person[];
  const authorProfile = story.author ? people.find((person) => person.name.toLocaleLowerCase() === story.author?.toLocaleLowerCase()) : undefined;
  const relatedPeople = people.filter((person) => person.id !== authorProfile?.id);
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
        <Breadcrumbs className="mb-6" items={[{ label: "Understand Indonesia", to: "/understand-indonesia" }, { label: story.title }]} />
        <p className="eyebrow text-primary">{story.topics?.[0] ?? "Indonesia"} · {publicFormat(story)}</p>
        <h1 className="display-1 mt-5 max-w-4xl text-ink">{story.title}</h1>
        <p className="standfirst mt-6 max-w-2xl">{story.dek}</p>
        <div className="mt-8 max-w-2xl border-y border-border bg-sand/35 px-4 py-5 sm:px-5">
          <p className="eyebrow text-primary">Article author</p>
          <p className="mt-2 text-lg font-semibold text-ink">
            {authorProfile ? <Link to="/people/$slug" params={{ slug: authorProfile.slug }} className="link-underline">{credit.primary} <ArrowRight className="ml-1 inline h-4 w-4" /></Link> : credit.primary}
            {credit.role ? <span className="ml-2 text-base font-normal text-muted-foreground">{credit.role}</span> : null}
          </p>
          {credit.secondary ? <p className="mt-1 text-sm text-muted-foreground">{credit.secondary}</p> : null}
          <p className="mt-3 text-sm text-muted-foreground">{formatDate(story.publishedAt)} · {story.readingMinutes} min read{story.updatedAt ? ` · Updated ${formatDate(story.updatedAt)}` : ""}</p>
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
          fetchPriority="high"
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

        {(story.topics?.length || forms.length || relatedPeople.length || placesIn.length) ? <aside aria-labelledby="related-heading" className="border-t border-border pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          <h2 id="related-heading" className="eyebrow text-ink">Related to this Article</h2>
          {story.topics?.length ? (
            <section className="mt-7">
              <h3 className="eyebrow text-muted-foreground">Topics</h3>
              <ul className="mt-3 space-y-2">
                {story.topics.map((topic) => {
                  const definition = topicById(topic);
                  return <li key={topic}>{definition ? <Link to="/understand-indonesia/topics/$slug" params={{ slug: definition.slug }} className="text-sm font-medium text-ink hover:text-primary">{topic}</Link> : <span className="text-sm font-medium text-ink">{topic}</span>}</li>;
                })}
              </ul>
            </section>
          ) : null}

          {forms.length ? (
            <section className="mt-8 border-t border-border pt-7">
              <h3 className="eyebrow text-muted-foreground">Heritage</h3>
              <ul className="mt-3 space-y-2">
                {forms.map((f) => (
                  <li key={f.id}>
                    {f.pillar === "heritage" ? (
                      <Link to="/understand-indonesia/heritage/$slug" params={{ slug: f.slug }} className="text-sm font-medium text-ink hover:text-primary">{f.name} <span className="font-normal text-muted-foreground">· {f.discipline}</span></Link>
                    ) : (
                      <Link to="/culture/$slug" params={{ slug: f.slug }} className="text-sm font-medium text-ink hover:text-primary">{f.name} <span className="font-normal text-muted-foreground">· {f.discipline}</span></Link>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {relatedPeople.length ? (
            <section className="mt-8 border-t border-border pt-7">
              <h3 className="eyebrow text-muted-foreground">Related People</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">People connected to the subjects discussed in this article.</p>
              <ul className="mt-5 space-y-5">
                {relatedPeople.map((p) => {
                  const relationshipTopic = story.topics?.find((topic) => p.themes.includes(topic));
                  const relationshipForm = forms.find((form) => p.formIds.includes(form.id));
                  const context = relationshipForm?.name ?? relationshipTopic;
                  return <li key={p.id} className="flex min-w-0 items-start gap-3">
                    <img
                      src={p.image}
                      alt=""
                      width={96}
                      height={96}
                      loading="lazy"
                      className="h-12 w-12 shrink-0 rounded-sm object-cover"
                    />
                    <span className="min-w-0">
                      <Link to="/people/$slug" params={{ slug: p.slug }} className="block text-sm font-semibold text-ink hover:text-primary">{p.name}</Link>
                      <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{p.role}</span>
                      {context ? <span className="mt-1 block text-[0.7rem] text-primary">Related to {context} <ArrowRight className="ml-0.5 inline h-3 w-3" /></span> : null}
                    </span>
                  </li>;
                })}
              </ul>
            </section>
          ) : null}

          {placesIn.length ? (
            <section className="mt-8 border-t border-border pt-7">
              <h3 className="eyebrow text-muted-foreground">Related Places</h3>
              <ul className="mt-3 space-y-2">
                {placesIn.map((pl) => (
                  <li key={pl.id}>
                    <Link to="/places/$slug" params={{ slug: pl.slug }} className="text-sm font-medium text-ink hover:text-primary">{pl.name} <span className="font-normal text-muted-foreground">· {pl.country}</span></Link>
                  </li>
                ))}
              </ul>
              <Link
                to="/events-places"
                className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-4"
              >
                View related places <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
              </Link>
            </section>
          ) : null}
        </aside> : null}
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