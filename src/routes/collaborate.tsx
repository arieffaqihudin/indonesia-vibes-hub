import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/editorial/Section";
import { CollaborationCard } from "@/components/editorial/EntityCards";
import { brand } from "@/lib/brand";
import { collaborations } from "@/data/collaborations";

const tracks = [
  { title: "Host a programme", body: "Museums, festivals and venues can take an existing exhibition, season or performance, with our team handling freight, translation and artist liaison." },
  { title: "Co-commission", body: "We match funding for new work made with Indonesian artists, on the condition that authorship and credit stay with the makers." },
  { title: "Teach and research", body: "Universities partner with us on fieldwork, open-access publication and student exchange across the research pillar." },
  { title: "Licence and loan", body: "Objects and archives travel with published provenance. We do not lend work whose ownership is unresolved." },
];

export const Route = createFileRoute("/collaborate")({
  head: () => ({
    meta: [
      { title: "Collaborate with Indonesia — Indonesia Vibes" },
      { name: "description", content: "See cultural collaboration examples and start a conversation with Indonesia Vibes." },
      { property: "og:title", content: "Collaborate with Indonesia — Indonesia Vibes" },
      { property: "og:description", content: "See cultural collaboration examples and start a conversation with Indonesia Vibes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/collaborate" },
    ],
    links: [{ rel: "canonical", href: "/collaborate" }],
  }),
  component: CollaboratePage,
});

function CollaboratePage() {
  return (
    <>
      <PageHeader
        eyebrow="Connect"
        title="Collaborate with Indonesia"
        intro="Explore existing cultural exchanges and start a clear, human conversation about what we could do together."
      />
      <div className="container-editorial py-16">
        <section className="mb-16">
          <p className="eyebrow text-primary">Examples</p>
          <h2 className="display-2 mt-3 text-ink">Past and current collaborations</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">{collaborations.slice(0, 4).map((item) => <CollaborationCard key={item.id} collaboration={item} />)}</div>
        </section>
        <h2 className="display-2 mb-8 text-ink">How Indonesia Vibes can help</h2>
        <ol className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
          {tracks.map((t, i) => (
            <li key={t.title} className="bg-background p-8">
              <span className="text-sm text-muted-foreground tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="display-3 mt-4 text-[1.4rem] text-ink">{t.title}</h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">{t.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 grid gap-8 border border-border bg-blush p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-12">
          <div>
            <h2 className="display-3 text-clay">Start a conversation</h2>
            <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-clay/80">
              Tell us the room, the dates and the audience. We will tell you what is possible and
              what it costs. Write to {brand.email}.
            </p>
          </div>
          <Link
             to="/contact" search={{ topic: "Collaboration proposal", subject: "Start a collaboration" }}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-deep-red"
          >
             Start a Collaboration
          </Link>
        </div>
      </div>
    </>
  );
}
