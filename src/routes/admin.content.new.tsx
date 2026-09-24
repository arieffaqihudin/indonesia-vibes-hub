import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { possibleDuplicates } from "@/lib/admin/selectors";
import { CONTENT_FIELDS, CONTENT_KINDS, emptyRelationships, kindLabel, type ContentKind } from "@/lib/admin/types";
import { CONTENT_SOURCES, DELIVERY_HELP, DELIVERY_TYPES, SOURCE_HELP, type ContentSource, type DeliveryType } from "@/lib/editorial";
import { TOPICS } from "@/lib/topics";
import { PageHeading, PrototypeNote, abtn, field } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/content/new")({
  head: adminHead("Create content", "Start a new record inside the editorial workflow."),
  validateSearch: (search: Record<string, unknown>) => ({ kind: (search["kind"] as string) || "story" }),
  component: NewContent,
});

function NewContent() {
  const { kind } = Route.useSearch();
  const navigate = useNavigate();
  const admin = useAdmin();
  const [type, setType] = useState<ContentKind>((CONTENT_KINDS.find((k) => k.kind === kind)?.kind ?? "story") as ContentKind);
  const [title, setTitle] = useState("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("Knowledge");
  const [contentSource, setContentSource] = useState<ContentSource>("Internal");
  const [topic, setTopic] = useState("");
  const [sourceAttribution, setSourceAttribution] = useState("");
  const [ignoreDuplicates, setIgnoreDuplicates] = useState(false);

  const duplicates = useMemo(() => (title.length > 3 ? possibleDuplicates(title, admin.content) : []), [title, admin.content]);

  const create = () => {
    const id = `c-new-${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();
    const primary = CONTENT_FIELDS[type][0]?.name ?? "title";
    admin.createContent({
      id,
      kind: type,
      ...(type === "story" ? { deliveryType, contentSource, topics: topic ? [topic] : [], ...(contentSource === "By Curation" ? { sourceAttribution } : {}) } : {}),
      title,
      status: "draft",
      priority: "Normal",
      assignedTo: admin.user.name,
      themes: [],
      countries: ["Indonesia"],
      createdAt: now,
      updatedAt: now,
      stageSince: now,
      fields: { [primary]: title },
      relationships: emptyRelationships(),
      culturalReview: { flags: [] },
      languageReview: { complete: false },
      feedback: [],
      notes: [],
      versions: [],
      prototype: true,
    });
    navigate({ to: "/admin/content/$id", params: { id } });
  };

  const blocked = duplicates.length > 0 && !ignoreDuplicates;

  return (
    <>
      <PageHeading eyebrow="Content" title={`Create ${type === "story" ? "Editorial Content" : kindLabel(type)}`} description="Start with the basics. You can add relationships, evidence and media inside the draft." />

      <section className="max-w-3xl border-t border-border pt-5">
        <div className="space-y-5">
          <div>
            <label htmlFor="kind" className="mb-1 block text-xs font-medium text-ink">
              Content type
            </label>
            <select id="kind" className={field} value={type} onChange={(e) => setType(e.target.value as ContentKind)}>
              {CONTENT_KINDS.map((k) => (
                <option key={k.kind} value={k.kind}>
                  {k.label}
                </option>
              ))}
            </select>
          </div>

          {type === "story" ? <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
            <label className="text-xs font-medium text-ink">How should it help the reader?<select className={`${field} mt-1`} value={deliveryType} onChange={(e) => setDeliveryType(e.target.value as DeliveryType)}>{DELIVERY_TYPES.map((value) => <option key={value}>{value}</option>)}</select><span className="mt-1 block font-normal text-muted-foreground">{DELIVERY_HELP[deliveryType]}</span></label>
            <label className="text-xs font-medium text-ink">Topic<select className={`${field} mt-1`} value={topic} onChange={(e) => setTopic(e.target.value)}><option value="">Choose later</option>{TOPICS.map((entry) => <option key={entry.id}>{entry.id}</option>)}</select></label>
            <label className="text-xs font-medium text-ink">Content source<select className={`${field} mt-1`} value={contentSource} onChange={(e) => setContentSource(e.target.value as ContentSource)}>{CONTENT_SOURCES.map((value) => <option key={value}>{value}</option>)}</select><span className="mt-1 block font-normal text-muted-foreground">{SOURCE_HELP[contentSource]}</span></label>
            {contentSource === "By Curation" ? <label className="text-xs font-medium text-ink">Source attribution<input className={`${field} mt-1`} value={sourceAttribution} onChange={(e) => setSourceAttribution(e.target.value)} placeholder="Organisation, publication or creator" /></label> : null}
          </div> : null}

          <div>
            <label htmlFor="title" className="mb-1 block text-xs font-medium text-ink">
              Working title
            </label>
            <input id="title" className={field} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={`New ${kindLabel(type).toLowerCase()}`} />
          </div>

          {duplicates.length ? (
            <div className="rounded-md border border-clay/40 bg-blush/50 p-3">
              <p className="text-xs font-semibold text-clay">Possible existing records</p>
              <ul className="mt-2 space-y-1.5">
                {duplicates.map((d) => (
                  <li key={d.item.id} className="flex flex-wrap items-center gap-2 text-sm text-ink">
                    <span>{d.item.title}</span>
                    <span className="text-xs text-muted-foreground">{kindLabel(d.item.kind)}</span>
                    <button
                      type="button"
                      className={abtn.small}
                      onClick={() => navigate({ to: "/admin/content/$id", params: { id: d.item.id } })}
                    >
                      Review existing
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" className={`${abtn.quiet} mt-2`} onClick={() => setIgnoreDuplicates(true)}>
                Create anyway
              </button>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <button type="button" className={abtn.primary} disabled={!title.trim() || blocked} onClick={create}>
              Create draft
            </button>
            <button type="button" className={abtn.secondary} onClick={() => navigate({ to: "/admin/content" })}>
              Cancel
            </button>
          </div>

          <PrototypeNote>
            Duplicate suggestions use simple title matching. Creating a record here does not bypass review — it starts at draft
            and still requires approval before publication.
          </PrototypeNote>
        </div>
      </section>
    </>
  );
}
