import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";

import { FilterBar } from "@/components/editorial/FilterBar";
import { PageHeader } from "@/components/editorial/Section";
import { formatDate, stories } from "@/data/content";
import { attribution } from "@/lib/attribution";
import { publicFormat, PUBLIC_FORMATS, type PublicFormat } from "@/lib/editorial";
import { TOPICS } from "@/lib/topics";
import { heritageRecords, heritageType } from "@/lib/heritage";
import { pageIdentity } from "@/lib/public-seo";

export const Route = createFileRoute("/understand-indonesia")({
  head: () => ({ meta: [
    { title: "Understand Indonesia — Indonesia Vibes" },
    { name: "description", content: "Articles, topics, collections, people and organisations that connect Indonesian cultural knowledge." },
    { property: "og:title", content: "Understand Indonesia — Indonesia Vibes" },
    { property: "og:description", content: "Explore connected Indonesian cultural knowledge through articles, topics, collections, people and organisations." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    ...pageIdentity("/understand-indonesia").meta,
  ], links: pageIdentity("/understand-indonesia").links }),
  component: UnderstandIndonesia,
});

function UnderstandIndonesia() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname.replace(/\/$/, "") !== "/understand-indonesia") return <Outlet />;
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState<PublicFormat | null>(null);
  const [sort, setSort] = useState<"Latest" | "Oldest">("Latest");
  const visible = useMemo(() => stories.filter((article) => {
    const needle = query.trim().toLowerCase();
    if (needle && !`${article.title} ${article.dek} ${article.author ?? ""} ${article.topics?.join(" ") ?? ""}`.toLowerCase().includes(needle)) return false;
    if (format && publicFormat(article) !== format) return false;
    if (topic && !article.topics?.includes(topic as never)) return false;
    return true;
  }).sort((a, b) => (sort === "Oldest" ? 1 : -1) * (new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())), [query, format, sort, topic]);

  return <>
    <PageHeader eyebrow="Understand Indonesia" title="Indonesia, Told Through Culture" intro="Discover the culture, ideas and people that shape Indonesia — and the stories Indonesia brings to the world." />
    <FilterBar search={{ value: query, onChange: setQuery, placeholder: "Search Articles" }} primary={[
      { id: "topic", label: "Topic", options: TOPICS.map((item) => item.id), value: topic || null, onChange: (value) => setTopic(value ?? ""), allLabel: "All topics" },
      { id: "format", label: "Format", options: PUBLIC_FORMATS, value: format, onChange: (value) => setFormat(value as PublicFormat | null), allLabel: "All formats" },
    ]} sort={{ options: ["Latest", "Oldest"], value: sort, onChange: (value) => setSort(value === "Oldest" ? "Oldest" : "Latest") }} resultCount={visible.length} resultNoun={visible.length === 1 ? "article" : "articles"} />
    <section aria-labelledby="explore-heritage" className="border-b border-border bg-sand">
      <div className="container-editorial py-10">
        <div className="flex items-end justify-between gap-4"><div><p className="eyebrow text-primary">Explore Heritage</p><h2 id="explore-heritage" className="mt-2 text-2xl font-medium text-ink">Cultural heritage, one page each</h2></div><Link to="/understand-indonesia/heritage" className="inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-medium text-primary">View All Heritage <ArrowRight className="h-4 w-4" /></Link></div>
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">{heritageRecords.slice(0, 4).map((item) => <li key={item.id}><Link to="/understand-indonesia/heritage/$slug" params={{ slug: item.slug }} className="group block"><img src={item.image} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" /><span className="mt-2 block text-xs text-muted-foreground">{heritageType(item)}</span><span className="block font-medium text-ink group-hover:text-primary">{item.name}</span></Link></li>)}</ul>
      </div>
    </section>
    <main className="container-editorial py-12 md:py-16">
      <div className="flex items-end justify-between gap-4 border-b border-border pb-5"><div><p className="eyebrow text-primary">Browse Articles</p><h2 className="mt-2 text-3xl font-medium text-ink">All Articles</h2></div><p className="text-sm text-muted-foreground">{visible.length} published</p></div>
      {visible.length ? <div className="divide-y divide-border">{visible.map((article) => {
        const credit = attribution({ ...(article.contentSource ? { contentSource: article.contentSource } : {}), ...(article.curationModel ? { curationModel: article.curationModel } : {}), ...(article.author ? { author: article.author } : {}), ...(article.authorRole ? { authorRole: article.authorRole } : {}), ...(article.sourceAttribution ? { sourceOrganisation: article.sourceAttribution } : {}), ...(article.coContributors ? { coContributors: article.coContributors } : {}) });
        return <article key={article.id}><Link to="/stories/$slug" params={{ slug: article.slug }} className="group grid gap-5 py-7 sm:grid-cols-[11rem_minmax(0,1fr)_auto] md:gap-7 md:py-9"><img src={article.image} alt={article.imageAlt} className="aspect-[4/3] w-full object-cover" /><span className="min-w-0"><span className="eyebrow text-primary">{article.topics?.[0] ?? "Indonesia"} · {publicFormat(article)}</span><span className="mt-2 block text-2xl leading-tight font-medium text-ink group-hover:text-primary md:text-3xl">{article.title}</span><span className="mt-3 block max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">{article.dek}</span><span className="mt-4 block text-xs text-muted-foreground">{credit.primary} · {formatDate(article.publishedAt)}</span></span><ArrowRight className="hidden h-5 w-5 self-center text-primary transition-transform group-hover:translate-x-1 sm:block" aria-hidden /></Link></article>;
      })}</div> : <div className="py-20 text-center"><p className="text-xl font-medium text-ink">No Articles match these filters.</p><button type="button" onClick={() => { setQuery(""); setTopic(""); setFormat(null); setSort("Latest"); }} className="mt-3 min-h-11 text-sm font-medium text-primary">Clear filters</button></div>}
    </main>
  </>;
}