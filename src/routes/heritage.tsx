import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/editorial/Section";
import { StoryCard } from "@/components/editorial/StoryCard";
import { formsByPillar, getPlace, storiesForForm } from "@/data/content";

export const Route = createFileRoute("/heritage")({
  head: () => ({
    meta: [
      { title: "Heritage — Indonesia Vibes" },
      { name: "description", content: "Living Indonesian traditions: ikat, gamelan, phinisi shipbuilding, candi relief and rempah kitchens." },
      { property: "og:title", content: "Heritage — Indonesia Vibes" },
      { property: "og:description", content: "Living Indonesian traditions: ikat, gamelan, phinisi shipbuilding, candi relief and rempah kitchens." },
      { property: "og:url", content: "/heritage" },
    ],
    links: [{ rel: "canonical", href: "/heritage" }],
  }),
  component: PillarPage,
});

function PillarPage() {
  const forms = formsByPillar("heritage");

  return (
    <>
      <PageHeader eyebrow="Explore" title="Heritage" intro="Living traditions and the communities who carry them — documented in full, with names, timelines and credit attached." />
      <div className="container-editorial py-16 md:py-20">
        <div className="space-y-20">
          {forms.map((form, i) => {
            const place = getPlace(form.originPlaceId);
            const related = storiesForForm(form.id);
            return (
              <section key={form.id} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
                <div className={i % 2 ? "lg:order-2" : ""}>
                  <div className="media-zoom bg-muted">
                    <img src={form.image} alt={form.name} width={1600} height={1104} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="eyebrow text-primary">{form.discipline} · {place?.name}</p>
                  <h2 className="display-3 mt-3 text-ink">{form.name}</h2>
                  <p className="standfirst mt-4">{form.summary}</p>
                  {form.unesco ? (
                    <p className="mt-4 inline-block bg-blush px-3 py-1.5 text-xs font-medium text-clay">{form.unesco}</p>
                  ) : null}
                  {related.length ? (
                    <ul className="mt-6 space-y-2">
                      {related.map((s) => (
                        <li key={s.id}>
                          <Link to="/stories/$slug" params={{ slug: s.slug }} className="link-underline text-sm font-medium text-ink">
                            {s.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
