import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { getStoryById } from "@/data/content";
import { collectionReadingMinutes, collectionStoryLabel, type EditorialCollection } from "@/lib/collections";
import { cn } from "@/lib/utils";

export function CollectionJourneyPreview({
  collection,
  featured = false,
  compact = false,
  stacked = false,
  className,
}: {
  collection: EditorialCollection;
  featured?: boolean;
  compact?: boolean;
  stacked?: boolean;
  className?: string;
}) {
  const journey = collection.storyIds.map(getStoryById).filter((story) => story !== undefined);
  const minutes = collectionReadingMinutes(collection);
  const shown = journey.slice(0, 3);
  const remaining = Math.max(0, journey.length - shown.length);

  return (
    <article className={cn(featured ? "bg-ink text-primary-foreground" : "border-y border-border", className)}>
      <div className={cn("grid", !stacked && (featured ? "lg:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.85fr)]" : "md:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1.2fr)]"))}>
        <Link to="/understand-indonesia/collections/$slug" params={{ slug: collection.slug }} className="group overflow-hidden bg-muted">
          <img
            src={collection.image}
            alt=""
            loading={featured ? "eager" : "lazy"}
            className={cn("h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]", stacked ? "aspect-[16/9] max-h-80" : featured ? "min-h-72 aspect-[16/10] lg:aspect-auto" : "aspect-[4/3]")}
          />
        </Link>
        <div className={cn("flex flex-col", compact ? "p-5 md:p-6" : "p-6 md:p-9 lg:p-11")}>
          <p className={cn("eyebrow", featured ? "text-pink" : "text-primary")}>{featured ? "Featured curated collection" : "Curated collection"}</p>
          <h2 className={cn("mt-4 font-medium", featured ? "text-[clamp(2.25rem,4vw,4.5rem)] leading-[1.02]" : "text-3xl leading-tight text-ink md:text-4xl")}>{collection.title}</h2>
          <p className={cn("mt-4 max-w-2xl leading-relaxed", featured ? "text-primary-foreground/75" : "text-muted-foreground")}>{collection.introduction}</p>
          <p className={cn("mt-5 text-xs font-medium", featured ? "text-primary-foreground/65" : "text-clay")}>{collectionStoryLabel(collection)}{minutes ? ` · ${minutes} min reading` : ""}</p>

          {shown.length ? <div className={cn("mt-7 border-t pt-4", featured ? "border-primary-foreground/20" : "border-border")}>
            <p className={cn("eyebrow", featured ? "text-primary-foreground/55" : "text-muted-foreground")}>Start with</p>
            <ol className="mt-3 space-y-2.5">
              {shown.map((story, index) => <li key={story.id} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-2 text-sm leading-snug">
                <span className={featured ? "text-pink" : "text-primary"}>{String(index + 1).padStart(2, "0")}</span>
                <span className={featured ? "text-primary-foreground" : "text-ink"}>{story.title}</span>
              </li>)}
            </ol>
            {remaining ? <p className={cn("mt-3 pl-10 text-xs", featured ? "text-primary-foreground/55" : "text-muted-foreground")}>+ {remaining} more {remaining === 1 ? "story" : "stories"}</p> : null}
          </div> : null}

          <Link to="/understand-indonesia/collections/$slug" params={{ slug: collection.slug }} className={cn("mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-7 text-sm font-semibold", featured ? "text-primary-foreground" : "text-ink hover:text-primary")}>
            Start the Collection <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}