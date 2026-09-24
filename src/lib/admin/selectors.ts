/**
 * Derived operational views. Everything the dashboard shows as "needs
 * attention" is computed from record state, never stored as a separate flag.
 */

import { collections, events, forms, papers, people, places, stories } from "@/data/content";
import { institutions } from "@/data/institutions";
import { collaborations } from "@/data/collaborations";
import {
  BLOCKING_RIGHTS,
  CONTENT_STATUS,
  daysBetween,
  daysUntil,
  type AdminRole,
  type Claim,
  type ContentItem,
  type FollowUp,
  type Inquiry,
  type MediaAsset,
  type Partner,
  type PipelineCollaboration,
  type Relationships,
  type SourceRecord,
} from "./types";

/* ---------------- relationship label resolution ---------------- */

interface GraphEntry {
  id: string;
  label: string;
  group: keyof Relationships;
  detail?: string;
  path?: string;
}

const entries: GraphEntry[] = [
  ...forms.map((f) => ({ id: f.id, label: f.name, group: "culture" as const, detail: f.pillar, path: `/culture/${f.slug}` })),
  ...people.map((p) => ({
    id: p.id,
    label: p.name,
    group: (p.entity === "community" ? "communities" : "people") as keyof Relationships,
    detail: p.role,
    path: `/people/${p.slug}`,
  })),
  ...institutions.map((i) => ({ id: i.id, label: i.name, group: "institutions" as const, detail: `${i.type} · ${i.city}`, path: `/institutions/${i.slug}` })),
  ...places.map((p) => ({ id: p.id, label: p.name, group: "places" as const, detail: p.country, path: `/places/${p.slug}` })),
  ...events.map((e) => ({ id: e.id, label: e.title, group: "events" as const, detail: e.type ?? "Event", path: `/events/${e.slug}` })),
  ...collaborations.map((c) => ({ id: c.id, label: c.title, group: "collaborations" as const, detail: (c.countries ?? []).join(", "), path: `/collaborate/${c.slug}` })),
  ...collections.map((c) => ({ id: c.id, label: c.title, group: "collections" as const, path: `/understand-indonesia/collections/${c.slug}` })),
  ...papers.map((p) => ({ id: p.id, label: p.title, group: "research" as const, detail: p.discipline })),
];

const entryMap = new Map(entries.map((e) => [e.id, e]));

export const graphEntry = (id: string) => entryMap.get(id);
export const graphEntriesFor = (group: keyof Relationships) => entries.filter((e) => e.group === group);
export const allGraphEntries = entries;

export const relationshipGroups: { key: keyof Relationships; label: string }[] = [
  { key: "culture", label: "Cultural subjects" },
  { key: "people", label: "People" },
  { key: "communities", label: "Communities" },
  { key: "institutions", label: "Institutions" },
  { key: "places", label: "Places" },
  { key: "events", label: "Events" },
  { key: "collaborations", label: "Collaborations" },
  { key: "collections", label: "Collections" },
  { key: "research", label: "Knowledge resources" },
];

/* ---------------- editorial queues ---------------- */

export const isInReview = (c: ContentItem) =>
  !["draft", "published", "archived"].includes(c.status);

export const queueBuckets: { id: string; label: string; match: (c: ContentItem, role: AdminRole, name: string) => boolean }[] = [
  {
    id: "mine",
    label: "Needs my review",
    match: (c, role, name) =>
      isInReview(c) &&
      (c.assignedTo === name ||
        (role === "Researcher / Fact Checker" && c.status === "verification") ||
        (role === "Subject Reviewer" && c.status === "subject_review") ||
        (role === "English Editor" && c.status === "english_editing") ||
        (role === "Multimedia Editor" && c.status === "media_rights") ||
        (role === "Managing Editor" && c.status === "ready_for_approval")),
  },
  { id: "unassigned", label: "Unassigned", match: (c) => isInReview(c) && !c.assignedTo },
  { id: "contributor", label: "Waiting for contributor", match: (c) => c.status === "revision_requested" },
  { id: "verification", label: "Waiting for verification", match: (c) => c.status === "verification" },
  { id: "subject", label: "Waiting for subject review", match: (c) => c.status === "subject_review" },
  { id: "english", label: "Waiting for English edit", match: (c) => c.status === "english_editing" },
  { id: "rights", label: "Waiting for rights", match: (c) => c.status === "media_rights" },
  { id: "approval", label: "Ready for approval", match: (c) => c.status === "ready_for_approval" },
];

export const statusLabel = (c: ContentItem) => CONTENT_STATUS[c.status].label;

export interface SourceIssue {
  item: ContentItem;
  unverified: SourceRecord[];
  unsupported: Claim[];
}

/** One row per record that still has an open verification question. */
export const contentSourceIssues = (content: ContentItem[], sources: SourceRecord[], claims: Claim[]): SourceIssue[] =>
  content
    .map((item) => ({
      item,
      unverified: sources.filter(
        (s) => s.contentId === item.id && (s.status === "Unverified" || s.status === "Verification in progress"),
      ),
      unsupported: claims.filter(
        (c) => c.contentId === item.id && (c.status === "Requires source" || c.status === "Disputed"),
      ),
    }))
    .filter((row) => row.unverified.length > 0 || row.unsupported.length > 0);

export const rightsIssues = (media: MediaAsset[]) =>
  media.filter((m) => BLOCKING_RIGHTS.includes(m.permission));

export const blockedForPublication = (item: ContentItem, media: MediaAsset[]) =>
  media.filter((m) => m.contentId === item.id && m.required && BLOCKING_RIGHTS.includes(m.permission));

/** Published records whose next review date has passed. */
export const staleContent = (content: ContentItem[]) =>
  content
    .filter((c) => c.status === "published" && c.nextReview && daysUntil(c.nextReview) < 0)
    .sort((a, b) => new Date(a.nextReview!).getTime() - new Date(b.nextReview!).getTime());

export const upcomingReviews = (content: ContentItem[], withinDays = 45) =>
  content.filter((c) => c.status === "published" && c.nextReview && daysUntil(c.nextReview) >= 0 && daysUntil(c.nextReview) <= withinDays);

export const averageQueueAge = (content: ContentItem[]) => {
  const inQueue = content.filter(isInReview);
  if (!inQueue.length) return 0;
  return Math.round(inQueue.reduce((sum, c) => sum + daysBetween(c.stageSince), 0) / inQueue.length);
};

/* ---------------- partnership queues ---------------- */

export const inquiriesNeedingRouting = (inquiries: Inquiry[]) =>
  inquiries.filter((q) => q.status === "New" || q.status === "Ready to route" || !q.assignedTo);

export const overdueFollowUps = (followUps: FollowUp[]) =>
  followUps.filter((f) => f.status === "Open" && f.dueDate && daysUntil(f.dueDate) < 0);

export const dueTodayFollowUps = (followUps: FollowUp[]) =>
  followUps.filter((f) => f.status === "Open" && f.dueDate && daysUntil(f.dueDate) === 0);

export const upcomingFollowUps = (followUps: FollowUp[]) =>
  followUps.filter((f) => f.status === "Open" && f.dueDate && daysUntil(f.dueDate) > 0);

export const undatedFollowUps = (followUps: FollowUp[]) =>
  followUps.filter((f) => f.status === "Open" && !f.dueDate);

/* ---------------- global agenda / country lens ---------------- */

export interface CountryRow {
  country: string;
  events: number;
  collaborations: number;
  institutions: number;
  inquiries: number;
  partners: number;
  total: number;
  coverage: "Strong content coverage" | "Developing" | "Limited records";
}

export function countryRows(
  content: ContentItem[],
  inquiries: Inquiry[],
  partners: Partner[],
  pipeline: PipelineCollaboration[],
): CountryRow[] {
  const map = new Map<string, CountryRow>();
  const ensure = (country: string) => {
    if (!map.has(country)) {
      map.set(country, {
        country,
        events: 0,
        collaborations: 0,
        institutions: 0,
        inquiries: 0,
        partners: 0,
        total: 0,
        coverage: "Limited records",
      });
    }
    return map.get(country)!;
  };

  for (const item of content) {
    for (const country of item.countries.length ? item.countries : ["Indonesia"]) {
      const row = ensure(country);
      if (item.kind === "event") row.events += 1;
      if (item.kind === "collaboration") row.collaborations += 1;
      if (item.kind === "institution") row.institutions += 1;
      row.total += 1;
    }
  }
  for (const q of inquiries) ensure(q.country).inquiries += 1;
  for (const p of partners) {
    const row = ensure(p.country);
    row.partners += 1;
  }
  for (const c of pipeline) for (const country of c.countries) ensure(country).total += 0;

  return [...map.values()]
    .map((row) => ({
      ...row,
      // Wording is about platform coverage, never cultural importance.
      coverage:
        row.total >= 8 ? ("Strong content coverage" as const) : row.total >= 3 ? ("Developing" as const) : ("Limited records" as const),
    }))
    .sort((a, b) => b.total - a.total);
}

/* ---------------- duplicate detection (simple prototype matching) ---------------- */

const normalise = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

/** Deliberately naive token overlap — no AI matching in this phase. */
export function possibleDuplicates(title: string, content: ContentItem[], limit = 3) {
  const tokens = new Set(normalise(title));
  if (!tokens.size) return [];
  return content
    .map((c) => {
      const other = normalise(c.title);
      const overlap = other.filter((t) => tokens.has(t)).length;
      return { item: c, score: overlap / Math.max(tokens.size, other.length || 1) };
    })
    .filter((r) => r.score >= 0.4 && normalise(r.item.title).join(" ") !== [...tokens].join(" "))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/* ---------------- global internal search ---------------- */

export interface AdminSearchResult {
  id: string;
  title: string;
  type: string;
  detail: string;
  to: string;
  params?: Record<string, string>;
}

export function adminSearch(
  query: string,
  data: {
    content: ContentItem[];
    inquiries: Inquiry[];
    partners: Partner[];
    pipeline: PipelineCollaboration[];
  },
): AdminSearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const hit = (...values: (string | undefined)[]) =>
    values.some((v) => v?.toLowerCase().includes(q));

  const results: AdminSearchResult[] = [];

  for (const c of data.content) {
    if (hit(c.title, c.organisation, c.contributor, c.location, c.themes.join(" "), c.countries.join(" "))) {
      results.push({
        id: c.id,
        title: c.title,
        type: "Content",
        detail: `${CONTENT_STATUS[c.status].label}${c.assignedTo ? ` · ${c.assignedTo}` : ""}`,
        to: "/admin/content/$id",
        params: { id: c.id },
      });
    }
  }
  for (const q2 of data.inquiries) {
    if (hit(q2.subject, q2.reference, q2.organisation, q2.country, q2.requesterName)) {
      results.push({
        id: q2.id,
        title: `${q2.reference} — ${q2.subject}`,
        type: "Inquiry",
        detail: `${q2.organisation} · ${q2.country}`,
        to: "/admin/inquiries/$id",
        params: { id: q2.id },
      });
    }
  }
  for (const p of data.partners) {
    if (hit(p.name, p.country, p.city, p.themes.join(" "), p.expertise.join(" "))) {
      results.push({ id: p.id, title: p.name, type: "Partner", detail: `${p.type} · ${p.city}, ${p.country}`, to: "/admin/partners/$id", params: { id: p.id } });
    }
  }
  for (const c of data.pipeline) {
    if (hit(c.title, c.countries.join(" "), c.themes.join(" "), c.leadOfficer)) {
      results.push({ id: c.id, title: c.title, type: "Collaboration", detail: `${c.stage} · ${c.countries.join(", ")}`, to: "/admin/collaborations/$id", params: { id: c.id } });
    }
  }
  return results.slice(0, 40);
}

export const publicStoryCount = stories.length;
