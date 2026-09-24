import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/editorial/Section";
import { stories } from "@/data/content";
import { TOPICS } from "@/lib/topics";

export const Route = createFileRoute("/understand-indonesia/topics")({
  head: () => ({ meta: [
    { title: "Topics — Indonesia Vibes" }, { name: "description", content: "Browse Indonesian cultural knowledge by topic." },
    { property: "og:title", content: "Topics — Indonesia Vibes" }, { property: "og:description", content: "Browse Indonesian cultural knowledge by topic." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Topics,
});
function Topics() { return <><PageHeader eyebrow="Understand Indonesia" title="Topics" intro="Choose what you want to understand, then move between essentials, deeper context, perspectives and connected activity." /><div className="container-editorial py-14 md:py-20"><ul className="grid gap-x-10 border-t border-border sm:grid-cols-2 lg:grid-cols-3">{TOPICS.map((topic) => <li key={topic.id} className="border-b border-border py-7"><Link to="/understand-indonesia/topics/$slug" params={{ slug: topic.slug }} className="group block"><span className="flex justify-between gap-4"><span className="text-xl font-medium text-ink group-hover:text-primary">{topic.id}</span><span className="text-xs text-muted-foreground">{stories.filter((story) => story.topics?.includes(topic.id)).length}</span></span><span className="mt-3 block text-sm leading-relaxed text-muted-foreground">{topic.intro}</span></Link></li>)}</ul></div></>; }