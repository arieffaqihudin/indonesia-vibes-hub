import type { JSONContent } from "@tiptap/core";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft, Check, ChevronDown, Eye, Focus, ImageIcon, PanelRight, Save, Settings, X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { abtn, field, Modal, StatusPill } from "@/components/admin/primitives";
import { useAdmin } from "@/lib/admin/store";
import { allGraphEntries, blockedForPublication, graphEntry, relationshipGroups } from "@/lib/admin/selectors";
import { CONTENT_STATUS, RIGHTS_STATUSES, can, type ContentItem, type RightsStatus } from "@/lib/admin/types";
import { DELIVERY_HELP, DELIVERY_PUBLIC_LABEL, DELIVERY_TYPES, contentSourceOf, type DeliveryType } from "@/lib/editorial";
import { AttributionSettings, CURATION_CHECKS } from "./AttributionSettings";
import { TOPICS } from "@/lib/topics";
import { articleDocument, articleSlug, documentText } from "@/lib/article-editor";
import { HERO_LIMIT_MESSAGE, useHomepageSettings } from "@/lib/homepage";
import { cn } from "@/lib/utils";
import type { HeroItem } from "@/lib/homepage";
import { RichBlockEditor } from "./RichBlockEditor";
import { ArticleDocument } from "./ArticleDocument";
import { RelationPicker } from "@/components/admin/RelationPicker";

type SaveState = "Saved" | "Saving…";
type MediaDraft = { kind: "image" | "gallery"; target: "cover" | "body"; url: string; caption: string; credit: string; alt: string; permission: RightsStatus };

const settingInput = cn(field, "mt-1 min-h-9 py-1.5 text-xs");

function SettingsGroup({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  return <details open={open} className="group border-b border-border py-1">
    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-xs font-semibold text-ink"><span>{title}</span><ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" /></summary>
    <div className="space-y-3 pb-4">{children}</div>
  </details>;
}

export function ArticleEditorWorkspace({ id }: { id: string }) {
  const admin = useAdmin();
  const item = admin.getContent(id);
  const initial = useRef(item);
  const [title, setTitle] = useState(item?.title ?? "");
  const [standfirst, setStandfirst] = useState(item?.fields["standfirst"] ?? "");
  const [document, setDocument] = useState<JSONContent>(() => item ? articleDocument(item) : { type: "doc", content: [{ type: "paragraph" }] });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [mediaDraft, setMediaDraft] = useState<MediaDraft | null>(null);
  const [savedState, setSavedState] = useState<SaveState>("Saved");
  const [savedAt, setSavedAt] = useState<Date>(() => new Date(item?.updatedAt ?? Date.now()));
  const [connectionQuery, setConnectionQuery] = useState("");
  const [sourceForm, setSourceForm] = useState({ title: "", author: "", year: "", url: "" });
  const publishedIds = admin.content.filter((entry) => entry.kind === "story" && entry.status === "published").map((entry) => entry.id);
  const [homepage, setHomepage] = useHomepageSettings(publishedIds);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cover = item?.fields["heroMedia"] ?? "";
  const articleSources = admin.sources.filter((source) => source.contentId === id);
  const heroIndex = homepage.hero.findIndex((hero) => hero.articleId === id || `c-${hero.articleId}` === id);
  const hero = heroIndex >= 0 ? homepage.hero[heroIndex] : undefined;

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("iv-article-focus", { detail: focusMode }));
    return () => { window.dispatchEvent(new CustomEvent("iv-article-focus", { detail: false })); };
  }, [focusMode]);

  useEffect(() => {
    if (window.matchMedia("(min-width: 1280px)").matches) setSettingsOpen(true);
  }, []);

  useEffect(() => {
    if (!item || !initial.current) return;
    setSavedState("Saving…");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      admin.updateContent(id, {
        title: title || "Untitled article",
        slug: item.slug || articleSlug(title),
        articleDocument: JSON.stringify(document),
        fields: { ...item.fields, title, standfirst, narrative: documentText(document) },
      });
      setSavedState("Saved");
      setSavedAt(new Date());
    }, 700);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [title, standfirst, document]);

  if (!item) return <div className="py-20 text-center text-sm text-muted-foreground">Opening article editor…</div>;

  const manualSave = () => {
    if (timer.current) clearTimeout(timer.current);
    admin.updateContent(id, { title: title || "Untitled article", slug: item.slug || articleSlug(title), articleDocument: JSON.stringify(document), fields: { ...item.fields, title, standfirst, narrative: documentText(document) } }, "saved the article draft");
    setSavedState("Saved"); setSavedAt(new Date());
  };
  const patchFields = (patch: Record<string, string>) => admin.updateContent(id, { fields: { ...item.fields, ...patch } });
  const updateHero = (patch: Partial<HeroItem>, enabled = true) => {
    if (!enabled) return setHomepage({ ...homepage, hero: homepage.hero.filter((_, index) => index !== heroIndex) });
    if (!hero && homepage.hero.length >= 5) return window.alert(HERO_LIMIT_MESSAGE);
    const next = hero ? homepage.hero.map((entry, index) => index === heroIndex ? { ...entry, ...patch } : entry) : [...homepage.hero, { articleId: id, ...patch }];
    setHomepage({ ...homepage, hero: next });
  };
  const addMedia = (draft: MediaDraft) => {
    if (!draft.url) return;
    const assetId = `media-${Math.random().toString(36).slice(2, 9)}`;
    admin.addMedia({ id: assetId, contentId: id, kind: "Image", fileName: draft.url.split("/").pop() || "Article image", preview: draft.url, caption: draft.caption, creator: draft.credit, credit: draft.credit, rightsHolder: draft.credit || "To confirm", permission: draft.permission, altText: draft.alt, required: false, updatedAt: new Date().toISOString() });
    const node = draft.kind === "gallery" ? { type: "gallery", attrs: { images: draft.url, caption: draft.caption } } : { type: "mediaFigure", attrs: { src: draft.url, alt: draft.alt, caption: draft.caption, credit: draft.credit, permission: draft.permission } };
    setDocument({ ...document, content: [...(document.content ?? []), node] });
    setMediaDraft(null);
  };
  const checks = [
    { label: "Title", ok: Boolean(title.trim()), required: true },
    { label: "Topic", ok: Boolean(item.topics?.length), required: true },
    { label: "Article content", ok: documentText(document).trim().length > 20, required: true },
    { label: "Hero image", ok: Boolean(cover), required: true },
    { label: "Source requirements", ok: contentSourceOf(item) !== "By Curation" || Boolean(item.fields["originalSource"] || item.fields["originalSubmission"] || item.fields["coContributors"] || articleSources.length), required: true },
    ...(contentSourceOf(item) === "By Curation" ? [{ label: "Curation checks complete", ok: CURATION_CHECKS.every((key) => item.fields[key] === "yes"), required: true }] : []),
    { label: "Media permission", ok: blockedForPublication(item, admin.media).length === 0, required: true },
    { label: "Connection recommended", ok: Object.values(item.relationships).some((values) => values.length), required: false },
  ];
  const blocking = checks.some((check) => check.required && !check.ok);
  const savedLabel = savedState === "Saving…" ? savedState : `Saved ${Math.max(0, Math.floor((Date.now() - savedAt.getTime()) / 60000)) < 1 ? "just now" : `${Math.floor((Date.now() - savedAt.getTime()) / 60000)} min ago`}`;

  return <div className={cn("article-workspace -mx-4 -my-6 min-h-[calc(100vh-4.25rem)] bg-card sm:-mx-6 lg:-mx-7", focusMode && "min-h-screen")}>
    <header className="sticky top-0 z-20 flex min-h-14 flex-wrap items-center gap-2 border-b border-border bg-card/95 px-3 py-2 backdrop-blur-sm sm:px-5">
      <Link to="/admin/articles" className="inline-flex min-h-10 items-center gap-2 rounded px-2 text-sm text-ink hover:bg-muted"><ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Articles</span></Link>
      <span className="hidden h-5 border-l border-border sm:block" />
      <StatusPill status={item.status} />
      <span className="text-xs text-muted-foreground" aria-live="polite">{savedLabel}</span>
      <div className="ml-auto flex items-center gap-1.5">
        <button type="button" className={cn(abtn.small, "hidden md:inline-flex")} onClick={() => setFocusMode((value) => !value)}><Focus className="h-4 w-4" /> {focusMode ? "Exit focus" : "Focus"}</button>
         <a href={item.publicPath ?? `/admin/content/${id}/preview`} target="_blank" rel="noreferrer" className={abtn.small}><Eye className="h-4 w-4" /><span className="hidden sm:inline">Preview</span></a>
        <button type="button" className={cn(abtn.small, "hidden sm:inline-flex")} onClick={manualSave}><Save className="h-4 w-4" /> Save Draft</button>
        <button type="button" className={cn(abtn.small, "xl:hidden")} onClick={() => setSettingsOpen(true)}><Settings className="h-4 w-4" /><span className="hidden sm:inline">Settings</span></button>
         <button type="button" className={abtn.primary} onClick={() => setPublishOpen(true)}>{can(admin.role, "publish") ? item.status === "published" ? "Update" : "Publish" : "Submit for Review"}</button>
      </div>
    </header>

    <div className={cn("mx-auto grid max-w-[92rem]", settingsOpen && !focusMode ? "xl:grid-cols-[minmax(0,1fr)_300px]" : "grid-cols-1")}>
      <main className="min-w-0 px-5 py-10 sm:px-10 lg:px-14 xl:px-16">
        <div className="mx-auto max-w-3xl">
          <textarea aria-label="Article title" rows={1} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Add title" className="w-full resize-none overflow-hidden border-0 bg-transparent text-4xl leading-tight font-semibold text-ink outline-none placeholder:text-muted-foreground/45 sm:text-5xl" />
          <textarea aria-label="Standfirst" rows={2} value={standfirst} onChange={(event) => setStandfirst(event.target.value)} placeholder="Add a short introduction…" className="mt-5 w-full resize-none border-0 bg-transparent text-lg leading-relaxed text-muted-foreground outline-none placeholder:text-muted-foreground/45 sm:text-xl" />

          <div className="mt-8">
            {cover ? <figure className="group relative"><img src={cover} alt={item.fields["heroAlt"] ?? ""} className="aspect-[16/9] w-full object-cover" /><div className="absolute top-3 right-3 hidden gap-1 group-hover:flex"><button type="button" className={abtn.small} onClick={() => setMediaDraft({ kind: "image", target: "cover", url: cover, caption: item.fields["heroCaption"] ?? "", credit: item.fields["heroCredit"] ?? "", alt: item.fields["heroAlt"] ?? "", permission: (item.fields["heroPermission"] as RightsStatus) || "Needs confirmation" })}>Change</button></div><figcaption className="mt-2 text-xs text-muted-foreground">{item.fields["heroCaption"] || "Cover image"}{item.fields["heroCredit"] ? ` — ${item.fields["heroCredit"]}` : ""}</figcaption></figure> : <button type="button" className="flex aspect-[16/7] w-full flex-col items-center justify-center border border-dashed border-border bg-muted/35 text-sm text-muted-foreground hover:border-primary hover:text-primary" onClick={() => setMediaDraft({ kind: "image", target: "cover", url: "", caption: "", credit: "", alt: "", permission: "Needs confirmation" })}><ImageIcon className="mb-2 h-5 w-5" /> Add cover image</button>}
          </div>

          <div className="mt-10"><RichBlockEditor value={document} onChange={setDocument} onAddMedia={(kind) => setMediaDraft({ kind, target: "body", url: "", caption: "", credit: "", alt: "", permission: "Needs confirmation" })} /></div>
        </div>
      </main>

      {!focusMode && settingsOpen ? <><button type="button" aria-label="Close article settings" className="fixed inset-0 z-40 bg-ink/25 xl:hidden" onClick={() => setSettingsOpen(false)} /><aside className={cn("border-l border-border bg-background", "max-xl:fixed max-xl:inset-y-0 max-xl:right-0 max-xl:z-50 max-xl:w-[min(320px,90vw)] max-xl:shadow-lg")}>
        <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto px-5 pb-10">
          <div className="flex min-h-14 items-center justify-between border-b border-border"><h2 className="text-sm font-semibold text-ink">Article Settings</h2><button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-ink" onClick={() => setSettingsOpen(false)} title="Collapse settings"><X className="h-4 w-4" /></button></div>
          <SettingsGroup title="Article" open>
            <label className="block text-xs text-muted-foreground">Status<div className="mt-2"><StatusPill status={item.status} /></div></label>
            <label className="block text-xs text-muted-foreground">Primary topic<input list="article-topics" className={settingInput} value={item.topics?.[0] ?? ""} onChange={(event) => admin.updateContent(id, { topics: event.target.value ? [event.target.value, ...(item.topics?.slice(1) ?? [])] : item.topics?.slice(1) ?? [] })} placeholder="Search topics" /><datalist id="article-topics">{TOPICS.map((topic) => <option key={topic.id} value={topic.id} />)}</datalist></label>
            <div><p className="text-xs text-muted-foreground">Additional topics</p><div className="mt-1 flex flex-wrap gap-1">{TOPICS.filter((topic) => item.topics?.[0] !== topic.id).slice(0, 8).map((topic) => <button type="button" key={topic.id} onClick={() => admin.updateContent(id, { topics: item.topics?.includes(topic.id) ? item.topics.filter((value) => value !== topic.id) : [...(item.topics ?? []), topic.id] })} className={cn("rounded border px-2 py-1 text-[0.68rem]", item.topics?.includes(topic.id) ? "border-primary bg-blush text-primary" : "border-border text-muted-foreground")}>{topic.id}</button>)}</div></div>
            <label className="block text-xs text-muted-foreground">Delivery Type<select className={settingInput} value={item.deliveryType ?? "Semantic"} onChange={(event) => admin.updateContent(id, { deliveryType: event.target.value as DeliveryType })}>{DELIVERY_TYPES.map((type) => <option key={type}>{type}</option>)}</select><span className="mt-1 block text-[0.68rem]">{DELIVERY_HELP[item.deliveryType ?? "Semantic"]} Public: {DELIVERY_PUBLIC_LABEL[item.deliveryType ?? "Semantic"]}.</span></label>
          </SettingsGroup>
          <SettingsGroup title="Author" open>
            <p className="text-[0.68rem] leading-relaxed text-muted-foreground">Controls the public byline. Authors are separate from people connected to the article subject.</p>
            <AttributionSettings item={item} patchFields={patchFields} setSource={(source) => admin.updateContent(id, { contentSource: source })} />
          </SettingsGroup>
          <SettingsGroup title="Publication" open>
            <label className="block text-xs text-muted-foreground">Publication date<input type="date" className={settingInput} value={(item.publishedAt ?? "").slice(0,10)} onChange={(event) => { if (event.target.value) admin.updateContent(id, { publishedAt: new Date(`${event.target.value}T00:00:00Z`).toISOString() }); }} /></label>
            <label className="block text-xs text-muted-foreground">Slug<input className={settingInput} value={item.slug ?? ""} onChange={(event) => admin.updateContent(id, { slug: articleSlug(event.target.value) })} placeholder={articleSlug(title)} /></label>
          </SettingsGroup>

          <SettingsGroup title="Cover image">
            {cover ? <img src={cover} alt="" className="aspect-[16/9] w-full rounded-sm object-cover" /> : null}
            <div className="flex gap-2"><button type="button" className={abtn.small} onClick={() => setMediaDraft({ kind: "image", target: "cover", url: cover, caption: item.fields["heroCaption"] ?? "", credit: item.fields["heroCredit"] ?? "", alt: item.fields["heroAlt"] ?? "", permission: (item.fields["heroPermission"] as RightsStatus) || "Needs confirmation" })}>{cover ? "Change" : "Upload"}</button>{cover ? <button type="button" className={abtn.quiet} onClick={() => patchFields({ heroMedia: "", heroCaption: "", heroCredit: "", heroAlt: "" })}>Remove</button> : null}</div>
            <label className="block text-xs text-muted-foreground">Focal point<select className={settingInput} value={item.fields["heroFocal"] ?? "Center"} onChange={(event) => patchFields({ heroFocal: event.target.value })}><option>Center</option><option>Top</option><option>Bottom</option><option>Left</option><option>Right</option></select></label>
          </SettingsGroup>

          <SettingsGroup title="Homepage Hero">
            <label className="flex items-center justify-between gap-3 text-xs text-ink"><span>Feature in Homepage Hero</span><input type="checkbox" checked={Boolean(hero)} onChange={(event) => updateHero({}, event.target.checked)} /></label>
            {hero ? <><label className="block text-xs text-muted-foreground">Hero Order<select className={settingInput} value={heroIndex + 1} onChange={(event) => { const next=[...homepage.hero]; const [entry]=next.splice(heroIndex,1); if (!entry) return; next.splice(Number(event.target.value)-1,0,entry); setHomepage({...homepage,hero:next}); }}>{homepage.hero.map((_,index)=><option key={index} value={index+1}>{index+1}</option>)}</select></label>{([['image','Hero Image'],['headline','Optional Hero Headline'],['summary','Optional Hero Summary']] as const).map(([key,label]) => <label key={key} className="block text-xs text-muted-foreground">{label}<input className={settingInput} value={hero[key] ?? ""} onChange={(event) => updateHero({ [key]: event.target.value })} /></label>)}</> : null}
          </SettingsGroup>

          <SettingsGroup title="Connections">
            <div><p className="text-[0.68rem] font-semibold text-muted-foreground">Related Topics</p><div className="mt-1 flex flex-wrap gap-1">{item.topics?.length ? item.topics.map((topic) => <span key={topic} className="rounded border border-border bg-muted/35 px-2 py-1 text-[0.68rem] text-ink">{topic}</span>) : <span className="text-[0.68rem] text-muted-foreground">Add Topics in Article settings.</span>}</div></div>
            <RelationPicker id={id} group="culture" label="Related Heritage" placeholder="Search heritage, e.g. Gamelan…" filter={(detail) => detail === "heritage"} />
            <RelationPicker id={id} group="institutions" label="Related Organisations" placeholder="Search museums, universities…" />
            <label className="block text-xs text-muted-foreground">Add a related record<input className={settingInput} value={connectionQuery} onChange={(event) => setConnectionQuery(event.target.value)} placeholder="Search people, places, events…" /></label>
            {connectionQuery ? <ul className="max-h-40 overflow-auto border border-border bg-card">{allGraphEntries.filter((entry) => `${entry.label} ${entry.detail ?? ""}`.toLowerCase().includes(connectionQuery.toLowerCase())).slice(0,8).map((entry) => <li key={entry.id}><button type="button" className="w-full px-2 py-2 text-left text-xs text-ink hover:bg-muted" onClick={() => { admin.addRelationship(id, entry.group, entry.id); setConnectionQuery(""); }}>{entry.label}<span className="block text-[0.68rem] text-muted-foreground">{entry.detail}</span></button></li>)}</ul> : null}
            {relationshipGroups.map((group) => item.relationships[group.key].length ? <div key={group.key}><p className="text-[0.68rem] font-semibold text-muted-foreground">{group.key === "people" ? "Related People" : group.key === "places" ? "Related Places" : group.label}</p><div className="mt-1 space-y-1">{item.relationships[group.key].map((rid) => { const entry = graphEntry(rid); const relatedVia = group.key === "people" ? item.topics?.find((topic) => entry?.detail && `${entry.label} ${entry.detail}`.toLowerCase().includes(topic.toLowerCase())) : undefined; return <div key={rid} className="flex items-center justify-between gap-2 border border-border px-2 py-1.5"><span className="min-w-0 text-[0.68rem] text-ink"><span className="block truncate font-medium">{entry?.label ?? rid}</span>{relatedVia ? <span className="block text-muted-foreground">Related via: {relatedVia}</span> : <span className="block text-muted-foreground">Direct relationship</span>}</span><button type="button" className="shrink-0 text-[0.68rem] text-muted-foreground hover:text-primary" onClick={() => admin.removeRelationship(id, group.key, rid)} aria-label={`Remove ${entry?.label ?? rid}`}>Remove</button></div>; })}</div></div> : null)}
          </SettingsGroup>

          <SettingsGroup title="Sources">
            {articleSources.map((source) => <div key={source.id} className="border-l-2 border-border pl-2 text-xs"><p className="font-medium text-ink">{source.title}</p><p className="text-muted-foreground">{[source.author,source.year].filter(Boolean).join(" · ")}</p></div>)}
            {(["title","author","year","url"] as const).map((key) => <label key={key} className="block text-xs text-muted-foreground">{key === "author" ? "Author / Institution" : key === "url" ? "URL" : key === "year" ? "Year" : "Title"}<input className={settingInput} value={sourceForm[key]} onChange={(event) => setSourceForm({...sourceForm,[key]:event.target.value})} /></label>)}
            <button type="button" className={abtn.small} disabled={!sourceForm.title.trim()} onClick={() => { admin.upsertSource({ id:`src-${Math.random().toString(36).slice(2,8)}`,contentId:id,title:sourceForm.title,author:sourceForm.author,year:sourceForm.year,url:sourceForm.url,type:"Other",status:"Unverified" }); setSourceForm({title:"",author:"",year:"",url:""}); }}>+ Add Source</button>
          </SettingsGroup>

          {item.deliveryType === "Pragmatic" ? <SettingsGroup title="Editorial Review"><label className="block text-xs text-muted-foreground">Main Claim<textarea className={settingInput} rows={3} value={item.fields["mainClaim"] ?? ""} onChange={(event) => patchFields({mainClaim:event.target.value})} /></label><label className="block text-xs text-muted-foreground">Evidence<textarea className={settingInput} rows={3} value={item.fields["evidence"] ?? ""} onChange={(event) => patchFields({evidence:event.target.value})} /></label><label className="block text-xs text-muted-foreground">Context / Nuance<textarea className={settingInput} rows={3} value={item.fields["contextNuance"] ?? ""} onChange={(event) => patchFields({contextNuance:event.target.value})} /></label></SettingsGroup> : null}
          <SettingsGroup title="History"><p className="text-xs text-muted-foreground">{CONTENT_STATUS[item.status].meaning}</p><p className="text-xs text-muted-foreground">Assigned to <span className="text-ink">{item.assignedTo ?? "Unassigned"}</span></p><p className="text-xs text-muted-foreground">{item.versions.length} saved version{item.versions.length === 1 ? "" : "s"}</p></SettingsGroup>
        </div>
      </aside></> : null}
      {!focusMode && !settingsOpen ? <button type="button" className="fixed right-4 bottom-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-ink shadow-md xl:right-6" onClick={() => setSettingsOpen(true)} title="Open article settings"><PanelRight className="h-4 w-4" /></button> : null}
    </div>

    <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title="Article preview"><div className="max-h-[75vh] overflow-y-auto bg-card"><div className="border-b border-border bg-blush/50 px-5 py-2 text-center text-xs font-semibold text-deep-red">Preview — {item.status === "published" ? "Published" : "Not Published"}</div><article className="mx-auto max-w-3xl px-5 py-10 sm:px-10"><p className="text-xs font-semibold text-primary uppercase">{DELIVERY_PUBLIC_LABEL[item.deliveryType ?? "Semantic"]} · {item.topics?.[0] ?? "Topic not set"}</p><h1 className="mt-4 text-4xl font-semibold text-ink sm:text-5xl">{title || "Untitled article"}</h1><p className="mt-5 text-xl leading-relaxed text-muted-foreground">{standfirst}</p>{cover ? <img src={cover} alt={item.fields["heroAlt"] ?? ""} className="mt-8 aspect-[16/9] w-full object-cover" /> : null}<div className="mt-10"><ArticleDocument document={document} /></div></article></div></Modal>

    <Modal open={publishOpen} onClose={() => setPublishOpen(false)} title={can(admin.role, "publish") ? item.status === "published" ? "Update article" : "Publish article" : "Submit for review"}><ul className="space-y-2">{checks.map((check) => <li key={check.label} className="flex items-center gap-2 text-sm"><span className={check.ok ? "text-ink" : "text-primary"}>{check.ok ? "✓" : "○"}</span><span className={check.ok ? "text-ink" : check.required ? "text-primary" : "text-muted-foreground"}>{check.label}</span>{!check.required ? <span className="ml-auto text-xs text-muted-foreground">Recommended</span> : null}</li>)}</ul><div className="mt-5 flex justify-end gap-2"><button type="button" className={abtn.secondary} onClick={() => setPublishOpen(false)}>Continue editing</button><button type="button" className={abtn.primary} disabled={blocking} onClick={() => { manualSave(); admin.transition(id, can(admin.role,"publish") ? "published" : "editorial_review"); setPublishOpen(false); }}>{can(admin.role,"publish") ? item.status === "published" ? "Update" : "Publish" : "Submit for Review"}</button></div></Modal>

    <Modal open={Boolean(mediaDraft)} onClose={() => setMediaDraft(null)} title={mediaDraft?.kind === "gallery" ? "Insert gallery" : mediaDraft?.target === "cover" ? "Cover image" : "Insert image"}>{mediaDraft ? <MediaEditor draft={mediaDraft} setDraft={setMediaDraft} existing={admin.media.filter((asset) => asset.preview)} onDone={(draft) => { if (draft.target === "cover") { patchFields({heroMedia:draft.url,heroCaption:draft.caption,heroCredit:draft.credit,heroAlt:draft.alt,heroPermission:draft.permission}); setMediaDraft(null); } else addMedia(draft); }} /> : null}</Modal>
  </div>;
}

function MediaEditor({ draft, setDraft, existing, onDone }: { draft: MediaDraft; setDraft: (value: MediaDraft) => void; existing: ReturnType<typeof useAdmin>["media"]; onDone: (value: MediaDraft) => void }) {
  const onFile = (file?: File) => { if (!file) return; const reader=new FileReader(); reader.onload=()=>setDraft({...draft,url:String(reader.result)}); reader.readAsDataURL(file); };
  return <div className="space-y-4"><label className="block text-xs text-muted-foreground">Upload<input type="file" accept="image/*" multiple={draft.kind === "gallery"} className={settingInput} onChange={(event) => { const files=[...(event.target.files ?? [])]; if (!files.length) return; if (draft.kind === "gallery") Promise.all(files.map((file) => new Promise<string>((resolve) => { const reader=new FileReader(); reader.onload=()=>resolve(String(reader.result)); reader.readAsDataURL(file); }))).then((urls)=>setDraft({...draft,url:urls.join("\n")})); else onFile(files[0]); }} /></label>{existing.length ? <label className="block text-xs text-muted-foreground">Select from Media<select className={settingInput} value="" onChange={(event) => setDraft({...draft,url:event.target.value})}><option value="">Choose an existing image</option>{existing.map((asset)=><option key={asset.id} value={asset.preview ?? ""}>{asset.fileName}</option>)}</select></label> : null}<label className="block text-xs text-muted-foreground">Image URL<input className={settingInput} value={draft.url} onChange={(event)=>setDraft({...draft,url:event.target.value})} placeholder={draft.kind === "gallery" ? "One URL per line" : "https://…"} /></label>{draft.url && draft.kind === "image" ? <img src={draft.url} alt="Preview" className="max-h-56 w-full object-cover" /> : null}<label className="block text-xs text-muted-foreground">Caption<input className={settingInput} value={draft.caption} onChange={(event)=>setDraft({...draft,caption:event.target.value})} /></label><label className="block text-xs text-muted-foreground">Credit<input className={settingInput} value={draft.credit} onChange={(event)=>setDraft({...draft,credit:event.target.value})} /></label><label className="block text-xs text-muted-foreground">Alt Text<input className={settingInput} value={draft.alt} onChange={(event)=>setDraft({...draft,alt:event.target.value})} /></label><label className="block text-xs text-muted-foreground">Permission<select className={settingInput} value={draft.permission} onChange={(event)=>setDraft({...draft,permission:event.target.value as RightsStatus})}>{RIGHTS_STATUSES.map((right)=><option key={right}>{right}</option>)}</select></label><div className="flex justify-end gap-2"><button type="button" className={abtn.secondary} onClick={()=>setDraft({...draft,url:""})}>Clear</button><button type="button" className={abtn.primary} disabled={!draft.url} onClick={()=>onDone(draft)}><Check className="h-4 w-4" /> Use media</button></div></div>;
}