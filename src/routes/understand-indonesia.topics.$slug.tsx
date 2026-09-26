import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/editorial/Section";
import { StoryCard } from "@/components/editorial/StoryCard";
import { events, collections, people, stories } from "@/data/content";
import { collaborations } from "@/data/collaborations";
import { institutions } from "@/data/institutions";
import { PUBLIC_FORMATS, publicFormat } from "@/lib/editorial";
import { topicBySlug } from "@/lib/topics";

export const Route = createFileRoute("/understand-indonesia/topics/$slug")({
  loader: ({ params }) => { const topic = topicBySlug(params.slug); if (!topic) throw notFound(); return topic; },
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.id ?? "Topic"} — Indonesia Vibes` }, { name: "description", content: loaderData?.intro ?? "Explore connected Indonesian cultural knowledge." },
    { property: "og:title", content: `${loaderData?.id ?? "Topic"} — Indonesia Vibes` }, { property: "og:description", content: loaderData?.intro ?? "Explore connected Indonesian cultural knowledge." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Topic,
});
function Topic() {
  const topic = Route.useLoaderData();
  const articles = stories.filter((item) => item.topics?.includes(topic.id));
  const relatedPeople = people.filter((item) => item.themes.includes(topic.id)).slice(0, 4);
  const relatedOrgs = institutions.filter((item) => item.themes.includes(topic.id)).slice(0, 4);
  const relatedEvents = events.filter((item) => item.formIds.some((id) => articles.some((article) => article.formIds.includes(id)))).slice(0, 4);
  const relatedCollections = collections.filter((item) => item.storyIds.some((id) => articles.some((article) => article.id === id)));
  const relatedCollaborations = collaborations.filter((item) => item.themes.includes(topic.id)).slice(0, 4);
  return <><PageHeader eyebrow="Topic" title={topic.id} intro={topic.intro} /><div className="container-editorial py-14 md:py-20">
    {PUBLIC_FORMATS.map((format) => { const items = articles.filter((article) => publicFormat(article) === format); return items.length ? <section key={format} className="mb-14 border-t border-border pt-7"><h2 className="display-3 text-ink">{format}</h2><div className="mt-7 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{items.map((article) => <StoryCard key={article.id} story={article} size="sm" />)}</div></section> : null; })}
    {(relatedPeople.length || relatedOrgs.length) ? <Related title="People & Organisations" to="/understand-indonesia/people-organisations" items={[...relatedPeople.map((item) => item.name), ...relatedOrgs.map((item) => item.name)]} /> : null}
    {relatedEvents.length ? <Related title="Related Events & Places" to="/events-places" items={relatedEvents.map((item) => item.title)} /> : null}
    {relatedCollections.length ? <Related title="Related Collections" to="/understand-indonesia/collections" items={relatedCollections.map((item) => item.title)} /> : null}
    {relatedCollaborations.length ? <Related title="Related Collaborations" to="/collaborate" items={relatedCollaborations.map((item) => item.title)} /> : null}
    {articles.some((article) => article.sources?.length) ? <section className="mt-14 border-t border-border pt-7"><h2 className="display-3 text-ink">Sources and references</h2><p className="mt-3 text-sm text-muted-foreground">References are listed on each connected article so their context remains clear.</p></section> : null}
  </div></>;
}
function Related({ title, to, items }: { title: string; to: "/understand-indonesia/people-organisations" | "/events-places" | "/understand-indonesia/collections" | "/collaborate"; items: string[] }) { return <section className="mt-14 border-t border-border pt-7"><div className="flex items-end justify-between gap-4"><h2 className="display-3 text-ink">{title}</h2><Link to={to} className="link-underline text-sm text-primary">View all</Link></div><ul className="mt-5 grid gap-px border border-border bg-border sm:grid-cols-2">{items.map((item) => <li key={item} className="bg-background p-5 text-sm font-medium text-ink">{item}</li>)}</ul></section>; }