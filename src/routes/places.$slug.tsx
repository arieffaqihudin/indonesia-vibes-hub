import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { InstitutionCard, PersonCard, PlaceCard } from "@/components/editorial/EntityCards";
import {
  DetailSection,
  FactList,
  LastReviewed,
  OutboundLink,
  Pill,
} from "@/components/editorial/ui";
import { IndonesiaMap } from "@/components/map/IndonesiaMap";
import {
  collaborationsForPlace,
  eventsForPlace,
  formsForPlace,
  getPlaceBySlug,
  institutionsForPlace,
  nearbyPlaces,
  peopleForPlace,
  storiesForPlace,
} from "@/data/graph";
import { formatEventDates } from "@/data/content";
import { pageIdentity, publicUrl, breadcrumbSchema } from "@/lib/public-seo";
import { socialImageMeta } from "@/lib/social-image";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const Route = createFileRoute("/places/$slug")({
  loader: ({ params }) => {
    const place = getPlaceBySlug(params.slug);
    if (!place) throw notFound();
    return { place };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Place unavailable — Indonesia Vibes" }, { name: "robots", content: "noindex" }],
      };
    }
    const { place } = loaderData;
    const path = `/places/${params.slug}`;
    return {
      meta: [
        { title: `${place.name} — Indonesia Vibes` },
        { name: "description", content: place.summary },
        { property: "og:title", content: `${place.name}, ${place.region}` },
        { property: "og:description", content: place.summary },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...socialImageMeta(place.image),
        ...pageIdentity(path).meta,
        ...(!place.whyMatters && !place.significance?.length ? [{ name: "robots", content: "noindex, follow" }] : []),
      ],
      links: pageIdentity(path).links,
      scripts: [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Experience", path: "/experience" }, { name: "Events & Places", path: "/events-places" }, { name: place.name, path }]), { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Place", name: place.name, description: place.summary, url: publicUrl(path), address: { "@type": "PostalAddress", addressLocality: place.city, addressRegion: place.province, addressCountry: place.country } }) }],
    };
  },
  component: PlacePage,
});

function PlacePage() {
  const { place } = Route.useLoaderData();
  const stories = storiesForPlace(place.id);
  const events = eventsForPlace(place.id);
  const people = peopleForPlace(place.id);
  const institutions = institutionsForPlace(place.id);
  const forms = formsForPlace(place.id);
  const collaborations = collaborationsForPlace(place.id);
  const nearby = nearbyPlaces(place);

  return (
    <article>
      <header className="border-b border-border">
        {place.image ? (
          <img
            src={place.image}
            alt={`${place.name}, ${place.region}`}
            width={1920}
            height={900}
            className="aspect-[21/9] w-full object-cover"
          />
        ) : null}
        <div className="container-editorial py-14">
          <Breadcrumbs className="mb-5" items={[{ label: "Experience", to: "/experience" }, { label: "Events & Places", to: "/events-places" }, { label: place.name }]} />
          <p className="eyebrow text-primary">{place.type ?? "Place"}</p>
          <h1 className="display-1 mt-4 max-w-4xl text-ink">{place.name}</h1>
          <p className="standfirst mt-5 max-w-2xl">{place.summary}</p>
          <p className="mt-5 text-sm text-muted-foreground">
            {[place.city, place.province, place.region, place.country].filter(Boolean).join(" · ")}
          </p>
          {place.themes?.length ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {place.themes.map((t) => (
                <Pill key={t}>{t}</Pill>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <div className="container-editorial grid gap-14 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
        <div className="min-w-0 space-y-14">
          {place.whyMatters ? (
            <section className="border-l-2 border-primary pl-6">
              <p className="eyebrow text-primary">Why this place matters</p>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink">{place.whyMatters}</p>
            </section>
          ) : null}

          {place.significance?.length ? (
            <DetailSection title="What to see">
              <ul className="grid gap-3 sm:grid-cols-2">
                {place.significance.map((s) => (
                  <li key={s} className="border-l-2 border-border pl-4 text-sm leading-relaxed text-ink">
                    {s}
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

          {forms.length ? (
            <DetailSection title="Cultural forms from here">
              <ul className="grid gap-8 sm:grid-cols-2">
                {forms.map((f) => (
                  <li key={f.id}>
                    <Link to={f.pillar === "heritage" ? "/understand-indonesia/heritage/$slug" : "/understand-indonesia"} {...(f.pillar === "heritage" ? { params: { slug: f.slug } } : {})} className="group block">
                      <div className="media-zoom bg-muted">
                        <img
                          src={f.image}
                          alt={f.name}
                          width={1200}
                          height={800}
                          loading="lazy"
                          className="aspect-[3/2] w-full object-cover"
                        />
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-ink">
                        <span className="link-underline">{f.name}</span>
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.summary}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

          {people.length ? (
            <DetailSection title="People and communities here">
              <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {people.map((p) => (
                  <li key={p.id}>
                    <PersonCard person={p} size="sm" />
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

          {institutions.length ? (
            <DetailSection title="Institutions">
              <ul className="grid gap-8 sm:grid-cols-2">
                {institutions.map((i) => (
                  <li key={i.id}>
                    <InstitutionCard institution={i} />
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

          {events.length ? (
            <DetailSection title="Events here">
              <ul className="divide-y divide-border border-y border-border">
                {events.map((e) => (
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

          {stories.length ? (
            <DetailSection title="Stories from here">
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
                      <h3 className="mt-4 text-lg font-medium text-ink">
                        <span className="link-underline">{s.title}</span>
                      </h3>
                    </Link>
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

          {collaborations.length ? (
            <DetailSection title="Related collaborations">
              <ul className="space-y-4">
                {collaborations.map((c) => (
                  <li key={c.id} className="border border-border p-5">
                    <p className="eyebrow text-primary">{c.type}</p>
                    <p className="mt-2 font-medium text-ink">{c.publicStory ? <Link to="/collaborate/$slug" params={{ slug: c.slug }} className="link-underline">{c.title}</Link> : c.title}</p>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {c.countries.join(" · ")} · {c.years}
                    </p>
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}
        </div>

        <div className="space-y-8 lg:sticky lg:top-28 lg:self-start">
          <IndonesiaMap places={[place]} selectedId={place.id} onSelect={() => {}} />
          {place.visiting ? (
            <>
              <FactList
                items={[
                  { label: "Opening", value: place.visiting.opening },
                  { label: "Accessibility", value: place.visiting.accessibility },
                  { label: "Before you go", value: place.visiting.guidance },
                  {
                    label: "Coordinates",
                    value: (
                      <span className="tabular-nums">
                        {place.lat.toFixed(3)}, {place.lng.toFixed(3)}
                      </span>
                    ),
                  },
                ]}
              />
              {place.visiting.website ? (
                <OutboundLink href={place.visiting.website}>
                  {place.visiting.websiteLabel ?? "Official information"}
                </OutboundLink>
              ) : null}
              <LastReviewed date={place.visiting.lastReviewed} />
            </>
          ) : (
            <p className="text-sm leading-relaxed text-muted-foreground">
              This is a cultural region rather than a single visitable site. Access is arranged
              through the communities and institutions listed on this page.
            </p>
          )}
        </div>
      </div>

      {nearby.length ? (
        <section className="border-t border-border bg-sand">
          <div className="container-editorial py-16">
            <h2 className="display-3 text-ink">Nearby places</h2>
            <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {nearby.map(({ place: p, km }) => (
                <li key={p.id}>
                  <PlaceCard place={p} />
                  <p className="mt-2 text-xs text-muted-foreground">{km} km away</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </article>
  );
}
