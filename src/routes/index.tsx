import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { NowSection } from "@/components/editorial/NowSection";
import { SectionHeading } from "@/components/editorial/Section";
import { StoryCard } from "@/components/editorial/StoryCard";
import { WorldMap } from "@/components/map/WorldMap";
import {
  collections,
  events,
  formatRange,
  getPlace,
  pillars,
  stories,
  worldNodes,
} from "@/data/content";
import { brand } from "@/lib/brand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Indonesia Vibes — Indonesian culture, in motion" },
      { name: "description", content: brand.mission },
      { property: "og:title", content: "Indonesia Vibes — Indonesian culture, in motion" },
      { property: "og:description", content: brand.mission },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const [lead, ...rest] = stories;
  const secondary = rest.slice(0, 2);
  const grid = rest.slice(2, 6);
  const upcoming = events.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="wave-field border-b border-border" style={{ ["--wave-x" as string]: "78%", ["--wave-y" as string]: "24%" }}>
        <div className="container-editorial grid gap-12 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-end lg:gap-16">
          <div className="rise-in">
            <p className="eyebrow text-primary">{brand.journey.join(" · ")}</p>
            <h1 className="display-1 mt-6 text-ink">
              Culture in motion, from the archipelago to the world.
            </h1>
            <p className="standfirst mt-7 max-w-xl">
              {brand.name} is the front door to Indonesian cultural diplomacy in English: 17,000
              islands of practice, told by the people who hold it, and programmed into rooms on six
              continents.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/stories"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-deep-red"
              >
                Start with the stories
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/around-the-world"
                className="link-underline inline-flex min-h-11 items-center gap-2 px-1 text-sm font-medium text-ink"
              >
                See where we are right now
                <ArrowUpRight className="h-4 w-4 text-primary" />
              </Link>
            </div>
          </div>

          <figure className="media-zoom relative">
            <img
              src={lead.image}
              alt={lead.imageAlt}
              width={1600}
              height={1104}
              className="aspect-[4/3] w-full object-cover"
            />
            <figcaption className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-ink-deep/90 to-transparent p-6 pt-16">
              <p className="eyebrow text-pink">Featured · {lead.kind}</p>
              <Link
                to="/stories/$slug"
                params={{ slug: lead.slug }}
                className="mt-2 block text-xl leading-snug font-medium tracking-tight text-primary-foreground sm:text-2xl"
              >
                {lead.title}
              </Link>
            </figcaption>
          </figure>
        </div>
      </section>

      <NowSection />

      {/* Latest */}
      <section className="container-editorial py-16 md:py-24">
        <SectionHeading
          eyebrow="Discover"
          title="Latest stories"
          intro="Reporting, interviews and field notes — each one connected to the makers, forms and places it came from."
          action="/stories"
          actionLabel="All stories"
        />
        <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2">
          {secondary.map((s) => (
            <StoryCard key={s.id} story={s} size="lg" />
          ))}
        </div>
        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {grid.map((s) => (
            <StoryCard key={s.id} story={s} size="sm" />
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="border-y border-border bg-sand">
        <div className="container-editorial py-16 md:py-24">
          <SectionHeading
            eyebrow="Understand"
            title="Three ways in"
            intro="Heritage, contemporary practice and research — held together rather than ranked."
          />
          <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
            {pillars.map((p, i) => (
              <Link
                key={p.id}
                to={p.route}
                className="group flex flex-col justify-between gap-10 bg-background p-8 transition-colors hover:bg-blush"
              >
                <span className="text-sm text-muted-foreground tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="display-3 block text-ink">{p.title}</span>
                  <span className="mt-3 block text-[0.95rem] leading-relaxed text-muted-foreground">
                    {p.blurb}
                  </span>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Explore
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Around the world */}
      <section className="container-editorial py-16 md:py-24">
        <SectionHeading
          eyebrow="Experience"
          title="Indonesia around the world"
          intro={`${worldNodes.filter((n) => n.status !== "Archive").length} live and upcoming programmes, arcing out from Jakarta.`}
          action="/around-the-world"
          actionLabel="Open the map"
        />
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
          <WorldMap />
          <ul className="divide-y divide-border border-y border-border">
            {upcoming.map((e) => {
              const place = getPlace(e.placeId);
              return (
                <li key={e.id}>
                  <Link
                    to="/events/$slug"
                    params={{ slug: e.slug }}
                    className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-5"
                  >
                    <span className="min-w-0">
                      <span className="eyebrow text-primary">
                        {e.type} · {place?.name}
                      </span>
                      <span className="mt-2 block text-lg leading-snug font-medium text-ink group-hover:text-primary">
                        {e.title}
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {formatRange(e.startDate, e.endDate)}
                      </span>
                    </span>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Collections */}
      <section className="border-t border-border bg-blush">
        <div className="container-editorial py-16 md:py-24">
          <SectionHeading
            eyebrow="Curated"
            title="Collections"
            intro="Sets that read as arguments, not folders."
            action="/collections"
          />
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {collections.map((c) => (
              <Link key={c.id} to="/collections/$slug" params={{ slug: c.slug }} className="group">
                <div className="media-zoom bg-muted">
                  <img
                    src={c.image}
                    alt=""
                    width={1600}
                    height={1104}
                    loading="lazy"
                    className="aspect-[5/4] w-full object-cover"
                  />
                </div>
                <h3 className="mt-4 text-xl font-medium tracking-tight text-ink">
                  <span className="link-underline">{c.title}</span>
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">{c.dek}</p>
                <p className="mt-3 text-xs text-muted-foreground">{c.storyIds.length} stories</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Connect */}
      <section className="container-editorial py-16 md:py-24">
        <div className="grid gap-10 border border-border bg-ink-deep p-8 text-[oklch(0.95_0.01_40)] md:p-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-end">
          <div>
            <p className="eyebrow text-pink">Connect · Collaborate</p>
            <h2 className="display-2 mt-4 max-w-2xl">
              Bring an Indonesian programme to your city — or apply to make one.
            </h2>
            <p className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-[oklch(0.82_0.02_30)]">
              We work with museums, festivals, universities and independent spaces. Artists and
              researchers apply directly through open calls.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              to="/collaborate"
              className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-deep-red"
            >
              Partner with us
            </Link>
            <Link
              to="/opportunities"
              className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-6 text-sm font-medium transition-colors hover:bg-white/10"
            >
              Open calls
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
