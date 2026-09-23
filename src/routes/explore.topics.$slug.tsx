import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/editorial/Section";
import { StoryCard } from "@/components/editorial/StoryCard";
import { stories } from "@/data/content";
import { PUBLIC_FORMATS, publicFormat } from "@/lib/editorial";
import { topicBySlug } from "@/lib/topics";

export const Route = createFileRoute("/explore/topics/$slug")({
  loader: ({ params }) => {
    const topic = topicBySlug(params.slug);
    if (!topic) throw notFound();
    return topic;
  },
  head: ({ loaderData: topic }) => ({ meta: [{ title: `${topic?.id ?? "Topic"} — Indonesia Vibes` }, { name: "description", content: topic?.intro ?? "Explore Indonesia by topic." }] }),
  component: TopicPage,
});
function TopicPage() {
  const topic = Route.useLoaderData();
  const related = stories.filter((story) => story.topics?.includes(topic.id));
  return <><PageHeader eyebrow="Topic" title={topic.id} intro={topic.intro} /><div className="container-editorial py-14 md:py-18">{PUBLIC_FORMATS.map((format) => { const items = related.filter((story) => publicFormat(story) === format); if (!items.length) return null; return <section key={format} className="mb-16 border-t border-border pt-7"><div className="grid gap-8 lg:grid-cols-[15rem_1fr]"><div><p className="eyebrow text-primary">{format}</p><p className="mt-3 text-sm text-muted-foreground">{format === "Essentials" ? "A clear place to begin." : format === "Deep Dive" ? "Meaning, context and connected knowledge." : "Arguments and interpretations for wider exchange."}</p></div><div className="grid gap-8 sm:grid-cols-2">{items.map((story) => <StoryCard key={story.id} story={story} size="sm" />)}</div></div></section>; })}{!related.length ? <p className="max-w-xl text-muted-foreground">This topic is part of the editorial taxonomy. Connected publishing is in preparation.</p> : null}</div></>;
}