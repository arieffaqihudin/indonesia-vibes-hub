/**
 * Canonical entity registry — the "one entity, one record" spine (§4–§8).
 *
 * Every cultural thing in Indonesia Vibes exists exactly once as a canonical
 * record. Editorial arrays in `src/data` remain the storage for the prototype;
 * this module wraps them in a single typed registry with stable identifiers,
 * aliases, geography, taxonomy and ownership, so every surface (public site,
 * contributor workspace, editorial dashboard) reads the same record.
 */
import { collections, events, forms, papers, people, places, stories } from "@/data/content";
import { collaborations } from "@/data/collaborations";
import { institutions } from "@/data/institutions";
import type { ThemeId } from "@/types/content";
import type { PublicationStatus, StewardRole, Visibility } from "./enums";

export const ENTITY_TYPES = [
  "cultural_subject",
  "person",
  "community",
  "institution",
  "place",
  "knowledge_resource",
  "story",
  "event",
  "collection",
  "collaboration",
  "country",
] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

/** Layer 1 = cultural knowledge, layer 2 = editorial & programme, layer 3 = operations. */
export const ENTITY_LAYER: Record<EntityType, 1 | 2 | 3> = {
  cultural_subject: 1,
  person: 1,
  community: 1,
  institution: 1,
  place: 1,
  knowledge_resource: 1,
  country: 1,
  story: 2,
  event: 2,
  collection: 2,
  collaboration: 2,
};

export const ENTITY_LABEL: Record<EntityType, string> = {
  cultural_subject: "Cultural subject",
  person: "Person",
  community: "Community",
  institution: "Institution",
  place: "Place",
  knowledge_resource: "Knowledge resource",
  country: "Country",
  story: "Story",
  event: "Event",
  collection: "Collection",
  collaboration: "Collaboration",
};

/** Short prefixes used to build stable, human-readable canonical ids (§6–§7). */
export const ENTITY_PREFIX: Record<EntityType, string> = {
  cultural_subject: "cs",
  person: "pr",
  community: "cm",
  institution: "in",
  place: "pl",
  knowledge_resource: "kr",
  country: "co",
  story: "st",
  event: "ev",
  collection: "cl",
  collaboration: "cb",
};

/** A canonical identifier: `type:source-id`, stable for the life of the record. */
export type CanonicalId = string;

export const canonicalId = (type: EntityType, sourceId: string): CanonicalId =>
  `${ENTITY_PREFIX[type]}:${sourceId}`;

export const parseCanonicalId = (id: CanonicalId): { prefix: string; sourceId: string } => {
  const [prefix = "", ...rest] = id.split(":");
  return { prefix, sourceId: rest.join(":") };
};

export interface CanonicalEntity {
  /** Stable canonical identifier, never reused, never rewritten. */
  uid: CanonicalId;
  /** Identifier inside the editorial source array. */
  sourceId: string;
  type: EntityType;
  /** Human-readable id: unique active slug within the entity type. */
  slug: string;
  name: string;
  /** Alternate, local and historic names — searched, never duplicated as records. */
  aliases: string[];
  summary: string;
  themes: ThemeId[];
  /** Editorial dimensions are additive; canonical identity and graph edges stay unchanged. */
  topics?: ThemeId[];
  deliveryType?: "Knowledge" | "Semantic" | "Pragmatic";
  contentSource?: "Internal" | "By Curation";
  /** Canonical country names; geography is never free text on the entity. */
  countries: string[];
  placeIds: string[];
  publicationStatus: PublicationStatus;
  visibility: Visibility;
  /** Public URL on the platform, when the record has a public page. */
  publicPath?: string;
  /** Governance: who is accountable for this record (§62, §109). */
  owner: StewardRole;
  updatedAt?: string;
  /** Superseded records redirect to the record that absorbed them (§50). */
  redirectTo?: CanonicalId;
  archived?: boolean;
}

const entity = (e: CanonicalEntity): CanonicalEntity => e;

const placeCountry = (placeId?: string) => {
  const p = places.find((x) => x.id === placeId);
  return p ? [p.country] : [];
};

/* ---------------- layer 1: cultural knowledge ---------------- */

const subjectEntities = forms.map((f) =>
  entity({
    uid: canonicalId("cultural_subject", f.id),
    sourceId: f.id,
    type: "cultural_subject",
    slug: f.slug,
    name: f.name,
    aliases: f.aliases ?? [],
    summary: f.summary,
    themes: f.themes ?? [],
    countries: placeCountry(f.originPlaceId),
    placeIds: f.originPlaceId ? [f.originPlaceId] : [],
    publicationStatus: "published",
    visibility: "public",
    publicPath: f.pillar === "heritage" ? `/understand-indonesia/heritage/${f.slug}` : "/understand-indonesia",
    owner: "Editorial Owner",
    ...(f.lastReviewed ? { updatedAt: f.lastReviewed } : {}),
  }),
);

const personEntities = people.map((p) =>
  entity({
    uid: canonicalId(p.entity === "community" ? "community" : "person", p.id),
    sourceId: p.id,
    type: p.entity === "community" ? "community" : "person",
    slug: p.slug,
    name: p.name,
    aliases: p.localName ? [p.localName] : [],
    summary: p.bio,
    themes: p.themes,
    countries: placeCountry(p.placeId).length ? placeCountry(p.placeId) : ["Indonesia"],
    placeIds: p.placeId ? [p.placeId] : [],
    publicationStatus: "published",
    visibility: "public",
    publicPath: `/people/${p.slug}`,
    owner: "Editorial Owner",
  }),
);

const institutionEntities = institutions.map((i) =>
  entity({
    uid: canonicalId("institution", i.id),
    sourceId: i.id,
    type: "institution",
    slug: i.slug,
    name: i.name,
    aliases: [],
    summary: i.profile,
    themes: i.themes,
    countries: [i.country],
    placeIds: i.placeId ? [i.placeId] : [],
    publicationStatus: "published",
    visibility: "public",
    publicPath: `/institutions/${i.slug}`,
    owner: "Data Steward",
    updatedAt: i.lastReviewed,
  }),
);

const placeEntities = places.map((p) =>
  entity({
    uid: canonicalId("place", p.id),
    sourceId: p.id,
    type: "place",
    slug: p.slug,
    name: p.name,
    aliases: [],
    summary: p.summary,
    themes: p.themes ?? [],
    countries: [p.country],
    placeIds: [p.id],
    publicationStatus: "published",
    visibility: "public",
    publicPath: `/places/${p.slug}`,
    owner: "Data Steward",
    ...(p.visiting?.lastReviewed ? { updatedAt: p.visiting.lastReviewed } : {}),
  }),
);

const resourceEntities = papers.map((r) =>
  entity({
    uid: canonicalId("knowledge_resource", r.id),
    sourceId: r.id,
    type: "knowledge_resource",
    slug: r.id,
    name: r.title,
    aliases: [],
    summary: r.abstract,
    themes: [],
    countries: ["Indonesia"],
    placeIds: [],
    publicationStatus: "published",
    visibility: "public",
    owner: "Editorial Owner",
  }),
);

/* ---------------- layer 2: editorial & programme ---------------- */

const storyEntities = stories.map((s) =>
  entity({
    uid: canonicalId("story", s.id),
    sourceId: s.id,
    type: "story",
    slug: s.slug,
    name: s.title,
    aliases: [],
    summary: s.dek,
    themes: s.topics ?? [],
    topics: s.topics ?? [],
    ...(s.deliveryType ? { deliveryType: s.deliveryType } : {}),
    ...(s.contentSource ? { contentSource: s.contentSource } : {}),
    countries: [...new Set(s.placeIds.flatMap((id) => placeCountry(id)))],
    placeIds: s.placeIds,
    publicationStatus: "published",
    visibility: "public",
    publicPath: `/stories/${s.slug}`,
    owner: "Editorial Owner",
    ...(s.updatedAt ? { updatedAt: s.updatedAt } : { updatedAt: s.publishedAt }),
  }),
);

const eventEntities = events.map((e) =>
  entity({
    uid: canonicalId("event", e.id),
    sourceId: e.id,
    type: "event",
    slug: e.slug,
    name: e.title,
    aliases: [],
    summary: e.summary ?? e.sourceNote ?? "",
    themes: [],
    countries: e.placeId ? placeCountry(e.placeId) : e.location ? [e.location.country] : [],
    placeIds: e.placeId ? [e.placeId] : [],
    publicationStatus: "published",
    visibility: "public",
    publicPath: `/events/${e.slug}`,
    owner: "Editorial Owner",
    ...(e.lastChecked ? { updatedAt: e.lastChecked } : {}),
  }),
);

const collectionEntities = collections.map((c) =>
  entity({
    uid: canonicalId("collection", c.id),
    sourceId: c.id,
    type: "collection",
    slug: c.slug,
    name: c.title,
    aliases: [],
    summary: c.dek,
    themes: [],
    countries: [],
    placeIds: [],
    publicationStatus: "published",
    visibility: "public",
    publicPath: `/understand-indonesia/collections/${c.slug}`,
    owner: "Editorial Owner",
  }),
);

const collaborationEntities = collaborations.map((c) =>
  entity({
    uid: canonicalId("collaboration", c.id),
    sourceId: c.id,
    type: "collaboration",
    slug: c.slug,
    name: c.title,
    aliases: [],
    summary: c.intro,
    themes: c.themes,
    countries: c.countries,
    placeIds: c.placeIds,
    publicationStatus: "published",
    visibility: "public",
    publicPath: `/collaborate/${c.slug}`,
    owner: "Partnership Owner",
  }),
);

/* ---------------- registry ---------------- */

/** Countries are canonical entities, never free-text strings (§14, §70). */
export const countryNames: string[] = [
  ...new Set([
    ...places.map((p) => p.country),
    ...institutions.map((i) => i.country),
    ...collaborations.flatMap((c) => c.countries),
    ...collaborations.flatMap((c) => c.internationalPartners.map((p) => p.country)),
  ]),
].sort();

const countryEntities = countryNames.map((name) =>
  entity({
    uid: canonicalId("country", name.toLowerCase().replace(/[^a-z]+/g, "-")),
    sourceId: name.toLowerCase().replace(/[^a-z]+/g, "-"),
    type: "country",
    slug: name.toLowerCase().replace(/[^a-z]+/g, "-"),
    name,
    aliases: [],
    summary: `Canonical country record used by places, institutions and collaborations.`,
    themes: [],
    countries: [name],
    placeIds: places.filter((p) => p.country === name).map((p) => p.id),
    publicationStatus: "published",
    visibility: "public",
    owner: "Data Steward",
  }),
);

export const entities: CanonicalEntity[] = [
  ...subjectEntities,
  ...personEntities,
  ...institutionEntities,
  ...placeEntities,
  ...resourceEntities,
  ...storyEntities,
  ...eventEntities,
  ...collectionEntities,
  ...collaborationEntities,
  ...countryEntities,
];

const byUid = new Map(entities.map((e) => [e.uid, e]));
const bySourceId = new Map(entities.map((e) => [`${e.type}/${e.sourceId}`, e]));

export const getEntity = (uid: CanonicalId): CanonicalEntity | undefined => {
  const found = byUid.get(uid);
  if (found?.redirectTo) return byUid.get(found.redirectTo);
  return found;
};

export const getEntityBySource = (type: EntityType, sourceId: string) =>
  bySourceId.get(`${type}/${sourceId}`);

export const entitiesOfType = (type: EntityType) => entities.filter((e) => e.type === type);

/** Alias-aware lookup: "Indonesian ensemble music" resolves to the Gamelan record (§9). */
export const findEntityByName = (name: string): CanonicalEntity | undefined => {
  const q = name.trim().toLowerCase();
  return (
    entities.find((e) => e.name.toLowerCase() === q) ??
    entities.find((e) => e.aliases.some((a) => a.toLowerCase() === q))
  );
};

/** Every name a record answers to, canonical first. */
export const entityNames = (e: CanonicalEntity) => [e.name, ...e.aliases];
