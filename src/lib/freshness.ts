/**
 * Freshness model.
 *
 * Freshness is a property of the whole platform, not a page. Nothing here is a
 * separate store of "current" records: every candidate is derived from the
 * canonical editorial data (stories, events, opportunities, collaborations,
 * collections, cultural subjects, people, institutions, places) using the date
 * and status fields those records already carry.
 *
 * Editors influence — but do not have to author — the result through
 * `focusOverrides` below (feature / label / priority / visibility window).
 */
import {
  collections,
  deadlineStatus,
  events,
  eventStatus,
  formatDate,
  formatRange,
  forms,
  getPlace,
  opportunities,
  people,
  stories,
} from "@/data/content";
import { collaborations } from "@/data/collaborations";
import { institutions } from "@/data/institutions";

/** The controlled vocabulary for freshness. No "trending", "hot" or "breaking". */
export const FRESHNESS_KINDS = [
  "in_focus",
  "coming_up",
  "open_now",
  "ongoing",
  "on_view",
  "recently_published",
  "recently_added",
  "around_the_world",
] as const;
export type FreshnessKind = (typeof FRESHNESS_KINDS)[number];

export const FRESHNESS_LABELS: Record<FreshnessKind, string> = {
  in_focus: "In focus",
  coming_up: "Coming up",
  open_now: "Open now",
  ongoing: "Ongoing",
  on_view: "Currently on view",
  recently_published: "Recently published",
  recently_added: "Recently added",
  around_the_world: "Around the world",
};

export interface FreshItem {
  id: string;
  kind: FreshnessKind;
  /** Display label — an editorial override may replace the default. */
  label: string;
  headline: string;
  /** Type-specific metadata: dates, deadline, place, discipline. */
  meta: string;
  href: string;
  /** Source record family, used to keep the mix editorially diverse. */
  family: "story" | "event" | "opportunity" | "collaboration" | "collection" | "profile";
  image?: string;
  /** Higher sorts first. Derived, then adjusted by editorial priority. */
  score: number;
}

/* ---------- editorial overrides (§8) ----------
 * `ref` is the source record id. Absent entries simply mean "let the system
 * decide"; manual selection is never required.
 */
export interface FocusOverride {
  ref: string;
  featured?: boolean;
  priority?: number;
  label?: string;
  startAt?: string;
  endAt?: string;
  hidden?: boolean;
}

export const focusOverrides: FocusOverride[] = [
  { ref: "co-1", featured: true, priority: 100, label: "Featured" },
];

const overrideFor = (ref: string) => focusOverrides.find((o) => o.ref === ref);

const withinWindow = (o: FocusOverride | undefined, now: Date) => {
  if (!o) return true;
  if (o.startAt && new Date(o.startAt + "T00:00:00Z").getTime() > now.getTime()) return false;
  if (o.endAt && new Date(o.endAt + "T23:59:59Z").getTime() < now.getTime()) return false;
  return true;
};

const daysSince = (iso: string, now: Date) =>
  Math.max(0, Math.round((now.getTime() - new Date(iso + "T00:00:00Z").getTime()) / 86_400_000));

/* ---------- derived read models ---------- */

/** Exhibitions and programmes running across today's date. */
export const currentlyOnView = (now = new Date()) =>
  events.filter((e) => eventStatus(e, now) === "On now").sort((a, b) => (a.endDate ?? a.startDate).localeCompare(b.endDate ?? b.startDate));

/** Events and programmes that have not started yet. */
export const comingUpEvents = (now = new Date()) =>
  events.filter((e) => eventStatus(e, now) === "Upcoming").sort((a, b) => a.startDate.localeCompare(b.startDate));

/** opening date passed and deadline not yet reached. */
export const openOpportunities = (now = new Date()) =>
  opportunities
    .map((o) => ({ o, s: deadlineStatus(o.deadline, now) }))
    .filter(({ s }) => s.open)
    .sort((a, b) => a.s.days - b.s.days);

/** Configurable "closing soon" threshold, in days. */
export const CLOSING_SOON_DAYS = 21;

export const ongoingCollaborations = () => collaborations.filter((c) => c.status === "Active");

export const recentlyPublishedStories = () =>
  [...stories].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

/** Profiles most recently added to the canonical registry. */
export const recentlyAddedProfiles = () => [
  ...people.slice(-2).map((p) => ({ kind: "person" as const, record: p })),
  ...forms.slice(-2).map((f) => ({ kind: "form" as const, record: f })),
  ...institutions.slice(-1).map((i) => ({ kind: "institution" as const, record: i })),
];

/* ---------- candidate assembly ---------- */

function candidates(now: Date): FreshItem[] {
  const items: FreshItem[] = [];
  const push = (item: Omit<FreshItem, "label" | "score"> & { score: number; label?: string }) => {
    const o = overrideFor(item.id.split(":")[1] ?? "");
    if (o?.hidden || !withinWindow(o, now)) return;
    items.push({
      ...item,
      label: o?.label ?? FRESHNESS_LABELS[item.kind],
      score: item.score + (o?.priority ?? 0) + (o?.featured ? 60 : 0),
    });
  };

  // Editorially selected theme or collection — the dominant feature candidate.
  collections.forEach((c, i) =>
    push({
      id: `collection:${c.id}`,
      kind: "in_focus",
      headline: c.title,
      meta: `Collection · ${c.storyIds.length} stories`,
      href: `/collections/${c.slug}`,
      family: "collection",
      image: c.image,
      score: 40 - i,
    }),
  );

  currentlyOnView(now).forEach((e, i) => {
    push({
      id: `event:${e.id}`,
      kind: "on_view",
      headline: `${e.title}${eventLocationLabel(e) ? ` — ${eventLocationLabel(e)}` : ""}`,
      meta: [e.type, formatEventDates(e)].filter(Boolean).join(" · "),
      href: `/events/${e.slug}`,
      family: "event",
      ...(e.image ? { image: e.image } : {}),
      score: 70 - i * 2,
    });
  });

  comingUpEvents(now)
    .slice(0, 4)
    .forEach((e, i) => {
      push({
        id: `event:${e.id}`,
        kind: "coming_up",
        headline: `${e.title}${eventLocationLabel(e) ? ` — ${eventLocationLabel(e)}` : ""}`,
        meta: [e.type, formatEventDates(e)].filter(Boolean).join(" · "),
        href: `/events/${e.slug}`,
        family: "event",
        ...(e.image ? { image: e.image } : {}),
        score: 62 - i * 3,
      });
    });

  openOpportunities(now)
    .slice(0, 3)
    .forEach(({ o, s }, i) =>
      push({
        id: `opportunity:${o.id}`,
        kind: "open_now",
        headline: o.title,
        meta: `${o.type} · ${s.label}`,
        href: "/opportunities",
        family: "opportunity",
        score: 58 - i * 3 + (s.days <= CLOSING_SOON_DAYS ? 6 : 0),
      }),
    );

  ongoingCollaborations()
    .slice(0, 3)
    .forEach((c, i) =>
      push({
        id: `collaboration:${c.id}`,
        kind: "ongoing",
        headline: c.title,
        meta: `${c.type} · ${c.countries.join(" × ")} · ${c.years}`,
        href: `/collaborations/${c.slug}`,
        family: "collaboration",
        image: c.image,
        score: 54 - i * 3,
      }),
    );

  recentlyPublishedStories()
    .slice(0, 4)
    .forEach((s, i) =>
      push({
        id: `story:${s.id}`,
        kind: "recently_published",
        headline: s.title,
        meta: `${s.kind} · ${s.readingMinutes} min read · ${formatDate(s.publishedAt)}`,
        href: `/stories/${s.slug}`,
        family: "story",
        image: s.image,
        score: 56 - i * 4 - Math.min(20, Math.floor(daysSince(s.publishedAt, now) / 14)),
      }),
    );

  recentlyAddedProfiles().forEach((p, i) => {
    if (p.kind === "person") {
      push({
        id: `person:${p.record.id}`,
        kind: "recently_added",
        headline: p.record.name,
        meta: `${p.record.entity === "community" ? "Community" : "Profile"} · ${p.record.role}`,
        href: `/people/${p.record.slug}`,
        family: "profile",
        image: p.record.image,
        score: 44 - i * 2,
      });
    } else if (p.kind === "form") {
      push({
        id: `form:${p.record.id}`,
        kind: "recently_added",
        headline: p.record.name,
        meta: `Cultural subject · ${p.record.pillar}`,
        href: `/culture/${p.record.slug}`,
        family: "profile",
        image: p.record.image,
        score: 44 - i * 2,
      });
    } else {
      push({
        id: `institution:${p.record.id}`,
        kind: "recently_added",
        headline: p.record.name,
        meta: `${p.record.type} · ${p.record.city}`,
        href: `/institutions/${p.record.slug}`,
        family: "profile",
        score: 42 - i * 2,
      });
    }
  });

  return items;
}

/**
 * A mixed, ranked and deliberately diverse feed of what is currently relevant.
 * Never returns empty slots: when one family is quiet the ranking simply draws
 * more from the families that are not.
 */
export function getFreshContent({
  limit = 5,
  maxPerFamily = 2,
  now = new Date(),
}: { limit?: number; maxPerFamily?: number; now?: Date } = {}): FreshItem[] {
  const pool = candidates(now).sort((a, b) => b.score - a.score);
  const seen = new Set<string>();
  const perFamily = new Map<string, number>();
  const picked: FreshItem[] = [];

  for (const item of pool) {
    if (picked.length >= limit) break;
    if (seen.has(item.id)) continue;
    const count = perFamily.get(item.family) ?? 0;
    if (count >= maxPerFamily) continue;
    seen.add(item.id);
    perFamily.set(item.family, count + 1);
    picked.push(item);
  }

  // Fallback: if diversity capping left us short, top up from the pool.
  if (picked.length < limit) {
    for (const item of pool) {
      if (picked.length >= limit) break;
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      picked.push(item);
    }
  }

  return picked;
}
