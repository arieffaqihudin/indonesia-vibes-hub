import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { INTERACTION_KINDS, RELATIONSHIP_STATUSES, can, type InteractionKind, type RelationshipStatus } from "@/lib/admin/types";
import { Card, EmptyState, InternalOnly, PageHeading, Tag, abtn, dateFmt, field, relative } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/partners/$id")({
  head: adminHead("Partner", "Relationship history, connected records and next steps for one partner."),
  component: PartnerDetail,
});

function PartnerDetail() {
  const { id } = Route.useParams();
  const admin = useAdmin();
  const partner = admin.partners.find((p) => p.id === id);
  const editable = can(admin.role, "partnership");

  if (!partner) {
    return (
      <EmptyState
        title="That partner no longer exists."
        action={
          <Link to="/admin/partners" className={abtn.secondary}>
            Back to partners
          </Link>
        }
      />
    );
  }

  const interactions = admin.interactions.filter((i) => i.partnerId === partner.id).sort((a, b) => b.date.localeCompare(a.date));
  const collaborations = admin.pipeline.filter((c) => c.confirmedPartnerIds.includes(partner.id) || c.potentialPartnerIds.includes(partner.id));
  const followUps = admin.followUps.filter((f) => f.relatedType === "Partner" && f.relatedId === partner.id);

  return (
    <>
      <PageHeading
        eyebrow={`${partner.type} · ${partner.city}, ${partner.country}`}
        title={partner.name}
        description={partner.collaborationInterests.join(" · ")}
        actions={
          <Link to="/admin/partners" className={abtn.secondary}>
            Back to partners
          </Link>
        }
      />

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="space-y-4">
          <Card title="Profile">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Expertise</dt>
                <dd className="text-ink">{partner.expertise.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Themes</dt>
                <dd className="text-ink">{partner.themes.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">How contact is made</dt>
                <dd className="text-ink">{partner.contactPathway}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Contact person</dt>
                <dd className="text-ink">{partner.contactPerson ?? "Through the institution"}</dd>
              </div>
            </dl>
          </Card>

          <Card title="Interaction history" description="What was discussed and what happens next.">
            <ul className="space-y-2 text-sm">
              {interactions.map((i) => (
                <li key={i.id} className="rounded border border-border p-3">
                  <p className="text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase">
                    {i.kind} · {dateFmt(i.date)}
                  </p>
                  <p className="mt-1 text-ink">{i.summary}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {i.participants} · recorded by {i.recordedBy}
                  </p>
                  {i.nextAction ? <p className="mt-1 text-xs text-ink">Next: {i.nextAction}</p> : null}
                  {i.privateNote ? <InternalOnly>{i.privateNote}</InternalOnly> : null}
                </li>
              ))}
              {!interactions.length ? <li className="text-muted-foreground">No interactions recorded yet.</li> : null}
            </ul>
            {editable ? <InteractionForm partnerId={partner.id} /> : null}
          </Card>

          <Card title="Collaborations">
            <ul className="space-y-1.5 text-sm">
              {collaborations.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-2">
                  <Link to="/admin/collaborations/$id" params={{ id: c.id }} className="text-ink hover:text-primary">
                    {c.title}
                  </Link>
                  <Tag tone="quiet">{c.stage}</Tag>
                </li>
              ))}
              {!collaborations.length ? <li className="text-muted-foreground">No collaborations recorded with this partner.</li> : null}
            </ul>
          </Card>

          <Card title="Connected records">
            <ul className="space-y-1.5 text-sm">
              {partner.relatedContentIds.map((cid) => {
                const item = admin.getContent(cid);
                return item ? (
                  <li key={cid}>
                    <Link to="/admin/content/$id" params={{ id: cid }} className="text-ink hover:text-primary">
                      {item.title}
                    </Link>
                  </li>
                ) : null;
              })}
              {!partner.relatedContentIds.length ? <li className="text-muted-foreground">Nothing linked yet.</li> : null}
            </ul>
          </Card>
        </div>

        <aside className="space-y-4 border-t border-border pt-5 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-6">
          <Card title="Relationship">
            <label className="block text-xs text-muted-foreground">
              <span className="mb-1 block">Status</span>
              <select
                className={field}
                value={partner.relationshipStatus}
                disabled={!editable}
                onChange={(e) => admin.updatePartner(partner.id, { relationshipStatus: e.target.value as RelationshipStatus })}
              >
                {RELATIONSHIP_STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <p className="mt-3 text-xs text-muted-foreground">
              Last interaction {partner.lastInteraction ? relative(partner.lastInteraction) : "not recorded"}.
            </p>
          </Card>

          <Card title="Follow-ups">
            <ul className="space-y-1.5 text-sm">
              {followUps.map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-2">
                  <span className="text-ink">{f.title}</span>
                  <span className="text-xs text-muted-foreground">{f.dueDate ? dateFmt(f.dueDate) : "No date"}</span>
                </li>
              ))}
              {!followUps.length ? <li className="text-muted-foreground">Nothing outstanding.</li> : null}
            </ul>
            {editable ? (
              <button
                type="button"
                className={`${abtn.small} mt-3`}
                onClick={() =>
                  admin.addFollowUp({
                    title: `Follow up with ${partner.name}`,
                    dueDate: new Date(Date.now() + 14 * 86_400_000).toISOString(),
                    relatedType: "Partner",
                    relatedId: partner.id,
                    relatedLabel: partner.name,
                  })
                }
              >
                Add a follow-up
              </button>
            ) : null}
          </Card>
        </aside>
      </div>
    </>
  );
}

function InteractionForm({ partnerId }: { partnerId: string }) {
  const admin = useAdmin();
  const [kind, setKind] = useState<InteractionKind>("Meeting");
  const [summary, setSummary] = useState("");
  const [participants, setParticipants] = useState("");
  const [nextAction, setNextAction] = useState("");

  return (
    <div className="mt-3 space-y-2 border-t border-border pt-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs text-muted-foreground">
          <span className="mb-1 block">Type</span>
          <select className={field} value={kind} onChange={(e) => setKind(e.target.value as InteractionKind)}>
            {INTERACTION_KINDS.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </label>
        <label className="text-xs text-muted-foreground">
          <span className="mb-1 block">Participants</span>
          <input className={field} value={participants} onChange={(e) => setParticipants(e.target.value)} />
        </label>
      </div>
      <label className="block text-xs text-muted-foreground">
        <span className="mb-1 block">Summary</span>
        <textarea className={field} rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} />
      </label>
      <label className="block text-xs text-muted-foreground">
        <span className="mb-1 block">Next action</span>
        <input className={field} value={nextAction} onChange={(e) => setNextAction(e.target.value)} />
      </label>
      <button
        type="button"
        className={abtn.secondary}
        disabled={!summary.trim()}
        onClick={() => {
          admin.addInteraction({ kind, date: new Date().toISOString(), participants, partnerId, summary, nextAction });
          setSummary("");
          setParticipants("");
          setNextAction("");
        }}
      >
        Record interaction
      </button>
    </div>
  );
}
