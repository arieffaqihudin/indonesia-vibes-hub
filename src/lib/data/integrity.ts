/**
 * Graph integrity and data health (§92–§93).
 *
 * Every check returns records, not a number, so each figure on the Data Health
 * screen leads somewhere actionable.
 */
import { collaborations } from "@/data/collaborations";
import { events, forms, stories } from "@/data/content";
import { placesMissingGeography, emptyCountries } from "./geography";
import {
  entities,
  entitiesOfType,
  getEntity,
  getEntityBySource,
  type CanonicalEntity,
} from "./entities";
import { brokenRelationships, relationships, relationshipsOf } from "./relationships";
import { validateRegistry } from "./schema";

export interface HealthFinding {
  id: string;
  title: string;
  detail: string;
  entity?: CanonicalEntity | undefined;
  path?: string | undefined;
}

const finding = (
  id: string,
  title: string,
  detail: string,
  entity?: CanonicalEntity,
): HealthFinding => ({ id, title, detail, entity, path: entity?.publicPath });

/** Relationships pointing at a record that no longer exists. */
export const brokenReferences = (): HealthFinding[] =>
  brokenRelationships.map((r) =>
    finding(r.id, "Broken relationship", `${r.from} → ${r.type} → ${r.to} references a missing record.`),
  );

/** Canonical records with no relationships at all. */
export const orphanEntities = (): HealthFinding[] =>
  entities
    .filter((e) => e.type !== "country" && relationshipsOf(e.uid).length === 0)
    .map((e) => finding(e.uid, "Orphan record", `${e.name} is not connected to anything yet.`, e));

/** Records whose names collide — reviewed by a human, never merged automatically. */
export interface DuplicateCandidate {
  a: CanonicalEntity;
  b: CanonicalEntity;
  reason: string;
}

const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export const duplicateCandidates = (): DuplicateCandidate[] => {
  const out: DuplicateCandidate[] = [];
  const byName = new Map<string, CanonicalEntity[]>();
  for (const e of entities) {
    for (const name of [e.name, ...e.aliases]) {
      const key = `${e.type}/${normalise(name)}`;
      byName.set(key, [...(byName.get(key) ?? []), e]);
    }
  }
  for (const [key, group] of byName) {
    const unique = [...new Map(group.map((g) => [g.uid, g])).values()];
    for (let i = 0; i < unique.length; i += 1) {
      for (let j = i + 1; j < unique.length; j += 1) {
        out.push({
          a: unique[i]!,
          b: unique[j]!,
          reason: `Both answer to “${key.split("/")[1]}”.`,
        });
      }
    }
  }
  return out;
};

/** Structural expectations that must hold before publication. */
export const structuralIssues = (): HealthFinding[] => {
  const out: HealthFinding[] = [];

  for (const e of events) {
    const entity = getEntityBySource("event", e.id);
    const hasOrganiser = Boolean(e.organiser) || Boolean(e.institutionIds?.length);
    if (!hasOrganiser) out.push(finding(`ev-org-${e.id}`, "Event without organiser", e.title, entity));
    if (e.endDate < e.startDate)
      out.push(finding(`ev-date-${e.id}`, "Event dates out of order", e.title, entity));
  }

  for (const p of placesMissingGeography()) {
    out.push(
      finding(`pl-geo-${p.id}`, "Place without geography", `${p.name} has no usable coordinates or country.`,
        getEntityBySource("place", p.id)),
    );
  }

  for (const c of collaborations) {
    if (!c.indonesianPartnerIds.length && !c.internationalPartners.length)
      out.push(
        finding(`cb-partner-${c.id}`, "Collaboration without partner", c.title,
          getEntityBySource("collaboration", c.id)),
      );
  }

  for (const f of forms) {
    if (!f.sources?.length)
      out.push(
        finding(`cs-src-${f.id}`, "Published subject without a source", f.name,
          getEntityBySource("cultural_subject", f.id)),
      );
  }

  for (const s of stories) {
    if (!s.imageAlt)
      out.push(finding(`st-alt-${s.id}`, "Published media without alt text", s.title, getEntityBySource("story", s.id)));
  }

  for (const c of emptyCountries()) {
    out.push(finding(`co-empty-${c.id}`, "Country with no records", c.name));
  }

  return out;
};

/** Records not reviewed for more than a year. */
export const staleRecords = (today = new Date()): HealthFinding[] => {
  const cutoff = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return entities
    .filter((e) => e.updatedAt && e.updatedAt < cutoff)
    .map((e) => finding(`stale-${e.uid}`, "Not reviewed in over a year", `Last reviewed ${e.updatedAt}.`, e));
};

/** Cultural subjects without an alias — a search-quality signal, not an error. */
export const missingAliases = (): HealthFinding[] =>
  entitiesOfType("cultural_subject")
    .filter((e) => e.aliases.length === 0)
    .map((e) => finding(`alias-${e.uid}`, "Subject without aliases", `${e.name} answers to one name only.`, e));

export interface HealthSection {
  id: string;
  title: string;
  hint: string;
  findings: HealthFinding[];
}

export const dataHealth = (): HealthSection[] => {
  const schemaIssues = validateRegistry().map((i) =>
    finding(`schema-${i.uid}-${i.problem}`, "Schema violation", `${i.name}: ${i.problem}`, getEntity(i.uid)),
  );
  return [
    { id: "schema", title: "Schema violations", hint: "Records that fail canonical validation.", findings: schemaIssues },
    { id: "broken", title: "Broken relationships", hint: "Assertions pointing at missing records.", findings: brokenReferences() },
    { id: "structure", title: "Structural gaps", hint: "Missing organiser, geography, partner or source.", findings: structuralIssues() },
    { id: "orphans", title: "Orphan records", hint: "Canonical records with no connections.", findings: orphanEntities() },
    { id: "stale", title: "Stale records", hint: "Not reviewed in over a year.", findings: staleRecords() },
    { id: "aliases", title: "Search coverage", hint: "Subjects readers may not find under other names.", findings: missingAliases() },
  ];
};

export const graphStats = () => ({
  entities: entities.length,
  relationships: relationships.length,
  types: new Set(entities.map((e) => e.type)).size,
  connectedShare: Math.round(
    (entities.filter((e) => relationshipsOf(e.uid).length > 0).length / Math.max(entities.length, 1)) * 100,
  ),
});
