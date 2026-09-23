import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/editorial/Section";
import { stories } from "@/data/content";
import { TOPICS } from "@/lib/topics";

export const Route = createFileRoute("/explore/topics/")({
  head: () => ({ meta: [{ title: "Topics — Indonesia Vibes" }, { name: "description", content: "Explore connected cultural knowledge by topic." }] }),
  component: TopicsPage,
});
function TopicsPage() {
  return <><PageHeader eyebrow="Explore" title="Topics" intro="Choose a subject, then move between essentials, deeper context and informed perspectives." /><div className="container-editorial py-14 md:py-18"><ul className="grid gap-x-10 border-t border-border sm:grid-cols-2 lg:grid-cols-3">{TOPICS.map((topic) => { const count = stories.filter((story) => story.topics?.includes(topic.id)).length; return <li key={topic.id} className="border-b border-border py-7"><Link to="/explore/topics/$slug" params={{ slug: topic.slug }} className="group block"><div className="flex items-start justify-between gap-4"><h2 className="text-xl font-medium text-ink group-hover:text-primary">{topic.id}</h2><span className="text-xs text-muted-foreground">{count}</span></div><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{topic.intro}</p></Link></li>; })}</ul></div></>;
}