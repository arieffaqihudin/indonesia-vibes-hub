import { createFileRoute } from "@tanstack/react-router";

import { CollectionJourneyPreview } from "@/components/editorial/CollectionJourneyPreview";
import { useCollections } from "@/lib/collections";
import { pageIdentity } from "@/lib/public-seo";

export const Route = createFileRoute("/understand-indonesia/collections/")({
  head: () => ({ meta: [
    { title: "Curated Collections — Indonesia Vibes" }, { name: "description", content: "Follow curated reading journeys through stories, ideas and perspectives selected to be experienced together." },
    { property: "og:title", content: "Curated Collections — Indonesia Vibes" }, { property: "og:description", content: "Follow curated reading journeys through Indonesian culture." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ...pageIdentity("/understand-indonesia/collections").meta,
  ], links: pageIdentity("/understand-indonesia/collections").links }),
  component: Collections,
});

function Collections() {
  const [allCollections] = useCollections();
  const published = allCollections.filter((item) => item.status === "Published");
  const featured = published.find((item) => item.featured) ?? published[0];
  const remaining = published.filter((item) => item.id !== featured?.id);

  return (
    <>
      <header className="border-b border-border bg-sand">
        <div className="container-editorial py-14 md:py-20">
          <p className="eyebrow text-primary">Understand Indonesia / Editorial journeys</p>
           <h1 className="display-1 mt-5 text-ink">Curated Collections</h1>
           <p className="standfirst mt-6 max-w-2xl">Follow a curated journey through stories, ideas and perspectives selected to be experienced together.</p>
        </div>
      </header>

      {featured ? (
        <section className="bg-ink py-10 md:py-14"><div className="container-editorial"><CollectionJourneyPreview collection={featured} featured /></div></section>
      ) : null}

      <section className="container-editorial py-16 md:py-24">
        <div className="mb-12 max-w-2xl border-b border-border pb-7">
           <p className="eyebrow text-primary">Follow the story</p>
           <h2 className="mt-3 text-3xl font-medium text-ink md:text-4xl">Other Curated Collections</h2>
        </div>
        <div className="space-y-20 md:space-y-28">
          {remaining.map((item, index) => (
             <CollectionJourneyPreview key={item.id} collection={item} {...(index % 2 === 1 ? { className: "md:[&>div>*:first-child]:order-2" } : {})} />
          ))}
        </div>
      </section>
    </>
  );
}