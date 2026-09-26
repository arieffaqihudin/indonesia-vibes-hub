import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

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
  const pointerStart = useRef<number | null>(null);
  const moved = useRef(false);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const multiple = slides.length > 1;

  useEffect(() => {
    if (active >= slides.length) setActive(0);
  }, [active, slides.length]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const goTo = useCallback((index: number) => {
    if (!slides.length) return;
    const next = (index + slides.length) % slides.length;
    setDirection(next === active ? direction : index > active || (active === slides.length - 1 && next === 0) ? "next" : "previous");
    setActive(next);
  }, [active, direction, slides.length]);

  useEffect(() => {
    if (!multiple || paused || reducedMotion) return;
    const timer = window.setTimeout(() => goTo(active + 1), 6000);
    return () => window.clearTimeout(timer);
  }, [active, goTo, multiple, paused, reducedMotion]);

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
      className="relative overflow-hidden bg-ink-deep"
      aria-roledescription={multiple ? "carousel" : undefined}
      aria-label="Featured articles"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      onKeyDown={(event) => {
        if (!multiple) return;
        if (event.key === "ArrowLeft") { event.preventDefault(); goTo(active - 1); }
        if (event.key === "ArrowRight") { event.preventDefault(); goTo(active + 1); }
      }}
    >
      <div
        className={`hero-stage relative min-h-[35rem] overflow-hidden sm:min-h-[39rem] md:min-h-[clamp(40rem,78vh,54rem)] ${multiple ? "cursor-grab active:cursor-grabbing" : ""}`}
        tabIndex={multiple ? 0 : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { pointerStart.current = null; }}
        data-direction={direction}
      >
        <p className="pointer-events-none absolute top-6 left-5 z-20 flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.2em] text-primary-foreground/80 uppercase sm:left-8 md:top-8 md:left-12 lg:left-[max(4rem,8vw)]">
          Indonesia, told through culture <span aria-hidden="true" className="h-px w-8 bg-primary-foreground/40" /> <span className="text-pink">Culture for the future</span>
        </p>
        <h1 className="sr-only">Indonesia, Told Through Culture</h1>
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
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-deep/95 via-ink-deep/55 to-transparent" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-deep/90 via-transparent to-ink-deep/25" />
                <div className="relative flex h-full items-end px-5 pt-24 pb-32 sm:px-8 sm:pb-36 md:w-[76%] md:items-center md:px-12 md:pt-16 md:pb-24 lg:w-[70%] lg:px-[max(4rem,8vw)]">
                  <div className="hero-copy max-w-[52rem]" data-active={index === active}>
                    <p className="eyebrow flex items-center gap-3 text-pink">
                      <span className="h-px w-10 bg-primary" aria-hidden="true" />
                      {publicFormat(article)} <span aria-hidden="true">·</span> {article.topics?.[0] ?? "Indonesia"}
                    </p>
                    <h2 className="mt-5 max-w-[13ch] text-[clamp(2.45rem,5.8vw,5.5rem)] leading-[0.94] font-medium text-primary-foreground"><Link to="/stories/$slug" params={{ slug: article.slug }} className="transition-colors hover:text-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink" tabIndex={multiple && index !== active ? -1 : undefined}>{headline}</Link></h2>
                    <p className="mt-5 line-clamp-3 max-w-xl text-base leading-relaxed text-primary-foreground/82 sm:text-lg">
                      {summary}
                    </p>
                    <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                      <Link
                        to="/stories/$slug"
                        params={{ slug: article.slug }}
                        className="group inline-flex min-h-12 items-center gap-4 text-sm font-semibold text-primary-foreground"
                        tabIndex={multiple && index !== active ? -1 : undefined}
                        onClick={(event) => { if (moved.current) event.preventDefault(); }}
                      >
                        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-primary-foreground/35 transition-colors group-hover:border-pink group-hover:bg-primary">
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </span>
                        {selection.cta || "Read Story"}
                      </Link>
                      <p className="text-xs text-primary-foreground/65">
                        {credit.primary}{article.readingMinutes ? ` · ${article.readingMinutes} min read` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        {multiple ? <>
          <div className="absolute right-5 bottom-20 z-20 flex items-center gap-2 sm:right-8 md:right-auto md:bottom-8 md:left-[max(3rem,8vw)] lg:left-[max(4rem,8vw)]">
            <Button type="button" variant="outline" size="icon" className="min-h-11 min-w-11 rounded-full border-primary-foreground/35 bg-ink-deep/35 text-primary-foreground shadow-none backdrop-blur-sm hover:border-pink hover:bg-primary" aria-label="Previous article" onClick={() => goTo(active - 1)}><ArrowLeft /></Button>
            <Button type="button" variant="outline" size="icon" className="min-h-11 min-w-11 rounded-full border-primary-foreground/35 bg-ink-deep/35 text-primary-foreground shadow-none backdrop-blur-sm hover:border-pink hover:bg-primary" aria-label="Next article" onClick={() => goTo(active + 1)}><ArrowRight /></Button>
            <p className="ml-2 text-xs font-semibold text-primary-foreground tabular-nums" aria-live="polite">{String(active + 1).padStart(2, "0")} <span className="mx-1.5 text-primary-foreground/45">/</span> {String(slides.length).padStart(2, "0")}</p>
          </div>

          <div className="hero-index absolute right-4 bottom-4 left-4 z-20 flex items-end justify-center gap-2 sm:right-8 sm:left-8 md:top-0 md:right-8 md:bottom-0 md:left-auto md:flex-col md:justify-center md:gap-3 lg:right-[max(3rem,5vw)]" aria-label="Choose a featured article">
            {slides.map(({ article, selection }, index) => <Button key={selection.articleId} type="button" variant="ghost" className="hero-index-item h-11 min-w-11 flex-1 rounded-none px-1 text-primary-foreground/50 hover:bg-transparent hover:text-primary-foreground md:h-16 md:min-w-12 md:flex-none md:flex-col md:gap-2" data-active={index === active} aria-current={index === active ? "true" : undefined} aria-label={`Show article ${index + 1}: ${selection.headline || article.title}`} onClick={() => goTo(index)}>
              <span className="text-[0.68rem] font-semibold tabular-nums">{String(index + 1).padStart(2, "0")}</span>
              <span className="hero-index-line block h-px w-full max-w-12 bg-primary-foreground/35 md:h-8 md:w-px" aria-hidden="true" />
            </Button>)}
          </div>

          {!reducedMotion && !paused ? <div key={active} className="hero-progress absolute bottom-0 left-0 z-30 h-0.5 bg-primary" aria-hidden="true" /> : null}
        </> : null}
      </div>
    </section>
  );
}