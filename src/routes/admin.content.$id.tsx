import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { blockedForPublication, graphEntriesFor, graphEntry, relationshipGroups } from "@/lib/admin/selectors";
import {
  CONTENT_FIELDS,
  CULTURAL_DECISIONS,
  RIGHTS_STATUSES,
  SENSITIVITY_FLAGS,
  SOURCE_STATUSES,
  SOURCE_TYPES,
  actionsFor,
  can,
  kindLabel,
  networkReadiness,
  PRIORITIES,
  REQUIRED_STAGES,
  CONTENT_STATUS,
  type CulturalDecision,
  type Priority,
  type Relationships,
  type SensitivityFlag,
  type SourceStatus,
  type SourceType,
} from "@/lib/admin/types";
import { CONTENT_SOURCES, DELIVERY_HELP, DELIVERY_TYPES, SOURCE_HELP, type ContentSource, type DeliveryType } from "@/lib/editorial";
import { TOPICS } from "@/lib/topics";
import {
  Card,
  EmptyState,
  ExternalLink,
  InternalOnly,
  Modal,
  PageHeading,
  StatusPill,
  Tag,
  abtn,
  dateFmt,
  field,
  relative,
  useConfirm,
} from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/content/$id")({
  head: adminHead("Content workspace", "Edit a record, manage its relationships, sources, media rights and review state."),
  component: ContentWorkspace,
});

const TABS = ["Edit", "Connections", "Media", "Review", "More"] as const;
type Tab = (typeof TABS)[number];

function ContentWorkspace() {
  const { id } = Route.useParams();
  const admin = useAdmin();
  const item = admin.getContent(id);
  const [tab, setTab] = useState<Tab>("Edit");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [revisionOpen, setRevisionOpen] = useState(false);
  const { confirm, dialog } = useConfirm();

  const media = admin.media.filter((m) => m.contentId === id);
  const sources = admin.sources.filter((s) => s.contentId === id);
  const claims = admin.claims.filter((c) => c.contentId === id);
  const blockers = item ? blockedForPublication(item, admin.media) : [];

  if (!item) {
    return (
      <EmptyState
        title="That record no longer exists."
        hint="It may have been merged or removed in this prototype session."
        action={
          <Link to="/admin/content" className={abtn.secondary}>
            Back to the content library
          </Link>
        }
      />
    );
  }

  const readiness = networkReadiness(item);
  const actions = actionsFor(item.status, item.kind).filter((a) => can(admin.role, a.capability));

  return (
    <>
      <PageHeading
        eyebrow={`Content / ${kindLabel(item.kind)}`}
        title={item.title}
        description={CONTENT_STATUS[item.status].meaning}
        actions={
          <>
            {item.publicPath && item.status === "published" ? (
              <ExternalLink href={item.publicPath}>View public page</ExternalLink>
            ) : null}
            <Link to="/admin/content/$id/preview" params={{ id: item.id }} className={abtn.secondary}>
              Preview public page
            </Link>
          </>
        }
      />

       <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="min-w-0">
          <div role="tablist" aria-label="Content workspace sections" className="mb-4 flex flex-wrap gap-1 border-b border-border">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`-mb-px min-h-9 border-b-2 px-3 text-xs font-medium ${
                  tab === t ? "border-primary text-ink" : "border-transparent text-muted-foreground hover:text-ink"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "Edit" ? <ContentTab id={id} /> : null}
          {tab === "Connections" ? <RelationshipsTab id={id} readiness={readiness} /> : null}
          {tab === "Media" ? <MediaTab id={id} assets={media} /> : null}
          {tab === "Review" ? <ReviewTab id={id} /> : null}
          {tab === "More" ? <div className="space-y-8"><SourcesTab id={id} sources={sources} claims={claims} /><HistoryTab id={id} /></div> : null}
        </div>

        {/* Workflow and collaboration panel */}
         <aside className="space-y-4 border-t border-border pt-5 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-6">
          <Card title="Workflow">
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-xs text-muted-foreground">Current status</dt>
                <dd>
                  <StatusPill status={item.status} />
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-xs text-muted-foreground">Assigned editor</dt>
                <dd>
                  <select
                    className={`${field} min-h-8 w-40 py-1 text-xs`}
                    value={item.assignedTo ?? ""}
                    aria-label="Assigned editor"
                    onChange={(e) => admin.updateContent(id, { assignedTo: e.target.value }, `assigned ${e.target.value || "nobody"}`)}
                  >
                    <option value="">Unassigned</option>
                    {admin.users.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-xs text-muted-foreground">Priority</dt>
                <dd>
                  <select
                    className={`${field} min-h-8 w-28 py-1 text-xs`}
                    value={item.priority}
                    aria-label="Priority"
                    onChange={(e) => admin.updateContent(id, { priority: e.target.value as Priority })}
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-xs text-muted-foreground">Contributor</dt>
                <dd className="text-xs text-ink">{item.contributor ?? "Internal"}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-xs text-muted-foreground">Last updated</dt>
                <dd className="text-xs text-ink">{relative(item.updatedAt)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-xs text-muted-foreground">Next action</dt>
                <dd className="text-right text-xs text-ink">{actions[0]?.label ?? "None outstanding"}</dd>
              </div>
            </dl>

            {blockers.length ? (
              <p className="mt-3 rounded border border-primary/40 bg-primary/5 px-3 py-2 text-xs text-primary">
                Publication blocked: media permission has not been confirmed for {blockers.length} required asset
                {blockers.length === 1 ? "" : "s"}. Replace or remove the asset, or confirm the rights.
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              {actions.map((action) => {
                const disabled = (action.to === "published" || action.to === "scheduled") && blockers.length > 0;
                return (
                  <button
                    key={action.id}
                    type="button"
                    disabled={disabled}
                    className={
                      action.tone === "primary" ? abtn.primary : action.tone === "danger" ? abtn.danger : abtn.secondary
                    }
                    onClick={() => {
                      if (action.to === "scheduled") return setScheduleOpen(true);
                      if (action.to === "revision_requested") return setRevisionOpen(true);
                      if (action.confirm) return confirm(action.confirm, () => admin.transition(id, action.to));
                      admin.transition(id, action.to);
                    }}
                  >
                    {action.label}
                  </button>
                );
              })}
              {!actions.length ? (
                <p className="text-xs text-muted-foreground">Your role has no available actions at this stage.</p>
              ) : null}
            </div>
          </Card>

          <Card title="Required stages" description="Not every record passes every stage.">
            <ol className="space-y-1.5 text-xs">
              {REQUIRED_STAGES[item.kind].map((stage) => {
                const done =
                  Object.keys(CONTENT_STATUS).indexOf(item.status) > Object.keys(CONTENT_STATUS).indexOf(stage) ||
                  ["approved", "scheduled", "published"].includes(item.status);
                return (
                  <li key={stage} className="flex items-center gap-2">
                    <span aria-hidden className={done ? "text-ink" : "text-muted-foreground"}>
                      {done ? "✓" : "○"}
                    </span>
                    <span className={done ? "text-ink" : "text-muted-foreground"}>{CONTENT_STATUS[stage].label}</span>
                    {item.status === stage ? <Tag tone="alert">Current</Tag> : null}
                    <span className="sr-only">{done ? "cleared" : "not yet cleared"}</span>
                  </li>
                );
              })}
            </ol>
          </Card>

          <Card title="Content review dates">
            <dl className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Published</dt>
                <dd className="text-ink">{dateFmt(item.publishedAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Last reviewed</dt>
                <dd className="text-ink">{dateFmt(item.lastReviewed)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Next review</dt>
                <dd className="text-ink">{dateFmt(item.nextReview)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Frequency</dt>
                <dd className="text-ink">{item.reviewFrequencyDays ? `${item.reviewFrequencyDays} days` : "Not set"}</dd>
              </div>
            </dl>
            <button type="button" className={`${abtn.small} mt-3`} onClick={() => admin.markReviewed(id)}>
              Record a review
            </button>
          </Card>

          <Card title="Notes and comments">
            <NoteComposer id={id} />
          </Card>
        </aside>
      </div>

      <Modal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        title="Schedule publication"
        footer={
          <button type="button" className={abtn.secondary} onClick={() => setScheduleOpen(false)}>
            Close
          </button>
        }
      >
        <ScheduleForm id={id} onDone={() => setScheduleOpen(false)} />
      </Modal>

      <Modal
        open={revisionOpen}
        onClose={() => setRevisionOpen(false)}
        title="Request a revision"
        footer={
          <button type="button" className={abtn.secondary} onClick={() => setRevisionOpen(false)}>
            Close
          </button>
        }
      >
        <RevisionForm id={id} onDone={() => setRevisionOpen(false)} />
      </Modal>

      {dialog}
    </>
  );
}

/* ---------------- content tab ---------------- */

function ContentTab({ id }: { id: string }) {
  const admin = useAdmin();
  const item = admin.getContent(id)!;
  const editable = can(admin.role, "editorial") || can(admin.role, "language");

  return (
    <Card title="Structured content" description={editable ? "Fields are typed per content type, not one rich-text blob." : "Read-only for your role."}>
      <div className="space-y-4">
        {item.kind === "story" ? <div className="grid gap-4 border-b border-border pb-5 sm:grid-cols-2">
          <label className="text-xs font-medium text-ink">Reader purpose<select className={`${field} mt-1`} value={item.deliveryType ?? "Semantic"} disabled={!editable} onChange={(e) => admin.updateContent(id, { deliveryType: e.target.value as DeliveryType })}>{DELIVERY_TYPES.map((value) => <option key={value}>{value}</option>)}</select><span className="mt-1 block font-normal text-muted-foreground">{DELIVERY_HELP[item.deliveryType ?? "Semantic"]}</span></label>
          <label className="text-xs font-medium text-ink">Primary topic<select className={`${field} mt-1`} value={item.topics?.[0] ?? ""} disabled={!editable} onChange={(e) => admin.updateContent(id, { topics: e.target.value ? [e.target.value] : [] })}><option value="">Choose a topic</option>{TOPICS.map((entry) => <option key={entry.id}>{entry.id}</option>)}</select></label>
          <label className="text-xs font-medium text-ink">Content source<select className={`${field} mt-1`} value={item.contentSource ?? "Internal"} disabled={!editable} onChange={(e) => admin.updateContent(id, { contentSource: e.target.value as ContentSource })}>{CONTENT_SOURCES.map((value) => <option key={value}>{value}</option>)}</select><span className="mt-1 block font-normal text-muted-foreground">{SOURCE_HELP[item.contentSource ?? "Internal"]}</span></label>
          {item.contentSource === "By Curation" ? <label className="text-xs font-medium text-ink">Source attribution<input className={`${field} mt-1`} value={item.sourceAttribution ?? ""} disabled={!editable} onChange={(e) => admin.updateContent(id, { sourceAttribution: e.target.value })} /></label> : null}
        </div> : null}
        {CONTENT_FIELDS[item.kind].map((f) => {
          const value = item.fields[f.name] ?? "";
          const inputId = `field-${f.name}`;
          return (
            <div key={f.name}>
              <label htmlFor={inputId} className="mb-1 block text-xs font-medium text-ink">
                {f.label}
              </label>
              {f.type === "text" ? (
                <input
                  id={inputId}
                  className={field}
                  value={value}
                  disabled={!editable}
                  onChange={(e) => admin.updateContent(id, { fields: { ...item.fields, [f.name]: e.target.value } })}
                />
              ) : (
                <textarea
                  id={inputId}
                  className={field}
                  rows={f.type === "longform" ? 8 : 3}
                  value={value}
                  disabled={!editable}
                  onChange={(e) => admin.updateContent(id, { fields: { ...item.fields, [f.name]: e.target.value } })}
                />
              )}
              {f.help ? <p className="mt-1 text-[0.7rem] text-muted-foreground">{f.help}</p> : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ---------------- relationships tab ---------------- */

function RelationshipsTab({ id, readiness }: { id: string; readiness: ReturnType<typeof networkReadiness> }) {
  const admin = useAdmin();
  const item = admin.getContent(id)!;
  const { confirm, dialog } = useConfirm();
  const [group, setGroup] = useState<keyof Relationships>("culture");
  const [target, setTarget] = useState("");
  const options = useMemo(() => graphEntriesFor(group), [group]);

  return (
    <div className="space-y-4">
      <Card title="Connected content" description="Relationships drive what a reader sees next on the public platform.">
        <div className="space-y-4">
          {relationshipGroups.map((g) => {
            const ids = item.relationships[g.key];
            if (!ids.length) return null;
            return (
              <div key={g.key}>
                <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">{g.label}</p>
                <ul className="mt-1.5 flex flex-wrap gap-2">
                  {ids.map((rid) => {
                    const entry = graphEntry(rid);
                    return (
                      <li key={rid} className="flex items-center gap-2 rounded border border-border px-2 py-1 text-xs text-ink">
                        <span>{entry?.label ?? rid}</span>
                        {entry?.path ? <ExternalLink href={entry.path}>Preview</ExternalLink> : null}
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-primary"
                          onClick={() =>
                            confirm(
                              `Removing this connection changes what readers see next on the public page. Remove “${entry?.label ?? rid}”?`,
                              () => admin.removeRelationship(id, g.key, rid),
                            )
                          }
                        >
                          Remove<span className="sr-only"> {entry?.label ?? rid}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          {relationshipGroups.every((g) => !item.relationships[g.key].length) ? (
            <EmptyState title="No connections yet." hint="Connect this record to the cultural subjects, people and places it belongs with." />
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap items-end gap-2 border-t border-border pt-4">
          <label className="text-xs text-muted-foreground">
            <span className="mb-1 block">Group</span>
            <select className={`${field} min-h-8 w-44 py-1 text-xs`} value={group} onChange={(e) => { setGroup(e.target.value as keyof Relationships); setTarget(""); }}>
              {relationshipGroups.map((g) => (
                <option key={g.key} value={g.key}>
                  {g.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-muted-foreground">
            <span className="mb-1 block">Record</span>
            <select className={`${field} min-h-8 w-64 py-1 text-xs`} value={target} onChange={(e) => setTarget(e.target.value)}>
              <option value="">Choose a record</option>
              {options.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className={abtn.secondary}
            disabled={!target}
            onClick={() => {
              admin.addRelationship(id, group, target);
              setTarget("");
            }}
          >
            Add relationship
          </button>
        </div>
      </Card>

      <Card title="Content network readiness" description="A guide for editors, not a score to chase.">
        <p className="text-sm text-ink">
          Connected content {readiness.met} / {readiness.total}
        </p>
        <ul className="mt-2 grid gap-1 text-xs sm:grid-cols-2">
          {readiness.checks.map((c) => (
            <li key={c.label} className="flex items-center gap-2">
              <span aria-hidden>{c.ok ? "✓" : "○"}</span>
              <span className={c.ok ? "text-ink" : "text-muted-foreground"}>{c.label}</span>
              <span className="sr-only">{c.ok ? "connected" : "not connected"}</span>
            </li>
          ))}
        </ul>
      </Card>
      {dialog}
    </div>
  );
}

/* ---------------- sources tab ---------------- */

function SourcesTab({
  id,
  sources,
  claims,
}: {
  id: string;
  sources: ReturnType<typeof useAdmin>["sources"];
  claims: ReturnType<typeof useAdmin>["claims"];
}) {
  const admin = useAdmin();
  const canVerify = can(admin.role, "verify") || can(admin.role, "configure");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<SourceType>("Official source");
  const [claimText, setClaimText] = useState("");
  const [claimSection, setClaimSection] = useState("");

  return (
    <div className="space-y-4">
      <Card title="Sources">
        {sources.length ? (
          <ul className="space-y-3">
            {sources.map((s) => (
              <li key={s.id} className="rounded border border-border p-3">
                <p className="text-sm font-medium text-ink">{s.title}</p>
                <p className="text-xs text-muted-foreground">
                  {[s.author, s.publisher, s.year, s.type].filter(Boolean).join(" · ")}
                </p>
                {s.url ? (
                  <p className="mt-1 text-xs">
                    <ExternalLink href={s.url}>Open source</ExternalLink>
                  </p>
                ) : null}
                {s.notes ? <p className="mt-1 text-xs text-muted-foreground">{s.notes}</p> : null}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <label className="text-xs text-muted-foreground">
                    <span className="sr-only">Verification status for {s.title}</span>
                    <select
                      className={`${field} min-h-8 w-52 py-1 text-xs`}
                      value={s.status}
                      disabled={!canVerify}
                      onChange={(e) =>
                        admin.upsertSource({
                          ...s,
                          status: e.target.value as SourceStatus,
                          verifiedBy: admin.user.name,
                          verifiedAt: new Date().toISOString(),
                        })
                      }
                    >
                      {SOURCE_STATUSES.map((st) => (
                        <option key={st}>{st}</option>
                      ))}
                    </select>
                  </label>
                  {s.verifiedBy ? (
                    <span className="text-[0.7rem] text-muted-foreground">
                      {s.verifiedBy} · {dateFmt(s.verifiedAt)}
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No sources recorded yet." hint="Add the reference an editor or researcher can check." />
        )}

        <div className="mt-4 flex flex-wrap items-end gap-2 border-t border-border pt-4">
          <label className="flex-1 text-xs text-muted-foreground">
            <span className="mb-1 block">Source title</span>
            <input className={`${field} min-h-8 py-1 text-xs`} value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="text-xs text-muted-foreground">
            <span className="mb-1 block">Type</span>
            <select className={`${field} min-h-8 w-48 py-1 text-xs`} value={type} onChange={(e) => setType(e.target.value as SourceType)}>
              {SOURCE_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className={abtn.secondary}
            disabled={!title.trim()}
            onClick={() => {
              admin.upsertSource({ id: `src-${Math.random().toString(36).slice(2, 8)}`, contentId: id, title, type, status: "Unverified" });
              setTitle("");
            }}
          >
            Add source
          </button>
        </div>
      </Card>

      <Card title="Claims requiring evidence" description="Flag a statement, then attach the source that supports it.">
        {claims.length ? (
          <ul className="space-y-3">
            {claims.map((c) => (
              <li key={c.id} className="rounded border border-border p-3">
                <p className="text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase">{c.section}</p>
                <p className="mt-1 text-sm text-ink">“{c.text}”</p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {c.sourceIds.map((sid) => (
                    <li key={sid}>
                      <Tag tone="quiet">{admin.sources.find((s) => s.id === sid)?.title ?? sid}</Tag>
                    </li>
                  ))}
                  {!c.sourceIds.length ? <li className="text-xs text-muted-foreground">No source attached.</li> : null}
                </ul>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <select
                    className={`${field} min-h-8 w-44 py-1 text-xs`}
                    aria-label={`Status for claim in ${c.section}`}
                    value={c.status}
                    disabled={!canVerify}
                    onChange={(e) =>
                      admin.updateClaim(c.id, {
                        status: e.target.value as typeof c.status,
                        verifiedBy: admin.user.name,
                        verifiedAt: new Date().toISOString(),
                      })
                    }
                  >
                    {["Requires source", "Source attached", "Verified", "Disputed"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <select
                    className={`${field} min-h-8 w-56 py-1 text-xs`}
                    aria-label={`Attach a source to the claim in ${c.section}`}
                    value=""
                    disabled={!canVerify}
                    onChange={(e) => e.target.value && admin.updateClaim(c.id, { sourceIds: [...c.sourceIds, e.target.value], status: "Source attached" })}
                  >
                    <option value="">Attach a source…</option>
                    {sources.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                  {c.verifiedBy ? (
                    <span className="text-[0.7rem] text-muted-foreground">
                      {c.verifiedBy} · {dateFmt(c.verifiedAt)}
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No claims flagged." hint="Flag cultural or historical statements that need evidence." />
        )}

        <div className="mt-4 flex flex-wrap items-end gap-2 border-t border-border pt-4">
          <label className="text-xs text-muted-foreground">
            <span className="mb-1 block">Section</span>
            <input className={`${field} min-h-8 w-40 py-1 text-xs`} value={claimSection} onChange={(e) => setClaimSection(e.target.value)} />
          </label>
          <label className="flex-1 text-xs text-muted-foreground">
            <span className="mb-1 block">Statement</span>
            <input className={`${field} min-h-8 py-1 text-xs`} value={claimText} onChange={(e) => setClaimText(e.target.value)} />
          </label>
          <button
            type="button"
            className={abtn.secondary}
            disabled={!claimText.trim()}
            onClick={() => {
              admin.addClaim({ contentId: id, section: claimSection || "General", text: claimText, sourceIds: [], status: "Requires source" });
              setClaimText("");
              setClaimSection("");
            }}
          >
            Flag claim
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ---------------- media tab ---------------- */

function MediaTab({ id, assets }: { id: string; assets: ReturnType<typeof useAdmin>["media"] }) {
  const admin = useAdmin();
  const editable = can(admin.role, "media");
  const { confirm, dialog } = useConfirm();

  return (
    <Card title="Media & rights" description="Publication is blocked while a required asset has unresolved rights.">
      {assets.length ? (
        <ul className="space-y-3">
          {assets.map((asset) => (
            <li key={asset.id} className="flex flex-wrap gap-4 rounded border border-border p-3">
              <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded bg-muted text-[0.65rem] text-muted-foreground">
                {asset.kind}
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <p className="text-sm font-medium text-ink">{asset.fileName}</p>
                <p className="text-xs text-muted-foreground">{asset.caption}</p>
                <p className="text-xs text-muted-foreground">
                  {asset.creator} · rights held by {asset.rightsHolder}
                  {asset.required ? " · required for publication" : " · optional"}
                </p>
                {asset.restrictions ? <p className="text-xs text-primary">{asset.restrictions}</p> : null}
                <label className="block text-xs text-muted-foreground">
                  <span className="mb-1 block">Alt text</span>
                  <input
                    className={`${field} min-h-8 py-1 text-xs`}
                    value={asset.altText}
                    disabled={!editable}
                    onChange={(e) => admin.updateMedia(asset.id, { altText: e.target.value })}
                  />
                </label>
                <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Permission</span>
                  <select
                    className={`${field} min-h-8 w-48 py-1 text-xs`}
                    value={asset.permission}
                    disabled={!editable}
                    onChange={(e) =>
                      confirm(
                        "Changing a rights status affects whether this record can be published. Continue?",
                        () => admin.updateMedia(asset.id, { permission: e.target.value as (typeof RIGHTS_STATUSES)[number] }),
                      )
                    }
                  >
                    {RIGHTS_STATUSES.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </label>
                {editable ? (
                  <button
                    type="button"
                    className={abtn.quiet}
                    onClick={() => confirm("Remove this asset from the record?", () => admin.updateMedia(asset.id, { contentId: "removed" }))}
                  >
                    Remove asset
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No media attached." hint="Media supplied by contributors appears here with its rights record." />
      )}
      <p className="sr-only">Record identifier {id}</p>
      {dialog}
    </Card>
  );
}

/* ---------------- review tab ---------------- */

function ReviewTab({ id }: { id: string }) {
  const admin = useAdmin();
  const item = admin.getContent(id)!;
  const [comment, setComment] = useState("");

  const toggleFlag = (flag: SensitivityFlag) => {
    const flags = item.culturalReview.flags.includes(flag)
      ? item.culturalReview.flags.filter((f) => f !== flag)
      : [...item.culturalReview.flags, flag];
    admin.updateContent(id, { culturalReview: { ...item.culturalReview, flags } });
  };

  return (
    <div className="space-y-4">
      <Card title="Cultural review" description="Sensitivity is a judgement with context, not a yes/no checkbox.">
        <fieldset>
          <legend className="text-xs font-medium text-ink">Flags</legend>
          <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {SENSITIVITY_FLAGS.map((flag) => (
              <label key={flag} className="flex items-center gap-2 text-xs text-ink">
                <input
                  type="checkbox"
                  checked={item.culturalReview.flags.includes(flag)}
                  disabled={!can(admin.role, "subject") && !can(admin.role, "editorial")}
                  onChange={() => toggleFlag(flag)}
                />
                {flag}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-xs text-muted-foreground">
            <span className="mb-1 block">Decision</span>
            <select
              className={`${field} min-h-8 py-1 text-xs`}
              value={item.culturalReview.decision ?? ""}
              onChange={(e) =>
                admin.updateContent(
                  id,
                  {
                    culturalReview: {
                      ...item.culturalReview,
                      decision: e.target.value as CulturalDecision,
                      reviewer: admin.user.name,
                      date: new Date().toISOString(),
                    },
                  },
                  "recorded a cultural review decision",
                )
              }
            >
              <option value="">Not recorded</option>
              {CULTURAL_DECISIONS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          <div className="text-xs text-muted-foreground">
            <span className="mb-1 block">Reviewer</span>
            <p className="text-ink">
              {item.culturalReview.reviewer ?? "Not yet reviewed"}
              {item.culturalReview.date ? ` · ${dateFmt(item.culturalReview.date)}` : ""}
            </p>
          </div>
        </div>

        <label className="mt-3 block text-xs text-muted-foreground">
          <span className="mb-1 block">Context recorded with the decision</span>
          <textarea
            className={field}
            rows={3}
            value={item.culturalReview.context ?? ""}
            onChange={(e) => admin.updateContent(id, { culturalReview: { ...item.culturalReview, context: e.target.value } })}
          />
        </label>
      </Card>

      <Card title="Subject review">
        <dl className="grid gap-2 text-xs sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Reviewer</dt>
            <dd className="text-ink">{item.subjectReview?.reviewer ?? "Not assigned"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Outcome</dt>
            <dd className="text-ink">{item.subjectReview?.outcome ?? "Pending"}</dd>
          </div>
        </dl>
        {item.subjectReview?.comment ? <p className="mt-2 text-sm text-ink">{item.subjectReview.comment}</p> : null}
        <p className="mt-3 text-xs text-muted-foreground">
          Subject reviewers pick this record up from{" "}
          <Link to="/admin/review" className="text-primary underline-offset-4 hover:underline">
            Needs review
          </Link>
          .
        </p>
      </Card>

      <Card title="English editing">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={item.languageReview.complete}
            disabled={!can(admin.role, "language")}
            onChange={(e) =>
              admin.updateContent(
                id,
                {
                  languageReview: {
                    complete: e.target.checked,
                    reviewer: admin.user.name,
                    date: new Date().toISOString(),
                    ...(item.languageReview.notes ? { notes: item.languageReview.notes } : {}),
                  },
                },
                e.target.checked ? "marked language review complete" : "reopened language review",
              )
            }
          />
          Language review complete
        </label>
        {item.languageReview.reviewer ? (
          <p className="mt-1 text-xs text-muted-foreground">
            {item.languageReview.reviewer} · {dateFmt(item.languageReview.date)}
          </p>
        ) : null}
        <label className="mt-3 block text-xs text-muted-foreground">
          <span className="mb-1 block">Language notes</span>
          <textarea
            className={field}
            rows={2}
            value={item.languageReview.notes ?? ""}
            disabled={!can(admin.role, "language")}
            onChange={(e) => admin.updateContent(id, { languageReview: { ...item.languageReview, notes: e.target.value } })}
          />
        </label>
      </Card>

      <Card title="Editorial feedback" description="Feedback marked as contributor-visible appears in the Contributor Workspace.">
        <ul className="space-y-2">
          {item.feedback.map((f) => (
            <li key={f.id} className="rounded border border-border p-3 text-sm">
              <p className="text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase">
                {f.section} · {f.kind} · {f.visibleToContributor ? "Visible to contributor" : "Internal"}
              </p>
              <p className="mt-1 text-ink">{f.note}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {f.author} · {relative(f.date)}
              </p>
            </li>
          ))}
          {!item.feedback.length ? <li className="text-sm text-muted-foreground">No feedback recorded.</li> : null}
        </ul>
        <div className="mt-3">
          <label className="block text-xs text-muted-foreground">
            <span className="mb-1 block">Add a comment for the team</span>
            <textarea className={field} rows={2} value={comment} onChange={(e) => setComment(e.target.value)} />
          </label>
          <button
            type="button"
            className={`${abtn.secondary} mt-2`}
            disabled={!comment.trim()}
            onClick={() => {
              admin.addNote(id, { kind: "Comment", body: comment });
              setComment("");
            }}
          >
            Add comment
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ---------------- history tab ---------------- */

function HistoryTab({ id }: { id: string }) {
  const admin = useAdmin();
  const item = admin.getContent(id)!;
  const entries = admin.activity.filter((a) => a.recordId === id);
  const [compare, setCompare] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <Card title="Version history">
        {item.versions.length ? (
          <ul className="space-y-2">
            {item.versions
              .slice()
              .reverse()
              .map((v) => (
                <li key={v.id} className="flex flex-wrap items-center gap-3 border-b border-border pb-2 text-sm last:border-0">
                  <span className="w-10 font-medium text-ink">{v.label}</span>
                  <span className="text-ink">{v.summary}</span>
                  <span className="text-xs text-muted-foreground">
                    {v.editor} · {dateFmt(v.date)}
                  </span>
                  <button type="button" className={abtn.quiet} onClick={() => setCompare(compare === v.id ? null : v.id)}>
                    {compare === v.id ? "Hide" : "View previous"}
                  </button>
                  {compare === v.id ? (
                    <p className="w-full rounded bg-muted px-3 py-2 text-xs text-muted-foreground">
                      Prototype comparison: this version changed {v.summary.toLowerCase()}
                    </p>
                  ) : null}
                </li>
              ))}
          </ul>
        ) : (
          <EmptyState title="No versions recorded yet." />
        )}
      </Card>

      <Card title="Record activity">
        <ul className="space-y-2 text-sm">
          {entries.length ? (
            entries.map((entry) => (
              <li key={entry.id} className="flex gap-3">
                <span className="w-24 shrink-0 text-xs text-muted-foreground">{relative(entry.date)}</span>
                <span className="text-ink">
                  {entry.actor} {entry.action}.
                </span>
              </li>
            ))
          ) : (
            <li className="text-muted-foreground">No activity recorded for this record yet.</li>
          )}
        </ul>
      </Card>

      {item.notes.some((nt) => nt.kind === "Private note") ? (
        <InternalOnly>
          <ul className="space-y-1.5">
            {item.notes
              .filter((nt) => nt.kind === "Private note")
              .map((nt) => (
                <li key={nt.id}>
                  {nt.body} <span className="text-muted-foreground">— {nt.author}</span>
                </li>
              ))}
          </ul>
        </InternalOnly>
      ) : null}
    </div>
  );
}

/* ---------------- panel forms ---------------- */

function NoteComposer({ id }: { id: string }) {
  const admin = useAdmin();
  const item = admin.getContent(id)!;
  const [body, setBody] = useState("");
  const [kind, setKind] = useState<"Comment" | "Private note" | "Contributor feedback">("Comment");

  return (
    <div className="space-y-2">
      <ul className="space-y-2 text-xs">
        {item.notes.slice(-4).map((nt) => (
          <li
            key={nt.id}
            className={`rounded border px-2.5 py-2 ${
              nt.kind === "Private note" ? "border-dashed border-clay/50 bg-blush/40" : "border-border"
            }`}
          >
            <p className="font-medium text-ink">{nt.kind}</p>
            <p className="mt-0.5 text-ink">{nt.body}</p>
            <p className="mt-0.5 text-muted-foreground">
              {nt.author} · {relative(nt.date)}
            </p>
          </li>
        ))}
        {!item.notes.length ? <li className="text-muted-foreground">No notes yet.</li> : null}
      </ul>
      <label className="block text-xs text-muted-foreground">
        <span className="sr-only">Note type</span>
        <select className={`${field} min-h-8 py-1 text-xs`} value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
          <option>Comment</option>
          <option>Private note</option>
          <option>Contributor feedback</option>
        </select>
      </label>
      <label className="block text-xs text-muted-foreground">
        <span className="sr-only">Note</span>
        <textarea className={field} rows={2} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Add a note. Use @name to mention a colleague." />
      </label>
      <button
        type="button"
        className={abtn.small}
        disabled={!body.trim()}
        onClick={() => {
          admin.addNote(id, { kind, body });
          setBody("");
        }}
      >
        Add note
      </button>
      <p className="text-[0.7rem] text-muted-foreground">Private notes never appear in the Contributor Workspace.</p>
    </div>
  );
}

function ScheduleForm({ id, onDone }: { id: string; onDone: () => void }) {
  const admin = useAdmin();
  const item = admin.getContent(id)!;
  const [date, setDate] = useState(new Date(Date.now() + 86_400_000).toISOString().slice(0, 10));
  const [time, setTime] = useState("09:00");
  const [zone, setZone] = useState("Asia/Jakarta (WIB)");
  const [placements, setPlacements] = useState<string[]>(item.featured ?? []);

  const toggle = (p: string) => setPlacements((v) => (v.includes(p) ? v.filter((x) => x !== p) : [...v, p]));

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-muted-foreground">
          <span className="mb-1 block">Date</span>
          <input type="date" className={field} value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="text-xs text-muted-foreground">
          <span className="mb-1 block">Time</span>
          <input type="time" className={field} value={time} onChange={(e) => setTime(e.target.value)} />
        </label>
        <label className="text-xs text-muted-foreground">
          <span className="mb-1 block">Time zone</span>
          <select className={field} value={zone} onChange={(e) => setZone(e.target.value)}>
            <option>Asia/Jakarta (WIB)</option>
            <option>Asia/Makassar (WITA)</option>
            <option>Europe/London (GMT)</option>
            <option>Asia/Tokyo (JST)</option>
          </select>
        </label>
      </div>
      <fieldset>
        <legend className="text-xs font-medium text-ink">Featured placement</legend>
        <div className="mt-1.5 flex flex-wrap gap-3 text-xs">
          {["Homepage", "In Focus", "Featured story", "Collection"].map((p) => (
            <label key={p} className="flex items-center gap-1.5">
              <input type="checkbox" checked={placements.includes(p)} onChange={() => toggle(p)} />
              {p}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex gap-2">
        <button
          type="button"
          className={abtn.primary}
          onClick={() => {
            admin.schedulePublication(id, new Date(`${date}T${time}`).toISOString(), zone);
            admin.updateContent(id, { featured: placements as never });
            onDone();
          }}
        >
          Schedule
        </button>
      </div>
      <p className="text-[0.7rem] text-muted-foreground">Placement options are internal and are never shown to contributors.</p>
    </div>
  );
}

function RevisionForm({ id, onDone }: { id: string; onDone: () => void }) {
  const admin = useAdmin();
  const [section, setSection] = useState("");
  const [note, setNote] = useState("");
  const [kind, setKind] = useState<"Required" | "Suggestion" | "Question">("Required");

  return (
    <div className="space-y-3">
      <label className="block text-xs text-muted-foreground">
        <span className="mb-1 block">Section</span>
        <input className={field} value={section} onChange={(e) => setSection(e.target.value)} placeholder="Historical context" />
      </label>
      <label className="block text-xs text-muted-foreground">
        <span className="mb-1 block">Feedback for the contributor</span>
        <textarea className={field} rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      <label className="block text-xs text-muted-foreground">
        <span className="mb-1 block">Type</span>
        <select className={field} value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
          <option>Required</option>
          <option>Suggestion</option>
          <option>Question</option>
        </select>
      </label>
      <button
        type="button"
        className={abtn.primary}
        disabled={!note.trim()}
        onClick={() => {
          admin.addFeedback(id, { section: section || "General", note, kind, visibleToContributor: true });
          admin.transition(id, "revision_requested", "Revision requested with contributor-visible feedback.");
          onDone();
        }}
      >
        Send back for revision
      </button>
    </div>
  );
}
