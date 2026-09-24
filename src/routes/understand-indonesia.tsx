import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";

import { FilterBar } from "@/components/editorial/FilterBar";
import { PageHeader } from "@/components/editorial/Section";
import { formatDate, stories } from "@/data/content";
import { attribution } from "@/lib/attribution";
import { publicFormat, PUBLIC_FORMATS, type PublicFormat } from "@/lib/editorial";
import { TOPICS } from "@/lib/topics";

export const Route = createFileRoute("/understand-indonesia")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
    topic: typeof search.topic === "string" ? search.topic : "",
    format: typeof search.format === "string" ? search.format : "",
    sort: typeof search.sort === "string" ? search.sort : "Latest",
  }),
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
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/understand-indonesia" });
  const [query, setQuery] = useState(search.q);
  const safeFormat = PUBLIC_FORMATS.includes(search.format as PublicFormat) ? search.format as PublicFormat : null;
  const safeSort = search.sort === "Oldest" ? "Oldest" : "Latest";
  const setSearch = (patch: Partial<typeof search>) => navigate({ search: (current) => ({ ...current, ...patch }), replace: true });
  const visible = useMemo(() => stories.filter((article) => {
    const needle = query.trim().toLowerCase();
    if (needle && !`${article.title} ${article.dek} ${article.author ?? ""} ${article.topics?.join(" ") ?? ""}`.toLowerCase().includes(needle)) return false;
    if (safeFormat && publicFormat(article) !== safeFormat) return false;
    if (search.topic && !article.topics?.includes(search.topic as never)) return false;
    return true;
  }).sort((a, b) => (safeSort === "Oldest" ? 1 : -1) * (new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())), [query, safeFormat, safeSort, search.topic]);

  return <>
    <PageHeader eyebrow="Understand Indonesia" title="Understand Indonesia" intro="Stories, ideas and perspectives to help you discover and understand Indonesia." />
    <FilterBar search={{ value: query, onChange: (value) => { setQuery(value); setSearch({ q: value }); }, placeholder: "Search Articles" }} primary={[
      { id: "topic", label: "Topic", options: TOPICS.map((item) => item.id), value: search.topic || null, onChange: (value) => setSearch({ topic: value ?? "" }), allLabel: "All topics" },
      { id: "format", label: "Format", options: PUBLIC_FORMATS, value: safeFormat, onChange: (value) => setSearch({ format: value ?? "" }), allLabel: "All formats" },
    ]} sort={{ options: ["Latest", "Oldest"], value: safeSort, onChange: (value) => setSearch({ sort: value }) }} resultCount={visible.length} resultNoun={visible.length === 1 ? "article" : "articles"} />
    <main className="container-editorial py-12 md:py-16">
      <div className="flex items-end justify-between gap-4 border-b border-border pb-5"><div><p className="eyebrow text-primary">Browse Articles</p><h2 className="mt-2 text-3xl font-medium text-ink">All Articles</h2></div><p className="text-sm text-muted-foreground">{visible.length} published</p></div>
      {visible.length ? <div className="divide-y divide-border">{visible.map((article) => {
        const credit = attribution({ ...(article.contentSource ? { contentSource: article.contentSource } : {}), ...(article.curationModel ? { curationModel: article.curationModel } : {}), ...(article.author ? { author: article.author } : {}), ...(article.authorRole ? { authorRole: article.authorRole } : {}), ...(article.sourceAttribution ? { sourceOrganisation: article.sourceAttribution } : {}), ...(article.coContributors ? { coContributors: article.coContributors } : {}) });
        return <article key={article.id}><Link to="/stories/$slug" params={{ slug: article.slug }} className="group grid gap-5 py-7 sm:grid-cols-[11rem_minmax(0,1fr)_auto] md:gap-7 md:py-9"><img src={article.image} alt={article.imageAlt} className="aspect-[4/3] w-full object-cover" /><span className="min-w-0"><span className="eyebrow text-primary">{article.topics?.[0] ?? "Indonesia"} · {publicFormat(article)}</span><span className="mt-2 block text-2xl leading-tight font-medium text-ink group-hover:text-primary md:text-3xl">{article.title}</span><span className="mt-3 block max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">{article.dek}</span><span className="mt-4 block text-xs text-muted-foreground">{credit.primary} · {formatDate(article.publishedAt)}</span></span><ArrowRight className="hidden h-5 w-5 self-center text-primary transition-transform group-hover:translate-x-1 sm:block" aria-hidden /></Link></article>;
      })}</div> : <div className="py-20 text-center"><p className="text-xl font-medium text-ink">No Articles match these filters.</p><button type="button" onClick={() => { setQuery(""); setSearch({ q: "", topic: "", format: "", sort: "Latest" }); }} className="mt-3 min-h-11 text-sm font-medium text-primary">Clear filters</button></div>}
    </main>
  </>;
}