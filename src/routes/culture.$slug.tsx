import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { InstitutionCard, PersonCard, PlaceCard } from "@/components/editorial/EntityCards";
import { DetailSection, FactList, Pill } from "@/components/editorial/ui";
import { events, forms, formatRange, stories } from "@/data/content";
import { collaborationsForForm, getPlaceById, peopleForForm } from "@/data/graph";
import { institutions } from "@/data/institutions";

export const Route = createFileRoute("/culture/$slug")({
  loader: ({ params }) => {
    const form = forms.find((f) => f.slug === params.slug);
    if (!form) throw notFound();
    return { form };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Cultural form unavailable — Indonesia Vibes" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { form } = loaderData;
    return {
      meta: [
        { title: `${form.name} — Indonesia Vibes` },
        { name: "description", content: form.summary },
        { property: "og:title", content: `${form.name}, ${form.discipline}` },
        { property: "og:description", content: form.summary },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: FormPage,
});

function FormPage() {
  const { form } = Route.useLoaderData();
  const origin = getPlaceById(form.originPlaceId);
  const makers = peopleForForm(form.id);
  const linkedStories = stories.filter((s) => s.formIds.includes(form.id));
  const linkedEvents = events.filter((e) => e.formIds.includes(form.id));
  const linkedInstitutions = institutions.filter((i) => i.formIds.includes(form.id));
  const collaborations = collaborationsForForm(form.id);
  const pillarRoute =
    form.pillar === "heritage" ? "/heritage" : form.pillar === "contemporary" ? "/contemporary" : "/research";

  return (
    <article>
      <header className="border-b border-border">
        <img
          src={form.image}
          alt={`${form.name}, ${form.discipline}`}
          width={1920}
          height={900}
          className="aspect-[21/9] w-full object-cover"
        />
        <div className="container-editorial py-14">
          <p className="eyebrow text-primary">
            <Link to={pillarRoute} className="link-underline">
              {form.pillar[0]!.toUpperCase() + form.pillar.slice(1)}
            </Link>{" "}
            · {form.discipline}
          </p>
          <h1 className="display-1 mt-4 max-w-4xl text-ink">{form.name}</h1>
          <p className="standfirst mt-5 max-w-2xl">{form.summary}</p>
          {form.themes?.length ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {form.themes.map((t) => (
                <Pill key={t}>{t}</Pill>
              ))}
              {form.unesco ? <Pill tone="brand">{form.unesco}</Pill> : null}
            </div>
          ) : null}
        </div>
      </header>

      <div className="container-editorial grid gap-14 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
        <div className="min-w-0 space-y-14">
          {makers.length ? (
            <section>
              <h2 className="display-3 text-ink">Who carries this form</h2>
              <ul className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {makers.map((p) => (
                  <li key={p.id}>
                    <PersonCard person={p} size="sm" />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {linkedStories.length ? (
            <DetailSection title="Stories">
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
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.dek}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

          {linkedEvents.length ? (
            <DetailSection title="Where to see it">
              <ul className="divide-y divide-border border-y border-border">
                {linkedEvents.map((e) => (
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

          {linkedInstitutions.length ? (
            <DetailSection title="Institutions working with this form">
              <ul className="grid gap-8 sm:grid-cols-2">
                {linkedInstitutions.map((i) => (
                  <li key={i.id}>
                    <InstitutionCard institution={i} />
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

          {collaborations.length ? (
            <DetailSection title="International collaborations">
              <ul className="space-y-4">
                {collaborations.map((c) => (
                  <li key={c.id} className="border border-border p-5">
                    <p className="eyebrow text-primary">{c.type}</p>
                    <p className="mt-2 font-medium text-ink">
                      <Link
                        to="/collaborations/$slug"
                        params={{ slug: c.slug }}
                        className="link-underline"
                      >
                        {c.title}
                      </Link>
                    </p>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {c.countries.join(" · ")} · {c.years}
                    </p>
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}
        </div>

        <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
          <FactList
            items={[
              { label: "Discipline", value: form.discipline },
              ...(form.aliases?.length
                ? [{ label: "Also known as", value: form.aliases.join(", ") }]
                : []),
              ...(form.unesco ? [{ label: "Recognition", value: form.unesco }] : []),
            ]}
          />
          {origin ? <PlaceCard place={origin} /> : null}
        </aside>
      </div>
    </article>
  );
}
