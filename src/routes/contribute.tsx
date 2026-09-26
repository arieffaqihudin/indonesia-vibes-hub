import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/editorial/Section";
import { InquiryButton } from "@/components/editorial/ui";
import { pageIdentity } from "@/lib/public-seo";

export const Route = createFileRoute("/contribute")({
  head: () => ({
    meta: [
      { title: "Contribute — Indonesia Vibes" },
      {
        name: "description",
        content:
          "Suggest a story, nominate a practitioner or community, add an institution, or propose research to Indonesia Vibes. Here is what we look for and what happens next.",
      },
      { property: "og:title", content: "Contribute — Indonesia Vibes" },
      {
        property: "og:description",
        content: "Suggest stories, nominate practitioners and propose research for the platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      ...pageIdentity("/contribute").meta,
    ],
    links: pageIdentity("/contribute").links,
  }),
  component: ContributePage,
});

const PATHS = [
  {
    title: "Suggest a story",
    who: "Anyone",
    body: "A practice, a shift, a person whose work is not yet documented in English. Tell us what is happening and why now.",
    subject: "Story suggestion",
  },
  {
    title: "Nominate a practitioner or community",
    who: "Communities, institutions, peers",
    body: "Nominations are how the directory grows honestly. We ask the nominee before we publish anything.",
    subject: "Profile nomination",
  },
  {
    title: "Add an institution",
    who: "Museums, universities, archives",
    body: "Institutions can submit their own profile: collections, programmes, partnership interests and a contact route.",
    subject: "Institution submission",
  },
  {
    title: "Propose research",
    who: "Researchers and students",
    body: "Open access scholarship on Indonesian culture, in any discipline, with community consent where fieldwork is involved.",
    subject: "Research proposal",
  },
];

const CRITERIA = [
  "The work is Indonesian in origin, practice or lineage, and its custodians consent to coverage.",
  "There is a named person, community or institution we can speak to directly.",
  "The account adds something an English-language reader cannot easily find elsewhere.",
  "Nothing restricted by custom is published without explicit permission.",
];

const PROCESS = [
  { step: "1", label: "You submit", note: "A short description, links and a way to reach you." },
  { step: "2", label: "We read", note: "Within five working days, by a person on the editorial team." },
  { step: "3", label: "We verify", note: "Contact with the practitioner or community, plus sourcing." },
  { step: "4", label: "We publish", note: "With attribution, consent recorded and a review date set." },
];

function ContributePage() {
  return (
    <>
      <PageHeader
        eyebrow="Collaborate"
        title="Contribute"
        intro="The platform is deliberately incomplete. Indonesian culture is larger than any editorial team, so the fastest way for it to grow well is for the people inside it to point us at what matters."
      >
        <InquiryButton search={{ topic: "Contribution", subject: "Contribution" }}>
          Send a contribution
        </InquiryButton>
      </PageHeader>

      <div className="container-editorial py-16">
        <h2 className="display-3 text-ink">Four ways in</h2>
        <ul className="mt-10 grid gap-8 md:grid-cols-2">
          {PATHS.map((p) => (
            <li key={p.title} className="flex flex-col border border-border p-6">
              <p className="eyebrow text-primary">{p.who}</p>
              <h3 className="mt-3 text-xl font-medium text-ink">{p.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              <div className="mt-6">
                <InquiryButton variant="secondary" search={{ topic: "Contribution", subject: p.subject }}>
                  {p.title}
                </InquiryButton>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <section className="border-y border-border bg-sand">
        <div className="container-editorial grid gap-12 py-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="display-3 text-ink">What we look for</h2>
            <ul className="mt-6 space-y-3">
              {CRITERIA.map((c) => (
                <li key={c} className="border-l-2 border-primary pl-5 leading-relaxed text-ink">
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="display-3 text-ink">What happens next</h2>
            <ol className="mt-6 space-y-6">
              {PROCESS.map((p) => (
                <li key={p.step} className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-4">
                  <span className="display-3 text-primary tabular-nums">{p.step}</span>
                  <div>
                    <p className="font-medium text-ink">{p.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div className="container-editorial py-16">
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          Everything published follows our{" "}
          <Link to="/editorial-standards" className="text-primary underline underline-offset-4">
            editorial standards
          </Link>
          , including consent, attribution and the right to withdraw.
        </p>
      </div>
    </>
  );
}
