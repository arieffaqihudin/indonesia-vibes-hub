/**
 * Relationships as first-class data (§41–§43).
 *
 * The editorial arrays carry id lists; this module lifts them into typed,
 * directional relationship records with provenance, so every surface can ask
 * the same questions of the same graph instead of hand-listing related items.
 */
import { collections, events, forms, opportunities, papers, people, places, stories } from "@/data/content";
import { collaborations } from "@/data/collaborations";
import { institutions } from "@/data/institutions";
import { canonicalId, getEntity, type CanonicalId, type EntityType } from "./entities";
import type { ProvenanceSource } from "./enums";

/** Controlled vocabulary — relationship names are never free text (§42). */
export const RELATIONSHIP_TYPES = [
  "practises",
  "originates_in",
  "located_in",
  "held_by",
  "affiliated_with",
  "takes_place_at",
  "organised_by",
  "participates_in",
  "about_subject",
  "features_person",
  "set_in_place",
  "curates",
  "documents",
  "partner_in",
  "offered_by",
  "in_country",
] as const;
export type RelationshipType = (typeof RELATIONSHIP_TYPES)[number];

export const RELATIONSHIP_LABEL: Record<RelationshipType, string> = {
  practises: "practises",
  originates_in: "originates in",
  located_in: "located in",
  held_by: "held by",
  affiliated_with: "affiliated with",
  takes_place_at: "takes place at",
  organised_by: "organised by",
  participates_in: "participates in",
  about_subject: "about",
  features_person: "features",
  set_in_place: "set in",
  curates: "curates",
  documents: "documents",
  partner_in: "partner in",
  offered_by: "offered by",
  in_country: "in country",
};

/** The inverse reading of each relationship, used for reverse traversal. */
export const RELATIONSHIP_INVERSE: Record<RelationshipType, string> = {
  practises: "practised by",
  originates_in: "origin of",
  located_in: "location of",
  held_by: "holds",
  affiliated_with: "affiliated people",
  takes_place_at: "hosts",
  organised_by: "organises",
  participates_in: "has participant",
  about_subject: "covered by",
  features_person: "featured in",
  set_in_place: "setting for",
  curates: "curated in",
  documents: "documented by",
  partner_in: "has partner",
  offered_by: "offers",
  in_country: "has record",
};

export interface Relationship {
  id: string;
  from: CanonicalId;
  to: CanonicalId;
  type: RelationshipType;
  /** Where the assertion came from, so it can be reviewed or withdrawn (§43). */
  provenance: ProvenanceSource;
  note?: string;
}

const rels: Relationship[] = [];
const seen = new Set<string>();

const link = (
  fromType: EntityType,
  fromId: string,
  type: RelationshipType,
  toType: EntityType,
  toId: string,
  provenance: ProvenanceSource = "editorial",
) => {
  if (!fromId || !toId) return;
  const from = canonicalId(fromType, fromId);
  const to = canonicalId(toType, toId);
  const key = `${from}|${type}|${to}`;
  if (seen.has(key)) return; // duplicate relationships are not data
  seen.add(key);
  rels.push({ id: key, from, to, type, provenance });
};

const countryId = (name: string) => name.toLowerCase().replace(/[^a-z]+/g, "-");
const personType = (id: string) =>
  people.find((p) => p.id === id)?.entity === "community" ? ("community" as const) : ("person" as const);

/* cultural subjects */
for (const f of forms) {
  link("cultural_subject", f.id, "originates_in", "place", f.originPlaceId);
}

/* people & communities */
for (const p of people) {
  const t = personType(p.id);
  for (const fid of p.formIds) link(t, p.id, "practises", "cultural_subject", fid);
  if (p.placeId) link(t, p.id, "located_in", "place", p.placeId);
  for (const iid of p.institutionIds ?? []) link(t, p.id, "affiliated_with", "institution", iid);
}

/* institutions */
for (const i of institutions) {
  if (i.placeId) link("institution", i.id, "located_in", "place", i.placeId);
  link("institution", i.id, "in_country", "country", countryId(i.country));
  for (const pid of i.peopleIds) link(personType(pid), pid, "affiliated_with", "institution", i.id);
  for (const fid of i.formIds) link("institution", i.id, "documents", "cultural_subject", fid);
  for (const rid of i.paperIds ?? []) link("knowledge_resource", rid, "held_by", "institution", i.id);
  for (const eid of i.eventIds ?? []) link("event", eid, "organised_by", "institution", i.id);
  for (const oid of i.opportunityIds ?? []) link("opportunity", oid, "offered_by", "institution", i.id);
}

/* places */
for (const pl of places) link("place", pl.id, "in_country", "country", countryId(pl.country));

/* stories */
for (const s of stories) {
  for (const fid of s.formIds) link("story", s.id, "about_subject", "cultural_subject", fid);
  for (const pid of s.peopleIds) link("story", s.id, "features_person", personType(pid), pid);
  for (const plid of s.placeIds) link("story", s.id, "set_in_place", "place", plid);
}

/* events */
for (const e of events) {
  link("event", e.id, "takes_place_at", "place", e.placeId);
  for (const fid of e.formIds) link("event", e.id, "about_subject", "cultural_subject", fid);
  for (const iid of e.institutionIds ?? []) link("event", e.id, "organised_by", "institution", iid);
  for (const pid of e.peopleIds ?? []) link(personType(pid), pid, "participates_in", "event", e.id);
}

/* opportunities */
for (const o of opportunities) {
  for (const iid of o.institutionIds ?? []) link("opportunity", o.id, "offered_by", "institution", iid);
}

/* knowledge resources */
for (const r of papers) {
  for (const pid of r.peopleIds ?? []) link("knowledge_resource", r.id, "features_person", personType(pid), pid);
  for (const iid of r.institutionIds ?? []) link("knowledge_resource", r.id, "held_by", "institution", iid);
}

/* collections */
for (const c of collections) {
  for (const sid of c.storyIds) link("collection", c.id, "curates", "story", sid);
  for (const fid of c.formIds) link("collection", c.id, "about_subject", "cultural_subject", fid);
}

/* collaborations */
for (const c of collaborations) {
  for (const iid of c.indonesianPartnerIds) link("institution", iid, "partner_in", "collaboration", c.id);
  for (const pid of c.peopleIds) link(personType(pid), pid, "partner_in", "collaboration", c.id);
  for (const eid of c.eventIds) link("event", eid, "participates_in", "collaboration", c.id);
  for (const sid of c.storyIds) link("story", sid, "documents", "collaboration", c.id);
  for (const fid of c.formIds) link("collaboration", c.id, "about_subject", "cultural_subject", fid);
  for (const plid of c.placeIds) link("collaboration", c.id, "set_in_place", "place", plid);
  for (const oid of c.opportunityIds ?? []) link("opportunity", oid, "offered_by", "collaboration", c.id);
  for (const country of c.countries) link("collaboration", c.id, "in_country", "country", countryId(country));
}

export const relationships: Relationship[] = rels.filter(
  (r) => Boolean(getEntity(r.from)) && Boolean(getEntity(r.to)),
);

/** Assertions that point at a record which no longer exists (§92). */
export const brokenRelationships: Relationship[] = rels.filter(
  (r) => !getEntity(r.from) || !getEntity(r.to),
);

const outgoing = new Map<CanonicalId, Relationship[]>();
const incoming = new Map<CanonicalId, Relationship[]>();
for (const r of relationships) {
  (outgoing.get(r.from) ?? outgoing.set(r.from, []).get(r.from)!).push(r);
  (incoming.get(r.to) ?? incoming.set(r.to, []).get(r.to)!).push(r);
}

export const relationshipsFrom = (uid: CanonicalId) => outgoing.get(uid) ?? [];
export const relationshipsTo = (uid: CanonicalId) => incoming.get(uid) ?? [];
export const relationshipsOf = (uid: CanonicalId) => [...relationshipsFrom(uid), ...relationshipsTo(uid)];
