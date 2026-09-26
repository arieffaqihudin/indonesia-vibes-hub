import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";

import { CollaborationCard, InstitutionCard, PersonCard } from "@/components/editorial/EntityCards";
import { DetailSection, FactList, InquiryButton, Pill } from "@/components/editorial/ui";
import {
  getCollaborationBySlug,
  getInstitutionById,
  getPersonById,
  getPlaceById,
  relatedCollaborations,
  resolve,
} from "@/data/graph";
import { events, formatEventDates, getForm, stories } from "@/data/content";
import { pageIdentity, breadcrumbSchema } from "@/lib/public-seo";

export const Route = createFileRoute("/collaborate/$slug")({
  loader: ({ params }) => {
    const collaboration = getCollaborationBySlug(params.slug);
    if (!collaboration) throw notFound();
    // Only Collaboration Stories have a public page; showcase records live on /collaborate.
    if (!collaboration.publicStory || !collaboration.intro?.trim() || !collaboration.objectives?.length) throw redirect({ to: "/collaborate", statusCode: 301 });
    return { collaboration };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Collaboration unavailable — Indonesia Vibes" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { collaboration } = loaderData;
    const path = `/collaborate/${params.slug}`;
    return {
      meta: [
        { title: `${collaboration.title} — Indonesia Vibes` },
        { name: "description", content: collaboration.intro },
        { property: "og:title", content: collaboration.title },
        { property: "og:description", content: collaboration.intro },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(collaboration.image?.startsWith("https://") ? [{ property: "og:image", content: collaboration.image }, { name: "twitter:image", content: collaboration.image }] : []),
        ...pageIdentity(path).meta,
      ],
      links: pageIdentity(path).links,
      scripts: [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Collaborate", path: "/collaborate" }, { name: collaboration.title, path }])],
    };
  },
  component: CollaborationPage,
});

function CollaborationPage() {
  const { collaboration: c } = Route.useLoaderData();
  const indonesianPartners = resolve(c.indonesianPartnerIds, getInstitutionById);
  const people = resolve(c.peopleIds, getPersonById);
  const places = resolve(c.placeIds, getPlaceById);
  const forms = resolve(c.formIds, getForm);
  const linkedEvents = events.filter((e) => c.eventIds.includes(e.id));
  const linkedStories = stories.filter((s) => c.storyIds.includes(s.id));
  const related = relatedCollaborations(c);

  return (
    <article>
      <header className="border-b border-border">
        <img
          src={c.image}
          alt={`${c.title}, a collaboration between ${c.countries.join(" and ")}`}
          width={1920}
          height={900}
          className="aspect-[21/9] w-full object-cover"
        />
        <div className="container-editorial py-14">
          <div className="flex flex-wrap items-center gap-3">
            <Pill tone="brand">{c.status}</Pill>
            <span className="text-sm text-muted-foreground">
              {c.type} · {c.years}
            </span>
          </div>
          <h1 className="display-1 mt-4 max-w-4xl text-ink">{c.title}</h1>
          <p className="standfirst mt-5 max-w-2xl">{c.intro}</p>
          <p className="mt-5 text-sm text-muted-foreground">{c.countries.join(" · ")}</p>
        </div>
      </header>

      <div className="container-editorial grid gap-14 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
        <div className="min-w-0 space-y-14">
          <section>
            <h2 className="display-3 text-ink">Objectives</h2>
            <ul className="mt-6 space-y-3">
              {c.objectives.map((o) => (
                <li key={o} className="border-l-2 border-primary pl-5 text-lg leading-relaxed text-ink">
                  {o}
                </li>
              ))}
            </ul>
          </section>

          <DetailSection title="Partners">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <p className="eyebrow text-primary">Indonesian partners</p>
                <ul className="mt-5 space-y-6">
                  {indonesianPartners.map((i) => (
                    <li key={i.id}>
                      <InstitutionCard institution={i} />
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow text-primary">International partners</p>
                <ul className="mt-5 divide-y divide-border border-y border-border">
                  {c.internationalPartners.map((p) => (
                    <li key={p.name} className="py-4">
                      <p className="font-medium text-ink">{p.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {p.type} · {[p.city, p.country].filter(Boolean).join(", ")}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </DetailSection>

          <DetailSection title="Timeline">
            <ol className="relative space-y-8 border-l border-border pl-6">
              {c.timeline.map((t) => (
                <li key={t.period}>
                  <span
                    aria-hidden
                    className="absolute -left-[5px] mt-2 h-2.5 w-2.5 rounded-full bg-primary"
                  />
                  <p className="eyebrow text-muted-foreground">{t.period}</p>
                  <p className="mt-1.5 font-medium text-ink">{t.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.note}</p>
                </li>
              ))}
            </ol>
          </DetailSection>

          <DetailSection title="Activities">
            <ul className="grid gap-3 sm:grid-cols-2">
              {c.activities.map((a) => (
                <li key={a} className="bg-sand p-4 text-sm leading-relaxed text-ink">
                  {a}
                </li>
              ))}
            </ul>
          </DetailSection>

          {people.length ? (
            <DetailSection title="People involved">
              <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {people.map((p) => (
                  <li key={p.id}>
                    <PersonCard person={p} size="sm" />
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

          <DetailSection title="Outputs and outcomes">
            <div className="grid gap-10 sm:grid-cols-2">
              <div>
                <p className="eyebrow text-primary">Outputs</p>
                <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-ink">
                  {c.outputs.map((o) => (
                    <li key={o} className="border-l-2 border-border pl-4">
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow text-primary">Outcomes</p>
                <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-ink">
                  {c.outcomes.map((o) => (
                    <li key={o} className="border-l-2 border-border pl-4">
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {c.documentation}
            </p>
          </DetailSection>

          {linkedEvents.length ? (
            <DetailSection title="Events">
              <ul className="divide-y divide-border border-y border-border">
                {linkedEvents.map((e) => (
                  <li key={e.id} className="py-5">
                    <Link to="/events/$slug" params={{ slug: e.slug }} className="group block">
                      <p className="text-sm text-muted-foreground">
                        {formatEventDates(e)} · {e.type}
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

          {linkedStories.length ? (
            <DetailSection title="Related stories">
              <ul className="grid gap-8 sm:grid-cols-2">
                {linkedStories.map((s) => (
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
                      <h3 className="mt-4 text-lg font-medium text-ink">
                        <span className="link-underline">{s.title}</span>
                      </h3>
                    </Link>
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

          <DetailSection title="Future directions">
            <ul className="space-y-3">
              {c.future.map((f) => (
                <li key={f} className="border-l-2 border-primary pl-5 leading-relaxed text-ink">
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <InquiryButton
                search={{
                  topic: "Collaboration proposal",
                  subject: `Join: ${c.title}`,
                  ref: c.slug,
                }}
              >
                Express interest in this programme
              </InquiryButton>
            </div>
          </DetailSection>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <FactList
            items={[
              { label: "Type", value: c.type },
              { label: "Status", value: c.status },
              { label: "Years", value: c.years },
              { label: "Countries", value: c.countries.join(", ") },
              { label: "Regions", value: c.regions.join(", ") },
              { label: "Themes", value: c.themes.join(", ") },
              ...(forms.length
                ? [{ label: "Cultural forms", value: forms.map((f) => f.name).join(", ") }]
                : []),
              ...(places.length
                ? [
                    {
                      label: "Places",
                      value: (
                        <ul className="space-y-1.5">
                          {places.map((pl) => (
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

      {related.length ? (
        <section className="border-t border-border bg-sand">
          <div className="container-editorial py-16">
            <h2 className="display-3 text-ink">Related collaborations</h2>
            <ul className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.id}>
                  <CollaborationCard collaboration={r} size="sm" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </article>
  );
}
