import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/editorial/Section";
import { collections } from "@/data/content";
export const Route = createFileRoute("/understand-indonesia/collections")({ head: () => ({ meta: [
  { title: "Collections — Indonesia Vibes" }, { name: "description", content: "Curated journeys through connected Indonesian culture." },
  { property: "og:title", content: "Collections — Indonesia Vibes" }, { property: "og:description", content: "Curated journeys through connected Indonesian culture." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Collections });
function Collections() { return <><PageHeader eyebrow="Understand Indonesia" title="Collections" intro="Editorial journeys that connect articles, topics, people, organisations, events, places and collaborations without duplicating them." /><div className="container-editorial py-14 md:py-20"><ul className="grid gap-10 md:grid-cols-2">{collections.map((item) => <li key={item.id}><Link to="/collections/$slug" params={{ slug: item.slug }} className="group block"><img src={item.image} alt="" className="aspect-[16/9] w-full object-cover" /><h2 className="mt-5 text-2xl font-medium text-ink group-hover:text-primary">{item.title}</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.dek}</p><p className="mt-3 text-xs text-muted-foreground">{item.storyIds.length} connected articles</p></Link></li>)}</ul></div></>; }