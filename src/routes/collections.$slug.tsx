import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { StoryCard } from "@/components/editorial/StoryCard";
import { getCollection, getForm, getStoryById } from "@/data/content";
import type { Collection } from "@/types/content";

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params }): { collection: Collection } => {
    const collection = getCollection(params.slug);
    if (!collection) throw notFound();
    return { collection };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Collection not found — Indonesia Vibes" }, { name: "robots", content: "noindex" }] };
    }
    const { collection } = loaderData;
    return {
      meta: [
        { title: `${collection.title} — Indonesia Vibes` },
        { name: "description", content: collection.dek },
        { property: "og:title", content: collection.title },
        { property: "og:description", content: collection.dek },
        { property: "og:url", content: `/collections/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/collections/${params.slug}` }],
    };
  },
  notFoundComponent: () => (
    <div className="container-editorial py-28 text-center">
      <h1 className="display-2 text-ink">Collection not found</h1>
      <Link to="/collections" className="mt-6 inline-block text-primary underline underline-offset-4">
        All collections
      </Link>
    </div>
  ),
  component: CollectionPage,
});

function CollectionPage() {
  const { collection } = Route.useLoaderData();
  const stories = collection.storyIds.map(getStoryById).filter(Boolean);
  const forms = collection.formIds.map(getForm).filter(Boolean);

  return (
    <>
      <header className="border-b border-border bg-sand">
        <div className="container-editorial grid gap-10 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <p className="eyebrow text-primary">Collection</p>
            <h1 className="display-1 mt-5 text-ink">{collection.title}</h1>
            <p className="standfirst mt-6 max-w-xl">{collection.dek}</p>
            <p className="mt-6 text-sm text-muted-foreground">
              {forms.map((f) => f!.name).join(" · ")}
            </p>
          </div>
          <img src={collection.image} alt="" width={1600} height={1104} className="aspect-[4/3] w-full object-cover" />
        </div>
      </header>
      <div className="container-editorial grid gap-x-8 gap-y-14 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((s) => (
          <StoryCard key={s!.id} story={s!} />
        ))}
      </div>
    </>
  );
}
