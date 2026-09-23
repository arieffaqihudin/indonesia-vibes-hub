import { Link } from "@tanstack/react-router";

import { formatDate, getForm } from "@/data/content";
import type { Story } from "@/types/content";
import { cn } from "@/lib/utils";
import { publicFormat } from "@/lib/editorial";

export function StoryCard({
  story,
  size = "md",
  eager = false,
}: {
  story: Story;
  size?: "sm" | "md" | "lg";
  eager?: boolean;
}) {
  const form = story.formIds[0] ? getForm(story.formIds[0]) : undefined;

  return (
    <article className="group">
      <Link to="/stories/$slug" params={{ slug: story.slug }} className="block">
        <div className="media-zoom relative bg-muted">
          <img
            src={story.image}
            alt={story.imageAlt}
            width={1600}
            height={1104}
            loading={eager ? "eager" : "lazy"}
            className={cn(
              "w-full object-cover",
              size === "lg" ? "aspect-[16/10]" : size === "sm" ? "aspect-[4/3]" : "aspect-[3/2]",
            )}
          />
          <span className="absolute top-3 left-3 bg-background/92 px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.14em] text-ink uppercase">
            {publicFormat(story)}
          </span>
        </div>
        <div className="pt-4">
          <p className="eyebrow text-primary">
            {story.topics?.[0] ?? form?.discipline ?? "Indonesia"} · {story.readingMinutes} min
          </p>
          <h3
            className={cn(
              "mt-2.5 font-medium tracking-tight text-ink",
              size === "lg" ? "display-3" : size === "sm" ? "text-lg leading-snug" : "text-xl leading-snug",
            )}
          >
            <span className="link-underline">{story.title}</span>
          </h3>
          <p
            className={cn(
              "mt-2.5 leading-relaxed text-muted-foreground",
              size === "sm" ? "text-sm" : "text-[0.95rem]",
            )}
          >
            {story.dek}
          </p>
          <p className="mt-3 text-xs text-muted-foreground/90">{formatDate(story.publishedAt)}</p>
        </div>
      </Link>
    </article>
  );
}