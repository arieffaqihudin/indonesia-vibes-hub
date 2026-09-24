import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

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
import { ongoingCollaborations } from "@/lib/freshness";
import { useHomepageSettings } from "@/lib/homepage";
import { ComingUpAroundWorld } from "@/components/editorial/ComingUpAroundWorld";
import { brand } from "@/lib/brand";
import { publicFormat } from "@/lib/editorial";
import { TOPICS } from "@/lib/topics";
import { HomepageHero } from "@/components/editorial/HomepageHero";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Indonesia Vibes — Indonesian culture, in motion" },
      { name: "description", content: brand.mission },
      { property: "og:title", content: "Indonesia Vibes — Indonesian culture, in motion" },
      { property: "og:description", content: brand.mission },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const [homepage] = useHomepageSettings(stories.map((item) => item.id));
  const heroSlides = homepage.hero.slice(0, 5).flatMap((selection) => {
    const article = stories.find((item) => item.id === selection.articleId.replace(/^c-/, ""));
    return article ? [{ article, selection }] : [];
  });
  if (!heroSlides.length && stories[0]) heroSlides.push({ article: stories[0], selection: { articleId: stories[0].id } });
  const rest = stories.slice(1);
  const secondary = rest.slice(0, 2);
  const grid = rest.slice(2, 6);
  const featuredCollection = collections[0]!;
  const otherCollections = collections.slice(1);
  const peopleToKnow = people.slice(0, 4);
  const collaborations = ongoingCollaborations().slice(0, 2);
  const sectionStyle = (id: (typeof homepage.sections)[number]["id"]) => {
    const section = homepage.sections.find((item) => item.id === id);
    return { className: section?.visible === false ? "hidden" : "contents", style: { order: section?.order ?? 0 } };
  };

  return (
    <>
      <HomepageHero slides={heroSlides} />

      <div className="flex flex-col">
      <div {...sectionStyle("in-focus")}><InFocus /></div>

      <div {...sectionStyle("understand")}>
      <section className="container-editorial py-16 md:py-24">
         <Reveal><SectionHeading eyebrow="Understand Indonesia" title="Featured articles" intro="Three ways into Indonesian knowledge: begin with the essentials, go deeper, or follow a perspective." action="/understand-indonesia" actionLabel="View all articles" /></Reveal>
        <div className="mt-10 grid gap-8 md:grid-cols-3">{(["Essentials", "Deep Dive", "Perspectives"] as const).map((format, i) => { const story = stories.find((item) => publicFormat(item) === format) ?? stories[i]!; return <Reveal key={format} delay={i * 70}><StoryCard story={story} size="sm" /></Reveal>; })}</div>
      </section>
      </div>

      {/* Around the world */}
      <div {...sectionStyle("around-world")}>
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
      </div>

      {/* Featured collection */}
      <div {...sectionStyle("collection")}>
      <section className="border-y border-border bg-blush">
        <div className="container-editorial py-16 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Curated"
              title="Featured collection"
              intro="Sets that read as arguments, not folders."
             action="/understand-indonesia/collections"
              actionLabel="All collections"
            />
          </Reveal>
          <Reveal className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center">
            <Link
              to="/understand-indonesia/collections/$slug"
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
                    to="/understand-indonesia/collections/$slug"
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
      </div>

      {/* Browse by topic */}
      <div {...sectionStyle("topics")}>
      <section className="container-editorial py-16 md:py-24">
        <Reveal>
          <SectionHeading
             eyebrow="Understand Indonesia"
             title="Browse by topic"
            intro="Follow connected knowledge across disciplines, communities and places."
             action="/understand-indonesia/topics"
            actionLabel="All topics"
          />
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
          {TOPICS.filter((topic) => ["Music", "Textiles", "History & Civilization"].includes(topic.id)).map((topic, i) => (
            <Reveal key={topic.id} delay={i * 80} className="contents">
              <Link
                 to="/understand-indonesia/topics/$slug"
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
                    View topic
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      </div>

      {/* People to know */}
      <div {...sectionStyle("people")}>
      <section className="border-y border-border bg-sand">
        <div className="container-editorial py-16 md:py-24">
          <Reveal>
            <SectionHeading
               eyebrow="Understand Indonesia"
               title="People & Organisations"
               intro="Makers, communities and organisations who create, carry and support the work."
               action="/people-organisations"
               actionLabel="View all"
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
      </div>

      <div {...sectionStyle("coming-up")}><ComingUpAroundWorld /></div>

      {/* Current collaborations */}
      <div {...sectionStyle("collaborations")}>
      <section className="border-y border-border bg-blush">
        <div className="container-editorial py-16 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Connect"
               title="Collaborate with Indonesia"
               intro="See how museums, festivals, universities and independent spaces work with Indonesia, then begin a conversation."
               action="/connect"
               actionLabel="Start a collaboration"
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
      </div>

      {/* Latest stories */}
      <div {...sectionStyle("latest")}>
      <section className="border-y border-border bg-sand">
        <div className="container-editorial py-16 md:py-24">
          <Reveal>
            <SectionHeading
               eyebrow="Understand Indonesia"
              title="Latest content"
              intro="Essentials, deep dives and perspectives — each connected to the people, topics and places it came from."
               action="/understand-indonesia"
               actionLabel="All articles"
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
      </div>
      </div>

      {/* Newsletter / connect */}
      <section className="container-editorial py-16 md:py-24">
        <Reveal className="grid gap-10 border border-border bg-ink-deep p-8 text-[oklch(0.95_0.01_40)] md:p-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-end">
          <div>
            <p className="eyebrow text-pink">Newsletter · Collaborate</p>
            <h2 className="display-2 mt-4 max-w-2xl">
              A monthly letter on what is being made, researched and programmed.
            </h2>
            <p className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-[oklch(0.82_0.02_30)]">
               One email a month: new articles and the programmes travelling abroad. We
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
              to="/connect"
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
