/**
 * Prototype state for the internal dashboard. Everything is held in memory and
 * mirrored to localStorage so a demo session survives a reload. There is no
 * backend in this phase — actions record activity exactly as the real system
 * would, which is what makes the workflow legible.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  seedActivity,
  seedClaims,
  seedContent,
  seedCuration,
  seedFollowUps,
  seedInquiries,
  seedInteractions,
  seedMedia,
  seedNotifications,
  seedFocusOverrides,
  seedPartners,
  seedPipeline,
  seedSources,
  seedTaxonomy,
  seedUsers,
} from "./seed";
import {
  CONTENT_STATUS,
  type ActivityEntry,
  type AdminNotification,
  type AdminRole,
  type AdminUser,
  type Claim,
  type ContentItem,
  type ContentStatus,
  type CurationSlot,
  type EditorialFeedback,
  type FollowUp,
  type Inquiry,
  type Interaction,
  type InternalNote,
  type MediaAsset,
  type FocusOverride,
  type Partner,
  type PipelineCollaboration,
  type SourceRecord,
  type TaxonomyTerm,
} from "./types";

const STORAGE_KEY = "iv-admin-prototype-v1";

interface AdminState {
  currentUserId: string;
  content: ContentItem[];
  sources: SourceRecord[];
  claims: Claim[];
  media: MediaAsset[];
  inquiries: Inquiry[];
  partners: Partner[];
  pipeline: PipelineCollaboration[];
  followUps: FollowUp[];
  interactions: Interaction[];
  taxonomy: TaxonomyTerm[];
  curation: CurationSlot[];
  focusOverrides: FocusOverride[];
  activity: ActivityEntry[];
  notifications: AdminNotification[];
  users: AdminUser[];
}

const initialState = (): AdminState => ({
  currentUserId: "u-maya",
  content: seedContent,
  sources: seedSources,
  claims: seedClaims,
  media: seedMedia,
  inquiries: seedInquiries,
  partners: seedPartners,
  pipeline: seedPipeline,
  followUps: seedFollowUps,
  interactions: seedInteractions,
  taxonomy: seedTaxonomy,
  curation: seedCuration,
  focusOverrides: seedFocusOverrides,
  activity: seedActivity,
  notifications: seedNotifications,
  users: seedUsers,
});

const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
const now = () => new Date().toISOString();

interface AdminContextValue extends AdminState {
  user: AdminUser;
  role: AdminRole;
  setCurrentUser: (id: string) => void;
  /* content */
  getContent: (id: string) => ContentItem | undefined;
  createContent: (item: ContentItem) => void;
  updateContent: (id: string, patch: Partial<ContentItem>, activity?: string) => void;
  transition: (id: string, to: ContentStatus, note?: string) => void;
  schedulePublication: (id: string, isoDate: string, timeZone: string) => void;
  addFeedback: (id: string, feedback: Omit<EditorialFeedback, "id" | "date" | "author">) => void;
  addNote: (id: string, note: Omit<InternalNote, "id" | "date" | "author">) => void;
  addRelationship: (id: string, group: keyof ContentItem["relationships"], targetId: string) => void;
  removeRelationship: (id: string, group: keyof ContentItem["relationships"], targetId: string) => void;
  markReviewed: (id: string) => void;
  /* sources, claims, media */
  upsertSource: (source: SourceRecord) => void;
  updateClaim: (id: string, patch: Partial<Claim>) => void;
  addClaim: (claim: Omit<Claim, "id">) => void;
  updateMedia: (id: string, patch: Partial<MediaAsset>) => void;
  /* partnership */
  updateInquiry: (id: string, patch: Partial<Inquiry>, activity?: string) => void;
  addClarification: (id: string, message: string) => void;
  addIntroduction: (id: string, intro: Omit<Inquiry["introductions"][number], "id" | "introducedAt">) => void;
  addInquiryNote: (id: string, note: Omit<InternalNote, "id" | "date" | "author">) => void;
  updatePartner: (id: string, patch: Partial<Partner>) => void;
  addPartnerNote: (id: string, note: Omit<InternalNote, "id" | "date" | "author">) => void;
  updateCollaboration: (id: string, patch: Partial<PipelineCollaboration>, activity?: string) => void;
  addInteraction: (interaction: Omit<Interaction, "id" | "recordedBy">) => void;
  addFollowUp: (followUp: Omit<FollowUp, "id" | "status" | "owner">) => void;
  updateFollowUp: (id: string, patch: Partial<FollowUp>) => void;
  /* configuration */
  updateTaxonomy: (id: string, patch: Partial<TaxonomyTerm>) => void;
  addTaxonomy: (term: Omit<TaxonomyTerm, "id" | "usage">) => void;
  mergeTaxonomy: (fromId: string, intoId: string) => void;
  setCuration: (slots: CurationSlot[]) => void;
  setFocusOverrides: (overrides: FocusOverride[]) => void;
  updateUser: (id: string, patch: Partial<AdminUser>) => void;
  /* notifications */
  markNotificationsRead: () => void;
  resetPrototype: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminState>(initialState);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState(), ...(JSON.parse(raw) as AdminState) });
    } catch {
      /* prototype storage is best-effort */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota errors in the prototype */
    }
  }, [state]);

  const user = state.users.find((u) => u.id === state.currentUserId) ?? state.users[0]!;

  const log = useCallback(
    (entry: Omit<ActivityEntry, "id" | "date" | "actor">) =>
      setState((s) => ({
        ...s,
        activity: [
          { id: uid("ac"), date: now(), actor: s.users.find((u) => u.id === s.currentUserId)?.name ?? "Team", ...entry },
          ...s.activity,
        ].slice(0, 200),
      })),
    [],
  );

  const patchContent = useCallback((id: string, patch: Partial<ContentItem>) => {
    setState((s) => ({
      ...s,
      content: s.content.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: now() } : c)),
    }));
  }, []);

  const value = useMemo<AdminContextValue>(() => {
    const byId = new Map(state.content.map((c) => [c.id, c]));
    const actor = user.name;

    return {
      ...state,
      user,
      role: user.role,
      setCurrentUser: (id) => setState((s) => ({ ...s, currentUserId: id })),

      getContent: (id) => byId.get(id),

      createContent: (item) => {
        setState((s) => ({ ...s, content: [item, ...s.content] }));
        log({ action: `created “${item.title}”`, recordType: "Content", recordId: item.id, recordTitle: item.title });
      },

      updateContent: (id, patch, activity) => {
        patchContent(id, patch);
        if (activity) {
          const item = byId.get(id);
          log({ action: activity, recordType: "Content", recordId: id, recordTitle: item?.title ?? id });
        }
      },

      transition: (id, to, note) => {
        const item = byId.get(id);
        if (!item) return;
        const version = {
          id: uid("v"),
          label: `v${item.versions.length + 1}`,
          editor: actor,
          date: now(),
          summary: note ?? `Moved to ${CONTENT_STATUS[to].label}.`,
        };
        patchContent(id, {
          status: to,
          stageSince: now(),
          versions: [...item.versions, version],
          ...(to === "published" ? { publishedAt: now(), lastReviewed: now() } : {}),
        });
        log({
          action: `moved “${item.title}” to ${CONTENT_STATUS[to].label}`,
          recordType: "Content",
          recordId: id,
          recordTitle: item.title,
        });
      },

      schedulePublication: (id, isoDate, timeZone) => {
        const item = byId.get(id);
        patchContent(id, { status: "scheduled", scheduledFor: isoDate, scheduleTimeZone: timeZone, stageSince: now() });
        log({ action: "scheduled publication", recordType: "Content", recordId: id, recordTitle: item?.title ?? id });
      },

      addFeedback: (id, feedback) => {
        const item = byId.get(id);
        if (!item) return;
        patchContent(id, {
          feedback: [...item.feedback, { ...feedback, id: uid("fb"), date: now(), author: actor }],
        });
      },

      addNote: (id, note) => {
        const item = byId.get(id);
        if (!item) return;
        patchContent(id, { notes: [...item.notes, { ...note, id: uid("nt"), date: now(), author: actor }] });
      },

      addRelationship: (id, group, targetId) => {
        const item = byId.get(id);
        if (!item || item.relationships[group].includes(targetId)) return;
        patchContent(id, { relationships: { ...item.relationships, [group]: [...item.relationships[group], targetId] } });
        log({ action: `added a ${group} relationship`, recordType: "Content", recordId: id, recordTitle: item.title });
      },

      removeRelationship: (id, group, targetId) => {
        const item = byId.get(id);
        if (!item) return;
        patchContent(id, {
          relationships: { ...item.relationships, [group]: item.relationships[group].filter((x) => x !== targetId) },
        });
        log({ action: `removed a ${group} relationship`, recordType: "Content", recordId: id, recordTitle: item.title });
      },

      markReviewed: (id) => {
        const item = byId.get(id);
        if (!item) return;
        const freq = item.reviewFrequencyDays ?? 365;
        patchContent(id, {
          lastReviewed: now(),
          nextReview: new Date(Date.now() + freq * 86_400_000).toISOString(),
        });
        log({ action: "recorded a content review", recordType: "Content", recordId: id, recordTitle: item.title });
      },

      upsertSource: (source) => {
        setState((s) => ({
          ...s,
          sources: s.sources.some((x) => x.id === source.id)
            ? s.sources.map((x) => (x.id === source.id ? source : x))
            : [source, ...s.sources],
        }));
        log({ action: `set source status to ${source.status}`, recordType: "Source", recordId: source.id, recordTitle: source.title });
      },

      updateClaim: (id, patch) =>
        setState((s) => ({ ...s, claims: s.claims.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),

      addClaim: (claim) => setState((s) => ({ ...s, claims: [{ ...claim, id: uid("cl") }, ...s.claims] })),

      updateMedia: (id, patch) => {
        setState((s) => ({
          ...s,
          media: s.media.map((m) => (m.id === id ? { ...m, ...patch, updatedAt: now() } : m)),
        }));
        if (patch.permission) {
          const asset = state.media.find((m) => m.id === id);
          log({ action: `changed media rights to ${patch.permission}`, recordType: "Media", recordId: id, recordTitle: asset?.fileName ?? id });
        }
      },

      updateInquiry: (id, patch, activity) => {
        setState((s) => ({
          ...s,
          inquiries: s.inquiries.map((q) =>
            q.id === id
              ? {
                  ...q,
                  ...patch,
                  timeline: activity
                    ? [...q.timeline, { id: uid("tl"), date: now(), label: activity, actor, channel: "Internal" as const }]
                    : q.timeline,
                }
              : q,
          ),
        }));
        if (activity) {
          const inquiry = state.inquiries.find((q) => q.id === id);
          log({ action: activity, recordType: "Inquiry", recordId: id, recordTitle: inquiry?.reference ?? id });
        }
      },

      addClarification: (id, message) =>
        setState((s) => ({
          ...s,
          inquiries: s.inquiries.map((q) =>
            q.id === id
              ? {
                  ...q,
                  status: "Need more information",
                  clarifications: [
                    ...q.clarifications,
                    { id: uid("cf"), message, sentAt: now(), sentBy: actor, status: "Awaiting response" as const },
                  ],
                  timeline: [
                    ...q.timeline,
                    { id: uid("tl"), date: now(), label: "Additional information requested", actor, channel: "External" as const },
                  ],
                }
              : q,
          ),
        })),

      addIntroduction: (id, intro) =>
        setState((s) => ({
          ...s,
          inquiries: s.inquiries.map((q) =>
            q.id === id
              ? {
                  ...q,
                  status: "Forwarded",
                  introductions: [...q.introductions, { ...intro, id: uid("in"), introducedAt: now() }],
                  timeline: [
                    ...q.timeline,
                    { id: uid("tl"), date: now(), label: "Introduction sent", actor, channel: "External" as const },
                  ],
                }
              : q,
          ),
        })),

      addInquiryNote: (id, note) =>
        setState((s) => ({
          ...s,
          inquiries: s.inquiries.map((q) =>
            q.id === id ? { ...q, notes: [...q.notes, { ...note, id: uid("nt"), date: now(), author: actor }] } : q,
          ),
        })),

      updatePartner: (id, patch) =>
        setState((s) => ({ ...s, partners: s.partners.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),

      addPartnerNote: (id, note) =>
        setState((s) => ({
          ...s,
          partners: s.partners.map((p) =>
            p.id === id ? { ...p, notes: [...p.notes, { ...note, id: uid("nt"), date: now(), author: actor }] } : p,
          ),
        })),

      updateCollaboration: (id, patch, activity) => {
        setState((s) => ({
          ...s,
          pipeline: s.pipeline.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: now() } : c)),
        }));
        if (activity) {
          const collab = state.pipeline.find((c) => c.id === id);
          log({ action: activity, recordType: "Collaboration", recordId: id, recordTitle: collab?.title ?? id });
        }
      },

      addInteraction: (interaction) =>
        setState((s) => ({ ...s, interactions: [{ ...interaction, id: uid("ix"), recordedBy: actor }, ...s.interactions] })),

      addFollowUp: (followUp) =>
        setState((s) => ({ ...s, followUps: [{ ...followUp, id: uid("fu"), status: "Open", owner: actor }, ...s.followUps] })),

      updateFollowUp: (id, patch) =>
        setState((s) => ({ ...s, followUps: s.followUps.map((f) => (f.id === id ? { ...f, ...patch } : f)) })),

      updateTaxonomy: (id, patch) =>
        setState((s) => ({ ...s, taxonomy: s.taxonomy.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),

      addTaxonomy: (term) => setState((s) => ({ ...s, taxonomy: [{ ...term, id: uid("tx"), usage: 0 }, ...s.taxonomy] })),

      mergeTaxonomy: (fromId, intoId) =>
        setState((s) => {
          const from = s.taxonomy.find((t) => t.id === fromId);
          const into = s.taxonomy.find((t) => t.id === intoId);
          if (!from || !into) return s;
          return {
            ...s,
            taxonomy: s.taxonomy
              .filter((t) => t.id !== fromId)
              .map((t) => (t.id === intoId ? { ...t, usage: t.usage + from.usage } : t)),
          };
        }),

      setCuration: (slots) => setState((s) => ({ ...s, curation: slots })),
      setFocusOverrides: (overrides) => setState((s) => ({ ...s, focusOverrides: overrides })),
      updateUser: (id, patch) =>
        setState((s) => ({ ...s, users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) })),

      markNotificationsRead: () =>
        setState((s) => ({ ...s, notifications: s.notifications.map((notif) => ({ ...notif, read: true })) })),

      resetPrototype: () => setState(initialState()),
    };
  }, [state, user, patchContent, log]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}
