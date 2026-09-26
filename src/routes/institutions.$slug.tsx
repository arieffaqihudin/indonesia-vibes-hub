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
import { events, formatEventDates, getForm, papers } from "@/data/content";
import { heritageType, isHeritage } from "@/lib/heritage";
import { pageIdentity, publicUrl, breadcrumbSchema } from "@/lib/public-seo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const Route = createFileRoute("/institutions/$slug")({
  loader: ({ params }) => {
    const institution = getInstitutionBySlug(params.slug);
    if (!institution) throw notFound();
    return { institution };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Institution unavailable — Indonesia Vibes" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { institution } = loaderData;
    const path = `/institutions/${params.slug}`;
    return {
      meta: [
        { title: `${institution.name} — Indonesia Vibes` },
        { name: "description", content: institution.profile },
        { property: "og:title", content: `${institution.name}, ${institution.city}` },
        { property: "og:description", content: institution.profile },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(institution.image?.startsWith("https://") ? [{ property: "og:image", content: institution.image }, { name: "twitter:image", content: institution.image }] : []),
        ...pageIdentity(path).meta,
        ...(!institution.profile || institution.profile.trim().length < 100 ? [{ name: "robots", content: "noindex, follow" }] : []),
      ],
      links: pageIdentity(path).links,
      scripts: [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Understand Indonesia", path: "/understand-indonesia" }, { name: "People & Organisations", path: "/understand-indonesia/people-organisations" }, { name: institution.name, path }]), { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: institution.name, description: institution.profile, url: publicUrl(path), address: { "@type": "PostalAddress", addressLocality: institution.city, addressCountry: institution.country } }) }],
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
  const relatedHeritage = forms.filter(isHeritage);
  const institutionEvents = events.filter(
    (e) => e.institutionIds?.includes(institution.id) || institution.eventIds?.includes(e.id),
  );
  const institutionPapers = papers.filter(
    (p) => p.institutionIds?.includes(institution.id) || institution.paperIds?.includes(p.id),
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
          <Breadcrumbs className="mb-5" items={[{ label: "Understand Indonesia", to: "/understand-indonesia" }, { label: "People & Organisations", to: "/understand-indonesia/people-organisations" }, { label: institution.name }]} />
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

          {relatedHeritage.length ? (
            <DetailSection title="Related Heritage">
              <ul className="grid gap-6 sm:grid-cols-2">
                {relatedHeritage.map((h) => (
                  <li key={h.id}>
                    <Link to="/understand-indonesia/heritage/$slug" params={{ slug: h.slug }} className="group flex items-center gap-4">
                      <img src={h.image} alt="" loading="lazy" className="h-16 w-16 shrink-0 rounded-sm object-cover" />
                      <span className="min-w-0">
                        <span className="block font-medium text-ink group-hover:text-primary">{h.name}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{heritageType(h)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

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
            <DetailSection title="Related collaborations">
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

          </DetailSection>
        </div>

        <div className="space-y-8 lg:sticky lg:top-28 lg:self-start">
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
        </div>
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
