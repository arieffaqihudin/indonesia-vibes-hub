/**
 * Schema validation for canonical records (§105).
 *
 * Zod is the single definition of what a valid canonical record looks like.
 * The prototype validates in-memory data; the same schemas can guard an API
 * or an import pipeline unchanged.
 */
import { z } from "zod";
import { ENTITY_TYPES } from "./entities";
import { PUBLICATION_STATUSES, STEWARD_ROLES, VISIBILITIES } from "./enums";
import { RELATIONSHIP_TYPES } from "./relationships";
import { entities } from "./entities";
import { relationships } from "./relationships";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}/, "expected an ISO date");
const slug = z
  .string()
  .min(1)
  .regex(/^[a-z0-9-]+$/, "slugs are lowercase, digits and hyphens only");

export const canonicalIdSchema = z.string().regex(/^[a-z]{2}:[a-z0-9-]+$/i, "expected type:source-id");

export const canonicalEntitySchema = z.object({
  uid: canonicalIdSchema,
  sourceId: z.string().min(1),
  type: z.enum(ENTITY_TYPES),
  slug,
  name: z.string().min(1),
  aliases: z.array(z.string()),
  summary: z.string(),
  themes: z.array(z.string()),
  topics: z.array(z.string()).optional(),
  deliveryType: z.enum(["Knowledge", "Semantic", "Pragmatic"]).optional(),
  contentSource: z.enum(["Internal", "By Curation"]).optional(),
  countries: z.array(z.string()),
  placeIds: z.array(z.string()),
  publicationStatus: z.enum(PUBLICATION_STATUSES),
  visibility: z.enum(VISIBILITIES),
  publicPath: z.string().startsWith("/").optional(),
  owner: z.enum(STEWARD_ROLES),
  updatedAt: isoDate.optional(),
  redirectTo: canonicalIdSchema.optional(),
  archived: z.boolean().optional(),
});

export const relationshipSchema = z.object({
  id: z.string().min(1),
  from: canonicalIdSchema,
  to: canonicalIdSchema,
  type: z.enum(RELATIONSHIP_TYPES),
  provenance: z.enum(["editorial", "contributor", "partner", "import", "derived"]),
  note: z.string().optional(),
});

export const coordinateSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const dateRangeSchema = z
  .object({ startDate: isoDate, endDate: isoDate })
  .refine((v) => v.startDate <= v.endDate, "end date must not precede start date");

export interface ValidationIssue {
  uid: string;
  name: string;
  problem: string;
}

/** Validate everything the registry holds. Integrity failures are never silent. */
export const validateRegistry = (): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];

  for (const e of entities) {
    const result = canonicalEntitySchema.safeParse(e);
    if (!result.success) {
      for (const err of result.error.issues) {
        issues.push({ uid: e.uid, name: e.name, problem: `${err.path.join(".")}: ${err.message}` });
      }
    }
  }

  for (const r of relationships) {
    const result = relationshipSchema.safeParse(r);
    if (!result.success) {
      for (const err of result.error.issues) {
        issues.push({ uid: r.id, name: r.type, problem: `${err.path.join(".")}: ${err.message}` });
      }
    }
  }

  // unique active slug within entity type
  const bySlug = new Map<string, string>();
  for (const e of entities) {
    const key = `${e.type}/${e.slug}`;
    const existing = bySlug.get(key);
    if (existing) {
      issues.push({ uid: e.uid, name: e.name, problem: `duplicate slug within ${e.type} (also ${existing})` });
    }
    bySlug.set(key, e.uid);
  }

  return issues;
};
