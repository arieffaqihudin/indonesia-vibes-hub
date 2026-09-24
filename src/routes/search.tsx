import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { SearchResultCard } from "@/components/editorial/EntityCards";
import { FilterChip } from "@/components/editorial/FilterBar";
import { popularSearches, searchAll, searchSuggestions } from "@/data/graph";
import type { SearchRecord } from "@/types/content";
import { faqText, publishedFor, useFaqs } from "@/lib/faq";

const TYPES: SearchRecord["type"][] = [
  "Essentials",
  "Deep Dive",
  "Perspectives",
  "Topics",
  "People & Organisations",
  "Places",
  "Events",
  "Collaborations",
];

interface SearchSearch {
  q: string;
  type?: SearchRecord["type"] | undefined;
}

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchSearch => {
    const parsed: SearchSearch = {
      q: typeof search["q"] === "string" ? search["q"] : "",
    };
    if (TYPES.includes(search["type"] as SearchRecord["type"])) {
      parsed.type = search["type"] as SearchRecord["type"];
    }
    return parsed;
  },
  head: () => ({
    meta: [
      { title: "Search — Indonesia Vibes" },
      {
        name: "description",
        content:
          "Search across articles, topics, collections, people, organisations, places, events and collaborations.",
      },
      { property: "og:title", content: "Search — Indonesia Vibes" },
      { property: "og:description", content: "One search across the whole Indonesia Vibes knowledge network." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q, type } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const [input, setInput] = useState(q);

  const hits = useMemo(() => searchAll(q), [q]);
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    hits.forEach((h) => map.set(h.record.type, (map.get(h.record.type) ?? 0) + 1));
    return map;
  }, [hits]);
  const visible = type ? hits.filter((h) => h.record.type === type) : hits;
  const suggestions = searchSuggestions();
  const [faqs] = useFaqs();
  const ql = q.trim().toLowerCase();
  const faqHits = ql && !type
    ? publishedFor(faqs, "faq").filter((f) => `${f.question} ${faqText(f.answer)} ${f.category}`.toLowerCase().includes(ql)).slice(0, 5)
    : [];

  const submit = (value: string) =>
    navigate({ search: (prev) => ({ ...prev, q: value }), replace: true });

  return (
    <>
      <header className="wave-field border-b border-border bg-sand">
        <div className="container-editorial py-16 md:py-20">
          <h1 className="display-1 text-ink">Search</h1>
          <p className="standfirst mt-5 max-w-2xl">
             One query across articles, topics, people, organisations, places, events and collaborations.
             Plain English works — "shadow puppetry" finds wayang.
          </p>
          <form
            role="search"
            className="mt-8 flex max-w-xl gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
          >
            <div className="relative min-w-0 flex-1">
              <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <label htmlFor="global-search" className="sr-only">
                Search Indonesia Vibes
              </label>
              <input
                id="global-search"
                type="search"
                value={input}
                autoFocus
                onChange={(e) => setInput(e.target.value)}
                placeholder="Try: gamelan, textile, Japan, residency"
                className="min-h-12 w-full rounded-full border border-border bg-background pr-4 pl-11 text-sm text-ink"
              />
            </div>
            <button
              type="submit"
              className="inline-flex min-h-12 shrink-0 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-deep-red"
            >
              Search
            </button>
          </form>
          <p className="mt-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Popular:</span>
            {popularSearches.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setInput(s);
                  submit(s);
                }}
                className="min-h-9 text-primary underline underline-offset-4"
              >
                {s}
              </button>
            ))}
          </p>
        </div>
      </header>

      {q ? (
        <>
          <div className="border-b border-border bg-background">
            <div className="container-editorial flex flex-wrap gap-2 py-5">
              <FilterChip
                active={!type}
                onClick={() => navigate({ search: (prev) => ({ ...prev, type: undefined }) })}
              >
                All ({hits.length})
              </FilterChip>
              {TYPES.filter((t) => counts.get(t)).map((t) => (
                <FilterChip
                  key={t}
                  active={type === t}
                  onClick={() =>
                    navigate({ search: (prev) => ({ ...prev, type: type === t ? undefined : t }) })
                  }
                >
                  {t} ({counts.get(t)})
                </FilterChip>
              ))}
            </div>
          </div>

          <div className="container-editorial py-14">
            <p aria-live="polite" className="text-sm text-muted-foreground">
              {visible.length} {visible.length === 1 ? "result" : "results"} for{" "}
              <span className="font-medium text-ink">“{q}”</span>
            </p>

            {visible.length ? (
              <ul key={`${q}-${visible.length}`} className="list-swap mt-6 max-w-3xl">
                {visible.map((hit) => (
                  <li key={`${hit.record.type}-${hit.record.id}`}>
                    <SearchResultCard record={hit.record} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-10 max-w-3xl">
                <h2 className="display-3 text-ink">Nothing matched — try a different way in</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Search is built for discovery, so a dead end usually means a different word. These
                  routes are always open:
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {suggestions.topics.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setInput(t);
                        submit(t);
                      }}
                      className="min-h-9 rounded-full border border-border px-4 text-sm text-ink hover:border-primary hover:text-primary"
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <ul className="mt-10">
                  {suggestions.records.map((r) => (
                    <li key={r.id}>
                      <SearchResultCard record={r} />
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-sm text-muted-foreground">
                  Still nothing?{" "}
                  <Link
                    to="/contact"
                    search={{ topic: "General question" as const, subject: `Search: ${q}` }}
                    className="text-primary underline underline-offset-4"
                  >
                    Tell us what you were looking for
                  </Link>
                  .
                </p>
              </div>
            )}
            {faqHits.length ? (
              <section aria-labelledby="faq-results" className="order-last mt-12 max-w-3xl border-t border-border pt-6">
                <h2 id="faq-results" className="eyebrow text-muted-foreground">FAQ</h2>
                <ul className="mt-3 divide-y divide-border">
                  {faqHits.map((f) => (
                    <li key={f.id} className="py-3">
                      <Link to="/faq" className="group block">
                        <span className="text-[0.7rem] font-medium tracking-wide text-primary uppercase">FAQ · {f.category}</span>
                        <span className="mt-1 block font-medium text-ink group-hover:text-primary">{f.question}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </>
      ) : (
        <div className="container-editorial py-16">
          <h2 className="display-3 text-ink">Start anywhere</h2>
          <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { to: "/understand-indonesia" as const, label: "Understand Indonesia", note: "Essentials, deep dives and perspectives" },
              { to: "/people-organisations" as const, label: "People & Organisations", note: "Makers, communities, museums and universities" },
              { to: "/events-places" as const, label: "Events & Places", note: "What is on, and where" },
              { to: "/connect" as const, label: "Collaborate with Indonesia", note: "Examples and a way to begin" },
              { to: "/around-the-world" as const, label: "Around the World", note: "The global map" },
            ].map((item) => (
              <li key={item.to} className="border-l-2 border-primary/30 pl-5">
                <Link to={item.to} className="link-underline font-medium text-ink">
                  {item.label}
                </Link>
                <p className="mt-1.5 text-sm text-muted-foreground">{item.note}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
