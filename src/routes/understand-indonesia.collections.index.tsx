import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { useCollections } from "@/lib/collections";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/understand-indonesia/collections/")({
  head: () => ({ meta: [
    { title: "Collections — Indonesia Vibes" }, { name: "description", content: "Curated reading journeys through the stories, ideas and people shaping Indonesia." },
    { property: "og:title", content: "Collections — Indonesia Vibes" }, { property: "og:description", content: "Follow editorially curated journeys through Indonesian culture." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
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
          <h1 className="display-1 mt-5 text-ink">Collections</h1>
          <p className="standfirst mt-6 max-w-2xl">Curated journeys through the stories, ideas and people shaping Indonesia.</p>
        </div>
      </header>

      {featured ? (
        <section className="border-b border-border bg-ink text-primary-foreground">
          <Link to="/understand-indonesia/collections/$slug" params={{ slug: featured.slug }} className="group container-editorial grid gap-0 py-10 lg:grid-cols-[minmax(0,1.65fr)_minmax(20rem,0.8fr)] lg:items-stretch lg:py-14">
            <div className="overflow-hidden bg-muted">
              <img src={featured.image} alt="" className="aspect-[16/10] h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]" />
            </div>
            <div className="flex flex-col justify-between bg-ink-deep px-6 py-8 md:px-9 md:py-10">
              <div>
                <p className="eyebrow text-pink">Featured collection</p>
                <h2 className="mt-5 text-[clamp(2.2rem,4vw,4.5rem)] leading-[1.02] font-medium">{featured.title}</h2>
                <p className="mt-6 text-base leading-relaxed text-primary-foreground/75">{featured.introduction}</p>
              </div>
              <div className="mt-10 flex items-end justify-between gap-5 border-t border-primary-foreground/20 pt-5">
                <span className="text-xs text-primary-foreground/65">{featured.storyIds.length} stories{featured.primaryTopic ? ` · ${featured.primaryTopic}` : ""}</span>
                <span className="inline-flex items-center gap-2 text-sm font-semibold">Explore collection <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </div>
            </div>
          </Link>
        </section>
      ) : null}

      <section className="container-editorial py-16 md:py-24">
        <div className="mb-12 max-w-2xl border-b border-border pb-7">
          <p className="eyebrow text-primary">Continue exploring</p>
          <h2 className="mt-3 text-3xl font-medium text-ink md:text-4xl">Choose a reading journey</h2>
        </div>
        <div className="space-y-20 md:space-y-28">
          {remaining.map((item, index) => (
            <article key={item.id} className={cn("group grid gap-7 md:grid-cols-12 md:items-center md:gap-10 lg:gap-16", index % 2 === 1 && "md:[&>*:first-child]:order-2")}>
              <Link to="/understand-indonesia/collections/$slug" params={{ slug: item.slug }} className="overflow-hidden bg-muted md:col-span-7">
                <img src={item.image} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]" />
              </Link>
              <div className="md:col-span-5">
                <p className="eyebrow text-muted-foreground">Journey {String(index + 2).padStart(2, "0")}</p>
                <h2 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] font-medium text-ink">{item.title}</h2>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">{item.introduction}</p>
                <p className="mt-5 text-xs text-muted-foreground">{item.storyIds.length} stories{item.primaryTopic ? ` · ${item.primaryTopic}` : ""}</p>
                <Link to="/understand-indonesia/collections/$slug" params={{ slug: item.slug }} className="mt-7 inline-flex items-center gap-3 border-b border-ink pb-1 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary">Explore collection <ArrowRight aria-hidden className="h-4 w-4" /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}