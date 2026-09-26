import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";

import { stories } from "@/data/content";
import { adminHead } from "@/lib/studio/head";
import { useCollections } from "@/lib/collections";
import { HERO_LIMIT_MESSAGE, useHomepageSettings, type HomepageSectionId } from "@/lib/homepage";
import { useOptions } from "@/lib/cms/options";
import { useCms } from "@/lib/cms/store";
import { AddSearch, MultiPicker, OrderedList } from "@/components/cms/pickers";
import { Field, PageHeader, Select, TextArea, TextInput, Toggle, btn } from "@/components/cms/ui";

export const Route = createFileRoute("/studio/homepage")({
  head: adminHead("Homepage", "Choose the hero articles and what each homepage section shows."),
  component: Homepage,
});

function Block({ title, hint, children, aside }: { title: string; hint?: string; children: ReactNode; aside?: ReactNode }) {
  return <section className="rounded-lg border border-border bg-background">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3"><div><h2 className="text-sm font-semibold text-ink">{title}</h2>{hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}</div>{aside}</header>
    <div className="space-y-4 p-4">{children}</div>
  </section>;
}

function Homepage() {
  const cms = useCms();
  const options = useOptions();
  const [collections] = useCollections();
  const [s, setS] = useHomepageSettings(stories.map((st) => st.id));
  const set = (patch: Partial<typeof s>) => setS({ ...s, ...patch });
  const published = cms.byType("article").filter((a) => a.status === "Published");
  const heroIds = s.hero.map((h) => h.articleId);
  const sections = [...s.sections].sort((a, b) => a.order - b.order);
  const section = (id: HomepageSectionId) => sections.find((x) => x.id === id)!;
  const setVisible = (id: HomepageSectionId, visible: boolean) => set({ sections: s.sections.map((x) => (x.id === id ? { ...x, visible } : x)) });
  const vis = (id: HomepageSectionId) => <div className="w-32"><Toggle label="Visible" checked={section(id).visible} onChange={(v) => setVisible(id, v)} /></div>;
  const profileOptions = [...options.people, ...options.communities, ...options.organisations];

  return <div className="mx-auto max-w-4xl space-y-5">
    <PageHeader title="Homepage" description="Changes are saved automatically." actions={<a href="/" target="_blank" rel="noreferrer" className={btn.secondary}><ExternalLink className="h-4 w-4" />Preview</a>} />

    <Block title="Hero" hint="Recommended 3–5 published articles. Maximum 5." aside={<span className="text-xs text-muted-foreground">{heroIds.length} / 5</span>}>
      <OrderedList items={heroIds} max={5} onChange={(ids) => set({ hero: ids.map((articleId) => s.hero.find((h) => h.articleId === articleId) ?? { articleId }) })} render={(id) => { const a = cms.getRecord(id); return { title: a?.title ?? "Missing article", meta: a?.author, image: a?.image }; }} />
      <AddSearch disabled={heroIds.length >= 5} options={published.filter((a) => !heroIds.includes(a.id)).map((a) => ({ id: a.id, label: a.title }))} onAdd={(id) => { if (heroIds.length >= 5) { toast.error(HERO_LIMIT_MESSAGE); return; } set({ hero: [...s.hero, { articleId: id }] }); }} placeholder={heroIds.length >= 5 ? "Hero is full — remove an article to add another" : "Add a published article…"} />
    </Block>

    <Block title="Understand Indonesia" aside={vis("understand")}>
      <MultiPicker label="Featured Topics" options={options.topics} value={s.featuredTopicIds} onChange={(featuredTopicIds) => set({ featuredTopicIds })} />
      <Field label="Featured Collection" htmlFor="fc"><Select id="fc" value={s.featuredCollectionId ?? ""} onChange={(v) => set({ featuredCollectionId: v || undefined })} options={collections.map((c) => ({ value: c.id, label: c.title }))} placeholder="None" /></Field>
      <MultiPicker label="Featured People & Organisations" options={profileOptions} value={s.featuredProfileIds} onChange={(featuredProfileIds) => set({ featuredProfileIds })} />
    </Block>

    <Block title="Latest Articles" aside={vis("latest")}>
      <Field label="Number of articles" htmlFor="lim"><Select id="lim" value={String(s.latestArticleLimit)} onChange={(v) => set({ latestArticleLimit: Number(v) })} options={["4", "5", "6", "7", "8"]} /></Field>
      <Toggle label="Leave out articles already in the Hero" checked={s.excludeHeroFromLatest} onChange={(excludeHeroFromLatest) => set({ excludeHeroFromLatest })} />
    </Block>

    <Block title="Experience Indonesia" aside={vis("experience")}>
      <MultiPicker label="Featured Places" options={options.places} value={s.featuredPlaceIds} onChange={(featuredPlaceIds) => set({ featuredPlaceIds })} />
      <p className="text-xs text-muted-foreground">Upcoming events appear automatically.</p>
    </Block>

    <Block title="Indonesia Around the World" aside={vis("around-world")}>
      <MultiPicker label="Featured Collaborations" options={options.collaborations} value={s.featuredCollaborationIds} onChange={(featuredCollaborationIds) => set({ featuredCollaborationIds })} />
    </Block>

    <Block title="Collaborate with Indonesia" aside={vis("collaborate")}>
      <Field label="Headline" htmlFor="ch"><TextInput id="ch" value={s.collaborateHeadline ?? ""} onChange={(v) => set({ collaborateHeadline: v })} /></Field>
      <Field label="Introduction" htmlFor="ci"><TextArea id="ci" value={s.collaborateIntroduction ?? ""} onChange={(v) => set({ collaborateIntroduction: v })} /></Field>
      <Field label="Button label" htmlFor="cb"><TextInput id="cb" value={s.collaborateCtaLabel ?? ""} onChange={(v) => set({ collaborateCtaLabel: v })} /></Field>
    </Block>
  </div>;
}
