import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { stories } from "@/data/content";
import { TOPIC_CATEGORIES, useTopics, type TopicCategory } from "@/lib/topics";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/understand-indonesia/topics/")({
  head: () => ({ meta: [
    { title: "Explore Indonesia by Topic — Indonesia Vibes" },
    { name: "description", content: "Browse a searchable catalogue of Indonesian cultural subjects, from music and textiles to maritime culture and cinema." },
    { property: "og:title", content: "Explore Indonesia by Topic — Indonesia Vibes" },
    { property: "og:description", content: "A clear cultural catalogue of the subjects shaping Indonesia." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Topics,
});

type CategoryFilter = "All" | TopicCategory;

function Topics() {
  const [topics] = useTopics();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return topics.filter((topic) => topic.status === "Published")
      .filter((topic) => category === "All" || topic.category === category)
      .filter((topic) => !needle || [topic.id, topic.intro, ...topic.aliases].join(" ").toLowerCase().includes(needle));
  }, [topics, category, query]);

  return (
    <>
      <header className="border-b border-border bg-sand">
        <div className="container-editorial grid gap-7 py-10 md:grid-cols-[minmax(0,1fr)_minmax(18rem,26rem)] md:items-end md:py-14">
          <div>
            <p className="eyebrow text-primary">Understand Indonesia / Cultural catalogue</p>
            <h1 className="mt-4 text-[clamp(2.4rem,5vw,4.5rem)] leading-[1] font-medium text-ink">Explore Indonesia by Topic</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">From music and textiles to maritime culture, cinema, food, architecture and living traditions.</p>
          </div>
          <label className="relative block border-b border-ink/30 pb-2 focus-within:border-primary">
            <span className="sr-only">Search topics</span>
            <Search aria-hidden className="absolute top-1 left-0 h-4 w-4 text-muted-foreground" />
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search topics..." className="w-full bg-transparent pl-7 text-sm text-ink outline-none placeholder:text-muted-foreground" />
          </label>
        </div>
      </header>

      <main className="container-editorial py-10 md:py-14">
        <div className="scroll-strip flex gap-1 border-b border-border" role="group" aria-label="Filter topics by category">
          {(["All", ...TOPIC_CATEGORIES] as CategoryFilter[]).map((item) => (
            <Button key={item} type="button" variant="ghost" onClick={() => setCategory(item)} aria-pressed={category === item} className={cn("h-11 shrink-0 rounded-none border-b-2 px-3 text-xs", category === item ? "border-primary text-ink" : "border-transparent text-muted-foreground")}>
              {item}
            </Button>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-between border-b border-border pb-3 text-xs text-muted-foreground">
          <p>{visible.length} subject{visible.length === 1 ? "" : "s"}</p>
          {(query || category !== "All") ? <Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</Button> : null}
        </div>

        {visible.length ? (
          <ul className="grid border-l border-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((topic, index) => {
              const count = stories.filter((story) => story.topics?.includes(topic.id)).length;
              return (
                <li key={topic.id} className="border-r border-b border-border">
                  <Link to="/understand-indonesia/topics/$slug" params={{ slug: topic.slug }} className="group flex h-full min-h-52 flex-col p-5 transition-colors hover:bg-blush/45 md:p-6">
                    <span className="flex items-start justify-between gap-4">
                      <span className="text-[0.65rem] font-semibold text-muted-foreground tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                      <span className="max-w-32 text-right text-[0.62rem] font-semibold text-clay uppercase">{topic.category}</span>
                    </span>
                    <h2 className="mt-5 text-xl leading-tight font-semibold text-ink group-hover:text-primary">{topic.id}</h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{topic.intro}</p>
                    <span className="mt-auto flex items-center justify-between pt-6 text-xs font-medium text-ink">
                      <span>{count} article{count === 1 ? "" : "s"}</span>
                      <ArrowUpRight aria-hidden className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : <div className="border-b border-border py-16 text-center"><p className="text-lg font-medium text-ink">No topics match your search.</p><p className="mt-2 text-sm text-muted-foreground">Try another subject or clear the filters.</p></div>}
      </main>
    </>
  );
}