import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { CollaborationCard } from "@/components/editorial/EntityCards";
import { FaqAccordion } from "@/components/editorial/FaqList";
import { HomepageHero } from "@/components/editorial/HomepageHero";
import { CollectionJourneyPreview } from "@/components/editorial/CollectionJourneyPreview";
import { SectionHeading } from "@/components/editorial/Section";
import { StoryCard } from "@/components/editorial/StoryCard";
import { TopicIcon } from "@/components/editorial/TopicIcon";
import { Reveal } from "@/components/motion/Reveal";
import { WorldMap } from "@/components/map/WorldMap";
import { collaborations } from "@/data/collaborations";
import { institutions } from "@/data/institutions";
import { eventLocationLabel, formatEventDates, people, places, stories, worldNodes } from "@/data/content";
import { brand } from "@/lib/brand";
import { useCollections } from "@/lib/collections";
import { publishedFor, useFaqs } from "@/lib/faq";
import { comingUpEvents, recentlyPublishedStories } from "@/lib/freshness";
import { useHomepageSettings, type HomepageSectionId } from "@/lib/homepage";
import { useTopics } from "@/lib/topics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Indonesia Vibes — Indonesian culture, in motion" },
      { name: "description", content: brand.mission },
      { property: "og:title", content: "Indonesia Vibes — Indonesian culture, in motion" },
      { property: "og:description", content: brand.mission },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const profileHref = (id: string, slug: string) => id.startsWith("in-") ? { to: "/institutions/$slug" as const, params: { slug } } : { to: "/people/$slug" as const, params: { slug } };

function Home() {
  const [homepage] = useHomepageSettings(stories.map((item) => item.id));
  const [topics] = useTopics();
  const [collectionRecords] = useCollections();
  const [faqs] = useFaqs();
  const heroSlides = homepage.hero.slice(0, 5).flatMap((selection) => {
    const article = stories.find((item) => item.id === selection.articleId.replace(/^c-/, ""));
    return article ? [{ article, selection }] : [];
  });
  if (!heroSlides.length && stories[0]) heroSlides.push({ article: stories[0], selection: { articleId: stories[0].id } });

  const heroIds = new Set(heroSlides.map(({ article }) => article.id));
  const latestPool = recentlyPublishedStories();
  const withoutHero = latestPool.filter((article) => !heroIds.has(article.id));
  const latest = (homepage.excludeHeroFromLatest && withoutHero.length >= homepage.latestArticleLimit ? withoutHero : latestPool).slice(0, homepage.latestArticleLimit);
  const topicPreview = (homepage.featuredTopicIds.length ? homepage.featuredTopicIds.map((id) => topics.find((topic) => topic.id === id)) : topics.filter((topic) => topic.featured)).filter((topic) => topic?.status === "Published").slice(0, 10);
  const featuredCollection = collectionRecords.find((item) => item.id === homepage.featuredCollectionId && item.status === "Published") ?? collectionRecords.find((item) => item.featured && item.status === "Published") ?? collectionRecords.find((item) => item.status === "Published");
  const allProfiles = [...people, ...institutions];
  const profilePreview = (homepage.featuredProfileIds.length ? homepage.featuredProfileIds.map((id) => allProfiles.find((item) => item.id === id)) : allProfiles.filter((item) => item.featured)).filter(Boolean).slice(0, 6);
  const upcoming = comingUpEvents().slice(0, 5);
  const placePreview = (homepage.featuredPlaceIds.length ? homepage.featuredPlaceIds.map((id) => places.find((place) => place.id === id)) : places.filter((place) => place.featured && place.country === "Indonesia")).filter(Boolean).slice(0, 5);
  const worldHighlights = (homepage.featuredWorldIds.length ? homepage.featuredWorldIds.map((id) => worldNodes.find((node) => node.id === id)) : worldNodes.filter((node) => node.country !== "Indonesia" && node.status !== "Archive")).filter(Boolean).slice(0, 6);
  const collaborationPreview = (homepage.featuredCollaborationIds.length ? homepage.featuredCollaborationIds.map((id) => collaborations.find((item) => item.id === id)) : collaborations.filter((item) => item.featured)).filter(Boolean).slice(0, 2);
  const connectFaqs = publishedFor(faqs, "connect").slice(0, 4);
  const orderedSections = [...homepage.sections].filter((item) => item.visible).sort((a, b) => a.order - b.order);

  const sections: Record<HomepageSectionId, React.ReactNode> = {
    understand: <section className="container-editorial py-16 md:py-24" aria-labelledby="understand-title">
      <Reveal><SectionHeading eyebrow="Understand Indonesia" title="Understand Indonesia" intro="Discover Indonesia through subjects, stories, people and organisations." action="/understand-indonesia" actionLabel="Browse Articles" /></Reveal>
      <div className="mt-12 grid gap-12 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)]">
        <Reveal><div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-b border-border pb-4"><div className="min-w-0"><p className="eyebrow text-primary">Browse the subject</p><h3 className="mt-2 text-2xl font-semibold text-ink">Topics</h3></div><Link to="/understand-indonesia/topics" className="link-underline shrink-0 text-sm font-medium text-ink">Explore All Topics <ArrowUpRight className="inline h-4 w-4 text-primary" /></Link></div><ol className="divide-y divide-border">{topicPreview.map((topic) => topic ? <li key={topic.id}><Link to="/understand-indonesia/topics/$slug" params={{ slug: topic.slug }} className="group grid grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-3 py-4"><TopicIcon topic={topic} size={22} className="text-ink transition-colors duration-200 group-hover:text-primary" /><span className="min-w-0"><span className="block truncate text-base font-medium text-ink transition-colors duration-200 group-hover:text-primary">{topic.id}</span><span className="mt-1 line-clamp-1 block text-sm text-muted-foreground">{topic.intro}</span></span><ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-primary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link></li> : null)}</ol></Reveal>
        {featuredCollection ? <Reveal delay={80}><CollectionJourneyPreview collection={featuredCollection} compact /></Reveal> : null}
      </div>
      <Reveal className="mt-16"><div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-b border-border pb-5"><div className="min-w-0"><p className="eyebrow text-primary">Who carries the work</p><h3 className="mt-2 text-2xl font-semibold text-ink">People & Organisations</h3></div><Link to="/understand-indonesia/people-organisations" className="link-underline hidden shrink-0 text-sm font-medium text-ink sm:inline-flex">Explore People & Organisations <ArrowUpRight className="ml-1 h-4 w-4 text-primary" /></Link></div><div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">{profilePreview.map((profile) => profile ? <Link key={profile.id} {...profileHref(profile.id, profile.slug)} className="group grid grid-cols-[4.5rem_minmax(0,1fr)] gap-4 bg-background py-5 pr-4 sm:grid-cols-1 sm:p-5"><img src={profile.image} alt="" loading="lazy" className="aspect-square w-[4.5rem] object-cover sm:w-full" /><span className="min-w-0"><span className="text-xs text-primary">{"entity" in profile ? profile.entity === "community" ? "Community" : profile.role : profile.type}</span><span className="mt-1 block text-base font-medium text-ink group-hover:text-primary">{profile.name}</span><span className="mt-1 block text-xs text-muted-foreground">{"based" in profile ? profile.based : `${profile.city}, ${profile.country}`}</span></span></Link> : null)}</div><Link to="/understand-indonesia/people-organisations" className="mt-5 inline-flex text-sm font-medium text-primary sm:hidden">Explore People & Organisations <ArrowRight className="ml-2 h-4 w-4" /></Link></Reveal>
    </section>,
    latest: <section className="border-y border-border bg-sand"><div className="container-editorial py-16 md:py-24"><Reveal><SectionHeading eyebrow="Recently published" title="Latest Articles" intro="The newest knowledge, context and perspectives published by Indonesia Vibes." action="/understand-indonesia" actionLabel="View All Articles" /></Reveal><div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{latest.map((article, index) => <Reveal key={article.id} delay={(index % 3) * 60}><StoryCard story={article} size="sm" /></Reveal>)}</div></div></section>,
    experience: <section className="container-editorial py-16 md:py-24"><Reveal><SectionHeading eyebrow="Experience Indonesia" title="Experience Indonesia" intro="Find cultural events to attend and places where knowledge, heritage and contemporary practice live." action="/events-places" actionLabel="Explore Events & Places" /></Reveal><div className="mt-12 grid gap-14 lg:grid-cols-2"><Reveal><h3 className="border-b border-border pb-4 text-xl font-semibold text-ink">Coming Up</h3><ul className="divide-y divide-border">{upcoming.map((event) => <li key={event.id}><Link to="/events/$slug" params={{ slug: event.slug }} className="group grid grid-cols-[5rem_minmax(0,1fr)] gap-4 py-5"><time className="text-xs font-medium text-primary">{formatEventDates(event)}</time><span className="min-w-0"><span className="block text-base font-medium text-ink group-hover:text-primary">{event.title}</span><span className="mt-1 block text-xs text-muted-foreground">{eventLocationLabel(event)}{event.type ? ` · ${event.type}` : ""}</span></span></Link></li>)}</ul></Reveal><Reveal delay={80}><h3 className="border-b border-border pb-4 text-xl font-semibold text-ink">Places to Discover</h3><div className="grid gap-px bg-border sm:grid-cols-2">{placePreview.map((place) => place ? <Link key={place.id} to="/places/$slug" params={{ slug: place.slug }} className="group bg-background pb-5"><img src={place.image} alt="" loading="lazy" className="aspect-[3/2] w-full object-cover" /><span className="block px-4 pt-4"><span className="text-xs text-primary">{place.type ?? "Place"}</span><span className="mt-1 block text-base font-medium text-ink group-hover:text-primary">{place.name}</span><span className="mt-1 block text-xs text-muted-foreground">{place.city ?? place.province ?? place.region}, {place.country}</span></span></Link> : null)}</div></Reveal></div></section>,
    "around-world": <section className="border-y border-border bg-blush"><div className="container-editorial py-16 md:py-24"><Reveal><SectionHeading eyebrow="Global cultural presence" title="Indonesia Around the World" intro="Cultural programmes, partnerships and long-standing relationships connecting Indonesia with the world." action="/around-the-world" actionLabel="Explore Indonesia Around the World" /></Reveal><Reveal variant="fade" className="mt-10"><WorldMap nodes={worldHighlights.filter((node) => node !== undefined)} /></Reveal><div className="mt-6 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">{worldHighlights.map((node) => node ? <div key={node.id} className="bg-blush px-5 py-4"><p className="text-xs text-primary">{node.status} · {node.continent}</p><p className="mt-1 font-medium text-ink">{node.country}</p><p className="mt-1 text-sm text-muted-foreground">{node.programme}</p></div> : null)}</div></div></section>,
    collaborate: <section className="bg-ink-deep text-primary-foreground"><div className="container-editorial py-16 md:py-24"><Reveal><p className="eyebrow text-pink">Collaborate</p><div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"><div className="min-w-0"><h2 className="display-2 max-w-3xl">{homepage.collaborateHeadline || "Collaborate with Indonesia"}</h2><p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/75">{homepage.collaborateIntroduction}</p></div><div className="flex flex-col gap-3 sm:flex-row"><Link to="/collaborate" className="inline-flex min-h-11 items-center justify-center bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-deep-red">{homepage.collaborateCtaLabel || "Start a Collaboration"}</Link><Link to="/collaborate" className="inline-flex min-h-11 items-center justify-center border border-primary-foreground/30 px-6 text-sm font-semibold text-primary-foreground hover:border-primary-foreground">Explore Collaborations</Link></div></div></Reveal><div className="mt-12 grid gap-8 md:grid-cols-2">{collaborationPreview.map((item) => item ? <CollaborationCard key={item.id} collaboration={item} size="sm" /> : null)}</div>{connectFaqs.length ? <div className="mt-16 border-t border-primary-foreground/20 pt-10 [&_.border-border]:border-primary-foreground/20 [&_.text-ink]:text-primary-foreground [&_.text-muted-foreground]:text-primary-foreground/70"><div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"><h3 className="text-2xl font-semibold">Collaboration FAQ</h3><Link to="/faq" className="text-sm font-medium text-pink">View All FAQs →</Link></div><div className="mt-6"><FaqAccordion items={connectFaqs} /></div></div> : null}</div></section>,
  };

  return <><HomepageHero slides={heroSlides} /><div className="flex flex-col">{orderedSections.map((section) => <div key={section.id} style={{ order: section.order }}>{sections[section.id]}</div>)}</div></>;
}