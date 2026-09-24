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
    ...(article.contentSource ? { contentSource: article.contentSource } : {}),
    ...(article.curationModel ? { curationModel: article.curationModel } : {}),
    ...(article.author ? { author: article.author } : {}),
    ...(article.authorRole ? { authorRole: article.authorRole } : {}),
    ...(article.sourceAttribution ? { sourceOrganisation: article.sourceAttribution } : {}),
    ...(article.coContributors ? { coContributors: article.coContributors } : {}),
  });
}

export function HomepageHero({ slides }: { slides: HomepageHeroSlide[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<number | null>(null);
  const moved = useRef(false);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const multiple = slides.length > 1;

  useEffect(() => {
    if (active >= slides.length) setActive(0);
  }, [active, slides.length]);

  useEffect(() => {
    const activeSelector = railRef.current?.children.item(active);
    if (!(activeSelector instanceof HTMLElement)) return;
    activeSelector.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [active]);

  const goTo = (index: number) => {
    if (!slides.length) return;
    const next = (index + slides.length) % slides.length;
    setDirection(next === active ? direction : index > active || (active === slides.length - 1 && next === 0) ? "next" : "previous");
    setActive(next);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!multiple) return;
    if (event.target instanceof Element && event.target.closest("a, button")) return;
    pointerStart.current = event.clientX;
    moved.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return;
    const delta = event.clientX - pointerStart.current;
    if (Math.abs(delta) > 4) moved.current = true;
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return;
    const delta = event.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(delta) > 48) goTo(active + (delta < 0 ? 1 : -1));
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
        className={`hero-stage relative min-h-[39rem] overflow-hidden sm:min-h-[42rem] md:min-h-[clamp(38rem,72vh,49rem)] ${multiple ? "cursor-grab active:cursor-grabbing" : ""}`}
        tabIndex={multiple ? 0 : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { pointerStart.current = null; }}
        data-direction={direction}
      >
        {slides.map(({ article, selection }, index) => {
          const credit = slideAttribution(article);
          const headline = selection.headline || article.title;
          const summary = selection.summary || article.dek;
          const focalPoint = selection.focalPoint ?? "Center";
          return (
            <article
              key={selection.articleId}
              className="hero-slide absolute inset-0 bg-ink-deep"
              data-active={index === active}
              aria-roledescription={multiple ? "slide" : undefined}
              aria-label={multiple ? `Slide ${index + 1} of ${slides.length}` : undefined}
              aria-hidden={multiple && index !== active}
            >
              <div className="relative h-full">
                <img
                  src={selection.image || article.image}
                  alt={article.imageAlt}
                  width={1800}
                  height={1200}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  loading={index === 0 ? "eager" : "lazy"}
                  draggable={false}
                  className={`hero-image absolute inset-0 h-full w-full select-none object-cover ${positionClass[focalPoint]}`}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-deep/95 via-ink-deep/58 to-ink-deep/5" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-deep/75 via-transparent to-ink-deep/15" />
                <div className="relative flex h-full items-end px-5 pt-24 pb-10 sm:px-8 md:w-[68%] md:items-center md:px-10 md:pt-12 md:pb-20 lg:w-[62%] lg:px-[max(4rem,7vw)]">
                  <div className="hero-copy max-w-3xl" data-active={index === active}>
                    <p className="eyebrow text-pink">
                      {article.topics?.[0] ?? "Indonesia"} <span aria-hidden="true">·</span> {publicFormat(article)}
                    </p>
                    <h1 className="mt-4 text-[clamp(2.25rem,5.2vw,4.5rem)] leading-[0.98] font-medium text-primary-foreground">
                      {headline}
                    </h1>
                    <p className="mt-5 max-w-2xl text-[clamp(1rem,1.35vw,1.25rem)] leading-relaxed text-primary-foreground/85">
                      {summary}
                    </p>
                    <p className="mt-4 text-xs text-primary-foreground/70">
                      {credit.primary}{credit.secondary ? ` · ${credit.secondary.replace("Edited and curated", "Curated")}` : ""}
                    </p>
                    <Link
                      to="/stories/$slug"
                      params={{ slug: article.slug }}
                      className="group mt-7 inline-flex min-h-11 items-center gap-2 border-b border-pink pb-1 text-sm font-semibold text-primary-foreground"
                      tabIndex={multiple && index !== active ? -1 : undefined}
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

        {multiple ? (
          <div className="absolute right-5 bottom-6 z-20 flex items-center gap-3 sm:right-8 md:right-10 md:bottom-9 lg:right-[max(4rem,7vw)]">
            <p className="mr-1 text-xs font-semibold text-primary-foreground tabular-nums" aria-live="polite">
              {String(active + 1).padStart(2, "0")} <span className="mx-1.5 text-primary-foreground/55">/</span> {String(slides.length).padStart(2, "0")}
            </p>
            <Button type="button" variant="outline" size="icon" className="min-h-11 min-w-11 rounded-none border-primary-foreground/45 bg-ink-deep/55 text-primary-foreground shadow-none backdrop-blur-sm hover:bg-primary hover:text-primary-foreground" aria-label="Previous article" onClick={() => goTo(active - 1)}>
              <ArrowLeft />
            </Button>
            <Button type="button" variant="outline" size="icon" className="min-h-11 min-w-11 rounded-none border-primary-foreground/45 bg-ink-deep/55 text-primary-foreground shadow-none backdrop-blur-sm hover:bg-primary hover:text-primary-foreground" aria-label="Next article" onClick={() => goTo(active + 1)}>
              <ArrowRight />
            </Button>
          </div>
        ) : null}
      </div>

      {multiple ? (
        <div ref={railRef} className="hero-rail scroll-strip flex border-t border-primary-foreground/15 bg-ink-deep px-5 sm:px-8 md:px-10 lg:px-[max(4rem,7vw)]" aria-label="Choose a featured article">
          {slides.map(({ article, selection }, index) => (
            <Button
              key={selection.articleId}
              type="button"
              variant="ghost"
              className="hero-selector group relative h-auto min-h-[8.25rem] min-w-[14.5rem] flex-1 items-start justify-start rounded-none px-0 py-5 pr-8 text-left text-primary-foreground hover:bg-transparent hover:text-primary-foreground md:min-w-0 md:pr-6"
              data-active={index === active}
              aria-current={index === active ? "true" : undefined}
              aria-label={`Show article ${index + 1}: ${selection.headline || article.title}`}
              onClick={() => goTo(index)}
            >
              <span className="block min-w-0 whitespace-normal">
                <span className="flex items-center gap-2 text-[0.66rem] font-semibold uppercase text-primary-foreground/55">
                  <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{article.topics?.[0] ?? publicFormat(article)}</span>
                </span>
                <span className="mt-3 line-clamp-2 block max-w-[15rem] text-sm leading-snug font-medium text-primary-foreground/70 transition-colors group-hover:text-primary-foreground md:max-w-[12rem] lg:max-w-[15rem]">
                  {selection.headline || article.title}
                </span>
                <span className="hero-selector-line mt-4 block h-px w-full bg-primary-foreground/25" aria-hidden="true" />
              </span>
            </Button>
          ))}
        </div>
      ) : null}
    </section>
  );
}