import { createFileRoute } from "@tanstack/react-router";

import { Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/editorial/Section";
import { brand } from "@/lib/brand";
import { people } from "@/data/content";
import { sortedTeam } from "@/data/team";
import markRed from "@/assets/mark-red.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Indonesia Vibes" },
      { name: "description", content: "The mission, method and principles behind Indonesia Vibes, a global cultural diplomacy platform." },
      { property: "og:title", content: "About — Indonesia Vibes" },
      { property: "og:description", content: "The mission, method and principles behind Indonesia Vibes, a global cultural diplomacy platform." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title="A front door, not a brochure" intro={brand.mission} />

      <div className="container-editorial grid gap-14 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-20">
        <div className="prose-editorial max-w-2xl text-ink">
          <p>
            Indonesia Vibes exists because Indonesian culture already travels — in cloth, sound,
            film and food — usually without its makers named. The platform's job is to put the
            attribution back, in English, where the international audience is.
          </p>
          <h2>The journey</h2>
          <p>
            Every public journey begins with one of three clear actions: {brand.journey.join(", ")}.
            Understand Indonesia connects cultural knowledge. Experience brings together events, places and the
            world map. Collaborate opens a clear pathway to cultural partnership.
          </p>
          <h2>How we work</h2>
          <p>
            The platform is a knowledge network, not a magazine archive. Every story is linked to
            the people who made the work, the cultural forms it belongs to, the places it comes
            from and the institutions that steward it — so a reader who arrives at one page can
            follow the relationships outward rather than hitting a dead end.
          </p>
          <p>
            Directories of{" "}
            <Link to="/understand-indonesia/people-organisations">people and organisations</Link>,{" "}
            <Link to="/events-places">events and places</Link> and{" "}
            <Link to="/collaborate">collaborations</Link> are maintained as
            connective infrastructure for curators, researchers, funders and festival programmers.
            Introductions are facilitated by the team, never by publishing private contact details.
          </p>
          <h2>Principles</h2>
          <ul>
            <li>Names travel with the work. Always the maker, not only the institution.</li>
            <li>Timelines are published. A two-year cloth is described as a two-year cloth.</li>
            <li>Research is open access, and communities are co-authors where they contributed.</li>
            <li>Provenance is published before an object is shown or lent.</li>
          </ul>
          <h2>Standards and participation</h2>
          <p>
            Our{" "}
            <Link to="/editorial-standards">editorial standards</Link> set out how we research,
            verify, attribute and correct. Anyone can{" "}
            <Link to="/contribute">contribute</Link>: suggest a story, nominate a practitioner or
            community, add an institution, or propose open-access research.
          </p>
        </div>

        <aside>
          <img src={markRed} alt="The Indonesia Vibes Garuda mark" width={120} height={120} className="h-20 w-20 object-contain" />
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{brand.markMeaning}</p>
          <p className="eyebrow mt-10 text-muted-foreground">Typography</p>
          <p className="mt-2 text-sm text-ink">{brand.typography.display}</p>
          <p className="eyebrow mt-8 text-muted-foreground">Palette</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(brand.colors).map(([k, v]) => (
              <span key={k} title={`${k} ${v}`} className="h-8 w-8 border border-border" style={{ backgroundColor: v }} />
            ))}
          </div>
        </aside>
      </div>

      <section className="border-t border-border bg-sand" aria-labelledby="our-team">
        <div className="container-editorial py-16">
          <div className="border-b border-border pb-6">
            <h2 id="our-team" className="display-3 text-ink">Our Team</h2>
            <p className="mt-2 text-sm text-muted-foreground">The people behind Indonesia Vibes — editing, curating and supporting the platform.</p>
          </div>
          <ul className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {sortedTeam().map((m) => {
              const profile = m.personId ? people.find((p) => p.id === m.personId) : undefined;
              return (
                <li key={m.id}>
                  {m.photo ? <img src={m.photo} alt={m.name} width={400} height={400} loading="lazy" className="aspect-square w-full object-cover" /> : null}
                  <h3 className="mt-4 text-lg font-medium text-ink">{m.name}</h3>
                  <p className="text-sm text-primary">{m.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
                  {profile ? (
                    <Link to="/people/$slug" params={{ slug: profile.slug }} className="mt-3 inline-block text-xs text-muted-foreground underline-offset-4 hover:text-ink hover:underline">
                      View Cultural Profile →
                    </Link>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
