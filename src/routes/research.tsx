import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/editorial/Section";
import { StoryCard } from "@/components/editorial/StoryCard";
import { formsByPillar, papers, storiesForForm } from "@/data/content";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research — Indonesia Vibes" },
      { name: "description", content: "Open scholarship, archives and methodology from the Indonesia Vibes research programme." },
      { property: "og:title", content: "Research — Indonesia Vibes" },
      { property: "og:description", content: "Open scholarship, archives and methodology from the Indonesia Vibes research programme." },
      { property: "og:url", content: "/research" },
    ],
    links: [{ rel: "canonical", href: "/research" }],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const forms = formsByPillar("research");
  const stories = forms.flatMap((f) => storiesForForm(f.id));

  return (
    <>
      <PageHeader
        eyebrow="Culture"
        title="Research"
        intro="Open scholarship and field methodology. Publication is a condition of our funding, and community co-authorship is the default."
      />
      <div className="container-editorial py-16">
        <h2 className="display-3 text-ink">Papers and working notes</h2>
        <ul className="mt-8 divide-y divide-border border-y border-border">
          {papers.map((p) => (
            <li key={p.id} className="grid gap-3 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:gap-10">
              <div className="min-w-0">
                <p className="eyebrow text-primary">{p.discipline} · {p.year}</p>
                <h3 className="mt-2 text-lg leading-snug font-medium text-ink">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.authors}</p>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{p.abstract}</p>
            </li>
          ))}
        </ul>

        {stories.length ? (
          <>
            <h2 className="display-3 mt-20 text-ink">From the field</h2>
            <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((s) => (
                <StoryCard key={s.id} story={s} size="sm" />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
