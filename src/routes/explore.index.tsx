import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FilterBar } from "@/components/editorial/FilterBar";
import { PageHeader } from "@/components/editorial/Section";
import { StoryCard } from "@/components/editorial/StoryCard";
import { stories } from "@/data/content";
import { publicFormat, PUBLIC_FORMATS, type PublicFormat } from "@/lib/editorial";
import { TOPICS } from "@/lib/topics";

export const Route = createFileRoute("/explore/")({
  head: () => ({ meta: [{ title: "Explore Indonesia — Indonesia Vibes" }, { name: "description", content: "Explore Indonesia through essentials, deep dives, perspectives and connected cultural topics." }] }),
  component: ExplorePage,
});

function ExplorePage() {
  const [format, setFormat] = useState<"All" | PublicFormat>("All");
  const [topic, setTopic] = useState("All");
  const visible = useMemo(() => stories.filter((story) => (format === "All" || publicFormat(story) === format) && (topic === "All" || story.topics?.includes(topic as never))), [format, topic]);
  const usedTopics = TOPICS.filter((entry) => stories.some((story) => story.topics?.includes(entry.id)));

  return <>
    <PageHeader eyebrow="Explore" title="Understand Indonesia through connected cultural knowledge" intro="Begin with a clear essential, go deeper into meaning and context, or follow a perspective across people, places and ideas." />
    <div className="container-editorial py-12 md:py-16">
      <div className="mb-10 flex flex-wrap gap-3 text-sm"><Link to="/explore/topics" className="link-underline font-medium text-primary">Browse all topics</Link><span aria-hidden className="text-border">/</span><Link to="/explore/collections" className="link-underline font-medium text-primary">View curated collections</Link></div>
      <FilterBar primary={[
        { id: "format", label: "Format", options: PUBLIC_FORMATS, value: format === "All" ? null : format, onChange: (value) => setFormat((value ?? "All") as typeof format), allLabel: "All formats" },
        { id: "topic", label: "Topic", options: usedTopics.map((entry) => entry.id), value: topic === "All" ? null : topic, onChange: (value) => setTopic(value ?? "All"), allLabel: "All topics" },
      ]} resultCount={visible.length} resultNoun={visible.length === 1 ? "item" : "items"} />
      <div className="list-swap mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{visible.map((story) => <StoryCard key={story.id} story={story} size="sm" />)}</div>
    </div>
  </>;
}