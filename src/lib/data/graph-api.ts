/**
 * Graph API (§44–§46, §108).
 *
 * Direct relationships only: one hop, typed, limited. Related content on a
 * public page is a query against this graph, never a hand-curated list.
 */
import {
  ENTITY_LABEL,
  entities,
  getEntity,
  type CanonicalEntity,
  type CanonicalId,
  type EntityType,
} from "./entities";
import {
  RELATIONSHIP_INVERSE,
  RELATIONSHIP_LABEL,
  relationshipsFrom,
  relationshipsOf,
  relationshipsTo,
  type Relationship,
  type RelationshipType,
} from "./relationships";

export interface GraphEdge {
  relationship: Relationship;
  /** Reading direction from the perspective of the queried entity. */
  direction: "out" | "in";
  label: string;
  entity: CanonicalEntity;
}

export interface NeighbourQuery {
  types?: EntityType[];
  relationshipTypes?: RelationshipType[];
  /** Hard cap — public pages never traverse an unbounded graph. */
  limit?: number;
}

/** One-hop neighbours of a canonical record. */
export const neighbours = (uid: CanonicalId, query: NeighbourQuery = {}): GraphEdge[] => {
  const { types, relationshipTypes, limit = 24 } = query;
  const edges: GraphEdge[] = [];

  for (const r of relationshipsFrom(uid)) {
    const e = getEntity(r.to);
    if (!e) continue;
    edges.push({ relationship: r, direction: "out", label: RELATIONSHIP_LABEL[r.type], entity: e });
  }
  for (const r of relationshipsTo(uid)) {
    const e = getEntity(r.from);
    if (!e) continue;
    edges.push({ relationship: r, direction: "in", label: RELATIONSHIP_INVERSE[r.type], entity: e });
  }

  return edges
    .filter((edge) => (types ? types.includes(edge.entity.type) : true))
    .filter((edge) => (relationshipTypes ? relationshipTypes.includes(edge.relationship.type) : true))
    .slice(0, limit);
};

/** Neighbours grouped by entity type, the shape a canonical record page needs. */
export const neighboursByType = (uid: CanonicalId, limit = 8) => {
  const groups = new Map<EntityType, GraphEdge[]>();
  for (const edge of neighbours(uid, { limit: 500 })) {
    const list = groups.get(edge.entity.type) ?? [];
    if (list.length < limit) list.push(edge);
    groups.set(edge.entity.type, list);
  }
  return [...groups.entries()].map(([type, edges]) => ({
    type,
    label: ENTITY_LABEL[type],
    edges,
  }));
};

/**
 * Related content for a public page: direct connections first, then records
 * that share a cultural subject. Never recursive, always capped.
 */
export const relatedContent = (uid: CanonicalId, limit = 6): CanonicalEntity[] => {
  const direct = neighbours(uid, {
    types: ["story", "event", "opportunity", "collection", "collaboration", "knowledge_resource"],
    limit: 50,
  }).map((e) => e.entity);

  const subjects = neighbours(uid, { types: ["cultural_subject"], limit: 10 }).map((e) => e.entity.uid);
  const sameSubject = subjects.flatMap((s) =>
    neighbours(s, {
      types: ["story", "event", "opportunity", "collaboration"],
      limit: 20,
    }).map((e) => e.entity),
  );

  const out: CanonicalEntity[] = [];
  for (const e of [...direct, ...sameSubject]) {
    if (e.uid === uid || out.some((x) => x.uid === e.uid)) continue;
    out.push(e);
    if (out.length >= limit) break;
  }
  return out;
};

/** The cultural subject network used by the subject page and internal graph view. */
export const subjectNetwork = (uid: CanonicalId) => ({
  people: neighbours(uid, { types: ["person", "community"], limit: 12 }).map((e) => e.entity),
  places: neighbours(uid, { types: ["place"], limit: 12 }).map((e) => e.entity),
  institutions: neighbours(uid, { types: ["institution"], limit: 12 }).map((e) => e.entity),
  events: neighbours(uid, { types: ["event"], limit: 12 }).map((e) => e.entity),
  stories: neighbours(uid, { types: ["story"], limit: 12 }).map((e) => e.entity),
  resources: neighbours(uid, { types: ["knowledge_resource"], limit: 12 }).map((e) => e.entity),
  collaborations: neighbours(uid, { types: ["collaboration"], limit: 12 }).map((e) => e.entity),
});

/** Where a canonical record is used — shown before an edit (§94). */
export interface UsageImpact {
  entity: CanonicalEntity;
  total: number;
  byType: { type: EntityType; label: string; count: number; examples: CanonicalEntity[] }[];
  publicPages: string[];
}

export const entityImpact = (uid: CanonicalId): UsageImpact | undefined => {
  const entity = getEntity(uid);
  if (!entity) return undefined;
  const groups = neighboursByType(uid, 3);
  const all = neighbours(uid, { limit: 1000 });
  return {
    entity,
    total: all.length,
    byType: groups.map((g) => ({
      type: g.type,
      label: g.label,
      count: all.filter((e) => e.entity.type === g.type).length,
      examples: g.edges.map((e) => e.entity),
    })),
    publicPages: [
      ...new Set([
        ...(entity.publicPath ? [entity.publicPath] : []),
        ...all.map((e) => e.entity.publicPath).filter((p): p is string => Boolean(p)),
      ]),
    ].slice(0, 12),
  };
};

/** Full-text-ish entity search over canonical names and aliases (§66–§67). */
export const searchEntities = (query: string, limit = 20) => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const score = (e: CanonicalEntity) => {
    if (e.name.toLowerCase() === q) return 100;
    if (e.aliases.some((a) => a.toLowerCase() === q)) return 90;
    if (e.name.toLowerCase().includes(q)) return 70;
    if (e.aliases.some((a) => a.toLowerCase().includes(q))) return 60;
    if (e.themes.some((t) => t.toLowerCase().includes(q))) return 50;
    if (e.countries.some((c) => c.toLowerCase().includes(q))) return 40;
    if (e.summary.toLowerCase().includes(q)) return 20;
    return 0;
  };
  return entities
    .map((e) => ({ entity: e, score: score(e) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

/** Shared relationships between two records — used by the merge preview (§95). */
export const compareEntities = (a: CanonicalId, b: CanonicalId) => {
  const left = getEntity(a);
  const right = getEntity(b);
  if (!left || !right) return undefined;
  const leftEdges = relationshipsOf(a);
  const rightEdges = relationshipsOf(b);
  const conflicts: string[] = [];
  if (left.type !== right.type) conflicts.push("Different entity types — these records cannot be merged.");
  if (left.slug === right.slug) conflicts.push("Both records claim the same slug.");
  if (left.countries.join() !== right.countries.join()) conflicts.push("Country values differ.");
  return {
    left,
    right,
    leftRelationships: leftEdges.length,
    rightRelationships: rightEdges.length,
    combinedAliases: [...new Set([...left.aliases, ...right.aliases, left.name, right.name])],
    publishedUrls: [left.publicPath, right.publicPath].filter((p): p is string => Boolean(p)),
    conflicts,
  };
};
