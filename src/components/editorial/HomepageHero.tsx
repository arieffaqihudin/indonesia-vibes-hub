import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import { Button } from "@/components/ui/button";
import { attribution } from "@/lib/attribution";
import { publicFormat } from "@/lib/editorial";
import type { HeroItem } from "@/lib/homepage";
import type { Story } from "@/types/content";

export interface HomepageHeroSlide {
  article: Story;
  selection: HeroItem;
}

const positionClass: Record<NonNullable<HeroItem["focalPoint"]>, string> = {
  Center: "object-center",
  Top: "object-top",
  Bottom: "object-bottom",
  Left: "object-left",
  Right: "object-right",
};

function slideAttribution(article: Story) {
  return attribution({
    contentSource: article.contentSource,
    curationModel: article.curationModel,
    author: article.author,
    authorRole: article.authorRole,
    sourceOrganisation: article.sourceAttribution,
    coContributors: article.coContributors,
  });
}

export function HomepageHero({ slides }: { slides: HomepageHeroSlide[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<{ x: number; scrollLeft: number } | null>(null);
  const moved = useRef(false);
  const [active, setActive] = useState(0);
  const multiple = slides.length > 1;

  useEffect(() => {
    if (active >= slides.length) setActive(0);
  }, [active, slides.length]);

  const goTo = (index: number) => {
    const viewport = viewportRef.current;
    if (!viewport || !slides.length) return;
    const next = (index + slides.length) % slides.length;
    const target = viewport.children.item(next);
    if (!(target instanceof HTMLElement)) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    viewport.scrollTo({ left: target.offsetLeft, behavior: reduced ? "auto" : "smooth" });
    setActive(next);
  };

  const updateActiveFromScroll = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let nearest = 0;
    let distance = Number.POSITIVE_INFINITY;
    Array.from(viewport.children).forEach((node, index) => {
      if (!(node instanceof HTMLElement)) return;
      const nextDistance = Math.abs(node.offsetLeft - viewport.scrollLeft);
      if (nextDistance < distance) {
        nearest = index;
        distance = nextDistance;
      }
    });
    setActive(nearest);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!multiple || event.pointerType === "touch") return;
    pointerStart.current = { x: event.clientX, scrollLeft: event.currentTarget.scrollLeft };
    moved.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointerStart.current) return;
    const delta = event.clientX - pointerStart.current.x;
    if (Math.abs(delta) > 4) moved.current = true;
    event.currentTarget.scrollLeft = pointerStart.current.scrollLeft - delta;
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointerStart.current) return;
    const delta = event.clientX - pointerStart.current.x;
    pointerStart.current = null;
    if (Math.abs(delta) > 48) goTo(active + (delta < 0 ? 1 : -1));
    else goTo(active);
  };

  if (!slides.length) return null;

  return (
    <section
      className="relative overflow-hidden border-b border-border bg-ink-deep"
      aria-roledescription={multiple ? "carousel" : undefined}
      aria-label="Featured articles"
      onKeyDown={(event) => {
        if (!multiple) return;
        if (event.key === "ArrowLeft") { event.preventDefault(); goTo(active - 1); }
        if (event.key === "ArrowRight") { event.preventDefault(); goTo(active + 1); }
      }}
    >
      <div
        ref={viewportRef}
        className={`hero-track flex gap-3 overflow-x-auto overscroll-x-contain ${multiple ? "cursor-grab active:cursor-grabbing" : ""}`}
        tabIndex={multiple ? 0 : undefined}
        onScroll={updateActiveFromScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { pointerStart.current = null; }}
      >
        {slides.map(({ article, selection }, index) => {
          const credit = slideAttribution(article);
          const headline = selection.headline || article.title;
          const summary = selection.summary || article.dek;
          const focalPoint = selection.focalPoint ?? "Center";
          return (
            <article
              key={selection.articleId}
              className={`hero-slide relative shrink-0 bg-background ${multiple ? "w-[calc(100%-1.25rem)] lg:w-[calc(100%-5.5rem)]" : "w-full"}`}
              aria-roledescription={multiple ? "slide" : undefined}
              aria-label={multiple ? `Slide ${index + 1} of ${slides.length}` : undefined}
              aria-hidden={multiple && index !== active}
            >
              <div className="relative min-h-[28rem] md:min-h-[35rem] lg:min-h-[clamp(38rem,78vh,50rem)]">
                <img
                  src={selection.image || article.image}
                  alt={article.imageAlt}
                  width={1800}
                  height={1200}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  loading={index === 0 ? "eager" : "lazy"}
                  draggable={false}
                  className={`absolute inset-0 h-[54%] w-full select-none object-cover md:h-full ${positionClass[focalPoint]}`}
                />
                <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-ink-deep/95 via-ink-deep/62 to-transparent md:block" />
                <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-ink-deep/65 via-transparent to-transparent md:block" />
                <div className="absolute inset-x-0 bottom-0 flex min-h-[47%] items-end bg-background px-5 pt-14 pb-20 sm:px-8 md:inset-y-0 md:right-auto md:w-[64%] md:min-h-0 md:items-center md:bg-transparent md:px-10 md:pt-8 md:pb-24 lg:w-[61%] lg:px-[max(4rem,7vw)]">
                  <div className="hero-copy max-w-3xl" data-active={index === active}>
                    <p className="eyebrow text-primary md:text-pink">
                      {article.topics?.[0] ?? "Indonesia"} <span aria-hidden="true">·</span> {publicFormat(article)}
                    </p>
                    <h1 className="mt-4 text-[clamp(2.125rem,5.2vw,4.5rem)] leading-[0.98] font-medium text-ink md:text-primary-foreground">
                      {headline}
                    </h1>
                    <p className="mt-5 max-w-2xl text-[clamp(1rem,1.35vw,1.25rem)] leading-relaxed text-muted-foreground md:text-primary-foreground/85">
                      {summary}
                    </p>
                    <p className="mt-4 text-xs text-muted-foreground md:text-primary-foreground/70">
                      {credit.primary}{credit.secondary ? ` · ${credit.secondary.replace("Edited and curated", "Curated")}` : ""}
                    </p>
                    <Link
                      to="/stories/$slug"
                      params={{ slug: article.slug }}
                      className="group mt-7 inline-flex min-h-11 items-center gap-2 border-b border-primary pb-1 text-sm font-semibold text-ink md:border-pink md:text-primary-foreground"
                      onClick={(event) => { if (moved.current) event.preventDefault(); }}
                    >
                      {selection.cta || "Read Story"}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {multiple ? (
        <div className="pointer-events-none absolute right-5 bottom-5 left-5 z-10 flex items-center justify-between md:right-10 md:bottom-7 md:left-auto md:justify-end md:gap-5 lg:right-[calc(5.5rem+2rem)]">
          <p className="pointer-events-auto bg-background/92 px-3 py-2 text-xs font-semibold text-ink tabular-nums" aria-live="polite">
            {String(active + 1).padStart(2, "0")} <span className="mx-2 text-muted-foreground">/</span> {String(slides.length).padStart(2, "0")}
          </p>
          <div className="pointer-events-auto flex gap-1.5">
            <Button type="button" variant="outline" size="icon" className="min-h-11 min-w-11 rounded-none border-primary-foreground/35 bg-ink-deep/78 text-primary-foreground shadow-none hover:bg-primary hover:text-primary-foreground" aria-label="Previous article" onClick={() => goTo(active - 1)}>
              <ArrowLeft />
            </Button>
            <Button type="button" variant="outline" size="icon" className="min-h-11 min-w-11 rounded-none border-primary-foreground/35 bg-ink-deep/78 text-primary-foreground shadow-none hover:bg-primary hover:text-primary-foreground" aria-label="Next article" onClick={() => goTo(active + 1)}>
              <ArrowRight />
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}