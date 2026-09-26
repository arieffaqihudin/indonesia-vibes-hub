import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";

import { FilterBar } from "@/components/editorial/FilterBar";
import { forms, people } from "@/data/content";
import { institutions } from "@/data/institutions";
import { TOPICS } from "@/lib/topics";
import { cn } from "@/lib/utils";
import { pageIdentity } from "@/lib/public-seo";

const CATEGORIES = [
  { id: "people", label: "People", intro: "Individual artists, practitioners, researchers, curators and cultural figures." },
  { id: "communities", label: "Communities", intro: "Collectives and communities that practise, preserve and develop cultural traditions." },
  { id: "organisations", label: "Institutions & Organisations", intro: "Museums, universities, archives, research centres and cultural organisations." },
] as const;
type Category = (typeof CATEGORIES)[number]["id"];

export const Route = createFileRoute("/understand-indonesia/people-organisations")({
  validateSearch: (search: Record<string, unknown>): { type?: Category } =>
    CATEGORIES.some((c) => c.id === search["type"]) ? { type: search["type"] as Category } : {},
  head: ({ search }) => ({ meta: [
    { title: "People & Organisations — Indonesia Vibes" },
    { name: "description", content: "Explore the people, communities and institutions shaping Indonesian culture." },
    { property: "og:title", content: "People & Organisations — Indonesia Vibes" },
    { property: "og:description", content: "Explore the people, communities and institutions shaping Indonesian culture." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    ...(search.type ? [{ name: "robots", content: "noindex, follow" }] : []),
    ...pageIdentity("/understand-indonesia/people-organisations").meta,
  ], links: pageIdentity("/understand-indonesia/people-organisations").links }),
  component: Directory,
});

const formName = (ids: string[]) => ids.map((id) => forms.find((f) => f.id === id)?.name).filter(Boolean)[0];

interface Item { id: string; category: Category; name: string; image: string; line: string; tags: string; location: string; text: string; themes: string[]; to: "/people/$slug" | "/institutions/$slug"; slug: string; cta: string }

const ITEMS: Item[] = [
  ...people.map((p): Item => ({
    id: p.id, category: p.entity === "community" ? "communities" : "people", name: p.name, image: p.image,
    line: p.entity === "community" ? p.based : p.role,
    tags: [formName(p.formIds), p.themes[0]].filter(Boolean).join(" · "), location: p.based,
    text: p.intro ?? p.bio, themes: p.themes, to: "/people/$slug", slug: p.slug,
    cta: p.entity === "community" ? "View Community" : "View Profile",
  })),
  ...institutions.map((i): Item => ({
    id: i.id, category: "organisations", name: i.name, image: i.image, line: `${i.type} · ${i.city}`,
    tags: [formName(i.formIds), i.themes[0]].filter(Boolean).join(" · "), location: `${i.city}, ${i.country}`,
    text: i.profile, themes: i.themes, to: "/institutions/$slug", slug: i.slug, cta: "View Organisation",
  })),
];

function Directory() {
  const { type } = Route.useSearch();
  const navigate = useNavigate({ from: "/understand-indonesia/people-organisations" });
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string | null>(null);
  const setType = (next?: Category) => navigate({ search: next ? { type: next } : {}, replace: true, resetScroll: false });
  const visible = useMemo(() => ITEMS.filter((item) => {
    if (type && item.category !== type) return false;
    if (topic && !item.themes.includes(topic)) return false;
    const q = query.trim().toLowerCase();
    return !q || `${item.name} ${item.line} ${item.tags} ${item.location}`.toLowerCase().includes(q);
  }), [type, topic, query]);
  const count = (id: Category) => ITEMS.filter((item) => item.category === id).length;

  return <>
    <header className="border-b border-border bg-sand">
      <div className="container-editorial py-12 md:py-16">
        <p className="eyebrow text-primary"><Link to="/understand-indonesia" className="hover:underline">Understand Indonesia</Link> / People & Organisations</p>
        <h1 className="display-1 mt-4 text-ink">People & Organisations</h1>
        <p className="standfirst mt-4 max-w-2xl">Explore the people, communities and institutions shaping Indonesian culture.</p>
        <ul className="mt-10 grid gap-px border border-border bg-border md:grid-cols-3">
          {CATEGORIES.map((c) => <li key={c.id}><button type="button" onClick={() => setType(type === c.id ? undefined : c.id)} aria-pressed={type === c.id} className={cn("group h-full w-full bg-background p-5 text-left transition-colors hover:bg-blush md:p-6", type === c.id && "bg-blush")}>
            <span className="eyebrow text-primary">{c.label} · {count(c.id)}</span>
            <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{c.intro}</span>
          </button></li>)}
        </ul>
      </div>
    </header>
    <div role="tablist" aria-label="Category" className="container-editorial -mb-px flex gap-1 overflow-x-auto border-b border-border pt-4 whitespace-nowrap">
      {[{ id: undefined, label: "All" }, ...CATEGORIES].map((c) => {
        const active = type === c.id;
        return <button key={c.label} role="tab" aria-selected={active} type="button" onClick={() => setType(c.id)} className={cn("inline-flex min-h-11 items-center border-b-2 px-3 text-sm font-medium", active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-ink")}>{c.label}</button>;
      })}
    </div>
    <FilterBar search={{ value: query, onChange: setQuery, placeholder: "Name, practice, city or organisation" }} primary={[
      { id: "topic", label: "Topic", options: TOPICS.map((t) => t.id), value: topic, onChange: setTopic, allLabel: "All topics" },
    ]} resultCount={visible.length} resultNoun={visible.length === 1 ? "profile" : "profiles"} />
    <main className="container-editorial py-12">
      {visible.length ? <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => <li key={item.id}><Link to={item.to} params={{ slug: item.slug }} className="group grid grid-cols-[5rem_minmax(0,1fr)] gap-4 border-t border-border pt-5">
          <img src={item.image} alt="" loading="lazy" className={cn("aspect-square w-20 object-cover", item.category === "people" && "rounded-full")} />
          <span className="min-w-0">
            <span className="eyebrow text-muted-foreground">{CATEGORIES.find((c) => c.id === item.category)!.label}</span>
            <span className="mt-1 block text-lg leading-snug font-medium text-ink group-hover:text-primary">{item.name}</span>
            <span className="mt-1 block text-sm text-muted-foreground">{item.line}</span>
            {item.tags ? <span className="mt-1 block text-xs text-primary">{item.tags}</span> : null}
            <span className="mt-2 line-clamp-2 block text-sm leading-relaxed text-muted-foreground">{item.text}</span>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">{item.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></span>
          </span>
        </Link></li>)}
      </ul> : <p className="py-16 text-center text-muted-foreground">No profiles match those filters. <Link to="/contact" search={{}} className="text-primary underline">Suggest one</Link>.</p>}
    </main>
  </>;
}
