import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/editorial/Section";
import { FaqAccordion } from "@/components/editorial/FaqList";
import { FAQ_CATEGORIES, faqText, publishedFor, useFaqs, type FaqCategory } from "@/lib/faq";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Indonesia Vibes" },
      { name: "description", content: "Short, clear answers about Indonesia Vibes, our editorial approach, events and places, collaboration and using the platform." },
      { property: "og:title", content: "Frequently Asked Questions — Indonesia Vibes" },
      { property: "og:description", content: "Practical answers about Indonesia Vibes, content, events, collaboration and the platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const [faqs] = useFaqs();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FaqCategory | "All">("All");
  const published = publishedFor(faqs, "faq");
  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () => published.filter((f) => (category === "All" || f.category === category) && (!q || `${f.question} ${faqText(f.answer)} ${f.category}`.toLowerCase().includes(q))),
    [published, category, q],
  );
  const groups = FAQ_CATEGORIES.map((c) => ({ category: c, items: visible.filter((f) => f.category === c) })).filter((g) => g.items.length);

  return (
    <>
      <PageHeader eyebrow="About" title="Frequently Asked Questions" intro="Short answers to the questions people ask us most. If yours is not here, write to the team." />
      <div className="container-editorial grid gap-10 py-12 md:py-16 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
        <aside className="min-w-0 space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="relative">
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <label htmlFor="faq-search" className="sr-only">Search questions</label>
            <input id="faq-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search questions…" className="min-h-12 w-full rounded-full border border-border bg-background pr-4 pl-11 text-sm text-ink" />
          </div>
          <label className="block lg:hidden">
            <span className="sr-only">Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value as FaqCategory | "All")} className="min-h-12 w-full rounded-full border border-border bg-background px-4 text-sm text-ink">
              <option value="All">All categories</option>
              {FAQ_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <nav aria-label="FAQ categories" className="hidden lg:block">
            <ul className="space-y-1 border-l border-border">
              {(["All", ...FAQ_CATEGORIES] as const).map((c) => (
                <li key={c}>
                  <button type="button" onClick={() => setCategory(c)} aria-pressed={category === c} className={cn("-ml-px block min-h-10 border-l-2 pl-4 text-left text-sm transition-colors", category === c ? "border-primary font-medium text-primary" : "border-transparent text-muted-foreground hover:text-ink")}>
                    {c === "All" ? "All questions" : c}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0">
          <p aria-live="polite" className="sr-only">{visible.length} questions shown</p>
          {groups.length ? groups.map((g) => (
            <section key={g.category} className="mb-14 last:mb-0">
              <h2 className="eyebrow mb-4 text-primary">{g.category}</h2>
              <FaqAccordion items={g.items} />
            </section>
          )) : (
            <p className="text-muted-foreground">No questions match “{query}”. Try another word, or <Link to="/contact" className="text-primary underline underline-offset-4">ask the team</Link>.</p>
          )}

          <div className="mt-16 grid gap-6 border border-border bg-blush p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div>
              <h2 className="display-3 text-clay">Still have a question?</h2>
              <p className="mt-2 text-sm text-clay/80">Write to the team, or start a collaboration conversation.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/contact" className="inline-flex min-h-11 items-center rounded-full border border-clay/30 px-5 text-sm font-medium text-clay hover:border-primary hover:text-primary">Contact us</Link>
              <Link to="/connect" className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-deep-red">Start a Collaboration</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
