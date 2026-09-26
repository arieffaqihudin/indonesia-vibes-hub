import { createFileRoute } from "@tanstack/react-router";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { adminHead } from "@/lib/admin/head";
import { publicFormatFromInternal } from "@/lib/editorial";
import { useOptions } from "@/lib/cms/options";
import { formatWhen, useCms } from "@/lib/cms/store";
import { TYPE_LABEL } from "@/lib/cms/types";
import { safeAnswerHtml } from "@/lib/faq";

export const Route = createFileRoute("/admin/preview/$id")({
  head: adminHead("Preview", "Preview of unpublished content in the public design."),
  component: Preview,
});

/** Renders a record with the public site's own header, footer and typography. */
function Preview() {
  const { id } = Route.useParams();
  const cms = useCms();
  const options = useOptions();
  const r = cms.getRecord(id);
  if (!r) return <p className="py-20 text-center text-sm text-muted-foreground">Nothing to preview yet.</p>;
  const label = (key: "heritage" | "people" | "places" | "topics") => (r.relations[key] ?? []).map((x) => options[key].find((o) => o.id === x)?.label).filter(Boolean) as string[];
  const eyebrow = r.type === "article" ? `${r.relations.topics?.[0] ?? "Indonesia"} · ${publicFormatFromInternal(r.fields["format"])}` : TYPE_LABEL[r.type].one;

  return <div className="min-h-dvh bg-background">
    <div className="sticky top-0 z-[60] flex items-center justify-center gap-3 bg-ink px-4 py-2 text-xs text-primary-foreground">
      <span>{r.status === "Published" ? "Preview of the published version" : `Preview — ${r.status}, not visible to the public`}</span>
      <button type="button" onClick={() => window.close()} className="underline underline-offset-2">Close preview</button>
    </div>
    <div className="pointer-events-none"><Header /></div>
    <article>
      <header className="container-editorial pt-14 pb-10 md:pt-20">
        <p className="eyebrow text-primary">{eyebrow}</p>
        <h1 className="display-1 mt-5 max-w-4xl text-ink">{r.title || "Untitled"}</h1>
        {r.summary ? <p className="standfirst mt-6 max-w-2xl">{r.summary}</p> : null}
        {r.type === "article" ? <div className="mt-8 max-w-2xl border-y border-border bg-sand/35 px-4 py-5 sm:px-5">
          <p className="eyebrow text-primary">Article author</p>
          <p className="mt-2 text-lg font-semibold text-ink">{r.author ?? "Author not set"}</p>
          <p className="mt-3 text-sm text-muted-foreground">{formatWhen(r.publishedAt ?? r.updatedAt)}</p>
        </div> : null}
      </header>
      {r.image ? <figure className="container-editorial"><img src={r.image} alt={r.imageAlt ?? ""} className="aspect-[16/9] w-full object-cover" /></figure> : null}
      <div className="container-editorial grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] lg:gap-20">
        <div className="prose-editorial max-w-2xl text-ink" dangerouslySetInnerHTML={{ __html: safeAnswerHtml(r.body) }} />
        {(["topics", "heritage", "people", "places"] as const).some((k) => label(k).length) ? <aside className="border-t border-border pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          <h2 className="eyebrow text-ink">Related to this {TYPE_LABEL[r.type].one}</h2>
          {(["topics", "heritage", "people", "places"] as const).map((k) => label(k).length ? <section key={k} className="mt-7"><h3 className="eyebrow text-muted-foreground">{k === "people" ? "Related People" : k === "places" ? "Related Places" : k === "topics" ? "Topics" : "Heritage"}</h3><ul className="mt-3 space-y-2">{label(k).map((l) => <li key={l} className="text-sm font-medium text-ink">{l}</li>)}</ul></section> : null)}
        </aside> : null}
      </div>
    </article>
    <div className="pointer-events-none"><Footer /></div>
  </div>;
}
