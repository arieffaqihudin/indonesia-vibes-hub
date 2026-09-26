import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { formatEventDates } from "@/data/content";
import { heritageBySlug, heritageConnections, heritageRegion, heritageTopics, heritageType } from "@/lib/heritage";

export const Route = createFileRoute("/understand-indonesia/heritage/$slug")({
  loader: ({ params }) => {
    const heritage = heritageBySlug(params.slug);
    if (!heritage) throw notFound();
    return { heritage };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Heritage not found — Indonesia Vibes" }, { name: "robots", content: "noindex" }] };
    const { heritage } = loaderData;
    return { meta: [
      { title: `${heritage.name} — Heritage — Indonesia Vibes` },
      { name: "description", content: heritage.summary },
      { property: "og:title", content: `${heritage.name} — Indonesia Vibes` },
      { property: "og:description", content: heritage.summary },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ] };
  },
  component: HeritageDetail,
});

function HeritageDetail() {
  const { heritage } = Route.useLoaderData();
  const where = heritageRegion(heritage);
  const topics = heritageTopics(heritage);
  const c = heritageConnections(heritage);
  const jump = [
    ["overview", "Overview"], c.articles.length && ["articles", "Articles"], (c.people.length || c.communities.length || c.organisations.length) && ["people", "People & Organisations"],
    (c.places.length || c.events.length) && ["experience", "Where to experience"], (c.collections.length || c.collaborations.length) && ["journeys", "Collections & Collaborations"], heritage.sources?.length && ["sources", "Sources"],
  ].filter(Boolean) as [string, string][];

  return <article>
    <header className="relative isolate overflow-hidden border-b border-border">
      <img src={heritage.image} alt={heritage.name} className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/10" />
      <div className="container-editorial flex min-h-[26rem] flex-col justify-end py-12 text-background md:min-h-[32rem] md:py-16">
        <p className="eyebrow text-background/80"><Link to="/understand-indonesia/heritage" className="hover:underline">Heritage</Link> · {heritageType(heritage)}{where ? ` · ${where.label}` : ""}</p>
        <h1 className="display-1 mt-4 max-w-4xl">{heritage.name}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-background/85">{heritage.summary}</p>
        <div className="mt-6 flex flex-wrap gap-2 text-xs">
          {topics.map((topic) => <Link key={topic.id} to="/understand-indonesia/topics/$slug" params={{ slug: topic.slug }} className="inline-flex min-h-9 items-center rounded-full border border-background/40 px-3 hover:bg-background/10">{topic.id}</Link>)}
          {heritage.unesco ? <span className="inline-flex min-h-9 items-center rounded-full bg-background/95 px-3 text-primary">{heritage.unesco}</span> : null}
        </div>
      </div>
    </header>

    {jump.length > 1 ? <nav aria-label="On this page" className="sticky top-14 z-20 border-b border-border bg-background/95 backdrop-blur md:top-16">
      <ul className="container-editorial flex gap-6 overflow-x-auto text-sm whitespace-nowrap">{jump.map(([id, label]) => <li key={id}><a href={`#${id}`} className="inline-flex min-h-12 items-center text-muted-foreground hover:text-primary">{label}</a></li>)}</ul>
    </nav> : null}

    <div className="container-editorial space-y-16 py-14 md:py-20">
      <section id="overview" className="grid scroll-mt-32 gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="max-w-2xl space-y-8">
          {heritage.whatItIs ? <Block title="What it is">{heritage.whatItIs}</Block> : null}
          {heritage.whyMatters ? <Block title="Why it matters">{heritage.whyMatters}</Block> : null}
          {heritage.today ? <Block title="Today">{heritage.today}</Block> : null}
          {heritage.sensitivity ? <div className="border-l-2 border-primary bg-pale/40 p-5"><p className="eyebrow text-deep-red">Respectful engagement</p><p className="mt-2 text-[0.95rem] leading-relaxed text-ink">{heritage.sensitivity}</p></div> : null}
        </div>
        <dl className="h-fit space-y-4 border-t border-border pt-5 text-sm lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
          <Fact label="Type">{heritageType(heritage)}</Fact>
          {heritage.practisedIn ? <Fact label="Where it is practised">{heritage.practisedIn}</Fact> : null}
          {heritage.whoCarries ? <Fact label="Who carries it">{heritage.whoCarries}</Fact> : null}
          {heritage.aliases?.length ? <Fact label="Also known as">{heritage.aliases.slice(0, 4).join(", ")}</Fact> : null}
          {heritage.reviewedBy ? <Fact label="Reviewed with">{heritage.reviewedBy}</Fact> : null}
        </dl>
      </section>

      {c.articles.length ? <Section id="articles" title="Related Articles" note="Articles that discuss this heritage.">
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{c.articles.map((story) => <li key={story.id}><Link to="/stories/$slug" params={{ slug: story.slug }} className="group block"><img src={story.image} alt={story.imageAlt} loading="lazy" className="aspect-[3/2] w-full object-cover" /><h3 className="mt-4 text-lg leading-snug font-medium text-ink group-hover:text-primary">{story.title}</h3><p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{story.dek}</p></Link></li>)}</ul>
      </Section> : null}

      {(c.people.length || c.communities.length || c.organisations.length) ? <Section id="people" title="People & Organisations" note="Connected to this heritage through practice, stewardship or research — not authorship of related articles.">
        <div className="grid gap-10 md:grid-cols-3">
          {c.people.length ? <Group title="Related People">{c.people.map((p) => <Row key={p.id} image={p.image} to="/people/$slug" slug={p.slug} name={p.name} meta={p.role} />)}</Group> : null}
          {c.communities.length ? <Group title="Related Communities">{c.communities.map((p) => <Row key={p.id} image={p.image} to="/people/$slug" slug={p.slug} name={p.name} meta={p.based} />)}</Group> : null}
          {c.organisations.length ? <Group title="Related Organisations">{c.organisations.map((i) => <Row key={i.id} image={i.image} to="/institutions/$slug" slug={i.slug} name={i.name} meta={`${i.type} · ${i.city}`} />)}</Group> : null}
        </div>
      </Section> : null}

      {(c.places.length || c.events.length) ? <Section id="experience" title="Where to experience it" note={heritage.experienceIt}>
        <div className="grid gap-10 md:grid-cols-2">
          {c.places.length ? <Group title="Related Places">{c.places.map((p) => <Row key={p.id} image={p.image} to="/places/$slug" slug={p.slug} name={p.name} meta={`${p.type} · ${p.country}`} />)}</Group> : null}
          {c.events.length ? <Group title="Related Events">{c.events.map((e) => <li key={e.id} className="border-b border-border py-3 last:border-b-0"><Link to="/events/$slug" params={{ slug: e.slug }} className="group block"><span className="text-xs text-muted-foreground">{formatEventDates(e)} · {e.type}</span><span className="mt-1 block font-medium text-ink group-hover:text-primary">{e.title}</span></Link></li>)}</Group> : null}
        </div>
      </Section> : null}

      {(c.collections.length || c.collaborations.length) ? <Section id="journeys" title="Collections & Collaborations">
        <div className="grid gap-10 md:grid-cols-2">
          {c.collections.length ? <Group title="Related Collections">{c.collections.map((col) => <li key={col.id} className="border-b border-border py-3 last:border-b-0"><Link to="/understand-indonesia/collections/$slug" params={{ slug: col.slug }} className="group block"><span className="font-medium text-ink group-hover:text-primary">{col.title}</span><span className="mt-1 block text-sm text-muted-foreground">{col.storyIds.length} stories · Follow the journey</span></Link></li>)}</Group> : null}
          {c.collaborations.length ? <Group title="Related Collaborations">{c.collaborations.map((col) => <li key={col.id} className="border-b border-border py-3 last:border-b-0"><Link to="/collaborate/$slug" params={{ slug: col.slug }} className="group block"><span className="font-medium text-ink group-hover:text-primary">{col.title}</span><span className="mt-1 block text-sm text-muted-foreground">{col.countries.join(" · ")} · {col.years}</span></Link></li>)}</Group> : null}
        </div>
      </Section> : null}

      {heritage.sources?.length ? <Section id="sources" title="Sources & References">
        <ul className="max-w-3xl space-y-3 text-sm">{heritage.sources.map((r, i) => <li key={i}><span className="font-medium text-ink">{r.title}</span>{r.author ? <span className="text-muted-foreground"> — {r.author}</span> : null}{r.year ? <span className="text-muted-foreground">, {r.year}</span> : null}{r.note ? <span className="block text-muted-foreground">{r.note}</span> : null}</li>)}</ul>
      </Section> : null}
    </div>
  </article>;
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return <div><h2 className="display-3 text-[1.5rem] text-ink">{title}</h2><p className="mt-3 text-[1.02rem] leading-relaxed text-muted-foreground">{children}</p></div>;
}
function Fact({ label, children }: { label: string; children: ReactNode }) {
  return <div><dt className="eyebrow text-muted-foreground">{label}</dt><dd className="mt-1 leading-relaxed text-ink">{children}</dd></div>;
}
function Section({ id, title, note, children }: { id: string; title: string; note?: string | undefined; children: ReactNode }) {
  return <section id={id} className="scroll-mt-32 border-t border-border pt-10"><h2 className="display-3 text-ink">{title}</h2>{note ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{note}</p> : null}<div className="mt-8">{children}</div></section>;
}
function Group({ title, children }: { title: string; children: ReactNode }) {
  return <div><h3 className="eyebrow text-muted-foreground">{title}</h3><ul className="mt-3">{children}</ul></div>;
}
function Row({ image, to, slug, name, meta }: { image: string; to: "/people/$slug" | "/institutions/$slug" | "/places/$slug"; slug: string; name: string; meta: string }) {
  return <li className="border-b border-border py-3 last:border-b-0"><Link to={to} params={{ slug }} className="group flex items-center gap-3"><img src={image} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-sm object-cover" /><span className="min-w-0"><span className="block font-medium text-ink group-hover:text-primary">{name}</span><span className="block text-xs text-muted-foreground">{meta}</span></span></Link></li>;
}
