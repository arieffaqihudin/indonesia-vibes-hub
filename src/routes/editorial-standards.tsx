import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/editorial/Section";
import { ContextualFaq } from "@/components/editorial/FaqList";
import { pageIdentity } from "@/lib/public-seo";

export const Route = createFileRoute("/editorial-standards")({
  head: () => ({
    meta: [
      { title: "Editorial Standards — Indonesia Vibes" },
      {
        name: "description",
        content:
          "How Indonesia Vibes researches, verifies, attributes and corrects its cultural coverage, including consent, cultural sensitivity and sourcing.",
      },
      { property: "og:title", content: "Editorial Standards — Indonesia Vibes" },
      {
        property: "og:description",
        content: "Our research method, verification process, attribution rules and corrections policy.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      ...pageIdentity("/editorial-standards").meta,
    ],
    links: pageIdentity("/editorial-standards").links,
  }),
  component: EditorialStandardsPage,
});

const SECTIONS = [
  {
    id: "research",
    title: "How we research",
    body: [
      "Every profile, place and cultural form begins with primary contact: a conversation with the practitioner, the community or the institution that holds the knowledge. Desk research follows, never leads.",
      "Where a form is held collectively, we speak to the custodian body rather than to a single spokesperson, and we record who authorised the account.",
    ],
    list: [
      "Interviews conducted in Indonesian or a regional language where the speaker prefers it, then translated.",
      "Field visits documented with date, location and the people present.",
      "Published scholarship read alongside community accounts, not above them.",
    ],
  },
  {
    id: "verification",
    title: "Verification",
    body: [
      "Facts that travel — dates, materials, techniques, attributions, provenance — are confirmed with at least two independent sources, one of which must be connected to the community of origin.",
      "Claims we cannot verify are either omitted or published with the uncertainty stated in plain English.",
    ],
    list: [
      "Names, spellings and honorifics checked with the person named.",
      "Object provenance published before an object is shown or lent.",
      "Timelines described honestly: a two-year cloth is a two-year cloth.",
    ],
  },
  {
    id: "sensitivity",
    title: "Cultural sensitivity",
    body: [
      "Some knowledge is restricted by custom. When a community asks that a ritual, motif, song or site not be published, we do not publish it, and we say that a restriction exists rather than pretending the gap is absence.",
      "Sacred and ceremonial material is described with the framing the community uses, not with framing borrowed from the international art market.",
    ],
    list: [
      "No photography of restricted ceremony without written community consent.",
      "Local names given first, with English glosses second.",
      "Communities may withdraw consent at any time; the page comes down.",
    ],
  },
  {
    id: "attribution",
    title: "Attribution",
    body: [
      "Names travel with the work. Where a maker is known, the maker is credited before the institution, the collector or the platform.",
      "Communities are credited as co-authors where they contributed knowledge, and research is published open access wherever the rights allow it.",
    ],
    list: [
      "Photographers, translators and interpreters credited on every story.",
      "Community co-authorship stated in the byline, not the footnote.",
      "Third-party material used under licence, with the licence named.",
    ],
  },
  {
    id: "corrections",
    title: "Corrections",
    body: [
      "We publish corrections rather than quietly editing. A corrected page carries a dated note describing what changed and why.",
      "Requests from the people and communities we cover take priority over every other queue.",
    ],
    list: [
      "Factual errors corrected within five working days of verification.",
      "Substantive corrections noted at the foot of the page permanently.",
      "Disputed accounts published with both positions where consent allows.",
    ],
  },
];

function EditorialStandardsPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Editorial standards"
        intro="Cultural diplomacy only works when the account is trustworthy. These are the rules the platform holds itself to — published so that the communities we cover can hold us to them too."
      />

      <div className="container-editorial grid gap-14 py-16 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-20">
        <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow text-muted-foreground">On this page</p>
          <ul className="mt-4 space-y-2.5">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="link-underline text-sm text-ink">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 max-w-2xl space-y-16">
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <h2 className="display-3 text-ink">{section.title}</h2>
              <div className="prose-editorial mt-5 text-ink">
                {section.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <ul className="mt-6 space-y-3">
                {section.list.map((item) => (
                  <li
                    key={item}
                    className="border-l-2 border-primary pl-5 text-sm leading-relaxed text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className="border-t border-border pt-10">
            <h2 className="display-3 text-ink">Found something wrong?</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Corrections are welcome from anyone, and expected from the communities we cover.
            </p>
            <Link
              to="/contact"
              search={{ topic: "Correction" as const, subject: "Correction request" }}
              hash="inquiry"
              className="mt-6 inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-deep-red"
            >
              Request a correction
            </Link>
          </section>
        </div>
      </div>
      <div className="container-editorial pb-16"><ContextualFaq placement="editorial-standards" limit={5} title="Content & editorial questions" /></div>
    </>
  );
}
