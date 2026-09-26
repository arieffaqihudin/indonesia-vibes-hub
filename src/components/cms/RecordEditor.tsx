import { useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { stories } from "@/data/content";
import { HERITAGE_TYPES } from "@/lib/heritage";
import { HERO_LIMIT_MESSAGE, useHomepageSettings } from "@/lib/homepage";
import { useCms, newId, slugify } from "@/lib/cms/store";
import { AUTHOR_OPTIONS, RELATION_LABEL, useOptions } from "@/lib/cms/options";
import { useCmsAccount } from "@/lib/cms/role";
import { CMS_STATUSES, FORMAT_OPTIONS, TYPE_LABEL, type CmsRecord, type CmsType, type RelationKey } from "@/lib/cms/types";
import { INSTITUTION_TYPES, COLLABORATION_TYPES } from "@/types/content";
import { EditorFrame, type SaveState } from "./EditorFrame";
import { RichText } from "./RichText";
import { ImageField, MultiPicker } from "./pickers";
import { Field, Panel, Select, TextArea, TextInput, Toggle, btn, inputClass, NO_DATA } from "./ui";
import { cn } from "@/lib/utils";

const EVENT_TYPES = ["Exhibition", "Performance", "Screening", "Workshop", "Residency", "Seminar", "Festival", "Award", "Book Fair"];
const PLACE_TYPES = ["Museum", "Cultural Site", "Archaeological Site", "Gallery", "Cultural Village", "Performance Venue", "Archive or Library", "Cultural Landscape", "City", "Cultural Region"];
const REGIONS = ["Sumatra", "Java", "Bali & Nusa Tenggara", "Kalimantan", "Sulawesi", "Maluku", "Papua"];

const BACK: Record<CmsType, { to: string; label: string }> = {
  article: { to: "/admin/articles", label: "Articles" },
  heritage: { to: "/admin/heritage", label: "Heritage" },
  person: { to: "/admin/people-organisations", label: "People & Organisations" },
  community: { to: "/admin/people-organisations", label: "People & Organisations" },
  organisation: { to: "/admin/people-organisations", label: "People & Organisations" },
  event: { to: "/admin/experience", label: "Experience" },
  place: { to: "/admin/experience", label: "Experience" },
  collaboration: { to: "/admin/collaborations", label: "Collaborations" },
};

const blank = (type: CmsType, editor: string): CmsRecord => ({
  id: newId(type.slice(0, 3)), type, title: "", slug: "", status: "Draft", summary: "", body: "", image: "",
  fields: type === "article" ? { format: "Knowledge", source: "Internal" } : type === "collaboration" ? { visibility: "Public" } : {},
  relations: {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), updatedBy: editor,
});

const TITLE_PLACEHOLDER: Record<CmsType, string> = {
  article: "Add article title", heritage: "Name, e.g. Gamelan", person: "Full name", community: "Community name",
  organisation: "Organisation name", event: "Event title", place: "Place name", collaboration: "Collaboration title",
};

export function RecordEditor({ id, type: newType }: { id: string; type?: CmsType }) {
  const cms = useCms();
  const account = useCmsAccount();
  const navigate = useNavigate();
  const options = useOptions();
  const existing = id === "new" ? undefined : cms.getRecord(id);
  const [draft, setDraft] = useState<CmsRecord | undefined>(() => existing ?? (newType ? blank(newType, cms.editorName) : undefined));
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const created = useRef(Boolean(existing));
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const latest = useRef(draft);
  latest.current = draft;

  // Store hydrates from the browser after first render; pick the record up once it appears.
  useEffect(() => { if (!draft && existing) { setDraft(existing); created.current = true; } }, [existing, draft]);

  const persist = useCallback((record: CmsRecord) => {
    if (!created.current) {
      cms.createRecord(record.type, record);
      created.current = true;
      void navigate({ to: BACK[record.type].to + "/$id", params: { id: record.id }, replace: true } as never);
    } else {
      cms.updateRecord(record.id, record);
    }
    setSaveState("saved");
  }, [cms, navigate]);

  const change = (patch: Partial<CmsRecord>) => {
    setDraft((d) => (d ? { ...d, ...patch } : d));
    setSaveState("saving");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { if (latest.current) persist(latest.current); }, 700);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  if (!draft) return <div className="py-20 text-center text-sm text-muted-foreground">This item could not be found. It may have been deleted.</div>;

  const d = draft;
  const f = (key: string) => d.fields[key] ?? "";
  const setField = (key: string, value: string) => change({ fields: { ...d.fields, [key]: value } });
  const rel = (key: RelationKey) => d.relations[key] ?? [];
  const setRel = (key: RelationKey, ids: string[]) => change({ relations: { ...d.relations, [key]: ids } });
  const picker = (key: RelationKey, label = RELATION_LABEL[key]) => <MultiPicker key={key} label={label} options={options[key].filter((o) => o.id !== d.id)} value={rel(key)} onChange={(ids) => setRel(key, ids)} />;
  const canPublish = account?.role !== "Contributor";

  const flush = (patch: Partial<CmsRecord> = {}) => {
    clearTimeout(timer.current);
    const next = { ...d, ...patch, slug: patch.slug ?? (d.slug || slugify(d.title)) };
    setDraft(next);
    persist(next);
    return next;
  };
  const saveDraft = () => { flush({ status: "Draft" }); toast.success("Draft saved"); };
  const publish = () => {
    if (!d.title.trim()) { toast.error("Add a title before publishing."); return; }
    if (!canPublish) { flush({ status: "In Review" }); toast.success("Sent for review"); return; }
    const wasPublished = d.status === "Published";
    flush({ status: "Published", publishedAt: d.publishedAt ?? new Date().toISOString() });
    toast.success(wasPublished ? "Changes are live" : "Published");
  };
  const preview = () => {
    const saved = flush();
    const win = window.open("about:blank", "_blank");
    setTimeout(() => { if (win) win.location.href = `/admin/preview/${saved.id}`; }, 200);
  };
  const remove = () => {
    if (!window.confirm(`Delete “${d.title || "Untitled"}”? This cannot be undone.`)) return;
    clearTimeout(timer.current);
    if (created.current) cms.deleteRecord(d.id);
    void navigate({ to: BACK[d.type].to } as never);
  };

  const statusPanel = <Panel title="Status">
    <Field label="Status" htmlFor="status"><Select id="status" value={d.status} onChange={(v) => change({ status: v as CmsRecord["status"] })} options={CMS_STATUSES.filter((s) => canPublish || (s !== "Published" && s !== "Scheduled"))} /></Field>
    {d.status === "Scheduled" ? <Field label="Publish on" htmlFor="sched"><input id="sched" type="datetime-local" value={(d.scheduledFor ?? "").slice(0, 16)} onChange={(e) => change({ scheduledFor: e.target.value })} className={inputClass} /></Field> : null}
    {d.publishedAt ? <p className="text-xs text-muted-foreground">First published {new Date(d.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p> : null}
  </Panel>;
  const slugPanel = <Field label="Slug" htmlFor="slug" hint="The web address of this page."><TextInput id="slug" value={d.slug} placeholder={slugify(d.title) || "auto-from-title"} onChange={(v) => change({ slug: slugify(v) })} /></Field>;
  const footer = <div className="py-4"><button type="button" onClick={remove} className={cn(btn.ghost, "text-deep-red hover:text-deep-red")}><Trash2 className="h-4 w-4" />Delete {TYPE_LABEL[d.type].one.toLowerCase()}</button></div>;

  const titleInput = <textarea aria-label="Title" rows={1} value={d.title} placeholder={TITLE_PLACEHOLDER[d.type]} onChange={(e) => change({ title: e.target.value })} className="w-full resize-none border-0 bg-transparent p-0 text-3xl font-semibold leading-tight text-ink outline-none placeholder:text-muted-foreground/50 md:text-4xl" style={{ fieldSizing: "content" } as React.CSSProperties} />;
  const summaryInput = (placeholder: string, big = false) => <textarea aria-label={placeholder} rows={2} value={d.summary} placeholder={placeholder} onChange={(e) => change({ summary: e.target.value })} className={cn("mt-4 w-full resize-none border-0 bg-transparent p-0 leading-relaxed text-muted-foreground outline-none placeholder:text-muted-foreground/50", big ? "text-lg md:text-xl" : "text-base")} style={{ fieldSizing: "content" } as React.CSSProperties} />;
  const body = (placeholder: string, minimal = false) => <div className="mt-8"><RichText key={d.id} value={d.body} onChange={(html) => change({ body: html })} placeholder={placeholder} minimal={minimal} /></div>;

  let main: React.ReactNode;
  let side: React.ReactNode;

  switch (d.type) {
    case "article":
      main = <div className="mx-auto max-w-3xl">{titleInput}{summaryInput("Standfirst — one or two sentences that draw the reader in", true)}{body("Start writing… ")}</div>;
      side = <>
        {statusPanel}
        <Panel title="Article">
          <Field label="Author" htmlFor="author" hint="Who wrote this article."><Select id="author" value={d.author ?? ""} onChange={(v) => change({ author: v || undefined })} options={AUTHOR_OPTIONS} placeholder="Choose author" /></Field>
          <MultiPicker label="Topic" options={options.topics} value={rel("topics")} onChange={(ids) => setRel("topics", ids)} placeholder="Add topic…" />
          <Field label="Format" htmlFor="format" hint={FORMAT_OPTIONS.find((o) => o.value === f("format"))?.hint}><Select id="format" value={f("format")} onChange={(v) => setField("format", v)} options={FORMAT_OPTIONS} /></Field>
          <MultiPicker label="Heritage" options={options.heritage} value={rel("heritage")} onChange={(ids) => setRel("heritage", ids)} placeholder="Add heritage…" />
        </Panel>
        <Panel title="Cover image"><ImageField value={d.image} onChange={(image) => change({ image })} label="Image" /><Field label="Image description" htmlFor="alt"><TextInput id="alt" value={d.imageAlt ?? ""} onChange={(v) => change({ imageAlt: v })} placeholder="Describe the image for screen readers" /></Field></Panel>
        <Panel title="Source">
          <Field label="Source" htmlFor="src"><Select id="src" value={f("source")} onChange={(v) => setField("source", v)} options={[{ value: "Internal", label: "Indonesia Vibes (internal)" }, { value: "By Curation", label: "By curation (external author or material)" }]} /></Field>
          {f("source") === "By Curation" ? <Field label="Original source" htmlFor="srcatt"><TextInput id="srcatt" value={f("sourceAttribution")} onChange={(v) => setField("sourceAttribution", v)} placeholder="Organisation or publication" /></Field> : null}
          {slugPanel}
        </Panel>
        <Panel title="Homepage"><HeroToggle articleId={d.id} /></Panel>
        <Panel title="Connections" collapsible defaultOpen={false}>
          <p className="text-xs text-muted-foreground">Who and what this article is about. Not the author.</p>
          {picker("people")}{picker("organisations")}{picker("communities")}{picker("places")}{picker("events")}{picker("collections")}
        </Panel>
        <Panel title="Sources" collapsible defaultOpen={false}><TextArea value={f("sources")} onChange={(v) => setField("sources", v)} rows={4} placeholder="One reference per line" /></Panel>
        {d.status === "Published" ? <Panel title="Performance · last 30 days" collapsible defaultOpen={false}><Performance /></Panel> : null}
        {footer}
      </>;
      break;

    case "heritage": {
      const linkedArticles = cms.records.filter((r) => r.type === "article" && (r.relations.heritage ?? []).includes(d.id)).map((r) => r.id);
      const setArticles = (ids: string[]) => {
        const add = ids.filter((x) => !linkedArticles.includes(x));
        const drop = linkedArticles.filter((x) => !ids.includes(x));
        [...add, ...drop].forEach((aid) => { const a = cms.getRecord(aid); if (!a) return; const h = a.relations.heritage ?? []; cms.updateRecord(aid, { relations: { ...a.relations, heritage: add.includes(aid) ? [...h, d.id] : h.filter((x) => x !== d.id) } }); });
      };
      main = <div className="mx-auto max-w-3xl">{titleInput}{summaryInput("Short description — what is it, in one sentence?")}<div className="mt-6 max-w-md"><ImageField value={d.image} onChange={(image) => change({ image })} /></div>{body("Overview — what it is, where it is practised, why it matters…")}</div>;
      side = <>
        {statusPanel}
        <Panel title="Details">
          <Field label="Type" htmlFor="htype"><Select id="htype" value={f("heritageType")} onChange={(v) => setField("heritageType", v)} options={[...HERITAGE_TYPES]} placeholder="Choose type" /></Field>
          <Field label="Region" htmlFor="region"><Select id="region" value={f("region")} onChange={(v) => setField("region", v)} options={[...new Set([...REGIONS, ...(f("region") ? [f("region")] : [])])]} placeholder="Choose region" /></Field>
          <MultiPicker label="Related Topics" options={options.topics} value={rel("topics")} onChange={(ids) => setRel("topics", ids)} placeholder="Add topic…" />
          <Field label="Recognition" htmlFor="rec" hint="Optional, e.g. UNESCO Intangible Cultural Heritage (2009)"><TextInput id="rec" value={f("recognition")} onChange={(v) => setField("recognition", v)} /></Field>
          {slugPanel}
        </Panel>
        <Panel title="Connections" collapsible defaultOpen>
          <MultiPicker label="Related Articles" options={options.articles} value={linkedArticles} onChange={setArticles} />
          {picker("people", "People")}{picker("communities", "Communities")}{picker("organisations", "Organisations")}{picker("places", "Places")}{picker("events", "Events")}{picker("collections", "Collections")}{picker("collaborations", "Collaborations")}
        </Panel>
        {footer}
      </>;
      break;
    }

    case "person":
    case "community":
    case "organisation": {
      const isPerson = d.type === "person";
      const isOrg = d.type === "organisation";
      const authored = isPerson && d.title ? cms.records.filter((r) => r.type === "article" && r.author === d.title) : [];
      main = <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-primary">{isOrg ? "Institution / Organisation" : TYPE_LABEL[d.type].one}</p>
        {titleInput}
        {isPerson ? <div className="mt-4 max-w-md"><Field label="Role / Expertise" htmlFor="role"><TextInput id="role" value={f("role")} onChange={(v) => change({ fields: { ...d.fields, role: v }, summary: v })} placeholder="e.g. Gamelan composer" /></Field></div> : summaryInput(isOrg ? "Short description of the organisation" : "Short description of the community")}
        {body(isPerson ? "Biography…" : "Description…", true)}
      </div>;
      side = <>
        {statusPanel}
        <Panel title="Profile">
          <ImageField value={d.image} onChange={(image) => change({ image })} label={isPerson ? "Photo" : isOrg ? "Logo / Image" : "Image"} />
          {isOrg ? <Field label="Organisation type" htmlFor="otype"><Select id="otype" value={f("orgType")} onChange={(v) => setField("orgType", v)} options={INSTITUTION_TYPES} placeholder="Choose type" /></Field> : null}
          <Field label="Location" htmlFor="loc"><TextInput id="loc" value={f("location")} onChange={(v) => setField("location", v)} placeholder="City, Country" /></Field>
          {isOrg ? <Field label="Website" htmlFor="web"><TextInput id="web" value={f("website")} onChange={(v) => setField("website", v)} placeholder="https://" /></Field> : null}
          {slugPanel}
        </Panel>
        <Panel title="Connections" collapsible>
          {picker("heritage")}{picker("topics", "Related Topics")}
          {!isPerson ? picker("people") : null}
          {!isOrg ? picker("places") : null}
          {picker("events")}
          {!isOrg ? picker("organisations") : picker("collaborations")}
        </Panel>
        {isPerson ? <Panel title="Articles written" collapsible defaultOpen={false}>
          <p className="text-xs text-muted-foreground">Comes from the Author field of each article.</p>
          {authored.length ? <ul className="space-y-1 text-sm text-ink">{authored.map((a) => <li key={a.id} className="truncate">{a.title}</li>)}</ul> : <p className="text-xs text-muted-foreground">No articles by this person.</p>}
        </Panel> : null}
        {footer}
      </>;
      break;
    }

    case "event":
      main = <div className="mx-auto max-w-3xl">{titleInput}{summaryInput("Short description")}<div className="mt-6 max-w-md"><ImageField value={d.image} onChange={(image) => change({ image })} /></div>{body("Full description, programme and practical details…", true)}</div>;
      side = <>
        {statusPanel}
        {f("missing") ? <p className="mt-4 rounded-md bg-blush px-3 py-2 text-xs text-deep-red">Still to confirm: {f("missing")}</p> : null}
        <Panel title="When & where">
          <Field label="Event type" htmlFor="etype"><Select id="etype" value={f("eventType")} onChange={(v) => setField("eventType", v)} options={EVENT_TYPES} placeholder="Choose type" /></Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Start date" htmlFor="sd"><TextInput id="sd" type="date" value={f("startDate")} onChange={(v) => setField("startDate", v)} /></Field>
            <Field label="End date" htmlFor="ed"><TextInput id="ed" type="date" value={f("endDate")} onChange={(v) => setField("endDate", v)} /></Field>
          </div>
          <Field label="Venue" htmlFor="venue"><TextInput id="venue" value={f("venue")} onChange={(v) => setField("venue", v)} /></Field>
          <Field label="City / Location" htmlFor="loc"><TextInput id="loc" value={f("location")} onChange={(v) => setField("location", v)} /></Field>
          <Field label="Country" htmlFor="country"><TextInput id="country" value={f("country")} onChange={(v) => setField("country", v)} /></Field>
          <Field label="Organiser" htmlFor="org"><TextInput id="org" value={f("organiser")} onChange={(v) => setField("organiser", v)} /></Field>
          <Field label="External link" htmlFor="link"><TextInput id="link" value={f("link")} onChange={(v) => setField("link", v)} placeholder="https://" /></Field>
          {slugPanel}
        </Panel>
        <Panel title="Connections" collapsible>
          {picker("topics", "Related Topics")}{picker("heritage")}{picker("people")}{picker("organisations")}{picker("places")}{picker("collaborations")}
        </Panel>
        {footer}
      </>;
      break;

    case "place":
      main = <div className="mx-auto max-w-3xl">{titleInput}{summaryInput("Short description")}<div className="mt-6 max-w-md"><ImageField value={d.image} onChange={(image) => change({ image })} /></div>{body("Why this place matters, visiting information…", true)}</div>;
      side = <>
        {statusPanel}
        <Panel title="Details">
          <Field label="Place type" htmlFor="ptype"><Select id="ptype" value={f("placeType")} onChange={(v) => setField("placeType", v)} options={PLACE_TYPES} placeholder="Choose type" /></Field>
          <Field label="Location" htmlFor="loc"><TextInput id="loc" value={f("location")} onChange={(v) => setField("location", v)} placeholder="City, Region" /></Field>
          <Field label="Country" htmlFor="country"><TextInput id="country" value={f("country")} onChange={(v) => setField("country", v)} /></Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Latitude" htmlFor="lat"><TextInput id="lat" value={f("lat")} onChange={(v) => setField("lat", v)} /></Field>
            <Field label="Longitude" htmlFor="lng"><TextInput id="lng" value={f("lng")} onChange={(v) => setField("lng", v)} /></Field>
          </div>
          {slugPanel}
        </Panel>
        <Panel title="Connections" collapsible>{picker("heritage")}{picker("topics", "Related Topics")}{picker("events")}</Panel>
        {footer}
      </>;
      break;

    case "collaboration": {
      const story = f("publicStory") === "on";
      main = <div className="mx-auto max-w-3xl">
        {titleInput}{summaryInput("Short summary — who is working together, and on what")}
        {story ? <div className="mt-10 space-y-8 border-t border-border pt-8">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">Public story</p>
          <div><p className="mb-2 text-xs font-medium text-ink">Story introduction</p><RichText key={d.id} value={d.body} onChange={(html) => change({ body: html })} placeholder="Introduce the collaboration for readers…" minimal /></div>
          <Field label="Background" htmlFor="bg"><TextArea id="bg" rows={4} value={f("background")} onChange={(v) => setField("background", v)} /></Field>
          <Field label="Activities" htmlFor="act" hint="One per line"><TextArea id="act" rows={4} value={f("activities")} onChange={(v) => setField("activities", v)} /></Field>
          <Field label="Outcomes" htmlFor="out" hint="One per line"><TextArea id="out" rows={4} value={f("outcomes")} onChange={(v) => setField("outcomes", v)} /></Field>
          <Gallery value={f("gallery")} onChange={(v) => setField("gallery", v)} />
          <MultiPicker label="Related content" options={options.articles} value={rel("articles")} onChange={(ids) => setRel("articles", ids)} placeholder="Add related article…" />
          <Field label="Sources" htmlFor="srcs" hint="One per line"><TextArea id="srcs" rows={3} value={f("sources")} onChange={(v) => setField("sources", v)} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Search title" htmlFor="seot"><TextInput id="seot" value={f("seoTitle")} onChange={(v) => setField("seoTitle", v)} placeholder={d.title} /></Field>
            <Field label="Search description" htmlFor="seod"><TextInput id="seod" value={f("seoDescription")} onChange={(v) => setField("seoDescription", v)} placeholder={d.summary.slice(0, 80)} /></Field>
          </div>
        </div> : null}
      </div>;
      side = <>
        {statusPanel}
        <Panel title="Public story">
          <Toggle label="Public Story" checked={story} onChange={(on) => setField("publicStory", on ? "on" : "")} />
          <p className="text-xs text-muted-foreground">{story ? "This collaboration gets its own public page." : "Shown as an information card only. No public page."}</p>
          <Field label="Visibility" htmlFor="vis"><Select id="vis" value={f("visibility") || "Public"} onChange={(v) => setField("visibility", v)} options={["Public", "Hidden"]} /></Field>
        </Panel>
        <Panel title="Details">
          <Field label="Countries" htmlFor="ctry" hint="Separate with commas"><TextInput id="ctry" value={f("countries")} onChange={(v) => setField("countries", v)} /></Field>
          <Field label="Partners" htmlFor="ptn" hint="Separate with commas"><TextInput id="ptn" value={f("partners")} onChange={(v) => setField("partners", v)} /></Field>
          <Field label="Type" htmlFor="ctype"><Select id="ctype" value={f("collabType")} onChange={(v) => setField("collabType", v)} options={COLLABORATION_TYPES} placeholder="Choose type" /></Field>
          <Field label="Period" htmlFor="per"><TextInput id="per" value={f("period")} onChange={(v) => setField("period", v)} placeholder="e.g. 2024 – 2027" /></Field>
          <MultiPicker label="Topic" options={options.topics} value={rel("topics")} onChange={(ids) => setRel("topics", ids)} placeholder="Add topic…" />
          {picker("heritage", "Heritage")}
          {picker("organisations", "Indonesian partners (directory)")}
          <ImageField value={d.image} onChange={(image) => change({ image })} label="Image" />
          <Field label="External link" htmlFor="xl"><TextInput id="xl" value={f("link")} onChange={(v) => setField("link", v)} placeholder="https://" /></Field>
          {story ? slugPanel : null}
        </Panel>
        {footer}
      </>;
      break;
    }
  }

  return <EditorFrame backTo={BACK[d.type].to} backLabel={BACK[d.type].label} title={d.title || `New ${TYPE_LABEL[d.type].one.toLowerCase()}`} status={d.status} saveState={saveState}
    onSaveDraft={saveDraft} onPreview={preview} onPublish={publish} canPublish={canPublish} main={main} sidebar={side} />;
}

function HeroToggle({ articleId }: { articleId: string }) {
  const [settings, setSettings] = useHomepageSettings(stories.map((s) => s.id));
  const inHero = settings.hero.some((h) => h.articleId === articleId);
  return <>
    <Toggle label="Feature in Homepage Hero" checked={inHero} onChange={(on) => {
      if (on && settings.hero.length >= 5) { toast.error(HERO_LIMIT_MESSAGE); return; }
      setSettings({ ...settings, hero: on ? [...settings.hero, { articleId }] : settings.hero.filter((h) => h.articleId !== articleId) });
    }} />
    <p className="text-xs text-muted-foreground">Hero has {settings.hero.length} of 5 articles.</p>
  </>;
}

function Gallery({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const images = value.split("\n").filter(Boolean);
  return <div className="space-y-2">
    <p className="text-xs font-medium text-ink">Gallery</p>
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {images.map((src, i) => <div key={i} className="relative"><img src={src} alt="" className="aspect-square w-full rounded object-cover" /><button type="button" onClick={() => onChange(images.filter((_, j) => j !== i).join("\n"))} className="absolute top-1 right-1 rounded bg-background/90 px-1.5 text-xs" aria-label="Remove image">×</button></div>)}
      <div className="aspect-square"><ImageField value="" onChange={(src) => src && onChange([...images, src].join("\n"))} label="" /></div>
    </div>
  </div>;
}

export function Performance() {
  return <div className="space-y-2 text-sm">
    <div className="grid grid-cols-3 gap-2 text-center">{["Views", "Visitors", "Avg. time"].map((l) => <div key={l} className="rounded border border-border bg-background py-2"><p className="text-base font-semibold text-muted-foreground">{NO_DATA}</p><p className="text-[0.6875rem] text-muted-foreground">{l}</p></div>)}</div>
    <p className="text-xs text-muted-foreground">Analytics not connected. Connect in Settings → Analytics.</p>
  </div>;
}
