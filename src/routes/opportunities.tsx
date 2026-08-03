import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/editorial/Section";
import { formatDate, opportunities } from "@/data/content";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunities — Indonesia Vibes" },
      { name: "description", content: "Grants, residencies, fellowships and open calls for artists, makers and researchers." },
      { property: "og:title", content: "Opportunities — Indonesia Vibes" },
      { property: "og:description", content: "Grants, residencies, fellowships and open calls for artists, makers and researchers." },
      { property: "og:url", content: "/opportunities" },
    ],
    links: [{ rel: "canonical", href: "/opportunities" }],
  }),
  component: OpportunitiesPage,
});

function OpportunitiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Connect"
        title="Opportunities"
        intro="Funding and open calls for artists, makers, translators and researchers. Applications are read in English or Indonesian."
      />
      <div className="container-editorial py-16">
        <ul className="grid gap-8 md:grid-cols-2">
          {opportunities.map((o) => (
            <li key={o.id} className="flex flex-col justify-between gap-6 border border-border p-7">
              <div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                  <p className="eyebrow min-w-0 text-primary">{o.type}</p>
                  <p className="shrink-0 text-xs text-muted-foreground">Closes {formatDate(o.deadline)}</p>
                </div>
                <h2 className="display-3 mt-3 text-[1.4rem] text-ink">{o.title}</h2>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">{o.summary}</p>
              </div>
              <div className="border-t border-border pt-5 text-sm">
                <p className="text-ink">{o.forWhom}</p>
                {o.amount ? <p className="mt-1 text-muted-foreground">{o.amount}</p> : null}
                <Link
                  to="/contact"
                  className="mt-5 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-deep-red"
                >
                  Apply or ask a question
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
