import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { FilterBar } from "@/components/editorial/FilterBar";
import { PersonCard } from "@/components/editorial/EntityCards";
import { PageHeader, SectionHeading } from "@/components/editorial/Section";
import { StoryCard } from "@/components/editorial/StoryCard";
import { collections, people, stories } from "@/data/content";
import { publicFormat, PUBLIC_FORMATS, type PublicFormat } from "@/lib/editorial";
import { TOPICS } from "@/lib/topics";

export const Route = createFileRoute("/understand-indonesia")({
  head: () => ({ meta: [
    { title: "Understand Indonesia — Indonesia Vibes" },
    { name: "description", content: "Articles, topics, collections, people and organisations that connect Indonesian cultural knowledge." },
    { property: "og:title", content: "Understand Indonesia — Indonesia Vibes" },
    { property: "og:description", content: "Explore connected Indonesian cultural knowledge through articles, topics, collections, people and organisations." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: UnderstandIndonesia,
});

function UnderstandIndonesia() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname.replace(/\/$/, "") !== "/understand-indonesia") return <Outlet />;
  const [format, setFormat] = useState<"All" | PublicFormat>("All");
  const [topic, setTopic] = useState("All");
  const [location, setLocation] = useState("All");
  const [recent, setRecent] = useState("All");
  const visible = useMemo(() => stories.filter((article) => {
    if (format !== "All" && publicFormat(article) !== format) return false;
    if (topic !== "All" && !article.topics?.includes(topic as never)) return false;
    if (location !== "All" && !article.placeIds.length) return false;
    if (recent === "Recently Published") {
      const date = new Date(article.publishedAt).getTime();
      if (Date.now() - date > 120 * 86_400_000) return false;
    }
    return true;
  }), [format, topic, location, recent]);
  const featured = stories.filter((article) => article.featured).slice(0, 3);

  return <>
    <PageHeader eyebrow="Understand Indonesia" title="Knowledge that connects" intro="Begin with an essential, go deeper into context, or follow a perspective across topics, people, organisations and places." />
    <div className="container-editorial py-14 md:py-20">
      {featured.length ? <section className="mb-16"><SectionHeading eyebrow="Featured" title="A place to begin" /><div className="mt-8 grid gap-8 md:grid-cols-3">{featured.map((article) => <StoryCard key={article.id} story={article} size="sm" />)}</div></section> : null}
      <FilterBar primary={[
        { id: "topic", label: "Topic", options: TOPICS.map((item) => item.id), value: topic === "All" ? null : topic, onChange: (value) => setTopic(value ?? "All"), allLabel: "All topics" },
        { id: "format", label: "Format", options: PUBLIC_FORMATS, value: format === "All" ? null : format, onChange: (value) => setFormat((value ?? "All") as typeof format), allLabel: "All formats" },
        { id: "location", label: "Location", options: ["Connected to a place"], value: location === "All" ? null : location, onChange: (value) => setLocation(value ?? "All"), allLabel: "All locations" },
        { id: "recent", label: "Published", options: ["Recently Published"], value: recent === "All" ? null : recent, onChange: (value) => setRecent(value ?? "All"), allLabel: "Any time" },
      ]} resultCount={visible.length} resultNoun={visible.length === 1 ? "article" : "articles"} />
      <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{visible.map((article) => <StoryCard key={article.id} story={article} size="sm" />)}</div>
      <section className="mt-20 border-t border-border pt-10"><SectionHeading eyebrow="Browse" title="Topics and curated journeys" /><div className="mt-7 grid gap-px border border-border bg-border md:grid-cols-2"><Link to="/understand-indonesia/topics" className="bg-background p-7 hover:bg-blush"><h3 className="text-xl font-medium text-ink">Topics</h3><p className="mt-2 text-sm text-muted-foreground">What is this about? Follow knowledge across the connected network.</p></Link><Link to="/understand-indonesia/collections" className="bg-background p-7 hover:bg-blush"><h3 className="text-xl font-medium text-ink">Collections</h3><p className="mt-2 text-sm text-muted-foreground">Editorial journeys that bring existing records together.</p></Link></div></section>
      <section className="mt-20 border-t border-border pt-10"><SectionHeading eyebrow="People & Organisations" title="Who carries the knowledge" action="/people-organisations" actionLabel="View all" /><div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{people.slice(0, 4).map((person) => <PersonCard key={person.id} person={person} size="sm" />)}</div></section>
      <section className="mt-20 border-t border-border pt-10"><SectionHeading eyebrow="Collections" title={collections[0]?.title ?? "Curated journeys"} action="/understand-indonesia/collections" actionLabel="All collections" /><p className="mt-4 max-w-2xl text-muted-foreground">{collections[0]?.dek}</p></section>
    </div>
  </>;
}