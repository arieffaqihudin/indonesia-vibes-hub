import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FilterBar } from "@/components/editorial/FilterBar";
import { PlaceCard } from "@/components/editorial/EntityCards";
import { PageHeader } from "@/components/editorial/Section";
import { eventLocationLabel, events, eventStatus, formatEventDates, places } from "@/data/content";

type View = "All" | "Events" | "Places";
export const Route = createFileRoute("/events-places")({ head: () => ({ meta: [
  { title: "Events & Places — Indonesia Vibes" }, { name: "description", content: "Find Indonesian cultural events and the places where culture is made, kept and experienced." },
  { property: "og:title", content: "Events & Places — Indonesia Vibes" }, { property: "og:description", content: "Find Indonesian cultural events and the places where culture is made, kept and experienced." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: EventsPlaces });
function EventsPlaces() {
  const [view, setView] = useState<View>("All"); const [query, setQuery] = useState(""); const [where, setWhere] = useState<string | null>(null);
  const q = query.toLowerCase();
  const visibleEvents = useMemo(() => events.filter((item) => `${item.title} ${eventLocationLabel(item)} ${item.type ?? ""}`.toLowerCase().includes(q) && (!where || (where === "Indonesia" ? eventLocationLabel(item).includes("Indonesia") : !eventLocationLabel(item).includes("Indonesia")))), [q, where]);
  const visiblePlaces = useMemo(() => places.filter((item) => `${item.name} ${item.region} ${item.country} ${item.type ?? ""}`.toLowerCase().includes(q) && (!where || (where === "Indonesia" ? item.country === "Indonesia" : item.country !== "Indonesia"))), [q, where]);
  return <><PageHeader eyebrow="Experience" title="Events & Places" intro="What is happening, and the places that give the work its setting, history and meaning." /><div className="border-b border-border"><div className="container-editorial flex gap-1" role="tablist">{(["All", "Events", "Places"] as View[]).map((item) => <button key={item} type="button" role="tab" aria-selected={view === item} onClick={() => setView(item)} className={`min-h-11 border-b-2 px-4 text-sm font-medium ${view === item ? "border-primary text-ink" : "border-transparent text-muted-foreground"}`}>{item}</button>)}</div></div><FilterBar search={{ value: query, onChange: setQuery, placeholder: "Event, place, city or country" }} primary={[{ id: "where", label: "Where", options: ["Indonesia", "Around the world"], value: where, onChange: setWhere, allLabel: "Everywhere" }]} resultCount={(view === "Places" ? 0 : visibleEvents.length) + (view === "Events" ? 0 : visiblePlaces.length)} resultNoun="results" /><div className="container-editorial py-14">
    {view !== "Places" ? <section><h2 className="display-3 text-ink">Events</h2><ul className="mt-6 divide-y divide-border border-y border-border">{visibleEvents.map((item) => <li key={item.id}><Link to="/events/$slug" params={{ slug: item.slug }} className="grid gap-2 py-5 md:grid-cols-[1fr_auto]"><span><span className="eyebrow text-primary">{eventStatus(item)} · {item.type ?? "Event"}</span><span className="mt-2 block text-lg font-medium text-ink">{item.title}</span><span className="mt-1 block text-sm text-muted-foreground">{eventLocationLabel(item)}</span></span><span className="text-sm text-muted-foreground">{formatEventDates(item)}</span></Link></li>)}</ul></section> : null}
    {view !== "Events" ? <section className={view === "All" ? "mt-16 border-t border-border pt-10" : ""}><h2 className="display-3 text-ink">Places</h2><ul className="mt-7 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{visiblePlaces.map((item) => <li key={item.id}><PlaceCard place={item} /></li>)}</ul></section> : null}
  </div></>;
}