import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/editorial/Section";
import { deadlineStatus, formatDate, opportunities } from "@/data/content";

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
  const graded = opportunities
    .map((o) => ({ o, status: deadlineStatus(o.deadline) }))
    .sort((a, b) => a.status.days - b.status.days);
  const open = graded.filter((g) => g.status.open).map((g) => g.o);
  const closed = graded.filter((g) => !g.status.open).map((g) => g.o);

  return (
    <>
      <PageHeader
        eyebrow="Connect"
        title="Opportunities"
        intro="Funding and open calls for artists, makers, translators and researchers. Applications are read in English or Indonesian, and we reply to every submission either way."
      />
      <div className="container-editorial py-16">
        {open.length === 0 ? (
          <p className="max-w-xl text-muted-foreground">
            Nothing is open at the moment. New calls are published here first — tell us what you work
            on and we will write when something fits.
          </p>
        ) : (
          <ul className="grid gap-8 md:grid-cols-2">
            {open.map((o) => {
              const status = deadlineStatus(o.deadline);
              return (
                <li key={o.id} className="flex flex-col justify-between gap-6 border border-border p-7">
                  <div>
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                      <p className="eyebrow min-w-0 text-primary">{o.type}</p>
                      <p
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                          status.open ? "bg-pale text-deep-red" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {status.state === "Open" ? status.label : `${status.state} · ${status.label}`}
                      </p>
                    </div>
                    <h2 className="display-3 mt-3 text-[1.4rem] text-ink">{o.title}</h2>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">{o.summary}</p>

                    <dl className="mt-6 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                      <Fact label="Who it is for" value={o.forWhom} />
                      {o.location ? <Fact label="Where" value={o.location} /> : null}
                      {o.duration ? <Fact label="Duration" value={o.duration} /> : null}
                      {o.amount ? <Fact label="Support" value={o.amount} /> : null}
                      <Fact label="Deadline" value={formatDate(o.deadline)} />
                      {o.offeredBy ? <Fact label="Offered by" value={o.offeredBy} /> : null}
                    </dl>

                    {o.eligibility?.length ? (
                      <div className="mt-6">
                        <p className="eyebrow text-muted-foreground">Eligibility</p>
                        <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink">
                          {o.eligibility.map((e: string, i: number) => (
                            <li key={i} className="pl-4 -indent-4 before:mr-2 before:text-primary before:content-['—']">
                              {e}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {o.support?.length ? (
                      <div className="mt-5">
                        <p className="eyebrow text-muted-foreground">What is covered</p>
                        <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink">
                          {o.support.map((s: string, i: number) => (
                            <li key={i} className="pl-4 -indent-4 before:mr-2 before:text-primary before:content-['—']">
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>

                  <div className="border-t border-border pt-5 text-sm">
                    {o.howToApply ? (
                      <p className="text-muted-foreground">{o.howToApply}</p>
                    ) : null}
                    <Link
                      to="/contact"
                      search={{ topic: "Opportunity application", subject: o.title }}
                      className="press mt-5 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-deep-red"
                    >
                      Start an application
                    </Link>
                    {o.lastChecked ? (
                      <p className="mt-4 text-xs text-muted-foreground">
                        Details last checked {formatDate(o.lastChecked)}.
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow text-muted-foreground">{label}</dt>
      <dd className="mt-1 leading-relaxed text-ink">{value}</dd>
    </div>
  );
}
