import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/editorial/Filters";
import { FilterBar } from "@/components/editorial/FilterBar";
import type { FilterDef } from "@/components/editorial/FilterBar";
import { PersonCard } from "@/components/editorial/EntityCards";
import { PageHeader } from "@/components/editorial/Section";
import { people } from "@/data/content";
import { personRegions } from "@/data/graph";
import { AVAILABILITY, PERSON_ROLES, THEMES } from "@/types/content";
import type { Availability, PersonRole, ThemeId } from "@/types/content";

export const Route = createFileRoute("/people/")({
  head: () => ({
    meta: [
      { title: "People & Communities — Indonesia Vibes" },
      {
        name: "description",
        content:
          "Artists, cultural masters, researchers and custodian communities across Indonesia — profiled with their work, their region and how to reach them.",
      },
      { property: "og:title", content: "People & Communities — Indonesia Vibes" },
      {
        property: "og:description",
        content: "Meet the makers, masters, researchers and communities behind Indonesian culture.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/people" }],
  }),
  component: PeoplePage,
});

type EntityFilter = "People" | "Communities";

function PeoplePage() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<PersonRole | null>(null);
  const [theme, setTheme] = useState<ThemeId | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [entity, setEntity] = useState<EntityFilter | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return people.filter((p) => {
      if (entity === "People" && p.entity !== "person") return false;
      if (entity === "Communities" && p.entity !== "community") return false;
      if (role && !p.roles.includes(role)) return false;
      if (theme && !p.themes.includes(theme)) return false;
      if (region && p.region !== region) return false;
      if (availability && p.availability !== availability) return false;
      if (!q) return true;
      return [p.name, p.localName ?? "", p.role, p.based, ...(p.expertise ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [query, role, theme, region, availability, entity]);

  const featured = people.filter((p) => p.featured).slice(0, 2);
  const emerging = people.filter((p) => p.emerging).slice(0, 3);
  const activeFilters = Boolean(query || role || theme || region || availability || entity);

  const primaryFilters: FilterDef[] = [
    {
      id: "entity",
      label: "Type",
      options: ["People", "Communities"],
      value: entity,
      onChange: (v) => setEntity(v as EntityFilter | null),
      allLabel: "Everyone",
    },
    {
      id: "role",
      label: "Role",
      options: PERSON_ROLES,
      value: role,
      onChange: (v) => setRole(v as PersonRole | null),
      allLabel: "Any role",
    },
  ];

  const secondaryFilters: FilterDef[] = [
    { id: "theme", label: "Theme", options: THEMES, value: theme, onChange: (v) => setTheme(v as ThemeId | null) },
    { id: "region", label: "Region", options: personRegions, value: region, onChange: setRegion },
    {
      id: "availability",
      label: "Open to",
      options: AVAILABILITY,
      value: availability,
      onChange: (v) => setAvailability(v as Availability | null),
      allLabel: "Any",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Connect"
        title="People & Communities"
        intro="Indonesian culture is carried by named people and by communities who hold knowledge collectively. Both are profiled here with the same care — their practice, their place, and the work you can go and see."
      />

      {!activeFilters && featured.length ? (
        <section className="border-b border-border">
          <div className="container-editorial py-16">
            <h2 className="eyebrow text-primary">In focus</h2>
            <div className="mt-8 grid gap-10 md:grid-cols-2">
              {featured.map((person) => (
                <article key={person.id} className="grid gap-6 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]">
                  <img
                    src={person.image}
                    alt={`Portrait of ${person.name}`}
                    width={640}
                    height={800}
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <div>
                    <p className="eyebrow text-primary">{person.roles[0]}</p>
                    <h3 className="mt-2.5 text-2xl leading-tight font-medium text-ink">
                      <Link to="/people/$slug" params={{ slug: person.slug }} className="link-underline">
                        {person.name}
                      </Link>
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {person.whyMatters ?? person.intro ?? person.bio}
                    </p>
                    <p className="mt-4 text-xs text-muted-foreground">{person.based}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <FilterBar
        search={{ value: query, onChange: setQuery, placeholder: "Name, practice or expertise" }}
        primary={primaryFilters}
        secondary={secondaryFilters}
        resultCount={results.length}
        resultNoun={results.length === 1 ? "profile" : "profiles"}
      />

      <div className="container-editorial py-16">
        {results.length ? (
          <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((person) => (
              <li key={person.id}>
                <PersonCard person={person} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No profiles match those filters">
            <p>
              Try removing a filter, or browse the whole directory. If you are looking for someone
              we have not published yet,{" "}
              <Link
                to="/contact"
                search={{ topic: "General question" as const, subject: "Suggest a profile" }}
                className="text-primary underline underline-offset-4"
              >
                tell us who
              </Link>
              .
            </p>
          </EmptyState>
        )}
      </div>

      {emerging.length ? (
        <section className="border-t border-border bg-sand">
          <div className="container-editorial py-16">
            <h2 className="display-3 text-ink">Emerging voices</h2>
            <p className="standfirst mt-3 max-w-2xl">
              Practitioners early in a public career whose work is already shaping how a form travels.
            </p>
            <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {emerging.map((person) => (
                <li key={person.id}>
                  <PersonCard person={person} size="sm" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
