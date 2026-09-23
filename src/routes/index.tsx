import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { InFocus } from "@/components/editorial/InFocus";
import { CollaborationCard, PersonCard } from "@/components/editorial/EntityCards";
import { SectionHeading } from "@/components/editorial/Section";
import { StoryCard } from "@/components/editorial/StoryCard";
import { WorldMap } from "@/components/map/WorldMap";
import {
  collections,
  formatEventDates,
  getPlace,
  people,
  stories,
  worldNodes,
} from "@/data/content";
import { ongoingCollaborations, openOpportunities } from "@/lib/freshness";
import { ComingUpAroundWorld } from "@/components/editorial/ComingUpAroundWorld";
import { brand } from "@/lib/brand";
import { publicFormat } from "@/lib/editorial";
import { TOPICS } from "@/lib/topics";

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
  const lead = stories[0]!;
  const rest = stories.slice(1);
  const secondary = rest.slice(0, 2);
  const grid = rest.slice(2, 6);
  const featuredCollection = collections[0]!;
  const otherCollections = collections.slice(1);
  const peopleToKnow = people.slice(0, 4);
  const collaborations = ongoingCollaborations().slice(0, 2);
  const openCalls = openOpportunities().slice(0, 3);

  return (
    <>
      {/* Hero — layered entrance: label, headline, standfirst, CTA */}
      <section className="wave-field border-b border-border" style={{ ["--wave-x" as string]: "78%", ["--wave-y" as string]: "24%" }}>
        <div className="container-editorial grid gap-12 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-end lg:gap-16">
          <div>
            <p className="eyebrow stagger-item text-primary">{brand.journey.join(" · ")}</p>
            <h1
              className="display-1 stagger-item mt-6 text-ink"
              style={{ ["--reveal-delay" as string]: "90ms" }}
            >
              Culture in motion, from the archipelago to the world.
            </h1>
            <p
              className="standfirst stagger-item mt-7 max-w-xl"
              style={{ ["--reveal-delay" as string]: "180ms" }}
            >
              {brand.name} is the front door to Indonesian cultural diplomacy in English: 17,000
              islands of practice, told by the people who hold it, and programmed into rooms on six
              continents.
            </p>
            <div
              className="stagger-item mt-9 flex flex-wrap items-center gap-3"
              style={{ ["--reveal-delay" as string]: "270ms" }}
            >
              <Link
                to="/explore"
                className="press group inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-deep-red"
              >
                Explore Indonesia
                <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
              </Link>
              <Link
                to="/"
                hash="in-focus"
                className="link-underline group inline-flex min-h-11 items-center gap-2 px-1 text-sm font-medium text-ink"
              >
                Explore in focus
                <ArrowUpRight className="arrow-nudge h-4 w-4 text-primary" />
              </Link>
            </div>
          </div>

          <Reveal as="figure" variant="mask" className="media-zoom relative">
            <img
              src={lead.image}
              alt={lead.imageAlt}
              width={1600}
              height={1104}
              fetchPriority="high"
              className="aspect-[4/3] w-full object-cover"
            />
            <figcaption className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-ink-deep/90 to-transparent p-6 pt-16">
              <p className="eyebrow text-pink">Featured · {publicFormat(lead)}</p>
              <Link
                to="/stories/$slug"
                params={{ slug: lead.slug }}
                className="link-underline mt-2 block text-xl leading-snug font-medium tracking-tight text-primary-foreground sm:text-2xl"
              >
                {lead.title}
              </Link>
            </figcaption>
          </Reveal>
        </div>
      </section>

      <InFocus />

      <section className="container-editorial py-16 md:py-24">
        <Reveal><SectionHeading eyebrow="Explore" title="Featured content" intro="Three ways into Indonesian knowledge: begin with the essentials, go deeper, or follow a perspective." action="/explore" actionLabel="Explore all content" /></Reveal>
        <div className="mt-10 grid gap-8 md:grid-cols-3">{(["Essentials", "Deep Dive", "Perspectives"] as const).map((format, i) => { const story = stories.find((item) => publicFormat(item) === format) ?? stories[i]!; return <Reveal key={format} delay={i * 70}><StoryCard story={story} size="sm" /></Reveal>; })}</div>
      </section>

      {/* Around the world */}
      <section className="container-editorial py-16 md:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Experience"
            title="Indonesia around the world"
            intro={`${worldNodes.filter((n) => n.status !== "Archive").length} programmes, partnerships and long-standing relationships, arcing out from Jakarta.`}
            action="/around-the-world"
            actionLabel="Open the map"
          />
        </Reveal>
        <Reveal variant="fade" className="mt-10">
          <WorldMap />
        </Reveal>
      </section>

      {/* Featured collection */}
      <section className="border-y border-border bg-blush">
        <div className="container-editorial py-16 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Curated"
              title="Featured collection"
              intro="Sets that read as arguments, not folders."
              action="/explore/collections"
              actionLabel="All collections"
            />
          </Reveal>
          <Reveal className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center">
            <Link
              to="/collections/$slug"
              params={{ slug: featuredCollection.slug }}
              className="group block"
            >
              <div className="media-zoom bg-muted">
                <img
                  src={featuredCollection.image}
                  alt=""
                  width={1600}
                  height={1000}
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>
              <h3 className="display-3 mt-5 text-ink">
                <span className="link-underline">{featuredCollection.title}</span>
              </h3>
              <p className="mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-muted-foreground">
                {featuredCollection.dek}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                {featuredCollection.storyIds.length} stories
              </p>
            </Link>
            <ul className="divide-y divide-border border-y border-border">
              {otherCollections.map((c) => (
                <li key={c.id}>
                  <Link
                    to="/collections/$slug"
                    params={{ slug: c.slug }}
                    className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-5"
                  >
                    <span className="min-w-0">
                      <span className="block text-lg leading-snug font-medium text-ink group-hover:text-primary">
                        {c.title}
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">{c.dek}</span>
                    </span>
                    <ArrowUpRight className="arrow-nudge h-5 w-5 shrink-0 text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Explore by topic */}
      <section className="container-editorial py-16 md:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Explore"
            title="Explore by topic"
            intro="Follow connected knowledge across disciplines, communities and places."
            action="/explore/topics"
            actionLabel="All topics"
          />
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
          {TOPICS.filter((topic) => ["Music", "Textiles", "History & Civilization"].includes(topic.id)).map((topic, i) => (
            <Reveal key={topic.id} delay={i * 80} className="contents">
              <Link
                to="/explore/topics/$slug"
                params={{ slug: topic.slug }}
                className="press group flex flex-col justify-between gap-10 bg-background p-8 hover:bg-blush"
              >
                <span className="text-sm text-muted-foreground tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="display-3 block text-ink">{topic.id}</span>
                  <span className="mt-3 block text-[0.95rem] leading-relaxed text-muted-foreground">
                    {topic.intro}
                  </span>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Explore
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* People to know */}
      <section className="border-y border-border bg-sand">
        <div className="container-editorial py-16 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Connect"
              title="People to know"
              intro="Makers, masters, researchers and the communities who hold the practice."
              action="/people"
              actionLabel="All people & communities"
            />
          </Reveal>
          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {peopleToKnow.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <PersonCard person={p} size="sm" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ComingUpAroundWorld />

      {/* Current collaborations */}
      <section className="border-y border-border bg-blush">
        <div className="container-editorial py-16 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Connect"
              title="Ongoing collaborations"
              intro="Long-running exchanges with museums, festivals, universities and independent spaces."
              action="/collaborations"
              actionLabel="All collaborations"
            />
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {collaborations.map((c, i) => (
              <Reveal key={c.id} delay={i * 80}>
                <CollaborationCard collaboration={c} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunities */}
      <section className="container-editorial py-16 md:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Connect"
            title="Open now"
            intro="Grants, residencies and fellowships currently accepting applications."
            action="/opportunities"
            actionLabel="All opportunities"
          />
        </Reveal>
        {openCalls.length ? (
          <ul className="mt-10 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
            {openCalls.map(({ o, s }, i) => (
              <Reveal as="li" key={o.id} delay={i * 70} className="bg-background">
                <Link to="/opportunities" className="flex h-full flex-col justify-between gap-8 p-6 hover:bg-blush">
                  <span className="eyebrow text-primary">{o.type}</span>
                  <span>
                    <span className="block text-lg leading-snug font-medium text-ink">{o.title}</span>
                    <span className="mt-2 block text-sm text-muted-foreground">{s.label}</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        ) : (
          <p className="mt-10 border-y border-border py-6 text-sm text-muted-foreground">
            No open calls are currently listed for this selection. New rounds are announced through
            the newsletter.
          </p>
        )}
      </section>

      {/* Latest stories */}
      <section className="border-y border-border bg-sand">
        <div className="container-editorial py-16 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Explore"
              title="Latest content"
              intro="Essentials, deep dives and perspectives — each connected to the people, topics and places it came from."
              action="/explore"
              actionLabel="All content"
            />
          </Reveal>
          <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2">
            {secondary.map((s, i) => (
              <Reveal key={s.id} delay={i * 80}>
                <StoryCard story={s} size="lg" />
              </Reveal>
            ))}
          </div>
          <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {grid.map((s, i) => (
              <Reveal key={s.id} delay={i * 70}>
                <StoryCard story={s} size="sm" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / connect */}
      <section className="container-editorial py-16 md:py-24">
        <Reveal className="grid gap-10 border border-border bg-ink-deep p-8 text-[oklch(0.95_0.01_40)] md:p-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-end">
          <div>
            <p className="eyebrow text-pink">Newsletter · Collaborate</p>
            <h2 className="display-2 mt-4 max-w-2xl">
              A monthly letter on what is being made, researched and programmed.
            </h2>
            <p className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-[oklch(0.82_0.02_30)]">
              One email a month: new stories, open calls and the programmes travelling abroad. We
              also work directly with museums, festivals and universities.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              to="/contact"
              className="press inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-deep-red"
            >
              Subscribe
            </Link>
            <Link
              to="/collaborate"
              className="press inline-flex min-h-11 items-center rounded-full border border-white/25 px-6 text-sm font-medium hover:bg-white/10"
            >
              Partner with us
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
