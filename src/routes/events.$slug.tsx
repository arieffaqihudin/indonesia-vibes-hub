import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { eventLocationLabel, eventStatus, formatDate, formatEventDates, getEvent, getForm, getPerson, getPlace } from "@/data/content";
import type { CulturalEvent, CulturalForm, Person } from "@/types/content";
import { pageIdentity, publicUrl, breadcrumbSchema } from "@/lib/public-seo";
import { socialImageMeta } from "@/lib/social-image";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const Route = createFileRoute("/events/$slug")({
  loader: ({ params }): { event: CulturalEvent } => {
    const event = getEvent(params.slug);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Event not found — Indonesia Vibes" }, { name: "robots", content: "noindex" }] };
    }
    const { event } = loaderData;
    const path = `/events/${params.slug}`;
    const description = event.summary ?? event.sourceNote ?? `${event.title} — a cultural event in Indonesia Vibes' events and places directory.`;
    const place = event.placeId ? getPlace(event.placeId) : undefined;
    return {
      meta: [
        { title: `${event.title} | Indonesia Vibes` },
        { name: "description", content: description },
        { property: "og:title", content: event.title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...socialImageMeta(event.image),
        ...pageIdentity(path).meta,
        ...(!event.fixedDate || !event.summary && !event.context ? [{ name: "robots", content: "noindex, follow" }] : []),
      ],
      links: pageIdentity(path).links,
      scripts: [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Experience", path: "/experience" }, { name: "Events & Places", path: "/events-places" }, { name: event.title, path }]), ...(event.fixedDate && !event.needsVerification?.includes("Exact dates") && event.datePrecision !== "month" && /^\d{4}-\d{2}-\d{2}$/.test(event.startDate) ? [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Event", name: event.title, description, url: publicUrl(path), startDate: event.startDate, ...(event.endDate && /^\d{4}-\d{2}-\d{2}$/.test(event.endDate) ? { endDate: event.endDate } : {}), ...(event.organiser ? { organizer: { "@type": "Organization", name: event.organiser } } : {}), ...(place || event.location ? { location: { "@type": "Place", name: event.venue ?? place?.name ?? event.location?.city ?? event.location?.country, ...(place ? { address: { "@type": "PostalAddress", addressLocality: place.city, addressCountry: place.country } } : {}) } } : {}) }) }] : [])],
    };
  },
  notFoundComponent: () => (
    <div className="container-editorial py-28 text-center">
      <h1 className="display-2 text-ink">Event not found</h1>
      <Link to="/events-places" className="mt-6 inline-block text-primary underline underline-offset-4">
        All events
      </Link>
    </div>
  ),
  component: EventPage,
});

function EventPage() {
  const { event } = Route.useLoaderData();
  const place = event.placeId ? getPlace(event.placeId) : undefined;
  const locationLabel = eventLocationLabel(event);
  const forms = event.formIds.map(getForm).filter(Boolean) as CulturalForm[];
  const people = (event.peopleIds ?? []).map(getPerson).filter(Boolean) as Person[];
  const status = eventStatus(event);

  return (
    <article>
      <header className="container-editorial pt-14 pb-10">
        <Breadcrumbs className="mb-6" items={[{ label: "Experience", to: "/experience" }, { label: "Events & Places", to: "/events-places" }, { label: event.title }]} />
        <p className="eyebrow text-primary">{[event.type, locationLabel].filter(Boolean).join(" · ")}</p>
        <h1 className="display-1 mt-5 max-w-4xl text-ink">{event.title}</h1>
        {event.summary || event.sourceNote ? (
          <p className="standfirst mt-6 max-w-2xl">{event.summary ?? event.sourceNote}</p>
        ) : null}
        <div className="mt-7 flex flex-wrap items-center gap-3 text-sm">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
              status === "On now"
                ? "bg-primary text-primary-foreground"
                : status === "Upcoming"
                  ? "bg-pale text-deep-red"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {status === "On now" ? "On now" : status === "Upcoming" ? "Upcoming" : "Past programme"}
          </span>
          <span className="text-muted-foreground">{formatEventDates(event)}</span>
        </div>
      </header>
      {event.image ? (
        <figure className="container-editorial">
          <img src={event.image} alt={event.title} width={1600} height={1104} className="aspect-[16/9] w-full object-cover" />
        </figure>
      ) : null}
      <div className="container-editorial grid gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
        <div className="min-w-0 max-w-2xl space-y-12">
          {event.context ? (
            <section className="prose-editorial text-ink">
              <p>{event.context}</p>
              {place?.summary ? <p>{place.summary}</p> : null}
            </section>
          ) : null}

          {event.programme?.length ? (
            <section>
              <h2 className="display-3 text-ink">What is on the programme</h2>
              <ul className="mt-6 divide-y divide-border border-y border-border">
                {event.programme.map((line: string, i: number) => (
                  <li key={i} className="py-4 text-[0.95rem] leading-relaxed text-ink">
                    {line}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {people.length ? (
            <section>
              <h2 className="display-3 text-ink">Who is taking part</h2>
              <ul className="mt-6 space-y-4">
                {people.map((p) => (
                  <li key={p.id} className="flex min-w-0 items-center gap-4">
                    <img src={p.image} alt="" width={96} height={96} loading="lazy" className="h-12 w-12 shrink-0 rounded-full object-cover" />
                    <span className="min-w-0">
                      <Link to="/people/$slug" params={{ slug: p.slug }} className="block truncate font-medium text-ink link-underline">
                        {p.name}
                      </Link>
                      <span className="block truncate text-sm text-muted-foreground">
                        {p.role} · {p.based}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {forms.length ? (
            <section>
              <h2 className="display-3 text-ink">Cultural context</h2>
              <ul className="mt-6 space-y-5">
                {forms.map((f) => (
                  <li key={f.id}>
                    <Link to={f.pillar === "heritage" ? "/understand-indonesia/heritage/$slug" : "/understand-indonesia"} {...(f.pillar === "heritage" ? { params: { slug: f.slug } } : {})} className="font-medium text-ink link-underline">
                      {f.name}
                    </Link>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.summary}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section>
            <h2 className="display-3 text-ink">Attending and enquiries</h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              {event.audience ? `Made for ${event.audience.toLowerCase()}. ` : ""}
              Press and institutional enquiries go through the programme team. Schools and university
              groups can request a guided session at no cost.
            </p>
          </section>
        </div>

        <div className="space-y-7 border-t border-border pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          <Fact label="Dates" value={formatEventDates(event)} />
          {locationLabel ? <Fact label="Location" value={locationLabel} /> : null}
          {event.localTime ? (
            <Fact label="Times" value={`${event.localTime}${event.timeZone ? ` (${event.timeZone})` : ""}`} />
          ) : null}
          {event.venue ? <Fact label="Venue" value={[event.venue, place?.name].filter(Boolean).join(", ")} /> : null}
          {event.admission ? <Fact label="Admission" value={event.admission} /> : null}
          {event.organiser ? <Fact label="Organised by" value={event.organiser} /> : null}
          {forms.length ? <Fact label="Forms" value={forms.map((f) => f.name).join(", ")} /> : null}
          <Link
            to="/contact"
            search={{ topic: "Event enquiry", subject: event.title }}
            className="press inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-deep-red"
          >
            Enquire about this event
          </Link>
          {event.lastChecked ? (
            <p className="text-xs text-muted-foreground">
              Programme details last checked {formatDate(event.lastChecked)}. Confirm times with the
              venue before travelling.
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="eyebrow text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink">{value}</p>
    </div>
  );
}
