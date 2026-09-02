import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { DetailSection, FactList, InquiryButton, Pill } from "@/components/editorial/ui";
import { CollaborationCard, InstitutionCard, PersonCard } from "@/components/editorial/EntityCards";
import {
  collaborationsForPerson,
  eventsForPerson,
  getPersonBySlug,
  institutionsForPerson,
  papersForPerson,
  placesForPerson,
  resolve,
  storiesForPerson,
} from "@/data/graph";
import { getForm, people } from "@/data/content";
import { formatRange } from "@/data/content";

export const Route = createFileRoute("/people/$slug")({
  loader: ({ params }) => {
    const person = getPersonBySlug(params.slug);
    if (!person) throw notFound();
    return { person };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Profile unavailable — Indonesia Vibes" }, { name: "robots", content: "noindex" }] };
    }
    const { person } = loaderData;
    const description = person.intro ?? person.bio;
    return {
      meta: [
        { title: `${person.name} — Indonesia Vibes` },
        { name: "description", content: description },
        { property: "og:title", content: `${person.name} — ${person.role}` },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: PersonPage,
});

function PersonPage() {
  const { person } = Route.useLoaderData();
  const isCommunity = person.entity === "community";
  const forms = resolve(person.formIds, getForm);
  const stories = storiesForPerson(person.id);
  const institutions = institutionsForPerson(person);
  const events = eventsForPerson(person);
  const papers = papersForPerson(person);
  const collaborations = collaborationsForPerson(person);
  const relatedPlaces = placesForPerson(person);
  const similar = people
    .filter((p) => p.id !== person.id && p.themes.some((t) => person.themes.includes(t)))
    .slice(0, 3);

  return (
    <article>
      <header className="border-b border-border bg-sand">
        <div className="container-editorial grid gap-10 py-16 md:py-20 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
          <img
            src={person.image}
            alt={isCommunity ? `${person.name} at work` : `Portrait of ${person.name}`}
            width={880}
            height={1100}
            className="aspect-[4/5] w-full max-w-sm object-cover"
          />
          <div className="min-w-0">
            <p className="eyebrow text-primary">
              {isCommunity ? "Community" : person.roles.join(" · ")}
            </p>
            <h1 className="display-1 mt-4 text-ink">{person.name}</h1>
            {person.localName ? (
              <p className="mt-2 text-lg text-muted-foreground italic">{person.localName}</p>
            ) : null}
            <p className="standfirst mt-5 max-w-2xl">{person.intro ?? person.bio}</p>
            <p className="mt-5 text-sm text-muted-foreground">{person.based}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {person.themes.map((t) => (
                <Pill key={t}>{t}</Pill>
              ))}
              {person.availability ? <Pill tone="outline">{person.availability}</Pill> : null}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <InquiryButton
                search={{
                  topic: "Introduction request",
                  subject: `Introduction request: ${person.name}`,
                  ref: person.slug,
                }}
              >
                Request an introduction
              </InquiryButton>
              <InquiryButton
                variant="secondary"
                search={{
                  topic: "Collaboration proposal",
                  subject: `Collaboration proposal: ${person.name}`,
                  ref: person.slug,
                }}
              >
                Propose a collaboration
              </InquiryButton>
            </div>
            <p className="mt-4 max-w-md text-xs leading-relaxed text-muted-foreground">
              Personal contact details are never published. Introductions are made by the programme
              team with the {isCommunity ? "community's" : "practitioner's"} consent.
            </p>
          </div>
        </div>
      </header>

      <div className="container-editorial grid gap-14 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
        <div className="min-w-0 space-y-14">
          {person.story?.length ? (
            <section>
              <h2 className="display-3 text-ink">{isCommunity ? "The community" : "The practice"}</h2>
              <div className="prose-editorial mt-6 max-w-2xl text-ink">
                {person.story.map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ) : null}

          {person.whyMatters ? (
            <section className="border-l-2 border-primary pl-6">
              <p className="eyebrow text-primary">Why this matters</p>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink">{person.whyMatters}</p>
            </section>
          ) : null}

          {person.works?.length ? (
            <DetailSection title={isCommunity ? "Selected work" : "Selected works"}>
              <ul className="divide-y divide-border border-y border-border">
                {person.works.map((w) => (
                  <li key={w.title} className="grid gap-2 py-5 sm:grid-cols-[6rem_minmax(0,1fr)]">
                    <span className="text-sm text-muted-foreground tabular-nums">{w.year}</span>
                    <div>
                      <p className="font-medium text-ink">{w.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{w.note}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

          {stories.length ? (
            <DetailSection title="Stories">
              <ul className="grid gap-8 sm:grid-cols-2">
                {stories.map((s) => (
                  <li key={s.id}>
                    <Link to="/stories/$slug" params={{ slug: s.slug }} className="group block">
                      <div className="media-zoom bg-muted">
                        <img
                          src={s.image}
                          alt={s.imageAlt}
                          width={1200}
                          height={800}
                          loading="lazy"
                          className="aspect-[3/2] w-full object-cover"
                        />
                      </div>
                      <p className="eyebrow mt-4 text-primary">{s.kind}</p>
                      <h3 className="mt-2 text-lg leading-snug font-medium text-ink">
                        <span className="link-underline">{s.title}</span>
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.dek}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

          {events.length ? (
            <DetailSection title="Where to see the work">
              <ul className="divide-y divide-border border-y border-border">
                {events.map((e) => (
                  <li key={e.id} className="py-5">
                    <Link to="/events/$slug" params={{ slug: e.slug }} className="group block">
                      <p className="text-sm text-muted-foreground">
                        {formatRange(e.startDate, e.endDate)} · {e.type}
                      </p>
                      <p className="mt-1.5 text-lg font-medium text-ink">
                        <span className="link-underline">{e.title}</span>
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

          {papers.length ? (
            <DetailSection title="Research">
              <ul className="space-y-5">
                {papers.map((p) => (
                  <li key={p.id} className="border-l-2 border-border pl-5">
                    <p className="font-medium text-ink">{p.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {p.authors} · {p.year} · {p.discipline}
                    </p>
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

          {collaborations.length ? (
            <DetailSection title="International collaborations">
              <ul className="grid gap-8 sm:grid-cols-2">
                {collaborations.map((c) => (
                  <li key={c.id}>
                    <CollaborationCard collaboration={c} size="sm" />
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

          {institutions.length ? (
            <DetailSection title="Affiliated institutions">
              <ul className="grid gap-8 sm:grid-cols-2">
                {institutions.map((i) => (
                  <li key={i.id}>
                    <InstitutionCard institution={i} />
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <FactList
            items={[
              ...(isCommunity && person.custodianship
                ? [{ label: "Custodianship", value: person.custodianship }]
                : []),
              ...(isCommunity && person.generations
                ? [{ label: "Generations", value: person.generations }]
                : []),
              ...(isCommunity && person.members ? [{ label: "Members", value: person.members }] : []),
              ...(person.expertise?.length
                ? [{ label: "Expertise", value: person.expertise.join(", ") }]
                : []),
              ...(person.languages?.length
                ? [{ label: "Languages", value: person.languages.join(", ") }]
                : []),
              ...(forms.length
                ? [
                    {
                      label: "Cultural forms",
                      value: (
                        <ul className="space-y-1.5">
                          {forms.map((f) => (
                            <li key={f.id}>
                              <Link
                                to="/culture/$slug"
                                params={{ slug: f.slug }}
                                className="link-underline text-primary"
                              >
                                {f.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ),
                    },
                  ]
                : []),
              ...(relatedPlaces.length
                ? [
                    {
                      label: "Places",
                      value: (
                        <ul className="space-y-1.5">
                          {relatedPlaces.map((pl) => (
                            <li key={pl.id}>
                              <Link
                                to="/places/$slug"
                                params={{ slug: pl.slug }}
                                className="link-underline text-primary"
                              >
                                {pl.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </div>
      </div>

      {similar.length ? (
        <section className="border-t border-border bg-sand">
          <div className="container-editorial py-16">
            <h2 className="display-3 text-ink">Related profiles</h2>
            <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p) => (
                <li key={p.id}>
                  <PersonCard person={p} size="sm" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </article>
  );
}
