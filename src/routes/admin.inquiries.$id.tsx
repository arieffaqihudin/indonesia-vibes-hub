import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { INQUIRY_STATUSES, can, type InquiryQualification, type InquiryStatus } from "@/lib/admin/types";
import {
  Card,
  EmptyState,
  InternalOnly,
  PageHeading,
  PrototypeNote,
  Tag,
  abtn,
  dateFmt,
  field,
  relative,
} from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/inquiries/$id")({
  head: adminHead("Inquiry", "Qualify an inquiry, ask for clarification, and route it to the right partner."),
  component: InquiryDetail,
});

function InquiryDetail() {
  const { id } = Route.useParams();
  const admin = useAdmin();
  const inquiry = admin.inquiries.find((i) => i.id === id);
  const editable = can(admin.role, "partnership");

  if (!inquiry) {
    return (
      <EmptyState
        title="That inquiry no longer exists."
        action={
          <Link to="/admin/inquiries" className={abtn.secondary}>
            Back to inquiries
          </Link>
        }
      />
    );
  }

  return (
    <>
      <PageHeading
        eyebrow={`Inquiry ${inquiry.reference}`}
        title={inquiry.subject}
        description={`${inquiry.category} · received ${relative(inquiry.receivedAt)}`}
        actions={
          <Link to="/admin/inquiries" className={abtn.secondary}>
            Back to inquiries
          </Link>
        }
      />

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="space-y-4">
          <Card title="What was asked">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Requester</dt>
                <dd className="text-ink">
                  {inquiry.requesterName} — {inquiry.requesterRole}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Organisation</dt>
                <dd className="text-ink">
                  {inquiry.organisation}, {inquiry.country}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Desired outcome</dt>
                <dd className="text-ink">{inquiry.desiredOutcome}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Timeframe</dt>
                <dd className="text-ink">{inquiry.timeframe}</dd>
              </div>
            </dl>
            <p className="mt-3 text-sm leading-relaxed text-ink">{inquiry.summary}</p>
            {inquiry.attachments.length ? (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {inquiry.attachments.map((a) => (
                  <li key={a}>
                    <Tag tone="quiet">{a}</Tag>
                  </li>
                ))}
              </ul>
            ) : null}
          </Card>

          <Card title="Qualification" description="A short structured judgement, not a long form.">
            <QualificationForm id={inquiry.id} disabled={!editable} />
          </Card>

          <Card title="Clarification" description="Questions sent to the requester and their replies.">
            <ul className="space-y-2 text-sm">
              {inquiry.clarifications.map((c) => (
                <li key={c.id} className="rounded border border-border p-3">
                  <p className="text-ink">{c.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Sent by {c.sentBy} · {dateFmt(c.sentAt)} · {c.status}
                  </p>
                  {c.response ? <p className="mt-2 border-l-2 border-primary/40 pl-3 text-ink">{c.response}</p> : null}
                </li>
              ))}
              {!inquiry.clarifications.length ? <li className="text-muted-foreground">No clarification requested.</li> : null}
            </ul>
            {editable ? <ClarificationForm id={inquiry.id} /> : null}
          </Card>

          <Card title="Introductions" description="Consent is confirmed before any contact detail is shared.">
            <ul className="space-y-2 text-sm">
              {inquiry.introductions.map((intro) => {
                const partner = admin.partners.find((p) => p.id === intro.partnerId);
                return (
                  <li key={intro.id} className="rounded border border-border p-3">
                    <p className="text-ink">
                      {partner ? (
                        <Link to="/admin/partners/$id" params={{ id: partner.id }} className="text-primary underline-offset-4 hover:underline">
                          {partner.name}
                        </Link>
                      ) : (
                        intro.partnerId
                      )}{" "}
                      — {intro.contactPerson}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {dateFmt(intro.introducedAt)} · consent {intro.consentConfirmed ? "confirmed" : "not confirmed"}
                    </p>
                    <p className="mt-1 text-sm text-ink">{intro.reason}</p>
                    {intro.outcome ? <p className="mt-1 text-xs text-muted-foreground">Outcome: {intro.outcome}</p> : null}
                  </li>
                );
              })}
              {!inquiry.introductions.length ? <li className="text-muted-foreground">No introduction made yet.</li> : null}
            </ul>
            {editable ? <IntroductionForm id={inquiry.id} /> : null}
          </Card>

          <Card title="Timeline">
            <ul className="space-y-2 text-sm">
              {inquiry.timeline.map((t) => (
                <li key={t.id} className="flex gap-3">
                  <span className="w-28 shrink-0 text-xs text-muted-foreground">{dateFmt(t.date)}</span>
                  <span className="text-ink">
                    {t.label} <span className="text-xs text-muted-foreground">— {t.actor} · {t.channel}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {inquiry.notes.length ? (
            <InternalOnly>
              <ul className="space-y-1.5">
                {inquiry.notes.map((n) => (
                  <li key={n.id}>
                    {n.body} <span className="text-muted-foreground">— {n.author}, {relative(n.date)}</span>
                  </li>
                ))}
              </ul>
            </InternalOnly>
          ) : null}
        </div>

        <aside className="space-y-4 border-t border-border pt-5 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-6">
          <Card title="Handling">
            <label className="block text-xs text-muted-foreground">
              <span className="mb-1 block">Status</span>
              <select
                className={field}
                value={inquiry.status}
                disabled={!editable}
                onChange={(e) => admin.updateInquiry(inquiry.id, { status: e.target.value as InquiryStatus }, `set the inquiry status to ${e.target.value}`)}
              >
                {INQUIRY_STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="mt-3 block text-xs text-muted-foreground">
              <span className="mb-1 block">Assigned to</span>
              <select
                className={field}
                value={inquiry.assignedTo ?? ""}
                disabled={!editable}
                onChange={(e) => admin.updateInquiry(inquiry.id, { assignedTo: e.target.value })}
              >
                <option value="">Unassigned</option>
                {admin.users.map((u) => (
                  <option key={u.id}>{u.name}</option>
                ))}
              </select>
            </label>
            <label className="mt-3 block text-xs text-muted-foreground">
              <span className="mb-1 block">Next action</span>
              <input
                className={field}
                value={inquiry.nextAction ?? ""}
                disabled={!editable}
                onChange={(e) => admin.updateInquiry(inquiry.id, { nextAction: e.target.value })}
              />
            </label>
            {editable ? (
              <button
                type="button"
                className={`${abtn.secondary} mt-3`}
                onClick={() =>
                  admin.addFollowUp({
                    title: inquiry.nextAction || `Follow up on ${inquiry.reference}`,
                    dueDate: new Date(Date.now() + 7 * 86_400_000).toISOString(),
                    relatedType: "Inquiry",
                    relatedId: inquiry.id,
                    relatedLabel: inquiry.subject,
                  })
                }
              >
                Create a follow-up
              </button>
            ) : null}
          </Card>

          <Card title="Related content">
            <ul className="space-y-1 text-sm">
              {inquiry.relatedContentIds.map((cid) => {
                const item = admin.getContent(cid);
                return item ? (
                  <li key={cid}>
                    <Link to="/admin/content/$id" params={{ id: cid }} className="text-ink hover:text-primary">
                      {item.title}
                    </Link>
                  </li>
                ) : null;
              })}
              {!inquiry.relatedContentIds.length ? <li className="text-muted-foreground">Nothing linked yet.</li> : null}
            </ul>
          </Card>

          <PrototypeNote>Requester contact details are visible only to partnership roles and leadership.</PrototypeNote>
        </aside>
      </div>
    </>
  );
}

function QualificationForm({ id, disabled }: { id: string; disabled: boolean }) {
  const admin = useAdmin();
  const inquiry = admin.inquiries.find((i) => i.id === id)!;
  const q = inquiry.qualification;
  const set = (patch: Partial<typeof q>) => admin.updateInquiry(id, { qualification: { ...q, ...patch } });

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="text-xs text-muted-foreground sm:col-span-2">
        <span className="mb-1 block">What is being asked for?</span>
        <input className={field} value={q.request ?? ""} disabled={disabled} onChange={(e) => set({ request: e.target.value })} />
      </label>
      <label className="text-xs text-muted-foreground">
        <span className="mb-1 block">Is it clear?</span>
        <select className={field} value={q.clear ?? ""} disabled={disabled} onChange={(e) => set(e.target.value ? { clear: e.target.value as NonNullable<InquiryQualification["clear"]> } : {})}>
          <option value="">Not assessed</option>
          <option>Yes</option>
          <option>Partly</option>
          <option>No</option>
        </select>
      </label>
      <label className="text-xs text-muted-foreground">
        <span className="mb-1 block">Is it credible?</span>
        <select className={field} value={q.credible ?? ""} disabled={disabled} onChange={(e) => set(e.target.value ? { credible: e.target.value as NonNullable<InquiryQualification["credible"]> } : {})}>
          <option value="">Not assessed</option>
          <option>Yes</option>
          <option>Needs checking</option>
          <option>No</option>
        </select>
      </label>
      <label className="text-xs text-muted-foreground">
        <span className="mb-1 block">Cultural area</span>
        <input className={field} value={q.culturalArea ?? ""} disabled={disabled} onChange={(e) => set({ culturalArea: e.target.value })} />
      </label>
      <label className="text-xs text-muted-foreground">
        <span className="mb-1 block">Geography</span>
        <input className={field} value={q.geography ?? ""} disabled={disabled} onChange={(e) => set({ geography: e.target.value })} />
      </label>
      <label className="text-xs text-muted-foreground">
        <span className="mb-1 block">Likely partner</span>
        <input className={field} value={q.potentialPartner ?? ""} disabled={disabled} onChange={(e) => set({ potentialPartner: e.target.value })} />
      </label>
      <label className="text-xs text-muted-foreground">
        <span className="mb-1 block">Possible outcome</span>
        <input className={field} value={q.possibleOutcome ?? ""} disabled={disabled} onChange={(e) => set({ possibleOutcome: e.target.value })} />
      </label>
    </div>
  );
}

function ClarificationForm({ id }: { id: string }) {
  const admin = useAdmin();
  const [message, setMessage] = useState("");
  return (
    <div className="mt-3 border-t border-border pt-3">
      <label className="block text-xs text-muted-foreground">
        <span className="mb-1 block">Ask the requester a question</span>
        <textarea className={field} rows={2} value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>
      <button
        type="button"
        className={`${abtn.secondary} mt-2`}
        disabled={!message.trim()}
        onClick={() => {
          admin.addClarification(id, message);
          setMessage("");
        }}
      >
        Send clarification request
      </button>
    </div>
  );
}

function IntroductionForm({ id }: { id: string }) {
  const admin = useAdmin();
  const [partnerId, setPartnerId] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [reason, setReason] = useState("");
  const [contextShared, setContextShared] = useState("");
  const [consent, setConsent] = useState(false);

  return (
    <div className="mt-3 space-y-3 border-t border-border pt-3">
      <label className="block text-xs text-muted-foreground">
        <span className="mb-1 block">Partner</span>
        <select className={field} value={partnerId} onChange={(e) => setPartnerId(e.target.value)}>
          <option value="">Choose a partner</option>
          {admin.partners.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {p.country}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-xs text-muted-foreground">
        <span className="mb-1 block">Contact person</span>
        <input className={field} value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
      </label>
      <label className="block text-xs text-muted-foreground">
        <span className="mb-1 block">Why this partner</span>
        <textarea className={field} rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
      </label>
      <label className="block text-xs text-muted-foreground">
        <span className="mb-1 block">Context shared with both sides</span>
        <textarea className={field} rows={2} value={contextShared} onChange={(e) => setContextShared(e.target.value)} />
      </label>
      <label className="flex items-center gap-2 text-xs text-ink">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        The partner has agreed to be introduced.
      </label>
      <button
        type="button"
        className={abtn.primary}
        disabled={!partnerId || !consent || !reason.trim()}
        onClick={() => {
          admin.addIntroduction(id, { partnerId, contactPerson, reason, contextShared, consentConfirmed: consent });
          setPartnerId("");
          setContactPerson("");
          setReason("");
          setContextShared("");
          setConsent(false);
        }}
      >
        Record introduction
      </button>
      <p className="text-[0.7rem] text-muted-foreground">
        An introduction cannot be recorded until consent is confirmed.
      </p>
    </div>
  );
}
