import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { formatRange, getEvent, getForm, getPlace } from "@/data/content";
import type { CulturalEvent } from "@/types/content";

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
    return {
      meta: [
        { title: `${event.title} — Indonesia Vibes` },
        { name: "description", content: event.summary },
        { property: "og:title", content: event.title },
        { property: "og:description", content: event.summary },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/events/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/events/${params.slug}` }],
    };
  },
  notFoundComponent: () => (
    <div className="container-editorial py-28 text-center">
      <h1 className="display-2 text-ink">Event not found</h1>
      <Link to="/events" className="mt-6 inline-block text-primary underline underline-offset-4">
        All events
      </Link>
    </div>
  ),
  component: EventPage,
});

function EventPage() {
  const { event } = Route.useLoaderData();
  const place = getPlace(event.placeId);
  const forms = event.formIds.map(getForm).filter(Boolean);

  return (
    <article>
      <header className="container-editorial pt-14 pb-10">
        <p className="eyebrow text-primary">
          {event.type} · {place?.name}, {place?.country}
        </p>
        <h1 className="display-1 mt-5 max-w-4xl text-ink">{event.title}</h1>
        <p className="standfirst mt-6 max-w-2xl">{event.summary}</p>
      </header>
      <figure className="container-editorial">
        <img src={event.image} alt={event.title} width={1600} height={1104} className="aspect-[16/9] w-full object-cover" />
      </figure>
      <div className="container-editorial grid gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
        <div className="prose-editorial max-w-2xl text-ink">
          <p>
            {event.title} runs {formatRange(event.startDate, event.endDate)} at our partner venue in{" "}
            {place?.name}. {place?.summary}
          </p>
          <p>
            Every object, score and film in the programme is presented with its maker named and its
            origin community credited. Where a work is on loan, provenance is published alongside it.
          </p>
          <h2>Getting involved</h2>
          <p>
            Press and institutional enquiries go through the programme team. Schools and university
            groups can request a guided session at no cost.
          </p>
        </div>
        <aside className="space-y-8 border-t border-border pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          <div>
            <p className="eyebrow text-muted-foreground">Dates</p>
            <p className="mt-2 text-sm text-ink">{formatRange(event.startDate, event.endDate)}</p>
          </div>
          <div>
            <p className="eyebrow text-muted-foreground">Forms</p>
            <ul className="mt-2 space-y-1.5">
              {forms.map((f) => (
                <li key={f!.id} className="text-sm text-ink">
                  {f!.name}
                </li>
              ))}
            </ul>
          </div>
          <Link
            to="/contact"
            className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-deep-red"
          >
            Enquire about this event
          </Link>
        </aside>
      </div>
    </article>
  );
}
