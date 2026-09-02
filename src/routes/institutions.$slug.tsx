import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { CollaborationCard, InstitutionCard, PersonCard } from "@/components/editorial/EntityCards";
import {
  DetailSection,
  FactList,
  InquiryButton,
  LastReviewed,
  OutboundLink,
  Pill,
} from "@/components/editorial/ui";
import {
  collaborationsForInstitution,
  getInstitutionBySlug,
  getPlaceById,
  peopleForInstitution,
  relatedInstitutions,
  resolve,
} from "@/data/graph";
import { events, formatRange, getForm, opportunities, papers } from "@/data/content";

export const Route = createFileRoute("/institutions/$slug")({
  loader: ({ params }) => {
    const institution = getInstitutionBySlug(params.slug);
    if (!institution) throw notFound();
    return { institution };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Institution unavailable — Indonesia Vibes" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { institution } = loaderData;
    return {
      meta: [
        { title: `${institution.name} — Indonesia Vibes` },
        { name: "description", content: institution.profile },
        { property: "og:title", content: `${institution.name}, ${institution.city}` },
        { property: "og:description", content: institution.profile },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: InstitutionPage,
});

function InstitutionPage() {
  const { institution } = Route.useLoaderData();
  const team = peopleForInstitution(institution);
  const collaborations = collaborationsForInstitution(institution);
  const related = relatedInstitutions(institution);
  const place = institution.placeId ? getPlaceById(institution.placeId) : undefined;
  const forms = resolve(institution.formIds, getForm);
  const institutionEvents = events.filter(
    (e) => e.institutionIds?.includes(institution.id) || institution.eventIds?.includes(e.id),
  );
  const institutionPapers = papers.filter(
    (p) => p.institutionIds?.includes(institution.id) || institution.paperIds?.includes(p.id),
  );
  const institutionOpportunities = opportunities.filter(
    (o) => o.institutionIds?.includes(institution.id) || institution.opportunityIds?.includes(o.id),
  );

  return (
    <article>
      <header className="border-b border-border">
        <img
          src={institution.image}
          alt={`${institution.name} in ${institution.city}`}
          width={1920}
          height={900}
          className="aspect-[21/9] w-full object-cover"
        />
        <div className="container-editorial py-14">
          <p className="eyebrow text-primary">{institution.type}</p>
          <h1 className="display-1 mt-4 max-w-4xl text-ink">{institution.name}</h1>
          <p className="standfirst mt-5 max-w-2xl">{institution.profile}</p>
          <p className="mt-5 text-sm text-muted-foreground">
            {institution.city}, {institution.province}, {institution.country}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {institution.themes.map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
            {institution.internationalExperience ? (
              <Pill tone="brand">International experience</Pill>
            ) : null}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <InquiryButton
              search={{
                topic: "Institutional connection",
                subject: `Connect with ${institution.name}`,
                ref: institution.slug,
              }}
            >
              Connect with this institution
            </InquiryButton>
            <OutboundLink href={institution.website}>Official website</OutboundLink>
          </div>
        </div>
      </header>

      <div className="container-editorial grid gap-14 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
        <div className="min-w-0 space-y-14">
          <section className="border-l-2 border-primary pl-6">
            <p className="eyebrow text-primary">Why this institution matters</p>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink">
              {institution.whyMatters}
            </p>
          </section>

          <DetailSection title="Collections and holdings">
            <ul className="grid gap-3 sm:grid-cols-2">
              {institution.collections.map((c) => (
                <li key={c} className="border-l-2 border-border pl-4 text-sm leading-relaxed text-ink">
                  {c}
                </li>
              ))}
            </ul>
          </DetailSection>

          <DetailSection title="Programmes and activities">
            <ul className="grid gap-3 sm:grid-cols-2">
              {institution.programmes.map((p) => (
                <li key={p} className="border-l-2 border-border pl-4 text-sm leading-relaxed text-ink">
                  {p}
                </li>
              ))}
            </ul>
          </DetailSection>

          {team.length ? (
            <DetailSection
              title="People"
              intro="Practitioners, curators and researchers connected to this institution."
            >
              <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {team.map((p) => (
                  <li key={p.id}>
                    <PersonCard person={p} size="sm" />
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

          {institutionEvents.length ? (
            <DetailSection title="Events">
              <ul className="divide-y divide-border border-y border-border">
                {institutionEvents.map((e) => (
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

          {institutionPapers.length ? (
            <DetailSection title="Research output">
              <ul className="space-y-5">
                {institutionPapers.map((p) => (
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

          <DetailSection
            title="Partnership interests"
            intro="What this institution is actively looking for from international partners."
          >
            <ul className="grid gap-3 sm:grid-cols-2">
              {institution.collaborationInterests.map((c) => (
                <li key={c} className="bg-sand p-4 text-sm leading-relaxed text-ink">
                  {c}
                </li>
              ))}
            </ul>
            {institutionOpportunities.length ? (
              <ul className="mt-8 space-y-4">
                {institutionOpportunities.map((o) => (
                  <li key={o.id} className="border border-border p-5">
                    <p className="eyebrow text-primary">{o.type}</p>
                    <p className="mt-2 font-medium text-ink">{o.title}</p>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {o.forWhom} · closes {o.deadline}
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}
          </DetailSection>
        </div>

        <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
          <FactList
            items={[
              { label: "Type", value: institution.type },
              {
                label: "Location",
                value: place ? (
                  <Link
                    to="/places/$slug"
                    params={{ slug: place.slug }}
                    className="link-underline text-primary"
                  >
                    {place.name}
                  </Link>
                ) : (
                  `${institution.city}, ${institution.province}`
                ),
              },
              { label: "Expertise", value: institution.expertise.join(", ") },
              ...(institution.facilities?.length
                ? [{ label: "Facilities", value: institution.facilities.join(", ") }]
                : []),
              {
                label: "Partner countries",
                value: institution.partnerCountries.length
                  ? institution.partnerCountries.join(", ")
                  : "Open to first international partnerships",
              },
              ...(forms.length
                ? [{ label: "Cultural forms", value: forms.map((f) => f.name).join(", ") }]
                : []),
            ]}
          />
          <LastReviewed date={institution.lastReviewed} />
        </aside>
      </div>

      {related.length ? (
        <section className="border-t border-border bg-sand">
          <div className="container-editorial py-16">
            <h2 className="display-3 text-ink">Related institutions</h2>
            <ul className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {related.map((i) => (
                <li key={i.id}>
                  <InstitutionCard institution={i} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </article>
  );
}
