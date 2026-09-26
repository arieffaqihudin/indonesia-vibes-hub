import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/editorial/Section";
import { CollaborationCard, InstitutionCard } from "@/components/editorial/EntityCards";
import { ContextualFaq } from "@/components/editorial/FaqList";
import { collaborations } from "@/data/collaborations";
import { institutions } from "@/data/institutions";
import { pageIdentity } from "@/lib/public-seo";

const ways = [
  { title: "Cultural programmes", body: "Exhibitions, performances, festivals and seasons that bring Indonesian work to new audiences." },
  { title: "Research", body: "Fieldwork, open-access publication and academic exchange with Indonesian universities and research centres." },
  { title: "Institutional partnerships", body: "Longer-term relationships between museums, archives, universities and cultural organisations." },
  { title: "Artistic collaboration", body: "Residencies and co-commissions where authorship and credit stay with the makers." },
  { title: "International exchange", body: "Education, youth and community programmes connecting Indonesia with other countries." },
];

const help = [
  { title: "Find the right partner", body: "We introduce you to Indonesian institutions, communities and specialists that fit your idea." },
  { title: "Shape the proposal", body: "We help clarify scope, timing, audiences and what is realistically possible." },
  { title: "Follow through", body: "We stay in touch through planning, delivery and documentation." },
];

const startLink = { to: "/contact" as const, search: { topic: "Collaboration proposal" as const, subject: "Start a collaboration" }, hash: "inquiry" };

export const Route = createFileRoute("/collaborate")({
  head: () => ({
    meta: [
      { title: "Collaborate with Indonesia — Indonesia Vibes" },
      { name: "description", content: "Build cultural, research, institutional, artistic or international collaboration with Indonesia." },
      { property: "og:title", content: "Collaborate with Indonesia — Indonesia Vibes" },
      { property: "og:description", content: "Ways to collaborate, featured collaborations, and how to start a conversation with Indonesia Vibes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      ...pageIdentity("/collaborate").meta,
    ],
    links: pageIdentity("/collaborate").links,
  }),
  component: CollaboratePage,
});

function CollaboratePage() {
  return (
    <>
      <PageHeader
        eyebrow="Collaborate"
        title="Collaborate with Indonesia"
        intro="Build cultural, research, institutional, artistic or international collaboration with Indonesia — with a team that knows the people and places involved."
      />
      <div className="container-editorial py-14 md:py-20">
        <section className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <p className="standfirst max-w-2xl">
            Whether you run a museum, a festival, a university department or an artist studio, collaboration starts with a clear conversation. Here is how it works.
          </p>
          <Link {...startLink} className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-deep-red">
            Start a Collaboration
          </Link>
        </section>

        <section className="mt-16" aria-labelledby="ways">
          <h2 id="ways" className="display-2 text-ink">Ways to collaborate</h2>
          <ul className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {ways.map((w) => (
              <li key={w.title} className="bg-background p-7">
                <h3 className="text-lg font-medium text-ink">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20" aria-labelledby="featured">
          <h2 id="featured" className="display-2 text-ink">Featured collaborations</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {collaborations.slice(0, 4).map((item) => <CollaborationCard key={item.id} collaboration={item} />)}
          </div>
        </section>

        <section className="mt-20" aria-labelledby="partners">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="partners" className="display-2 text-ink">People & Organisations</h2>
            <Link to="/understand-indonesia/people-organisations" className="link-underline text-sm font-medium text-primary">View all</Link>
          </div>
          <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {institutions.slice(0, 3).map((i) => <li key={i.id}><InstitutionCard institution={i} /></li>)}
          </ul>
        </section>

        <section className="mt-20" aria-labelledby="help">
          <h2 id="help" className="display-2 text-ink">How Indonesia Vibes can help</h2>
          <ol className="mt-8 grid gap-px border border-border bg-border md:grid-cols-3">
            {help.map((h, i) => (
              <li key={h.title} className="bg-background p-7">
                <span className="text-sm tabular-nums text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-lg font-medium text-ink">{h.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{h.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-20 grid gap-8 border border-border bg-blush p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-12" aria-labelledby="start">
          <div>
            <h2 id="start" className="display-3 text-clay">Start a Collaboration</h2>
            <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-clay/80">
              Tell us who you are, what you have in mind, and when. Every inquiry is read by a person.
            </p>
          </div>
          <Link {...startLink} className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-deep-red">
            Start a Collaboration
          </Link>
        </section>

        <ContextualFaq placement="connect" />
      </div>
    </>
  );
}
