import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";

import { FilterBar } from "@/components/editorial/FilterBar";
import { HERITAGE_TYPES, heritageRecognition, heritageRecords, heritageRegion, heritageType } from "@/lib/heritage";

export const Route = createFileRoute("/understand-indonesia/heritage/")({
  head: () => ({ meta: [
    { title: "Heritage — Understand Indonesia — Indonesia Vibes" },
    { name: "description", content: "Browse Indonesian cultural heritage — living traditions, crafts, performance and knowledge — each with one page that connects everything we know." },
    { property: "og:title", content: "Heritage — Indonesia Vibes" },
    { property: "og:description", content: "What cultural heritage can you explore? Gamelan, Wayang, Phinisi, Sumba ikat and more." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: HeritageCatalogue,
});

function HeritageCatalogue() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<string | null>(null);
  const regions = useMemo(() => [...new Set(heritageRecords.map((item) => heritageRegion(item)?.region).filter(Boolean) as string[])], []);
  const visible = heritageRecords.filter((item) => {
    const needle = query.trim().toLowerCase();
    if (needle && !`${item.name} ${item.summary} ${(item.aliases ?? []).join(" ")}`.toLowerCase().includes(needle)) return false;
    if (type && heritageType(item) !== type) return false;
    if (region && heritageRegion(item)?.region !== region) return false;
    if (recognition === "UNESCO-recognised" && !heritageRecognition(item)) return false;
    return true;
  });

  return <>
    <header className="border-b border-border bg-sand">
      <div className="container-editorial grid gap-6 py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:items-end md:py-16">
        <div>
          <p className="eyebrow text-primary"><Link to="/understand-indonesia" className="hover:underline">Understand Indonesia</Link> / Heritage</p>
          <h1 className="display-1 mt-4 text-ink">Heritage</h1>
          <p className="standfirst mt-4 max-w-2xl">Living traditions, crafts, performance and knowledge carried across the archipelago. Each has one page that brings together everything we know and connect about it.</p>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground md:border-l md:border-border md:pl-6">Heritage here is not limited to UNESCO listings. It includes tangible and intangible heritage that meets our editorial standards; recognition is shown where it applies.</p>
      </div>
    </header>
    <FilterBar search={{ value: query, onChange: setQuery, placeholder: "Search Heritage" }} primary={[
      { id: "type", label: "Type", options: [...HERITAGE_TYPES], value: type, onChange: setType, allLabel: "All types" },
      { id: "region", label: "Region", options: regions, value: region, onChange: setRegion, allLabel: "All regions" },
      { id: "recognition", label: "Recognition", options: ["UNESCO-recognised"], value: recognition, onChange: setRecognition, allLabel: "Any recognition" },
    ]} resultCount={visible.length} resultNoun={visible.length === 1 ? "heritage record" : "heritage records"} />
    <main className="container-editorial py-12 md:py-16">
      {visible.length ? <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => {
          const where = heritageRegion(item);
          return <li key={item.id}>
            <Link to="/understand-indonesia/heritage/$slug" params={{ slug: item.slug }} className="group block">
              <div className="relative overflow-hidden bg-muted">
                <img src={item.image} alt={item.name} width={900} height={1100} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                {heritageRecognition(item) ? <span className="absolute top-3 left-3 bg-background/95 px-2 py-1 text-[0.65rem] font-semibold tracking-[0.12em] text-primary uppercase">UNESCO</span> : null}
              </div>
              <p className="eyebrow mt-4 text-muted-foreground">{heritageType(item)}{where ? ` · ${where.label}` : ""}</p>
              <h2 className="mt-2 text-2xl leading-tight font-medium text-ink group-hover:text-primary">{item.name}</h2>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
              <span className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary">Explore Heritage <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></span>
            </Link>
          </li>;
        })}
      </ul> : <div className="py-20 text-center"><p className="text-xl font-medium text-ink">No Heritage matches these filters.</p><button type="button" onClick={() => { setQuery(""); setType(null); setRegion(null); setRecognition(null); }} className="mt-3 min-h-11 text-sm font-medium text-primary">Clear filters</button></div>}
    </main>
  </>;
}
